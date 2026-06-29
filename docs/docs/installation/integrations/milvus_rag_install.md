# Milvus RAG


在本示例中，我们将展示如何在 DB-GPT RAG 存储中使用 Milvus。使用图数据库实现RAG可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。


### 安装依赖项

首先，您需要安装`dbgpt milvus storage`库。
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_milvus" \
--extra "dbgpts"
````
### 准备 Milvus

准备 Milvus 数据库服务，参考-[Milvus 安装](https://milvus.io/docs/install_standalone-docker-compose.md) 。


### 图图配置

在`configs/dbgpt-proxy-openai.toml`文件中设置下面的rag存储变量，让DB-GPT知道如何连接到Milvus。
```
[rag.storage]
[rag.storage.vector]
type = "Milvus"
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