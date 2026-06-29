# 乌拉马
ollama 是一个模型服务平台，可让您在几秒钟内部署模型。 
这是一个很棒的工具。

### 安装ollama
如果你的系统是linux。
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
其他环境请参考【ollama官方网站】(https://ollama.com/)。
### 拉模型。
1. 拉法学硕士
```bash
ollama pull qwen:0.5b
```
2. 拉嵌入模型。
```bash
ollama pull nomic-embed-text
```
3.安装ollama包。
```bash
# Use uv to install dependencies needed for Ollama proxy
uv sync --all-packages \
--extra "base" \
--extra "proxy_ollama" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "dbgpts"
```
### 配置模型

修改 toml 配置文件以使用 `ollama` 提供程序。
```toml
# Model Configurations
[models]
[[models.llms]]
name = "qwen:0.5b"
provider = "proxy/ollama"
api_base = "http://localhost:11434"
api_key = ""

[[models.embeddings]]
name = "bge-m3:latest"
provider = "proxy/ollama"
api_url = "http://localhost:11434"
api_key = ""
```