---
title: 数据契约与 Schema 演进
row: M4-L3.5
---
**一句话：** 数据契约是对系统之间所交换数据的字段名、类型和含义达成的一份明确、经过校验的约定；schema 演进则是让这个结构随时间变化，同时不悄悄破坏依赖它的系统。

## 是什么

**数据契约**指双方认可、并在导入时检查的一份明确且经过校验的 schema，其核心思想在模块一中已有讲解（[Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)）。本页聚焦更难的企业场景问题，也就是 **schema 演进**：结构总会变，字段会新增、改名、改类型，也会被删除。向后兼容的变更（新增一个可选字段）不会破坏任何东西；破坏性变更（改名、删除、改类型）则需要版本管理和协调。按契约校验传入的数据，能把悄悄发生的破坏变成早期的、明确的报错。

## FDE 为什么需要

集成会悄悄腐烂：客户的团队给某个字段改了名，或者改了某个编码的类型，你的功能就开始返回错误或空的结果，却没有任何报错。把接口当作经过校验的契约，就能立刻发现这类问题，也让你有立场要求客户团队协调变更，而不是让你措手不及。

## 核心概念

- **schema：** 声明出来的结构和类型（JSON Schema、Avro、表的 DDL）。
- **导入时校验：** 拒绝或隔离不符合契约的数据；出错要明确报出来。
- **向后兼容与破坏性变更：** 新增可选字段是安全的；改名、删除、改类型会让下游使用方出问题。
- **版本管理：** 携带 schema 版本，让下游使用方能够适应变更。
- **协调破坏性变更：** 留出迁移窗口，不要在下游使用方毫不知情时直接改。

```json
{"customer_id":"string (required)", "email":"string (required)",
 "status":"enum: active|churned (required)", "mrr":"number (optional)"}
```

## 常见误区

- **“能解析成 JSON，就说明它有效。”** 解析检查的是语法，不能保证字段存在、类型正确，或者含义和你预期的一致。
- **“任何 schema 变更都没问题。”** 新增可选字段是安全的；改名、删除、改类型属于破坏性变更，需要版本管理。
- **“契约就是官僚做派。”** 契约把悄无声息、代价高昂的数据损坏，变成一个成本低、立即出现的校验错误。

## 典型面试题

<details>
<summary>什么是数据契约，为什么重要？</summary>

它是对所交换数据的名称、类型和含义的一份明确且经过校验的约定。它重要，是因为没有契约时，集成依赖的是没有写明的假设，上游一变就会悄悄出问题；按契约校验，能把这种问题变成早期的、清楚的失败，也为协调变更提供了依据。

</details>

<details>
<summary>你如何在不破坏下游使用方的前提下演进 schema？</summary>

优先选择向后兼容的变更：新增可选字段，而不是改名或删除。对于破坏性变更，给 schema 加版本，在迁移窗口内同时支持新旧两个版本，并与下游使用方协调切换，而不是在他们不知情时直接改。

</details>

## 延伸阅读

- 规范：[JSON Schema](https://json-schema.org/learn/getting-started-step-by-step)（声明字段名和类型，用来做校验）
- 文档：[dbt sources & source freshness](https://docs.getdbt.com/docs/build/sources)（相邻的新鲜度 gate 模式，用于应对上游变化）

## 相关页面

- [模块一 → Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)（核心思想）
- [设计最小连接器契约](../01-external-apis-mcp-and-connector-design/04-designing-a-minimal-connector-contract.md)
- [脏数据](./01-dirty-data-missing-duplicate-stale-and-conflicting.md)
