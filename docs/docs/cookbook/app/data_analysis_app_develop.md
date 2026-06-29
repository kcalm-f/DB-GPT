# 数据应用开发指南

在本文档中，我们将指导您完成使用 DB-GPT 开发数据分析应用程序的过程。

# 目标

在本例中，我们的目标是构建一个包含以下功能的数据助手应用程序：
1、基于文档的智能问答。
2、基于数据库进行数据对话。
3.基于工具使用的互联网搜索。

基于 DB-GPT 提供的意图识别能力，这三种功能可以在单个对话中使用。数据助手会根据用户的询问，匹配合适的子代理应用，回答相应领域的问题。

:::提示
注：本案例主要用于应用搭建演示，生产环境的实际应用还需要进一步优化。
:::

# 准备

在开始构建应用程序之前，首先需要完成项目的安装和部署。相关教程请参考【部署文档】(../../installation/sourcecode.md)。

# 子数据App构建

首先，我们需要分别创建三个子智能应用，然后利用AppLink提供的意图识别能力，将智能应用整合为一个统一的智能实体，并统一对话交互入口。


## 1.基于RAG构建问答助手

我们使用DB-GPT提供的代理模块构建一个基于RAG的问答助手。 DB-GPT有一些内置的代理，例如

- 意图识别专家代理
- CodeEnginner 代理
- 报告生成器代理
- 数据科学家代理
- 文档摘要代理
- ToolExpert代理
- ...

这种情况下，智能问答主要依赖于领域知识库和文档摘要代理（Summarizer），因此我们首先需要构建领域知识库。流程如下：

1. 领域知识清理与组织
2.上传DB-GPT知识
3. 创建基于知识的数据应用程序
4. 与 KBQA 聊天

### 领域知识清理和组织
领域知识的组织和处理是一项非常重要的工作，对最终的效果有着非常重要的影响。您需要根据您的实际应用来整理和清理文件。在本例中，我们使用默认的 PDF 进行上传。我们准备了官方的DB-GPT文档作为演示材料。

### 创建知识库

在产品界面，选择知识库，点击【创建知识】，填写相应参数。我们提供多种存储类型。 1. 嵌入向量 2. 知识图 3. 全文。在本例中，我们使用Embedding方案进行构建。

<p对齐=“中心”>
  <img src={'/img/cookbook/knowledge_base.png'} width="800" />
</p>


填写相应参数后，点击【下一步】选择文档类型并上传文档。

<p对齐=“中心”>
  <img src={'/img/cookbook/knowledge_base_upload.png'} width="800" />
</p>


选择合适的切片方式，等待文档上传。至此，我们的知识库已经搭建完毕，可以进行后续的智能问答应用了

<p对齐=“中心”>
  <img src={'/img/cookbook/knowledge_base_success.png'} width="800" />
</p>

### 创建 KBQA 应用程序

选择【应用管理】->【创建应用】，在弹出的对话框中选择单代理模式。

<p对齐=“中心”>
  <img src={'/img/cookbook/app_create_with_agent.png'} width="800" />
</p>

点击【确定】，在弹出的对话框中
1. 选择Summarizer代理
2. 提示词默认为空。如果需要修改，可以先自定义提示。有关提示定义的教程，请参阅文档。
3.模型策略：支持多种模型策略。如果有多个型号，可以按照优先级进行配置。
4、添加资源：本例依赖的是之前创建的知识库，所以选择资源类型【知识】，参数为刚刚创建的知识库名称。
5.新增推荐问题，【是否生效】控制推荐问题的有效性。

<p对齐=“中心”>
  <img src={'/img/cookbook/qa_app_build_parameters.png'} width="800" />
</p>

点击【保存】即可完成智能应用的创建。

### 开始聊天

<p对齐=“中心”>
  <img src={'/img/cookbook/qa_app_chat.png'} width="800" />
</p>

:::提示
注意：本教程中显示的代理应用程序是基于 Summarizer 代理构建的。 Summarizer 代理是 DB-GPT 的内置代理。相关代码实现请参见【源码】(https://github.com/eosphoros-ai/DB-GPT/blob/main/dbgpt/agent/expand/summary_assistant_agent.py)。实际使用中，可以根据具体场景进一步修改相关代码。定制和优化。或者根据这个案例定制代理
:::

## 数据聊天机器人助手

同理，基于类似的思路也可以构建一个数据对话助手。数据对话助手可以基于数据库进行简单的数据对话，并绘制相应的图表。主要包括以下步骤：

1. 数据准备
2. 创建数据源
3. 创建数据聊天应用程序
4. 聊天

### 数据准备 

数据准备请参考文档中的【数据准备】(https://github.com/eosphoros-ai/DB-GPT/blob/main/docker/examples/dashboard/test_case_mysql_data.py)部分。

### 创建数据源 

准备好数据后，需要将数据库添加到数据源中，以供后续使用。选择【应用管理】->【数据库】->【添加数据源】

<p对齐=“中心”>
  <img src={'/img/cookbook/datasource.png'} width="800" />
</p>

### 创建数据聊天应用程序

如下图所示，选择【应用管理】->【应用】->【创建应用】，选择单个代理应用，填写相应参数，点击确定。

<p对齐=“中心”>
  <img src={'/img/cookbook/data_app_create.png'} width="800" />
</p>

依次选择对应的参数：
- 代理：选择“DataScientist”代理
- 提示：默认为空。如需自定义，请参考提示管理教程。
- 模型策略：此处选择优先策略。您可以根据优先级使用“proxyllm”和“tongyi_proxyllm”模型。
- 可用资源：资源类型选择数据库类型，参数选择我们之前添加的数据库。
- 推荐问题：可根据数据情况设置默认问题。

<p对齐=“中心”>
  <img src={'/img/cookbook/data_app_build_parameters.png'} width="800" />
</p>

### 开始聊天

点击开始对话，输入相应问题进行数据问答。

<p对齐=“中心”>
  <img src={'/img/cookbook/data_app_chat.png'} width="800" />
</p>

## 搜索助手

天气助手需要调用搜索引擎查询相关信息，因此需要设计Tool调用，构建过程相对复杂。为了简化应用程序的创建，我们将相关功能内置到了AWEL工作流程中，可以直接安装使用。

### AWEL 工作流程安装

首先执行命令`dbgpt app list-remote`可以查看远程仓库中所有AWEL示例进程。 `awel-flow-web-info-search` 提供了搜索互联网的能力。
```
dbgpt app list-remote

┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃           存储库  ┃ 类型       ┃                               名称 ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
│ eosphoros/dbgpts │ operators │               awel-simple-operator │
│ eosphoros/dbgpts │ resources │                    jina-web-reader │
│ eosphoros/dbgpts │ resources │          simple-calculator-example │
│ eosphoros/dbgpts │ workflow  │                all-in-one-entrance │
│ eosphoros/dbgpts │ workflow  │        andrewyng-translation-agent │
│ eosphoros/dbgpts │ workflow  │             awel-flow-example-chat │
│ eosphoros/dbgpts │ workflow  │         awel-flow-rag-chat-example │
│ eosphoros/dbgpts │ workflow  │      awel-flow-rag-summary-example │
│ eosphoros/dbgpts │ workflow  │    awel-flow-simple-streaming-chat │
│ eosphoros/dbgpts │ workflow  │          awel-flow-web-info-search │
│ eosphoros/dbgpts │ workflow  │                 db-expert-assisant │
│ eosphoros/dbgpts │ workflow  │ financial-report-knowledge-factory │
│ eosphoros/dbgpts │ workflow  │                financial-robot-app │
│ eosphoros/dbgpts │ workflow  │             rag-save-url-to-vstore │
│ eosphoros/dbgpts │ workflow  │          rag-url-knowledge-example │
└──────────────────┴───────────┴────────────────────────────────────┘

```
执行“dbgpt app install awel-flow-web-info-search”命令在本地安装。
```
dbgpt app install awel-flow-web-info-search

> 
  Installing collected packages: awel-flow-web-info-search
  Successfully installed awel-flow-web-info-search-0.1.0
  Installed dbgpts at ~/.dbgpts/packages/ae442685cde998fe51eb565a23180544/awel-flow-web-info-search.
  dbgpts 'awel-flow-web-info-search' installed successfully.
```
刷新界面。在AWEL工作流程界面中，可以看到对应的工作流程已经安装完毕。

<p对齐=“中心”>
  <img src={'/img/cookbook/awel_web_search.png'} width="800" />
</p>

点击AWEL工作流程，我们可以看到里面的内容。这是一个简短的解释。

1、代理资源：代理所依赖的资源，本例为baidu_search
2. ToolExpert：工具专家，用于实现工具调用。
3. Summarizer代理：用于汇总查询结果。

总结一下：此 AWEL 工作流程使用两个代理：ToolExpert 和 Summarizer。 ToolExpert依赖于内置工具baidu_search。 Summarizer进一步总结工具专家执行的结果并生成最终答案。

<p对齐=“中心”>
  <img src={'/img/cookbook/awel_web_search_tool.png'} width="800" />
</p>

### 创建搜索助手

同时，【创建应用】->【任务流编排模式】

<p对齐=“中心”>
  <img src={'/img/cookbook/search_app.png'} width="800" />
</p>

选择对应的工作流程，添加推荐问题，然后单击“保存”。

<p对齐=“中心”>
  <img src={'/img/cookbook/search_app_build.png'} width="800" />
</p>

### 聊天
<p对齐=“中心”>
  <img src={'/img/cookbook/search_app_chat.png'} width="800" />
</p>


# Unified intelligent application construction

根据以上流程，我们为每个子场景创建了智能应用，但在实际应用中。我们需要在一个入口完成所有的问答，所以我们需要整合这些子领域的代理。通过 AppLink 和意图识别功能统一交互门户。

为了实现问题路由，一个核心能力是意图识别和分类。为了让应用构建在设计上更加灵活，我们提供了基于知识库和Agent的意图识别和分类能力。 And supports customization based on AWEL.



### Intent knowledge base construction

为了实现意图分类并将用户问题路由到相应的智能应用程序，我们首先需要定义和描述每个应用程序的功能。 Here we build it through a knowledge base.下面是一个简单的意图定义文档，用于描述各个智能应用的能力。需要填写的信息主要有四类


1.意图：意图类型

2. App Code：可在应用界面复制。

<p对齐=“中心”>
  <img src={'/img/cookbook/app_code.png'} width="800" />
</p>

3. 描述：描述代理的功能。


4. Slots：Slot信息，用于表示Agent在实际问答中所依赖的参数，例如天气查询中需要的【时间】和【地点】信息。
```
#######################
Intent:DB答疑 App Code:a41d0274-8ac4-11ef-8735-3ea07eeef889 Describe: 所有DB领域相关知识的咨询答疑，包含了日常DBA的FAQ问题数据、OceanBase(OB)的官方文档手册，操作手册、问题排查手册、日常疑难问题的知识总结、可以进行专业的DBA领域知识答疑。 只要和DB相关的不属于其他应用负责范畴的都可以使用我来回答 问题范例: 1.怎么查看OB抖动？ 2.DMS权限如何申请 3.如何确认xxxxx 类型:知识库咨询
#######################
Intent:数据对话 App Code:516963c4-8ac9-11ef-8735-3ea07eeef889 Describe: 通过SQL查询分析当前数据库(dbgpt-test:包含用户和用户销售订单数据的数据库） 类型:数据查询
#######################
Intent:天气检索助手 App Code:f93610cc-8acc-11ef-8735-3ea07eeef889 Describe: 可以进行天气查询 Slots:
位置: 要获取天气信息的具体位置
时间: 要获取的天气信息的时间，如果没有明确提到，使用当前时间

```
### 创建意图分类知识库

如下图所示，创建意图分类知识库。

<p对齐=“中心”>
  <img src={'/img/cookbook/app_intent_knowledge.png'} width="800" />
</p>

需要注意的是，分隔符需要用我们自定义的分隔符来分隔，即文档中的#。

<p对齐=“中心”>
  <img src={'/img/cookbook/chunk_sep.png'} width="800" />
</p>

### AWEL工作流程安装编辑器
再次，为了简化使用。我们已经编写了相应的意图识别AWEL工作流程，可以直接安装使用。
```
dbgpt app install db-expert-assisant

> Installing collected packages: db-expert-assisant
Successfully installed db-expert-assisant-0.1.0
Installed dbgpts at ~/.dbgpts/packages/ae442685cde998fe51eb565a23180544/db-expert-assisant.
dbgpts 'db-expert-assisant' installed successfully.
```
打开前端界面。在AWEL工作流程界面中，我们可以看到db_expert_assisant。为了方便我们后续的编辑，我们复制一个流程进行编辑。点击右上角【复制】，自定义名称和描述，完成复制。

<p对齐=“中心”>
  <img src={'/img/cookbook/awel_db_expert.png'} width="800" />
</p>

我们打开复制的AWEL流程，这里我们将其命名为“db_expert_assistant_v1”，并打开工作流程。我们可以看到下面的编排流程。同样，此工作流程中使用以下代理


1.“意图识别专家”：意图识别专家专门用于意图识别。它依赖于一个知识库资源，也就是我们前面定义的意图识别的知识库资源。

2. `AppLauncher`：用于调用各个领域的专家。

3. `Summarizer`：总结整个问题和答案。如果所有场景都没有路由，则会根据数据库知识库给出默认答案。

<p对齐=“中心”>
  <img src={'/img/cookbook/awel_expert_v1.png'} width="800" />
</p>

### 应用程序创建

创建应用并选择任务流编排模式。


<p对齐=“中心”>
  <img src={'/img/cookbook/data_app_build.png'} width="800" />
</p>

单击“确定”，选择工作流程，输入推荐问题，然后保存。

<p对齐=“中心”>
  <img src={'/img/cookbook/data_app_awel.png'} width="800" />
</p>


### 聊天 
<p对齐=“中心”>
  <img src={'/img/cookbook/data_expert_chat.png'} width="800" />
</p>