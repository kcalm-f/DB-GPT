---
sidebar_position: 1
title: OpenAI
---
# 开放人工智能

配置 DB-GPT 以使用 OpenAI 的 GPT 模型和嵌入模型。

## 先决条件

- [OpenAI API 密钥](https://platform.openai.com/api-keys)
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

编辑`configs/dbgpt-proxy-openai.toml`：
```toml
[models]
[[models.llms]]
name = "gpt-4o"
provider = "proxy/openai"
api_base = "https://api.openai.com/v1"
api_key = "sk-your-openai-api-key"

[[models.embeddings]]
name = "text-embedding-3-small"
provider = "proxy/openai"
api_url = "https://api.openai.com/v1/embeddings"
api_key = "sk-your-openai-api-key"
```
:::提示使用环境变量
不要对 API 密钥进行硬编码，而是使用环境变量：
```toml
api_key = "${env:OPENAI_API_KEY}"
```

```bash
export OPENAI_API_KEY="sk-your-openai-api-key"
```
:::

## 可用型号

### 法学硕士

|型号|配置名称 |笔记|
|---|---|---|
| GPT-4o | `gpt-4o` |推荐—最佳品质|
| GPT-4o 迷你 | `gpt-4o-mini` |更快更便宜|
| GPT-4 涡轮 | `gpt-4-turbo` |上一代|
| GPT-3.5 涡轮| `gpt-3.5-turbo` |预算选项|

### 嵌入

|型号|配置名称 |尺寸|
|---|---|---|
|文本嵌入-3-小| `文本嵌入-3-小` | 1536 | 1536
|文本嵌入 3 大 | `文本嵌入-3-大` | 3072 | 3072
|文本嵌入-ada-002 | `文本嵌入-ada-002` | 1536 | 1536

## 启动服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```
## Azure OpenAI

要使用 Azure OpenAI，请将“api_base”更改为您的 Azure 端点：
```toml
[[models.llms]]
name = "gpt-4o"
provider = "proxy/openai"
api_base = "https://your-resource.openai.azure.com/openai/deployments/your-deployment"
api_key = "your-azure-api-key"
```
## 故障排除

|问题 |解决方案 |
|---|---|
| `身份验证错误` |检查您的 API 密钥是否有效并已启用计费 |
| `速率限制错误` |减少请求频率或升级您的 OpenAI 计划 |
|连接超时|检查网络连接；如果需要的话配置代理 |
|找不到型号 |验证模型名称是否与 OpenAI 的当前产品相匹配 |

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [配置参考](/docs/config/config-reference) — 所有配置选项
- [更多代理 LLM](/docs/installation/advanced_usage/More_proxyllms) — 其他 API 提供商