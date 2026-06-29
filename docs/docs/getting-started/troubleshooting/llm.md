---
sidebar_position: 2
title: Model Issues
---
# 模型问题

模型配置、加载和生成的常见问题。

## API 密钥错误

**症状：** `401 未经授权`、`API 密钥无效`或`身份验证失败`。

**修复：**

1. 验证您的 API 密钥是否在 TOML 配置中正确设置：
```toml
[[models.llms]]
api_key = "sk-..."  # Must be a valid key
```
2.或者使用环境变量：
```toml
[[models.llms]]
api_key = "${env:OPENAI_API_KEY}"
```

```bash
export OPENAI_API_KEY="sk-your-actual-key"
```
3. 检查密钥是否具有足够的权限和提供商的信用。

## 未找到模型

**症状：** `找不到型号'xxx'`或`未注册型号`。

**修复：**

1. 检查配置中的型号名称是否与提供商的预期格式匹配：

|供应商|示例名称 |
|---|---|
|开放人工智能 | `chatgpt_proxyllm`、`gpt-4o` |
|深度搜索| `deepseek-v4-pro`、`deepseek-chat`、`deepseek-reasoner` |
|奥拉玛 | `qwen2.5:latest` (必须先拉) |
|拥抱脸 | `THUDM/glm-4-9b-chat-hf` |

2. 对于 Ollama，确保模型已下载：
```bash
ollama pull qwen2.5:latest
ollama list  # Verify it appears
```
3. 对于集群部署，验证工作线程是否已注册：
```bash
dbgpt model list
```
## Ollama 连接被拒绝

**症状：** 使用 Ollama 提供程序时“连接被拒绝”。

**修复：**

1. 确保 Ollama 正在运行：
```bash
ollama serve
# Or check: curl http://localhost:11434/api/tags
```
2. 如果在 Docker 中运行 DB-GPT，请使用主机网络地址而不是 `localhost`：
```toml
[[models.llms]]
api_base = "http://host.docker.internal:11434"  # Docker for Mac/Windows
# Or use the host's actual IP address
```
## 内存不足 (OOM)

**症状：**“CUDA 内存不足”或“运行时错误：CUDA 错误”。

**修复：**

1. 使用较小的模型：
```toml
[[models.llms]]
name = "Qwen2.5-Coder-0.5B-Instruct"  # Smaller model
```
2. 启用量化：
```bash
dbgpt start worker --model_name ... --load_4bit
```
3.限制GPU内存：
```bash
CUDA_VISIBLE_DEVICES=0 uv run dbgpt start webserver ...
```
4.或者切换到API代理（不需要GPU）：
```toml
[[models.llms]]
provider = "proxy/openai"  # Uses remote API instead of local GPU
```
## 模型响应缓慢

**症状：** 响应时间非常慢或超时。

**可能的原因和修复：**

|原因 |修复 |
|---|---|
|首次运行时下载模型 |等待下载完成（检查日志）|
| GPU VRAM 不足 |使用量化或更小的模型 |
|网络 API 速度慢 |检查与提供商端点的连接 |
|大上下文窗口|减少配置中的“max_context_size” |

## 嵌入模型错误

**症状：** `嵌入模型未找到`或知识库操作失败。

**修复：**

1. 确保配置了嵌入模型：
```toml
[[models.embeddings]]
name = "text-embedding-3-small"
provider = "proxy/openai"
api_key = "your-key"
```
2. 对于 HuggingFace 嵌入，确保模型已下载或可访问：
```toml
[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# path = "/path/to/local/model"  # Optional: local path
```
3. 如果使用本地嵌入，请添加 HuggingFace 额外内容：
```bash
uv sync --all-packages --extra "hf" --extra "cpu" ...
```
## 重新排序器不工作

**症状：** 启用重新排序后，RAG 结果没有改善。

**修复：**

确保在 TOML 中配置了 reranker：
```toml
[[models.rerankers]]
name = "BAAI/bge-reranker-base"
provider = "hf"
```
或者对于 SiliconFlow：
```toml
[[models.rerankers]]
name = "BAAI/bge-reranker-v2-m3"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"
```
## 还是卡住了吗？

- 查看[LLM常见问题解答](/docs/faq/llm)以获取更多解决方案
- 查看[模型提供者](/docs/getting-started/providers/) 文档
- 搜索 [GitHub 问题](https://github.com/eosphoros-ai/DB-GPT/issues)