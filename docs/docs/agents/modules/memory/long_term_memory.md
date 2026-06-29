# 长期记忆

> 短期记忆包含有关代理当前情况的上下文信息， 
> 而长期记忆则存储了智能体过去的行为和想法，这可以 
> 根据当前事件检索。

> 长期记忆类似于外部向量存储，代理可以根据需要快速查询和检索。

在DB-GPT中，长期记忆默认存储在向量存储中。



## 使用长期记忆

要使用长期记忆，您需要提供向量存储。

### 准备嵌入模型

首先，您需要准备一个嵌入模型，用于将文本转换为向量。
您可以根据[准备嵌入模型](./short_term_memory#prepare-embedding-model)准备嵌入模型。

这里我们以 OpenAI Embedding API 为例：
```python
import os
from dbgpt.rag.embedding import DefaultEmbeddingFactory

api_url = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1") + "/embeddings"
api_key = os.getenv("OPENAI_API_KEY")
embeddings = DefaultEmbeddingFactory.openai(api_url=api_url, api_key=api_key)
```
### 准备向量存储

然后你需要准备一个向量存储，这里我们以 `ChromaStore` 为例，

使用以下命令安装“chroma”包：
```bash
pip install chromadb
```

```python

import shutil
from dbgpt_ext.storage.vector_store.chroma_store import ChromaVectorConfig, ChromaStore

# Delete old vector store directory(/tmp/tmp_ltm_vector_stor)
shutil.rmtree("/tmp/tmp_ltm_vector_store", ignore_errors=True)
vector_store = ChromaStore(
    vector_store_config=ChromaVectorConfig(
        persist_path="/tmp/tmp_ltm_vector_store",
    ),
    name="ltm_vector_store",
    embedding_fn=embeddings,
)
```
### 使用长期记忆
```python
from concurrent.futures import ThreadPoolExecutor
from dbgpt.agent import AgentMemory, LongTermMemory

# Create an agent memory, which contains a long-term memory
memory = LongTermMemory(
    executor=ThreadPoolExecutor(), vector_store=vector_store, _default_importance=0.5
)
agent_memory: AgentMemory = AgentMemory(memory=memory)
```
在上面的代码中，`_default_importance`表示一个内存片段的默认重要性，
因为我们直接使用`LongTermMemory`，所以我们需要设置默认重要性。