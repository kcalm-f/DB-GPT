---
sidebar_position: 1
title: Chat
---
# 聊天

DB-GPT 通过其 Web UI 提供多种聊天模式 - 每种模式都针对不同的用例量身定制。

## 聊天模式

|模式|描述 |要求|
|---|---|---|
| **聊天正常** |与法学硕士的一般对话|法学硕士配置|
| **聊天数据** | SQL 数据库上的自然语言查询 (Text2SQL) |数据库已连接 |
| **聊天 Excel** |上传和查询Excel/CSV文件 |法学硕士配置 |
| **聊天知识** | RAG 就文件进行对话 |创建知识库 |

## 开始聊天

1. 打开 Web UI **[http://localhost:5670](http://localhost:5670)**
2. 单击侧栏中的**聊天**
3. 从下拉列表中选择聊天模式或创建新对话
4. 输入您的消息并按 Enter

:::tip 快速测试
从**正常聊天**开始验证您的 LLM 是否正常工作，然后尝试其他模式。
:::

## 聊天正常

默认模式 — 与配置的 LLM 直接对话。

**特点：**
- 具有上下文保留的多轮对话
- 格式化响应的 Markdown 渲染
- 代码语法高亮
- 流式响应

## 聊天数据 (Text2SQL)

使用自然语言查询连接的数据库。 DB-GPT 将您的问题转换为 SQL，执行它并显示结果。

**使用方法：**

1. 首先，在侧边栏的**数据库**部分连接一个数据库
2. 开始新的**聊天数据**对话
3. 从下拉列表中选择目标数据库
4. 用自然语言提出问题

**示例：**
```
User: Show me the top 10 customers by total order amount
DB-GPT: [generates SQL, executes, and displays results in a table]
```
:::info 支持的数据库
MySQL、PostgreSQL、SQLite、ClickHouse、DuckDB、MSSQL、Oracle 等。有关完整列表，请参阅[数据源](/docs/getting-started/concepts/data-sources)。
:::

## 聊天 Excel

上传 Excel 或 CSV 文件并使用自然语言进行查询。

**使用方法：**

1. 开始新的 **Chat Excel** 对话
2. 上传您的文件（`.xlsx`、`.xls` 或 `.csv`）
3.询问有关数据的问题

**示例：**
```
User: What is the average sales amount per region?
DB-GPT: [analyzes the file and presents results]
```
## 聊天知识

对话式 RAG — 提出问题并根据您上传的文档获得答案。

**使用方法：**

1.首先创建知识库并上传文档（参见[知识库](/docs/getting-started/web-ui/knowledge-base)）
2. 开始新的**聊天知识**对话
3. 从下拉列表中选择知识库
4.提出你的问题

**特点：**
- 答案引用源文件
- 支持多种文件格式（PDF、Word、Markdown、TXT等）
- 将矢量搜索与法学硕士生成相结合

## 对话管理

- **历史记录** — 以前的对话保存在侧边栏中
- **删除** — 右键单击对话将其删除
- **导出** — 从聊天窗口复制对话内容

## 后续步骤

|主题 |链接 |
|---|---|
|为聊天知识建立知识库| [知识库](/docs/getting-started/web-ui/knowledge-base) |
|连接数据库以获取聊天数据 | [数据源](/docs/getting-started/concepts/data-sources) |
|构建自定义聊天工作流程 | [AWEL Flow](/docs/getting-started/tools/awel-flow) |