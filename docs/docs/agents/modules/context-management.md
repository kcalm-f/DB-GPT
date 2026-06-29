---
title: Context Management
---
#代理上下文管理

代理上下文管理将长期运行的ReAct对话保留在
模型上下文窗口而不会丢失任务的工作状态。它跟踪
在每个模型调用之前使用令牌，发出实时上下文状态事件，并应用
当谈话变得太大时，逐渐加强紧凑性。

# #概述
```text
User task
   |
   v
Agent builds messages
system prompt + task progress + memory + recent ReAct rounds
   |
   v
Count tokens
ProxyTokenizerWrapper.count_token(model_name)
fallback: len(content) // 4
   |
   v
Compute budget
effective_budget = max_context_tokens - reserved_tokens
usage_ratio = used_tokens / effective_budget
   |
   v
Classify state
normal < warning < error < critical < overflow
   |
   +-- normal --------------------------------------+
   |                                                |
   v                                                |
Send messages to LLM                                |
                                                    |
warning or above                                    |
   |                                                |
   v                                                |
Layer 1: Observation micro-compaction               |
truncate old tool observations                      |
   |                                                |
   v                                                |
Recount and emit context.status                     |
   |                                                |
   +-- below warning -------------------------------+
   |                                                |
   v                                                |
Layer 2: Session memory compaction                  |
drop old ReAct rounds, keep recent rounds           |
   |                                                |
   v                                                |
Recount and emit context.status                     |
   |                                                |
   +-- below error ---------------------------------+
   |                                                |
   v                                                |
Layer 3: Full context compression                   |
summarize old rounds with the LLM                   |
   |                                                |
   v                                                |
Recount and emit context.status                     |
   |                                                |
   +----------------------------------------------->+

If the LLM still returns a context overflow error:

LLM context_too_long / maximum context length error
   |
   v
Layer 4: Reactive compaction
keep system prompt + last 2 ReAct rounds
   |
   v
Retry the model call once with the compacted messages
```
工具结果通过单独的快照路径保存：
```text
Action succeeds
   |
   v
Write full operation snapshot
step, action, action_input, observation, thought, timestamp
   |
   v
Store snapshot path on the memory fragment
and in task progress metadata
   |
   v
Rebuild memory for future prompts
Observation: short or compacted observation
[Full detail available at: /path/to/snapshot.json]
   |
   v
Layer 1 / Layer 2 can shrink prompt text
without deleting the original tool result file
```
# #代币预算

上下文管理器在之前计算当前“AgentMessage”列表中的令牌
模型调用。Counting使用“ProxyTokenizerWrapper”与活动
“model_name”。如果令牌生成器无法对内容进行计数， DB-GPT将回退到
每个令牌四个字符的粗略估计。

可用的上下文窗口是：
```text
effective_budget = max_context_tokens - reserved_tokens
```
`reserved_tokens`为模型响应保留空间，因此提示不填充
整个模型窗口。

# #状态和阈值

|状态|默认触发器|含义|
| --- | --- | --- |
| `normal` | `< 70%` |无压实。|
| `warning` | `> = 70%` |开始轻量级压实。|
| `error` | `> = 90%` |需要时使用基于LLM的汇总压缩。|
| `critical` | `> = 95%` |与错误相同，但报告为更紧急的状态。|
| `overflow` | `> = 100%` |提示超出有效预算。|

在每次计数和每次压缩层之后，后端将发出
`context.status`事件：
```json
{
  "type": "context.status",
  "used": 19000,
  "budget": 115904,
  "ratio": 0.164,
  "state": "normal",
  "compact_layer": null
}
```
UI将其呈现为紧凑的上下文窗口指示器。

# #压实层

# # #第1层：观察微压实

第1层是最轻的压实。 它只会缩短旧的「观察：」消息
从工具调用。最近的轮次被完全保留。

规则：

-当使用量达到“warning_threshold”时触发。
-当一个回合的时间超过
  `max_observation_age_rounds`.
-旧观测值被截断为“truncated_observation_max_chars”。
-如果观察结果有快照路径，则压缩后的消息会保留一个指针
  到完整的细节。

这一层既便宜又具有确定性。 它不叫法学硕士。

# # #第2层：会话内存压缩

第2层从提示符中删除旧的完整ReAct轮次。 它依赖于
task-progress摘要已经注入到系统提示符中，因此代理仍然
知道完成了什么。

规则：

-当图层后提示仍等于或高于“warning_threshold”时触发
  1.
-始终保持至少`min_keep_recent_rounds`。
-还保留了足够的最新内容，以满足“min_keep_tokens”。
-丢弃完成旧回合而不是任意单个消息。

该层也是确定性的，不称为LLM。

# # #第3层：全上下文压缩
第3层将旧的对话轮次总结为结构化的上下文摘要
与法学硕士一起，然后保留该摘要加上最近几轮。

规则：

-使用率等于或高于“ERROR_THRESHOLD”时触发。
-保持最后的`min_keep_recent_rounds`不变。
-将较早的消息汇总为一条综合摘要消息。
-摘要提示要求模型保留准确的任务状态、路径、值，
  变量名称、错误和后续步骤。
-如果汇总反复失败，断路器将在
  `max_compact_failures`.

这一层更昂贵，但它保留了更多的语义连续性，而不是
简单地丢弃旧消息。

# # #第4层：反应式压实

第4层是紧急通道。 它不是由正常预算状态触发的
而是在模型调用因上下文溢出而失败时运行
错误，如“context_too_long”、“context_length_exceeded”或
`最大上下文长度`。

规则：

-保留系统消息。
-仅保留最后两轮ReAct。
-依靠系统提示中的任务进度摘要来保留任务
  连续性。
-使用压缩的消息重试模型调用一次。

此层是有意攻击性的，因为它仅在模型之后使用
已经拒绝了提示。
# #工具结果快照

工具观测值可能很大： SQL结果表、生成的代码输出、
解释器日志、文件路径、报告元数据和中间计算值
可能会很快主宰提示。 DB-GPT通过分离来保持提示紧凑
必须保留在模型上下文中的文本中的完整操作详细信息。

当操作成功时，代理会为完整操作写入JSON快照。
快照包括：
- `STEP`
- `action`
- `phase`
- `action_intention`
- “action_reason”
- `THOUGHT`
- `action_input`
- “观察”
- `时间戳`
- `conv_id`

默认情况下，快照写入：
```text
$DBGPT_HOME/workspace/op_snapshots/<conv_id>/
```
如果设置了“AgentContext.output_dir” ， DB-GPT将使用该目录。

每个快照文件都按步骤和操作命名：
```text
step_003_sql_query.json
step_006_code_interpreter.json
```
快照路径附加到内存中的“AgentMemoryFragment” ，并且
记录在任务进度元数据中。 当客服代表稍后重建记忆时
在提示消息中，它附加了一个轻量级引用：
```text
Observation: <observation text>
[Full detail available at: /path/to/step_003_sql_query.json]
```
这在压实过程中很重要：

-第1层可能会截断旧的“Observation:”文本，但会保留快照
  参考（如有）。
-第2层可能会从提示中删除旧的ReAct轮次，但任务进度仍然
  将快照文件名记录为引用。
-第3层总结旧消息，而原始工具结果保持开启状态
  用于精确恢复的磁盘。

换句话说，压缩减少了提示有效载荷；它不必
精确工具输出的唯一位置。

# #配置

可以在应用程序TOML文件中配置代理上下文管理：
```toml
[service.web.agent_context]
# Non-positive values fall back to the default context budget.
max_context_tokens = 120000
reserved_tokens = 4096
warning_threshold = 0.70
error_threshold = 0.90
critical_threshold = 0.95
min_keep_recent_rounds = 3
max_observation_age_rounds = 5
truncated_observation_max_chars = 200
min_keep_tokens = 10000
max_compact_failures = 3
```
为了稳定行为，在需要时在每个LLM部署上设置`context_length`
反映真实提供者窗口的模型元数据：
```toml
[[models.llms]]
name = "Qwen/Qwen2.5-Coder-32B-Instruct"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"
context_length = 32768
```
通过这种设置，切换模型也会切换有效的上下文预算。

## 设计笔记

- 第 1 层和第 2 层是确定性的且成本低廉。他们之前是首选
  任何法学硕士总结。
- 仅当上下文接近故障时，第 3 层才使用 LLM。
- 第 4 层是模型端上下文溢出错误的最后手段重试路径。
- 前端独立于正常聊天接收“context.status”事件

文本，因此UI指标可以在不污染对话的情况下进行更新。

-压缩是渐进的：在每一层之后，DB-GPT重新计数令牌并停止
  如果提示返回到安全状态，则升级。