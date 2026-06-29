---
sidebar_position: 0
title: Web UI Overview
summary: "What is available in the DB-GPT Web UI and where each main feature lives"
read_when:
  - You already started DB-GPT and want to know what to click first
  - You want a quick map of chat, knowledge, dashboard, and app screens
---
# 网页用户界面概述

DB-GPT 附带一个 Web 界面，位于 **[http://localhost:5670](http://localhost:5670)**。

## 主要领域

- [聊天](/docs/getting-started/web-ui/chat) — 普通聊天、数据聊天、Excel 聊天、知识聊天
- [知识库](/docs/getting-started/web-ui/knowledge-base) — 上传文件并构建 RAG 数据集
- [Dashboard](/docs/getting-started/web-ui/dashboard) — 从自然语言生成图表和报告
- [应用程序管理](/docs/getting-started/web-ui/app-management) — 创建和管理 DB-GPT 应用程序

## 特征图

|特色 |描述 |部分|
|---|---|---|
| **聊天** |与法学硕士的多轮对话| [聊天](/docs/getting-started/web-ui/chat) |
| **聊天数据** |连接数据库的自然语言查询 (Text2SQL) | [聊天](/docs/getting-started/web-ui/chat) |
| **聊天 Excel** |用自然语言上传和查询Excel文件| [聊天](/docs/getting-started/web-ui/chat) |
| **聊天知识** |关于您上传的文档的 RAG 对话 | [知识库](/docs/getting-started/web-ui/knowledge-base) |
| **仪表板** |根据数据自动生成图表和报告 | [仪表板](/docs/getting-started/web-ui/dashboard) |
| **应用商店** |浏览并安装社区应用程序 | [应用程序管理](/docs/getting-started/web-ui/app-management) |
| **AWEL 流程** |用于构建 AI 管道的可视化工作流程编辑器 | [AWEL Flow](/docs/getting-started/tools/awel-flow) |
| **代理工作区** |配置和运行多代理任务 | [应用程序管理](/docs/getting-started/web-ui/app-management) |

## 访问 Web 用户界面

启动 DB-GPT 服务器后，Web UI 位于：
```
http://localhost:5670
```
:::tip 单独运行前端
对于前端开发，您可以独立运行 Next.js 应用程序：
```bash
cd web && npm install
cp .env.template .env
# Set API_BASE_URL=http://localhost:5670
npm run dev
```
然后访问[http://localhost:3000](http://localhost:3000)。
:::

## 首先尝试什么

1. 打开**聊天**并确认配置的模型响应
2. 如果您希望对文档进行 RAG，请打开 **知识库**
3. 如果您需要 Text2SQL 和图表，请打开 **Dashboard**
4. 如果您想要可重用的应用程序配置，请打开 **应用程序**

## 后续步骤

|主题 |链接 |
|---|---|
|开始聊天 | [聊天](/docs/getting-started/web-ui/chat) |
|建立知识库| [知识库](/docs/getting-started/web-ui/knowledge-base) |
|构建工作流程 | [AWEL Flow](/docs/getting-started/tools/awel-flow) |