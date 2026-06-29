# 图 RAG


在本示例中，我们将展示如何在 DB-GPT 中使用 Graph RAG 框架。使用图数据库实现RAG可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

您可以参考源代码中的python示例文件“DB-GPT/examples/rag/graph_rag_example.py”。此示例演示如何从文档加载知识并将其存储在图形存储中。随后，它通过在图形存储中搜索三元组来回忆与您的问题相关的知识。


### 安装依赖项

首先，您需要安装“dbgpt graph_rag”库。
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts" \
--extra "graph_rag"
````
### 准备图数据库

为了以图的形式存储知识，我们需要一个图数据库，[TuGraph](https://github.com/TuGraph-family/tugraph-db)是DB-GPT支持的第一个图数据库。

访问TuGraph github仓库查看【快速入门】(https://tugraph-db.readthedocs.io/zh-cn/latest/3.quick-start/1.preparation.html#id5)文档，按照说明拉取TuGraph数据库docker镜像(最新/版本>=4.5.1)并启动。
```
docker pull tugraph/tugraph-runtime-centos7:4.5.1
docker run -d -p 7070:7070  -p 7687:7687 -p 9090:9090 --name tugraph_demo tugraph/tugraph-runtime-centos7:latest lgraph_server -d run --enable_plugin true
```
Bolt 协议的默认端口是“7687”。

> **下载提示：**
> 
> OSS上也有对应版本的TuGraph Docker镜像包。您也可以直接下载并导入。
> 
> ```
> wget 'https://tugraph-web.oss-cn-beijing.aliyuncs.com/tugraph/tugraph-4.5.1/tugraph-runtime-centos7-4.5.1.tar' -O tugraph-runtime-centos7-4.5.1.tar
> docker load -i tugraph-runtime-centos7-4.5.1.tar
> ```



### 图图配置

在`configs/dbgpt-graphrag.toml`文件中设置以下变量，让DB-GPT知道如何连接到TuGraph。
```
[rag.storage.graph]
type = "TuGraph"
host="127.0.0.1"
port=7687
username="admin"
password="73@TuGraph"
enable_summary="True"
enable_similarity_search="True"
```
然后运行以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-graphrag.toml
```
或者，您还可以使用以下命令来启动网络服务器：
uv 运行 python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml