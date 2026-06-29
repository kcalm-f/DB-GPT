# SQLite

SQLite是一个轻量级的嵌入式关系数据库。 DB-GPT 包括本机
`dbgpt_ext.datasource.rdbms.conn_sqlite` 中的 SQLite 连接器。

### 安装依赖项

SQLite 支持在基本安装中提供，不需要
额外的额外数据源。
```bash
uv sync --all-packages \
--extra "base" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 SQLite

准备一个SQLite数据库文件路径，例如`./data/demo.db`，然后启动服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### SQLite 配置

使用数据源 UI 或配置字段：

- 路径
- 检查相同线程
- 驱动程序（`sqlite`）

SQLite 连接器的实现如下：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_sqlite.py`