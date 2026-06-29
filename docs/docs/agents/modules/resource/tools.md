# 内置工具

DB-GPT 在 **代理数据 API** 中提供了一小组内置工具。

这些工具是以下功能的核心执行层：

- 加载可重复使用的技能
- 运行Python分析
- 执行shell命令
- 查询结构化数据
- 呈现 HTML 报告

Source of truth:

- `packages/dbgpt-app/src/dbgpt_app/openapi/api_v1/agentic_data_api.py`

## 内置工具

- [load_skill](./tools/load-skill.md)
- [code_interpreter](./tools/code-interpreter.md)
- [shell_interpreter](./tools/shell-interpreter.md)
- [sql_query](./tools/sql-query.md)
- [html_interpreter](./tools/html-interpreter.md)

## 推荐的执行顺序

### 技能驱动的工作流程

1.`加载技能`
2. `sql_query` 或 `code_interpreter`
3. 最终交付的`html_interpreter`

### 结构化数据工作流程

1. `sql_query`
2. `code_interpreter`
3.`html_解释器`

### Shell 辅助工作流程

1.`shell_解释器`
2.`代码解释器`
3. `html_interpreter` 如果必须渲染结果

## 工具选择指南

|工具|用它来 | Avoid using it for |
|------|------------------------|--------------------|
| `加载技能` |加载技能说明和工作流程定义 |运行代码或 shell 命令 |
| `code_interpreter` | Python 分析、计算、图表、数据框架工作 | Shell 命令或最终 HTML 渲染 |
| `shell_interpreter` | CLI命令和环境检查| Python分析或最终报告渲染|
| `sql_query` |只读 SQL 探索 |写入、架构更改、破坏性 SQL |
| `html_interpreter` |最终 HTML 页面/报告渲染 |计算或 shell 执行 |