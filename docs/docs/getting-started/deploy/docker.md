---
sidebar_position: 1
title: Docker Deployment
---
# Docker 部署

在单个 Docker 容器中运行 DB-GPT — 无需 Python 设置。
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
## 先决条件

- [Docker](https://docs.docker.com/get-docker/)已安装并运行
- 对于 GPU 模式：[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

## 使用 API 代理部署（无 GPU）

最快的入门方式。使用云 LLM 提供商 — 无需 GPU。

### 第 1 步 — 拉取镜像
```bash
docker pull eosphorosai/dbgpt-openai:latest
```
### 第 2 步 — 运行容器
<Tabs>
  <TabItem value="siliconflow" label="SiliconFlow" default>

```bash
docker run -it --rm \
  -e SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY} \
  -p 5670:5670 \
  --name dbgpt \
  eosphorosai/dbgpt-openai
```
将 `${SILICONFLOW_API_KEY}` 替换为 [SiliconFlow](https://cloud.siliconflow.cn/account/ak) 中的实际密钥。
  </TabItem>
  <TabItem value="openai" label="OpenAI">

```bash
docker run -it --rm \
  -e OPENAI_API_KEY=${OPENAI_API_KEY} \
  -v ./configs/dbgpt-proxy-openai.toml:/app/configs/dbgpt-proxy-openai.toml \
  -p 5670:5670 \
  --name dbgpt \
  eosphorosai/dbgpt-openai \
  dbgpt start webserver --config /app/configs/dbgpt-proxy-openai.toml
```

  </TabItem>
</Tabs>
### 第 3 步 — 打开 Web UI

在浏览器中访问 **[http://localhost:5670](http://localhost:5670)**。

---

## 使用 GPU 部署（本地模型）

在 NVIDIA GPU 上本地运行模型。

### 第 1 步 — 下载模型
<Tabs>
  <TabItem value="modelscope" label="ModelScope (China)" default>

```bash
mkdir -p ./models && cd ./models
git lfs install
git clone https://www.modelscope.cn/Qwen/Qwen2.5-Coder-0.5B-Instruct.git
git clone https://www.modelscope.cn/BAAI/bge-large-zh-v1.5.git
cd ..
```

  </TabItem>
  <TabItem value="huggingface" label="Hugging Face">

```bash
mkdir -p ./models && cd ./models
git lfs install
git clone https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct
git clone https://huggingface.co/BAAI/bge-large-zh-v1.5
cd ..
```

  </TabItem>
</Tabs>
### 步骤 2 — 创建配置文件

创建“dbgpt-local-gpu.toml”：
```toml
[models]
[[models.llms]]
name = "Qwen2.5-Coder-0.5B-Instruct"
provider = "hf"
path = "/app/models/Qwen2.5-Coder-0.5B-Instruct"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
path = "/app/models/bge-large-zh-v1.5"
```
### 步骤 3 — 运行容器
```bash
docker run --ipc host --gpus all \
  -it --rm \
  -p 5670:5670 \
  -v ./dbgpt-local-gpu.toml:/app/configs/dbgpt-local-gpu.toml \
  -v ./models:/app/models \
  --name dbgpt \
  eosphorosai/dbgpt \
  dbgpt start webserver --config /app/configs/dbgpt-local-gpu.toml
```
|旗帜|目的|
|---|---|
| `--ipc 主机` |启用主机 IPC 模式以获得更好的性能 |
| `--GPU 全部` |允许容器使用所有可用的 GPU |
| `-v ./models:/app/models` |将本地模型安装到容器中 |

### 第 4 步 — 打开 Web UI

在浏览器中访问 **[http://localhost:5670](http://localhost:5670)**。

---

## 保存数据（可选）

默认情况下，容器停止时数据会丢失。要坚持它：
```bash
mkdir -p ./pilot/data ./pilot/message ./pilot/alembic_versions
```
将这些卷挂载添加到“docker run”命令中：
```bash
-v ./pilot/data:/app/pilot/data \
-v ./pilot/message:/app/pilot/message \
-v ./pilot/alembic_versions:/app/pilot/meta_data/alembic/versions
```
并在 TOML 文件中配置数据库路径：
```toml
[service.web.database]
type = "sqlite"
path = "/app/pilot/message/dbgpt.db"
```
## 建立你自己的形象

要从源代码构建自定义 Docker 映像：
```bash
# Proxy image (no GPU required)
bash docker/base/build_proxy_image.sh

# Full image (with GPU support)
bash docker/base/build_image.sh
```
:::信息
有关详细的构建选项，请参阅“bash docker/base/build_image.sh --help”。
:::

## 目录结构

设置完成后，您的工作目录如下所示：
```
.
├── dbgpt-local-gpu.toml    # Your config file
├── models/
│   ├── Qwen2.5-Coder-0.5B-Instruct/
│   └── bge-large-zh-v1.5/
└── pilot/                  # (optional) persistent data
    ├── data/
    └── message/
```
## 后续步骤

|主题 |链接 |
|---|---|
| Docker Compose（多服务）| [Docker Compose](/docs/getting-started/deploy/docker-compose) |
|集群部署| [集群](/docs/getting-started/deploy/cluster) |
|模型提供商| [提供商](/docs/getting-started/providers/) |