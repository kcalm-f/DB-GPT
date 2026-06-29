---
sidebar_position: 5
title: Ollama
---
#奥拉马

配置 DB-GPT 以使用 [Ollama](https://ollama.ai) 在本地运行模型。 Ollama 提供了在您自己的计算机上运行开源模型的最简单方法。

## 先决条件

- [Ollama](https://ollama.ai) 安装并运行
- DB-GPT 安装了额外的 `proxy_ollama`

## 安装奥拉玛
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="mac" label="macOS" default>

```bash
# Download from https://ollama.ai or use Homebrew:
brew install ollama
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

  </TabItem>
  <TabItem value="windows" label="Windows">
从 [ollama.ai](https://ollama.ai) 下载安装程序。
  </TabItem>
</Tabs>
### 拉模型
```bash
# Pull a chat model
ollama pull deepseek-r1:1.5b

# Pull an embedding model
ollama pull bge-m3:latest
```
:::提示
使用“ollama list”查看所有下载的模型。
:::

## 安装 DB-GPT 依赖项
```bash
uv sync --all-packages \
  --extra "base" \
  --extra "proxy_ollama" \
  --extra "rag" \
  --extra "storage_chromadb" \
  --extra "dbgpts"
```
## 配置

编辑`configs/dbgpt-proxy-ollama.toml`：
```toml
[models]
[[models.llms]]
name = "deepseek-r1:1.5b"
provider = "proxy/ollama"
api_base = "http://localhost:11434"
api_key = ""

[[models.embeddings]]
name = "bge-m3:latest"
provider = "proxy/ollama"
api_url = "http://localhost:11434"
api_key = ""
```
:::信息
对于本地 Ollama，`api_key` 可以留空。如果在不同的计算机上运行 Ollama，请更新“api_base”以指向该主机。
:::

## 热门型号选择

### 聊天模型

|型号|拉命令 |尺寸|笔记|
|---|---|---|---|
| DeepSeek-R1 1.5B | `ollama 拉 deepseek-r1:1.5b` | 〜1 GB |小、快、推理 |
| Qwen2.5 7B | `ollama 拉 qwen2.5:7b` | 〜4.7 GB |良好的平衡性|
|骆驼 3.1 8B | `ollama 拉 llama3.1:8b` | 〜4.7 GB |元最新|
|米斯特拉尔 7B | `ollama 拉米斯特拉尔：7b` | 〜4.1 GB |快速通用|

### 嵌入模型

|型号|拉命令 |笔记|
|---|---|---|
| bge-m3 | `ollama pull bge-m3：最新` |多语言 |
|经济嵌入文本 | `ollama 拉 nomic-embed-text` |以英语为主 |

## 启动服务器

确保 Ollama 首先运行：
```bash
# Start Ollama (if not running as a service)
ollama serve
```
然后启动DB-GPT：
```bash
uv run dbgpt start webserver --config configs/dbgpt-proxy-ollama.toml
```
## 故障排除

|问题 |解决方案 |
|---|---|
|连接被拒绝 |确保 Ollama 正在运行：`ollamaserve` |
|找不到型号 |首先拉取模型：`ollama pull model-name` |
|反应慢|尝试较小的模型或确保正在使用 GPU |
|内存不足 |使用较小的量化模型（例如`qwen2.5:7b-q4_0`）|

## 接下来是什么

- [入门](/docs/getting-started/quick-start) — 完整设置演练
- [Ollama Advanced](/docs/installation/advanced_usage/ollama) — 高级 Ollama 配置
- [模型提供程序](/docs/getting-started/providers/) — 尝试其他提供程序