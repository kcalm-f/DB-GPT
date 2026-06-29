# 财务报告分析器

## 概述

“财报分析器”是对上市公司年报、季报等财务报告进行深度分析的内置技能。

它提取结构化财务数据、计算比率、生成图表并呈现可立即报告的财务分析页面。

## 仓库路径
```text
skills/financial-report-analyzer/
├── SKILL.md
├── scripts/
│   ├── extract_financials.py
│   ├── calculate_ratios.py
│   ├── generate_charts.py
│   └── fill_template.py
├── references/
│   ├── analysis_framework.md
│   └── financial_metrics.md
└── templates/
    ├── report_template.html
    └── report_template.md
```
## 何时使用

- 分析年度或季度报告
- 提取核心财务指标
- 计算盈利能力和偿付能力指标
- 生成财务图表
- 制作专业的 HTML 财务报告

## 核心工作流程

1. 运行“extract_financials.py”来构建源数据。
2. 运行“calculate_ratios.py”计算财务指标。
3. 运行“generate_charts.py”以创建报告视觉效果。
4. 写出该技能所需的叙述分析部分。
5. 使用“html_interpreter”和捆绑模板渲染最终输出。

## 重要资源

|资源 |目的|
|---|---|
| `scripts/extract_financials.py` |从报告文件中提取核心财务价值 |
| `scripts/calculate_ratios.py` |计算模板的关键比率字段 |
| `脚本/generate_charts.py` |生成报告中使用的图表资源 |
| `references/financial_metrics.md` |定义财务指标和公式 |
| `references/analysis_framework.md` |定义分析结构和解释逻辑 |
| `模板/report_template.html` |最终 HTML 交付模板 |

## 输出期望

该技能针对以下方面的结构化报告进行了优化：

- 盈利能力
- 偿付能力和风险
- 运营效率
- 现金流和盈利质量
- 优势和风险
- 总体评估