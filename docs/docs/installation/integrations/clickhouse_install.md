# ClickHouse

在此示例中，我们将展示如何在 DB-GPT 数据源中使用 ClickHouse。使用面向列的数据库来实现Datasource可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

### 安装依赖项

首先，您需要安装“dbgpt clickhouse datasource”库。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_clickhouse" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 ClickHouse

准备ClickHouse数据库服务，参考-[ClickHouse安装](https://clickhouse.tech/docs/en/getting-started/install/)。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
### ClickHouse 配置

<p对齐=“左”>
  <img src={'https://github.com/user-attachments/assets/b506dc5e-2930-49da-b0c0-5ca051cb6c3f'} width="1000px"/>
</p>