---
title: 数据规范化
row: M1-L3.4
---
**一句话：** 规范化是指组织数据库，让每个事实只存储一次；这个词还有第二层含义：把来自不同来源的数据整理成统一的格式。

## 是什么

组织得不好的表会在很多行里重复同一个事实。设想一张订单表，每一行都复制了客户的姓名和邮箱：

| order_id | customer_name | customer_email | product |
|---|---|---|---|
| 1 | Amina Khan | amina@example.com | Keyboard |
| 2 | Amina Khan | amina@exmaple.com | Mouse |

第 2 行的邮箱有个拼写错误。现在两行数据对不上了，也没有任何信息说明哪个是对的。这就是更新异常：同一个事实存在两个地方，副本之间出现了偏差。规范化的解决办法是拆表，让每个事实只存在于一行中，再用外键关联起来，也就是关系模型那一页讲的思路。

## FDE 为什么需要

非规范化的数据是客户报表对不上数的最常见原因之一：对“同一个东西”的两次统计结果不一致，因为某个事实在一处更新了，另一处却没有。FDE 审查 schema 时，需要分辨重复数据到底是真正的问题，还是有意为之的取舍。

## 核心概念

### 数据库范式，用大白话讲

**第一范式（1NF）：** 每一列只存一个值，而不是一个列表，所以一个单元格里的 `"Keyboard, Mouse"` 应该拆成单独的行。

**第二范式（2NF）：** 每个非键列都依赖于整个键，这在键由多列组成时才有意义。

**第三范式（3NF）：** 每个非键列只依赖于主键。上面的例子中，`customer_email` 是关于客户的事实，而不是关于订单的：它只是间接依赖于 `order_id`，中间隔着“这个客户是谁”（即传递依赖），这就提示它应该放进自己的表，再通过 `customer_id` 外键关联回来。这样，一个拼写错误只需要改一处。

### 什么时候有意反规范化

规范化是用额外的 join 换取不重复。有些系统为了速度会保留一份反规范化的副本，并把这个风险作为一个有记录的决策来接受，而不是事后才意外发现。

## 另一层含义

“规范化”这个词也指在一起使用之前，把来自不同来源的数据整理成统一的格式。两个 API 返回的温度可能字段名、单位和类型都不同：

| | API A | API B |
|---|---|---|
| 字段名 | `temp` | `current_weather.temperature` |
| 单位 | 华氏度 | 摄氏度 |
| 类型 | 字符串 `"84.2"` | 数字 `29.4` |

规范化就是在存储或比较之前，把两者都转换成同一种结构：所有温度都是 float，单位是摄氏度，使用同一个字段名。跳过这一步，后面的查询就会悄悄地拿华氏度和摄氏度做比较。

### 实战示例：把两个 API 的数据合并进一张表

下面的脚本调用 Open-Meteo（天气）和 Frankfurter（汇率），把两者映射成一条名称、单位和类型都固定的记录，然后用 INSERT 保存。以日期和城市作为主键，意味着重复运行时会替换这一行，而不是产生重复数据。

```python
import sqlite3, requests

weather = requests.get("https://api.open-meteo.com/v1/forecast",
    params={"latitude": 52.52, "longitude": 13.41, "current": "temperature_2m"},
    timeout=10).json()
fx = requests.get("https://api.frankfurter.dev/v1/latest",
    params={"base": "EUR", "symbols": "USD"}, timeout=10).json()

record = {                                   # 约定好的统一结构
    "date": fx["date"],                      # "2026-10-05"
    "city": "Berlin",
    "temp_c": float(weather["current"]["temperature_2m"]),
    "eur_usd": float(fx["rates"]["USD"]),
}

db = sqlite3.connect("daily.db")
db.execute("CREATE TABLE IF NOT EXISTS daily "
           "(date TEXT, city TEXT, temp_c REAL, eur_usd REAL, PRIMARY KEY (date, city))")
db.execute("INSERT OR REPLACE INTO daily VALUES (:date, :city, :temp_c, :eur_usd)", record)
db.commit()
```

## 常见误区

- **“数据库规范化和把两个 API 的数据规范化是同一个过程。”** 两者名字相同、目标相近，但一个关乎表结构，另一个是在不同来源之间统一字段名、类型和单位。
- **“完全规范化的 schema 总是正确的设计。”** 完全规范化会增加 join，可能拖慢以读为主的系统。真实系统经常有意对特定的表做反规范化。
- **“数据库里的重复数据总是 bug。”** 为性能而有意保留的重复是合理的。没有任何同步计划的意外重复才是问题。

## 典型面试题

<details>
<summary>什么是更新异常？规范化如何防止它？</summary>

当同一个事实存储在多行中，而只有部分行被更新时，就会发生更新异常，导致数据自相矛盾。规范化通过让每个事实只存一次、用外键关联相关数据来防止它。

</details>

<details>
<summary>什么时候你会有意对一张表做反规范化？</summary>

对于读取频率远高于修改频率的数据，比如仪表盘用的表，作为一个有记录的取舍。

</details>

<details>
<summary>你要合并两个 API 的数据，它们都返回温度，但字段名和单位不同。在比较之前必须做什么？</summary>

在存储或比较之前，要把两个字段都规范化成约定好的统一结构：名称、单位和类型都一致。否则后面的查询就有可能悄悄拿华氏度和摄氏度做比较。

</details>

## 延伸阅读

- 文档：[Database normalization](https://en.wikipedia.org/wiki/Database_normalization)（Wikipedia，数据库规范化词条）

## 相关页面

- [关系模型](./09-relational-model.md)
- [Schema 与数据契约](./10-schema-and-data-contracts.md)
- [SQL 基础](./11-sql-basics.md)
