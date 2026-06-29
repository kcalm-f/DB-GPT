---
sidebar_position: 2
title: DeepSeek
---
# 深度搜索

配置 DB-GPT 以使用 DeepSeek 的语言模型进行聊天和推理。

## 先决条件

- [DeepSeek API 密钥](https://platform.deepseek.com/)
- DB-GPT 安装了额外的 `proxy_openai`

## 安装依赖项
```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```
:::info 嵌入模型
DeepSeek 不提供嵌入模型。默认配置使用 HuggingFace 嵌入模型（`BAAI/bge-large-zh-v1.5`）。如果使用这个，还需要添加：
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
:::

## 配置

编辑`configs/dbgpt-proxy-deepseek.toml`：
```toml
[models]
[[models.llms]]
name = "deepseek-v4-pro"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"
# Disable V4-Pro thinking mode for strict ReAct output parsing.
thinking_enabled = false

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# Uncomment to use a local model path:
# path = "models/bge-large-zh-v1.5"
```
## 可用型号

|型号|配置名称 |笔记|
|---|---|---|
| DeepSeek-V4-Pro | `deepseek-v4-pro` | 1M 上下文、高级推理、编码和代理任务 |
| DeepSeek-R1 | `deepseek-reasoner` |推理力强，思路清晰 |
| DeepSeek-V3 | `deepseek-聊天` |通用聊天|

对于 ReAct 代理，请保留“thinking_enabled = false”和“deepseek-v4-pro”。深度搜索
V4-Pro默认开启思维模式，可在推理前添加推理块
严格的“思想/行动/行动输入”响应格式。

## 启动服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-deepseek.toml
```
## 故障排除

|问题 |解决方案 |
|---|---|
| `身份验证错误` |在 [platform.deepseek.com](https://platform.deepseek.com/) 验证您的 DeepSeek API 密钥 |
|嵌入下载速度慢|预下载模型或使用镜像 (`UV_INDEX_URL`) |
|嵌入内存不足 |使用 `--extra "cpu"` 在 CPU 上运行嵌入 |

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [模型提供程序](/docs/getting-started/providers/) — 尝试其他提供程序