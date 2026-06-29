# OceanBase

OceanBase是一个通过原生DB-GPT支持的分布式SQL数据库
`dbgpt_ext.datasource.rdbms.conn_oceanbase` 中的连接器。

### 安装依赖项

OceanBase 支持已经建立在兼容 OceanBase 的 MySQL 驱动程序路径上
由连接器使用。
```bash
uv sync --all-packages \
--extra "base" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 准备OceanBase

准备一个OceanBase实例并启动DB-GPT Web服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
### OceanBase配置

使用数据源 UI 或配置字段：

- 主机
- 端口
- 用户
- 密码
- 数据库
- 驱动程序（`mysql+ob`）

OceanBase连接器的实现是：

- `packages/dbgpt-ext/src/dbgpt_ext/datasource/rdbms/conn_oceanbase.py`