---
sidebar_position: 2
title: dbgpts Ecosystem
---
# dbgpts 生态系统

**[dbgpts](https://github.com/eosphoros-ai/dbgpts)** 是 DB-GPT 可重用组件的官方社区存储库 — 包括应用程序、AWEL 运算符、工作流模板和代理。

## dbgpts 中有什么？

|组件类型 |描述 |示例|
|---|---|---|
| **应用程序** |准备安装的完整应用程序 |数据分析应用程序、报告生成器 |
| **运营商** |在工作流程中使用的 AWEL 运算符 |文本分割器、HTTP 请求、LLM 调用 |
| **工作流程模板** |预构建的 AWEL 工作流程 DAG | RAG管道，多代理聊天|
| **代理** |预配置代理定义 | SQL 分析师、代码审查员 |

## 安装

当您使用“dbgpts”额外安装 DB-GPT 时，会包含“dbgpts”CLI：
```bash
uv sync --all-packages --extra "dbgpts" ...
```
## CLI 命令

### 浏览可用的包
```bash
# List all remote packages
dbgpts list-remote

# List installed packages
dbgpts list
```
### 安装一个包
```bash
dbgpts install <package-name>
```
### 更新包
```bash
dbgpts update <package-name>
```
### 卸载包
```bash
dbgpts uninstall <package-name>
```
## 在 Web UI 中使用

安装后，dbgpts 组件将自动在 Web UI 中可用：

- **应用程序**出现在App Store中
- **操作员**出现在 AWEL Flow 编辑器的操作员选项板中
- **工作流程模板**可以导入到流程编辑器中
- 创建多代理应用程序时可以选择**代理**

## 存储库结构

dbgpts 存储库按组件类型组织：
```
dbgpts/
├── apps/           # Complete applications
├── operators/      # AWEL operators
├── workflow/       # Workflow templates
└── agents/         # Agent definitions
```
## 创建您自己的 dbgpts 包

您可以向生态系统贡献自己的组件：

1.遵循[dbgpts存储库](https://github.com/eosphoros-ai/dbgpts)中的包结构
2. 包含带有元数据的“manifest.json”
3. 提交拉取请求

:::信息
详细的开发说明请参见[dbgpts简介](/docs/dbgpts/introduction)。
:::

## 后续步骤

|主题 |链接 |
|---|---|
|构建 AWEL 工作流程 | [AWEL Flow](/docs/getting-started/tools/awel-flow) |
| MCP 工具集成 | [MCP 协议](/docs/getting-started/tools/mcp) |
| dbgpts 开发 | [dbgpts 简介](/docs/dbgpts/introduction) |