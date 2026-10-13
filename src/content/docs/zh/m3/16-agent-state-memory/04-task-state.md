---
title: 任务状态（计划、进度、产物）
row: M3-L4.4
---
**一句话：** 任务状态是一项工作进行到哪一步的存储记录（目标、计划、已完成和待办的步骤、输出、待定的决定以及已用预算），它保存在模型之外，由代码更新，这样工作在暂停或失败之后可以恢复。

## 是什么

像“从 120 份租约中提取关键条款，再写一份备忘录”这样的工作，要经过几百次模型调用，而模型在两次调用之间什么都记不住，所以这项工作需要一份记录，说明它进行到了哪里。

打个比方，包裹追踪：更新记录的是中转站的扫描，而不是司机的记忆，所以另一辆货车可以从最近一次扫描的地方接着送。

准确地说，任务状态是以任务 ID 为键的结构化记录：目标和[完成标准](../13-agent-profiles/06-agent-success-criteria.md)、带状态的步骤、产物引用、决定、未解决的问题以及已用预算。代码在每一步之后写入它；每次模型调用看到的是它的一个视图。

## FDE 为什么需要

一家地产投资公司的 agent 把租约整理成租约摘要（关键条款的概要），进度记在它自己的消息里。它报告说 120 份租约全部完成，但有九份无法读取的扫描件没有摘要，所以备忘录里的租金合计是错的。它为等一个回答等了两天，会话已经过期，于是新的一次运行从第 1 份租约重新开始。两个同时进行的交易共用同一个 `progress.md`，把各自的数量混在了一起。

FDE 给每笔交易配了一条以任务 ID 为键的任务记录和一个文件夹，为每份租约记录状态和摘要路径。只有当租约的摘要通过 schema 校验时，代码才把它标为完成，之后的运行从第一份待办的租约接着做。修正后的备忘录涵盖了 111 份摘要，并标出了 9 份扫描件。（示例场景。）

## 核心概念

### 记录里存什么

```json
{
  "task_id": "deal-311",
  "goal": "为每份租约生成摘要；备忘录中的合计与各摘要一致",
  "status": "waiting_for_input",
  "steps": [
    {"id": "lease-001", "status": "done", "artifact": "deal-311/lease-001.json"},
    {"id": "lease-047", "status": "failed", "error": "扫描件无法读取"},
    {"id": "lease-048", "status": "pending"}
  ],
  "decisions": [{"text": "采用 2024 年补充协议中的租金", "by": "客户法律顾问", "on": "2026-09-14"}],
  "open_questions": [{"text": "附函是否仍然有效？", "owner": "交易团队"}],
  "budget_used": {"input_tokens": 1840000}
}
```

存的是产物在哪里，而不是产物的内容；内容放在任务的[工作区](./08-persistence-patterns.md)里。给决定标上日期，这样恢复后的运行就不会把它们重新翻出来讨论；给未解决的问题指定负责人；并保存已用预算，这样重启就无法把[上限](../17-persistent-agents/04-bounded-execution.md)重置。

### 数据由代码写入，而不是聊天文本

聊天里的一句“大约完成了 85 份”无法核查，而且摘要会把它改写。Anthropic 那些长时间运行的编码 agent 被要求只能通过翻转 `passes` 字段来编辑它们的 JSON 功能清单，选用 JSON 是因为“相比 Markdown 文件，模型更不容易不恰当地修改或覆盖 JSON 文件”。更好的做法是由代码来检查证据：

```python
def record_step(task_id, step_id, path):
    task = tasks.get(task_id)              # 只取这一个任务
    step = task.step(step_id)
    problems = validate_abstract(path)     # 文件存在、符合 schema、包含关键条款
    step.status = "failed" if problems else "done"
    step.artifact, step.problems = path, problems
    tasks.save(task)                       # 在下一步之前保存
```

只用一条更新路径：Google 的 ADK 警告说，绕开它的事件路径去修改 state，很可能不会被保存。

### 从记录中恢复

每一次启动（新的 worker、暂停后收到回复、崩溃后重启）都走同一套例程：按任务 ID 加载记录，据此[重建上下文](./02-context-vs-durable-persistence.md)，检查某个 `in_progress` 步骤是否已经产出了它的产物，然后从第一个待办步骤继续。重新执行带副作用的步骤，需要[去重](../17-persistent-agents/05-duplicate-execution.md)。

### 每个任务一条记录

一切都以任务 ID 为键：记录、产物文件夹、文件名、trace 标签。共享的“当前任务”变量或进度文件，会把并行的工作混在一起。LangGraph 以你传入的 `thread_id` 为键保存检查点，所以每个任务都要有自己的 `thread_id`。同一个任务上同时有两次运行，则需要[锁或版本检查](../17-persistent-agents/06-concurrency-and-stale-state.md)。

## 常见误区

- **“agent 知道自己做到哪了，都在对话里。”** 对话记录记下的是模型说过什么，而不是实际发生了什么，而且摘要或新会话都会把它丢掉。
- **“模型的计划就是任务状态。”** 回复里的计划只存在于一个上下文窗口里。要存带状态的步骤，并由代码依据证据来更新状态。
- **“我们的框架会做检查点，所以任务状态不用管了。”** 它保存的是你定义的任何状态；如果只有消息，你恢复出来的就只是一份对话记录，而不是一个计划。

## 典型面试题

<details>
<summary>什么是任务状态？</summary>

它是一项工作进度的记录，以任务 ID 为键：完成标准、带状态的步骤、产物引用、标有日期的决定、有负责人的未解决问题以及已用预算，由代码在每一步之后更新。

</details>

<details>
<summary>任务状态与运行时检查点有什么区别？</summary>

检查点是运行时为恢复执行而保存的快照。任务状态是你设计的业务记录，人和新的 worker 都读得懂；只对消息做检查点，保存下来的是对话记录，而不是计划。

</details>

<details>
<summary>为一个草稿要等编辑好几天的 Content Creation agent 设计任务状态。</summary>

每篇文章一条记录：简报和完成标准，五个步骤（调研、大纲、起草、审核、修订）及其状态，指向来源和草稿的链接，标有日期的编辑决定，以及修订次数。`waiting_for_review` 状态让它暂停；编辑回复之后，它从修订这一步恢复。

</details>

<details>
<summary>agent 报告“40 份申报文件全部处理完毕”，但有六份输出缺失。你要改什么？</summary>

“完成”来自模型，而不是证据。代码应当只在输出存在并通过检查时才把步骤标为完成，并在汇报之前把步骤和产物核对一遍；一份无法读取的申报文件要变成一个测试。

</details>

## 延伸阅读

- 文章：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)（Anthropic，约 10 分钟）
- 参考：[State: The Session's Scratchpad](https://adk.dev/sessions/state/)（Google ADK，约 15 分钟）

## 相关页面

- [Agent 状态与记忆类型](./01-state-and-memory-types.md)
- [持久化模式（工作区、landing pad、journal）](./08-persistence-patterns.md)
- [持久化执行（检查点、重放、恢复）](../17-persistent-agents/02-durable-execution.md)
- [对话 thread 与会话](./03-conversation-state.md)
- [Agent 系统中的并发与过期状态](../17-persistent-agents/06-concurrency-and-stale-state.md)
