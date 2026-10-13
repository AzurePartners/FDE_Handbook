---
title: Token 与上下文窗口
row: M2-L1.2
---
**一句话：** token 是语言模型读写的文本片段，上下文窗口则是一个请求所能容纳的固定 token 数量，模型的回复也算在内。

## 是什么

语言模型读的不是单词，也不是字母。它的分词器（tokenizer，通常采用字节对编码）把文本切成 token：一个常见的词、一个生僻词的一部分、一组数字或标点。模型供应商用 token 来计量、定价和限制一切。

打个比方，想想冰箱贴诗歌套装。常见的词，比如“refund”，有自己专属的一块磁贴；订单 ID 则要用细小的碎片拼出来，而你是按磁贴数量付费的。英文文章平均每个 token 约 4 个字符，也就是约 0.75 个单词。代码、数字、ID 和许多非英语语言需要的 token 更多。

上下文窗口是模型处理一个请求时的工作记忆，而不是它的训练数据。它是一份固定的 token 预算，由系统提示词、对话历史、文档、图片、工具定义、工具结果和回复共用，其中回复也包括模型先写出的任何推理（“思考”）内容。

## FDE 为什么需要

一家物流客户想要一个助手，根据工单、带缩进排版的 JSON 订单历史和报关 PDF 来起草客服回复。在简短的英文工单上做的试点效果很好，于是财务按“单词数 × 1.33”来预算 token。到了生产环境，带有 40 页 PDF 的工单以 HTTP 400 “prompt is too long”失败。账单也超支了：阿拉伯语和印地语文本、ID 和 JSON 比英文占用更多 token，输出比输入更贵，而且一次模型升级还改变了分词器。

解决办法是测量，而不是猜：按语言在真实工单上统计 token 数，记录每次调用的用量，并在发送前检查大小。

## 核心概念

### 文本不同，token 数不同

以下计数来自 OpenAI 的一个分词器（`o200k_base`）：

| 文本 | Token 数 |
|---|---|
| 一句 59 个字符的英文客服用语 | 10 |
| 同一句话的德语版、印地语版 | 20、19 |
| `2026-09-29`、`ORD-2026-000481` | 6、7 |
| 一个 36 个字符的 UUID | 18 到 36 |
| 20 行订单数据，分别用 CSV、紧凑 JSON、带缩进的 JSON 表示 | 294、460、720 |

不同模型的计数不能互相套用：对同样的文本，Claude 4.7 及之后的模型产生的 token 比更早的 Claude 模型多约 30%。换了模型之后要重新计数。

### 输入、输出与 usage 字段

输入和输出分别按每百万 token 计价，输出更贵（截至 2026 年 9 月，Claude Haiku 4.5 的标价是输入 1 美元、输出 5 美元）。思考 token 按输出计费。图片和 PDF 也要计入：在 Claude 上，一张 1000x1000 的图片是 1,296 个 token，一页 PDF 约为 1,500 到 3,000 个文本 token，外加图像 token。

```python
# Anthropic Python SDK
req = dict(model=os.environ["LLM_MODEL"], messages=messages)

print(client.messages.count_tokens(**req).input_tokens)  # 免费估算
resp = client.messages.create(max_tokens=1024, **req)
print(resp.usage.input_tokens, resp.usage.output_tokens)  # 实际计费
```

`usage` 字段是事实来源；OpenAI 和 Gemini 也有类似的端点。

### 同一份预算，以及溢出

应用每一轮都会重发整段对话，所以输入不断增长。许多旗舰模型提供约 100 万 token 的窗口（以各模型的文档为准）。这是上限，而不是目标：上下文越长，准确率越会下降。

如果仅输入就超出了窗口，Anthropic 会返回 400 “prompt is too long”（413 针对的是字节数，而不是 token 数）。OpenAI 的 Responses API 同样返回 400，除非你设置 `truncation: "auto"`，那样它会悄悄丢掉最早的条目，连指令也不例外。

## 常见误区

- **“token 基本上就是一个单词。”** token 是子词片段：一个日期可能是 6 个 token，一个 UUID 最多可达 36 个，所以要实际统计，而不是靠换算。
- **“回复不占用上下文窗口。”** 输入和输出共用一份预算，所以回复（包括思考）也必须放得下。
- **“一次 tiktoken 的计数适用于任何模型。”** `tiktoken` 是 OpenAI 的分词器；每个模型系列都有自己的分词器。要用供应商针对具体模型提供的端点来计数。
- **“发送太多的话，模型会读取放得下的那一部分。”** 默认情况下，Anthropic 和 OpenAI 的 API 会用 400 拒绝超长的输入。静默截断需要主动开启，或者是聊天应用的行为。

## 典型面试题

<details>
<summary>token 是什么？为什么模型供应商按 token 给用量定价？</summary>

token 是模型处理的文本片段，比如一个单词、一个词的片段或一组数字。计算量随 token 数增长，所以供应商把输入和输出分开计量，并按 token 限制请求大小。

</details>

<details>
<summary>上下文窗口和每分钟 token 数的限流有什么区别？</summary>

窗口限制的是单个请求；超出时返回 400，重试也解决不了。每分钟 token 数的限流约束的是跨请求的吞吐量，返回 429，等待后重试就能解决。

</details>

<details>
<summary>客户想让系统基于 300 页的合同 PDF 回答问题。你怎么检查能否放得下、成本多少？</summary>

用供应商针对具体模型提供的端点，统计真实样本的 token 数；每页 PDF 要花几千个 token。把总数和窗口比较，并给回复留出空间，同时把输入和输出分开计价。如果勉强放得下或成本太高，就改用检索。

</details>

<details>
<summary>聊了很久的用户会遇到“prompt is too long”，新用户却从不会。为什么？</summary>

应用每一轮都重发完整的对话历史，所以很长的对话超出了窗口。先逐轮记录 `usage.input_tokens` 来确认，再加上发送前的检查（为回复预留空间）、裁剪较早几轮对话的方案，以及明确的兜底处理。

</details>

## 延伸阅读

- 互动练习：[OpenAI Tokenizer](https://platform.openai.com/tokenizer)（OpenAI，约 10 分钟）
- 参考：[Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows)（Anthropic，约 12 分钟）
- 参考：[Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)（Anthropic，约 10 分钟）

## 相关页面

- [LLM API（请求、响应、流式输出、SDK）](./03-llm-apis.md)
- [消息角色、系统提示词与对话历史](./04-message-roles.md)
- [上下文工程](../08-prompting-context-structured-output/04-context-engineering.md)
- [上下文污染与上下文腐化](../08-prompting-context-structured-output/05-context-pollution.md)
- [限流](../../m1/03-apis-data-integration/04-rate-limits.md)
