# API接口使用

DB-GPT项目目前也提供了各种API可供使用。目前API主要分为两类。 1.模型API 2.应用服务层AP

模型API主要是指DB-GPT适配各种模型，统一封装成兼容OpenAI SDK输出的模型。服务层API是指DB-GPT服务层暴露的API。下面简单介绍一下两者的使用。

## 模型 API

在DB-GPT项目中，我们定义了一个面向服务的多模型管理框架（SMMF）。通过SMMF的能力，我们可以部署多个模型，这些模型通过服务对外提供服务。为了让客户实现无缝切换，我们统一支持OpenAI SDK标准。
- 详细使用教程：【OpenAI SDK调用本地多模型】(../../installation/advanced_usage/OpenAI_SDK_call.md)

**示例：** 下面是通过openai sdk调用的示例
```python
import openai
model = "Qwen/QwQ-32B"

client = openai.OpenAI(
  api_key="EMPTY",
  base_url="http://127.0.0.1:8100/api/v1",
)
completion = client.chat.completions.create(
  model=model,
  messages=[{"role": "user", "content": "hello"}]
)
# print the completion
print(completion.choices[0].message.content)
```
## 应用服务层API
服务层API是指启动webserver后暴露在5670端口的API，主要针对应用层。按类别可以分为以下几个部分

- 聊天API
- 编辑器API
- LLM管理API
- 代理API
- AWEL API
- 模型API

:::信息
注意：启动Web服务器后，打开http://127.0.0.1:5670/docs查看详细信息

关于服务层API，在早期的策略上，我们保持了最低可用性和开放性的原则。稳定对外暴露的API都会携带版本信息，例如
- /api/v1/
- /api/v2/

由于整个领域的快速发展，不同版本的API在兼容性方面不会被认为完全兼容。在后续新版本的API中，我们将在文档中针对不兼容的API提供说明。
:::

## API说明
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“chatapi”
  值={[
    {标签：'聊天API'，值：'chatapi'}，
    {标签：'编辑器API'，值：'editorapi'}，
    {标签：'模型API'，值：'modelapi'}，
    {标签：'LLM管理API'，值：'llmanageapi'}，
    {标签：'代理API'，值：'agentapi'}，
    {标签：'AWEL API'，值：'awelapi'}，
  ]}>
  <TabItem value="chatapi">    
聊天 API 列表
  ```python
    api/v1/chat/db/list
    api/v1/chat/db/add
    api/v1/chat/db/edit
    api/v1/chat/db/delete
    api/v1/chat/db/test/connect
    api/v1/chat/db/summary
    api/v1/chat/db/support/type
    api/v1/chat/dialogue/list
    api/v1/chat/dialogue/scenes
    api/v1/chat/dialogue/new
    api/v1/chat/mode/params/list
    api/v1/chat/mode/params/file/load
    api/v1/chat/dialogue/delete
    api/v1/chat/dialogue/messages
    api/v1/chat/prepare
    api/v1/chat/completions
  ```
  </TabItem>
  <TabItem value="editorapi">   
编辑器 API 列表
  ```python
    api/v1/editor/db/tables
    api/v1/editor/sql/rounds
    api/v1/editor/sql
    api/v1/editor/sql/run
    api/v1/sql/editor/submit
    api/v1/editor/chart/list
    api/v1/editor/chart/info
    api/v1/editor/chart/run
    api/v1/chart/editor/submit
  ```
  </TabItem>
  <TabItem value="modelapi">   
模型 API 列表
  ```python
    api/v1/model/types
    api/v1/model/supports
  ```
  </TabItem>
  <TabItem value="llmanageapi">   
LLM 管理 API 列表
  ```python
    api/v1/worker/model/params
    api/v1/worker/model/list
    api/v1/worker/model/stop
    api/v1/worker/model/start
    api/worker/generate_stream
    api/worker/generate
    api/worker/embeddings
    api/worker/apply
    api/worker/parameter/descriptions
    api/worker/models/supports
    api/worker/models/startup
    api/worker/models/shutdown
    api/controller/models
    api/controller/heartbeat
  ```
  </TabItem>
  <TabItem value="agentapi">   
代理 API 列表
  ```python
    api/v1/agent/hub/update
    api/v1/agent/query
    api/v1/agent/my
    api/v1/agent/install
    api/v1/agent/uninstall
    api/v1/personal/agent/upload
  ```
  </TabItem>
  <TabItem value="awelapi">   
AWEL API 列表
  ```python
    api/v1/awel/trigger/examples/simple_rag
    api/v1/awel/trigger/examples/simple_chat
    api/v1/awel/trigger/examples/hello
  ```

  </TabItem>
</Tabs>
:::信息说明

⚠️知识与提示API

目前，由于知识和提示变更频繁，相关API尚处于测试阶段，后续将逐步开放

:::

更详细的接口参数可以查看`http://127.0.0.1:5670/docs`