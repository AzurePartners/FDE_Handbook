---
title: 暂停 agent 等待人工审批
row: M3-L5.7
---
**一句话：** 暂停 agent 等待人工审批，意思是保存它的状态和它提议执行的确切操作，释放原先运行它的 worker，等人在几分钟或几天之后做出决定时，再从那个点继续。

## 是什么

有些 agent 步骤必须等人，而答复可能要几天。让程序在这段时间里一直运行是行不通的：一次部署就会抹掉这段等待，而且每个在等待的运行都会占住一个 worker（运行任务的进程）。

打个比方，一张等经理签字的报销单：你会把它放进文件盘，标明要签什么、最晚什么时候签，而不是守在办公桌前等。

准确地说，持久化的审批暂停，就是在审批点上设一个[检查点](./02-durable-execution.md)：运行时保存这次运行的状态和一个待处理的请求，把运行标记为等待中，并释放 worker。决定到来时，任何一个 worker 都可以让它继续。哪些操作需要人参与，见[人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)。

## FDE 为什么需要

一家物流客户的应付账款 agent 会把超过 10,000 美元的付款暂停下来，等财务主管审批。审批邮件写的是“批准向 Nordfreight 付款？”，没有金额，于是财务主管凭记忆批准。拒绝以错误的形式传回给 agent，它就把请求又发了一遍。一位财务主管休假的三周里，有 12 个请求一直搁着；另外，一个四天前的批准，付掉了一张供应商后来已经冲销的发票。

FDE 围绕确切的 `pay_invoice` 调用、证据、发票版本和截止时间重建了审批请求（24 小时提醒，48 小时找副手，72 小时过期）。现在拒绝会连同理由一起返回，恢复后的运行会先重新读取发票。（示例场景。）

## 核心概念

### 保存、释放、恢复

```python
def pause(run, call):
    approvals.create(run_id=run.id, call=call, evidence=run.evidence(),
                     based_on=version_of(call.args), expires_at=now() + TTL)
    run.status = "waiting_approval"
    store.save(run)                            # worker 现在空闲了

def resume(request_id, decision):              # 任何一个 worker，几天之后
    req = approvals.consume(request_id)        # 原子操作：只会成功一次
    run = store.load(req.run_id)
    if decision.kind != "reject" and version_of(req.call.args) != req.based_on:
        decision = Decision("void", "invoice changed since the request")
    run.continue_with(req.call, decision)      # 成为工具结果
```

请求里存的是确切的调用（工具、参数、调用 ID），而不是摘要。OpenAI 的 Agents SDK 文档要求每个请求只能被消费一次，这样“并发提交或重放的提交就无法让同一个快照恢复两次”。

### 运行时如何表达等待

| 方式 | 发生什么 | 示例 |
|---|---|---|
| Interrupt | 运行停止，并返回待处理的请求 | LangGraph `interrupt()`、OpenAI Agents SDK `needs_approval` |
| Signal 或外部事件 | 处于等待中的工作流收到决定 | Temporal Signals、Durable Functions `WaitForExternalEvent` |
| 审批任务 | 完成审批表中的一行，就会把一次恢复入队 | 你自己的数据库或工单工具 |

在 Anthropic 的 Claude Agent SDK 中，权限回调在运行中的进程里“可以无限期保持挂起”，而 `defer` hook 的决定则允许进程退出，并“稍后从持久化的会话中恢复”。

### 批准、修改或拒绝

批准会带着幂等键去执行存好的调用。修改后的参数要经过与模型给出的参数相同的校验和操作 gate；LangChain 提醒，改动太大可能会让模型“重新评估自己的做法，并可能多次执行该工具”。拒绝会把理由作为工具结果返回，于是 agent 会修改方案，或者关闭任务。

### 截止时间与过期的审批

默认情况下，等待没有上限：LangGraph 的 interrupt“会无限期等待”，Claude Code 的延迟调用“没有超时，也没有重试次数上限”（会话文件默认在 30 天后删除）。像 Microsoft 的文档那样，让一个持久化计时器与决定赛跑：先提醒，再找副手，最后按拒绝处理，让请求过期。

在行动之前的最后一刻，重新读取目标，把它的版本与 `based_on` 比较；如果变了，就让这次审批作废，并重新请求审批（[通用的版本检查](./06-concurrency-and-stale-state.md)）。

## 常见误区

- **“没人回复的话，运行时会让请求超时。”** 很多运行时默认无限期等待；截止时间要自己做。
- **“谁拿到审批链接，谁就可以批准。”** OpenAI 的文档说：“持有 run ID 或 decision ID 并不等于获得授权。”要对审批人做认证（authentication，简称 authn）和授权（authorization，简称 authz）。
- **“审批在有人使用之前一直有效。”** 它只覆盖审批人当时看到的数据。要让它过期，并重新检查目标。

## 典型面试题

<details>
<summary>为等待审批而持久化地暂停 agent，是什么意思？</summary>

运行保存自己的状态和确切的待处理调用，然后释放 worker。决定到来时，由任何一个 worker 让它继续，所以这段等待能扛过部署，也不占用任何进程。

</details>

<details>
<summary>interrupt 与 signal 或外部事件有什么区别？</summary>

interrupt 会结束这次运行，并把待处理的请求交还给你；你带着决定重新运行它。用 signal 或外部事件时，则由 Temporal 这样的引擎让这次执行保持等待，并把决定投递给它。

</details>

<details>
<summary>你会如何为内容运营 agent 设计编辑审批？</summary>

保存确切的发布调用（文章、版本、渠道）、diff 和截止时间，然后释放 worker。端点认证编辑的身份，只消费一次请求，并把恢复任务入队。24 小时提醒，48 小时升级，72 小时过期；只有版本没变时才发布。

</details>

<details>
<summary>编辑已经批准了，但有些运行始终没有恢复。你会怎么排查？</summary>

顺着一个请求追踪：决定是否已保存，恢复任务是否已入队并被消费，状态是否已加载？常见的罪魁有：状态在部署中丢失、恢复静默失败，或者某次发布改动了 agent，导致旧状态再也加载不了。

</details>

## 延伸阅读

- 参考：[Human Interaction Pattern](https://learn.microsoft.com/en-us/azure/durable-task/common/durable-task-human-interaction)（Microsoft Learn，约 15 分钟）
- 参考：[Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/)（OpenAI Agents SDK，约 12 分钟）
- 参考：[Human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop)（LangChain docs，约 15 分钟）

## 相关页面

- [人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [持久化执行（检查点、重放、恢复）](./02-durable-execution.md)
- [Agent 系统中的并发与过期状态](./06-concurrency-and-stale-state.md)
- [未授权请求、按用户的访问权限与操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
- [持久型 agent](./01-persistent-agents.md)
