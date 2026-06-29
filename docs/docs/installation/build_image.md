---
id: docker-build-guide
title: DB-GPT Docker Build Guide
sidebar_label: Docker Build Guide
description: Comprehensive guide for building DB-GPT Docker images with various configurations
keywords:
  - DB-GPT
  - Docker
  - Build
  - CUDA
  - OpenAI
  - VLLM
  - Llama-cpp
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
从“@theme/CodeBlock”导入CodeBlock；

# DB-GPT Docker 构建指南

本指南提供了使用“docker/base/build_image.sh”脚本构建具有各种配置的 DB-GPT Docker 映像的全面说明。

## 概述

DB-GPT 构建脚本允许您创建适合您的特定要求的 Docker 映像。您可以从预定义的安装模式中进行选择，也可以使用特定的附加功能、环境变量和其他设置来自定义构建。

## 可用的安装模式
<Tabs>
  <TabItem value="default" label="Default" default>
具有标准功能的基于 CUDA 的图像。
    ```bash
    bash docker/base/build_image.sh
    ```
包括：CUDA 支持、代理集成（OpenAI、Ollama、Zhippuai、Anthropic、Qianfan、Tongyi）、RAG 功能、图 RAG、Hugging Face 集成和量化支持。
  </TabItem>
  <TabItem value="openai" label="OpenAI">
基于 CPU 的图像针对 OpenAI API 使用进行了优化。
    ```bash
    bash docker/base/build_image.sh --install-mode openai
    ```
包括：基本功能、所有代理集成以及不带 GPU 加速的 RAG 功能。
  </TabItem>
  <TabItem value="vllm" label="VLLM">
基于 CUDA 的图像，具有 VLLM 以优化推理。
    ```bash
    bash docker/base/build_image.sh --install-mode vllm
    ```
包括：所有默认功能以及用于高性能推理的 VLLM 支持。
  </TabItem>
  <TabItem value="llama-cpp" label="Llama-cpp">
基于 CUDA 的图像，支持 Llama-cpp。
    ```bash
    bash docker/base/build_image.sh --install-mode llama-cpp
    ```
包括：所有默认功能加上 Llama-cpp 和 Llama-cpp 服务器，通过“CMAKE_ARGS="-DGGML_CUDA=ON"”启用 CUDA 加速。
  </TabItem>
  <TabItem value="full" label="Full">
基于 CUDA 的图像，具有所有可用功能。
    ```bash
    bash docker/base/build_image.sh --install-mode full
    ```
包括：其他模式的所有功能以及嵌入功能。
  </TabItem>
</Tabs>
## 基本用法

### 查看可用模式

要查看所有可用的安装模式及其配置：
```bash
bash docker/base/build_image.sh --list-modes
```
### 获取帮助

显示所有可用选项：
```bash
bash docker/base/build_image.sh --help
```
## 定制选项

### Python版本

DB-GPT 需要 Python 3.10 或更高版本。默认为 Python 3.11，但您可以指定不同的版本：
```bash
bash docker/base/build_image.sh --python-version 3.10
```
### 自定义图像名称

为构建的图像设置自定义名称：
```bash
bash docker/base/build_image.sh --image-name mycompany/dbgpt
```
### 图片名称后缀

为镜像名称添加后缀以进行版本控制或环境识别：
```bash
bash docker/base/build_image.sh --image-name-suffix v1.0
```
这将为默认模式生成“eosphorosai/dbgpt-v1.0”，或为特定模式生成“eosphorosai/dbgpt-MODE-v1.0”。

### 画中画镜子

选择不同的 PIP 索引 URL：
```bash
bash docker/base/build_image.sh --pip-index-url https://pypi.org/simple
```
### Ubuntu 镜像

控制是否使用清华Ubuntu镜像：
```bash
bash docker/base/build_image.sh --use-tsinghua-ubuntu false
```
### 语言偏好

设置您的首选语言（默认为英语）：
```bash
bash docker/base/build_image.sh --language zh
```
## 高级定制

### 自定义附加功能

您可以自定义映像中安装的 Python 包附加功能：
<Tabs>
  <TabItem value="override" label="Override Extras" default>
用您自己的选择完全替换默认的附加功能：
    ```bash
    bash docker/base/build_image.sh --extras "base,proxy_openai,rag,storage_chromadb"
    ```
  </TabItem>
  <TabItem value="add" label="Add Extras">
保留默认的附加功能并添加更多：
    ```bash
    bash docker/base/build_image.sh --add-extras "storage_milvus,storage_elasticsearch,datasource_postgres"
    ```
  </TabItem>
  <TabItem value="mode-specific" label="Mode-Specific">
将特定的附加功能添加到特定的安装模式：
    ```bash
    bash docker/base/build_image.sh --install-mode vllm --add-extras "storage_milvus,datasource_postgres"
    ```
  </TabItem>
</Tabs>
#### 可用的额外选项

以下是您可以添加的一些有用的附加功能：

|额外套餐 |描述 |
|--------------|-------------|
| `storage_milvus` | Vector 商店与 Milvus 集成 |
| `storage_valkey` | Vector 商店与 Valkey 集成 |
| `storage_elasticsearch` |矢量存储与 Elasticsearch 集成 |
| `datasource_postgres` | PostgreSQL 的数据库连接器 |
| `vllm` | VLLM 集成以优化推理 |
| `llama_cpp` | Llama-cpp Python 绑定 |
| `llama_cpp_server` | Llama-cpp HTTP 服务器 |

您可以在本地 DB-GPT 存储库中运行“uv run install_help.py list”来查看所有可用的附加功能。

### 环境变量

DB-GPT 构建支持专门构建的环境变量。使用的主要环境变量是“CMAKE_ARGS”，它对于 Llama-cpp 编译特别重要。
<Tabs>
  <TabItem value="override-env" label="Override Env Vars" default>
替换默认环境变量：
    ```bash
    bash docker/base/build_image.sh --env-vars "CMAKE_ARGS=\"-DGGML_CUDA=ON -DLLAMA_CUBLAS=ON\""
    ```
  </TabItem>
  <TabItem value="add-env" label="Add Env Vars">
添加额外的环境变量：
    ```bash
    bash docker/base/build_image.sh --install-mode llama-cpp --add-env-vars "FORCE_CMAKE=1"
    ```
  </TabItem>
</Tabs>
:::注意
对于 Llama-cpp 模式，会自动设置 CMAKE_ARGS="-DGGML_CUDA=ON" 来启用 CUDA 加速。
:::

### Docker 网络

指定用于构建的 Docker 网络：
```bash
bash docker/base/build_image.sh --network host
```
### 自定义 Dockerfile

使用自定义 Dockerfile：
```bash
bash docker/base/build_image.sh --dockerfile Dockerfile.custom
```
## 示例场景

### 带有 PostgreSQL 和 Elasticsearch 的企业 DB-GPT

构建具有 PostgreSQL 和 Elasticsearch 支持的全功能企业版：
```bash
bash docker/base/build_image.sh --install-mode full \
  --add-extras "storage_elasticsearch,datasource_postgres" \
  --image-name-suffix enterprise \
  --python-version 3.10 \
  --load-examples false
```
### 针对特定硬件优化的 Llama-cpp

使用自定义 Llama-cpp 优化标志构建：
```bash
bash docker/base/build_image.sh --install-mode llama-cpp \
  --env-vars "CMAKE_ARGS=\"-DGGML_CUDA=ON -DGGML_AVX2=OFF -DGGML_AVX512=ON\"" \
  --python-version 3.11
```
### 轻量级 OpenAI 代理

构建一个最小的 OpenAI 代理镜像：
```bash
bash docker/base/build_image.sh --install-mode openai \
  --use-tsinghua-ubuntu false \
  --pip-index-url https://pypi.org/simple \
  --load-examples false
```
### 使用 Milvus 进行开发构建

构建一个支持 Milvus 的开发版本：
```bash
bash docker/base/build_image.sh --install-mode vllm \
  --add-extras "storage_milvus" \
  --image-name-suffix dev
```
## 故障排除
<details>
<summary>Common Build Issues</summary>
### 未找到 CUDA

如果遇到 CUDA 相关错误：
```bash
# Try building with a different CUDA base image
bash docker/base/build_image.sh --base-image nvidia/cuda:12.1.0-devel-ubuntu22.04
```
### 包安装失败

如果附加组件安装失败：
```bash
# Try building with fewer extras to isolate the problem
bash docker/base/build_image.sh --extras "base,proxy_openai,rag"
```
### 网络问题

如果您遇到网络问题：
```bash
# Use a specific network
bash docker/base/build_image.sh --network host
```
</详情>

## API 参考

### 脚本选项

|选项|描述 |默认值 |
|--------|-------------|---------------|
| `--安装模式` |安装方式 | `默认` |
| `--基本图像` |基础 Docker 镜像 | `nvidia/cuda:12.4.0-devel-ubuntu22.04` |
| `--图像名称` | Docker 镜像名称 | `eosphorosai/dbgpt` |
| `--图像名称后缀` |图片名称后缀 | `` |
| `--pip-index-url` | PIP 镜像网址 | `https://pypi.tuna.tsinghua.edu.cn/simple` |
| `--语言` |界面语言 | `en` |
| `--load-examples` |加载示例数据 | `真实` |
| `--python-版本` | Python版本| `3.11` |
| `--使用-tsinghua-ubuntu` |使用清华Ubuntu镜像| `真实` |
| `--额外` |要安装的额外软件包 |模式相关 |
| `--add-extras` |额外的额外套餐 | `` |
| `--env-vars` |构建环境变量|模式相关 |
| `--add-env-vars` |附加环境变量 | `` |
| `--dockerfile` |使用 Dockerfile | `Dockerfile` |
| `--网络` | Docker网络使用| `` |

## 其他资源

- [DB-GPT 文档](https://github.com/eosphoros-ai/DB-GPT)
- [Docker 文档](https://docs.docker.com/)
- [CUDA 文档](https://docs.nvidia.com/cuda/)