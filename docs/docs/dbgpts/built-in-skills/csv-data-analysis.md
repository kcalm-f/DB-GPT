# csv 数据分析

## 概述

“csv-data-analysis”是针对 CSV、Excel 和 TSV 文件的内置深度分析技能。

它结合了统计提取、异常发现、图表就绪结构化数据和 HTML 报告生成。

## 仓库路径
```text
skills/csv-data-analysis/
├── SKILL.md
├── scripts/
│   └── csv_analyzer.py
├── references/
│   └── reference.md
└── templates/
    └── report_template.html
```
## 何时使用

- 分析上传的 CSV 文件
- 分析 Excel 工作簿
- 计算统计数据并检测异常
- 生成精美的交互式分析报告

## 核心工作流程

1. 使用“execute_skill_script_file”运行“scripts/csv_analyzer.py”。
2. 读取返回的统计摘要。
3. 将“html_interpreter”与“csv-data-analysis/templates/report_template.html”结合使用。
4. 仅填写所需的文本占位符。
5.让后端自动注入图表标记数据。

## 重要资源

|资源 |目的|
|---|---|
| `scripts/csv_analyzer.py` |提取统计数据、质量信号和图表标记数据 |
| `references/reference.md` |技能补充使用指南 |
| `模板/report_template.html` |最终交互式报告模板 |

## 输出期望

该技能旨在生成包含以下内容的报告：

- 执行摘要
- 数据质量审查
- 分布分析
- 相关性分析
- 分类和结构分析
- 异常概述
- 结论和建议

## 注释

该模板是技能合同的一部分。代理应使用捆绑的 HTML 模板，而不是手写报告呈​​现逻辑。