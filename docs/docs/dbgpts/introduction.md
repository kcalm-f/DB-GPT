# 技能概览

> 此页面上的技能定义改编自[代理技能](https://agentskills.io/what-are-skills)描述，该描述将技能构建为轻量级、独立的功能包，代理可以根据需要发现、加载和应用。

## 什么是技能？

在 DB-GPT 中，技能是一个可重用的功能包，它为代理提供了解决任务的结构化方法。

技能不是仅仅依赖于自由形式的推理，而是为特定类型的工作提供了稳定的执行模式。
<img
src="/img/skill/skill_list.png"
  alt="DB-GPT 技能概述"
  类名=“展示英雄形象”
/>


## Skill definition

Adapted from the Agent Skills description, a skill can be understood as:

- a **lightweight extension format** for giving agents specialized knowledge and workflows
- a **package of know-how**, not just facts, APIs, or prompts
- a **progressive-disclosure unit** that can be discovered first and fully loaded only when needed
- a **self-contained bundle** of instructions, scripts, templates, and reference files
- a way to make agent behavior more **consistent, repeatable, and domain-aware**

In DB-GPT terms, a skill is not just “something the model knows.” It is a packaged workflow that helps the agent decide:

- 它正在解决什么问题
- 应该使用什么工具
- 步骤应遵循什么顺序
- 应该产生什么输出
- 它应该遵守什么约束

## 技能通常包含哪些内容

DB-GPT 技能包通常包括：

- a name
- `SKILL.md` 中的说明
- optional scripts
- optional templates
- 可选的静态资源或示例

At its core, a skill is a folder containing a `SKILL.md` file. This file includes metadata and instructions that tell an agent how to perform a specific task. Skills can also bundle scripts, templates, and reference materials.
```text
my-skill/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation loaded as needed
└── assets/           # Optional: templates, output resources, static files
```
## 技能剖析

遵循 DB-GPT 自己的技能创建者指南所使用的结构，技能被组织为一个小型的独立包：

|部分|必填|目的|
|------|----------|---------|
| `技能.md` |是的 |定义技能的身份和说明 |
| `脚本/` |没有 |存储可执行代码，例如 Python 或 shell 帮助程序 |
| `参考文献/` |没有 |存储仅在需要时才可以加载到上下文中的文档 |
| `资产/` |没有 |存储模板、字体、图标、样板文件或其他输出资源 |

### `技能.md`

`SKILL.md` 是技能的入口点。它通常包含：

- 元数据，例如“名称”和“描述”
- 代理应遵循的工作流程说明
- 关于何时阅读其他参考资料或使用捆绑资源的指南

### `脚本/`

使用“scripts/”作为可执行帮助程序，例如：

- Python 数据处理实用程序
- 外壳脚本
- 报告生成助手
- 技能使用的自动化代码

### `参考文献/`

使用“references/”来支持不应始终存在于“SKILL.md”中的知识，例如：

- API文档
- 业务逻辑参考
- 模式
- 工作流程指南
- 政策或领域文件

这使得“SKILL.md”更小，同时在任务需要时仍然可以提供更深入的上下文。

### `资产/`

对于支持输出而不是推理过程的文件使用“assets/”，例如：

- HTML 模板
- 图标和标志
- 字体
- 样板前端文件
- 报告资源

## 为什么技能很重要

技能在以下情况下很有用：

- 工作流程应该标准化
- 该任务需要特定领域的推理
- 报告或分析应遵循已知的模式
- 代理应该使用精心策划的指令，而不是即兴创作一切

## 技能如何发挥作用

常见的执行模式是：

1. 代理识别任务与技能相匹配。
2.技能指令加载。
3. 座席遵循技能定义的工作流程。
4. 执行所需的工具。
5. 返回最终答案、报告或页面。

## 技能和内置工具

技能通常将内置执行工具编排在一起：

- `load_skill` → 加载技能指令
- `sql_query` → 如果需要检索结构化数据
- `code_interpreter` → 计算指标、转换数据并生成图表
- `shell_interpreter` → 在需要时运行 shell 命令
- `html_interpreter` → 渲染最终报告或网页

## 实际例子

### 财务报告分析

财务报告技能可以定义：

- 如何检查上传的报告
- 如何计算指标和比较周期
- 如何生成图表和摘要
- 如何呈现最终的 HTML 报告

### CSV/Excel 分析

数据分析技能可以定义：

- 如何检查数据集
- 如何计算核心指标
- 如何可视化输出
- 如何将结果转化为可重复使用的报告

## 良好实践

- 当工作流程应该可重复时使用技巧
- 严格遵循技能说明
- 更喜欢技能所需的工具而不是临时替代品
- 当技能生成网页或报告时，使用“html_interpreter”进行最终报告渲染

## 下一步

具体操作流程请参见【技能使用方法】(./how-to-use-skill.md)。