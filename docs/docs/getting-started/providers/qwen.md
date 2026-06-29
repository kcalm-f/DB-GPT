---
sidebar_position: 3
title: Qwen (Tongyi)
---
#Qwen（统一）

通过 DashScope API 配置 DB-GPT 以使用阿里云的 Qwen 模型。

## 先决条件

- [DashScope API 密钥](https://dashscope.console.aliyun.com/)
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

编辑`configs/dbgpt-proxy-tongyi.toml`：
```toml
[models]
[[models.llms]]
name = "qwen-plus"
provider = "proxy/tongyi"
api_base = "https://dashscope.aliyuncs.com/compatible-mode/v1"
api_key = "${env:DASHSCOPE_API_KEY}"

[[models.embeddings]]
name = "text-embedding-v3"
provider = "proxy/tongyi"
api_url = "https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings"
api_key = "${env:DASHSCOPE_API_KEY}"
```
:::提示
设置环境变量以使您的密钥远离配置：
```bash
export DASHSCOPE_API_KEY="your-dashscope-api-key"
```
:::

## 可用型号

### 法学硕士

|型号|配置名称 |笔记|
|---|---|---|
| Qwen-麦克斯 | `qwen-max` |旗舰机型，最佳品质 |
| Qwen-Plus | `qwen-plus` |平衡性能与成本|
| Qwen-涡轮| `qwen-turbo` |最快最便宜|
|昆龙 | `qwen-long` |扩展上下文窗口|

### 嵌入

|型号|配置名称 |笔记|
|---|---|---|
|文本嵌入-v3 | `文本嵌入-v3` |推荐|
|文本嵌入-v2 | `文本嵌入-v2` |上一代|

## 启动服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-tongyi.toml
```
## 故障排除

|问题 |解决方案 |
|---|---|
| `无效的APIKey` |验证您的 DashScope API 密钥并确保其已激活 |
|型号配额超出 |检查您的 DashScope 控制台的使用限制 |
|反应慢|尝试“qwen-turbo”以获得更快的响应 |

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [模型提供程序](/docs/getting-started/providers/) — 尝试其他提供程序