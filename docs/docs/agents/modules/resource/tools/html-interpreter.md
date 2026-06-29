# html_解释器

## 概述

`html_interpreter` 将 HTML 呈现为交互式 Web 报告。

它是网页、HTML 报告、仪表板和基于技能的报告交付的最终演示工具。

## 参数

### 直接 HTML 模式
```json
{
  "html": "<html>...</html>",
  "title": "Report"
}
```
### 模板模式
```json
{
  "template_path": "skill/templates/report_template.html",
  "data": {
    "KEY": "value"
  }
}
```
### 文件模式
```json
{
  "file_path": "/absolute/path/to/file.html",
  "title": "Report"
}
```
## 它的作用

- 直接渲染完整的HTML
- 支持模板占位符替换
- 可以将生成的数据和图像合并到报告中
- 可以从现有的 HTML 文件渲染

## 何时使用

- 最终 HTML 报告生成
- 交互式网页交付
- 基于模板的技能报告输出

## 示例
```json
{
  "template_path": "financial-report-analyzer/templates/report_template.html",
  "data": {
    "REPORT_TITLE": "Q2 Financial Review",
    "EXEC_SUMMARY": "Revenue increased while gross margin remained stable."
  }
}
```
## 注释

- 这应该是 HTML 样式输出的最终渲染步骤
- 不要单独依赖“code_interpreter”来完成最终的 HTML 交付
- 模板模式对于基于技能的报告工作流程特别有用