---
title: 核心评测指标（准确率、完整性、格式合规、拒答、延迟、成本）
row: M2-L5.4
---
**一句话：** 核心评测指标是一次评测运行分别报告的几个数字（准确率、完整性、格式合规、拒答行为、延迟和成本），每个数字都有各自与客户商定的阈值。

## 是什么

指标把一次评测运行中逐个用例的判定，变成一个带目标的数字。一个数字描述不了一个 AI 功能：回答可能正确却很慢，也可能看上去很安全，只是因为它几乎什么都拒答。

车辆年检也是同样的道理：刹车、灯光和排放各有各的及格线，刹车再好也抵不了大灯不合格。

Anthropic 的评测指南要求每条标准都有可衡量的目标，包括延迟和价格。和客户为每个指标商定一个阈值，全部通过才发布。加权总分可以给通过了所有 gate 的版本排序，但单靠它会让表现好的指标掩盖不合格的指标。

## FDE 为什么需要

一家零售商的客服助手（数字仅为示例）用只读的 `get_order` 工具查询订单。在 300 个评测用例上，FDE 和客户商定了这些目标：准确率 95%，升级用的 JSON 100% 合法，过度拒答率不超过 3%，p95 首 token 时间低于 2 秒，每次请求成本低于 0.01 美元。

一次提示词修改添加了一句“处理个人账户数据时要格外小心”。综合分从 86 升到 90，但订单类问题的过度拒答率从 2% 跳到 14%，没过 gate。后来一次模型升级通过了所有质量 gate，成本却翻了一倍：隐藏的思考 token 按输出计费。

## 核心概念

代码可以检查精确的值、ID、链接、工具调用、schema、拒答标志、耗时和 token 数。换了说法的事实、自由文本的完整性和委婉的推托，则需要经过校准的 LLM 裁判（LLM-as-judge）或人工来判断。

### 准确率与工具调用正确性

准确率问的是答案是否与参考答案一致；对于标签和值，由代码做规范化（去除首尾空白、转为小写）后再比较。

工具调用正确性是操作层面的准确率：选对工具，必填参数齐全，没有多余的参数，参数值在规范化之后一致，或者落在可接受的取值列表里。不需要工具的用例不能产生任何调用（Berkeley Function Calling Leaderboard 的“irrelevance”类别）。工具选择、参数和误调用要分开报告（多步路径属于模块三）。

### 完整性与格式合规

完整性问的是答案是否说全了该说的内容。为每个用例配一份清单，比如截止期限、退货标签链接和退款方式。

格式合规是指能成功解析、并通过 schema 与文本规则的输出所占的比例。严格的结构化输出在遇到拒答和 `max_tokens` 截断时仍然可能出问题，而合法的 JSON 里也可能装着错误的值，所以要检查停止原因。

### 拒答行为：两个比率

拒答不足是回答了助手本该拒绝的内容，比如另一位客户的订单。过度拒答是拒绝了本该回答的内容。给每个用例标上“该拒答”或“该回答”，然后报告“该拒答”用例上的拒答率（目标接近 100%）和“该回答”用例上的过度拒答率（目标要低）。什么都拒答，第一个指标就能拿满分，这正是 XSTest 把 250 条安全提示词和 200 条不安全提示词配成对的原因。

API 标志（Anthropic 的 `stop_reason: "refusal"`、OpenAI 的 `refusal` 输出项）只能捕获由分类器或结构化输出触发的拒答。以文字形式给出的拒答会正常结束，而 promptfoo 的 `is-refusal` 这类模式检查会漏掉委婉的推托。

### 延迟与成本

延迟的分布是右偏的，所以平均值会掩盖慢的长尾。报告 p50（典型值）和 p95（每 20 次里最慢的那 1 次）。对于流式输出的聊天，再加上首 token 时间（TTFT），对推理模型要计时到第一段可见文字出现为止；对于使用前要校验的 JSON，则看总耗时。要关掉评测工具的响应缓存；只有 20 个用例时，p95 大致就是最慢的那一次。

单次请求成本是把每一次调用的 `usage` 加总，包括工具调用循环中的各个回合和重试；报告平均值和 p95。Anthropic 的 `input_tokens` 不含缓存的 token（OpenAI 的则包含），而 `output_tokens` 包含思考 token：

```python
# Anthropic SDK；r：每百万 token 的价格（来自配置）
def call_cost(u, r):
    return (u.input_tokens * r["in"] + u.output_tokens * r["out"]
            + (u.cache_read_input_tokens or 0) * r["cache_read"]
            + (u.cache_creation_input_tokens or 0) * r["cache_write"]) / 1e6
```

## 常见误区

- **“有一个总分就够决定发布了。”** 综合分会让表现好的指标掩盖不合格的指标。
- **“能拒掉所有有害提示词，说明拒答没问题。”** 什么都拒答也能做到这一点。要检查过度拒答。
- **“平均响应时间能反映它有多快。”** 少数几次慢调用会把平均值拉高。要报告 p50 和 p95。
- **“成本取决于回答的长度。”** 输入往往占大头，隐藏的思考按输出计费，而且一次请求可能发起多次调用。

## 典型面试题

<details>
<summary>什么是过度拒答和拒答不足？你怎么衡量它们？</summary>

拒答不足是回答了本该拒绝的内容；过度拒答是拒绝了本该回答的内容。我会给用例标上“该拒答”或“该回答”，两个比率都报告，因为只看其中一个，都能被钻空子。

</details>

<details>
<summary>准确率和完整性有什么区别？</summary>

准确率看它说的内容对不对；完整性看它是否说全了该说的。正确说出了退款期限，却漏了部分退款这一档，就是准确但不完整。

</details>

<details>
<summary>客户想要一个 go/no-go 的单一分数。你会提出什么方案？</summary>

为每个指标写明阈值，包括两个拒答比率、p95 延迟和成本。全部通过才能发布；加权总分可以用来给已通过的候选版本排序。

</details>

<details>
<summary>升级模型之后，0.8% 的严格 JSON 回复解析失败，成本还翻了一倍。你去哪里查？</summary>

先看停止原因：这些失败很可能以 `refusal` 或 `max_tokens` 结束。至于成本，逐次调用对比 `usage`，看是不是默认开启了思考、换了新的分词器（tokenizer），或者工具调用循环里多了调用。

</details>

## 延伸阅读

- 参考：[Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)（Anthropic，约 30 分钟）
- 参考：[Assertions and Metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/)（promptfoo docs，约 25 分钟）
- 参考：[XSTest](https://github.com/paul-rottger/xstest)（GitHub，NAACL 2024，约 10 分钟）

## 相关页面

- [RAG 评测（检索质量、groundedness、来源支持度）](./05-rag-evaluation.md)
- [LLM 裁判](./07-llm-as-judge.md)
- [工具 schema 与工具设计](../10-tool-calling-deterministic-logic/05-tool-design.md)
- [拒答与兜底](../12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)
- [Token 与上下文窗口](../07-llm-application-foundations/02-tokens-and-context-windows.md)
