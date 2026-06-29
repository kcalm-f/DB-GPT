# 人工智能/机器学习 API

### AI/ML API 提供包括 Deepseek、Gemini、ChatGPT 在内的 300 多个 AI 模型。这些模型以企业级速率限制和正常运行时间运行。

### 本节介绍如何将 AI/ML API 提供程序与 DB-GPT 结合使用。

1. 在 [AI/ML API](https://aimlapi.com/app/?utm_source=db_gpt&utm_medium=github&utm_campaign=integration) 注册并生成 API 密钥。
2. 使用您的密钥设置环境变量“AIMLAPI_API_KEY”。
3. 启动 DB-GPT 时使用 configs/dbgpt-proxy-aimlapi.toml 配置。

### 您可以在[https://aimlapi.com/models/](https://aimlapi.com/models/?utm_source=db_gpt&utm_medium=github&utm_campaign=integration)查找模型

### 或者您可以使用 docker/base/Dockerfile 来运行带有 AI/ML API 的 DB-GPT：
```dockerfile
# Expose the port for the web server, if you want to run it directly from the Dockerfile
EXPOSE 5670

# Set the environment variable for the AIMLAPI API key
ENV AIMLAPI_API_KEY="***"

# Just uncomment the following line in the `Dockerfile` to use AI/ML API:
CMD ["dbgpt", "start", "webserver", "--config", "configs/dbgpt-proxy-aimlapi.toml"]
```
