---
sidebar_position: 0
title: Troubleshooting
summary: "First checks and common fixes for install, model, and environment issues"
read_when:
  - Something broke and you want the fastest fix path
  - DB-GPT starts inconsistently, the UI is blank, or models fail to load
---
# 故障排除

使用 DB-GPT 时的常见问题和解决方案。

## 前 60 秒

首先运行这些：
```bash
curl http://localhost:5670/api/health
dbgpt model list
docker logs dbgpt -f
```
如果您不使用 Docker，请检查启动 Web 服务器的同一终端。

## 常见的快速修复

- **服务器将无法启动**
  - 使用正确的附加功能重新运行“uv同步”
  - 请参阅[安装问题](/docs/getting-started/troubleshooting/installation)
- **网络用户界面为空白**
  - 等待启动完成
  - 确认服务器可以通过 `http://localhost:5670` 访问
- **找不到模型/验证错误**
  - 重新检查 TOML 配置和提供程序名称
  - 请参阅[模型问题](/docs/getting-started/troubleshooting/llm)
- **端口 5670 已在使用中**
  - 使用“lsof -i :5670”查找冲突进程
- **内存不足**
  - 使用较小的本地模型或切换到 API 代理模型

## 更具体的指南

- [安装问题](/docs/getting-started/troubleshooting/installation)
- [模型问题](/docs/getting-started/troubleshooting/llm)
- [环境变量](/docs/getting-started/troubleshooting/environment)

## 日志
```bash
# Source code deployment
# Logs are printed to stdout by default

# Docker deployment
docker logs dbgpt -f

# Docker Compose deployment
docker logs db-gpt-webserver-1 -f
```
## 获取帮助

如果故障排除指南无法解决您的问题：

1. **搜索现有问题**：[GitHub问题](https://github.com/eosphoros-ai/DB-GPT/issues)
2. **询问社区**：[GitHub 讨论](https://github.com/orgs/eosphoros-ai/discussions)
3. **加入 Slack**：[DB-GPT Slack](https://join.slack.com/t/slack-inu2564/shared_invite/zt-29rcnyw2b-N~ubOD9kFc7b7MDOAM1otA)
4. **查看常见问题解答**： [安装常见问题解答](/docs/faq/install) · [LLM 常见问题解答](/docs/faq/llm) · [KBQA 常见问题解答](/docs/faq/kbqa)