# DB-GPT V0.8.0 — 范式转变：AI + 数据驱动的分析体验

从“对话式问答”到“任务交付”的范式转变——从被动回答到自主分析，探索真正的代理生产力。

## 简介

DB-GPT V0.8.0引入了一个自驱动的AI数据助手，可以自主处理整个分析管道：

🎯业务目标→🧠任务分解→🧩技能调用→💻代码生成（SQL/Python）→🛡️沙箱执行→📊图表生成→📝报告交付

您不再需要知道您的数据位于哪个表中，也不需要编写Python脚本来进行中间数据清理。只需陈述您的业务目标，**DB-GPT AI 数据助手**就会处理好一切。

### 主要亮点

- 🌟 **自主数据分析** — 全新的自主数据分析体验，通过技能编排人工智能驱动的分析
- 🤖 **代理技能** — 支持代理技能，实现更强大、更灵活的代理能力
- 📊 **自主 SQL 生成** — AI 代理现在可以自主编写 SQL 查询以进行数据分析
- 💻 **自主代码执行** — AI 代理可以自动生成并执行 Python 代码以执行数据分析任务
- 🛡️ **沙盒环境** — 用于执行不受信任代码的安全、隔离的沙盒环境
- 💬 **对话共享和重播** — 不仅可以查看最终完善的 HTML 报告，还可以重播整个推理过程
- 🚀 **一键安装脚本** — 全新简化的安装脚本，可让 DB-GPT 比以往更快地启动和运行

## 特点

### ✨ 代理数据分析引擎

DB-GPT AI 数据助手现在可以围绕您的分析目标自主编排整个执行管道，超越传统单轮对话的限制，提供全新的自主数据分析体验：

- **多源数据集成**：无缝连接关系数据库、CSV/Excel文件、数据仓库、知识库、文档等。
- **自主推理探索**：对于复杂问题，AI数据助手自动分析数据库模式或数据文件，规划多步执行策略。
- **执行能力**：自主生成并执行SQL / Python代码。
- **开箱即用的体验**：全新设计的欢迎页面，包含丰富的分析示例，将新用户的学习曲线降低到接近于零。

#### CSV/Excel 自主数据分析

一键上传本地电子表格文件，AI自动理解数据结构，自主进行数据清洗、多维计算、图表可视化，让日常报表处理变得更加简单。
<img src="/img/agentic_data/csv_data_analysis.jpg" width="720px" />
#### 智能数据库洞察和分析报告

该引擎基于全新的Agentic架构，自主执行数据诊断、特征提取和多维度分析，生成具有精美图表和深刻洞察的专用分析报告，让数据价值一目了然。
<img src="/img/agentic_data/agentic_db_data.jpg" width="720px" />
#### 深度财务报告分析

专为金融场景打造，精准提取收入、利润等核心指标。自动进行同比/环比计算和趋势预测，一键生成专业的财务健康诊断报告。
<img src="/img/skill/financial_report_analysis_skill.jpg" width="720px" />
#### 自主 SQL 生成和代码执行

该系统由先进的大型语言模型提供支持，不仅可以准确地将自然语言转换为复杂的 SQL 查询，还支持在安全沙箱中自主执行 Python 代码，甚至可以处理最苛刻的计算要求。
<img src="/img/agentic_data/agentic_sql_query.png" width="720px" />

<img src="/img/agentic_data/agentic_gen_code.png" width="720px" />
### 🤖 代理技能生态系统

LLM决定了智力基线，但生态系统的可扩展性决定了业务天花板。不同的业务场景需要截然不同的分析方法。 V0.8.0 正式引入 **Agent Skill** 系统 - 一种将团队专业知识编码为可重用资产的新方法：

- 📦 **自定义技能打包**：将您独特的数据清理逻辑、业务分析模型等封装到独立的技能中 - 编写一次，在整个团队中重复使用。
- 🔗 **一键 GitHub 导入**：直接从社区或企业私有存储库导入高质量技能，打破信息孤岛。
- 📊 **内置技能**：附带 CSV/Excel 深度分析技能、财务报告分析技能、代理浏览器技能等。使用技能创建器一键创建特定于业务的技能。
<img src="/img/skill/skill_list.png" width="720px" />
### 🛡️ 沙箱安全执行环境

赋予人工智能执行代码的能力通常会带来系统级风险。为了解决这个问题，我们引入了隔离的**沙箱**：

- 🛡️ **隔离沙箱执行**：由代理生成的所有未经手动审核的 shell 代码都在隔离容器中运行。支持严格的资源阈值限制和执行超时控制 - 保护主机系统，同时平衡代理执行能力与企业级数据安全性。
- ⚙️ **资源配置**：会话级沙箱资源限制和执行超时保证，使分析工件更具可重现性和可审计性。
<img src="/img/agentic_data/sanbox_running.png" width="720px" />
### 💬 协作与产品体验升级

优秀的工具需要流畅地流动，将分析报告和流程从“个人使用”转变为“团队重用”：

- 💬 **对话共享和执行重播**：一键生成共享链接。您的团队成员不仅可以查看最终完善的 HTML 报告，还可以重播 Agent 思考和推理过程的每一步 - 使回顾和知识共享变得更加简单。
- 📝 **对话任务列表**：随时搜索历史对话记录，方便查看和记录。
- 🔗 **原生应用和代理模式**：保留原生应用、代理、AWEL 等功能，支持多样化的产品增强和功能使用。
<img src="/img/agentic_data/agentic_playback.jpg" width="720px" />
### 🚀 一键设置脚本

我们提供了多个新的简化安装脚本，以使 DB-GPT 更快地启动和运行。

**选项 1：通过 PyPI 安装**
```bash
# Step 1: Install dbgpt-app
pip install dbgpt-app

# Step 2: Start DB-GPT
dbgpt start
```
**选项 2：通过 Shell 脚本安装**
```bash
# Using OpenAI as an example, quickly initialize the environment
curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh \
  | OPENAI_API_KEY=sk-xxx bash -s -- --profile openai

# Start DB-GPT
cd ~/.dbgpt/DB-GPT && uv run dbgpt start webserver --config ~/.dbgpt/configs/<profile>.toml
```
**选项 3：从源安装（与以前的版本相同）**
```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"

uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
🚀 打开浏览器并访问 [http://localhost:5670](http://localhost:5670)

详细安装说明请参见【安装指南】(http://docs.dbgpt.cn/docs/next/installation/)。

### 📖 文档大修并支持多语言

官方文档已全面改版，现已正式支持多种语言！全新的UI设计、更清晰的目录结构、一键语言切换，带来更好的阅读和开发体验。

👉 【浏览新文档】(http://docs.dbgpt.cn/docs/next/overview/)

## 其他改进

- 添加 MiniMax Provider 支持 ([#2989](https://github.com/eosphoros-ai/DB-GPT/pull/2989))
- 修复 React 解析器对 vis-thinking 块的处理 ([#2996](https://github.com/eosphoros-ai/DB-GPT/pull/2996))
- 自述文件和文档更新 ([#2991](https://github.com/eosphoros-ai/DB-GPT/pull/2991))

## 如何升级

[升级到v0.8.0](../upgrade/v0.8.0.md)

## 致谢

### 🎉 新贡献者

V0.8.0 欢迎 **2 位新贡献者**：

- @octo-补丁
- @LXW2019124

🔥🔥 感谢我们所有的贡献者使此版本成为可能！

@Aries-ckt、@Copilot、@LXW2019124、@chenliang15405、@copilot-swe-agent、@fangyinc 和 @octo-patch

## 参考

- [快速入门](http://docs.dbgpt.cn/docs/overview/)
- [Docker快速部署](http://docs.dbgpt.cn/docs/next/installation/docker/)