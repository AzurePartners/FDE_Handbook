---
title: CSV 与表格
row: M1-L3.2
---
**一句话：** CSV 是一种扁平的纯文本格式，用来存储一行行数据，不强制类型；而数据库表会强制执行 schema。

## 是什么

CSV（Comma-Separated Values，逗号分隔值）是一种纯文本格式，为电子表格和批量文件传输而生。数据库表由行和列组成，列有严格的类型，为可靠地查询大量数据而设计。两者没有绝对的好坏，各自适合不同的工作。

一条为 Excel 导出的天气读数可能长这样：

```csv
time,temperature,windspeed
2026-09-28T14:00,29.4,11.2
```

如果要在几个月的数据上反复查询，同样的数据会存在一张表里，`time`、`temperature` 和 `windspeed` 各占一列，每列都有明确定义的类型。

## FDE 为什么需要

客户的各个系统很少用同一种格式：CRM 导出 CSV，报表工具却要一张表。在两者之间转换时出错，会悄无声息地损坏数据，比如丢了一个日期，或者数字被存成了文本。这类 bug 不会报错，而是客户几周后才发现。

## 核心概念

### CSV：扁平、无类型

每一行都有相同的列，没办法把一条记录嵌套在另一条里面。在解析之前，所有内容都是文本，所以日期、小数以及值里面的逗号都存在歧义。

### 表：schema 先行

每一列都声明了类型，不符合的数据会被数据库拒绝。代价是：数据写入之前必须先有 schema。

### 安全地解析 CSV

真实的导出文件里藏着陷阱：字节顺序标记（BOM，Excel 在 UTF-8 文件开头加的一个不可见标记）、分号分隔符，以及本身包含分隔符的带引号的值。逐一明确处理，并自己转换类型：

```python
import csv
from datetime import datetime
from decimal import Decimal

# export.csv:  customer;amount;signed_up
#              "Khan; Amina";1234.50;2026-03-04
with open("export.csv", encoding="utf-8-sig", newline="") as f:  # utf-8-sig 会去掉 BOM
    for row in csv.DictReader(f, delimiter=";"):                 # 引号由 csv 模块处理
        name = row["customer"]                                    # "Khan; Amina"
        amount = Decimal(row["amount"])                           # 文本转为精确小数
        signed_up = datetime.strptime(row["signed_up"], "%Y-%m-%d").date()
```

手动按逗号拆分每一行，遇到第一个带引号的值就会出错。

## 常见误区

- **“表就是更大的电子表格。”** 表会强制执行 schema；电子表格的单元格什么都能悄悄接受。
- **“任何工具读同一个 CSV 的方式都一样。”** 光是区域设置就可能出问题：有些地区用分号作分隔符，用逗号作小数点。

## 典型面试题

<details>
<summary>为什么往数据库表插入数据之前需要 schema，而 CSV 不需要？</summary>

可靠、反复的查询需要事先知道每一列的类型。CSV 把这个校验问题推给了之后读取文件的程序。

</details>

<details>
<summary>客户发来一份 CSV 导出，其中日期列的值形如“03/04/2026”。风险是什么？</summary>

日在前还是月在前存在歧义。根据导出系统的区域设置，它可能是 3 月 4 日，也可能是 4 月 3 日，必须和客户确认，不能想当然。

</details>

## 延伸阅读

- 文档：[csv, CSV File Reading and Writing](https://docs.python.org/3/library/csv.html)（Python 官方文档，csv 模块）
- 文档：[RFC 4180, Common Format for CSV Files](https://www.rfc-editor.org/rfc/rfc4180)（IETF，CSV 格式规范）

## 相关页面

- [JSON](../02-how-web-apps-run/07-json.md)
- [关系模型](./09-relational-model.md)
- [集成边界](./06-integration-boundaries.md)
