---
sidebar_position: 1
title: Quick Install
summary: "The fastest way to install DB-GPT with the installer script from the README"
read_when:
  - You want the shortest path to a working DB-GPT web UI
  - You prefer the installer script over a manual source setup
---
从“@site/src/components/mdx/CommandCopyCard”导入CommandCopyCard；

# 快速安装

运行 DB-GPT 的最快方法。安装程序脚本会准备本地 DB-GPT 工作区、生成提供程序配置文件，并为您提供可立即运行的 Web 服务器命令。

## 推荐：安装程序脚本

如果您想要从零到工作 DB-GPT Web UI 的最短路径，请使用安装程序脚本。

<CommandCopyCard 命令={`curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh | bash`} />

## 系统要求

此快速安装流程设计用于：

- **macOS** 或 **Linux**
- 可以运行 bash 的 shell 环境
- 网络访问下载依赖项
- 如果您计划立即使用托管模型提供商，则需要 API 密钥

:::提示 最适合
如果您想快速尝试 DB-GPT 而无需自行管理存储库结构，请选择此路径。
:::

## 使用提供商配置文件进行安装

如果您已经知道所需的提供商，请在安装过程中直接传递配置文件和 API 密钥。

### OpenAI 兼容配置文件

<CommandCopyCard 命令={`curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh \
  | OPENAI_API_KEY=sk-xxx bash -s -- --profile openai`} />

### Kimi 2.5 通过 Moonshot API

<CommandCopyCard 命令={`curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh \
  | MOONSHOT_API_KEY=sk-xxx bash -s -- --profile kimi`} />

### MiniMax 通过 OpenAI 兼容的 API

<CommandCopyCard 命令={`curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh \
  | MINIMAX_API_KEY=sk-xxx bash -s -- --profile minimax`} />

## 重用现有的本地结账

已经有本地 DB-GPT 存储库？重用它而不是克隆到`~/.dbgpt/DB-GPT`。

### 通过 OpenAI 重用本地存储库

<CommandCopyCard 命令={`OPENAI_API_KEY=sk-xxx \
  bash脚本/install/install.sh --profile openai --repo-dir "$(pwd)" --yes`} />

### 与 Kimi 重用本地存储库

<CommandCopyCard 命令={`MOONSHOT_API_KEY=sk-xxx \
  bash 脚本/install/install.sh --profile kimi --repo-dir "$(pwd)" --yes`} />

### 通过 MiniMax 重用本地存储库

<CommandCopyCard 命令={`MINIMAX_API_KEY=sk-xxx \
  bash 脚本/install/install.sh --profile minimax --repo-dir "$(pwd)" --yes`} />

## 安装程序准备什么

安装程序脚本为您设置通用运行时布局：

- 在 `~/.dbgpt/DB-GPT` 下签出 DB-GPT，除非使用 `--repo-dir`
- 在`~/.dbgpt/configs/`下生成的提供程序配置
- `~/.dbgpt/` 下的 DB-GPT 主目录
- 使用生成的配置文件的准备运行的网络服务器命令

## 安装后启动DB-GPT

安装完成后，使用生成的配置文件配置启动网络服务器：

<CommandCopyCard command={`cd ~/.dbgpt/DB-GPT && uv run dbgpt start webserver --profile <配置文件>`} />

然后打开[http://localhost:5670](http://localhost:5670)。

## 验证安装

如果满足以下条件，则您的安装工作正常：

- 网络服务器启动时没有配置错误
- Web UI 在 `http://localhost:5670` 打开
- 您可以在浏览器中开始聊天

## 先回顾一下脚本

如果您希望在运行之前检查安装程序：
```bash
curl -fsSL https://raw.githubusercontent.com/eosphoros-ai/DB-GPT/main/scripts/install/install.sh -o install.sh
less install.sh
bash install.sh --profile openai
```
## 替代安装方法

如果安装程序脚本不适合您的环境：

- 使用 [CLI Install](/docs/getting-started/cli-quickstart) 通过 `dbgpt` 命令进行基于 PyPI 的安装
- 使用[源安装](/docs/getting-started/deploy/source-code) 进行开发、调试和定制

## 故障排除

### 安装程序脚本与我的 shell 或平台不匹配

请改用 [CLI 安装](/docs/getting-started/cli-quickstart) 或 [源安装](/docs/getting-started/deploy/source-code)。

### 我想要更多地控制依赖项和配置

使用[源安装](/docs/getting-started/deploy/source-code)。它公开了完整的存储库布局和“uv同步”工作流程。

### 安装已完成，但 DB-GPT 未正常启动

检查“~/.dbgpt/configs/”下生成的配置，然后参见[安装问题](/docs/getting-started/troubleshooting/installation)。