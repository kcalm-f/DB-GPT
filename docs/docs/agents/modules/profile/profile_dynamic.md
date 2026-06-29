# 动态配置文件

在前面的章节中，我们介绍了如何从配置文件生成提示。
有时，您只想以简单的方式修改配置文件的一部分，这里我们 
介绍如何创建动态配置文件。

## 配置文件的动态字段

这里我们使用`DynConfig`创建动态配置文件，您可以修改原始配置文件的字段。

创建一个名为“profile_dynamic.py”的Python文件并添加以下代码：
```python
from dbgpt.agent import ProfileConfig, DynConfig

profile: ProfileConfig = ProfileConfig(
    # The name of the agent
    name=DynConfig(
        "Aristotle",
       key="summary_profile_name",
       provider="env"
    ),
    # The role of the agent
    role="Summarizer",
)
```
在上面的例子中，我们使用`DynConfig`创建一个动态配置文件字段“name”， 
默认值为“Aristotle”，键为“summary_profile_name”，提供程序为“env”， 
`provider="env"` 表示将从环境变量中读取该字段的值

然后，您可以根据配置创建配置文件并生成提示。
```python
real_profile = profile.create_profile()
system_prompt = real_profile.format_system_prompt(question="What can you do?")
user_prompt = real_profile.format_user_prompt(question="What can you do?")
print(f"System Prompt: \n{system_prompt}")
print("#" * 50)
print(f"User Prompt: \n{user_prompt}")
```
不设置环境变量运行上面的代码：
```bash
python profile_dynamic.py
```
输出将是：
```
System Prompt: 
You are a Summarizer, named Aristotle, your goal is None.
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




##################################################
User Prompt: 

Question: What can you do?
```
运行上面的代码并设置环境变量：
```bash
summary_profile_name="Plato" python profile_dynamic.py
```
输出将是：
```
System Prompt: 
You are a Summarizer, named Plato, your goal is None.
Please think step by step to achieve the goal. You can use the resources given below. 
At the same time, please strictly abide by the constraints and specifications in IMPORTANT REMINDER.

*** IMPORTANT REMINDER ***
Please answer in English.




##################################################
User Prompt: 

Question: What can you do?
```