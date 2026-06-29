#阿帕奇·多丽丝

Apache Doris 是一个由 DB-GPT 支持的实时分析数据仓库
`dbgpt_ext.datasource.rdbms.conn_doris` 中的本机连接器。

### 安装依赖项

Doris 使用与 MySQL 兼容的驱动程序路径。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_mysql" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 Apache Doris

准备 Doris 实例并启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### Apache Doris 配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 驱动程序（`mysql+pymysql`）

Doris 连接器的实现方式为：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_doris.py`