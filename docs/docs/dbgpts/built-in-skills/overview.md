# 内置技能概述

DB-GPT 在项目级“skills/”目录下附带内置技能。

本小节反映了存储库结构，并为每个内置技能提供了自己的页面。

## 仓库映射
```text
skills/
├── agent-browser/
├── csv-data-analysis/
├── financial-report-analyzer/
├── skill-creator/
└── walmart-sales-analyzer/
```
## 内置技能提供什么

内置技能将可重复的工作流程打包成可重用的单元。

- `SKILL.md` 定义了何时应该使用该技能以及它应该如何工作
- 当需要确定性处理时，“scripts/”包含可执行帮助程序
- `references/` 存储可以按需加载的更深层次的领域指导
- `templates/` 或 `assets/` 提供输出资源，例如 HTML 报告模板

## 当前内置技能

|技能|主要用途 |关键捆绑资源 |
|------|--------------|------------------------|
| `代理浏览器` |代理的浏览器自动化| `SKILL.md` 中的命令驱动工作流程 |
| `csv 数据分析` | CSV/Excel/TSV 分析 | `scripts/csv_analyzer.py`、`templates/report_template.html`、`references/reference.md` |
| `财务报告分析器` |财务报告提取和报告|提取、比率和图表脚本以及财务参考和模板 |
| `技能创造者` |创造和包装新技能| `init_skill.py`、`package_skill.py`，设计参考 |
| `沃尔玛销售分析器` |沃尔玛销售趋势分析和报告|报告生成脚本和 `templates/report_template.html` |

## 如何阅读本节

每个内置技能页面包括：

- 技能的目的
- 何时使用它
- 其核心工作流程
- 与之捆绑的重要脚本、参考资料和模板
- 实际产出预期

## 下一步

打开此“内置技能”部分中的各个页面，查看每个已发布的技能如何映射到存储库的“skills/”文件夹。