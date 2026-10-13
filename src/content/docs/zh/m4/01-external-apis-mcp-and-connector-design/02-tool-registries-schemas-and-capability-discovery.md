---
title: 工具注册表、schema 与能力发现
row: M4-L1.2
---
**一句话：** 工具注册表列出 agent 可用的工具，每个工具由一份 schema（它的输入、输出和用途）来描述；能力发现则是 client 在运行时了解 server 能做什么的方式，因此第三方工具和商业工具可以接入同一个插槽。

## 是什么

模型要使用一个工具，需要一份机器可读的描述：工具的名称、便于人阅读的标题和说明、一个符合 JSON Schema 的 `inputSchema`（以及可选的 `outputSchema`）。这套描述就是 **schema**。**注册表（registry）** 是 agent 可以从中选择的工具集合。用 MCP 的说法，**server** 提供工具（tools）、资源（resources）和提示词（prompts），**client** 使用它们；client 在连接时协商 **能力（capabilities）**，然后调用 `tools/list` 来 **发现** 当前有哪些工具（这份列表可能变化，并通过 `listChanged` 发出通知）。因为一切都由 schema 来描述，所以不管是自有工具、第三方 MCP，还是商业工具，只要符合契约，就都可以占据同一个“插槽”。

## FDE 为什么需要

你会把 agent 接到各种工具上，有时还要把自己的工具对外提供出去。好的 schema 既能让模型正确调用工具，也能让你把一家供应商换成另一家，而不用重写 agent。理解 server 与 client 的角色以及发现机制，你就知道该去哪里排查：是工具“没有出现”（发现 / 注册的问题），还是工具“被调用错了”（schema 不匹配）。

## 核心概念

- **schema：** 工具声明的输入、输出和说明；模型据以调用的契约。
- **注册表：** agent 可用的工具集合。
- **server 与 client：** server 提供工具和数据；client（承载模型的 host）发现并调用它们。
- **能力发现：** 在运行时协商有哪些能力可用，从而支持热切换供应商。
- **插槽可互换：** 任何符合 schema 的工具都可以担任同一个角色。

## 常见误区

- **“模型天生就知道怎么调用工具。”** 它完全依赖 schema 和说明；schema 含糊，就会调用错。
- **“工具是写死在 agent 里的。”** 有了发现机制，client 在运行时才知道有哪些工具可用。
- **“只有供应商自己的工具才合适。”** 任何符合该 schema / 接口的 server 都可以占据这个插槽。

## 典型面试题

<details>
<summary>工具 schema 起什么作用？</summary>

它是机器可读的契约，包含名称、用途、输入参数及类型、输出，模型据此调用工具。schema 清晰，模型才能正确调用工具，你也才能用一种实现替换另一种实现。

</details>

<details>
<summary>什么是能力发现？它为什么有用？</summary>

它是运行时的一个步骤：client 在连接时完成能力协商之后，调用 \`tools/list\` 获取 server 当前的工具及其 schema（工具集合发生变化时还可以收到通知），而不是把工具写死。只要符合接口，你就可以增加或更换工具和供应商，不用改动 agent 的对接代码。

</details>

## 延伸阅读

- 文档：[Understanding MCP servers](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts)（工具 / 资源 / 提示词）
- 规范：[MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)（schema、能力协商）
- 课程：[DeepLearning.AI MCP course](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)（工具 / 资源 / 提示词 + MCP Inspector）

## 相关页面

- [MCP 与传统 API 连接器](./01-mcp-and-traditional-api-connectors.md)
- [设计最小连接器契约](./04-designing-a-minimal-connector-contract.md)
