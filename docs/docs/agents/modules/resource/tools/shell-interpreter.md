# shell_解释器

## 概述

`shell_interpreter` 在沙盒环境中执行 shell / bash 命令。

它适用于命令行工作流程而不是数据分析逻辑。

＃＃ 参数
```json
{
  "code": "shell command(s)"
}
```
## 它的作用

- 运行 bash/shell 命令
- 强制沙箱隔离
- 对危险模式进行安全检查
- 限制内存和执行时间

## 运行时特征

- 内存限制：**256MB**
- 超时：**30s**
- 调用之间没有持久的 shell 状态

## 何时使用

- 检查文件和目录
- 运行 CLI 实用程序，例如 `ls`、`grep`、`curl`、`git`、`pip`
- 执行 shell 级环境任务

## 示例
```json
{
  "code": "ls -la"
}
```
## 注释

- 使用“code_interpreter”进行Python分析
- 使用“html_interpreter”进行最终渲染输出
- 如果一项技能明确需要另一个执行路径，请按照技能说明进行操作