---
sidebar_position: 3
title: Environment Variables
---
# 环境变量

DB-GPT 中常用环境变量的参考。

:::提示
大多数配置是通过 TOML 配置文件完成的。环境变量对于秘密、Docker 部署和覆盖默认值很有用。
:::

## 型号配置

|变量|描述 |示例|
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API 密钥 | `sk-...` |
| `OPENAI_API_BASE` | OpenAI 兼容 API 基本 URL | `https://api.openai.com/v1` |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | `sk-...` |
| `SILICONFLOW_API_KEY` | SiliconFlow API 密钥 | `sk-...` |
| `DASHSCOPE_API_KEY` |阿里云 DashScope API 密钥 | `sk-...` |
| `AIMLAPI_API_KEY` | AI/ML API 密钥 | — |
| `LLM_模型` |默认LLM模型名称（集群模式） | `glm-4-9b-聊天` |
| `模型服务器` |型号控制器地址（集群模式）| `http://127.0.0.1:8000` |

## 服务器配置

|变量|描述 |默认|
|---|---|---|
| `DBGPT_LOG_LEVEL` |日志记录级别 | `信息` |
| `LOCAL_DB_TYPE` |元数据数据库类型 | `sqlite` |
| `LOCAL_DB_PATH` | SQLite 数据库路径 | `数据/default_sqlite.db` |
| `MYSQL_HOST` | MySQL主机| `127.0.0.1` |
| `MYSQL_PORT` | MySQL 端口 | `3306` |
| `MYSQL_USER` | MySQL 用户名 | `根` |
| `MYSQL_PASSWORD` | MySQL 密码 | — |
| `MYSQL_DATABASE` | MySQL 数据库名称 | `dbgpt` |

## GPU 和硬件

|变量|描述 |示例|
|---|---|---|
| `CUDA_VISIBLE_DEVICES` |限制哪些 GPU 可见 | `0,1` |
| `设备` |力装置类型| `cuda`、`cpu`、`mps` |

## 网络和代理

|变量|描述 |示例|
|---|---|---|
| `UV_INDEX_URL` | PyPI 紫外线镜 | `https://pypi.tuna.tsinghua.edu.cn/simple` |
| `HTTP_PROXY` |用于出站请求的 HTTP 代理 | `http://代理:8080` |
| `HTTPS_PROXY` |用于出站请求的 HTTPS 代理 | `http://代理:8080` |
| `NO_PROXY` |主机绕过代理| `本地主机，127.0.0.1` |

## 在 TOML 配置中使用环境变量

DB-GPT 支持 TOML 配置文件中的环境变量替换：
```toml
[[models.llms]]
api_key = "${env:OPENAI_API_KEY}"

[[models.embeddings]]
api_key = "${env:OPENAI_API_KEY:-default-key}"
```
**语法：**

|图案|行为 |
|---|---|
| `${env:VAR_NAME}` |从环境变量读取（如果丢失则出错）|
| `${env:VAR_NAME:-default}` |从环境中读取，如果未设置则使用“default” |

## Docker 环境变量

使用 Docker 运行时，使用“-e”传递环境变量：
```bash
docker run -it --rm \
  -e SILICONFLOW_API_KEY=your-key \
  -e DBGPT_LOG_LEVEL=DEBUG \
  -p 5670:5670 \
  eosphorosai/dbgpt-openai
```
或者使用 `docker-compose.yml` 中的 Docker Compose：
```yaml
services:
  webserver:
    environment:
      - SILICONFLOW_API_KEY=${SILICONFLOW_API_KEY}
      - DBGPT_LOG_LEVEL=INFO
```
## 后续步骤

|主题 |链接 |
|---|---|
|完整配置参考 | [配置参考](/docs/config/config-reference) |
|模型提供商| [提供商](/docs/getting-started/providers/) |
|故障排除索引| [疑难解答](/docs/getting-started/troubleshooting/) |