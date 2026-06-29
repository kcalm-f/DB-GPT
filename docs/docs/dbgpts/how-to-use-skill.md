# 如何使用技能

## 基本使用流程

在实践中，技能的使用通常遵循以下模式：

1. 确定适合任务的技能。
2.加载技能说明。
3. 遵循技能定义的工作流程。
4. 使用所需的内置工具。
5. 返回最终结果或呈现最终报告。

## 常用工具流程

根据技能的不同，执行路径通常如下所示：

- `load_skill` → 加载技能指令
- `sql_query` → 如果需要检索结构化数据
- `code_interpreter` → 计算指标、转换数据、生成图表
- `shell_interpreter` → 在需要时运行 shell 命令
- `html_interpreter` → 渲染最终的 HTML 报告或页面

## 示例场景

### 财务报告分析

代理人可以：

1.加载财务报告技巧
2.执行所需的数据提取和分析步骤
3. 生成图表和指标
4.使用`html_interpreter`渲染最终报告

![财务报告分析技巧示例](/img/skill/use_financial_report_analysis_skill.png)

### CSV/Excel 分析

代理人可以：

1.加载数据分析技能
2.检查上传的文件
3.使用Python分析计算指标并可视化结果
4. 如果需要，将输出呈现为报告

![CSV数据分析技能示例](/img/skill/use_csv_data_skill.png)

## 良好实践

- 当工作流程应该可重复时使用技巧
- 严格遵循技能说明
- 更喜欢技能所需的工具而不是临时替代品
- 当技能生成网页或报告时，使用“html_interpreter”进行最终报告渲染

## 相关阅读

- [dbgpts简介](./introduction.md)
- [工具概述](../agents/introduction/tools.md)
- [内置工具](../agents/modules/resource/tools.md)