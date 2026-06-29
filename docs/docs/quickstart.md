---
sidebar_position: 0
---
# 快速入门

DB-GPT支持各种开源和闭源模型的安装和使用。不同的模型对环境和资源的要求不同。如果需要本地模型部署，则需要GPU资源。 API代理模型需要的资源相对较少，可以在CPU机器上部署和启动。

:::信息说明
- 详细的安装和部署教程可以在[安装](./installation)中找到。
- 本页仅介绍基于ChatGPT代理和本地GLM模型的部署。
:::

## 环境准备

### 下载源代码

:::提示
下载 DB-GPT
:::
```bash
git clone https://github.com/eosphoros-ai/DB-GPT.git
```
### 环境设置

- 默认数据库使用SQLite，因此无需在系统中安装数据库 
默认启动模式。如果需要使用其他数据库，请参考下面的【高级教程】(./application/advanced_tutorial/rag.md)。 
从0.7.0版本开始，DB-GPT使用uv进行环境和包管理，提供更快、更稳定的依赖管理。


:::信息说明
安装uv有以下几种方法：
:::
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
默认值=“uv_sh”
  值={[
    {label: '命令（macOS 和 Linux）', value: 'uv_sh'},
    {标签：'PyPI'，值：'uv_pypi'}，
    {标签：'其他'，值：'uv_other'}，
  ]}>
  <TabItem value="uv_sh" label="Command">
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```
  </TabItem>

  <TabItem value="uv_pypi" label="Pypi">
使用 pipx 安装 uv。
```bash
python -m pip install --upgrade pip
python -m pip install --upgrade pipx
python -m pipx ensurepath
pipx install uv --global
```
  </TabItem>

  <TabItem value="uv_other" label="Other">
更多安装方法可以参见【uv安装】(https://docs.astral.sh/uv/getting-started/installation/)
  </TabItem>

</Tabs>
然后，您可以运行“uv --version”来检查uv是否安装成功。
```bash
uv --version
```
## 部署 DB-GPT 
:::提示
如果您在中国地区，可以在命令末尾添加 --index-url=https://pypi.tuna.tsinghua.edu.cn/simple。如下所示：
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts" \
--index-url=https://pypi.tuna.tsinghua.edu.cn/simple
```
我们建议您将 pypi 索引配置到环境变量“UV_INDEX_URL”
示例：
```bash
echo "export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple" >> ~/.bashrc
```
本教程假设您可以与依赖项下载源建立网络通信。
:::

### 安装依赖项
<Tabs
默认值=“openai”
  值={[
    {标签：'OpenAI（代理）'，值：'openai'}，
    {标签：'DeepSeek（代理）'，值：'deepseek'}，
    {标签：'GLM4（本地）'，值：'glm-4'}，
    {标签：'VLLM（本地）'，值：'vllm'}，
    {标签：'LLAMA_CPP（本地）'，值：'llama_cpp'}，
    {label: 'Ollama (代理)', value: 'ollama'},
  ]}>
  <TabItem value="openai" label="OpenAI(proxy)">

```bash
# Use uv to install dependencies needed for OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 运行网络服务器

要使用 OpenAI 代理运行 DB-GPT，您必须在“configs/dbgpt-proxy-openai.toml”配置文件中提供 OpenAI API 密钥，或在环境变量中使用密钥“OPENAI_API_KEY”提供它。
```toml
# Model Configurations
[models]
[[models.llms]]
...
api_key = "your-openai-api-key"
[[models.embeddings]]
...
api_key = "your-openai-api-key"
```
然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
上面命令中，`--config`指定配置文件，`configs/dbgpt-proxy-openai.toml`是OpenAI代理模型的配置文件，您也可以使用其他配置文件或根据需要创建自己的配置文件。

或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-openai.toml
```

  </TabItem>
<TabItem value="deepseek" label="DeepSeek(proxy)">

```bash
# Use uv to install dependencies needed for OpenAI proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 运行网络服务器

要使用 DeepSeek 代理运行 DB-GPT，您必须在“configs/dbgpt-proxy-deepseek.toml”中提供 DeepSeek API 密钥。

您可以在`configs/dbgpt-proxy-deepseek.toml`配置文件中指定您的嵌入模型，默认嵌入模型是`BAAI/bge-large-zh-v1.5`。如果想使用其他嵌入模型，可以修改 configs/dbgpt-proxy-deepseek.toml 配置文件，并在 [[models.embeddings]] 部分指定嵌入模型的 name 和provider 。提供者可以是`hf`。最后，您需要在依赖安装命令末尾附加`--extra "hf"`。这是更新后的命令：
```bash
uv sync --all-packages \
--extra "base" \
--extra "proxy_openai" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts" \
--extra "hf" \
--extra "cpu"
```
**型号配置**：
```toml
# Model Configurations
[models]
[[models.llms]]
# name = "deepseek-chat"
name = "deepseek-reasoner"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"
[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
path = "/data/models/bge-large-zh-v1.5"
```
然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-deepseek.toml
```
上面命令中，`--config`指定配置文件，`configs/dbgpt-proxy-deepseek.toml`是DeepSeek代理模型的配置文件，您也可以使用其他配置文件或根据需要创建自己的配置文件。

或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-deepseek.toml
```

  </TabItem>
  <TabItem value="glm-4" label="GLM4(local)">

```bash
# Use uv to install dependencies needed for GLM4
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "cuda121" \
--extra "hf" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
### 运行网络服务器

使用本地模型运行 DB-GPT。您可以修改 configs/dbgpt-local-glm.toml 配置文件来指定模型路径和其他参数。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "THUDM/glm-4-9b-chat-hf"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
在上面的配置文件中，“[[models.llms]]”指定LLM模型，“[[models.embeddings]]”指定嵌入模型。如果您不提供“path”参数，则将根据“name”参数从Hugging Face模型中心下载模型。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-glm.toml
```

  </TabItem>
    <TabItem value="vllm" label="VLLM(local)">

```bash
# Use uv to install dependencies needed for vllm
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "cuda121" \
--extra "vllm" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
### 运行网络服务器

使用本地模型运行 DB-GPT。您可以修改 configs/dbgpt-local-vllm.toml 配置文件来指定模型路径和其他参数。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "THUDM/glm-4-9b-chat-hf"
provider = "vllm"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
在上面的配置文件中，“[[models.llms]]”指定LLM模型，“[[models.embeddings]]”指定嵌入模型。如果您不提供“path”参数，则将根据“name”参数从Hugging Face模型中心下载模型。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-vllm.toml
```

  </TabItem>
  <TabItem value="llama_cpp" label="LLAMA_CPP(local)">
如果您有 Nvidia GPU，则可以通过设置环境变量 CMAKE_ARGS="-DGGML_CUDA=ON" 来启用 CUDA 支持。
```bash
# Use uv to install dependencies needed for llama-cpp
# Install core dependencies and select desired extensions
CMAKE_ARGS="-DGGML_CUDA=ON" uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "cuda121" \
--extra "llama_cpp" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
否则，运行以下命令来安装不支持 CUDA 的依赖项。
```bash
# Use uv to install dependencies needed for llama-cpp
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "llama_cpp" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
### 运行网络服务器

使用本地模型运行 DB-GPT。您可以修改 configs/dbgpt-local-llama-cpp.toml 配置文件来指定模型路径和其他参数。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "DeepSeek-R1-Distill-Qwen-1.5B"
provider = "llama.cpp"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
在上面的配置文件中，“[[models.llms]]”指定LLM模型，“[[models.embeddings]]”指定嵌入模型。如果您不提供“path”参数，则将根据“name”参数从Hugging Face模型中心下载模型。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-llama-cpp.toml
```

  </TabItem>
    <TabItem value="ollama" label="Ollama(proxy)">

```bash
# Use uv to install dependencies needed for Ollama proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_ollama" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 运行网络服务器

要使用 Ollama 代理运行 DB-GPT，您必须在“configs/dbgpt-proxy-ollama.toml”配置文件中提供 Ollama API 库。
```toml
# Model Configurations
[models]
[[models.llms]]
...
api_base = "your-ollama-api-base"
[[models.embeddings]]
...
api_base = "your-ollama-api-base"
```
然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-ollama.toml
```
上面命令中，`--config`指定配置文件，`configs/dbgpt-proxy-ollama.toml`是Ollama代理模型的配置文件，您也可以使用其他配置文件或根据需要创建自己的配置文件。

或者，您还可以使用以下命令来启动网络服务器：
```bash
uv run python packages/dbgpt-app/src/dbgpt_app/dbgpt_server.py --config configs/dbgpt-proxy-ollama.toml
```

  </TabItem>
</Tabs>
##（可选）更多配置

您可以在[配置](./config/config-reference)中查看配置来了解更多 
配置选项。

例如，如果您想配置LLM模型，您可以在[LLM配置](./config-reference/llm/)中看到所有可用的选项。

另一个例子，如果您想了解如何配置vllm模型，您可以在[VLLM配置](./config-reference/llm/vllm_adapter_vllmdeploymodelparameters_1d4a24.mdx)中查看所有可用选项。


## DB-GPT 安装帮助工具

如果您需要安装帮助，可以使用“uv”脚本来获取帮助。
```bash
uv run install_help.py --help
```
## 生成安装命令

您可以使用 uv 脚本以交互模式生成安装命令。
```bash
uv run install_help.py install-cmd --interactive
```
您可以生成一个安装命令，其中包含 OpenAI 代理模型所需的所有依赖项。
```bash
uv run install_help.py install-cmd --all
```
您可以找到所有依赖项和附加项。
```bash
uv run install_help.py list
```
## 访问网站

打开浏览器并访问 [`http://localhost:5670`](http://localhost:5670)

### （可选）单独运行 Web 前端

您还可以单独运行 Web 前端：
```bash
cd web && npm install
cp .env.template .env
// Set API_BASE_URL to your DB-GPT server address, usually http://localhost:5670
npm run dev
```
打开浏览器并访问 [`http://localhost:3000`](http://localhost:3000)