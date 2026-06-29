# 内存介绍

> 内存模块在Agent架构设计中起着非常重要的作用。它 
> 存储从环境中感知到的信息并利用记录的记忆 
> 促进未来的行动。记忆模块可以帮助代理积累 
> 体验、自我进化，并以更加一致、合理和有效的方式行事。

## 内存模块概述

### 内存操作


在 DB-GPT 代理中，主要有以下三种内存操作：

1. **记忆阅读**：记忆阅读的目的是提取有意义的内容 
记忆中的信息可以增强智能体的行动。
2. **内存写入**：内存写入的目的是存储有关的信息 
记忆中感知的环境。在内存中存储有价值的信息提供了 

为未来检索信息记忆奠定基础，使智能体能够采取行动 
更加高效、合理。
3. **记忆反射**：记忆反射模拟人类见证和记录的能力 
评估他们自己的认知、情感和行为过程。当适应代理时， 
目标是为智能体提供独立总结和总结的能力 
推断出更抽象、复杂和高级的信息。


### 内存结构

在 DB-GPT 代理中，有四种主要的内存结构：
1. **感觉记忆**：和人类的感觉记忆一样，感觉记忆就是寄存器 
感知输入，它会接收来自环境的观察结果，一些感觉
记忆将转移到短期记忆。
2. **短期记忆**：短期记忆暂时缓冲最近的感知，它将接收

一些感觉记忆，可以通过其他观察或检索记忆来增强，从而进入长期记忆。
3. **长期记忆**：长期记忆存储了智能体的经验和知识，它可以接收
短期记忆中的信息，随着时间的推移，它会巩固重要的信息。
4. **混合记忆**：混合记忆是感觉记忆、短期记忆和长期记忆的组合。


## DB-GPT 代理中的内存

### 记忆的一些概念

- `Memory`：内存是一个存储所有内存的类，它可以是`SensorMemory`， 
现在有“短期内存”、“增强型短期内存”、“长期内存”和“混合内存”。
- `MemoryFragment`：`MemoryFragment`是一个存储内存信息的抽象类，  
`AgentMemoryFragment` 是一个继承自 `MemoryFragment` 的类，它包含 

内存内容、内存 ID、内存重要性、上次访问时间等。 
- `GptsMemory`：`GptsMemory` 用于存储会话和计划信息，而不是内存结构的一部分。
- `AgentMemory`：`AgentMemory`是一个包含`Memory`和`GptsMemory`的类。

### 创建内存

正如前面提到的，内存包含在`AgentMemory`类中，下面是一个例子：
```python
from dbgpt.agent import AgentMemory, ShortTermMemory

# Create an agent memory, default memory is ShortTermMemory
memory = ShortTermMemory(buffer_size=5)
agent_memory = AgentMemory(memory=memory)
```
顺便说一句，在`AgentMemory`类中，你可以传递一个`GptsMemory`，在传统意义上， 
`GptsMemory`不包含在内存结构中，它用于存储会话和计划信息。

`GptsMemory` 的一个例子：
```python
from dbgpt.agent import AgentMemory, ShortTermMemory, GptsMemory

# Create an agent memory, default memory is ShortTermMemory
memory = ShortTermMemory(buffer_size=5)
# Store the conversation and plan information
gpts_memory = GptsMemory()
agent_memory = AgentMemory(memory=memory, gpts_memory=gpts_memory)
```
### 在代理中读写内存

Agent会调用read_memories方法从内存中读取内存片段， 
并调用 write_memories 方法将内存片段写入内存。

当agent调用LLM时，内存会写入LLM提示符，LLM返回响应后，
代理会将查询和响应写入内存。


正如我们在[Profile To Prompt](../profile/profile_to_prompt)中提到的，有一个 
提示模板中名为“most_recent_memories”的模板变量，它将被替换为
最近的记忆。

#### 读取记忆以构建提示

下面是一个从内存中读取内存并构建提示的示例：
```python
import os
import asyncio
from dbgpt.agent import (
    AgentContext,
    ShortTermMemory,
    AgentMemory,
    ConversableAgent,
    ProfileConfig,
    LLMConfig,
    BlankAction,
    UserProxyAgent,
)
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
    verbose=True,  # Add verbose=True to print out the conversation history
)

# Create an agent memory, which contains a short-term memory
memory = ShortTermMemory(buffer_size=2)
agent_memory: AgentMemory = AgentMemory(memory=memory)

# Custom user prompt template, which includes most recent memories and question
user_prompt_template = """\
{% if most_recent_memories %}\
Most recent observations:
{{ most_recent_memories }}
{% endif %}\

{% if question %}\
Question: {{ question }}
{% endif %}
"""

# Custom write memory template, which includes question and thought
write_memory_template = """\
{% if question %}user: {{ question }} {% endif %}
{% if thought %}assistant: {{ thought }} {% endif %}\
"""


async def main():
    # Create a profile with a custom user prompt template
    joy_profile = ProfileConfig(
        name="Joy",
        role="Comedians",
        user_prompt_template=user_prompt_template,
        write_memory_template=write_memory_template,
    )
    joy = (
        await ConversableAgent(profile=joy_profile)
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .bind(BlankAction)
        .build()
    )
    user_proxy = await UserProxyAgent().bind(agent_memory).bind(context).build()
    await user_proxy.initiate_chat(
        recipient=joy,
        reviewer=user_proxy,
        message="My name is bob, please tell me a joke",
    )
    await user_proxy.initiate_chat(
        recipient=joy,
        reviewer=user_proxy,
        message="What's my name?",
    )


if __name__ == "__main__":
    asyncio.run(main())
```
在上面的例子中，我们在`AgentContext`中设置`verbose=True`，来打印对话历史记录。

输出将是这样的：
``````shell
--------------------------------------------------------------------------------
User (to Joy)-[]:

"My name is bob, please tell me a joke"

--------------------------------------------------------------------------------
un_stream ai response: Sure thing, Bob! Here's one for you:

Why don’t scientists trust atoms?

Because they make up everything!

--------------------------------------------------------------------------------
String Prompt[verbose]: 
system: You are a Comedians, named Joy, your goal is None.
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




human: 
Question: My name is bob, please tell me a joke

LLM Output[verbose]: 
Sure thing, Bob! Here's one for you:

Why don’t scientists trust atoms?

Because they make up everything!
--------------------------------------------------------------------------------


--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Sure thing, Bob! Here's one for you:\n\nWhy don’t scientists trust atoms?\n\nBecause they make up everything!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Sure thing, Bob! Here's one for you:

Why don’t scientists trust atoms?

Because they make up everything!

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to Joy)-[]:

"What's my name?"

--------------------------------------------------------------------------------
un_stream ai response: Your name is Bob! 

And here's another quick joke for you:

Why don't skeletons fight each other?

They don't have the guts!

--------------------------------------------------------------------------------
String Prompt[verbose]: 
system: You are a Comedians, named Joy, your goal is None.
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




human: Most recent observations:
user: My name is bob, please tell me a joke 
assistant: Sure thing, Bob! Here's one for you:

Why don’t scientists trust atoms?

Because they make up everything! 

Question: What's my name?

LLM Output[verbose]: 
Your name is Bob! 

And here's another quick joke for you:

Why don't skeletons fight each other?

They don't have the guts!
--------------------------------------------------------------------------------


--------------------------------------------------------------------------------
Joy (to User)-[gpt-4o]:

"Your name is Bob! \n\nAnd here's another quick joke for you:\n\nWhy don't skeletons fight each other?\n\nThey don't have the guts!"
>>>>>>>>Joy Review info: 
Pass(None)
>>>>>>>>Joy Action report: 
execution succeeded,
Your name is Bob! 

And here's another quick joke for you:

Why don't skeletons fight each other?

They don't have the guts!

--------------------------------------------------------------------------------
``````
在第二个对话中，您可以在用户提示中看到“最近的观察结果”，
``````
--------------------------------------------------------------------------------
String Prompt[verbose]: 
system: You are a Comedians, named Joy, your goal is None.
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




human: Most recent observations:
user: My name is bob, please tell me a joke 
assistant: Sure thing, Bob! Here's one for you:

Why don’t scientists trust atoms?

Because they make up everything! 

Question: What's my name?

LLM Output[verbose]: 
Your name is Bob! 

And here's another quick joke for you:

Why don't skeletons fight each other?

They don't have the guts!
--------------------------------------------------------------------------------
``````
#### 写下回忆

当代理收到来自LLM的响应时，它将把查询和响应写入内存。
在内存片段中，“内容”是字符串，因此您应该决定如何存储内容中的信息。

在上面的示例中，“write_memory_template”是：
```python
write_memory_template = """\
{% if question %}user: {{ question }} {% endif %}
{% if thought %}assistant: {{ thought }} {% endif %}\
"""
```
“问题”是用户查询，“想法”是LLM响应，我们将在下一节介绍更多。


## 自定义内存读写

我们可以通过继承`ConversableAgent`类来自定义内存读写 
并重写`read_memories`和`write_memories`方法。
```python
from typing import Optional
from dbgpt.agent import (
    ConversableAgent,
    AgentMemoryFragment,
    ProfileConfig,
    BlankAction,
    ActionOutput,
)

write_memory_template = """\
{% if question %}user: {{ question }} {% endif %}
{% if thought %}assistant: {{ thought }} {% endif %}\
"""


class JoyAgent(ConversableAgent):
    profile: ProfileConfig = ProfileConfig(
        name="Joy",
        role="Comedians",
        write_memory_template=write_memory_template,
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._init_actions([BlankAction])

    async def read_memories(
        self,
        question: str,
    ) -> str:
        """Read the memories from the memory."""
        memories = await self.memory.read(observation=question)
        recent_messages = [m.raw_observation for m in memories]
        # Merge the recent messages.
        return "".join(recent_messages)

    async def write_memories(
        self,
        question: str,
        ai_message: str,
        action_output: Optional[ActionOutput] = None,
        check_pass: bool = True,
        check_fail_reason: Optional[str] = None,
    ) -> None:
        """Write the memories to the memory.

        We suggest you to override this method to save the conversation to memory
        according to your needs.

        Args:
            question(str): The question received.
            ai_message(str): The AI message, LLM output.
            action_output(ActionOutput): The action output.
            check_pass(bool): Whether the check pass.
            check_fail_reason(str): The check fail reason.
        """
        if not action_output:
            raise ValueError("Action output is required to save to memory.")

        mem_thoughts = action_output.thoughts or ai_message
        memory_map = {
            "question": question,
            "thought": mem_thoughts,
        }
        # This is the template to write the memory.
        # It configured in the agent's profile.
        write_memory_template = self.write_memory_template
        memory_content: str = self._render_template(write_memory_template, **memory_map)
        fragment = AgentMemoryFragment(memory_content)
        await self.memory.write(fragment)
```
在上面的例子中，我们重写了`read_memories`来从内存中读取内存，在DB-GPT中，
最近的记忆将形成提示模板中的“most_recent_memories”， 
并重写`write_memories`将内存写入内存。

**所以，你可以根据自己的需要自定义内存读写。**

## 总结


在本文档中，我们介绍了 DB-GPT 代理中的内存模块，以及如何在代理中使用内存。
在下面的章节中，我们将介绍如何使用 DB-GPT 代理中的各个内存结构。