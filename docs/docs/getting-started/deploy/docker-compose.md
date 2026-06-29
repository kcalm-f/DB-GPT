---
sidebar_position: 2
title: Docker Compose Deployment
---
# Docker Compose 部署

使用 Docker Compose 部署 DB-GPT 和 MySQL — 一种具有持久存储的生产就绪设置。
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
## 先决条件

- 安装了 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)
- 来自支持的提供商的 API 密钥

## 快速开始

根“docker-compose.yml”使用 MySQL 数据库和 SiliconFlow 作为默认的 LLM 提供程序部署 DB-GPT。

### 第 1 步 — 设置您的 API 密钥
<Tabs>
  <TabItem value="siliconflow" label="SiliconFlow" default>

```bash
export SILICONFLOW_API_KEY="your-siliconflow-api-key"
```
在[SiliconFlow](https://cloud.siliconflow.cn/account/ak)获取密钥。
  </TabItem>
  <TabItem value="aiml" label="AI/ML API">

```bash
export AIMLAPI_API_KEY="your-aiml-api-key"
```
在 [AI/ML API](https://aimlapi.com/) 获取密钥。
  </TabItem>
</Tabs>
### 第 2 步 — 启动服务
<Tabs>
  <TabItem value="siliconflow" label="SiliconFlow" default>

```bash
SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY} docker compose up -d
```

  </TabItem>
  <TabItem value="aiml" label="AI/ML API">

```bash
AIMLAPI_API_KEY=${AIMLAPI_API_KEY} docker compose up -d
```

  </TabItem>
</Tabs>
您应该看到如下输出：
```
[+] Running 3/3
 ✔ Network dbgptnet              Created   0.0s
 ✔ Container db-gpt-db-1         Started   0.2s
 ✔ Container db-gpt-webserver-1  Started   0.2s
```
### 第 3 步 — 打开 Web UI

在浏览器中访问 **[http://localhost:5670](http://localhost:5670)**。

:::警告 首次启动可能需要一些时间
Web 服务器等待 MySQL 完成初始化。如果第一次启动失败，它将自动重新启动。使用“docker logs db-gpt-webserver-1 -f”检查日志。
:::

## 部署什么

默认的“docker-compose.yml”创建：

|服务 |图片|港口|目的|
|---|---|---|---|
| `db` | `mysql/mysql-服务器` | 3306| MySQL 元数据数据库 |
| `网络服务器` | `eosphorosai/dbgpt-openai:最新` | 5670| DB-GPT应用服务器|

## 常用操作

### 查看日志
```bash
# Webserver logs
docker logs db-gpt-webserver-1 -f

# Database logs
docker logs db-gpt-db-1 -f
```
### 停止服务
```bash
docker compose down
```
### 重启服务
```bash
docker compose restart
```
### 重置所有内容（包括数据）
```bash
docker compose down -v
```
:::警告
“-v”标志删除所有卷，包括 MySQL 数据库。所有数据都将丢失。
:::

## 定制

### 使用不同的配置文件

挂载您自己的 TOML 配置并覆盖启动命令：
```yaml
webserver:
  image: eosphorosai/dbgpt-openai:latest
  command: dbgpt start webserver --config /app/configs/your-config.toml
  volumes:
    - ./your-config.toml:/app/configs/your-config.toml
```
### 挂载本地模型

对于 GPU 部署，安装本地模型目录：
```yaml
webserver:
  volumes:
    - /data/models:/app/models
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            capabilities: [gpu]
```
## 其他 Compose 示例

DB-GPT 附带了适用于特定场景的附加 Compose 文件：

|文件 |使用案例 |
|---|---|
| `docker-compose.yml` | MySQL 的默认代理部署 |
| `docker/compose_examples/cluster-docker-compose.yml` |带 GPU 的多工作集群 |
| `docker/compose_examples/ha-cluster-docker-compose.yml` |高可用集群|
| `docker/compose_examples/dbgpt-oceanbase-docker-compose.yml` | OceanBase数据库后端|

例子：
```bash
docker compose -f docker/compose_examples/cluster-docker-compose.yml up -d
```
## 后续步骤

|主题 |链接 |
|---|---|
|集群部署| [集群](/docs/getting-started/deploy/cluster) |
| Docker（单个容器）| [Docker](/docs/getting-started/deploy/docker) |
|源码部署| [源代码](/docs/getting-started/deploy/source-code) |