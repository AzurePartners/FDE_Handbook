---
title: MCP 与传统 API 连接器
row: M4-L1.1
---
**一句话：** Model Context Protocol（MCP，模型上下文协议）统一了模型发现和调用工具的方式，但连接任何外部系统仍然需要做认证（authentication，简称 authn）、网络和失败处理这些实际工作，MCP 替代不了它们。

## 是什么

**MCP** 是把 AI 应用连接到外部系统的开放标准。一个 **server** 提供三类能力：**工具（tools）**（模型可以调用的操作）、**资源（resources）**（应用可以读取的数据）和 **提示词（prompts）**（可复用的工作流）。任何支持 MCP 的 **host/client** 都用同样的方式连接它，传输方式是 **stdio** 或 **Streamable HTTP**。client 在连接时进行能力协商，并在运行时发现有哪些能力可用（对工具来说，是通过一次 `tools/list` 调用）。工具调用由 *模型* 控制，规范指出，人应该留在回路中，并且能够拒绝某次调用。MCP *不会* 做的，是让底层系统变得可靠或安全：MCP 工具的背后仍然是一个真实的 API，它需要凭证，可能超时，可能对你限流，也可能返回错误。MCP 统一的是 *接口*；集成中真正难的部分依然存在。

## FDE 为什么需要

AI 功能越来越多地通过 MCP 接入各种工具，而且很容易以为“已经有现成的 MCP 了”就等于集成做完了。其实不然：一个封装了不稳定 API 的 MCP 工具，照样不稳定。一个 FDE 必须透过标准接口，看到底下真实的系统，并完全像对待原始 API 那样，处理它的认证、限流和失败。

## 核心概念

- **三种原语（primitive）：** 工具（由模型调用的操作）、资源（可读取的数据）和提示词（工作流）。MCP 不只有工具。
- **Host / client / server：** AI 应用（host）运行一个 client，由它连接 server；能力在连接时协商，在运行时发现。
- **传输方式：** stdio（本地）或 Streamable HTTP（远程）。
- **MCP 统一的是接口**，而不是它背后的网络和认证：每个工具背后仍然是一个真实的 API，有它自己的凭证、限流、超时和错误。
- **失败处理仍然要靠你自己：** 重试、兜底和校验不会随协议自带。

## 常见误区

- **“MCP 取代了 API 集成工作。”** 它统一的是接口；认证、网络和失败处理一点没变。
- **“只要是 MCP 工具，就是可靠的。”** 可靠性来自背后的系统和你自己加上的处理，而不是协议。
- **“MCP 会处理认证。”** 你仍然要把真实的凭证提供给底层服务，并负责保管好。

## 典型面试题

<details>
<summary>MCP 统一了什么，没有统一什么？</summary>

它统一的是 server 如何提供工具、资源和提示词，以及任何 client 如何发现并调用它们（通过 \`tools/list\` 列出工具，通过 \`tools/call\` 调用工具），所以任何 MCP client 都能使用任何 MCP server，不需要专门写对接代码。它不能替代工具背后真实系统所需要的认证、网络、限流处理和失败处理，这些仍然由集成方负责。

</details>

<details>
<summary>为什么“已经有现成的 MCP 了”不等于“集成已经做完了”？</summary>

因为 MCP 工具封装的是一个真实的 API，它仍然需要凭证，仍然受限流约束，可能超时，也会返回错误。协议给你的是一个干净的接口；底层系统的认证和失败模式，仍然要你自己处理。

</details>

## 延伸阅读

- 文档：[What is MCP?](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)（官方简介）
- 文档：[MCP architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)（数据层与传输层，能力发现）
- 文章：[Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)（Anthropic；大规模使用时工具上下文的成本）
- 课程：[MCP: Build Rich-Context AI Apps](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)（DeepLearning.AI，可免费旁听）

## 相关页面

- [工具注册表、schema 与能力发现](./02-tool-registries-schemas-and-capability-discovery.md)
- [API 版本、限流与备用数据源](./03-api-versions-rate-limits-and-fallback-sources.md)
