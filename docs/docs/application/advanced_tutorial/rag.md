# RAG参数调整
每个知识空间都支持论据定制，包括向量检索的相关论据和知识问答提示的论据。

如下图所示，点击“知识”会弹出对话框。点击“Arguments”按钮，进入参数调整界面。
![图片](https://github.com/eosphoros-ai/DB-GPT/assets/13723926/f02039ea-01d7-493a-acd9-027020d54267)
<Tabs
默认值=“嵌入”
  值={[
    {label: '嵌入参数', value: '嵌入'},
    {label: '提示参数', value: '提示'},
    {label: '摘要参数', value: '摘要'},
  ]}>
  <TabItem value="Embedding" label="Embedding Argument">
![图片](https://github.com/eosphoros-ai/DB-GPT/assets/13723926/8a69aba0-3b28-449d-8fd8-ce5bf8dbf7fc)

:::tip 嵌入参数
* topk：基于相似度得分的前k个向量。
*recall_score：设置相似向量检索的相似度阈值分数。 0 到 1 之间。默认 0.3。
* recall_type：召回类型。现在仅支持向量相似度的topk。
* 模型：用于创建文本或其他数据的矢量表示的模型。
* chunk_size:处理时使用的数据块的大小。默认500。
* chunk_overlap:相邻数据块之间的重叠量。默认50。
:::
 </TabItem>

<TabItem value="Prompt" label="Prompt Argument">
![图片](https://github.com/eosphoros-ai/DB-GPT/assets/13723926/00f12903-8d70-4bfb-9f58-26f03a6a4773)

:::tip 提示参数
* 场景：用于定义使用提示的设置或环境的上下文参数。
* 模板：提示的预定义结构或格式，有助于确保人工智能系统生成与所需风格或语气一致的响应。
* max_token：提示中允许的最大标记或单词数。 
:::
 </TabItem>

<TabItem value="Summary" label="Summary Argument">
![图片](https://github.com/eosphoros-ai/DB-GPT/assets/13723926/96782ba2-e9a2-4173-a003-49d44bf874cc)

:::提示摘要参数
* max_iteration: llm 调用的摘要最大迭代次数，默认为 5。文档摘要越大越好，但时间会更长。
* concurrency_limit：llm默认汇总并发调用，默认3。
:::
 </TabItem>

</Tabs>
# 知识查询重写
在 .env 文件中设置 KNOWLEDGE_SEARCH_REWRITE=True ，然后重新启动服务器。
```shell
# Whether to enable Chat Knowledge Search Rewrite Mode
KNOWLEDGE_SEARCH_REWRITE=True
```
# 更改向量数据库
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“色度”
  值={[
    {标签：'色度'，值：'色度'}，
    {标签：'Milvus'，值：'Milvus'}，
    {标签：'Weaviate'，值：'Weaviate'}，
    {标签：'OceanBase'，值：'OceanBase'}，
  ]}>
  <TabItem value="Chroma" label="Chroma">
在 .env 文件中设置 VECTOR_STORE_TYPE 。
```shell
### Chroma vector db config
VECTOR_STORE_TYPE=Chroma
#CHROMA_PERSIST_PATH=/root/DB-GPT/pilot/data
```
 </TabItem>

<TabItem value="Milvus" label="Milvus">
在 .env 文件中设置 VECTOR_STORE_TYPE
```shell
### Milvus vector db config
VECTOR_STORE_TYPE=Milvus
MILVUS_URL=127.0.0.1
MILVUS_PORT=19530
#MILVUS_USERNAME
#MILVUS_PASSWORD
#MILVUS_SECURE=
  ```
 </TabItem>

<TabItem value="Weaviate" label="Weaviate">
在 .env 文件中设置 VECTOR_STORE_TYPE
```shell
### Weaviate vector db config
VECTOR_STORE_TYPE=Weaviate
#WEAVIATE_URL=https://kt-region-m8hcy0wc.weaviate.network
 ```
 </TabItem>

<TabItem value="OceanBase" label="OceanBase">
在 .env 文件中设置 VECTOR_STORE_TYPE
```shell
OB_HOST=127.0.0.1
OB_PORT=2881
OB_USER=root@test
OB_DATABASE=test
## Optional
# OB_PASSWORD=
## Optional: If {OB_ENABLE_NORMALIZE_VECTOR} is set, the vector stored in OceanBase is normalized.
# OB_ENABLE_NORMALIZE_VECTOR=True
```
 </TabItem>
</Tabs>
