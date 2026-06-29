# DB-GPT 中的多模式支持

DB-GPT 支持多模式功能，允许您处理各种数据类型，例如文本、图像和音频。本指南将帮助您在 DB-GPT 中设置和使用多模式功能。

本指南包括运行本地模型和代理模型。

## 运行本地模型

在本节中，我们将使用 [Kimi-VL-A3B-Thinking](https://huggingface.co/moonshotai/Kimi-VL-A3B-Thinking)
模型作为示例来演示如何运行本地多模态模型。 

### 第 1 步：安装依赖项

确保您已安装所需的依赖项。您可以通过运行以下命令来执行此操作：
```bash
uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "cuda121" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts" \
--extra "model_vl" \
--extra "hf_kimi"
```
### 步骤2：修改配置文件

安装依赖项后，您可以修改配置文件以使用“Kimi-VL-A3B-Thinking”模型。 

您可以创建新的配置文件或修改现有的配置文件。下面是一个配置文件示例：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "moonshotai/Kimi-VL-A3B-Thinking"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
### 第 3 步：运行模型

您可以使用以下命令运行模型：
```bash
uv run dbgpt start webserver --config {your_config_file}
```
### 步骤 4：在 DB-GPT 中使用模型

目前，DB-GPT仅支持图片输入，并且仅支持“正常聊天”场景。

您可以单击聊天窗口中的“+”按钮上传图像。然后在输入框中输入您的问题并按 Enter 键。该模型将处理图像并根据图像的内容提供响应。

<p对齐=“左”>
  <img src={'/img/installation/advanced_usage/dbgpt-multimodal-local.jpg'} width="720px"/>
</p>

## 运行代理模型

在本节中，我们将使用 [SiliconFlow](https://siliconflow.cn/) 上托管的 [Qwen/Qwen2.5-VL-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct) 作为示例来演示如何运行代理多模态模型。

### 第 1 步：安装依赖项

确保您已安装所需的依赖项。您可以通过运行以下命令来执行此操作：
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts" \
--extra "model_vl" \
--extra "file_s3"
```
现在，大多数代理模型无法接收图像原始数据，因此您需要将图像上传到S3、MinIO、阿里云OSS等存储服务，然后为图像生成公共URL。由于许多存储将提供 S3 兼容的 API，因此您可以使用额外的“file_s3”将图像上传到存储服务。

### 步骤2：修改配置文件

安装依赖项后，您可以修改配置文件以使用“Qwen/Qwen2.5-VL-32B-Instruct”模型。
您可以创建新的配置文件或修改现有的配置文件。下面是一个配置文件示例：
```toml
# Model Configurations
[[models.llms]]
name = "Qwen/Qwen2.5-VL-32B-Instruct"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"


[[serves]]
type = "file"
# Default backend for file server
default_backend = "s3"

[[serves.backends]]
# Use Tencent COS s3 compatible API as the file server
type = "s3"
endpoint = "https://cos.ap-beijing.myqcloud.com"
region = "ap-beijing"
access_key_id = "${env:COS_SECRETID}"
access_key_secret = "${env:COS_SECRETKEY}"
fixed_bucket = "{your_bucket_name}"
```
或者，您可以使用阿里云OSS存储服务作为文件服务器（您应该先安装依赖项`--extra "file_oss"`）。
```toml
[[serves]]
type = "file"
# Default backend for file server
default_backend = "oss"

[[serves.backends]]
type = "oss"
endpoint = "https://oss-cn-beijing.aliyuncs.com"
region = "oss-cn-beijing"
access_key_id = "${env:OSS_ACCESS_KEY_ID}"
access_key_secret = "${env:OSS_ACCESS_KEY_SECRET}"
fixed_bucket = "{your_bucket_name}"
```
### 第 3 步：运行模型
您可以使用以下命令运行模型：
```bash
uv run dbgpt start webserver --config {your_config_file}
```
### 步骤 4：在 DB-GPT 中使用模型

<p对齐=“左”>
  <img src={'/img/installation/advanced_usage/dbgpt-multimodal-proxy.jpg'} width="720px"/>
</p>