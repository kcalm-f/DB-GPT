# 简介

这里是 DB-GPT API 文档的介绍。你可以通过 HTTP 请求使用任何编程语言与 API 进行交互，也可以使用我们官方的 Python 客户端。

## 认证
DB-GPT API 使用 API 密钥进行认证。访问你的 API 密钥页面获取用于请求的 API 密钥。

生产环境的请求必须通过你自己的后端服务器进行路由，API 密钥应从环境变量或密钥管理服务中安全加载。

所有 API 请求应在 Authorization HTTP 请求头中包含你的 API 密钥，格式如下：
    
    ```http
    Authorization: Bearer DBGPT_API_KEY
    ```
使用 DB-GPT API 的 curl 命令示例：

    ```bash
    curl "http://localhost:5670/api/v2/chat/completions" \
    -H "Authorization: Bearer $DBGPT_API_KEY" \
    ```
使用 DB-GPT Client Python 包的示例：
    
    ```python
    from dbgpt_client import Client

    DBGPT_API_KEY = "dbgpt"
    client = Client(api_key=DBGPT_API_KEY)
    ```
在 .env 文件中设置 API 密钥，如下所示：
:::info 注意
API_KEYS - 允许访问 API 的 API 密钥列表。每个密钥之间用逗号分隔。
:::
```python
API_KEYS=dbgpt
```

## 使用 DB-GPT 官方 Python 客户端

如果你使用 Python，应该从 PyPI 安装官方的 DB-GPT Client 包：

```bash
pip install "dbgpt-client>=0.7.1rc0"
```

## 使用 OpenAI Python SDK

在某些聊天场景中，你可以使用 OpenAI Python SDK 与 DB-GPT API 进行交互。DB-GPT API 与 OpenAI API 兼容。

```bash
pip install openai
```
