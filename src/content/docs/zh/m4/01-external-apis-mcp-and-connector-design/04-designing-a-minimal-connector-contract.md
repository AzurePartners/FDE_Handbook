---
title: 设计最小连接器契约
row: M4-L1.4
---
**一句话：** 连接器契约是一份简短而明确的定义，说明一个工具或 API 如何暴露给 agent，包括它的输入、输出、错误类型、认证（authentication，简称 authn）和限流；把它设计好，集成才会可预测、可替换、安全。

## 是什么

当你把一个工具或 API 暴露给 agent（或者使用别人暴露的），你要定义一份 **契约**：它接受的输入（名称、类型、必填 / 可选），它返回的输出（结构和含义），它可能抛出的 **错误类型**（以及调用方应该如何反应），它要求的 **认证**，以及它的 **限流**。“最小”的意思是，只包含调用方正确、安全地使用它所需要的内容，不多放任何东西。好的契约就是一道接缝：你可以在这道接缝后面更换实现而不破坏调用方，模型也能可靠地调用它。

## FDE 为什么需要

集成中大多数让人头疼的问题都来自模糊的边界：某个工具的错误没写在文档里，认证是隐含的，限流又出乎意料。把契约明确写出来，就是逼着你把这些决定都做出来，也让模型和日后的维护者有了可以放心调用的依据。它还让供应商可以互换（任何符合契约的实现都行），并把供应商特有的行为挡在业务逻辑之外。

## 核心概念

- **输入：** 名称、类型、必填还是可选、校验规则。
- **输出：** 结构、类型、含义；调用方可以依赖的、可预测的结构。
- **错误类型：** 逐一列出的失败模式，以及调用方应有的反应（可重试，还是致命）。
- **认证：** 连接器需要什么凭证，以及如何提供（与第 2 课相关）。
- **限流：** 声明限额，让调用方能正确节流。

```
Connector: get_customer(customer_id: string)   # 输入
  -> { id, name, status, mrr }                  # 输出结构
  errors: NotFound (致命) | RateLimited (重试) | Upstream5xx (重试)
  auth: 服务 token (scope: crm.read)
  limits: 100 req/min
```

## 常见误区

- **“直接把原始 API 暴露出去就行。”** 原始 API 会泄露供应商特有的行为和没有文档的错误；契约能保护调用方。
- **“错误不需要定义。”** 没有定义的错误，正是集成静默失败的地方；要逐一列出它们以及应有的反应。
- **“暴露的接口面越大越好。”** 最小的契约更容易用对，也更容易重新实现；只暴露需要的部分。

## 典型面试题

<details>
<summary>连接器契约里应该包含什么？</summary>

输入（名称、类型、必填 / 可选、校验）；输出（可预测的结构和含义）；逐一列出的错误类型，以及调用方应有的反应（可重试，还是致命）；它需要的认证；以及它的限流。保持最小，只放调用方正确、安全地使用它所需要的内容。

</details>

<details>
<summary>为什么要在连接器里明确定义错误类型？</summary>

因为没有定义的错误正是集成静默失败的地方：调用方分不清哪些是应该重试的暂时性错误，哪些是应该向上抛出的致命错误。逐一列出错误类型和应有的反应，连接器才可预测，调用方也才能正确地处理失败。

</details>

## 延伸阅读

- 文档：[Build an MCP server (getting started)](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)（然后按“Develop with MCP”往下读）
- 文章：[Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)（用 agent 来评测这个工具）
- 课程：[DeepLearning.AI MCP course](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)（构建并部署你自己的 server）

## 相关页面

- [工具注册表、schema 与能力发现](./02-tool-registries-schemas-and-capability-discovery.md)
- [数据契约与 Schema 演进](../03-real-world-data-quality-freshness-provenance-and-entity/05-data-contracts-and-schema-evolution.md)
