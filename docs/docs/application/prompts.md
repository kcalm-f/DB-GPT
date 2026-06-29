# 提示

在实际应用开发过程中，不同场景下需要定制Prompt、Agent、RAG等模块。为了使Prompt的编辑和调整更加灵活，创建了独立的Prompt模块。

## 浏览

如下图，点击**应用管理** ->**提示** 即可进入相应的管理界面。界面默认显示自定义提示列表，您可以管理所有提示。

<p对齐=“中心”>
  <img src={'/img/app/prompt_v0.6.jpg'} width="800px" />
</p>

## 添加
接下来，让我们看看如何创建新提示。单击“**添加提示**”按钮，将弹出提示编辑框。

<p对齐=“中心”>
  <img src={'/img/app/prompt_add_v0.6.jpg'} width="800px" />
</p>

我们定义了四种类型的提示： 
- 代理：代理提示 
- SCENE：场景提示 
- NORMAL：正常提示词 
- EVALUATE：评估模式提示

当选择代理类型时，下拉列表菜单中可以看到所有已注册的代理，您可以选择代理来设置提示。

<p对齐=“中心”>
  <img src={'/img/app/agent_prompt_v0.6.jpg'} width="400px" />
</p>

设置提示后，将会生成一个唯一的UID。使用时可以根据ID绑定对应的提示。

<p对齐=“中心”>
  <img src={'/img/app/agent_prompt_code_v0.6.jpg'} width="800px" />
</p>


## 用法

进入AWEL编辑界面，如下图，点击**应用管理** -> **创建工作流**


<p对齐=“中心”>
  <img src={'/img/app/awel_create.6.jpg'} width="800px" />
</p>

找到 Agent 资源并选择 AWEL Layout Agent 运算符。我们可以看到每个Agent包含以下信息： 

- 简介
- 角色
- 目标
- 资源（AWELResource）：Agent所依赖的资源 
- AgentConfig(AWELAgentConfig) 代理配置
- 代理提示：提示

<p对齐=“中心”>
  <img src={'/img/app/agent_prompt_awel_v0.6.jpg'} width="800px" />
</p>

点击**AgentPrompt**旁边的[+]，选择弹出的Prompt算子，在参数面板中选择对应的Prompt名称或者UID，将我们新创建的Prompt绑定到Agent上，依次调试Agent的行为。