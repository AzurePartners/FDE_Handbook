---
title: Tool calling（函数调用）
row: M2-L4.1
---
**一句话：** Tool calling，也叫函数调用（function calling），让模型请求你的应用，用结构化参数运行一个指定名称的操作（比如订单查询），而由你的代码决定是否运行，并完成实际工作。

## 是什么

模型只会产出文本：它查不了实时订单，也办不了退款。有了 tool calling，你的应用会给它发一份工具列表，每个工具都有名称、描述和输入 schema（也就是它的参数）。当请求需要某个工具时，模型回复的不是一段文字，而是一次结构化调用（工具名加 JSON 参数）。用 Microsoft 的话说：“由你的应用执行这些函数，并把结果返回给模型，所以你始终掌控所执行的操作。”

打个比方，旅行社的工作人员填写航空公司的订票表单：是否出票，由航空公司的系统决定，而不是这位工作人员。

## FDE 为什么需要

一家零售商的客服机器人靠粘贴进去的 FAQ 来回答“我的订单到哪了？”，有时会编造一个状态。退款则依赖一个正则表达式（regex），从回复里抓取 `ACTION: REFUND 40.00`。IT 部门想把网关里 70 多个工具全部接上，连 `delete_customer` 也不例外。

FDE 开放四个客服工具：订单状态、退货政策、退款申请和新建工单。模型负责提议；任何操作运行之前，代码先检查订单归属和退款政策。Anthropic 的经验法则是：“如果你正在写一个正则表达式，从模型输出里提取一个决定，那么这个决定本该是一次工具调用。”

## 核心概念

### 模型提出的调用

模型提出的一次调用，Anthropic 格式如下：

```json
{"type": "tool_use",
 "id": "toolu_01A09q90qw90lq917835lq9",
 "name": "get_order_status",
 "input": {"order_id": "58213"}}
```

此时什么都还没有运行。你的代码先检查再运行，然后带着同一个 ID 把结果返回。

### Tool choice

Tool choice（工具选择模式）这项设置决定模型可以、必须还是不得调用工具。

| 含义 | Anthropic | OpenAI | Gemini |
|---|---|---|---|
| 由模型决定（有工具时的默认值） | `auto` | `auto` | `AUTO` |
| 不用工具 | `none` | `none` | `NONE` |
| 必须调用某个工具 | `any` | `required` | `ANY` |
| 必须调用指定名称的工具 | `tool` | 指定名称的函数 | `ANY`，只允许一个名称 |

强制调用并非处处可用：Anthropic 的一些较新模型会拒绝 `any` 和 `tool`，返回 400 错误。替代办法：用 `auto` 加一段措辞精准的描述、用结构化输出，或者由代码自己调用这个函数。

### 工具数量

每条工具定义在每次调用时都要花费输入 token，而长得相像的工具会导致选错。Anthropic 报告称，工具超过大约 30 到 50 个后，工具选择的效果会变差，并建议从大约 10 个工具起使用工具检索（按需加载工具定义）。只开放这个角色需要的工具；从未开放的工具不可能被误用。

### 谁来运行工具

- **应用工具：** 你来运行代码并返回结果，所以凭证、日志和检查都由你掌控。就连 Anthropic 那个由供应商定义的 bash 工具，也是在你的应用里运行。
- **供应商托管的工具：** 网页搜索或代码执行在供应商的服务器上运行。
- **MCP：** 即 Model Context Protocol（模型上下文协议），一种把工具 server 接入应用的开放协议（模块四）。

### 工具与结构化输出

Anthropic 的划分是：结构化输出管的是“Claude 说什么”，严格模式的 tool use 管的是“Claude 如何调用你的函数”。当没有任何东西需要运行时（比如工单分诊）用结构化输出；缺少数据或需要执行操作时用工具。

检索也可以做成工具：模型认为检索有用时，就调用 `search_docs(query)`。这样很灵活，但会增加往返次数，而且模型可能漏掉一次本该做的检索。

## 常见误区

- **“模型会运行我的函数。”** 它返回的是一个请求。就连那些会“自动”调用函数的 SDK 辅助方法，也是在你的进程里运行这些函数。
- **“只要列出了工具，模型就会用。”** 在 `auto` 下，它可以凭记忆作答，编造状态就是这么来的。
- **“严格模式能让调用既正确又安全。”** 由 schema 强制的参数只保证形状，不保证订单存在，也不保证该用户有权操作。
- **“我定义一个假工具来拿回 JSON。”** 这个窍门在结构化输出出现之前就有了，而且在拒绝强制 tool choice 的地方会失效。

## 典型面试题

<details>
<summary>什么是 tool calling？谁来执行工具？</summary>

模型返回一个结构化请求：工具名加参数。是否运行由我的代码决定，运行也由我的代码完成，并把结果返回。只有托管工具是在别处运行，也就是在供应商的服务器上。

</details>

<details>
<summary>Tool calling 和结构化输出有什么区别？</summary>

当没有东西需要运行时（比如一个工单标签），结构化输出固定的是最终答案的形状。Tool calling 则是在给出答案之前去取数据或执行操作。两者可以组合：严格的工具参数加上结构化的回复。

</details>

<details>
<summary>客户想把网关里全部 80 个工具都接上。你会开放哪些？</summary>

只开放这个角色的任务所需要的，优先选只读工具，并合并功能重叠的工具。它绝不能用的工具，比如删除客户，一律不开放。工具目录很大时，用工具检索，并用评测提示词检查工具选择是否正确。

</details>

<details>
<summary>助手没调用查询工具就直接报出订单状态。你怎么修？</summary>

trace 会证实没有发生调用；通常是用了 `auto`，而工具描述含糊。我会把描述改得更精确，并补充评测用例。如果每个订单问题都需要实时数据，就让代码直接调用查询工具。

</details>

## 延伸阅读

- 视频：[What is Tool Calling? Connecting LLMs to Your Data](https://www.youtube.com/watch?v=h8gMhXYAv1k)（IBM Technology，YouTube，约 9 分钟）
- 参考：[How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)（Anthropic Claude Docs，约 12 分钟）
- 参考：[Function calling](https://developers.openai.com/api/docs/guides/function-calling)（OpenAI API documentation，约 30 分钟）

## 相关页面

- [LLM API（请求、响应、流式输出、SDK）](../07-llm-application-foundations/03-llm-apis.md)
- [工具调用循环与工具 trace](./02-tool-call-loop.md)
- [工具 schema 与工具设计](./05-tool-design.md)
- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [RAG 与替代方案（长上下文、微调、数据库、API）](../09-rag-knowledge-bases/09-rag-vs-alternatives.md)
