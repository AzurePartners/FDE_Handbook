---
title: 记忆写入策略
row: M3-L4.6
---
**一句话：** 记忆写入策略是一组由代码强制执行的规则，用来决定 agent 可以把什么存进记忆、以谁的话为准、附带什么来源和审核到期日，以及新事实如何取代旧事实。

## 是什么

agent 的记忆里存着后续会话会信任的笔记，比如偏好、已确认的规则和已完成的分析（[长期记忆与用户记忆](./05-long-term-and-user-memory.md)）。一条错误的笔记就能把回答带偏好几个月；写入策略决定什么能进来。

一位细心的助理，笔记本上写的是“Chen 女士：只约上午（她本人说的，3 月 3 日）”，而不是“她好像很累，也许该取消周五的预约”；偏好变了，新的一行就会取代旧的一行。

准确地说，对每一次待写入的候选内容，策略都要定下几件事：这个类型是否允许写入，谁为它担保，它带什么来源和审核到期日，它取代什么，以及由什么触发。模型可以提议，由代码决定。

## FDE 为什么需要

一家出版商的 Draft agent 可以把任何内容存进团队记忆。不到一个季度，某位编辑说的“这次先别写开头”成了常设规则，“读者好像不喜欢列表”这个猜测被当作事实存了下来，“正式”和“口语化”两条没有日期的语气规则又同时生效。稿子的语气来回切换，也没人知道哪条规则是谁定的。（示例场景。）

FDE 把这些规则放进了执行写入的代码里：允许的类型、对常设规则的确认、每条记忆上的来源、日期和任务 ID、审核到期日，以及每条规则只有一个生效值。

## 核心概念

### 该写什么，不该写什么

| 该写入 | 不写入 |
|---|---|
| 已确认的规则：“客户的博客不用第一人称” | 猜测：“读者好像不喜欢列表” |
| 稳定的偏好：“英式拼写，标题要短” | 一次性的请求：“这次先别写开头” |
| 带日期的决定：“切入角度定为客户流失成本，6 月 10 日” | 原始文档：改为链接到[知识库](../../m2/09-rag-knowledge-bases/02-knowledge-base-preparation.md) |
| 已完成工作的摘要，并链接到产出 | 密钥、账户号码、没有说明用途的[敏感个人信息](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md) |

OpenAI 关于个性化的 cookbook 把这条检验写进了它的 `save_memory_note` 工具：笔记必须是“由用户明确说出或明确确认的（而非推断的）”，而且绝不能是指令。

### 权威性与溯源

每次写入都需要有担保：可以是用户同意了被复述出来的规则（“把‘英式拼写’存为常设规则吗？”），可以是 CRM 这类权威数据源（system of record），也可以是团队规则的指定负责人。agent 仅仅读到过的文字（比如一个网页）永远不能为自己担保（见[记忆污染、过期与隐私风险](./07-memory-pollution-staleness-privacy.md)）。把每种条目类型都当作一份[数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)，带上溯源字段（谁说的、什么时候、在哪个任务里）和审核到期日，这样任何人都能核对。

### 用新值取代旧值，而不是追加

每个事实都以用户、主题和属性为键。新值写入后，旧条目被标记为已被取代，留作审计，但绝不再加载。两条互相矛盾的生效条目，会让模型自己挑一条或把它们混在一起；LangChain 提醒说，有些模型倾向于过度新增，另一些则倾向于过度更新，所以要由代码保证每个键只有一个生效值。

### 由代码决定何时写入

热路径写入（hot-path）发生在对话进行中，通常通过工具完成，所以用户可以当场确认，但会增加延迟；后台写入（background）在单独的作业里运行，往往在会话结束之后（这是 LangChain 的叫法）。无论哪种，都由代码执行：用 Anthropic 的 memory tool 时，“Claude 请求文件操作，由你的应用来执行。”Claude“通常会拒绝”存储敏感数据，但 Anthropic 仍建议在你的 handler 里做校验：

```python
def handle_memory_write(p, user, task):
    if p["type"] not in ALLOWED or looks_sensitive(p["value"]):
        return reject(p)
    if p["type"] in NEEDS_CONFIRMATION and not user_confirmed(user, p):
        return ask_to_confirm(user, p)              # 此时还没有存入任何内容
    entry = {**p, "status": "confirmed", "said_by": user.id, "task_id": task.id,
             "created": today(), "review_by": today() + REVIEW_AFTER[p["type"]]}
    memory.supersede(user.id, p["key"], by=entry)
    memory.save(entry)
```

## 常见误区

- **“模型知道什么值得记。”** 它会存得太多，或者过于急切地覆盖旧内容，而且它读到的文字可能把它骗了。每一次写入都要由代码检查。
- **“用户说过的话就算已确认。”** 随口一提不是常设规则；确认指的是用户同意了被复述出来的规则。
- **“先全存下来，以后再过滤。”** 存下来的猜测会在之后的调用里重新冒出来，而且每一条都是你必须保护、并在用户要求时删除的数据。

## 典型面试题

<details>
<summary>什么是记忆写入策略？</summary>

由代码强制执行的规则，规定 agent 可以存什么：允许的类型、每一类需要谁来担保、必须带的溯源信息和审核到期日，以及新值如何取代旧值。

</details>

<details>
<summary>热路径写入和后台写入有什么区别？</summary>

热路径写入发生在对话过程中：立刻可用，用户也能当场确认，但会更慢。后台写入稍后在单独的作业里运行：不增加延迟，但有滞后。两种都要由代码校验。

</details>

<details>
<summary>一个 Finance agent 要记住以往的分析、偏好和已确认的约束，哪些写入需要确认？</summary>

约束和偏好需要分析师明确说“是”，并连同谁说的、何时说的、哪个任务、审核到期日一起存下。分析摘要由代码在任务关闭时写入。猜测、原始申报文件和账户号码一律不存。

</details>

<details>
<summary>记忆里同时有两条生效的条目，“报告以 EUR 计价”和“报告以 USD 计价”，哪里出了问题？</summary>

写入路径是追加，而不是取代。我会以用户、主题和属性为键，找分析师确认当前的值，把另一条标记为已被取代，并加一条测试：第二次写入后只剩一个生效值。

</details>

## 延伸阅读

- 参考：[Memory overview](https://docs.langchain.com/oss/python/concepts/memory)（LangChain，约 12 分钟）
- 练习：[Context Engineering for Personalization: State Management with Long-Term Memory Notes](https://developers.openai.com/cookbook/examples/agents_sdk/context_personalization)（OpenAI Cookbook，约 35 分钟）

## 相关页面

- [长期记忆与用户记忆](./05-long-term-and-user-memory.md)
- [记忆污染、过期与隐私风险](./07-memory-pollution-staleness-privacy.md)
- [敏感数据与 PII 保护](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)
- [Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Agent 状态与记忆类型](./01-state-and-memory-types.md)
