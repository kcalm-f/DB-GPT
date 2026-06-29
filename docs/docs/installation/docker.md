import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
# Docker 部署

## Docker 镜像准备

有两种方法可以准备 Docker 镜像。 
1.从官方镜像拉取 
2.本地构建，参见【构建Docker镜像】(./build_image.md) 

实际使用过程中您可以**任意选择**。


## 使用代理模型部署

在此部署中，您不需要 GPU 环境。

1. 从官方镜像仓库[Eosphoros AI Docker Hub](https://hub.docker.com/u/eosphorosai)拉取
```bash
docker pull eosphorosai/dbgpt-openai:latest
```
2.运行Docker容器

此示例要求您为 SiliconFlow API 提供有效的 API 密钥。您可以通过在 [SiliconFlow](https://siliconflow.cn/) 注册并在 [API Key](https://cloud.siliconflow.cn/account/ak) 创建 API 密钥来获取。或者，设置“AIMLAPI_API_KEY”以使用 AI/ML API 服务。
```bash
docker run -it --rm -e SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY} \
 -p 5670:5670 --name dbgpt eosphorosai/dbgpt-openai
```
或者使用 AI/ML API：
```bash
docker run -it --rm -e AIMLAPI_API_KEY=${AIMLAPI_API_KEY} \
 -p 5670:5670 --name dbgpt eosphorosai/dbgpt-openai
```
请将“${SILICONFLOW_API_KEY}”或“${AIMLAPI_API_KEY}”替换为您自己的 API 密钥。


然后就可以在浏览器中访问[http://localhost:5670](http://localhost:5670)。


## 使用 GPU 部署（本地模型）

在此部署中，您需要 GPU 环境。

在运行Docker容器之前，您需要安装NVIDIA Container Toolkit。更多信息请参考官方文档[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)。

在此部署中，您将使用本地模型，而不是从 Hugging Face 或 ModelScope 模型中心下载。如果您已将模型下载到本地计算机或者想要使用其他来源的模型，这会很有用。

### 第 1 步：下载模型

在运行 Docker 容器之前，您需要将模型下载到本地计算机。您可以使用Hugging Face或ModelScope（推荐中国用户）下载模型。
<Tabs>
<TabItem value="modelscope" label="Download from ModelScope">
1. 如果尚未安装 `git` 和 `git-lfs`，请安装：
   ```bash
   sudo apt-get install git git-lfs
   ```
2. 在当前工作目录中创建一个“models”目录：
   ```bash
   mkdir -p ./models
   ```
3. 使用 `git` 将模型存储库克隆到 `models` 目录中：
   ```bash
   cd ./models
   git lfs install
   git clone https://www.modelscope.cn/Qwen/Qwen2.5-Coder-0.5B-Instruct.git
   git clone https://www.modelscope.cn/BAAI/bge-large-zh-v1.5.git
   cd ..
   ```
这会将模型下载到“./models/Qwen2.5-Coder-0.5B-Instruct”和“./models/bge-large-zh-v1.5”目录中。
</TabItem>
<TabItem value="huggingface" label="Download from Hugging Face">
1. 如果尚未安装 `git` 和 `git-lfs`，请安装：
   ```bash
   sudo apt-get install git git-lfs
   ```
2. 在当前工作目录中创建一个“models”目录：
   ```bash
   mkdir -p ./models
   ```
3. 使用 `git` 将模型存储库克隆到 `models` 目录中：
   ```bash
   cd ./models
   git lfs install
   git clone https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct
   git clone https://huggingface.co/BAAI/bge-large-zh-v1.5
   cd ..
   ```
这会将模型下载到“./models/Qwen2.5-Coder-0.5B-Instruct”和“./models/bge-large-zh-v1.5”目录中。
</TabItem>
</Tabs>
---

### 步骤2：准备配置文件

创建名为“dbgpt-local-gpu.toml”的“toml”文件并添加以下内容：
```toml
[models]
[[models.llms]]
name = "Qwen2.5-Coder-0.5B-Instruct"
provider = "hf"
# Specify the model path in the local file system
path = "/app/models/Qwen2.5-Coder-0.5B-Instruct"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# Specify the model path in the local file system
path = "/app/models/bge-large-zh-v1.5"
```
此配置文件指定 Docker 容器内模型的本地路径。

---

### 步骤 3：运行 Docker 容器

运行安装了本地“models”目录的 Docker 容器：
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
#### 命令解释：
- `--ipc host`：启用主机 IPC 模式以获得更好的性能。
- `--gpus all`：允许容器使用所有可用的 GPU。
- `-v ./dbgpt-local-gpu.toml:/app/configs/dbgpt-local-gpu.toml`：将本地配置文件挂载到容器中。
- `-v ./models:/app/models`：将本地 `models` 目录挂载到容器中。
- `eosphorosai/dbgpt`：要使用的 Docker 镜像。
- `dbgpt start webserver --config /app/configs/dbgpt-local-gpu.toml`：使用指定的配置文件启动 Web 服务器。

---

### 第 4 步：访问应用程序

容器运行后，您可以在浏览器中访问 [http://localhost:5670](http://localhost:5670) 来访问应用程序。

---

### 步骤 5：保存数据（可选）

为了确保容器停止或删除时数据不会丢失，您可以将“pilot/data”和“pilot/message”目录映射到本地计算机。这些目录存储应用程序数据和消息。

1、创建本地目录用于数据持久化：
   ```bash
   mkdir -p ./pilot/data
   mkdir -p ./pilot/message
   mkdir -p ./pilot/alembic_versions
   ```
2. 修改`dbgpt-local-gpu.toml`配置文件以指向正确的路径：
   ```toml
   [service.web.database]
   type = "sqlite"
   path = "/app/pilot/message/dbgpt.db"
   ```
3. 运行带有附加卷挂载的 Docker 容器：
   ```bash
   docker run --ipc host --gpus all \
     -it --rm \
     -p 5670:5670 \
     -v ./dbgpt-local-gpu.toml:/app/configs/dbgpt-local-gpu.toml \
     -v ./models:/app/models \
     -v ./pilot/data:/app/pilot/data \
     -v ./pilot/message:/app/pilot/message \
     -v ./pilot/alembic_versions:/app/pilot/meta_data/alembic/versions \
     --name dbgpt \
     eosphorosai/dbgpt \
     dbgpt start webserver --config /app/configs/dbgpt-local-gpu.toml
   ```
这可确保“pilot/data”和“pilot/message”目录保留在本地计算机上。

---

### 目录结构总结

完成这些步骤后，您的目录结构应如下所示：
```
.
├── dbgpt-local-gpu.toml
├── models
│   ├── Qwen2.5-Coder-0.5B-Instruct
│   └── bge-large-zh-v1.5
├── pilot
│   ├── data
│   └── message
```
此设置可确保模型和应用程序数据存储在本地并安装到 Docker 容器中，使您可以在不丢失数据的情况下使用它们。
```

