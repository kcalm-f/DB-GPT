#MySQL

MySQL 是一种广泛使用的开源关系数据库系统。 DB-GPT 包括
`dbgpt_ext.datasource.rdbms.conn_mysql` 中的本机 MySQL 数据源连接器。

### 安装依赖项

首先，安装MySQL数据源依赖集。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_mysql" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备MySQL

准备 MySQL 服务和数据库，然后启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
可选：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
### MySQL 配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 驱动程序（`mysql+pymysql`）

MySQL连接器的实现是：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_mysql.py`