# 工具概述

DB-GPT 附带一小组内置工具，为 **代理数据 API** 提供支持。这些工具是数据分析、技能驱动的工作流程、SQL 探索、shell 访问和 HTML 报告交付的默认执行界面。

目前的真相来源在于：

- `packages/dbgpt-app/src/dbgpt_app/openapi/api_v1/agentic_data_api.py`

## 内置工具

核心内置工具有：

- `加载技能`
- `代码解释器`
-`shell_解释器`
- `sql_query`
- `html_interpreter`

它们作为代理工具公开，并被代理数据工作流程用来从推理→执行→呈现。

## 工具选择指南

|工具|用它来 |请勿将其用于 |
|------|------------|--------------------|
| `加载技能` |加载技能说明和工作流程 |运行代码或 shell 命令 |
| `code_interpreter` | Python 分析、图表、数据框逻辑、计算 | Shell 命令或最终 HTML 渲染 |
| `shell_interpreter` | Bash / CLI 命令，例如 `ls`、`grep`、`curl`、`git`、`pip` |当技能另有说明时，Python 分析或特定于技能的脚本执行 |
| `sql_query` |针对所选数据源的只读 SQL |任何写入/更新/删除架构更改 |
| `html_interpreter` |最终 HTML 页面/报告渲染 |通用 Python 计算或 shell 执行 |

## 典型执行流程

对于大多数代理数据任务，模式是：

1. 当任务匹配可重用技能时使用“load_skill”。
2. 使用“sql_query”检查结构化数据。
3. 使用“code_interpreter”进行Python分析、图表生成和数据整形。
4. 仅将 `shell_interpreter` 用于真正的 shell / CLI 工作。
5. 使用“html_interpreter”作为报告或网页的最终呈现步骤。

## 重要规则

### 1.`html_interpreter`是最终的呈现工具

当用户请求：

- HTML 报告
- 一个网页
- 交互式报告
- 渲染的分析成果

最后的渲染步骤应该通过“html_interpreter”。

### 2. `sql_query` 是只读的

`sql_query` 仅支持安全查询访问。它是为“SELECT”式探索而设计的，而不是数据突变。

### 3. `code_interpreter` 调用是独立的

每个“code_interpreter”调用独立运行。变量在调用之间不会持续存在，因此每个片段都必须包含自己的导入、加载逻辑和输出语句。

### 4. `shell_interpreter` 仅适用于 shell 任务

将 `shell_interpreter` 用于 CLI 工作流程。如果某项技能特别需要其他执行路径，请按照技能说明进行操作。

## 下一步

各个内置工具的详细含义、参数、示例和使用模式请参见[工具资源](../modules/resource/tools.md)。