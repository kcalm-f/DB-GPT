---
slug: db-gpt-qwen3-support
title: DB-GPT Now Supports Qwen3 Series Models
authors: fangyinc
tags: [Qwen, Qwen3, LLM]
---
我们很高兴地宣布 DB-GPT 现在支持 Qwen3 系列模型的推理！

## Qwen3 简介

Qwen3 是 Qwen 系列中最新一代的大型语言模型，提供了一整套密集模型和专家混合模型 (MoE)。基于广泛的培训，Qwen3 在推理、指令遵循、代理能力和多语言支持方面取得了突破性的进步，具有以下主要功能：

- **在单一模型**内独特支持思维模式**（用于复杂的逻辑推理、数学和编码）和**非思维模式**（用于高效、通用的对话）之间的无缝切换，确保在各种场景下实现最佳性能。
- **推理能力显着增强**，在数学、代码生成和常识逻辑推理方面超越了之前的QwQ（思维模式）和Qwen2.5指令模型（非思维模式）。
- **卓越的人类偏好调整**，擅长创意写作、角色扮演、多轮对话和指令遵循，提供更自然、更有吸引力、更身临其境的对话体验。
- **代理能力方面的专业知识**，能够在思考和非思考模式下与外部工具精确集成，并在基于代理的复杂任务中实现开源模型中的领先性能。
- **支持 100 多种语言和方言**，具有强大的**多语言指令跟随**和**翻译**功能。

## 如何访问Qwen3

您可以根据[获取Huggingface](https://huggingface.co/collections/Qwen/qwen3-67dd247413f0e2e4f653967f)或[ModelScope](https://modelscope.cn/collections/Qwen3-9743180bdc6b48)访问Qwen3模型

## 在 DB-GPT 中使用 Qwen3

请阅读[源代码部署](../docs/installation/sourcecode)以了解如何从源代码安装DB-GPT。

Qwen3需要升级你的变形金刚 >= 4.51.0，请升级你的变形金刚。

以下是安装 Qwen3 所需依赖项的命令：
```bash
# Use uv to install dependencies needed for Qwen3
# Install core dependencies and select desired extensions
uv sync --all-packages \
--extra "base" \
--extra "cuda121" \
--extra "hf" \
--extra "rag" \
--extra "storage_chromadb" \
--extra "quant_bnb" \
--extra "dbgpts" \
--extra "hf_qwen3"
```
使用本地 Qwen3 模型运行 DB-GPT。您可以提供配置文件来指定模型路径和其他参数。
这是一个示例配置文件“configs/dbgpt-local-qwen3.toml”：
```toml
# Model Configurations
[models]
[[models.llms]]
name = "Qwen/Qwen3-14B"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
在上面的配置文件中，[[models.llms]]指定LLM模型，[[models.embeddings]]指定嵌入模型。如果不提供路径参数，则会根据名称参数从 Hugging Face 模型中心下载模型。

然后运行以下命令来启动网络服务器：
```bash
uv run dbgpt start webserver --config configs/dbgpt-local-qwen3.toml
```
打开浏览器并访问“http://localhost:5670”以使用 DB-GPT 中的 Qwen3 模型。

在 DB-GPT 中享受 Qwen3 的强大功能！


## 高级配置

> 独特支持单个模型内思维模式（复杂逻辑推理、数学和编码）和非思维模式（高效、通用对话）之间的无缝切换，确保在各种场景下获得最佳性能。

默认情况下，Qwen3 启用了思考功能。如果你想禁用思考能力，你可以在你的toml文件中设置“reasoning_model=false”配置。
```toml
[models]
[[models.llms]]
name = "Qwen/Qwen3-14B"
provider = "hf"
# Force the model to be used in non-thinking mode
reasoning_model = false
# If not provided, the model will be downloaded from the Hugging Face model hub
# uncomment the following line to specify the model path in the local file system
# path = "the-model-path-in-the-local-file-system"
```
