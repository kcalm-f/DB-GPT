# 🚀 DB-GPT V0.8.1 — 生产就绪的 AI 数据助手：调度、连接器和长时间运行的代理

V0.8.1延续了V0.8.0人工智能数据助手引入的方向。它将一次性分析转变为面向生产的工作流程，这些工作流程**可调度、可连接、可观察且更易于操作**。

## 简介

DB-GPT V0.8.0将产品体验从“对话式问答”转变为“任务交付”。 V0.8.1重点关注团队在真实环境中持续使用AI数据助手时面临的实际问题：

- 成功的分析是有价值的。如何才能**按计划重新运行**而不每次都重复对话？
- 仅连接到数据库的代理受到限制。它如何**安全地连接到外部系统和业务工具**？
- 复杂的分析通常需要经过许多步骤。它如何**留在上下文窗口中**，同时让用户**看到它在做什么**？
- 生产数据库可以有大型模式。连接器构建、模式索引和向量搜索如何变得**更快、更可靠**？

为了满足这些需求，此版本引入了**计划任务**、**MCP 连接器**和**具有任务计划跟踪的上下文管理**。它还扩展了模型、数据源、矢量存储和缓存生态系统，并包括一组以生产为中心的性能、安全性和兼容性修复程序。

V0.8.1 的核心价值很简单：DB-GPT AI 数据助手从完成一项复杂的分析转变为支持可重复、长期运行、团队就绪的工作流程。

### 主要亮点

- ⏰ **计划任务** — 将已完成的对话保存为重复任务，并按 cron 计划重播代理流程
- 🔌 **MCP 连接器** — 通过模型上下文协议将代理连接到外部工具，并具有内置模板和自定义 MCP 服务器支持
- 🧠 **上下文管理和任务计划跟踪** — 在上下文窗口中保留长时间运行的 ReAct/Data Agent 任务并在前端显示进度
- 🚀 **数据源连接器缓存** — 为昂贵的连接器构建添加 TTL 缓存，在大型模式场景中将热连接器查找时间从大约 63 秒减少到 10 毫秒以下
- 🧱 **生态系统扩展** — 添加 LiteLLM、Qdrant、用于缓存和矢量存储的 Valkey、openGauss、StarRocks 二进制类型、DeepSeek V4 Pro 和 MiniMax-M3
- 🛡️ **安全性和可靠性强化** - 收紧配置文件权限，验证上传的文件名，限制个人技能执行，并提高索引容错能力

## 特点

### ⏰ 计划任务：将成功的分析转化为持续的输出

许多数据分析工作自然会重复出现：每日业务报告、每周风险检查、每月财务摘要或对新数据库快照重复进行的诊断。 V0.8.1 引入了**计划任务**，使成功的分析对话成为可重复的任务。

运行分析一次，将对话保存为任务，DB-GPT 将按 cron 计划重播完整的 ReAct Agent 流程。每次运行都会创建一个新的对话和报告，同时保留执行历史记录以供审核、审查和团队共享。

#### 将对话保存为重复任务

- **一键保存已完成的对话**：将任何已完成的分析对话转变为计划任务。
- **使用灵活的计划**：每小时、每天、每周、每月运行或使用自定义 cron 表达式运行。
- **冻结执行上下文**：原始问题、模型、选定的技能和连接器环境存储在任务快照中，因此每个重播都在相同的条件下运行。
- **暂停和恢复任务**：直接从“计划任务”页面管理任务状态。
<img alt="Save a conversation as a scheduled task" src="/img/schedule/save_schedule_task.png" width="720px" />
#### 运行历史记录和只读重播

每个计划运行都会记录其状态、持续时间、结果摘要和生成的对话 ID。您可以打开任何历史运行并直接从历史记录中重播生成的对话。重播不会触发另一次 LLM 通话，从而使审核成本低廉且可重复。
<img alt="Scheduled task list" src="/img/schedule/schedule_task_list.png" width="720px" />

<img alt="Scheduled task run details" src="/img/schedule/schedule_task_info.png" width="720px" />
### 🔌 MCP 连接器：将代理安全连接到外部工具

V0.8.1 通过 **MCP 连接器** 将 DB-GPT 代理扩展到数据库和本地技能之外。代理现在可以通过模型上下文协议访问外部工具，而用户则可以控制将哪些连接器附加到每个对话。

目前内置的连接器模板包括飞书、钉钉、语雀、GitHub、Notion、Linear、Tavily、DeepWiki。您还可以连接任何支持 SSE 或 Streamable HTTP 的自定义 MCP 服务器。

#### 代理工作流程的外部工具访问

|能力|描述 |
| ---| ---|
|内置模板|涵盖协作、文档、项目管理、搜索和开发人员工具场景 |
|定制 MCP 服务器 |配置端点、传输协议和身份验证方法 |
|每次对话连接器选择 |代理仅接收与当前任务相关的工具，减少噪音和令牌使用 |
|工具透明度|检查每个连接器的工具名称、描述和输入参数 |
|人工确认|来自内置连接器的写入操作在执行前要求确认 |
|加密凭证 |连接器凭据在 DB-GPT 元数据中加密，并在服务重新启动后恢复 |
<img alt="MCP connector list" src="/img/mcp/mcp_list.png" width="720px" />

<img alt="MCP connector tool list" src="/img/mcp/mcp_tool_list.png" width="720px" />
### 🧠 上下文管理和任务计划跟踪：更稳定和透明的长期运行任务

代理数据分析很少是一个简短的对话。它通常涉及多步骤探索、重试和中间工件。 V0.8.1 在 ReAct/Data Agent 流程中添加了上下文管理和任务计划跟踪，使长时间运行的任务更加稳定且更易于理解。

- **多层上下文压缩**可防止长任务超出模型上下文窗口。
- **实时上下文使用事件** 将上下文窗口使用情况实时传输到前端。
- **任务计划跟踪**让代理维护结构化的待办事项列表并随着步骤的进展推送计划更新。
- **更清晰的操作解释**显示每个步骤正在做什么以及为什么需要它。
- **前端任务计划卡和上下文指示器**使执行过程可见。
<img alt="Context usage status and task-plan tracking" src="/img/context/context_task_plan.png" width="720px" />

<img alt="Task-plan todo list in the frontend" src="/img/context/todowrite.png" width="720px" />

<img alt="Context window usage indicator" src="/img/context/context_used.png" width="720px" />
在幕后，“ContextManager”编排由代币预算状态驱动的**渐进式多层压缩**。当使用量超过警告和错误阈值时，压缩变得更加积极：从截断早期观察结果，到丢弃早期轮次，再到使用 LLM 生成结构化摘要。如果模型仍然报告“context_too_long”，则可以使用紧急后备层。

这些改进使 DB-GPT 更适合需要多步骤推理、重试和中间工件管理的复杂数据分析工作流程。

### 🧱 更广泛的模型、数据源和存储生态系统

V0.8.1 扩展了围绕 DB-GPT 的生态系统，使团队更容易重用现有模型、数据库、向量存储和缓存基础设施。

#### LiteLLM 嵌入式 AI 网关

DB-GPT 添加 **LiteLLM** 作为嵌入式代理提供程序，注册为“proxy/litellm”。它不是一个单独的代理服务； DB-GPT 在进程中调用 LiteLLM，为您提供 OpenAI、Anthropic、Vertex AI、Bedrock、Azure、Cohere、Mistral、Groq、Ollama 和其他 LiteLLM 支持的后端的统一入口点。
```toml
[[models.llms]]
name = "anthropic/claude-3-5-sonnet-20241022"
provider = "proxy/litellm"
```
#### 新的矢量搜索和缓存后端

- **Qdrant向量搜索**：支持高性能向量搜索场景。
- **Valkey 矢量存储**：使用 Valkey 和 `valkey-search` 构建矢量检索管道。
- **Valkey缓存存储**：支持LLM响应缓存和嵌入缓存场景。
- **可配置的距离度量**：根据需要配置矢量搜索距离度量。
- **Valkey 矢量客户端`CLIENT SETNAME`**：使 DB-GPT 连接在 Valkey 监控工具中更容易识别。

#### 新数据源和模型支持

- **openGauss datasource**: Adds connection, display, and documentation support.
- **StarRocks `VARBINARY` 和 `BINARY` 类型**：提高 StarRocks 类型兼容性。
- **MiniMax-M3**：将 MiniMax 提供商默认模型升级到 M3，同时保持 MiniMax-M2.7 可用。
- **DeepSeek V4 Pro**：添加模型支持。

### 🚀 大型模式和生产数据库的性能改进

V0.8.1 对大型模式、生产数据库和索引管道进行了重要的性能改进。

- **数据源连接器缓存**：`ConnectorManager.get_connector(db_name)` 现在 TTL 缓存构造的连接器。在具有近 900 个表的生产 SQL Server 数据库中，热连接器查找从大约 **63 秒改进到不到 10 毫秒**。
- **按数据库索引锁**：避免架构索引和刷新操作之间的并发竞争，降低空索引的风险。
- **Per-chunk fault tolerance**: A single failed embedding chunk no longer fails the entire indexing task.
- **MSSQL metadata compatibility**: Uses SQL Server-compatible `INFORMATION_SCHEMA` and extended-property queries for field metadata.
- **Milvus 2.5+ 兼容性**：提高了与较新 Milvus 矢量存储版本的兼容性。

### 🛡️ 安全性和可靠性强化

此版本还包括多项面向生产的安全性和可靠性改进：

- Local profile config files at `~/.dbgpt/configs/<profile>.toml` are written with stricter `0o600` permissions.
- 知识模块 API 添加身份验证依赖项。
- Skill upload filenames, example filenames, and Python upload filenames are validated more strictly.
- Personal Skill script execution is restricted to reduce uncontrolled execution risk.
- Code Interpreter temporary scripts are written with explicit UTF-8 encoding.
- Markdown knowledge uses size chunking by default, making indexing more predictable.
- ReAct 解析器可以更稳健地处理多步输出。
- Chat DB prompts clarify that retrieved table schemas are a top-K subset, improving accuracy for whole-database meta questions.

## 增强功能

- Support Scheduled Tasks and MCP Connectors ([#3095](https://github.com/eosphoros-ai/DB-GPT/pull/3095))
- Add context management, task-plan tracking, and the corresponding frontend UI ([#3053](https://github.com/eosphoros-ai/DB-GPT/pull/3053))
- Add LiteLLM as an embedded AI gateway provider ([#3043](https://github.com/eosphoros-ai/DB-GPT/pull/3043))
- 添加 Qdrant 矢量搜索支持 ([#3034](https://github.com/eosphoros-ai/DB-GPT/pull/3034))
- Add Valkey vector store integration ([#3051](https://github.com/eosphoros-ai/DB-GPT/pull/3051))
- Add Valkey cache integration ([#3057](https://github.com/eosphoros-ai/DB-GPT/pull/3057))
- Add `CLIENT SETNAME` to the Valkey vector client ([#3090](https://github.com/eosphoros-ai/DB-GPT/pull/3090))
- Support configurable vector-search distance metrics ([#3044](https://github.com/eosphoros-ai/DB-GPT/pull/3044))
- 将 TTL 缓存添加到 `ConnectorManager.get_connector` （热缓存从大约 63 秒减少到 10 毫秒以下） ([#3046](https://github.com/eosphoros-ai/DB-GPT/pull/3046))
- 添加 openGauss 数据源支持 ([#3007](https://github.com/eosphoros-ai/DB-GPT/pull/3007))
- 为 StarRocks 实现 `VARBINARY` 和 `BINARY` 类型 ([#3062](https://github.com/eosphoros-ai/DB-GPT/pull/3062))
- Upgrade the MiniMax default model to M3 ([#3093](https://github.com/eosphoros-ai/DB-GPT/pull/3093))
- 将 `~/.dbgpt/configs/<profile>.toml` 文件权限强化为 `0o600` ([#3077](https://github.com/eosphoros-ai/DB-GPT/pull/3077))

## 错误修复

- 修复从 Web UI 创建 DuckDB 数据源的问题 ([#3009](https://github.com/eosphoros-ai/DB-GPT/pull/3009))
- 支持 DeepSeek V4 Pro ([#3079](https://github.com/eosphoros-ai/DB-GPT/pull/3079))
- 默认情况下使用大小分块来获取 Markdown 知识（修复 [#3030](https://github.com/eosphoros-ai/DB-GPT/issues/3030)) ([#3033](https://github.com/eosphoros-ai/DB-GPT/pull/3033))
- 限制个人技能脚本执行（[#3071](https://github.com/eosphoros-ai/DB-GPT/pull/3071)）
- 验证示例文件名（[#3066](https://github.com/eosphoros-ai/DB-GPT/pull/3066)）
- 验证技能上传文件名（[#3065](https://github.com/eosphoros-ai/DB-GPT/pull/3065)）
- 限制Python上传文件名（[#3064](https://github.com/eosphoros-ai/DB-GPT/pull/3064)）
- 处理知识空间 ID 响应（[#3070](https://github.com/eosphoros-ai/DB-GPT/pull/3070)）
- 容忍多步ReAct输出（[#3074](https://github.com/eosphoros-ai/DB-GPT/pull/3074)）
- 告诉 LLM 当前表列表是 top-K 子集，而不是完整的数据库表列表 ([#3045](https://github.com/eosphoros-ai/DB-GPT/pull/3045))
- 展开 `gpts_messages.content` 列以保存更长的代理消息 ([#3055](https://github.com/eosphoros-ai/DB-GPT/pull/3055))
- 使 MilvusStore 兼容 Milvus 2.5+ ([#3042](https://github.com/eosphoros-ai/DB-GPT/pull/3042))
- 添加每块容错和每数据库索引锁（[#3040](https://github.com/eosphoros-ai/DB-GPT/pull/3040)）
- 使用与 SQL Server 兼容的“INFORMATION_SCHEMA”查询覆盖 MSSQL“get_fields()”（[#3039](https://github.com/eosphoros-ai/DB-GPT/pull/3039)）
- 将身份验证依赖项添加到知识模块 API ([#3038](https://github.com/eosphoros-ai/DB-GPT/pull/3038))
- 修复 BranchOperator 错误地跳过共享下游节点（修复 [#2935](https://github.com/eosphoros-ai/DB-GPT/issues/2935)) ([#3035](https://github.com/eosphoros-ai/DB-GPT/pull/3035))
- 尊重配置的 Tongyi 嵌入模型名称（修复 [#3029](https://github.com/eosphoros-ai/DB-GPT/issues/3029)) ([#3032](https://github.com/eosphoros-ai/DB-GPT/pull/3032))
- 编写代码解释器临时脚本时使用显式 UTF-8 编码 ([#3023](https://github.com/eosphoros-ai/DB-GPT/pull/3023))

## 如何升级

本指南适用于从**v0.8.0**到**v0.8.1**的升级。

V0.8.1 元数据更改包括一列更改和三个新表。升级脚本位于“assets/schema/upgrade/v0_8_1/”下：

- `upgrade_to_v0.8.1.sql`：在 v0.8.0 数据库上运行的增量脚本。
- `v0.8.1.sql`：全新安装的完整 V0.8.1 架构。

> 与之前的版本一样，增量脚本以 MySQL 为目标。 SQLite用户在升级前应备份元数据数据库；服务启动时会自动创建新表。

### 准备

#### 备份数据库

:::警告
为避免数据丢失，请在升级前备份元数据数据库。 Choose the method that matches your database type, such as `mysqldump` for MySQL or copying the database file for SQLite.
:::

### 升级数据库

The V0.8.1 upgrade includes one column change and three new metadata tables:

|改变 |描述 |
| ---| ---|
| `gpts_messages.content` -> `长文本` |支持更长的代理消息和执行跟踪。 |
| `连接器实例` |存储 MCP 连接器实例、加密凭据、传输/额外配置和生命周期状态。 |
| `dbgpt_serve_scheduled_task` | Stores scheduled task definitions, cron expressions, and frozen conversation snapshots. |
| `dbgpt_serve_scheduled_run` |存储计划的运行历史记录：状态、摘要、错误消息和输出对话 ID。 |

将增量脚本应用到您的 MySQL 元数据数据库：
```bash
mysql -u <user> -p dbgpt < assets/schema/upgrade/v0_8_1/upgrade_to_v0.8.1.sql
```
### 安装依赖项

根据您的部署方法安装或更新依赖项。对于使用默认设置的源安装：
```bash
uv sync --all-packages
```
根据需要安装可选的附加功能：
```bash
# LiteLLM proxy provider
uv sync --all-packages --extra "proxy_litellm"

# Qdrant vector store
uv sync --all-packages --extra "storage_qdrant"

# Valkey cache / vector store
uv sync --all-packages --extra "storage_valkey"
```
### 重新启动 DB-GPT

使用常用的启动方法重新启动 DB-GPT。启动后，我们建议检查：

- 现有对话正确加载。
- MCP 连接器页面可以列出、激活和测试连接器。
- 可以从已完成的对话中保存计划任务并显示运行历史记录。
- 长时间运行的 ReAct/Data Agent 对话显示任务计划和上下文使用状态。

## 参考文献

- [DB-GPT V0.8.0 发行说明](http://docs.dbgpt.cn/docs/next/changelog/Released_V0.8.0)
- [快速入门](http://docs.dbgpt.cn/docs/overview/)
- [安装指南](http://docs.dbgpt.cn/docs/next/installation/)
- [计划任务](http://docs.dbgpt.cn/docs/next/application/scheduled_tasks)
- [MCP连接器](http://docs.dbgpt.cn/docs/next/application/mcp_connectors)