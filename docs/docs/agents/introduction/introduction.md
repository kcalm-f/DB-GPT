# 数据驱动的多代理

## 简介

DB-GPT代理是一个数据驱动的多代理系统，旨在提供生产级 
代理开发框架。我们认为生产级代理应用程序需要 
基于数据驱动的决策，并且可以在可控的代理工作流程中进行编排。

### 多级API设计

- Python代理API：使用Python代码构建代理应用程序，您只需使用`pip install "dbgpt[agent]"`安装`dbgpt`包
- 应用程序API：在DB-GPT项目中构建代理应用程序，您可以使用DB-GPT项目中其他模块的所有功能。

大多数时候，您可以使用 Python 代理 API 来构建代理应用程序 
这是一种简单的方法，当您需要将代理部署到生产环境时，只需对代码进行一点更改即可。

## 快速入门

### 安装

首先，您需要使用以下命令安装“dbgpt”包：
```bash
pip install "dbgpt[agent,simple_framework]>=0.7.0" "dbgpt_ext>=0.7.0"
```
然后，您可以使用以下命令安装“openai”包：
```bash
pip install openai
```
### 使用 Agent 编写您的第一个计算器

LLM是代理的“大脑”，现在我们使用OpenAI LLM。
在 DB-GPT 代理中，您可以使用 DB-GPT 当时支持的所有模型，无论它们是 
本地部署的 LLM 或代理模型，无论它们是部署在单机上还是集群中。
```python
import os
from dbgpt.model.proxy import OpenAILLMClient

llm_client = OpenAILLMClient(
    model_alias="gpt-3.5-turbo", # or other models, eg. "gpt-4o"
    api_base=os.getenv("OPENAI_API_BASE"),
    api_key=os.getenv("OPENAI_API_KEY"),
)
```
然后，您应该创建代理上下文和代理内存。
```python
from dbgpt.agent import AgentContext, AgentMemory

# language="zh" for Chinese
context: AgentContext = AgentContext(
    conv_id="test123", language="en", temperature=0.5, max_new_tokens=2048
) 
# Create an agent memory, default memory is ShortTermMemory
agent_memory: AgentMemory = AgentMemory()
```
记忆存储从环境中感知到的信息并利用记录的信息 
记忆以促进未来的行动。
默认内存是“ShortTermMemory”，它只保留最新的“k”轮对话。
您可以使用其他内存，例如“LongTermMemory”、“SensoryMemory”和“HybridMemory”，我们稍后会介绍它们。

然后，您可以创建代码助理代理和用户代理。
```python
import asyncio

from dbgpt.agent import LLMConfig, UserProxyAgent
from dbgpt.agent.expand.code_assistant_agent import CodeAssistantAgent


async def main():

    # Create a code assistant agent
    coder = (
        await CodeAssistantAgent()
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .build()
    )
    
    # Initialize GptsMemory
    agent_memory.gpts_memory.init(conv_id="test123")

    # Create a user proxy agent
    user_proxy = await UserProxyAgent().bind(context).bind(agent_memory).build()

    # Initiate a chat with the user proxy agent
    await user_proxy.initiate_chat(
        recipient=coder,
        reviewer=user_proxy,
        message="Calculate the result of 321 * 123",
    )
    # Obtain conversation history messages between agents
    print(await agent_memory.gpts_memory.app_link_chat_message("test123"))


if __name__ == "__main__":
    asyncio.run(main())

```
您将看到以下输出：
``````bash
--------------------------------------------------------------------------------
User (to Turing)-[]:

"Calculate the result of 321 * 123"

--------------------------------------------------------------------------------
un_stream ai response: ```python
# filename: calculate_multiplication.py

result = 321 * 123
print(result)
```
> > > > > > > > 执行代码块0（推断语言是python）...
调用execute_code时未指定use_docker的值。由于包不可用python docker代码将在本机运行。注意：此后备行为可能会发生变化
un_stream ai 响应：正确

----------------------------------------------------------------------------------------------------------------
图灵（中文二对用户） - [gpt-3.5-turbo] ：

"`` python\ n # 文件名：calculate_multiplication.py\ n\ n 结果 = 321 * 123\ nprint (结果)\ n `` `"
>>>>>>>>图灵评论信息： 
合格（无）
>>>>>>>>图灵行动报告： 
执行成功，

39483

----------------------------------------------------------------------------------------------------------------
```agent-plans
[{"name": "Calculate the result of 321 * 123", "num": 1, "status": "complete", "agent": "Human", "markdown": "```agent-messages\n[{\"sender\": \"CodeEngineer\", \"receiver\": \"Human\", \"model\": \"gpt-3.5-turbo\", \"markdown\": \"```vis-code\\n{\\\"exit_success\\\": true, \\\"language\\\": \\\"python\\\", \\\"code\\\": [[\\\"python\\\", \\\"# filename: calculate_multiplication.py\\\\n\\\\nresult = 321 * 123\\\\nprint(result)\\\"]], \\\"log\\\": \\\"\\\\n39483\\\\n\\\"}\\n```\"}]\n```"}]
```
``````

In DB-GPT agents, most core interfaces are asynchronous for high performance. 
So we will write all the code to build the agent in an asynchronous way. In development, 
you can use the `asyncio.run(main())` to run the agent.

Here is the graph of above code:

<p align="left">
  <img src={'/img/agents/introduction/agents_introduction.png'} width="720px" />
</p>


In the above code, we create a `CodeAssistantAgent` and a `UserProxyAgent`. 
`UserProxyAgent` is a proxy of the user, it is an admin agent that can initiate a chat 
with other agents, and it can review the feedback of the agents.

`CodeAssistantAgent` is a code assistant agent, it will generate some codes to solve 
the question of the user, in this case, it will generate a Python code to calculate the 
result of `321 * 123`, then the code will be executed in its internal `CodeAction`, the 
result will be returned to the user if it is reviewed passed.

In the end of the code, we print the conversation history messages between agents.

## What's Next

- How to use tools in DB-GPT agents
- How to connect to the database in DB-GPT agents
- How to use planning in DB-GPT agents
- How to use various memories in DB-GPT agents
- How to write a custom agent in DB-GPT agents
- How to integrate agents with AWEL(Agentic Workflow Expression Language)
- How to deploy agents in production