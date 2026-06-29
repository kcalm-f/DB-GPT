# 感觉记忆

就像人类的感觉记忆一样，感觉记忆是记录感知输入的，它 
会接收来自环境的观察结果，一些感觉记忆会被 
转移到短期记忆。

:::提示注意
在大多数情况下，您不应该直接使用“SensoryMemory”，它旨在接收
来自环境的观察，只有一部分感觉记忆会转移到短期记忆。
:::

## 感觉记忆的简单例子

首先，您需要创建一个“SensoryMemory”实例，然后可以使用它来存储观察结果。
```python
from dbgpt.agent import AgentMemory, SensoryMemory

# Create an agent memory, which contains a sensory memory
memory = SensoryMemory(buffer_size=2)
agent_memory: AgentMemory = AgentMemory(memory=memory)
```
然后，让我们创建一些用户消息进行测试。
```python
import os
from dbgpt.agent import AgentContext
from dbgpt.model.proxy import OpenAILLMClient

llm_client = OpenAILLMClient(
    model_alias="gpt-4o",
    api_base=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY"),
)

context: AgentContext = AgentContext(
    conv_id="test123",
    language="en",
    temperature=0.9,
    max_new_tokens=2048,
)

messages = [
    "When I was 4 years old, I went to primary school for the first time, please tell me a joke",
    "When I was 10 years old, I went to middle school for the first time, please tell me a joke",
    "When I was 16 years old, I went to high school for the first time, please tell me a joke",
    "When I was 18 years old, I went to college for the first time, please tell me a joke",
]
```
### 验证记住
```python
import asyncio
from dbgpt.agent import (
    ConversableAgent,
    ProfileConfig,
    LLMConfig,
    BlankAction,
    UserProxyAgent,
)

async def verify_remember():
    joy = (
        await ConversableAgent(profile=ProfileConfig(name="Joy", role="Comedians"))
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .bind(BlankAction)
        .build()
    )
    user_proxy = await UserProxyAgent().bind(agent_memory).bind(context).build()
    # The turns not more than 2, make sure the agent remembers the previous conversation
    for message in messages[:2]:
        await user_proxy.initiate_chat(
            recipient=joy,
            reviewer=user_proxy,
            message=message,
        )
    await user_proxy.initiate_chat(
        recipient=joy,
        reviewer=user_proxy,
        message="How old was I when I went to primary school?"
    )

if __name__ == "__main__":
    asyncio.run(verify_remember())

```
输出将是这样的：
```
--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 4 years old, I went to primary school for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure, here's a fun joke for you:

Why did the kid bring a ladder to school?

Because he wanted to go to high school!

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure, here's a fun joke for you:\n\nWhy did the kid bring a ladder to school?\n\nBecause he wanted to go to high school!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure, here's a fun joke for you:

Why did the kid bring a ladder to school?

Because he wanted to go to high school!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 10 years old, I went to middle school for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure, here's a joke for you:

Why did the student eat his homework?

Because the teacher said it was a piece of cake!

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure, here's a joke for you:\n\nWhy did the student eat his homework?\n\nBecause the teacher said it was a piece of cake!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure, here's a joke for you:

Why did the student eat his homework?

Because the teacher said it was a piece of cake!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"How old was I when I went to primary school?"

--------------------------------------------------------------------------------
un_stream ai response: Based on your previous statements, you went to primary school for the first time when you were 4 years old.

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Based on your previous statements, you went to primary school for the first time when you were 4 years old."
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Based on your previous statements, you went to primary school for the first time when you were 4 years old.
```
在上面的例子中，代理记住了之前的对话并可以回答 
根据之前的对话提出的问题，是因为`buffer_size=2`中 
“SensoryMemory”和代理可以记住前两次对话。

### 验证忘记
```python
async def verify_forget():
    joy = (
        await ConversableAgent(profile=ProfileConfig(name="Joy", role="Comedians"))
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .bind(BlankAction)
        .build()
    )
    user_proxy = await UserProxyAgent().bind(agent_memory).bind(context).build()
    for message in messages:
        await user_proxy.initiate_chat(
            recipient=joy,
            reviewer=user_proxy,
            message=message,
        )
    await user_proxy.initiate_chat(
        recipient=joy,
        reviewer=user_proxy,
        message="How old was I when I went to primary school?",
    )


if __name__ == "__main__":
    asyncio.run(verify_forget())
```
输出将是这样的：
```
--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 4 years old, I went to primary school for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure, here's a joke for you:

Why did the scarecrow become a successful student?

Because he was outstanding in his field!

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure, here's a joke for you:\n\nWhy did the scarecrow become a successful student?\n\nBecause he was outstanding in his field!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure, here's a joke for you:

Why did the scarecrow become a successful student?

Because he was outstanding in his field!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 10 years old, I went to middle school for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Of course! Here's a joke for you:

Why was the math book sad when it started middle school?

Because it had too many problems!

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Of course! Here's a joke for you:\n\nWhy was the math book sad when it started middle school?\n\nBecause it had too many problems!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Of course! Here's a joke for you:

Why was the math book sad when it started middle school?

Because it had too many problems!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 16 years old, I went to high school for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure, here's a joke for you:

Why did the geometry teacher go to the beach?

Because she needed to find a new angle!

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure, here's a joke for you:\n\nWhy did the geometry teacher go to the beach?\n\nBecause she needed to find a new angle!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure, here's a joke for you:

Why did the geometry teacher go to the beach?

Because she needed to find a new angle!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"When I was 18 years old, I went to college for the first time, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure, here’s a college-themed joke for you:

Why did the scarecrow become a successful college student?

Because he was outstanding in his field! 🌾🎓😄

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure, here’s a college-themed joke for you:\n\nWhy did the scarecrow become a successful college student?\n\nBecause he was outstanding in his field! 🌾🎓😄"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure, here’s a college-themed joke for you:

Why did the scarecrow become a successful college student?

Because he was outstanding in his field! 🌾🎓😄

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"How old was I when I went to primary school?"

--------------------------------------------------------------------------------
un_stream ai response: Most people typically start primary school around 5 or 6 years old. But if you'd like a joke on that topic, here it goes:

Why did the math book look so sad on its first day of primary school?

Because it had too many problems! 📚😄

--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Most people typically start primary school around 5 or 6 years old. But if you'd like a joke on that topic, here it goes:\n\nWhy did the math book look so sad on its first day of primary school?\n\nBecause it had too many problems! 📚😄"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Most people typically start primary school around 5 or 6 years old. But if you'd like a joke on that topic, here it goes:

Why did the math book look so sad on its first day of primary school?

Because it had too many problems! 📚😄
```
在上面的例子中，代理忘记了之前的对话并且无法回答 
根据之前对话的问题，是因为这个内存中的`buffer_size=2`，
**当缓冲区满时它会丢弃所有现有的内存**，这是一个特殊的 
“SensoryMemory”的特点是不像普通的缓冲存储器（先进先出，保留 
最新的 buffer_size 内存）。