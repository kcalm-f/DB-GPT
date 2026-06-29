---
sidebar_position: 2
title: 快速开始
summary: "从克隆到运行 DB-GPT 聊天的最短路径"
read_when:
  - 你想要以最少的设置完成第一次成功的 DB-GPT 运行
  - 你需要一个具体的首次运行检查清单和快速验证
---

# 快速开始

目标：从零开始，用最少的设置完成第一次聊天。

:::info 最快路径
使用 **API 代理**（OpenAI 或 DeepSeek）— 无需 GPU。你将在 5 分钟内拥有一个可用的 DB-GPT 聊天。
:::

## 你需要准备

* Python 3.10 或更新版本
* uv 包管理器

:::tip
使用 `python --version` 和 `uv --version` 检查你的版本。完整要求：[先决条件](/docs/getting-started/prerequisites)。
:::

## 快速设置

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### 第 1 步 — 克隆仓库

```bash
git clone https://github.com/eosphoros-ai/DB-GPT.git
cd DB-GPT
```

### 第 2 步 — 安装依赖

<Tabs>
  <TabItem value="openai" label="OpenAI (代理)" default>

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek (代理)">

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```

  </TabItem>
  <TabItem value="ollama" label="Ollama (本地)">

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_ollama" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```

  </TabItem>
</Tabs>

### 第 3 步 — 配置模型

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

编辑 `configs/dbgpt-proxy-openai.toml` 并设置你的 API 密钥：

```toml
[models]
[[models.llms]]
name = "chatgpt_proxyllm"
provider = "proxy/openai"
api_key = "your-openai-api-key"    # <-- 替换为你的密钥

[[models.embeddings]]
name = "text-embedding-3-small"
provider = "proxy/openai"
api_key = "your-openai-api-key"    # <-- 替换为你的密钥
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek">

编辑 `configs/dbgpt-proxy-deepseek.toml` 并设置你的 API 密钥：

```toml
[models]
[[models.llms]]
name = "deepseek-reasoner"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"  # <-- 替换为你的密钥

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
```

:::info
默认的嵌入模型是 `BAAI/bge-large-zh-v1.5`。如果使用 HuggingFace 嵌入，还需在安装命令中添加 `--extra "hf"` 和 `--extra "cpu"`。
:::

  </TabItem>
  <TabItem value="ollama" label="Ollama">

确保 [Ollama](https://ollama.ai) 正在运行，然后编辑 `configs/dbgpt-proxy-ollama.toml`：

```toml
[models]
[[models.llms]]
name = "qwen2.5:latest"
provider = "proxy/ollama"
api_base = "http://localhost:11434"

[[models.embeddings]]
name = "nomic-embed-text:latest"
provider = "proxy/ollama"
api_base = "http://localhost:11434"
```

  </TabItem>
</Tabs>

### 第 4 步 — 启动服务器

<Tabs>
  <TabItem value="openai" label="OpenAI" default>

```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-openai.toml
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek">

```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-deepseek.toml
```

  </TabItem>
  <TabItem value="ollama" label="Ollama">

```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-ollama.toml
```

  </TabItem>
</Tabs>

### 第 5 步 — 打开 Web UI

打开浏览器访问 **[http://localhost:5670](http://localhost:5670)**。

:::tip 验证是否成功
如果 Web UI 加载成功并且你可以开始聊天对话，说明你的 DB-GPT 已准备就绪。
:::

## 验证

- Web 服务器正在运行
- 你的模型配置加载无错误
- Web UI 在 `http://localhost:5670` 打开
- SQLite 作为默认元数据存储可用

## 常见首次运行问题

- **`uv: command not found`**
  - 先安装 uv：[先决条件](/docs/getting-started/prerequisites)
- **模型密钥/认证错误**
  - 重新检查 `configs/` 下的提供商配置
  - 从这里开始：[模型提供商](/docs/getting-started/providers/)
- **Web UI 无法加载**
  - 确认服务器正在监听 `5670` 端口
  - 检查启动 DB-GPT 的终端中的服务器日志
- **本地模型无响应**
  - 确认 Ollama 或你的本地推理后端已在运行

## 如需更多

- **单独运行 Web 前端**

  ```bash
  cd web && npm install
  cp .env.template .env
  # 编辑 .env — 设置 API_BASE_URL=http://localhost:5670
  npm run dev
  ```

  然后打开 [http://localhost:3000](http://localhost:3000)。

- **使用安装助手**

  ```bash
  uv run install_help.py install-cmd --interactive
  uv run install_help.py list
  ```

- **使用不同的数据库**
  - 默认为 SQLite
  - 如需 MySQL、PostgreSQL 等，请参阅[数据源](/docs/getting-started/concepts/data-sources)

- **有用的环境变量**
  - `UV_INDEX_URL` — PyPI 镜像地址
  - `OPENAI_API_KEY` — 替代在 TOML 中存储密钥的方式
  - `CUDA_VISIBLE_DEVICES` — GPU 设备选择
  - 完整参考：[配置参考](/docs/config/config-reference)

## 深入了解

| 主题 | 链接 |
|---|---|
| 完整架构概述 | [架构](/docs/getting-started/concepts/architecture) |
| 连接更多模型提供商 | [模型提供商](/docs/getting-started/providers/) |
| Docker 部署 | [Docker](/docs/getting-started/deploy/docker) |
| 知识库设置 | [知识库](/docs/getting-started/web-ui/knowledge-base) |

## 下一步

* 配置模型提供商：[模型提供商](/docs/getting-started/providers/)
* 使用 Docker 部署：[Docker 部署](/docs/getting-started/deploy/docker)
* 探索 Web UI：[Web UI 指南](/docs/getting-started/web-ui/)
* 构建你的第一个 AWEL 工作流：[AWEL 快速开始](/docs/awel/cookbook/quickstart_basic_awel_workflow)
