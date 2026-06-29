# 带有代理的计算器

在此示例中，我们将向您展示如何使用代理作为计算器。

## 安装

通过运行以下命令安装所需的软件包：
```bash
pip install "dbgpt[agent]>=0.5.6rc1" -U
pip install openai
```
## 代码

创建一个新的Python文件并添加以下代码：
```python
import asyncio

from dbgpt.agent import AgentContext, AgentMemory, LLMConfig, UserProxyAgent
from dbgpt.agent.expand.code_assistant_agent import CodeAssistantAgent
from dbgpt.model.proxy import OpenAILLMClient


async def main():
    llm_client = OpenAILLMClient(model_alias="gpt-3.5-turbo")
    context: AgentContext = AgentContext(conv_id="test123")
    # Create an agent memory, default memory is ShortTermMemory
    agent_memory: AgentMemory = AgentMemory()

    # Create a code assistant agent
    coder = (
        await CodeAssistantAgent()
        .bind(context)
        .bind(LLMConfig(llm_client=llm_client))
        .bind(agent_memory)
        .build()
    )

    # Create a user proxy agent
    user_proxy = await UserProxyAgent().bind(context).bind(agent_memory).build()

    # Initiate a chat with the user proxy agent
    await user_proxy.initiate_chat(
        recipient=coder,
        reviewer=user_proxy,
        message="calculate the result of 321 * 123",
    )
    # Obtain conversation history messages between agents
    print(await agent_memory.gpts_memory.one_chat_completions("test123"))


if __name__ == "__main__":
    asyncio.run(main())
```
您将看到以下输出：
````bash
Prompt manager is not available.
Prompt manager is not available.
Prompt manager is not available.
Prompt manager is not available.
Prompt manager is not available.

--------------------------------------------------------------------------------
User (to Turing)-[]:

"calculate the result of 321 * 123"

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
[{"name": "calculate the result of 321 * 123", "num": 1, "status": "complete", "agent": "Human", "markdown": "```agent-messages\n[{\"sender\": \"CodeEngineer\", \"receiver\": \"Human\", \"model\": \"gpt-3.5-turbo\", \"markdown\": \"```vis-code\\n{\\\"exit_success\\\": true, \\\"language\\\": \\\"python\\\", \\\"code\\\": [[\\\"python\\\", \\\"# filename: calculate_multiplication.py\\\\n\\\\nresult = 321 * 123\\\\nprint(result)\\\"]], \\\"log\\\": \\\"\\\\n39483\\\\n\\\"}\\n```\"}]\n```"}]
```
````