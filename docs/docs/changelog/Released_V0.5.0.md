# 发布V0.5.0 |通过工作流和代理开发本机数据应用程序


## 版本 0.5.0 发行说明
经过一段时间的紧张开发，0.5.0版本历时两个多月才得以实现。这标志着 DB-GPT 项目中第一个将长期维护的稳定版本。与此同时，DB-GPT的长期愿景也已正式确定：其目标是成为一个利用代理工作流表达语言（AWEL）和代理的AI原生数据应用开发框架。
从本质上讲，该框架有助于通过基于智能代理的表达语言创建以数据为中心的应用程序。


<p对齐=“左”>
  <img src={'/img/app/app_list.png'} width="720px" />
</p>


## 版本更新介绍

在其早期版本中，DB-GPT 项目提供了六个默认用例，即：
- [聊天数据](https://docs.dbgpt.site/docs/application/started_tutorial/chat_data)
- [ChatExcel](https://docs.dbgpt.site/docs/application/started_tutorial/chat_excel)
- [ChatDB](https://docs.dbgpt.site/docs/application/started_tutorial/chat_db)
- [聊天知识](https://docs.dbgpt.site/docs/application/started_tutorial/chat_knowledge)
- [ChatAgents](https://docs.dbgpt.site/docs/agents)
- [ChatDashboard](https://docs.dbgpt.site/docs/application/started_tutorial/chat_dashboard)

这些场景旨在满足基本且简单的使用需求。然而，对于大规模生产部署，特别是在处理复杂的业务场景时，需要针对特定​​业务情况开发定制场景。这在灵活性和开发复杂性方面提出了重大挑战。


为了进一步增强业务框架的可用性和灵活性，我们在现有功能的基础上进行了构建，包括多模型管理（SMMF）、知识库、代理、数据源、插件和提示。我们抽象出了智能代理编排（AWEL）和应用构建的能力。此外，为了方便应用程序管理和分发，我们引入了[dbgpts](https://github.com/eosphoros-ai/dbgpts)子项目，该子项目专门管理本机智能数据应用程序、AWEL通用运算符、AWEL通用工作流模板和DB-GPT之上的代理的构建。

本次版本更新不会影响之前建立的六种场景的使用。但随着后续的迭代，这些默认场景将逐渐被改写为Data Apps。我们还计划将它们作为默认应用程序合并到“dbgpts”项目中，使它们易于安装和使用。

现在，我们就系统地解释一下本次本地版本的主要更新。

### 术语表：

1. **数据应用程序**：基于DB-GPT构建的智能数据应用程序。 
2. **AWEL**：Agentic Workflow Expression Language，智能工作流表达语言 
3. **AWEL Flow**：使用智能工作流表达式语言进行工作流编排 
4. **SMMF**：面向服务的多模型管理框架。 
5. **数据源**：数据源，例如MySQL、PG、StarRocks、Clickhouse等。

## AWEL 工作流程和应用
如下图所示，在左侧导航栏，有一个AWEL工作流程菜单。打开它后，您可以编排工作流程。

<p对齐=“左”>
  <img src={'/img/app/awel_flow_list.png'} width="720px" />
</p>

默认安装后，AWEL流中没有任何内容。您可以通过两种方式构建它。 
1. 从 DB-GPT 提供的应用程序存储库安装它。 
2. 自己创建。下面介绍以下两种方法的简单使用。更详细的使用请参见DB-GPT下面的教程。

<p对齐=“左”>
  <img src={'/img/app/flow_detail.png'} width="720px" />
</p>

### 从官方存储库安装：

确保首先安装并部署 DB-GPT。
安装和部署后，您可以使用默认的“dbgpt”命令进行各种操作。


:::信息 注意

此过程将允许您随后安装 AWEL 工作流程。
:::

<p对齐=“左”>
  <img src={'/img/app/dbgpts_cli.png'} width="720px" />
</p>

如图所示，dbgpt命令支持多种操作，包括模型相关操作、知识库操作、Trace日志等。这里我们重点关注一下app的操作。

<p对齐=“左”>
  <img src={'/img/app/dbgpts_apps.png'} width="720px" />
</p>

通过 `dbgpt app` list-remote 命令，我们可以看到当前仓库中有 3 个可用的 AWEL 工作流程。这里我们安装 `awel-flow-web-info-search` 这个工作流程。运行命令“dbgpt app install awel-flow-web-info-search”

<p对齐=“左”>
  <img src={'/img/app/dbgpts_app_install.png'} width="720px" />
</p>

安装成功后，重启DB-GPT服务（动态热加载正在进行中），刷新页面，即可在‘AWEL工作流程页面’看到对应的工作流程。

<p对齐=“左”>
  <img src={'/img/app/dbgpts_flow_black.png'} width="720px" />
</p>

### 建立你自己的

除了使用官方命令安装默认的 AWEL 流之外，您通常还需要在实际场景中构建自己的流。如下图所示，点击“New AWEL Flow”，您将进入如图所示的编辑页面。

<p对齐=“左”>
  <img src={'/img/app/awel_flow_node.png'} width="720px" />
</p>

在编辑过程中，每个任务的下游节点和算子都支持自动完成。通过单击每个运算符右下角的加号 (➕)，您可以显示可连接到当前运算符的潜在下游运算符的列表。此功能通过提供建议来增强用户体验，并使构建复杂的工作流程变得更加容易，而无需记住可供使用的操作员的确切名称或类型。

<p对齐=“左”>
  <img src={'/img/app/awel_flow_node_plus.png'} width="720px" />
</p>

## 创建数据应用程序

我们介绍了AWEL的构建和安装工作流程。接下来，我们将介绍如何基于大模型创建数据应用。

### 搜索聊天应用程序
搜索对话应用的核心能力是通过搜索引擎（如百度、谷歌）搜索相关知识，然后进行总结和解答。效果如下：

<p对齐=“左”>
  <img src={'/img/app/app_search.png'} width="720px" />
</p>

创建上述应用程序非常简单。在应用创建面板中，点击“创建”，输入以下参数即可完成创建。注意几个参数。 1.工作模式 2.流程 我们这里使用的工作模式是`awel_layout`，选择的AWEL工作流程是之前安装的。 `awel-flow-web-info-search` 这个工作流程。

<p对齐=“左”>
  <img src={'/img/app/app_awel.png'} width="720px" />
</p>

### 数据分析助手 
使用Multi-Agents编写数据分析助手应用程序。结果如下。

<p对齐=“左”>
  <img src={'/img/app/app_analysis.png'} width="720px" />
</p>


<p对齐=“左”>
  <img src={'/img/app/app_analysis_black.png'} width="720px" />
</p>

## 其他更新细节
- 发布 dbgpt 核心 sdk (#1092)：现在包括 AWEL 操作员编排功能。
要安装，您可以使用命令：`pip install dbgpt`

- 支持 Jina Embeddings (#1105)：该更新与 Jina AI 集成，提供了一种创建和管理各种数据类型嵌入的方法，增强了应用程序内的搜索和相似性任务。

- 使用 AWEL 进行模式链接的新示例 (#1081)：有一个新示例演示了如何使用 AWEL 进行模式链接，这对于需要在不同数据模式之间进行映射的任务非常有价值。

- 统一卡片 UI 风格，包括知识库卡片、模型管理卡片等：此更新为以卡片格式显示信息的不同 UI 组件带来了更加一致的外观和感觉。

## 错误修复
- MySQL 数据库不再支持自动表创建和字段自动更新 (#1133)：此更改可能需要开发人员手动处理数据库架构更改，从而改善对数据库迁移的控制。

- 修复了带有历史消息记录的默认对话的问题（#1117）：这通过确保正确处理历史记录来解决潜在的隐私或性能问题。

- 修复了示例/awel 中从 model_config 不正确获取 model_name 的问题 (#1112)：这通过确保正确获取和使用模型配置来提高 AWEL 示例的可靠性。

- 修复了 DAG 共享数据问题 (#1102)：此修复可能与有向无环图 (DAG) 中的数据隔离有关，以确保工作流程不会无意中共享或覆盖数据。

- 修复了示例/awel 默认加载模型 text2vec-large-chinese 的问题 (#1095)：此修复可确保大型中文文本到矢量模型按给定示例中的预期加载。

这些更改反映了 dbgpt 项目的持续改进、增强其功能、修复已知问题并改善用户体验。用户应参阅官方文档或发行说明，以获取有关这些更新的详细说明和信息。


## 升级至V0.5.0

如果您当前的版本是V0.4.6或V0.4.7，则需要升级到V0.5.0。 
1. 暂停服务 
2.升级数据库表结构
```sql
-- dbgpt.dbgpt_serve_flow definition
CREATE TABLE `dbgpt_serve_flow` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Auto increment id',
  `uid` varchar(128) NOT NULL COMMENT 'Unique id',
  `dag_id` varchar(128) DEFAULT NULL COMMENT 'DAG id',
  `name` varchar(128) DEFAULT NULL COMMENT 'Flow name',
  `flow_data` text COMMENT 'Flow data, JSON format',
  `user_name` varchar(128) DEFAULT NULL COMMENT 'User name',
  `sys_code` varchar(128) DEFAULT NULL COMMENT 'System code',
  `gmt_created` datetime DEFAULT NULL COMMENT 'Record creation time',
  `gmt_modified` datetime DEFAULT NULL COMMENT 'Record update time',
  `flow_category` varchar(64) DEFAULT NULL COMMENT 'Flow category',
  `description` varchar(512) DEFAULT NULL COMMENT 'Flow description',
  `state` varchar(32) DEFAULT NULL COMMENT 'Flow state',
  `source` varchar(64) DEFAULT NULL COMMENT 'Flow source',
  `source_url` varchar(512) DEFAULT NULL COMMENT 'Flow source url',
  `version` varchar(32) DEFAULT NULL COMMENT 'Flow version',
  `label` varchar(128) DEFAULT NULL COMMENT 'Flow label',
  `editable` int DEFAULT NULL COMMENT 'Editable, 0: editable, 1: not editable',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_uid` (`uid`),
  KEY `ix_dbgpt_serve_flow_sys_code` (`sys_code`),
  KEY `ix_dbgpt_serve_flow_uid` (`uid`),
  KEY `ix_dbgpt_serve_flow_dag_id` (`dag_id`),
  KEY `ix_dbgpt_serve_flow_user_name` (`user_name`),
  KEY `ix_dbgpt_serve_flow_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- dbgpt.gpts_app definition
CREATE TABLE `gpts_app` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'autoincrement id',
  `app_code` varchar(255) NOT NULL COMMENT 'Current AI assistant code',
  `app_name` varchar(255) NOT NULL COMMENT 'Current AI assistant name',
  `app_describe` varchar(2255) NOT NULL COMMENT 'Current AI assistant describe',
  `language` varchar(100) NOT NULL COMMENT 'gpts language',
  `team_mode` varchar(255) NOT NULL COMMENT 'Team work mode',
  `team_context` text COMMENT 'The execution logic and team member content that teams with different working modes rely on',
  `user_code` varchar(255) DEFAULT NULL COMMENT 'user code',
  `sys_code` varchar(255) DEFAULT NULL COMMENT 'system app code',
  `created_at` datetime DEFAULT NULL COMMENT 'create time',
  `updated_at` datetime DEFAULT NULL COMMENT 'last update time',
  `icon` varchar(1024) DEFAULT NULL COMMENT 'app icon, url',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gpts_app` (`app_name`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gpts_app_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'autoincrement id',
  `app_code` varchar(255) NOT NULL COMMENT 'Current AI assistant code',
  `user_code` int(11) NOT NULL COMMENT 'user code',
  `sys_code` varchar(255) NOT NULL COMMENT 'system app code',
  `created_at` datetime DEFAULT NULL COMMENT 'create time',
  `updated_at` datetime DEFAULT NULL COMMENT 'last update time',
  PRIMARY KEY (`id`),
  KEY `idx_app_code` (`app_code`),
  KEY `idx_user_code` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="gpt collections";

-- dbgpt.gpts_app_detail definition
CREATE TABLE `gpts_app_detail` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'autoincrement id',
  `app_code` varchar(255) NOT NULL COMMENT 'Current AI assistant code',
  `app_name` varchar(255) NOT NULL COMMENT 'Current AI assistant name',
  `agent_name` varchar(255) NOT NULL COMMENT ' Agent name',
  `node_id` varchar(255) NOT NULL COMMENT 'Current AI assistant Agent Node id',
  `resources` text COMMENT 'Agent bind  resource',
  `prompt_template` text COMMENT 'Agent bind  template',
  `llm_strategy` varchar(25) DEFAULT NULL COMMENT 'Agent use llm strategy',
  `llm_strategy_value` text COMMENT 'Agent use llm strategy value',
  `created_at` datetime DEFAULT NULL COMMENT 'create time',
  `updated_at` datetime DEFAULT NULL COMMENT 'last update time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_gpts_app_agent_node` (`app_name`,`agent_name`,`node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

```SQL
ALTER TABLE `gpts_conversations`
ADD COLUMN `team_mode` varchar(255) NULL COMMENT 'agent team work mode';

ALTER TABLE `gpts_conversations`
ADD COLUMN  `current_goal` text COMMENT 'The target corresponding to the current message';
```
3.重新安装依赖
```shell
pip install -e ".[default]"
```
4.启动服务

## 致谢
我们向所有使此版本成为可能的贡献者表示最深切的感谢！

@Aralhi、@Aries-ckt、@JoanFM、@csunny、@fangyinc、@Hhh_97、@junewgl、@lcxadml、@likenamehaojie、@xiuzhu9527 和 @yhjun1026

## 附录 
- DB-GPT框架：https://github.com/eosphoros-ai 
- Text2SQL 微调：https://github.com/eosphoros-ai/DB-GPT-Hub 
- DB-GPT-Web：https://github.com/eosphoros-ai/DB-GPT-Web 
- 官方英文文档：http://docs.dbgpt.site/docs/overview 
- 官方中文文档：https://www.yuque.com/eosphoros/dbgpt-docs/bex30nsv60ru0fmx