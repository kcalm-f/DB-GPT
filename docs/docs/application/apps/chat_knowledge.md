# 聊天知识库

「聊天知识库」提供基于私有领域知识的问答能力，可以基于「知识库」构建智能问答系统、阅读助手等产品。 DB-GPT 中还使用了“RAG”技术来增强知识检索。


## 名词解释

:::信息说明

‘知识空间’：是管理一类知识的文档空间。同一类型的文档知识可以上传到知识空间。
:::


## 步骤
知识库操作流程比较简单，主要分为以下几个步骤。
- 1.创造知识空间
- 2.上传文件
- 3.等待文档矢量化
- 4.选择知识库应用程序
- 5.与应用程序聊天


### 创建知识空间

首先打开“构建应用程序”并选择顶部的“知识”。

<p对齐=“中心”>
  <img src={'/img/app/knowledge_build_v0.6.jpg'} width="800px" />
</p>

选择知识库，点击“创建”按钮，填写必要信息即可完成知识空间的创建。


<p对齐=“中心”>
  <img src={'/img/app/knowledge_space_v0.6.jpg'} width="800px" />
</p>

### 上传文件

文档添加目前支持多种类型，如纯文本、URL爬取等，以及PDF、Word、Markdown等多种文档类型。选择要“上传”的特定文档。

<p对齐=“左”>
  <img src={'/img/chat_knowledge/upload_doc.png'} width="720px" />
</p>


选择一个或多个相应的文档，然后单击“下一步”。


<p对齐=“左”>
  <img src={'/img/chat_knowledge/upload_doc_finish.png'} width="720px" />
</p>

### 文档分割

选择文档分段，您可以选择按块大小、分隔符、段落或 Markdown 标题对文档进行分段。默认是按块大小对文档进行分段。

然后点击处理，需要几分钟的时间才能完成文档分割。

<p对齐=“左”>
  <img src={'/img/chat_knowledge/doc_segmentation.png'} width="720px" />
</p>

:::提示
**自动：根据文档类型自动对文档进行分段。**

**块大小：文档每个片段中的单词数。默认为 512 个字。**
    - 块大小：文档每个段中的单词数。默认为 512 个字。
    - 块重叠：文档每个片段之间重叠的单词数。默认为 50 个字。
** 分隔符：按分隔符分割** 
    - 分隔符：文档的分隔符。默认值为“\n”。
    -enable_merge：分割后是否根据chunk_size合并分隔块。默认为“False”。
** Page：页面分割，仅支持.pdf和.pptx文档。**

** Paragraph：段落分割，仅支持.docx文档。**
    - 分隔符：文档的段落分隔符。默认值为“\n”。

** Markdown header：markdown header分割，仅支持.md文档。**
:::


### 等待文档矢量化

点击‘知识空间’，观察左下角文档‘切片’+‘矢量化’状态。当状态达到“已完成”时，您可以开始知识库对话。


<p对齐=“左”>
  <img src={'/img/chat_knowledge/waiting_doc_vector.png'} width="720px" />
</p>


### 知识库聊天

单击“聊天”按钮开始与知识库对话。


<p对齐=“左”>
  <img src={'/img/chat_knowledge/chat.png'} width="720px" />
</p>


###阅读助手
除了上述功能外，您还可以直接在知识库对话窗口中上传文档，文档将默认进行汇总。该能力可以作为“阅读助手”，辅助文档阅读。

<p对齐=“左”>
  <img src={'/img/chat_knowledge/read_helper.gif'} width="720px" />
</p>