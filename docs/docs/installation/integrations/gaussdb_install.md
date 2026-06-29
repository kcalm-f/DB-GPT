# 高斯数据库

GaussDB是DB-GPT通过以下方式支持的企业级关系数据库
`dbgpt_ext.datasource.rdbms.conn_gaussdb` 中的本机连接器。

### 安装依赖项

GaussDB使用PostgreSQL兼容的驱动路径。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_postgres" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备GaussDB

准备一个 GaussDB 实例并启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### GaussDB配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 模式
- 驱动程序（`postgresql+psycopg2`）

GaussDB 连接器的实现方式为：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_gaussdb.py`