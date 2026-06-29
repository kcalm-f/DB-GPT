# 代理浏览器

## 概述

“代理浏览器”是一种内置的浏览器自动化技能，用于确定性、代理友好的 Web 交互。

与屏幕截图优先的浏览器流程不同，它依赖于可访问性树快照和基于引用的元素选择。

## 仓库路径
```text
skills/agent-browser/
└── SKILL.md
```
## 何时使用

- 多步骤浏览器工作流程
- 复杂的单页应用程序
- 确定性元素目标
- 重复自动化的隔离会话

## 核心工作流程

1. 打开目标页面。
2. 使用交互式参考捕获快照。
3. 读取返回的JSON结构。
4. 使用诸如“@e2”之类的引用与元素进行交互。
5. 导航或 DOM 更改后重新快照。

## 典型命令
```bash
agent-browser open https://example.com
agent-browser snapshot -i --json
agent-browser click @e2
agent-browser fill @e3 "text"
agent-browser wait --load networkidle
```
## 该技能记录了什么

由于该技能是 CLI 驱动的，因此其价值主要在“SKILL.md”中：

- 导航模式
- 快照策略
- 基于参考的交互
- 等待模式
- 多会话使用
- 状态保存和恢复

## 为什么这很重要

当代理需要可靠的网络自动化而不依赖于脆弱的视觉选择器时，这是可以使用的内置技能。