# 甲骨文

在此示例中，我们将展示如何在 DB-GPT 数据源中使用 Oracle。使用Oracle实现Datasource可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

### 安装依赖项

首先，您需要安装“dbgpt oracle datasource”库。
```bash

uv sync --all-packages \
--extra "base" \
--extra "datasource_oracle" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备Oracle

准备Oracle数据库服务，参考-[Oracle安装](https://docs.oracle.com/en/database/oracle/oracle-database/index.html)。

然后运行以下命令来启动网络服务器：
```bash

uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
或者，您还可以使用以下命令来启动网络服务器：
```bash

uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
### Oracle 配置
<p对齐=“左”>
  <img src={'https://github.com/user-attachments/assets/c285f8c3-9e99-4fab-bd39-ae34206ec54f'} width="1000px"/>
</p>