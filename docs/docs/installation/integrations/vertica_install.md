# 维蒂卡

Vertica 是一个由 DB-GPT 通过原生支持的分析 SQL 数据仓库
`dbgpt_ext.datasource.rdbms.conn_vertica` 中的连接器。

### 安装依赖项

安装 Vertica 额外数据源。
```bash
uv sync --all-packages \
--extra "base" \
--extra "datasource_vertica" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 Vertica

准备 Vertica 实例并启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### Vertica 配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 驱动程序（`vertica+vertica_python`）

Vertica 连接器的实现方式为：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_vertica.py`