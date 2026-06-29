---
slug: db-gpt-llama-3.1-support
title: DB-GPT Now Supports Meta Llama 3.1 Series Models
authors: fangyinc
tags: [llama, LLM]
---
我们很高兴地宣布 DB-GPT 现在支持 Meta Llama 3.1 系列模型的推理！

## 介绍 Meta Llama 3.1

Meta Llama 3.1 是 Meta AI 开发的一系列最先进的语言模型。 Llama 3.1 型号采用尖端技术设计，提供无与伦比的性能和多功能性。以下是一些主要亮点：

- **多种模型**：Meta Llama 3.1 提供 8B、70B 和 405B 版本，每个版本都有指令调整模型和基本模型，支持多达 128k 令牌的上下文。
- **多语言支持**：支持 8 种语言，包括英语、德语和法语。
- **广泛的训练**：使用超过 1.5 万亿个代币进行训练，利用 2.5 亿个人类和合成样本进行微调。
- **灵活许可**：宽松的模型输出使用允许适应其他大型语言模型（LLM）。
- **量化支持**：提供 FP8、AWQ 和 GPTQ 量化版本，以实现高效推理。
- **性能**：Llama 3 405B 版本在多项基准测试中均优于 GPT-4。
- **提高效率**：8B 和 70B 型号的编码和指令跟踪能力提高了 12%。
- **工具和函数调用支持**：支持工具使用和函数调用。

## 如何访问 Meta Llama 3.1

您可以根据[获取Hugging Face](https://github.com/meta-llama/llama-models?tab=readme-ov-file#access-to-hugging-face)获取Meta Llama 3.1模型。

有关完整的文档和其他详细信息，请参阅[模型卡](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md)。

## 在 DB-GPT 中使用 Meta Llama 3.1

请阅读[源代码部署](../docs/installation/sourcecode)以了解如何从源代码安装DB-GPT。

Llama 3.1 需要升级您的变形金刚 >= 4.43.0，请升级您的变形金刚：
```bash
pip install --upgrade "transformers>=4.43.0"
```
请cd到DB-GPT根目录：
```bash
cd DB-GPT
```
我们假设您的模型存储在“models”目录中，例如“models/Meta-Llama-3.1-8B-Instruct”。

然后修改你的`.env`文件：
```env
LLM_MODEL=meta-llama-3.1-8b-instruct
# LLM_MODEL=meta-llama-3.1-70b-instruct
# LLM_MODEL=meta-llama-3.1-405b-instruct
## you can also specify the model path
# LLM_MODEL_PATH=models/Meta-Llama-3.1-8B-Instruct
## Quantization settings
# QUANTIZE_8bit=False
# QUANTIZE_4bit=True
## You can configure the maximum memory used by each GPU.
# MAX_GPU_MEMORY=16Gib
```
然后您可以运行以下命令来启动服务器：
```bash
dbgpt start webserver
```
打开浏览器并访问“http://localhost:5670”以使用 DB-GPT 中的 Meta Llama 3.1 模型。

在 DB-GPT 中享受 Meta Llama 3.1 的强大功能！