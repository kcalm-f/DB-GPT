---
sidebar_position: 1
---

# CLI 快速开始

从 PyPI 安装 DB-GPT 并一条命令启动 — 无需检出源码。

:::tip 先决条件
- Python **3.10** 或更新版本
- [uv](https://docs.astral.sh/uv/getting-started/installation/) 包管理器（推荐）或 pip
:::

## 1. 安装

```bash
# 推荐：使用 uv
uv pip install dbgpt-app

# 或使用 pip
pip install dbgpt-app
```

:::tip 使用 PyPI 镜像
如需更快下载，安装时指定镜像：

```bash
uv pip install dbgpt-app --index-url https://pypi.tuna.tsinghua.edu.cn/simple  # uv

pip install dbgpt-app -i https://pypi.tuna.tsinghua.edu.cn/simple              # pip
```

或者设置环境变量，将镜像应用于当前 shell 会话中的**所有**安装：

```bash
export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple   # uv

export PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple  # pip
```
:::

:::info 包含内容
默认安装包括**核心框架**（CLI、FastAPI、SQLAlchemy、Agent）、
**OpenAI 兼容的大模型支持**（也适用于 Kimi、Qwen、MiniMax、Z.AI）、
**DashScope / 通义**支持、**RAG 文档解析**和 **ChromaDB** 向量存储。

需要额外的提供商或数据源？请参阅[可选模块](#8-可选模块)。
:::

安装后，`dbgpt` 命令可在终端中使用。

## 2. 启动 DB-GPT

```bash
dbgpt start
```

就这么简单！首次运行时，DB-GPT 将启动一个**交互式设置向导**，帮助你：

1. 选择大模型提供商（OpenAI、Kimi、Qwen、MiniMax、Z.AI 或自定义端点）
2. 输入你的 API 密钥（或使用环境变量）
3. 确认模型名称和 API 基础 URL

完成后，TOML 配置文件将写入 `~/.dbgpt/configs/<profile>.toml`，Web 服务器自动启动。

### 启动界面示例

```
    ____  ____        ____ ____ _____
   |  _ \| __ )      / ___|  _ \_   _|
   | | | |  _ \ ____| |  _| |_) || |
   | |_| | |_) |____| |_| |  __/ | |
   |____/|____/      \____|_|    |_|

   🚀 DB-GPT 快速开始

   +- - - - - - - - - - - - - - - - - - - - - - - -+
   :  配置文件:   openai                              :
   :  配置路径:   /Users/you/.dbgpt/configs/openai.toml:
   :  工作目录:   /Users/you/.dbgpt/workspace          :
   +- - - - - - - - - - - - - - - - - - - - - - - -+
```

## 3. 打开 Web UI

然后打开 [http://localhost:5670](http://localhost:5670)。

---

## 4. 命令参考

### 概述

```
dbgpt [OPTIONS] COMMAND [ARGS]...

选项：
  --log-level TEXT   日志级别（默认：warn）
  --version          显示版本并退出
  --help             显示帮助信息

命令：
  start     启动 DB-GPT 服务器
  stop      停止运行中的服务器
  setup     配置大模型提供商（交互式向导或 CI 模式）
  profile   管理配置配置文件
  knowledge 知识库操作
  model     管理模型服务
  db        数据库管理和迁移
  ...
```

---

### `dbgpt start`

启动 DB-GPT Web 服务器。不带子命令运行 `dbgpt start` 等同于 `dbgpt start web`。

#### 子命令

| 子命令 | 描述 |
|---|---|
| `web`（或 `webserver`） | 启动 Web 服务器（默认） |
| `none` | 仅 API 模式 — *计划在未来版本中发布* |
| `controller` | 启动模型控制器 |
| `worker` | 启动模型工作节点 |
| `apiserver` | 启动 API 服务器 |

#### `dbgpt start web` 选项

| 选项 | 缩写 | 类型 | 默认值 | 描述 |
|---|---|---|---|---|
| `--config` | `-c` | PATH | *自动* | TOML 配置文件路径。如果省略，使用当前配置文件或启动设置向导。 |
| `--profile` | `-p` | TEXT | *当前* | 提供商配置文件名（`openai`、`kimi`、`qwen`、`minimax`、`glm`、`custom`）。覆盖当前配置文件。 |
| `--yes` | `-y` | FLAG | false | 非交互模式：跳过向导，使用默认值/环境变量。适用于 CI/CD。 |
| `--api-key` | | TEXT | *环境变量* | 所选提供商的 API 密钥。也可通过提供商自己的环境变量设置。 |
| `--daemon` | `-d` | FLAG | false | 以后台守护进程运行。使用 `dbgpt stop webserver` 停止。 |

#### 示例

```bash
# 交互式（首次运行）— 向导将引导你
dbgpt start

# 使用已有配置文件
dbgpt start web --profile openai

# 非交互模式，显式指定 API 密钥
dbgpt start web --profile kimi --api-key sk-xxx --yes

# 使用指定配置文件
dbgpt start web --config /path/to/my-config.toml

# 以守护进程运行
dbgpt start web --daemon
```

#### 配置解析优先级

Web 服务器启动时，配置文件按以下顺序解析：

1. **`--config` 标志** — 如果指定，直接使用此文件
2. **`--profile` 标志** — 查找 `~/.dbgpt/configs/<profile>.toml`
3. **当前配置文件** — 从 `~/.dbgpt/config.toml` 读取
4. **设置向导** — 如果尚未配置，启动交互式向导

---

### `dbgpt stop`

停止运行中的 DB-GPT 服务器进程。

```bash
# 停止 Web 服务器
dbgpt stop webserver

# 停止指定端口的 Web 服务器
dbgpt stop webserver --port 5670

# 停止所有服务器
dbgpt stop all
```

---

### `dbgpt setup`

以交互式或非交互/CI 模式配置大模型提供商。此命令将 TOML 配置写入 `~/.dbgpt/configs/<profile>.toml` 并将其标记为当前配置文件。

#### 选项

| 选项 | 缩写 | 类型 | 默认值 | 描述 |
|---|---|---|---|---|
| `--profile` | `-p` | TEXT | *交互式* | 要配置的提供商配置文件。如果省略，将显示交互式菜单。 |
| `--yes` | `-y` | FLAG | false | 非交互模式：跳过向导，使用默认值。 |
| `--api-key` | | TEXT | *环境变量* | API 密钥。也会读取 `DBGPT_API_KEY` 环境变量。 |
| `--show` | | FLAG | false | 显示当前活动配置文件和配置路径，然后退出。 |

#### 示例

```bash
# 交互式向导
dbgpt setup

# 非交互模式：使用 OpenAI 和环境变量密钥
export OPENAI_API_KEY=sk-xxx
dbgpt setup --profile openai --yes

# 非交互模式，显式指定密钥
dbgpt setup --profile kimi --api-key sk-xxx

# 显示当前配置
dbgpt setup --show
```

---

### `dbgpt profile`

管理多个配置配置文件。每个配置文件是 `~/.dbgpt/configs/` 下的一个 TOML 文件。

#### 子命令

| 子命令 | 描述 |
|---|---|
| `list` | 列出所有配置文件。当前配置文件用 `*` 标记。 |
| `show <name>` | 显示配置文件的 TOML 内容。 |
| `create <name>` | 使用设置向导创建（或重新配置）配置文件。 |
| `switch <name>` | 将配置文件设为当前默认。 |
| `delete <name>` | 删除配置文件。 |

#### 示例

```bash
# 列出所有配置文件
dbgpt profile list
#   openai     ← 无星号
# * kimi       ← 当前

# 显示配置文件内容
dbgpt profile show openai

# 创建新配置文件
dbgpt profile create qwen

# 切换当前配置文件
dbgpt profile switch openai

# 删除配置文件
dbgpt profile delete minimax
dbgpt profile delete minimax --yes  # 跳过确认
```

---

## 5. 支持的提供商

设置向导和 `--profile` 标志支持以下提供商：

| 配置文件名 | 显示名称 | 大模型 | 嵌入模型 | API 密钥环境变量 |
|---|---|---|---|---|
| `openai` | OpenAI | gpt-4o | text-embedding-3-small | `OPENAI_API_KEY` |
| `kimi` | Kimi | kimi-k2 | text-embedding-v3 | `MOONSHOT_API_KEY`（+ `DASHSCOPE_API_KEY` 用于嵌入） |
| `qwen` | Qwen | qwen-plus | text-embedding-v3 | `DASHSCOPE_API_KEY` |
| `minimax` | MiniMax | abab6.5s-chat | embo-01 | `MINIMAX_API_KEY` |
| `glm` | Z.AI | glm-4-plus | embedding-3 | `ZHIPUAI_API_KEY` |
| `custom` | 自定义 | gpt-4o | text-embedding-3-small | `OPENAI_API_KEY` |

:::info
**自定义**配置文件允许你连接到任何 OpenAI 兼容的 API 端点。在向导中会要求你输入 API 基础 URL。
:::

---

## 6. 目录结构

首次运行后，DB-GPT 在你的主目录下创建以下结构：

```
~/.dbgpt/
├── config.toml              # 记录当前配置文件名
├── configs/
│   ├── openai.toml          # 配置文件：OpenAI
│   ├── kimi.toml            # 配置文件：Kimi
│   └── ...                  # 每个配置文件一个文件
└── workspace/
    └── pilot/               # 运行时工作目录（数据库、数据文件等）
        ├── meta_data/
        │   └── dbgpt.db     # SQLite 元数据数据库
        └── data/             # 向量存储数据
```

### 环境变量

| 变量 | 默认值 | 描述 |
|---|---|---|
| `DBGPT_HOME` | `~/.dbgpt` | 覆盖 DB-GPT 主目录 |
| `OPENAI_API_KEY` | — | OpenAI API 密钥（`openai` 和 `custom` 配置文件使用） |
| `MOONSHOT_API_KEY` | — | Kimi / Moonshot API 密钥 |
| `DASHSCOPE_API_KEY` | — | Qwen / DashScope API 密钥（也用于 Kimi 嵌入） |
| `MINIMAX_API_KEY` | — | MiniMax API 密钥 |
| `ZHIPUAI_API_KEY` | — | Z.AI / 智谱 API 密钥 |
| `DBGPT_API_KEY` | — | 通用 API 密钥（`--api-key` 标志的备用） |
| `DBGPT_LANG` | `en` | UI 语言（`en` 或 `zh`） |

---

## 7. 常见工作流

### 首次设置

```bash
pip install dbgpt-app
dbgpt start
# 跟随向导 → 选择提供商 → 输入 API 密钥 → 服务器启动
```

### 在提供商之间切换

```bash
# 创建 Kimi 配置文件
dbgpt profile create kimi

# 切换到它
dbgpt profile switch kimi

# 使用新配置文件启动
dbgpt start
```

### CI/CD 部署

```bash
export OPENAI_API_KEY=sk-xxx
dbgpt setup --profile openai --yes
dbgpt start web --daemon
```

### 自定义端点（例如 Azure OpenAI、本地 vLLM）

```bash
dbgpt setup --profile custom
# 向导将询问：
#   - API 基础 URL（例如 http://localhost:8000/v1）
#   - API 密钥
#   - 模型名称
```

---

## 8. 可选模块

当你 `pip install dbgpt-app` 时，核心框架默认包含在内。使用 extras 添加大模型提供商、向量存储、数据源等。

### 大模型提供商

| Extra | 提供商 | 关键包 |
|-------|----------|-------------|
| `proxy_openai` | OpenAI、Kimi、Qwen、MiniMax、Z.AI 及任何 OpenAI 兼容 API | `openai`、`tiktoken` |
| `proxy_ollama` | Ollama（本地模型） | `ollama` |
| `proxy_zhipuai` | 智谱 AI（GLM） | `openai` |
| `proxy_tongyi` | 通义千问 | `openai`、`dashscope` |
| `proxy_qianfan` | 百度千帆 | `qianfan` |
| `proxy_anthropic` | Anthropic Claude | `anthropic` |

### 向量存储

| Extra | 存储 | 关键包 |
|-------|---------|-------------|
| `storage_chromadb` | ChromaDB | `chromadb`、`onnxruntime` |
| `storage_milvus` | Milvus | `pymilvus` |
| `storage_valkey` | Valkey | `valkey-glide` |
| `storage_weaviate` | Weaviate | `weaviate-client` |
| `storage_elasticsearch` | Elasticsearch | `elasticsearch` |
| `storage_obvector` | OBVector | `pyobvector` |

### 知识库与 RAG

| Extra | 功能 | 关键包 |
|-------|-------------|-------------|
| `rag` | 文档解析（PDF、DOCX、PPTX、Markdown、HTML） | `spacy`、`pypdf`、`python-docx`、`python-pptx` |
| `graph_rag` | 基于图的 RAG（TuGraph/Neo4j） | `networkx`、`neo4j` |

### 数据源

| Extra | 数据库 | 关键包 |
|-------|----------|-------------|
| `datasource_mysql` | MySQL | `mysqlclient` |
| `datasource_postgres` | PostgreSQL | `psycopg2-binary` |
| `datasource_clickhouse` | ClickHouse | `clickhouse-connect` |
| `datasource_oracle` | Oracle | `oracledb` |
| `datasource_mssql` | SQL Server | `pymssql` |
| `datasource_spark` | Apache Spark | `pyspark` |
| `datasource_hive` | Hive | `pyhive` |
| `datasource_vertica` | Vertica | `vertica-python` |

### 示例：组合多个 extras

```bash
# OpenAI + ChromaDB + RAG + MySQL
pip install "dbgpt-app[proxy_openai,storage_chromadb,rag,datasource_mysql]"
```

:::tip 最小安装
如果只需要核心框架，不需要任何大模型或存储：
```bash
pip install dbgpt-app
```
这将提供 CLI、FastAPI 服务器和智能体框架 — 但你需要至少添加一个大模型提供商 extra 才能实际使用。
:::

---

## 9. 故障排除

### 端口已被占用

```bash
# 停止现有服务器
dbgpt stop webserver --port 5670

# 或编辑配置文件选择不同端口
# [service.web]
# port = 5671
```

### "No config file found" 错误

这意味着尚未设置配置文件。运行：

```bash
dbgpt setup
```

### 更改 API 密钥

对同一配置文件重新运行设置向导 — 它将覆盖现有配置：

```bash
dbgpt setup --profile openai
# 或直接编辑 ~/.dbgpt/configs/openai.toml
```

### 查看当前配置

```bash
dbgpt setup --show
dbgpt profile show openai
```
