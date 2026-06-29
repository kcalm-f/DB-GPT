# 抹布与 AWEL

在此示例中，我们将展示如何使用 AWEL 库创建 RAG 程序。

现在，让我们创建一个 python 文件“first_rag_with_awel.py”。

在此示例中，我们将从 URL 加载您的知识并将其存储在矢量存储中。

### 安装依赖项

首先，您需要安装“dbgpt”库。
```bash
pip install "dbgpt[agent,simple_framework, client]>=0.7.1" "dbgpt_ext>=0.7.1" -U
````
### 准备嵌入模型

为了将知识存储在向量存储中，我们需要一个嵌入模型，DB-GPT支持 
有很多嵌入模型，以下是其中一些：
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“openai”
  值={[
    {label: '开放AI(API)', value: 'openai'},
    {标签：'text2vec（本地）'，值：'text2vec'}，
    {label: 'Embedding API Server(集群)', value: 'remote_embedding'},
  ]}>
  <TabItem value="openai">
```python
from dbgpt.rag.embedding import DefaultEmbeddingFactory

embeddings = DefaultEmbeddingFactory.openai()
```
  </TabItem>

  <TabItem value="text2vec">

```python
from dbgpt.rag.embedding import DefaultEmbeddingFactory

embeddings = DefaultEmbeddingFactory.default("/data/models/text2vec-large-chinese")
```
  </TabItem>

  <TabItem value="remote_embedding">
如果您已部署[DB-GPT集群](/docs/installation/model_service/cluster)并且 
[API服务器](/docs/installation/advanced_usage/OpenAI_SDK_call)
，您可以连接到 API 服务器来获取嵌入。
```python
from dbgpt.rag.embedding import DefaultEmbeddingFactory

embeddings = DefaultEmbeddingFactory.remote(
  api_url="http://localhost:8100/api/v1/embeddings",
  api_key="{your_api_key}",
  model_name="text2vec"
)
```
  </TabItem>
</Tabs>
### 加载知识并存储在向量存储中

然后我们可以创建一个 DAG，从 URL 加载知识并将其存储在向量中 
商店。
```python
import asyncio
import shutil
from dbgpt.core.awel import DAG
from dbgpt_ext.rag import ChunkParameters
from dbgpt.rag.knowledge import KnowledgeType
from dbgpt_ext.rag.operators import EmbeddingAssemblerOperator
from dbgpt_ext.rag.operators.knowledge import KnowledgeOperator
from dbgpt_ext.storage.vector_store.chroma_store import ChromaStore, ChromaVectorConfig

# Delete old vector store directory(/tmp/awel_rag_test_vector_store)
shutil.rmtree("/tmp/awel_rag_test_vector_store", ignore_errors=True)

vector_store = ChromaStore(
    vector_store_config=ChromaVectorConfig(
        persist_path="/tmp/awel_rag_test_vector_store"
    ),
    name="test_vstore",
    embedding_fn=embeddings
)

with DAG("load_knowledge_dag") as knowledge_dag:
    # Load knowledge from URL
    knowledge_task = KnowledgeOperator(knowledge_type=KnowledgeType.URL.name)
    assembler_task = EmbeddingAssemblerOperator(
        index_store=vector_store,
        chunk_parameters=ChunkParameters(chunk_strategy="CHUNK_BY_SIZE")
    )
    knowledge_task >> assembler_task

chunks = asyncio.run(assembler_task.call("https://docs.dbgpt.site/docs/awel/"))
print(f"Chunk length: {len(chunks)}")
```
### 从矢量存储中检索知识

然后您可以从矢量存储中检索知识。
```python

from dbgpt.core.awel import MapOperator
from dbgpt.rag.operators import EmbeddingRetrieverOperator

with DAG("retriever_dag") as retriever_dag:
    retriever_task = EmbeddingRetrieverOperator(
        top_k=3,
        index_store=vector_store,
    )
    content_task = MapOperator(lambda cks: "\n".join(c.content for c in cks))
    retriever_task >> content_task

chunks = asyncio.run(content_task.call("What is the AWEL?"))
print(chunks)
```
### 准备LLM

要构建 RAG 程序，我们需要 LLM，以下是 DB-GPT 支持的一些 LLM：
<Tabs
默认值=“openai”
  值={[
    {label: '开放AI(API)', value: 'openai'},
    {标签：'YI(API)'，值：'yi_proxy'}，
    {标签：'API服务器（集群）'，值：'model_service'}，
  ]}>
  <TabItem value="openai">
首先，您应该安装“openai”库。
```bash
pip install openai
```
然后在环境“OPENAI_API_KEY”中设置您的 API 密钥。
```python
from dbgpt.model.proxy import OpenAILLMClient

llm_client = OpenAILLMClient()
```
  </TabItem>

  <TabItem value="yi_proxy">
您应该有一个 YI 帐户并从 YI 官方网站获取 API 密钥。

首先，您应该安装“openai”库。
```bash
pip install openai
```
然后在环境变量“YI_API_KEY”中设置您的 API 密钥。
```python
from dbgpt.model.proxy import YiLLMClient

llm_client = YiLLMClient()
```
  </TabItem>

  <TabItem value="model_service">
如果您已部署[DB-GPT集群](/docs/installation/model_service/cluster)并且 
[API服务器](/docs/installation/advanced_usage/OpenAI_SDK_call)
，您可以连接API服务器来获取LLM模型。

该API与OpenAI API兼容，因此您可以使用OpenAILLMClient 
connect to the API server.

First you should install the `openai` library.
```bash
pip install openai
```

```python
from dbgpt.model.proxy import OpenAILLMClient

llm_client = OpenAILLMClient(api_base="http://localhost:8100/api/v1/", api_key="{your_api_key}")
```
  </TabItem>
</Tabs>
### 创建 RAG 程序

最后，我们可以使用检索到的知识创建 RAG。
```python

from dbgpt.core.awel import InputOperator, JoinOperator, InputSource
from dbgpt.core.operators import PromptBuilderOperator, RequestBuilderOperator
from dbgpt.model.operators import LLMOperator

prompt = """Based on the known information below, provide users with professional and concise answers to their questions. 
If the answer cannot be obtained from the provided content, please say: 
"The information provided in the knowledge base is not sufficient to answer this question.". 
It is forbidden to make up information randomly. When answering, it is best to summarize according to points 1.2.3.
          known information: 
          {context}
          question:
          {question}
"""

with DAG("llm_rag_dag") as rag_dag:
    input_task = InputOperator(input_source=InputSource.from_callable())
    retriever_task = EmbeddingRetrieverOperator(
        top_k=3,
        index_store=vector_store,
    )
    content_task = MapOperator(lambda cks: "\n".join(c.content for c in cks))
    
    merge_task = JoinOperator(lambda context, question: {"context": context, "question": question})
    
    prompt_task = PromptBuilderOperator(prompt)
    # The model is gpt-3.5-turbo, you can replace it with other models.
    req_build_task = RequestBuilderOperator(model="gpt-3.5-turbo")
    llm_task = LLMOperator(llm_client=llm_client)
    result_task = MapOperator(lambda r: r.text)

    input_task >> retriever_task >> content_task >> merge_task
    input_task >> merge_task

    merge_task >> prompt_task >> req_build_task >> llm_task >> result_task

print(asyncio.run(result_task.call("What is the AWEL?")))
```
输出将是：
```bash
AWEL stands for Agentic Workflow Expression Language, which is a set of intelligent agent workflow expression language designed for large model application development. It simplifies the process by providing functionality and flexibility through its layered API design architecture, including the operator layer, AgentFrame layer, and DSL layer. Its goal is to allow developers to focus on business logic for LLMs applications without having to deal with intricate model and environment details.
```
恭喜！您已使用 AWEL 创建了 RAG 程序。

### 完整代码

让我们看一下“first_rag_with_awel.py”的完整代码：
```python
import asyncio
import shutil
from dbgpt.core.awel import DAG, MapOperator, InputOperator, JoinOperator, InputSource
from dbgpt.core.operators import PromptBuilderOperator, RequestBuilderOperator
from dbgpt_ext.rag import ChunkParameters
from dbgpt.rag.knowledge import KnowledgeType
from dbgpt_ext.rag.operators.embedding import EmbeddingAssemblerOperator, EmbeddingRetrieverOperator
from dbgpt_ext.rag.operators import KnowledgeOperator
from dbgpt.rag.embedding import DefaultEmbeddingFactory
from dbgpt_ext.storage.vector_store.chroma_store import ChromaStore, ChromaVectorConfig
from dbgpt.model.operators import LLMOperator
from dbgpt.model.proxy import OpenAILLMClient

# Here we use the openai embedding model, if you want to use other models, you can 
# replace it according to the previous example.
embeddings = DefaultEmbeddingFactory.openai()
# Here we use the openai LLM model, if you want to use other models, you can replace
# it according to the previous example.
llm_client = OpenAILLMClient()

# Delete old vector store directory(/tmp/awel_rag_test_vector_store)
shutil.rmtree("/tmp/awel_rag_test_vector_store", ignore_errors=True)

vector_store = ChromaStore(
    vector_store_config=ChromaVectorConfig(
        persist_path="/tmp/awel_rag_test_vector_store",
    ),
    name="test_vstore",
    embedding_fn=embeddings
)

with DAG("load_knowledge_dag") as knowledge_dag:
    # Load knowledge from URL
    knowledge_task = KnowledgeOperator(knowledge_type=KnowledgeType.URL.name)
    assembler_task = EmbeddingAssemblerOperator(
        index_store=vector_store,
        chunk_parameters=ChunkParameters(chunk_strategy="CHUNK_BY_SIZE")
    )
    knowledge_task >> assembler_task

chunks = asyncio.run(assembler_task.call("https://docs.dbgpt.site/docs/awel/"))
print(f"Chunk length: {len(chunks)}\n")

prompt = """Based on the known information below, provide users with professional and concise answers to their questions. 
If the answer cannot be obtained from the provided content, please say: 
"The information provided in the knowledge base is not sufficient to answer this question.". 
It is forbidden to make up information randomly. When answering, it is best to summarize according to points 1.2.3.
          known information: 
          {context}
          question:
          {question}
"""

with DAG("llm_rag_dag") as rag_dag:
    input_task = InputOperator(input_source=InputSource.from_callable())
    retriever_task = EmbeddingRetrieverOperator(
        top_k=3,
        index_store=vector_store,
    )
    content_task = MapOperator(lambda cks: "\n".join(c.content for c in cks))

    merge_task = JoinOperator(
        lambda context, question: {"context": context, "question": question})

    prompt_task = PromptBuilderOperator(prompt)
    # The model is gpt-3.5-turbo, you can replace it with other models.
    req_build_task = RequestBuilderOperator(model="gpt-3.5-turbo")
    llm_task = LLMOperator(llm_client=llm_client)
    result_task = MapOperator(lambda r: r.text)

    input_task >> retriever_task >> content_task >> merge_task
    input_task >> merge_task

    merge_task >> prompt_task >> req_build_task >> llm_task >> result_task

print(asyncio.run(result_task.call("What is the AWEL?")))
```
### 可视化 DAG

我们可以使用以下代码可视化 DAG：
```python
knowledge_dag.visualize_dag()
rag_dag.visualize_dag()
```
如果您在 Jupyter Notebook 中执行代码，您可以在笔记本中看到 DAG。
```python
display(knowledge_dag.show())
display(rag_dag.show())
```
‘knowledge_dag’的图表是：

<p对齐=“左”>
  <img src={'/img/awel/cookbook/first_rag_knowledge_dag.png'} width="1000px"/>
</p>

而 `rag_dag` 的图是：
<p对齐=“左”>
  <img src={'/img/awel/cookbook/first_rag_rag_dag.png'} width="1000px"/>
</p>