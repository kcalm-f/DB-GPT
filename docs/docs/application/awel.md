# 将数据应用程序与 AWEL 结合使用

## 什么是 AWEL？

> Agentic Workflow Expression Language(AWEL)是一套专为大型模型应用而设计的智能代理工作流表达语言
发展。

您可以在 [AWEL](../awel/awel.md) 中找到有关 AWEL 的更多信息以及 
[AWEL教程](../awel/tutorial/)如果您想了解更多关于AWEL的信息。

简而言之，您可以使用 AWEL 通过 AWEL Python API 开发 LLM 应用程序。

## 什么是 AWEL 流？

AWEL 流程允许您无需编写代码即可开发 LLM 应用程序。它构建在 AWEL Python API 之上。


## 在“AWEL Flow”页面中访问您的 AWEL Flows

在“AWEL Flow”页面中，您可以看到您创建的所有 AWEL 流。您还可以通过单击“创建流程”按钮来创建新的 AWEL 流程。


<p对齐=“左”>
  <img src={'/img/application/awel/awel_flow_page.png'} width="720px"/>
</p>


## 示例

### 构建您的 RAG 应用程序

要构建您的RAG应用程序，您需要首先根据[聊天知识库](./apps/chat_knowledge.md)创建一个知识空间。
然后，单击“创建流”按钮创建新流。 

在流程编辑器中，您可以拖放节点来构建 RAG 应用程序。

1. 您将看到一个空的流程编辑器，如下所示：

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_empty_page_img.png'} width="720px"/>
</p>

2. 将“Streaming LLM Operator”节点拖至流程编辑器。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_llm_1.png'} width="720px"/>
</p>

3. 将“Knowledge Operator”节点拖至流程编辑器。

您可以单击“Streaming LLM Operator”节点的第二个输入（“HOContext”）中的“+”按钮， 
它将显示可以连接到当前输入节点的节点列表，然后您可以选择“知识运算符”节点。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_llm_2_.png'} width="720px"/>
</p>

节点的选项可以连接如下：

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_llm_3.png'} width="720px"/>
</p>

然后，拖动“Knowledge Operator”节点并将其连接到“Streaming LLM Operator”节点。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_def_rag_ko_1.png'} width="720px"/>
</p>

请在“知识运算符”节点的“知识空间名称”选项中选择您的知识空间。

4. 将“Common LLM Http Trigger”节点拖至流程编辑器。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_ko_2.png'} width="720px"/>
</p>

4. 将“公共聊天提示模板”**资源**节点拖至流程编辑器。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_prompt_1.png'} width="720px"/>
</p>

您可以在“通用聊天提示模板”参数中输入您的提示模板。

5. 将“OpenAI Streaming Output Operator”节点拖至流程编辑器。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_output_1.png'} width="720px"/>
</p>

6. 单击右上角的“保存”按钮保存您的流程。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_save_1.png'} width="720px"/>
</p>

最后，您将在“AWEL Flow”页面中看到您的 RAG 应用程序。

<p对齐=“左”>
  <img src={'/img/application/awel/flow_dev_rag_show_1.png'} width="720px"/>
</p>

之后您就可以根据【应用管理】(./apps/app_manage.md)来构建您的APP。

## 参考

- [AWEL](../awel/awel.md)
- [AWEL 食谱](../awel/cookbook/)
- [AWEL 教程](../awel/tutorial/)

---

📖 想了解更多关于 AWEL 的信息吗？查看 [AWEL 教程](../awel/tutorial/) 获取从基础到高级模式的分步指南。