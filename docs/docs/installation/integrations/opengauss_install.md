# 打开高斯

openGauss是一个开源关系数据库，通过DB-GPT支持
`dbgpt_ext.datasource.rdbms.conn_openGauss` 中的本机连接器。

### 安装依赖项

openGauss 使用 PostgreSQL 兼容的驱动路径。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_postgres" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备openGauss

准备一个 openGauss 实例并启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### openGauss 配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 模式
- 驱动程序（`postgresql+psycopg2`）

openGauss 连接器的实现如下：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_openGauss.py`