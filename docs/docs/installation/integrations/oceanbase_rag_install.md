# OceanBase 矢量 RAG


在此示例中，我们将展示如何在 DB-GPT RAG 存储中使用 OceanBase Vector。使用图数据库实现RAG可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。


### 安装依赖项

首先，您需要安装“dbgpt OceanBase Vector storage”库。
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_obvector" \
--extra "dbgpts"
````
### 准备OceanBase向量

准备OceanBase Vector数据库服务，参考[OceanBase Vector](https://open.oceanbase.com/) 。


### OceanBase配置

在`configs/dbgpt-proxy-openai.toml`文件中设置下面的rag存储变量，让DB-GPT知道如何连接到OceanBase Vector。
```
[rag.storage]
[rag.storage.vector]
type = "oceanbase"
uri = "127.0.0.1"
port = "19530"
#username="dbgpt"
#password=19530
```
然后运行以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```
或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```