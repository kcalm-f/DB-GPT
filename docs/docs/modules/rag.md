# MS-RAG

多源增强检索-增强生成框架（MS-RAG）

# 简介

大型语言模型 (LLM) 很强大，但它们只能根据训练过的数据来回答。当用户需要最新或特定领域的信息（例如内部文档、专有数据库或最新报告）时，仅法学硕士是不够的。

**检索增强生成 (RAG)** 通过从外部知识源检索相关信息并在生成响应之前将其作为上下文提供给 LLM，从而弥补了这一差距。这确保答案基于真实数据而不是记忆模式。

DB-GPT 实现了超越基本文档问答的**多源 RAG (MS-RAG)** 框架。它支持多种知识源（文档、URL、数据库、知识图）、多种检索策略（向量、关键字、图、混合），并与 DB-GPT 代理和工作流生态系统深度集成。

# 架构

## 总体管道

MS-RAG 管道由四个阶段组成：
```
Knowledge Source → Chunking → Indexing → Retrieval → LLM Generation
```
1. **知识加载** — `KnowledgeFactory` 根据类型和文件扩展名自动将数据源（文件、URL、文本）路由到适当的 `Knowledge` 实现。
2. **分块** — `ChunkManager` 使用可配置的策略（按大小、页面、段落、分隔符或 Markdown 标题）将加载的文档拆分为可管理的块。
3. **索引** - `Assembler` 类（Embedding、BM25、Summary、DBSchema）将块保存到适当的索引存储（向量数据库、全文引擎或知识图）中。
4. **检索和生成** - 在查询时，“Retriever”获取相关块，可选的“QueryRewrite”扩展查询，“Ranker”在 LLM 生成最终答案之前对结果重新排名。

## 汇编器管道

`BaseAssembler` 定义了一个连接所有阶段的统一管道：
```python
Knowledge.load() → ChunkManager.split() → Assembler.persist() → Assembler.as_retriever()
```
DB-GPT 提供四种专用汇编器：

|汇编器|目的|索引后端 |
|---|---|---|
| **嵌入汇编器** |向量相似度 RAG（最常见）|矢量商店（Chroma、Milvus 等）|
| **BM25汇编器** |基于关键词的全文检索|弹性搜索 |
| **摘要汇编器** |针对长文档的基于摘要的 RAG |矢量商店|
| **DBSchemaAssembler** | Text2SQL 的数据库模式检索 |矢量商店|

# 知识来源

DB-GPT 支持从多种源类型加载知识。在Web UI中，您可以在上传时选择数据源类型：

<p对齐=“中心”>
  <img src={'/img/rag/knowledge_datasource_type.png'} width="720px" />
</p>

## 数据源类型

|类型 |描述 |示例|
|---|---|---|
| **文件** |上传各种格式的文件 | PDF、Word、Excel、CSV、Markdown、PowerPoint、TXT、HTML、JSON、ZIP |
| **网址** |获取网页内容并建立索引 |任何可访问的 HTTP/HTTPS URL |
| **文字** |直接输入原始文本 |在 UI 中粘贴文本内容 |
| **玉雀** |从语雀文档平台导入|语雀文档链接|

## 支持的文档格式

|格式|扩展|知识课堂|
|---|---|---|
| PDF | `.pdf` | `PDF知识` |
| CSV | `.csv` | `CSV知识` |
|降价| `.md` | `Markdown知识` |
|字 (docx) | `.docx` | `Docx知识` |
|字（遗留）| `.doc` | `Word97DocKnowledge` |
| Excel | `.xlsx` | `Excel知识` |
|幻灯片| `.pptx` | `PPTX知识` |
|纯文本| `.txt` | `TXT知识` |
| HTML | `.html` | `HTML知识` |
| JSON | `.json` | `JSON 知识` |

# 存储类型

创建知识库时，您可以选择三种存储类型：

<p对齐=“中心”>
  <img src={'/img/rag/choose_knowledge_type.png'} width="720px" />
</p>

|存储类型|描述 |最适合 |
|---|---|---|
| **矢量商店** |存储文档嵌入以进行语义相似性搜索 |通用文档问答 |
| **知识图谱** |将实体和关系存储为图形结构 |具有复杂实体关系的领域知识 |
| **全文** |基于关键字检索的全文索引 |词条精确匹配和关键词搜索 |

## 矢量存储后端

|后端|描述 |安装额外 |
|---|---|---|
| **ChromaDB** |默认嵌入矢量数据库，零设置| `storage_chromadb` |
| **Milvus** |生产规模的分布式矢量数据库| `storage_milvus` |
| **PGVector** |用于向量运算的 PostgreSQL 扩展 | `storage_pgvector` |
| **瓦尔基** |具有 HNSW/FLAT 索引的高性能内存向量存储 | `storage_valkey` |
| **偏离** |云原生矢量搜索引擎| `storage_weaviate` |
| **弹性搜索** |全文+矢量混合搜索| `storage_elasticsearch` |
| **海洋基地** |云原生分布式数据库| `storage_oceanbase` |

## 知识图后端

|后端|描述 |
|---|---|
| **图图** |蚂蚁集团高性能图数据库 |
| **Neo4j** |流行的开源图数据库 |
| **MemGraph** |用于低延迟查询的内存图形数据库 |

## 全文后端

|后端|描述 |
|---|---|
| **弹性搜索** |行业标准全文搜索引擎 |
| **打开搜索** | AWS 管理的搜索和分析套件 |

# 检索策略

DB-GPT提供多种检索模式。您可以在知识库设置中配置检索模式：

<p对齐=“中心”>
  <img src={'/img/rag/embedding_retrieve_mode.png'} width="720px" />
</p>

|战略|描述 |需要后端 |
|---|---|---|
| **语义** |使用嵌入进行向量相似度搜索 |矢量商店|
| **关键字** |基于BM25的关键词匹配 |弹性搜索 |
| **混合** |将矢量 + 关键字搜索与倒数排名融合 (RRF) 相结合 |矢量存储 + Elasticsearch |
| **树** |分层文档的树结构检索 |矢量商店|

## 查询增强

除了基本检索之外，DB-GPT 还提供高级查询处理：

- **查询重写** — 使用法学硕士将原始查询扩展并改写为多个搜索查询，以便更好地回忆。
- **重新排名** - 初始检索后，重新排名模型会对结果进行重新评分和重新排序，以获得更高的精度。

### 支持的重新排序器

|重新排序 |类型 |描述 |
|---|---|---|
| **CrossEncoderRanker** |本地|使用句子转换器 CrossEncoder 模型 |
| **QwenRerankEmbeddings** |本地| Qwen3-Reranker 通过 Transformer |
| **OpenAPIRerankEmbeddings** |应用程序接口 |兼容 OpenAI 风格的 rerank API |
| **RRFRanker** |算法|用于合并多源结果的倒数排名融合 |
| **默认Ranker** |算法|简单的基于分数的排序 |

# 分块策略

文档分块是 RAG 质量的关键步骤。 DB-GPT 支持多种分块策略：

<p对齐=“中心”>
  <img src={'/img/rag/file_chunk.png'} width="720px" />
</p>

|战略|分离器|描述 |
|---|---|---|
| **按尺寸分块** | `RecursiveCharacterTextSplitter` |按字符数拆分，并可配置大小和重叠（默认值：512 / 50）|
| **按页面分块** | `PageTextSplitter` |在页面边界处分割（对于 PDF 很有用）|
| **按段落分块** | `段落文本分割器` |在段落边界处分割 |
| **按分隔符分块** | `SeparatorTextSplitter` |在自定义分隔符字符串处拆分 |
| **按 Markdown 标题划分** | `MarkdownHeaderTextSplitter` |按 Markdown 标题级别拆分 |

## 分块参数

<p对齐=“中心”>
  <img src={'/img/rag/embedding_argument.png'} width="720px" />
</p>

|参数|描述 |默认|
|---|---|---|
| **块大小** |每个块的最大字符数 | 512 | 512
| **块重叠** |相邻块之间的重叠字符 | 50 | 50
| **顶k** |每个查询检索的块数 | 5 |
| **召回分数** |最低相关性分数阈值 | 0 |
| **召回类型** |召回策略（TopK）|热门 |
| **型号** |使用的嵌入模型 |取决于配置 |

# 嵌入模型

DB-GPT 支持多种嵌入模型，用于将文本转换为向量表示：

## 本地模型

|型号|班级 |描述 |
|---|---|---|
| **拥抱脸** | `HuggingFaceEmbeddings` |通用 HuggingFace 模型 |
| **BGE 系列** | `HuggingFaceBgeEmbeddings` | BAAI BGE模型带指令支持（中/英文）|
| **导师** | `HuggingFaceInstructEmbeddings` |遵循指令的嵌入模型 |

## 远程 API 模型

|供应商|班级 |描述 |
|---|---|---|
| **兼容 OpenAI** | `OpenAPIEmbeddings` |任何兼容 OpenAI 的嵌入 API |
| **吉娜** | `JinaEmbeddings` |吉娜AI嵌入服务|
| **奥拉马** | `OllamaEmbeddings` |本地 Ollama 嵌入服务器 |
| **统一（阿里云）** | `统一嵌入` |阿里云DashScope |
| **千帆（百度）** | `QianfanEmbeddings` |百度文信平台|
| **SiliconFlow** | `SiliconFlowEmbeddings` | SiliconFlow 嵌入服务 |

# 知识图谱 RAG

除了传统的基于向量的 RAG 之外，DB-GPT 还支持用于结构化知识检索的**知识图 RAG**。

## 它是如何工作的

1. **三元组提取** — 法学硕士从文档中提取实体和关系作为（主语、谓语、宾语）三元组。
2. **图形存储** — 三元组存储在图形数据库（TuGraph、Neo4j 或 MemGraph）中。
3. **图检索** — 在查询时，`GraphRetriever` 结合了四个子策略：
   - **基于关键字** — 通过提取的关键字匹配图节点
   - **基于向量** - 图节点嵌入的语义相似性搜索
   - **基于文本** — 通过 LLM 将自然语言转换为图形查询语言 (Text2GQL)
   - **基于文档** — 通过文档图关联检索
4. **社区总结** - 总结图社区以进行高级理解。

# 用法

## 创建知识库（Web UI）

### 步骤 1 — 开放知识管理

导航至侧栏中的 **知识** 部分。

<p对齐=“中心”>
  <img src={'/img/rag/create_knowledge.png'} width="720px" />
</p>

### 第 2 步 — 创建和配置

1. 单击“**创建**”启动新的知识库。
2. 选择**存储类型**（矢量存储、知识图或全文）。
3. 选择**嵌入模型**并配置块参数。

<p对齐=“中心”>
  <img src={'/img/rag/choose_knowledge_type.png'} width="720px" />
</p>

### 第 3 步 — 上传数据

选择数据源类型并上传您的内容。支持的类型包括文档（PDF、Word、Excel、CSV等）、URL、文本、语雀。

### 步骤 4 — 配置分块

选择分块策略并设置参数：

<p对齐=“中心”>
  <img src={'/img/rag/file_chunk.png'} width="720px" />
</p>

### 步骤 5 — 配置检索策略（可选）

您可以为您的知识库配置检索策略。 DB-GPT 支持多种检索模式——**语义**、**关键字**、**混合**和**树**——以适应不同的查询场景。在知识库设置中选择最适合您的用例的模式。

<p对齐=“中心”>
  <img src={'/img/rag/embedding_retrieve_mode.png'} width="720px" />
</p>

### 第 6 步 — 运用您的知识进行交流

转到 **聊天**，单击聊天输入工具栏中的知识库图标，从下拉列表中选择您的知识库，然后开始提问。

<p对齐=“中心”>
  <img src={'/img/rag/use_knowledge.png'} width="720px" />
</p>

## 编程用法（Python API）
```python
from dbgpt.rag import Chunk
from dbgpt_ext.rag.assembler import EmbeddingAssembler
from dbgpt_ext.rag.knowledge import KnowledgeFactory

# Load knowledge from a file
knowledge = KnowledgeFactory.create(file_path="your_document.pdf")

# Build the embedding index
assembler = await EmbeddingAssembler.aload_from_knowledge(
    knowledge=knowledge,
    index_store=your_vector_store,
    embedding_model=your_embedding_model,
)
assembler.persist()

# Retrieve relevant chunks
retriever = assembler.as_retriever(top_k=5)
chunks = await retriever.aretrieve("What is the main topic?")
```
# 后续步骤

|主题 |链接 |
|---|---|
|知识库 Web UI 指南 | [知识库](/docs/getting-started/web-ui/knowledge-base) |
| RAG 概念 | [RAG](/docs/getting-started/concepts/rag) |
|图 RAG 设置 | [图 RAG](/docs/application/graph_rag) |
| AWEL RAG 操作员 | [AWEL](/docs/getting-started/concepts/awel) |
|源代码 | [GitHub](https://github.com/eosphoros-ai/DB-GPT/tree/main/packages/dbgpt-core/src/dbgpt/rag) |