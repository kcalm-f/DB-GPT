#混合内存

>这种结构明确地模拟了人类的短期和长期记忆。 
>短期记忆暂时缓冲近期感知，而长期记忆巩固 
>随时间推移的重要信息。


例如，短期记忆包含代理当前情况的上下文信息，
而长期记忆存储代理过去的行为和想法，可以根据当前事件检索。

# #创建混合内存

# # #方法1 ：使用默认值创建混合内存

它将使用OpenAI Embedding API和ChromaStore作为默认值。
```python
import shutil
from dbgpt.agent import HybridMemory, AgentMemory

# Delete old vector store directory(/tmp/tmp_ltm_vector_stor)
shutil.rmtree("/tmp/tmp_ltm_vector_store", ignore_errors=True)
hybrid_memory = HybridMemory.from_chroma(
    vstore_name="agent_memory", vstore_path="/tmp/tmp_ltm_vector_store"
)

agent_memory: AgentMemory = AgentMemory(memory=hybrid_memory)
```
# # #方法2 ：使用自定义值创建混合内存

混合记忆需要感官记忆、短期记忆和长期记忆。

* *准备嵌入模型* *

您可以根据[准备嵌入模型] (./short_term_memory # prepare-embedding-model)准备嵌入模型。

在这里，我们使用OpenAI嵌入API作为示例：
```python
import os
from dbgpt.rag.embedding import DefaultEmbeddingFactory

api_url = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1") + "/embeddings"
api_key = os.getenv("OPENAI_API_KEY")
embeddings = DefaultEmbeddingFactory.openai(api_url=api_url, api_key=api_key)
```
* *准备矢量存储* *

您需要准备一个矢量存储，在这里我们使用“ChromaStore”作为示例：
```python

import shutil
from dbgpt_ext.storage.vector_store.chroma_store import ChromaVectorConfig, ChromaStore

# Delete old vector store directory(/tmp/tmp_ltm_vector_stor)
shutil.rmtree("/tmp/tmp_ltm_vector_store", ignore_errors=True)
vector_store = ChromaStore(
    ChromaVectorConfig(
        persist_path="/tmp/tmp_ltm_vector_store",
    ),
    name="ltm_vector_store",
    embedding_fn=embeddings
)
```
* *创建混合内存* *
```python
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

from dbgpt.agent import (
    SensoryMemory,
    EnhancedShortTermMemory,
    LongTermMemory,
    HybridMemory,
    AgentMemory,
)

executor = ThreadPoolExecutor()

sensor_memory = SensoryMemory(buffer_size=2)

short_term_memory = EnhancedShortTermMemory(
    embeddings=embeddings,
    buffer_size=2,
    enhance_similarity_threshold=0.7,
    enhance_threshold=3,
    executor=executor,
)

long_term_memory = LongTermMemory(
    executor=ThreadPoolExecutor(), vector_store=vector_store, _default_importance=0.5
)

hybrid_memory = HybridMemory(
    now=datetime.now(),
    sensory_memory=sensor_memory,
    short_term_memory=short_term_memory,
    long_term_memory=long_term_memory,
)

agent_memory: AgentMemory = AgentMemory(memory=hybrid_memory)
```
# # #方法3 ：从矢量存储创建混合内存

您可以从矢量存储创建混合内存，它将使用默认值 
感觉记忆和短期记忆。
```python
from dbgpt.agent import HybridMemory, AgentMemory

hybrid_memory = HybridMemory.from_vstore(
    vector_store=vector_store, embeddings=embeddings
)

agent_memory: AgentMemory = AgentMemory(memory=hybrid_memory)
```
## 它是如何工作的

写入内存片段时：
1.混合记忆首先将感觉记忆中的记忆片段存储起来，
如果感觉记忆已满，则丢弃所有感觉记忆片段，并且 
一些被丢弃的记忆片段将被转移到短期记忆中。
2.短期记忆会接收一些感觉记忆作为外界观察， 


短期记忆中的记忆片段可以通过其他观察来增强。一些 
增强的记忆片段将被转移到长期记忆中，同时，这个
增强的记忆力会反映到更高层次的思想和见解到长期记忆。
3. 长期记忆将存储代理的经验和知识。当它接收到内存时


短期记忆片段，它会计算记忆片段的重要性，然后写入
到矢量存储。

读取内存片段时：
1. 首先，混合存储器会根据长时记忆读取记忆片段 
到观察。长期记忆使用“TimeWeightedEmbeddingRetriever”来检索 
内存碎片（最新的内存碎片具有更高的权重）。


2. 检索到的记忆片段将被保存到短期记忆中（仅用于增强 
记忆片段，而不是将新的记忆片段附加到短期记忆中）。检索到的
记忆碎片和所有短期记忆碎片将被合并，并作为当前记忆进行LLM。
经过增强过程后，有一些新的短期记忆片段将被转移到长期记忆中。