---
sidebar_position: 0
title: Model Providers
summary: "Which DB-GPT model provider to choose and where each provider guide lives"
read_when:
  - You need to pick a provider for your first setup
  - You want to know whether to use API models, Ollama, or vLLM
---
# 模型提供者

DB-GPT 支持 API 提供程序和本地运行时。首次运行时，请使用 API 提供程序，除非您特别需要本地推理。

:::信息 快速选择
不确定选择哪个提供商？从 **OpenAI** 或 **DeepSeek** 开始，以实现最快的设置（API 代理，无需 GPU）。如果您想在本地运行模型而无需复杂的设置，请使用 **Ollama**。
:::

## 提供商比较

|供应商|类型 |需要 GPU |最适合 |
|---|---|---|---|
| [**OpenAI**](./openai) | API代理|没有 |生产质量，最快的设置 |
| [**DeepSeek**](./deepseek) | API代理|没有 |高性价比，推理力强|
| [**Qwen（统一）**](./qwen) | API代理|没有 |中文，阿里云用户|
| [**SiliconFlow**](./siliconflow) | API代理|没有 |中国主办，多种模式选择|
| [**Ollama**](./ollama) |本地代理 |可选|简单的本地模型，隐私第一 |
| [**vLLM**](./vllm) |本地|是（NVIDIA）|高通量生产推理 |

## 模型配置如何工作

所有模型均在“configs/”下的 TOML 文件中进行配置。每个配置文件定义：

- **LLM(s)** — 用于聊天和推理的语言模型
- **Embedding(s)** — RAG 和知识搜索的嵌入模型
- **Reranker(s)** — 可选的重新排序模型以实现更好的检索
```toml
[models]

# Language model
[[models.llms]]
name = "model-name"
provider = "provider-type"
api_key = "your-api-key"

# Embedding model
[[models.embeddings]]
name = "embedding-model-name"
provider = "provider-type"
api_key = "your-api-key"
```
:::提示 环境变量
您可以在 TOML 配置中使用环境变量语法：`"${env:VARIABLE_NAME:-default_value}"`。这可以保护配置文件的秘密。
:::

## 提供商指南

- [OpenAI](/docs/getting-started/providers/openai) — 首次设置的最快默认值
- [DeepSeek](/docs/getting-started/providers/deepseek) — 强推理，兼容 OpenAI 的代理模式
- [Qwen（统一）](/docs/getting-started/providers/qwen) — 阿里云 / DashScope
- [SiliconFlow](/docs/getting-started/providers/siliconflow) — 中国托管的 API 选项
- [Ollama](/docs/getting-started/providers/ollama) — 简单的本地模型运行时
- [vLLM](/docs/getting-started/providers/vllm) — 针对较重工作负载的 GPU 支持的本地推理

## 更多提供商

DB-GPT 还通过其代理系统支持其他提供商。请参阅[高级 LLM 配置](/docs/installation/advanced_usage/More_proxyllms) 了解：

- Azure OpenAI
- 谷歌双子座
- 人类克劳德
- 百川
- Spark（科大讯飞）
- 还有更多