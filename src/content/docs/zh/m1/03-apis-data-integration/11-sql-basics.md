---
title: SQL 基础
row: M1-L3.2
---
**一句话：** SQL（Structured Query Language，结构化查询语言）是你和关系数据库打交道的方式：建表、插入数据，以及查询存储的内容。

## 是什么

SQL 是几乎所有关系数据库都能理解的语言，从本地的 SQLite 文件到大型的生产 PostgreSQL 集群都是如此。它读起来接近英语，`SELECT name FROM customers WHERE id = 42` 的意思大致就是字面意思，但对于执行什么、按什么顺序执行，它有严格的规则。读写一条简短的 SQL 查询是 FDE 的日常工作，不是什么专门技能；而且这往往是拿到真实、准确答案的最快方式，不用去猜一个可能过时或出错的仪表盘。

本页假定你已经了解关系模型那一页讲的表结构：表、主键，以及把表关联起来的外键。

## FDE 为什么需要

客户会提出一些只有数据库才能准确回答的问题：“上个月进来了多少订单”“哪些客户还没被计费”“为什么这条记录出现了两次”。会写简短 SQL 查询的 FDE，能直接从唯一可信的数据源拿到真实答案。审查 AI 生成的 SQL 时，这一点同样重要：一条运行不报错的查询，仍然可能悄悄返回错误的行，比如漏了 join 条件，结果不是正确匹配，而是把每一行都成倍地复制出来。

## 核心概念

### SELECT 与 WHERE：读取行

```sql
SELECT name, email FROM customers WHERE id = 42;
```

`SELECT` 选择要返回哪些列，`FROM` 选择表，`WHERE` 过滤出符合条件的行。多个条件用 `AND` 和 `OR` 组合：

```sql
SELECT name FROM customers WHERE email IS NOT NULL AND id > 100;
```

### INSERT：新增一行

```sql
INSERT INTO customers (name, email) VALUES ('Amina Khan', 'amina@example.com');
```

没有列出的列会取默认值；如果没有设置默认值且该列允许为空，则为 `NULL`。

### UPDATE 与 DELETE

```sql
UPDATE customers SET email = 'new@example.com' WHERE id = 42;
DELETE FROM customers WHERE id = 42;
```

这两条语句有多有用，就有多危险：漏掉 `WHERE` 子句，会更新或删除表中的每一行，而不只是一行。一定要先用相同的 `WHERE` 子句跑一遍对应的 `SELECT`，看清楚到底会影响哪些行。

### JOIN：合并相关的表

```sql
SELECT customers.name, orders.total
FROM orders
JOIN customers ON orders.customer_id = customers.id
WHERE orders.total > 100;
```

这条查询返回每个客户的名字，以及他们金额超过 100 的订单，通过关联两张表的外键，在一次查询里同时从两张表取数。针对常规 schema 的真实查询，大多至少需要一个 join，因为关系模型有意把相关数据拆分到多张表里，而不是到处复制。

### GROUP BY：汇总行

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

这条查询为每个客户返回一行，附上他的订单数量，而不是每个订单一行。`GROUP BY` 几乎总是和 `COUNT`、`SUM` 或 `AVG` 这样的聚合函数一起使用。

### ORDER BY 与 LIMIT

```sql
SELECT id, total FROM orders ORDER BY total DESC LIMIT 5;
```

`ORDER BY` 对结果排序，`DESC` 表示从高到低，`ASC`（默认）表示从低到高。`LIMIT` 限制返回的行数，适合回答“前 5 名”这类问题，或者在探索一张表时避免一次拉出几百万行。

### 按数据库的处理顺序来读查询

一个有用的习惯：读 `SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...` 时，按数据库实际执行的顺序来读，而不是按书写顺序。大致是：先选表（`FROM`），再与其他表合并（`JOIN`），过滤行（`WHERE`），对剩下的行分组（`GROUP BY`），最后选择要返回的列并排序（`SELECT`、`ORDER BY`）。

## 常见误区

- **“JOIN 是高级功能，初学者可以跳过。”** JOIN 正是关系数据库避免到处复制数据的手段。针对常规 schema 的真实查询，大多至少需要一个 join。
- **“SQL 和电子表格公式做的是同一件事。”** 电子表格公式是在你能直接看到、能直接编辑的单元格上重新计算。SQL 查询的数据集可以有几百万行，写入时会强制类型检查，并且能被其他程序（而不只是人）反复、可靠地执行。
- **“NULL 就是零或空字符串。”** NULL 表示值未知或缺失，它在比较时的行为也不一样；`WHERE email = NULL` 永远匹配不到任何行，你需要写 `WHERE email IS NULL`。
- **“不带 WHERE 的 UPDATE 或 DELETE 什么都不会做。”** 它会作用于表中的每一行。这是意外毁掉真实数据最常见的方式之一，也是为什么要先测试对应的 `SELECT`。

## 典型面试题

<details>
<summary>写一条查询，返回每个客户的订单总数。</summary>

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

这条查询把 `orders` 表按 `customer_id` 分组，并统计每组有多少行。

</details>

<details>
<summary>一条使用 JOIN 的查询返回的行数比预期少。你会检查什么？</summary>

检查 join 条件是否匹配了正确的列，以及是否有些行的 key 值为 NULL 或对不上，这些行会被标准 JOIN 排除在外。实际原因往往是某些行只存在于一张表中，在另一张表里没有。

</details>

<details>
<summary>执行不带 WHERE 子句的 UPDATE 或 DELETE 语句有什么风险？</summary>

它会作用于表中的每一行，而不只是你想改的那一行。安全的习惯是：在修改或删除任何东西之前，先用相同的 WHERE 子句运行对应的 SELECT，确认到底会影响哪些行。

</details>

<details>
<summary>AI 工具为你生成了一条 SQL 查询。在对真实数据库运行之前，你要检查什么？</summary>

检查它是否有 WHERE 子句，并且只匹配目标行；检查所有 JOIN 是否使用了正确的 key 列；对于任何写入或删除数据的语句，先运行对应的 SELECT，确认返回的正是预期的行，不多也不少。

</details>

## 延伸阅读

- 互动练习：[SQLBolt, lessons 1 to 6 and 13 to 16](https://sqlbolt.com/)（SQLBolt 在线 SQL 练习，第 1 到 6 课和第 13 到 16 课）

## 相关页面

- [关系模型](./09-relational-model.md)
- [数据规范化](./12-data-normalization.md)
- [Web 应用的分层](../02-how-web-apps-run/10-frontend-backend-database-layers.md)
