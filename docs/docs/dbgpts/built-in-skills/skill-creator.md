# 技能创造者

## 概述

“技能创建者”是用于设计、搭建、验证和打包新技能的内置元技能。

它是该存储库中关于如何构建技能的规范参考。

## 仓库路径
```text
skills/skill-creator/
├── SKILL.md
├── scripts/
│   ├── init_skill.py
│   ├── package_skill.py
│   └── quick_validate.py
├── references/
│   ├── workflows.md
│   └── output-patterns.md
└── LICENSE.txt
```
## 何时使用

- 创造新技能
- 提高现有技能
- 决定什么属于`SKILL.md`、`scripts/`、`references/` 和`assets/`
- 验证并打包可分发的“.skill”文件

## 它所教授的核心工作流程

1. 了解目标用例。
2. 规划可重用脚本、参考和资产。
3. 初始化技能脚手架。
4、落实并细化捆绑资源。
5. 写入或收紧`SKILL.md`。
6. 验证并打包最终技能。

## 重要资源

|资源 |目的|
|---|---|
| `scripts/init_skill.py` |创建新的技能支架 |
| `scripts/package_skill.py` |将技能打包成可分发的工件 |
| `scripts/quick_validate.py` |快速验证技能结构和质量 |
| `references/workflows.md` |多步骤技能工作流程设计指南|
| `references/output-patterns.md` |输出格式和质量模式指南 |

## 为什么这很重要

此内置技能定义了在 DB-GPT 中创作自定义技能和未来内置技能的最佳实践模型。