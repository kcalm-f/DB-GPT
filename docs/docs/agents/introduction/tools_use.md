# 工具使用

虽然法学硕士可以完成广泛的任务，但它们可能不适用于这些领域 
需要全面的专业知识。此外，LLM还可能遇到 
幻觉问题，很难自行解决。

所以，我们需要使用一些工具来帮助LLM完成任务。

:::注意
在DB-GPT代理中，大多数LLM都支持工具调用，只要自身能力不是太弱。
（如`glm-4-9b-chat`、`Yi-1.5-34B-Chat`、`Qwen2-72B-Instruct`等）
:::

## 书写工具

有时，LLM可能无法直接完成计算任务，所以我们可以 
编写一个简单的计算器工具来帮助他们。
```python
from dbgpt.agent.resource import tool

@tool
def simple_calculator(first_number: int, second_number: int, operator: str) -> float:
    """Simple calculator tool. Just support +, -, *, /."""
    if isinstance(first_number, str):
        first_number = int(first_number)
    if isinstance(second_number, str):
        second_number = int(second_number)
    if operator == "+":
        return first_number + second_number
    elif operator == "-":
        return first_number - second_number
    elif operator == "*":
        return first_number * second_number
    elif operator == "/":
        return first_number / second_number
    else:
        raise ValueError(f"Invalid operator: {operator}")
```
为了测试多个工具，让我们编写另一个工具来帮助 LLM 计算目录中的文件数量。
```python
import os
from typing_extensions import Annotated, Doc

@tool
def count_directory_files(path: Annotated[str, Doc("The directory path")]) -> int:
    """Count the number of files in a directory."""
    if not os.path.isdir(path):
        raise ValueError(f"Invalid directory path: {path}")
    return len(os.listdir(path))
```
## 将您的工具包装到“ToolPack”中

大多数时候，您可能有多个工具，因此您可以将它们包装到“ToolPack”中。
`ToolPack`是一个工具集合，你可以用它来管理你的工具，以及代理 
可以根据任务需求从`ToolPack`中选择合适的工具。
```python
from dbgpt.agent.resource import ToolPack

tools = ToolPack([simple_calculator, count_directory_files])
```
## 使用代理中的工具
```python
import asyncio
import os
from dbgpt.agent import AgentContext, AgentMemory, LLMConfig, UserProxyAgent
from dbgpt.agent.expand.tool_assistant_agent import ToolAssistantAgent
from dbgpt.model.proxy import OpenAILLMClient

async def main():

    llm_client = OpenAILLMClient(
        model_alias="gpt-3.5-turbo",  # or other models, eg. "gpt-4o"
        api_base=os.getenv("OPENAI_API_BASE"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    context: AgentContext = AgentContext(
        conv_id="test123", language="en", temperature=0.5, max_new_tokens=2048
    )
    agent_memory = AgentMemory()
    agent_memory.gpts_memory.init(conv_id="test123")

    user_proxy = await UserProxyAgent().bind(agent_memory).bind(context).build()

    tool_man = (
        await ToolAssistantAgent()
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .bind(tools)
        .build()
    )

    await user_proxy.initiate_chat(
        recipient=tool_man,
        reviewer=user_proxy,
        message="Calculate the product of 10 and 99",
    )

    await user_proxy.initiate_chat(
        recipient=tool_man,
        reviewer=user_proxy,
        message="Count the number of files in /tmp",
    )

    # dbgpt-vis message infos
    print(await agent_memory.gpts_memory.app_link_chat_message("test123"))
    
if __name__ == "__main__":
    asyncio.run(main())

```
输出将是这样的：
``````bash
--------------------------------------------------------------------------------
User (to LuBan)-[]:

"Calculate the product of 10 and 99"

--------------------------------------------------------------------------------
un_stream ai response: {
  "thought": "To calculate the product of 10 and 99, we need to use a tool that can perform multiplication operation.",
  "tool_name": "simple_calculator",
  "args": {
    "first_number": 10,
    "second_number": 99,
    "operator": "*"
  }
}

--------------------------------------------------------------------------------
LuBan (to User)-[gpt-3.5-turbo]:

"{\n  \"thought\": \"To calculate the product of 10 and 99, we need to use a tool that can perform multiplication operation.\",\n  \"tool_name\": \"simple_calculator\",\n  \"args\": {\n    \"first_number\": 10,\n    \"second_number\": 99,\n    \"operator\": \"*\"\n  }\n}"
>>>>>>>>LuBan Review info: 
Pass(None)
>>>>>>>>LuBan Action report: 
execution succeeded,
990

--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
User (to LuBan)-[]:

"Count the number of files in /tmp"

--------------------------------------------------------------------------------
un_stream ai response: {
  "thought": "To count the number of files in /tmp directory, we should use a tool that can perform this operation.",
  "tool_name": "count_directory_files",
  "args": {
    "path": "/tmp"
  }
}

--------------------------------------------------------------------------------
LuBan (to User)-[gpt-3.5-turbo]:

"{\n  \"thought\": \"To count the number of files in /tmp directory, we should use a tool that can perform this operation.\",\n  \"tool_name\": \"count_directory_files\",\n  \"args\": {\n    \"path\": \"/tmp\"\n  }\n}"
>>>>>>>>LuBan Review info: 
Pass(None)
>>>>>>>>LuBan Action report: 
execution succeeded,
19

--------------------------------------------------------------------------------
``````
在上面的代码中，我们使用“ToolAssistantAgent”来选择并调用适当的工具。

## 更多细节？

在上面的代码中，我们使用`tool`装饰器来定义工具函数。它将函数包装到 
`FunctionTool` 对象。而 `FunctionTool` 是 `BaseTool` 的子类，而 `BaseTool` 是所有工具的基类。

实际上，**工具**是`DB-GPT`代理中的一个特殊的**资源**。您将在 [资源](../modules/resource/resource.md) 部分中看到更多详细信息。