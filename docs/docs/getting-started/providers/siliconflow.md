---
sidebar_position: 4
title: SiliconFlow
---
# 硅流

配置 DB-GPT 以使用 SiliconFlow 的托管模型 API。 SiliconFlow 通过在中国托管的统一 API 提供对多个开源模型的访问。

## 先决条件

- 一个 [SiliconFlow API 密钥](https://siliconflow.cn/)
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
## 配置

编辑`configs/dbgpt-proxy-siliconflow.toml`：
```toml
[models]
[[models.llms]]
name = "Qwen/Qwen2.5-Coder-32B-Instruct"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "proxy/openai"
api_url = "https://api.siliconflow.cn/v1/embeddings"
api_key = "${env:SILICONFLOW_API_KEY}"

[[models.rerankers]]
name = "BAAI/bge-reranker-v2-m3"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"
```
:::提示
设置环境变量：
```bash
export SILICONFLOW_API_KEY="your-siliconflow-api-key"
```
:::

## 可用型号

SiliconFlow 拥有广泛的开源模型。一些流行的选择：

|型号|配置名称 |笔记|
|---|---|---|
| Qwen2.5-Coder-32B | `Qwen/Qwen2.5-Coder-32B-Instruct` |以代码为中心 |
| Qwen2.5-72B | `Qwen/Qwen2.5-72B-指令` |通用|
| DeepSeek-V3 | `deepseek-ai/DeepSeek-V3` |推理力强 |
| GLM-4-9B | `THUDM/glm-4-9b-chat` |中英文|

:::信息
查看[SiliconFlow 型号列表](https://siliconflow.cn/) 了解最新可用型号和价格。
:::

## 特点

SiliconFlow 配置还支持**重新排序**以增强 RAG 检索：
```toml
[[models.rerankers]]
name = "BAAI/bge-reranker-v2-m3"
provider = "proxy/siliconflow"
api_key = "${env:SILICONFLOW_API_KEY}"
```
## 启动服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-siliconflow.toml
```
## 故障排除

|问题 |解决方案 |
|---|---|
|认证失败 |验证您的 SiliconFlow API 密钥 |
|型号不可用 |查看 SiliconFlow 的当前型号产品 |
|反应慢|一些较大的型号可能有较高的延迟 |

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [模型提供程序](/docs/getting-started/providers/) — 尝试其他提供程序