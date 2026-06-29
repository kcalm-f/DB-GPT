# 代码解释器

## 概述

`code_interpreter` 执行任意 Python 代码并返回 stdout / stderr 以及生成的工件。

它是数据分析、计算、数据框操作和图表生成的主要工具。

＃＃ 参数
```json
{
  "code": "python code string"
}
```
## 它的作用

- 在子进程中运行Python代码
- 提供常用的分析包，如`pandas`和`numpy`
- 捕获文本输出和生成的图像
- 保持生成的图像引用可用于以后的 HTML 渲染

## 何时使用

- CSV/Excel/数据帧分析
- 指标计算
- 图表生成
- 基于Python的预处理和转换

## 示例
```python
import pandas as pd

df = pd.read_csv(FILE_PATH)
print(df.head())
print(df.describe())
```
## 注释

- 每次调用都是独立的
- 变量在调用之间不会持续存在
- 始终在同一调用中加载您需要的数据
- 如果您希望结果出现在工具输出中，请使用“print()”
- 不要将其用作最终的 HTML 交付步骤