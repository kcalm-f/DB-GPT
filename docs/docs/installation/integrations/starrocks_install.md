# 星石

StarRocks是一个通过DB-GPT支持的高性能分析数据库
`dbgpt_ext.datasource.rdbms.conn_starrocks` 中的本机连接器。

### 安装依赖项

安装所需的基本依赖项集和 StarRocks SQLAlchemy 驱动程序
你的环境。
```bash
uv sync --all-packages \
--extra "base" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备 StarRocks

准备 StarRocks 实例并启动 DB-GPT Web 服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### StarRocks 配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 司机（`starrocks`）

StarRocks 连接器的实现方式为：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_starrocks.py`