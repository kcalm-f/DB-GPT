# 高可用性


## 架构

这里是高可用集群的架构，更多细节可以参见 
[集群部署](./cluster.md)模式和[SMMF](../../modules/smmf.md)模块。

<p对齐=“中心”>
  <img src={'/img/module/smmf.png'} width="600px" />
</p>

Model Worker和API Server可以部署在不同的机器上，模型 
Worker 和 API Server 可以部署多个实例。
但是模型控制器默认只有一个实例，因为它是有状态的 
service，存储模型服务的所有元数据，具体来说，所有元数据都是 
存储在名为**模型注册表**的组件中。

默认模型注册表是“EmbeddedModelRegistry”，它是一个简单的内存组件。
为了支持高可用性，我们可以使用“StorageModelRegistry”作为模型注册表， 
可以使用数据库作为存储后端，例如MySQL、SQLite等。

因此，我们可以将模型控制器部署到多个实例，并且它们可以通过连接到同一数据库来共享元数据。

现在我们来看看如何部署高可用集群。

## 部署高可用集群
为简单起见，我们将在两台机器上部署两个模型控制器（“server1”和“server2”）， 
并在另一台机器（`server3`）上部署一个模型工作人员、一个嵌入模型工作人员和一个 Web 服务器。

（当然，您可以将它们全部部署在具有不同端口的同一台计算机上。）

### 准备MySQL数据库

1.安装MySQL，为模型控制器创建数据库和用户。
2. 为模型控制器创建表，可以使用以下SQL脚本来创建表。
```sql

-- For deploy model cluster of DB-GPT(StorageModelRegistry)
CREATE TABLE IF NOT EXISTS `dbgpt_cluster_registry_instance` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto increment id',
  `model_name` varchar(128) NOT NULL COMMENT 'Model name',
  `host` varchar(128) NOT NULL COMMENT 'Host of the model',
  `port` int(11) NOT NULL COMMENT 'Port of the model',
  `weight` float DEFAULT 1.0 COMMENT 'Weight of the model',
  `check_healthy` tinyint(1) DEFAULT 1 COMMENT 'Whether to check the health of the model',
  `healthy` tinyint(1) DEFAULT 0 COMMENT 'Whether the model is healthy',
  `enabled` tinyint(1) DEFAULT 1 COMMENT 'Whether the model is enabled',
  `prompt_template` varchar(128) DEFAULT NULL COMMENT 'Prompt template for the model instance',
  `last_heartbeat` datetime DEFAULT NULL COMMENT 'Last heartbeat time of the model instance',
  `user_name` varchar(128) DEFAULT NULL COMMENT 'User name',
  `sys_code` varchar(128) DEFAULT NULL COMMENT 'System code',
  `gmt_created` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation time',
  `gmt_modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record update time',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_model_instance` (`model_name`, `host`, `port`, `sys_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='Cluster model instance table, for registering and managing model instances';

```
### 使用存储模型注册表启动模型控制器

我们需要在两台机器（“server1”和“server2”）上启动模型控制器，并且 
他们将通过连接到同一数据库来共享元数据。

1. 在 `server1` 上启动模型控制器：
```bash
dbgpt start controller \
--port 8000 \
--registry_type database \
--registry_db_type mysql \
--registry_db_name dbgpt \
--registry_db_host 127.0.0.1 \
--registry_db_port 3306 \
--registry_db_user root \
--registry_db_password aa123456
```
2. 在 `server2` 上启动模型控制器：
```bash
dbgpt start controller \
--port 8000 \
--registry_type database \
--registry_db_type mysql \
--registry_db_name dbgpt \
--registry_db_host 127.0.0.1 \
--registry_db_port 3306 \
--registry_db_user root \
--registry_db_password aa123456
```
注：请根据您的实际情况修改参数。

### 启动劳动模范

:::提示
启动 `glm-4-9b-chat` 模型 Worker
:::
```shell
dbgpt start worker --model_name glm-4-9b-chat \
--model_path /app/models/glm-4-9b-chat \
--port 8001 \
--controller_addr "http://server1:8000,http://server2:8000"
```
这里我们使用`server1`和`server2`作为控制器地址，因此模型工作者可以 
注册到任何健康的控制器。

### 开始嵌入 Model Worker
```shell
dbgpt start worker --model_name text2vec \
--model_path /app/models/text2vec-large-chinese \
--worker_type text2vec \
--port 8003 \
--controller_addr "http://server1:8000,http://server2:8000"
```
:::信息说明
⚠️ 确保使用您自己的模型名称和模型路径。

:::

### 部署Web服务器
```shell
LLM_MODEL=glm-4-9b-chat EMBEDDING_MODEL=text2vec \
dbgpt start webserver \
--light \
--remote_embedding \
--controller_addr "http://server1:8000,http://server2:8000"
```
### 显示您的模型实例
```bash
CONTROLLER_ADDRESS="http://server1:8000,http://server2:8000" dbgpt model list
```
恭喜！您已成功部署 DB-GPT 高可用性集群。


## 使用 Docker Compose 部署高可用性集群

如果您想了解有关部署高可用性 DB-GPT 集群的更多信息，您可以查看 
docker compose 的示例位于 `docker/compose_examples/ha-cluster-docker-compose.yml` 中。
它使用OpenAI LLM和OpenAI嵌入模型，因此您可以直接运行它。

这里我们将向您展示如何使用docker compose部署DB-GPT的高可用集群。

首先，构建仅包含 openai 依赖项的 docker 镜像：
```bash
bash ./docker/base/build_proxy_image.sh --pip-index-url https://pypi.tuna.tsinghua.edu.cn/simple
```
然后，运行以下命令启动高可用性集群：
```bash
OPENAI_API_KEY="{your api key}" OPENAI_API_BASE="https://api.openai.com/v1" \
docker compose -f ha-cluster-docker-compose.yml up -d
```
## 质量保证

### 未来会支持更多的模型注册表类型吗？
是的。未来我们将支持更多模型注册表类型，例如`etcd`、`consul`等。

### 如何使用 Kubernetes 部署高可用集群？
未来我们会提供Helm图表来使用Kubernetes部署高可用集群。