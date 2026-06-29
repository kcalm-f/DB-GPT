# 使用自定义技能

DB-GPT 支持三种使用自定义技能的方式：使用内置的“技能创建器”从头开始创建、上传 zip 包或通过 GitHub 链接导入。

## 选项 1：使用技能创建器创建

“skill-creator”是 DB-GPT 中的内置元技能，旨在帮助您创建特定于业务的自定义技能。只需在对话中描述您的需求，“技能创造者”就会处理从设计到包装的整个过程。

### 步骤

1. 在DB-GPT聊天界面中选择“技能创建者”技能。
2. 用自然语言描述您想要创建的技能，例如：“创建读取 CSV 文件并生成可视化报告的数据分析技能”。
3. `skill-creator` 将自动：
   - 分析您的需求并规划技能结构
   - 生成`SKILL.md`（包括元数据和执行指令）
   - 创建必要的脚本、参考文档和资产文件
   - 验证并打包成可分发的“.skill”文件

![使用技能创建器创建技能](/img/skill/create_skill.jpg)

有关“技能创建者”的更多详细信息，请参阅[技能创建者文档](./built-in-skills/skill-creator.md)。

## 选项 2：上传 Zip 包

如果您已有打包的技能（“.zip”或“.skill”文件），则可以直接通过 DB-GPT Web UI 上传。

### 步骤

1. 导航到 DB-GPT 中的 **技能** 页面。

![技能列表页面](/img/skill/skill_list.png)

2. 单击上传按钮并选择本地“.zip”或“.skill”文件。

![上传技能](/img/skill/upload_skill.png)

3. 上传后，该技能将显示在列表中并可以在对话中使用。

## 选项 3：通过 GitHub 链接导入

DB-GPT 支持直接从 GitHub 存储库导入技能 - 非常适合社区或团队共享技能。

### 步骤

1. 导航到 DB-GPT 中的 **技能** 页面。
2. 单击 GitHub 导入按钮并粘贴技能的存储库 URL。

![从 GitHub 导入技能](/img/skill/import_github_skill_.png)

3. 系统自动提取存储库内容并完成导入。导入后该技能即可使用。

## 相关阅读

- [skill-creator](./built-in-skills/skill-creator.md) — 了解技能创建器的全部功能和资源
- [技能概述](./introduction.md) — 了解技能定义、结构及其工作原理