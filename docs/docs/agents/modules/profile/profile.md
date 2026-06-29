# 分析模块

> 代理通常通过承担特定角色来执行任务，例如编码员、教师和领域专家。
概要分析模块旨在指示代理角色的概要信息，通常是 
写入提示以影响LLM的行为。代理资料通常包括 
年龄、性别、职业等基本信息，以及心理信息， 
反映代理人的个性和社会信息，详细说明代理人之间的关系。
>
> 用于描述代理的信息的选择很大程度上取决于具体的应用场景。 
例如，如果应用程序旨在研究人类认知过程，那么心理学信息就变得至关重要。


## DB-GPT 代理中的配置文件

配置文件对于 DB-GPT 中的代理至关重要，因为它们用于影响代理的行为。

您已经在[编写您的自定义代理](../../introduction/custom_agents.md) 部分中看到了配置文件的基本示例。
```python
from dbgpt.agent import ConversableAgent, ProfileConfig

class MySummarizerAgent(ConversableAgent):
    profile: ProfileConfig = ProfileConfig(
        # The name of the agent
        name="Aristotle",
        # The role of the agent
        role="Summarizer",
        # The core functional goals of the agent tell LLM what it can do with it.
        goal=(
            "Summarize answer summaries based on user questions from provided "
            "resource information or from historical conversation memories."
        ),
        # Introduction and description of the agent, used for task assignment and display. 
        # If it is empty, the goal content will be used.
        desc=(
            "You can summarize provided text content according to user's questions"
            " and output the summarization."
        ),
    )
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
```
在上面的示例中，“ProfileConfig”类用于定义代理的配置文件。
这是定义代理配置文件的简单方法，您只需提供代理的名称、角色、目标和描述。

让我们看看从配置文件生成的最终提示。
首先，我们单独创建一个配置文件配置。
```python
from dbgpt.agent import ProfileConfig

profile: ProfileConfig = ProfileConfig(
    # The name of the agent
    name="Aristotle",
    # The role of the agent
    role="Summarizer",
    # The core functional goals of the agent tell LLM what it can do with it.
    goal=(
        "Summarize answer summaries based on user questions from provided "
        "resource information or from historical conversation memories."
    ),
    # Introduction and description of the agent, used for task assignment and display. 
    # If it is empty, the goal content will be used.
    desc=(
        "You can summarize provided text content according to user's questions"
        " and output the summarization."
    ),
)

# Create a profile from the configuration
real_profile = profile.create_profile()
system_prompt = real_profile.format_system_prompt(question="What can you do?")
user_prompt = real_profile.format_user_prompt(question="What can you do?")

print(f"System Prompt: \n{system_prompt}")
print("#" * 50)
print(f"User Prompt: \n{user_prompt}")
```
运行上面的代码会产生如下提示：
```
System Prompt: 
You are a Summarizer, named Aristotle, your goal is Summarize answer summaries based on user questions from provided resource information or from historical conversation memories..
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




##################################################
User Prompt: 

Question: What can you do?
```
如您所见，配置文件用于生成系统和用户提示，它们将 
传递给 LLM 以生成响应。

因此，您可以轻松地看到从配置文件生成的真实提示，这非常有用 
在调试和理解代理的行为时，我们不会向您隐藏太多细节。


## 接下来做什么？
- 您可以通过多少种方式为代理创建个人资料？ [了解更多](./profile_creation.md)
- 个人资料如何转换为LLM提示？ [了解更多](./profile_to_prompt.md)