---
sidebar_position: 0
title: Source Code Deployment
summary: "Run DB-GPT from source with uv, configure a provider, and verify the webserver"
read_when:
  - You want the repo-based install instead of Docker
  - You need the most flexible setup for development or customization
---
# 源码部署

直接从源代码部署 DB-GPT。这是开发、调试和自定义集成最灵活的选项。
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
## 硬件要求

|模式| CPU×内存|图形处理器 |笔记|
|---|---|---|---|
| API代理| 4C × 8GB |无 |代理模式不使用本地GPU |
|本地模特| 8C×32GB| ≥ 24 GB 显存 |支持 CUDA 的 NVIDIA GPU |

## 步骤 1 — 克隆存储库
```bash
git clone https://github.com/eosphoros-ai/DB-GPT.git
cd DB-GPT
```
## 步骤 2 — 安装 uv
<Tabs>
  <TabItem value="sh" label="macOS / Linux" default>

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

  </TabItem>
  <TabItem value="pypi" label="PyPI (pipx)">

```bash
python -m pip install --upgrade pip
python -m pip install --upgrade pipx
python -m pipx ensurepath
pipx install uv --global
```

  </TabItem>
</Tabs>
核实：
```bash
uv --version
```
## 步骤 3 — 安装依赖项
<Tabs>
  <TabItem value="openai" label="OpenAI (proxy)" default>

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek (proxy)">

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_openai" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```
:::信息
DeepSeek 使用 OpenAI 兼容的代理，因此附加功能与 OpenAI 相同。
:::
  </TabItem>
  <TabItem value="ollama" label="Ollama (local)">

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_ollama" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```

  </TabItem>
  <TabItem value="gpu" label="Local GPU (HuggingFace)">

```bash
uv sync --all-packages \
  --extra "base" \
  --extra "cuda121" \
  --extra "hf" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "quant_bnb" \
  --extra "dbgpts"
```

  </TabItem>
</Tabs>

<details>
<summary><strong>Use the interactive install helper</strong></summary>
DB-GPT 提供了一个交互式帮助程序来生成正确的“uvsync”命令：
```bash
uv run install_help.py install-cmd --interactive
```
或者列出所有可用的附加功能：
```bash
uv run install_help.py list
```
</详情>

## 步骤 4 — 配置您的模型

编辑您选择的提供商的 TOML 配置文件。有关详细信息，请参阅[模型提供程序](/docs/getting-started/providers/)。
<Tabs>
  <TabItem value="openai" label="OpenAI" default>
编辑`configs/dbgpt-proxy-openai.toml`：
```toml
[models]
[[models.llms]]
name = "chatgpt_proxyllm"
provider = "proxy/openai"
api_key = "your-openai-api-key"    # <-- replace

[[models.embeddings]]
name = "text-embedding-3-small"
provider = "proxy/openai"
api_key = "your-openai-api-key"    # <-- replace
```

  </TabItem>
  <TabItem value="deepseek" label="DeepSeek">
编辑`configs/dbgpt-proxy-deepseek.toml`：
```toml
[models]
[[models.llms]]
name = "deepseek-reasoner"
provider = "proxy/deepseek"
api_key = "your-deepseek-api-key"  # <-- replace

[[models.embeddings]]
name = "BAAI/bge-large-zh-v1.5"
provider = "hf"
```
:::信息
如果使用 HuggingFace 嵌入，还要在安装命令中添加 `--extra "hf"` 和 `--extra "cpu"`。
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
:::提示 环境变量
在 TOML 中使用“${env:OPENAI_API_KEY}”语法从环境变量中读取而不是硬编码密钥。
:::

## 步骤 5 — 启动服务器
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
## 步骤 6 — 打开 Web UI

打开浏览器并访问 **[http://localhost:5670](http://localhost:5670)**。

:::tip 验证它是否有效
如果 Web UI 加载并且您可以开始聊天对话，则您的 DB-GPT 正在运行。
:::

## 常见的首次运行问题

- **`uv 同步`失败**
  - 重新检查Python和uv：[先决条件](/docs/getting-started/preventions)
  - 如果您在中国，请通过“UV_INDEX_URL”使用镜子
- **提供商身份验证失败**
  - 验证“configs/”下选定的 TOML 文件
  - 检查匹配的提供程序指南：[模型提供程序](/docs/getting-started/providers/)
- **服务器启动但 UI 为空白**
  - 确认终端显示网络服务器已正常启动
  - 检查另一个进程是否已经在使用端口“5670”

## 数据库配置
<Tabs>
  <TabItem value="sqlite" label="SQLite (default)" default>
SQLite 是默认设置 — 表是自动创建的。无需额外设置。
```toml
[service.web.database]
type = "sqlite"
path = "pilot/meta_data/dbgpt.db"
```

  </TabItem>
  <TabItem value="mysql" label="MySQL">
1、创建数据库：
```bash
mysql -h127.0.0.1 -uroot -p{your_password} < ./assets/schema/dbgpt.sql
```
2. 更新您的 TOML 配置：
```toml
[service.web.database]
type = "mysql"
host = "127.0.0.1"
port = 3306
user = "root"
database = "dbgpt"
password = "your-password"
```

  </TabItem>
</Tabs>
## 加载测试数据（可选）
```bash
# Linux / macOS
bash ./scripts/examples/load_examples.sh

# Windows
.\scripts\examples\load_examples.bat
```
## 单独运行Web前端（可选）

对于前端开发或自定义 UI 工作：
```bash
cd web && npm install
cp .env.template .env
# Edit .env — set API_BASE_URL=http://localhost:5670
npm run dev
```
打开[http://localhost:3000](http://localhost:3000)。

## 后续步骤

|主题 |链接 |
|---|---|
|配置更多模型提供者 | [模型提供者](/docs/getting-started/providers/) |
|使用 Docker 进行部署 | [Docker](/docs/getting-started/deploy/docker) |
|作为集群部署 | [集群](/docs/getting-started/deploy/cluster) |
|探索 Web UI | [Web UI 指南](/docs/getting-started/web-ui/) |