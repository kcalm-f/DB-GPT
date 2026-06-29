# 关键字搜索 RAG 用户手册

在此示例中，我们将展示如何在 DB-GPT 中使用全文搜索 RAG 框架。使用传统的全文检索来实现RAG可以在一定程度上缓解矢量数据库检索带来的不确定性和可解释性问题。

您可以参考源代码中的python示例文件“DB-GPT/examples/rag/keyword_rag_example.py”。此示例演示如何从文档加载知识并将其保留在全文存储中。随后，它通过在全文存储中搜索关键字来回忆与您的问题相关的知识。

### 向量检索的约束 
Vector Retrieve 具有明显的优势，但该技术确实有一些限制：
- 计算密集型 - 为整个文档语料库生成向量并基于向量相似性进行查询需要比关键字索引和匹配更多的处理能力。如果系统没有适当优化，延迟可能会成为一个问题。
- 需要大量的训练数据 - BERT 等模型建立的语义连接依赖于长期对大量、多样化的数据集进行训练。这些数据可能不容易用于专门的语料库，从而限制了向量的质量。
- 对于精确关键字查询效果较差 - 当查询包含清晰、精确的关键字和意图时，矢量搜索几乎没有什么好处。搜索“苹果水果”可能会返回比“苹果”更差的结果，因为向量更注重整体含义而不是关键字。

###向量检索和关键词检索如何选择？
什么时候向量搜索优于关键字搜索，反之亦然？以下是有关何时使用每种方法的一些最佳实践：

何时使用矢量搜索

当查询意图模糊或广泛时的早期研究
需要比关键词更多地掌握概念和主题
探索信息需求松散的主题
用户搜索查询更具对话性 
矢量搜索的语义功能使其在这些用例中大放异彩。即使关键字或对主题的理解有限，它也可以为用户指明正确的方向。

何时使用关键字搜索：

- 寻找非常具体的内容并且已经了解该主题
- 研究方向明确，目标明确
- 查询包含独特的专有名词，例如品牌名称
- 需求需要快速的结果，而不是详尽的相关性 
对于精确或时间敏感的查询，关键字搜索将有效地定位准确的术语。向量搜索可能会因不必要的语义扩展而变得曲折。

搜索方法应符合用户的意图和特殊需求。矢量搜索用于探索，关键字搜索用于精确。两者都可用，用户就可以两全其美。 

### 安装依赖项

首先，您需要安装“dbgpt”库。
```bash
pip install "dbgpt[rag]>=0.5.8"
````
### 准备全文搜索引擎

“Elasticsearch”是 Elastic Stack 核心的分布式搜索和分析引擎。 Logstash 和 Beats 有助于收集、聚合和丰富您的数据并将其存储在 Elasticsearch 中。 Kibana 使您能够以交互方式探索、可视化和分享对数据的见解，并管理和监控堆栈。 Elasticsearch 是索引、搜索和分析魔法发生的地方。
请参阅 https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html

安装 Elasticsearch 参考 https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html

### 关键字搜索配置

在`.env`文件中设置以下变量，让DB-GPT知道如何连接到全文搜索引擎存储。
```
ELASTICSEARCH_URL=localhost
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=dbgpt
```
### 加载到全文搜索引擎

当使用Elaticsearch全文引擎作为底层知识存储平台时，需要构建文档倒排索引，以方便文档的归档和检索。  

以下代码演示了如何创建与 Elasticsearch 搜索引擎的连接。
```python
from dbgpt_ext.storage.full_text.elasticsearch import ElasticDocumentConfig, \
    ElasticDocumentStore
def _create_es_connector():
    """Create es connector."""
    config = ElasticDocumentConfig(
        name="keyword_rag_test",
        uri="localhost",
        port="9200",
        user="elastic",
        password="dbgpt",
    )

    return ElasticDocumentStore(config)
```
### 从全文搜索引擎检索关键字

关键词检索是一种从大量文档中检索相关信息的简单而有效的方法。它基于全文搜索引擎Elasticsearch。用户可以输入查询并基于查询检索最相关的文档。
```python
import os

from dbgpt.configs.model_config import ROOT_PATH
from dbgpt_ext.rag import ChunkParameters
from dbgpt_ext.rag.assembler import EmbeddingAssembler
from dbgpt_ext.rag.knowledge import KnowledgeFactory

async def main():
    file_path = os.path.join(ROOT_PATH, "docs/docs/awel/awel.md")
    knowledge = KnowledgeFactory.from_file_path(file_path)
    keyword_store = _create_es_connector()
    chunk_parameters = ChunkParameters(chunk_strategy="CHUNK_BY_SIZE")
    # get embedding assembler
    assembler = EmbeddingAssembler.load_from_knowledge(
        knowledge=knowledge,
        chunk_parameters=chunk_parameters,
        index_store=keyword_store,
    )
    assembler.persist()
    # get embeddings retriever
    retriever = assembler.as_retriever(3)
    chunks = await retriever.aretrieve_with_scores("what is awel talk about", 0.3)
    print(f"keyword rag example results:{chunks}")
```
### 通过关键字 RAG 聊天知识

这里我们演示如何通过网页上的关键字RAG来实现聊天知识。

首先，使用“全文”类型创建知识库。上传知识文档，等待切片完成。


<p对齐=“左”>
  <img src={'/img/chat_knowledge/keyword_rag/create_keyword_rag.jpg'} width="1000px"/>
</p>


根据关键字 RAG 开始聊天知识。
<p对齐=“左”>
  <img src={'/img/chat_knowledge/keyword_rag/keyword_search_chat.jpg'} width="1000px"/>
</p>