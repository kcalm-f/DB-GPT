# 蜂巢

在此示例中，我们将展示如何在 DB-GPT 数据源中使用 Hive。使用Hive实现Datasource可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

### 安装依赖项

首先，您需要安装“dbgpt hive 数据源”库。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_hive" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 Hive

准备Hive数据库服务，参考-[Hive安装](https://cwiki.apache.org/confluence/display/Hive/GettingStarted)。

然后运行以下命令来启动网络服务器：
```bash

uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
### 配置单元

<p对齐=“左”>
  <img src={'https://github.com/user-attachments/assets/40fb83c5-9b12-496f-8249-c331adceb76f'} width="1000px"/>
</p>