# 知识资源

有时，代理需要访问外部知识库来丰富其知识。
这里，我们引入`RetrieverResource`，它是一个可以用来检索的资源 
来自外部知识库的知识。

现在，`RetrieverResource` 有两种类型：
- `RetrieverResource`：可用于从外部知识库检索知识的资源。
- `KnowledgeSpaceRetrieverResource`：`RetrieverResource` 的具体实现 
可用于从 DB-GPT 的知识空间检索知识的类。 
当您在 DB-GPT 环境中运行代理（在 DB-GPT Web 服务器中运行）时，它才起作用。


## 使用 RetrieverResource

（即将推出...）