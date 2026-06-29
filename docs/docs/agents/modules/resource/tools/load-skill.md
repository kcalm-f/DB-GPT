# 负载技能

## 概述

`load_skill` 通过技能名称和文件路径加载技能的内容，通常是`SKILL.md` 中的指令。

当代理应该遵循打包的工作流程而不是即兴执行整个执行过程时，请使用它。

＃＃ 参数
```json
{
  "skill_name": "skill name",
  "file_path": "skill file path"
}
```
## 它的作用

- 从注册表中解析技能
- 阅读技能说明或提示模板
- 将加载的工作流内容返回给代理

## 何时使用

- 任务与可重复使用的技能相匹配
- 该技能包含精心策划的业务逻辑
- 工作流程应在执行开始之前标准化

## 示例
```json
{
  "skill_name": "financial-report-analyzer",
  "file_path": "skills/financial-report-analyzer/SKILL.md"
}
```
## 注释

- `load_skill` 加载指令；它本身不执行工作流程
- 加载后，代理应遵循技能所需的工具和步骤