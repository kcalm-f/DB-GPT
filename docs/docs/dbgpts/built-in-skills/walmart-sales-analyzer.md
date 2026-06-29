# 沃尔玛销售分析器

## 概述

“walmart-sales-analyzer”是沃尔玛销售数据集的内置分析技能。

它重点关注每周销售额和失业率之间的趋势，然后将调查结果打包成面向企业的 HTML 报告。

## 仓库路径
```text
skills/walmart-sales-analyzer/
├── SKILL.md
├── scripts/
│   ├── generate_html_report.py
│   ├── generate_correlation_heatmap.py
│   ├── generate_sales_unemployment_scatter.py
│   ├── generate_time_series_trend.py
│   ├── generate_store_avg_comparison.py
│   └── font_setup.py
└── templates/
    └── report_template.html
```
## 何时使用

- 分析沃尔玛销售 CSV 数据
- 探索销售与失业的关系
- 生成比较图表和趋势
- 呈现精美的业务 HTML 报告

## 核心工作流程

1. 验证上传的文件是否包含 Walmart 销售数据。
2. 运行`generate_html_report.py`或相关图表脚本。
3. 将分析文本和标题传递到`html_interpreter`。
4. 使用捆绑的模板呈现最终报告。

## 重要资源

|资源 |目的|
|---|---|
| `scripts/generate_html_report.py` |端到端报告生成入口点|
| `scripts/generate_correlation_heatmap.py` |相关分析图|
| `scripts/generate_sales_unemployment_scatter.py` |销售与失业率回归图表|
| `脚本/generate_time_series_trend.py` |店铺趋势追踪 |
| `scripts/generate_store_avg_comparison.py` |平均商店比较 |
| `模板/report_template.html` |最终响应式报告模板 |

## 输出期望

该技能强调：

- 视觉趋势解释
- 商务口译
- 区域和商店比较
- 执行摘要和建议