---
title: LLM API（请求、响应、流式输出、SDK）
row: M2-L1.3
---
**一句话：** LLM API 是你的代码所用的 Web 接口：把模型 ID、指令和消息发送给托管的模型，拿回它的回复、token 用量以及停止的原因，可以一次性返回，也可以流式输出。

## 是什么

聊天应用是给人用的；软件调用的是 API，发送 HTTPS 请求，读回 JSON。官方 SDK（software development kit，软件开发工具包，即 Python、TypeScript 等语言的库）负责构造请求、重试暂时性错误，并抛出带类型的错误。

打个比方，想想点菜单。上面写着菜品（模型 ID）、允许的最大分量（`max_tokens`）、常设指令（系统提示词）和到目前为止的对话（`messages`）。送回来的有盘子里的菜、一张小票（token 用量），还有一条说明这单为什么结束的备注。只检查有没有上菜的服务员，发现不了只上了半份。

准确地说，Anthropic 的 Messages API 是 `POST /v1/messages`，必填字段是 `model`、`max_tokens` 和 `messages`，另有可选的 `system`、`stream` 等。一条消息的 `content` 可以是字符串，也可以是带类型的内容块数组，所以图片和 PDF 是以 `image` 和 `document` 块的形式传送的。OpenAI 的 Responses API（除非设置 `store: false`，否则会保存结果）和 Google 的 `google-genai` SDK 采用同样的结构。

## FDE 为什么需要

一家保险公司的脚本把模型写的理赔员备注摘要存进理赔系统。它把模型 ID 写死在代码里，只读取 `response.content[0].text`。有些摘要写到一半就断了，日志里却什么都没有；一批任务因为 529 `overloaded_error` 响应而崩溃；而且这个模型 60 天后就要下线。

懂 API 的 FDE 会发现，每一条被截断的摘要，返回的都是 HTTP 200，且带有 `stop_reason: "max_tokens"`，然后修复代码：根据停止原因分支处理，让 SDK 负责重试，记录请求 ID 和用量，并把模型 ID 移到配置里。

## 核心概念

### 一次调用，正确读取

```python
import os, anthropic

client = anthropic.Anthropic()
msg = client.messages.create(
    model=os.environ["LLM_MODEL"],
    max_tokens=1024,
    system="总结理赔备注。",
    messages=[{"role": "user", "content": notes}],
)
if msg.stop_reason != "end_turn":
    raise RuntimeError(f"{msg.stop_reason} {msg._request_id}")
text = "".join(b.text for b in msg.content if b.type == "text")
```

思考块或工具块可能排在最前面，所以要按类型读取 `content` 块；`msg.usage` 里是 token 计数。

### 停止原因不是错误

停止原因是成功的 200 响应的一部分。Anthropic 当前的取值包括：

| `stop_reason` | 含义与处理 |
|---|---|
| `end_turn` | 已完成；使用回复 |
| `max_tokens` | 达到了你设置的上限；被截断 |
| `stop_sequence` | 遇到了你设置的停止序列 |
| `tool_use` | 要你的代码去运行一个工具 |
| `pause_turn` | 服务端工具循环已暂停；把它发回去 |
| `refusal` | 拒答；丢弃部分输出 |
| `model_context_window_exceeded` | 填满了上下文窗口；被截断 |

OpenAI 报告的是 `finish_reason`（`stop`、`length`、`content_filter`、`tool_calls`）；Gemini 使用 `STOP`、`MAX_TOKENS`、`SAFETY` 等。新的取值会不断出现，所以要加一个默认分支。

错误是 4xx 或 5xx 响应。过载（Anthropic 上是 529 `overloaded_error`，OpenAI 和 Gemini 上是 503）通常重试后就会消失，Anthropic 和 OpenAI 的 Python SDK 默认会自动重试两次。

### 流式输出

设置 `stream: true` 后，API 会在文本生成的同时发送 server-sent events（SSE，服务器发送事件）：先是 `message_start`，然后是携带文本片段的 `content_block_delta`，再是 `message_delta`（停止原因、累计用量）和 `message_stop`。

```python
with client.messages.stream(model=os.environ["LLM_MODEL"],
                            max_tokens=16000, messages=messages) as stream:
    for chunk in stream.text_stream:
        show(chunk)
    final = stream.get_final_message()  # 含 stop_reason 和 usage
```

token 一样，账单一样，总耗时也差不多：流式输出能让字词更早显示出来，并能避免长请求因空闲超时而断开。但错误可能在 200 之后才到达，而且中断的流不会被自动重试。

### 快照、别名与下线

快照是固定的模型版本；别名是供应商可以移动的指针。从 Claude 4.6 起，不带日期的 ID（如 `claude-sonnet-4-6`）是固定的快照，而 Gemini 的 `-latest` 和不带日期的 OpenAI 别名则是浮动的。固定不等于永久：Anthropic 至少提前 60 天通知，之后调用就会失败（`claude-opus-4-1-20250805` 已于 2026 年 8 月 5 日下线）。

## 常见误区

- **“HTTP 200 表示答案是完整的。”** 被截断的回复和拒答同样返回 200。
- **“答案就是 `response.content[0].text`。”** 第一个内容块可能是思考块或工具调用。
- **“不带日期的 Claude ID 总是指向最新的模型。”** 从 Claude 4.6 起，这类 ID 是固定的快照；只有部分别名是浮动的。
- **“流式输出让模型更快、更便宜。”** token 一样，账单也一样；只是最先的几个字词更早到达。

## 典型面试题

<details>
<summary>一个 LLM API 请求里包含什么？会返回什么？</summary>

一个来自配置的模型 ID、输出 token 的上限、可选的系统提示词，以及包含文本、图片或文档块的消息。返回的是内容块、用量和停止原因。

</details>

<details>
<summary>停止原因和错误有什么区别？</summary>

错误是失败的请求，比如 400 或 529。停止原因则随成功的 200 一起返回，说明生成为什么结束。截断也是 200，所以只检查状态码，就会把不完整的答案交付出去。

</details>

<details>
<summary>报告生成器处理长文档时会超时。流式输出怎么帮上忙？</summary>

事件会让连接不因空闲超时而断开。我会使用 SDK 的流式辅助方法，从最终消息中取出停止原因和用量，并处理流传输中途出现的错误。

</details>

<details>
<summary>一个脚本只读取 `response.content[0].text`。为什么这很脆弱？</summary>

响应是一个内容块列表，而第一个块不一定是文本：启用思考或工具调用时，它可能是思考块或 `tool_use` 块。我会收集所有文本块，并在使用答案之前先检查停止原因。

</details>

## 延伸阅读

- 练习：[Get started with Claude](https://platform.claude.com/docs/en/get-started)（Anthropic，约 15 分钟）
- 参考：[Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)（Anthropic，约 10 分钟）
- 参考：[Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming)（Anthropic，约 15 分钟）

## 相关页面

- [Token 与上下文窗口](./02-tokens-and-context-windows.md)
- [消息角色、系统提示词与对话历史](./04-message-roles.md)
- [生成参数（temperature、top-p、最大输出 token 数、推理强度）](./05-generation-settings.md)
- [限流](../../m1/03-apis-data-integration/04-rate-limits.md)
