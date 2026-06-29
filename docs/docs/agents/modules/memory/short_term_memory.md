# 短期记忆

短期记忆暂时缓冲最近的感知，它会接收一些 
感觉记忆，并且可以通过其他观察或检索记忆来**增强** 
进入长期记忆。

在大多数情况下，短期记忆类似于上下文中的输入信息
受LLM限制的窗口。
所以你可以认为短期记忆在大多数情况下都会被写入LLM的提示中。

## 使用短期记忆
```python
from dbgpt.agent import AgentMemory, ShortTermMemory

# Create an agent memory, which contains a short-term memory
memory = ShortTermMemory(buffer_size=2)
agent_memory: AgentMemory = AgentMemory(memory=memory)
```
与感觉记忆一样，短期记忆也有缓冲区大小，当缓冲区满时，
它将保留最新的 buffer_size 内存，并且一些丢弃的内存将 
被转移到长期记忆中。

默认的短期内存是`FIFO`缓冲内存，这里我们不做太多介绍。

## 增强短期记忆

与人类短期记忆一样，DB-GPT 制剂的短期记忆可以通过外部观察来增强。
这里我们介绍一种增强型短期记忆，称为“EnhancedShortTermMemory”， 
它通过比较新观察和现有记忆之间的相似性来增强记忆。

要使用“EnhancedShortTermMemory”，您需要提供一个嵌入模型。

### 准备嵌入模型

DB-GPT 支持 
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
import os
from dbgpt.rag.embedding import DefaultEmbeddingFactory

api_url = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1") + "/embeddings"
api_key = os.getenv("OPENAI_API_KEY")
embeddings = DefaultEmbeddingFactory.openai(api_url=api_url, api_key=api_key)
```
  </TabItem>

  <TabItem value="text2vec">

```python
from dbgpt.rag.embedding import DefaultEmbeddingFactory

embeddings = DefaultEmbeddingFactory.default("/data/models/text2vec-large-chinese")
```
</TabItem>

<TabItem value="remote_embedding">
如果您已部署[DB-GPT集群](../../../installation/model_service/cluster)并且 
[API服务器](../../../installation/advanced_usage/OpenAI_SDK_call)
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
### 使用增强型短期记忆
```python
from concurrent.futures import ThreadPoolExecutor
from dbgpt.agent import AgentMemory, EnhancedShortTermMemory

# Create an agent memory, which contains a short-term memory
memory = EnhancedShortTermMemory(
    embeddings=embeddings,
    buffer_size=2,
    enhance_similarity_threshold=0.5,
    enhance_threshold=3,
    executor=ThreadPoolExecutor(),
)
agent_memory: AgentMemory = AgentMemory(memory=memory)
```
在DB-GPT中，核心接口是异步非阻塞的，因此我们使用ThreadPoolExecutor来 
在单独的线程中运行相似度计算以获得更好的性能。

在上面的代码中，我们将“enhance_similarity_threshold”设置为“0.5”，这意味着如果 
相似度大于‘0.7’，新观测值有概率增强为
短期记忆（增强过程中存在随机因素）。
我们将“enhance_threshold”设置为“3”，这意味着如果内存增强大于或等于“3”倍， 
它将被转移到长期记忆中。

然后您可以在代理中使用增强的短期记忆。