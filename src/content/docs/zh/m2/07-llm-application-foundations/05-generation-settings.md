---
title: 生成参数（temperature、top-p、最大输出 token 数、推理强度）
row: M2-L1.5
---
**一句话：** 生成参数是每个请求上都可以调节的旋钮，用来塑造模型的回复：用词有多随机，最长能写多久，在哪里停下，以及先思考多少。

## 是什么

模型挑选下一个 token（一小段文本）的方式是加权抽签，就像一场抽奖：可能性大的词手里的票更多，所以同一个问题可能得到措辞不同的回复。**temperature** 决定这些票的分配有多悬殊：值低时偏向得分最高的选项，值高时冷门选项也有机会。**top-p**（核采样，nucleus sampling）只保留累计概率达到 p（比如 0.9）的最小候选集合。

**最大输出 token 数** 限制一次调用最多能生成多少内容。**推理强度** 是软性的引导，决定推理模型做多少隐藏的思考；较早的 API 使用的是以 token 计的固定**思考预算**。

即使 temperature 为 0，结果也并非完全确定：繁忙的服务器怎样把你的请求和别人的请求凑成一批，会改变极小的舍入误差，所以得分几乎并列的 token 的先后顺序可能翻转。随机种子（OpenAI Chat Completions 的 beta 功能，以及 Gemini）只能尽力而为；Anthropic 没有。

## FDE 为什么需要

一家家具零售商的邮件分流使用了 `temperature=0`、`top_k=1` 和 `max_tokens=150`。模型升级之后，每次调用都返回 HTTP 400：新模型拒绝非默认的采样参数。删掉这些字段后错误消失了，但有 3% 的工单变成了“未分类”。这个模型的思考始终开启，在长邮件上把 150 个 token 全用光了，留下的是 `stop_reason: "max_tokens"`，没有任何文本。

FDE 把推理强度设为 low，调高了上限，并把 `end_turn` 以外的任何停止都视为失败。某封邮件在 `damaged_item` 和 `billing` 之间来回变，其实是因为里面同时包含这两个问题：这需要一条优先规则，而不是 temperature 0。

## 核心概念

### 采样控制与各模型的支持情况

低 temperature 让最可能的答案更稳定，而不是更正确。取值范围各不相同（Anthropic 是 0 到 1，OpenAI 是 0 到 2），OpenAI 建议在 temperature 和 top-p 中只改其中一个，不要两个都改。**top-k** 只保留可能性最高的 k 个 token。

支持情况因模型而异，请查阅文档。截至 2026 年 9 月，Anthropic 已经弃用了这三个参数：Claude Opus 4.7 及之后的模型、Sonnet 5 及之后的模型，以及 Fable 和 Mythos 模型，在传入非默认值时会返回 HTTP 400；Sonnet 4.6 和 Haiku 4.5 在不开启思考时仍然接受这些参数。Microsoft 将它们列为 OpenAI 推理模型不支持的参数；GPT-6 模型只有在推理强度为 none 时才接受它们，而并非每个 GPT-6 模型都提供这个选项。Google 建议把 Gemini 3 保持在 1.0，以免陷入循环。

### 最大输出 token 数

这个上限是天花板，而不是长度目标。在推理模型上，它同时涵盖思考和答案（思考即使被隐藏，也按输出计费）。触达上限时返回的仍然是 HTTP 200：

| API | 上限字段 | 截断信号 |
|---|---|---|
| Anthropic | `max_tokens` | `stop_reason: "max_tokens"` |
| OpenAI Responses | `max_output_tokens` | `status: "incomplete"` |
| OpenAI Chat Completions | `max_completion_tokens` | `finish_reason: "length"` |

要留出余量：Anthropic 建议在推理强度为 `xhigh` 或 `max` 时设为 64k；Microsoft 建议在摸清一个工作负载的特点之前，至少设为 25,000。

### 推理强度

推理强度决定的是推理模型用多大力气，而不是一个精确的 token 数。名称和默认值各不相同（Anthropic 是 `low` 到 `max`；OpenAI 另有 `none` 和 `minimal`；Gemini 的 `thinking_level` 从 `minimal` 到 `high`），所以要显式设置。从 Claude 4.7 起，Anthropic 拒绝较早的 `budget_tokens`。

设想一场考试：推理强度是你鼓励考生打多少草稿，最大输出 token 数是发下去的纸页数，草稿也占用这些纸页。

```python
msg = client.messages.create(
    model=os.environ["LLM_MODEL"],
    max_tokens=4096,                  # 思考加上 JSON
    output_config={"effort": "low"},  # 不设 temperature（会被拒绝）
    messages=[{"role": "user", "content": email}],
)
if msg.stop_reason != "end_turn":
    flag_for_review(msg.stop_reason, msg.usage)
```

### 停止序列

停止序列会在生成出你指定的字符串时结束生成（Anthropic 对应 `stop_reason: "stop_sequence"`）。想约束输出的格式，优先使用结构化输出。

## 常见误区

- **“temperature 设为 0，模型就是确定性的。”** 服务端的批处理和舍入仍然可能让几乎并列的结果翻转。
- **“temperature 越低，幻觉越少。”** 它换来的是一致性，而不是正确性；要让答案准确，靠的是上下文和校验。
- **“`max_tokens` 决定答案的长度。”** 它是一个上限，会把回复截断，甚至截断在 JSON 的中间。
- **“最高推理强度总能得到最好的结果。”** 它要花费 token 和时间，还可能在简单任务上过度思考。

## 典型面试题

<details>
<summary>temperature 和 top-p 究竟起什么作用？</summary>

模型会给下一个 token 分配概率，并从中采样出一个。temperature 会重塑这些概率：低值让概率集中在得分最高的选项上，高值则向不太可能的选项扩散。top-p 只从累计概率达到 p 的最小集合中采样。

</details>

<details>
<summary>最大输出 token 数和推理强度有什么区别？</summary>

最大输出 token 数是对所有生成内容（包括思考）的硬性上限，触达上限就会截断。推理强度是对思考多少的软性引导。因触达最大输出 token 数而停止之后，如果这些推理确有必要，我会调高上限，否则就降低推理强度。

</details>

<details>
<summary>一位利益相关方看到答案不一致，想把 temperature 设为 0。你怎么回应？</summary>

temperature 为 0 也不保证结果完全一致，而且许多现行模型会直接拒绝这个值。一致不等于正确：答案有变化，通常说明输入有歧义或指令含糊。我会把指令写得更严谨，加上校验，并在多次重复的评测运行中衡量结果的一致程度。

</details>

<details>
<summary>模型升级之后，有些回复是空的，状态码却是 HTTP 200。为什么？</summary>

很可能是思考把输出上限用光了。我会通过停止原因和用量来确认，调高上限或降低推理强度，并把任何未完成的停止都视为失败。

</details>

## 延伸阅读

- 文章：[How to generate text: using different decoding methods for language generation with Transformers](https://huggingface.co/blog/how-to-generate)（Hugging Face，约 15 分钟）
- 参考：[Effort](https://platform.claude.com/docs/en/build-with-claude/effort)（Anthropic docs，约 13 分钟）
- 参考：[Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost)（Anthropic docs，约 9 分钟）

## 相关页面

- [大语言模型（LLM）与下一个 token 预测](./01-large-language-models.md)
- [LLM API（请求、响应、流式输出、SDK）](./03-llm-apis.md)
- [幻觉与其他模型输出失败](./06-hallucinations-and-output-failures.md)
- [聊天表现与系统可靠性](./07-chat-vs-system-reliability.md)
- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
