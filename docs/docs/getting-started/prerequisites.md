---
sidebar_position: 1
title: 先决条件
summary: "在本地或 Docker 中运行 DB-GPT 之前需要准备的内容"
read_when:
  - 你想在设置前确认 Python、uv、Docker 或 GPU 等环境要求
  - 你正在选择 API 代理模式还是本地模型模式
---

# 先决条件

安装 DB-GPT 之前需要准备的所有内容。

:::tip 快速检查
已经有 Python 3.10+ 和 uv？直接跳到[快速开始](/docs/getting-started/quick-start)。
:::

## 必需

| 要求 | 版本 | 检查命令 |
|---|---|---|
| **Python** | 3.10 或更新 | `python --version` |
| **uv** | 最新版 | `uv --version` |
| **Git** | 任意近期版本 | `git --version` |

### Python

DB-GPT 需要 **Python 3.10+**。推荐使用 Python 3.11 以获得最佳兼容性。

```bash
python --version
# Python 3.11.x
```

:::info
如果你需要管理多个 Python 版本，可以考虑使用 [pyenv](https://github.com/pyenv/pyenv) 或 [conda](https://docs.conda.io/)。
:::

### uv（包管理器）

从 v0.7.0 开始，DB-GPT 使用 [uv](https://docs.astral.sh/uv/) 进行环境和包管理，提供更快速、更稳定的依赖解析。

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="shell" label="macOS / Linux" default>

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

  </TabItem>
  <TabItem value="pipx" label="pipx">

```bash
python -m pip install --upgrade pip
python -m pip install --upgrade pipx
python -m pipx ensurepath
pipx install uv --global
```

  </TabItem>
  <TabItem value="other" label="其他">

请参阅完整的 [uv 安装指南](https://docs.astral.sh/uv/getting-started/installation/)，了解 Homebrew、Scoop 和其他安装方式。

  </TabItem>
</Tabs>

验证安装：

```bash
uv --version
```

## 首先选择合适的设置

- **最快设置：** API 代理模型（OpenAI、DeepSeek、Qwen、SiliconFlow）— 无需 GPU
- **隐私优先的本地设置：** Ollama — 本地模型运行时，可选 GPU
- **高性能本地推理：** vLLM 或 HuggingFace GPU 栈 — 需要 NVIDIA GPU

## 可选（根据部署方式）

### Web UI 开发

| 要求 | 版本 | 检查命令 |
|---|---|---|
| **Node.js** | 18 或更新 | `node --version` |
| **npm** | 8 或更新 | `npm --version` |

### 本地模型部署

| 要求 | 详情 |
|---|---|
| **NVIDIA GPU** | CUDA 12.1+ 用于 GPU 加速推理 |
| **CUDA Toolkit** | vLLM、HuggingFace Transformers GPU 模式所需 |
| **足够的显存** | 7B 模型需 8 GB+，13B+ 模型需 24 GB+ |

:::info
如果你只使用 API 代理模型（OpenAI、DeepSeek 等），**无需 GPU**。你可以在纯 CPU 机器上运行。
:::

### Docker 部署

| 要求 | 版本 | 检查命令 |
|---|---|---|
| **Docker** | 20.10+ | `docker --version` |
| **Docker Compose** | 2.0+ | `docker compose version` |
| **NVIDIA Container Toolkit** | 最新版（仅 GPU） | `nvidia-smi` |

## 系统资源

| 部署类型 | CPU | 内存 | 磁盘 |
|---|---|---|---|
| **仅 API 代理** | 2 核 | 4 GB | 10 GB |
| **本地 7B 模型** | 4 核 | 16 GB | 30 GB |
| **本地 13B+ 模型** | 8 核 | 32 GB | 60 GB |

## 网络注意事项（中国大陆）

如果你在中国大陆地区，建议配置 PyPI 镜像以加速包下载：

```bash
# 将镜像设置为环境变量
echo "export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple" >> ~/.bashrc
source ~/.bashrc
```

或在每个 `uv sync` 命令后追加 `--index-url`：

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --index-url=https://pypi.tuna.tsinghua.edu.cn/simple
```

## 下一步

准备好了吗？前往[快速开始](/docs/getting-started/quick-start)，5 分钟完成设置。
