# LLama.cpp 服务器

DB-GPT 支持本机 [llama.cpp 服务器](https://github.com/ggerganov/llama.cpp/blob/master/examples/server/README.md)， 
它支持并发请求和连续批处理推理。


## 安装依赖项

您可以添加额外的 `--extra "llama_cpp_server"` 来安装 llama-cpp 服务器所需的依赖项。

如果您有 Nvidia GPU，则可以通过设置环境变量 CMAKE_ARGS="-DGGML_CUDA=ON" 来启用 CUDA 支持。
```bash
# Use uv to install dependencies needed for llama-cpp
# Install core dependencies and select desired extensions
CMAKE_ARGS="-DGGML_CUDA=ON" uv sync --all-packages \
--extra "base" \
--extra "hf" \
--extra "cuda121" \
--extra "llama_cpp_server" \
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
--extra "llama_cpp_server" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts"
```
## 下载模型

这里，我们以“qwen2.5-0.5b-instruct”模型为例。您可以从[Huggingface](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF)下载模型。
```bash
wget https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf?download=true -O /tmp/qwen2.5-0.5b-instruct-q4_k_m.gguf
````
## 修改配置文件

只需修改您的配置文件即可使用 `llama.cpp.server` 提供程序。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "qwen2.5-0.5b-instruct-q4_k_m.gguf"
provider = "llama.cpp.server"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF
# path = "the-model-path-in-the-local-file-system"
path = "/tmp/qwen2.5-0.5b-instruct-q4_k_m.gguf"
```