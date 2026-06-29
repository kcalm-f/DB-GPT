# sql_查询

## 概述

`sql_query` 对所选数据库执行只读 SQL 查询。

这是在进行更深入分析之前检查结构化数据的最快方法。

＃＃ 参数
```json
{
  "sql": "SELECT statement"
}
```
## 它的作用

- 执行安全的只读 SQL
- 将结果格式化为 Markdown 表输出
- 将大结果截断到前 50 行

## 何时使用

- 检查模式和示例行
- 从结构化数据回答业务问题
- 在Python分析之前获取数据

## 示例
```json
{
  "sql": "SELECT product_category, SUM(revenue) AS total_revenue FROM sales GROUP BY product_category ORDER BY total_revenue DESC"
}
```
## 注释

- 只允许读操作
- 诸如“INSERT”、“UPDATE”、“DELETE”、“DROP”、“ALTER”和“CREATE”之类的语句被阻止
- 用它来检索，而不是突变