# 数据库资源

数据库资源“DBResource”是可用于与数据库交互的资源。 
它是“Resource”类的子类，提供了一种与数据库交互的方法。

以下是“DBResource”类的一些实现：
- `RDBMSConnectorResource`：可用于连接到关系数据库管理系统（RDBMS）（如 MySQL、PostgreSQL 等）的资源。
- `SQLiteDBResource`：`RDBMSConnectorResource` 类的特定实现，可用于连接到 SQLite 数据库。
- `DatasourceResource`：可用于连接 DB-GPT 中各种数据源的资源。
当您在 DB-GPT 环境中运行代理（在 DB-GPT Web 服务器中运行）时，它才起作用。

在前面的章节[带有数据库的代理](../../introduction/database)中，我们介绍了 
如何使用DB-GPT代理中的数据库资源，详细可以参考。

## 它是如何工作的

（即将推出...）