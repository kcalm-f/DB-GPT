# BM25 拉格

在此示例中，我们将展示如何在 DB-GPT RAG 存储中使用 Elasticsearch。使用Elasticsearch数据库实现RAG可以在一定程度上缓解Elasticsearch数据库检索带来的不确定性和可解释性问题。

### 安装依赖项

首先，您需要安装“dbgpt elasticsearch storage”库。
```bash
uv sync --all-packages --frozen \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_elasticsearch" \
--extra "dbgpts"
````
### 准备 Elasticsearch

准备Elasticsearch数据库服务，参考-[Elasticsearch安装](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html) 。

### Elasticsearch 配置


在`configs/dbgpt-bm25-rag.toml`文件中设置下面的rag存储变量，让DB-GPT知道如何连接到Elasticsearch。
```

[rag.storage]
[rag.storage.full_text]
type = "ElasticSearch"
uri = "127.0.0.1"
port = "9200"
```
然后运行以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-bm25-rag.toml
```
可选
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-bm25-rag.toml
```

