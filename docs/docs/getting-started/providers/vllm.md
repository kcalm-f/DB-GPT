---
sidebar_position: 6
title: vLLM
---
# 法学硕士

配置 DB-GPT 以使用 [vLLM](https://docs.vllm.ai/) 在 NVIDIA GPU 上进行高吞吐量本地模型推理。

## 先决条件

- **NVIDIA GPU** 与 CUDA 12.1+
- 为您选择的型号提供足够的 VRAM（7B 型号为 8 GB+）
- DB-GPT 安装了额外的 `vllm`

## 安装依赖项
```bash
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
## 配置

编辑`configs/dbgpt-local-vllm.toml`：
```toml
[models]
[[models.llms]]
name = "DeepSeek-R1-Distill-Qwen-1.5B"
provider = "vllm"
# Download from HuggingFace automatically, or specify local path:
# path = "models/DeepSeek-R1-Distill-Qwen-1.5B"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# path = "models/bge-large-zh-v1.5"
```
:::info 模型下载
如果您不指定“路径”，模型将自动从 HuggingFace Hub 下载。对于大型模型，建议预先下载：
```bash
# Using huggingface-cli
huggingface-cli download deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B --local-dir models/DeepSeek-R1-Distill-Qwen-1.5B
```
:::

## 热门型号选择

|型号|需要显存 |笔记|
|---|---|---|
| DeepSeek-R1-Distill-Qwen-1.5B | 〜4 GB |体积小，适合测试 |
| GLM-4-9B-聊天 | 〜20 GB |强大的中英文 |
| Qwen2.5-7B-使用说明| 〜16 GB |良好的平衡性|
| Qwen2.5-Coder-7B-使用说明 | 〜16 GB |以代码为中心 |

## 启动服务器
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-vllm.toml
```
:::提示 GPU 选择
要使用特定 GPU：
```bash
CUDA_VISIBLE_DEVICES=0 uv run dbgpt start webserver --config configs/dbgpt-local-vllm.toml
```
:::

## 故障排除

|问题 |解决方案 |
|---|---|
|未找到 CUDA |安装 CUDA 12.1+ 并使用 `nvidia-smi` 进行验证 |
| GPU 内存不足 |使用较小的模型或启用量化 (`quant_bnb`) |
|模型下载失败 |预下载模型或配置 HuggingFace 镜像 |
|首次请求缓慢 | vLLM 在首次运行时编译内核 - 后续请求很快 |

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [vLLM 高级](/docs/installation/advanced_usage/vLLM_inference) — 高级 vLLM 配置
- [模型提供程序](/docs/getting-started/providers/) — 尝试其他提供程序