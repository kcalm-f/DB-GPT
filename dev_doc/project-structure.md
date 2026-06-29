# DB-GPT 项目目录结构

```
DB-GPT/
├── packages/                    # 核心 Python 包（monorepo 结构）
│   ├── dbgpt-core/              # 核心框架层
│   │   └── src/dbgpt/
│   │       ├── agent/           # Agent 核心抽象（role, skill）
│   │       ├── cli/             # 命令行工具
│   │       ├── model/           # 模型管理（proxy, 参数配置）
│   │       ├── storage/         # 存储抽象
│   │       ├── rag/             # RAG 基础接口
│   │       ├── datasource/      # 数据源基类
│   │       ├── vis/             # 可视化客户端
│   │       ├── util/            # 工具集（code, tracer, speech, dbgpts 等）
│   │       └── component.py     # 组件系统
│   │
│   ├── dbgpt-app/               # 应用入口层
│   │   └── src/dbgpt_app/
│   │       ├── dbgpt_server.py  # Web 服务器入口
│   │       ├── _cli.py          # CLI 入口
│   │       ├── operators/       # AWEL 算子（llm, rag）
│   │       ├── scene/           # 场景定义
│   │       └── config.py        # 应用配置
│   │
│   ├── dbgpt-serve/             # 服务端业务逻辑层（最大模块）
│   │   └── src/dbgpt_serve/
│   │       ├── agent/           # Agent 管理（agents, app, chat, db, hub, resource, team）
│   │       │   └── agents/expand/  # 扩展 Agent（异常检测、意图识别、报表生成等）
│   │       ├── connector/       # 连接器服务
│   │       ├── conversation/    # 会话管理
│   │       ├── core/            # 核心服务配置
│   │       ├── datasource/      # 数据源管理
│   │       ├── dbgpts/          # dbgpts 市场
│   │       ├── evaluate/        # 评估模块
│   │       ├── feedback/        # 反馈模块
│   │       ├── file/            # 文件服务
│   │       ├── flow/            # AWEL Flow 编排
│   │       ├── libro/           # Libro notebook
│   │       ├── model/           # 模型服务
│   │       ├── prompt/          # Prompt 管理
│   │       ├── rag/             # RAG 服务
│   │       ├── scheduled_task/  # 定时任务
│   │       └── utils/           # 工具模块
│   │
│   ├── dbgpt-ext/               # 扩展插件层（LLMs, RAG 扩展实现）
│   ├── dbgpt-client/            # Python SDK 客户端
│   └── dbgpt-sandbox/           # 沙箱执行环境
│
├── web/                         # 前端（Next.js + React）
│   ├── pages/                   # 页面路由
│   │   ├── chat/                # 对话页
│   │   ├── construct/           # 构建模块（app, flow, knowledge, agent, prompt 等）
│   │   ├── conversations/       # 会话列表
│   │   ├── mobile/              # 移动端页面
│   │   └── models_evaluation/   # 模型评估
│   ├── client/api/              # API 请求层
│   ├── hooks/                   # React Hooks
│   └── public/                  # 静态资源
│
├── configs/                     # 配置文件模板（各种 LLM proxy 配置）
├── docker/                      # Docker 构建文件
├── docs/                        # 文档（Docusaurus）
├── examples/                    # 示例代码（agents, rag, awel, sdk 等）
├── i18n/                        # 国际化翻译文件
├── assets/                      # 图片资源
├── dev_doc/                     # 开发文档
├── logs/                        # 日志目录
├── Makefile                     # 构建命令
├── docker-compose.yml           # Docker Compose 编排
└── setup.py / pyproject.toml    # Python 项目配置
```

## 核心架构特点

- **Monorepo 结构**，使用 `packages/` 管理 6 个 Python 子包
- **dbgpt-core** 是基础抽象层，**dbgpt-serve** 是业务逻辑最密集的模块
- 前端独立在 `web/` 目录，基于 Next.js
- 每个 serve 子模块遵循 `api/models/service` 三层结构
