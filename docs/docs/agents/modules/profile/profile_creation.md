# 创建个人资料

在本节中，您将了解有关为代理创建个人资料的更多信息。

## 方法一：使用ProfileConfig类

正如 [Profile](profile.md) 部分中提到的，`ProfileConfig` 类用于 
定义代理的配置文件。这是定义代理配置文件的简单方法。 

正式来说，“ProfileConfig”类支持以下参数：
- `name`：代理的名称。
- `角色`：代理的角色是什么。
- `goal`：代理的核心功能目标告诉 LLM 它可以用它做什么。
- `desc`：代理的介绍和描述，用于任务分配和显示。如果为空，则使用目标内容。
- `constraints`：可以包含多个约束和推理限制逻辑
- `expand_prompt`：要添加到提示中的展开内容，您可以传递一些要添加到提示中的自定义文本。
- `examples`：提示中的一些示例

这是使用“ProfileConfig”类创建配置文件的完整示例：
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
    # Constraints of the agent
    constraints=[
        "Prioritize the summary of answers to user questions from the improved "
        "resource text. If no relevant information is found, summarize it from "
        "the historical dialogue memory given. It is forbidden to make up your "
        "own.",
        "You need to first detect user's question that you need to answer with "
        "your summarization.",
        "Extract the provided text content used for summarization.",
        "Then you need to summarize the extracted text content.",
        "Output the content of summarization ONLY related to user's question. "
        "The output language must be the same to user's question language.",
        "If you think the provided text content is not related to user "
        "questions at all, ONLY output 'Did not find the information you "
        "want.'!!.",
    ],
    # Introduction and description of the agent, used for task assignment and display.
    # If it is empty, the goal content will be used.
    desc=(
        "You can summarize provided text content according to user's questions"
        " and output the summarization."
    ),
    expand_prompt="Keep your answer concise",
    # Some examples in your prompt
    examples=""
)
```
在上面的示例中，我们可以看到“constraints”和“expand_prompt”添加到配置文件中。

让我们看看从配置文件生成的最终提示。
```python
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
Keep your answer concise 

*** IMPORTANT REMINDER ***
Please answer in English.

1. Prioritize the summary of answers to user questions from the improved resource text. If no relevant information is found, summarize it from the historical dialogue memory given. It is forbidden to make up your own.
2. You need to first detect user's question that you need to answer with your summarization.
3. Extract the provided text content used for summarization.
4. Then you need to summarize the extracted text content.
5. Output the content of summarization ONLY related to user's question. The output language must be the same to user's question language.
6. If you think the provided text content is not related to user questions at all, ONLY output 'Did not find the information you want.'!!.



##################################################
User Prompt: 

Question: What can you do?
```
## 方法 2：使用 `ProfileFactory`

这是使用“ProfileFactory”创建配置文件的更灵活的方法。


### 创建配置文件工厂
```python
from typing import Optional
from dbgpt.agent import ProfileFactory, Profile, DefaultProfile

class MyProfileFactory(ProfileFactory):
    def create_profile(
        self,
        profile_id: int,
        name: Optional[str] = None,
        role: Optional[str] = None,
        goal: Optional[str] = None,
        prefer_prompt_language: Optional[str] = None,
        prefer_model: Optional[str] = None,
    ) -> Optional[Profile]:
        return DefaultProfile(
            name="Aristotle",
            role="Summarizer",
            goal=(
                "Summarize answer summaries based on user questions from provided "
                "resource information or from historical conversation memories."
            ),
            desc=(
                "You can summarize provided text content according to user's questions"
                " and output the summarization."
            ),
            expand_prompt="Keep your answer concise",
            examples=""
        )
```
### 使用配置文件工厂

要使用配置文件工厂，您需要将工厂传递给 `ProfileConfig` 类。
在这种情况下，您不需要提供代理的姓名、角色、目标和描述。
```python
from dbgpt.agent import ProfileConfig

profile: ProfileConfig = ProfileConfig(
    factory=MyProfileFactory(),
)
```
让我们看看从配置文件生成的最终提示。
```python
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
Keep your answer concise 

*** IMPORTANT REMINDER ***
Please answer in English.




##################################################
User Prompt: 

Question: What can you do?
```
## 总结

在本节中，您学习了如何使用 
`ProfileConfig` 类和 `ProfileFactory`。
使用这些方法可以灵活且轻松地定义代理的配置文件，尤其是 
当您需要创建数千个代理场景时。