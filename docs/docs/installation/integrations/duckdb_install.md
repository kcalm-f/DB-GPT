# 鸭数据库

DuckDB是一个高性能分析数据库系统。它旨在快速高效地执行分析 SQL 查询，也可以用作嵌入式分析数据库。

在此示例中，我们将展示如何在 DB-GPT 数据源中使用 DuckDB。使用DuckDB实现Datasource可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

### 安装依赖项

首先，您需要安装“dbgpt duckdb 数据源”库。
```bash

uv sync --all-packages \
--extra "base" \
--extra "datasource_duckdb" \
--extra "rag" \
--extra "storage_chromadb" \

```
### 准备 DuckDB

准备DuckDB数据库服务，参考-[DuckDB安装](https://duckdb.org/docs/installation)。

然后运行以下命令来启动网络服务器：
```bash

uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml

```
或者，您还可以使用以下命令来启动网络服务器：
```bash

uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml

```
### DuckDB 配置
<p对齐=“左”>
  <img src={'https://github.com/user-attachments/assets/bc5ffc20-4b5b-4e24-8c29-bf5702b0e840'} width="1000px"/>
</p>