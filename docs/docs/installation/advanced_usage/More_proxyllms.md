# 代理法学硕士

DB-GPT可以通过代理LLM部署在硬件要求较低的服务器上。 DB-GPT 支持许多代理 LLM，例如 OpenAI、Azure、DeepSeek、Ollama 等。

## 安装和配置

安装具有代理 LLM 支持的 DB-GPT 需要使用“uv”包管理器以获得更快、更稳定的依赖关系管理体验。
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“openai”
  值={[
    {标签：'OpenAI'，值：'openai'}，
    {标签：'天蓝色'，值：'天蓝色'}，
    {标签：'DeepSeek'，值：'deepseek'}，
    {标签：'奥拉马'，值：'奥拉马'}，
    {标签：'Qwen'，值：'Qwen'}，
    {标签：'ChatGLM'，值：'chatglm'}，
    {label: '文心', value: 'erniebot'},
  ]}>
  <TabItem value="openai" label="OpenAI">
### 安装依赖项
```bash
# Use uv to install dependencies needed for OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置 OpenAI

编辑 configs/dbgpt-proxy-openai.toml 配置文件以指定您的 OpenAI API 密钥：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "gpt-3.5-turbo"
provider = "proxy/openai"
api_key = "your-openai-api-key"
# Optional: To use GPT-4, change the name to "gpt-4" or "gpt-4-turbo"

[[models.embeddings]]
name = "text-embedding-ada-002"
provider = "proxy/openai"
api_key = "your-openai-api-key"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```

  </TabItem>
  <TabItem value="azure" label="Azure">
### 安装依赖项
```bash
# Use uv to install dependencies needed for Azure OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置 Azure OpenAI

编辑“configs/dbgpt-proxy-azure.toml”配置文件以指定 Azure OpenAI 设置：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "gpt-35-turbo"  # or your deployment model name
provider = "proxy/openai"
api_base = "https://your-resource-name.openai.azure.com/"
api_key = "your-azure-openai-api-key"
api_version = "2023-05-15"  # or your specific API version
api_type = "azure"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-azure.toml
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek">
### 安装依赖项
```bash
# Use uv to install dependencies needed for DeepSeek proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置 DeepSeek

编辑“configs/dbgpt-proxy-deepseek.toml”配置文件以指定您的 DeepSeek API 密钥：
```toml
# Model Configurations
[models]
[[models.llms]]
# name = "deepseek-chat"
name = "deepseek-reasoner"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-deepseek.toml
```

  </TabItem>
  <TabItem value="ollama" label="Ollama">
### 安装依赖项
```bash
# Use uv to install dependencies needed for Ollama proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_ollama" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置Ollama

编辑 configs/dbgpt-proxy-ollama.toml 配置文件以指定您的 Ollama API 基础：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "llama3"  # or any other model available in your Ollama instance
provider = "proxy/ollama"
api_base = "http://localhost:11434" # your-ollama-api-base

[[models.embeddings]]
name = "nomic-embed-text"  # or any other embedding model in Ollama
provider = "proxy/ollama"
api_base = "http://localhost:11434" # your-ollama-api-base
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-ollama.toml
```

  </TabItem>
  <TabItem value="qwen" label="Qwen (Tongyi)">
### 安装依赖项
```bash
# Use uv to install dependencies needed for Aliyun Qwen (Tongyi) proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_tongyi" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置Qwen

创建或编辑配置文件（例如`configs/dbgpt-proxy-tongyi.toml`）：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "qwen-turbo"  # or qwen-max, qwen-plus
provider = "proxy/tongyi"
api_key = "your-tongyi-api-key"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-tongyi.toml
```

  </TabItem>
  <TabItem value="chatglm" label="ChatGLM (Zhipu)">
### 安装依赖项
```bash
# Use uv to install dependencies needed for Zhipu (ChatGLM) proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_zhipuai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置 ChatGLM

创建或编辑配置文件（例如`configs/dbgpt-proxy-zhipu.toml`）：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "glm-4"  # or other available model versions
provider = "proxy/zhipu"
api_key = "your-zhipu-api-key"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-zhipu.toml
```

  </TabItem>
  <TabItem value="erniebot" label="WenXin (Ernie)">
### 安装依赖项
```bash
# Use uv to install dependencies needed for Baidu WenXin proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置文心

创建或编辑配置文件（例如`configs/dbgpt-proxy-wenxin.toml`）：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "ERNIE-Bot-4.0"  # or ernie-bot, ernie-bot-turbo
provider = "proxy/wenxin"
api_key = "your-wenxin-api-key"
api_secret = "your-wenxin-api-secret"
```
### 运行网络服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-wenxin.toml
```

  </TabItem>
</Tabs>
:::信息说明
如果您在中国地区，可以在“uvsync”命令末尾添加“--index-url=https://pypi.tuna.tsinghua.edu.cn/simple”，以加快包下载速度。
:::

## 访问网站

启动网络服务器后，打开浏览器并访问 [`http://localhost:5670`](http://localhost:5670)