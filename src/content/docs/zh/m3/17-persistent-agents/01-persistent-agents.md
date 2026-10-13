---
title: 持久型 agent
row: M3-L5.1
---
**一句话：** 持久型 agent（persistent agent）是任务比一次请求、一个进程活得更久的 agent：工作进入队列，每一步之后都保存进度，任务可以等上几天，也可以扛过崩溃或部署，然后接着做。

## 是什么

聊天请求与一次连接同生共死：用户提问，模型回答，之后没有任何东西继续运行。而一个替客户收集文件的 agent 可能要花上几天：它要等人，要等外部事件，还必须扛得住崩溃和部署（部署即发布新版本的代码，会让进程重启）。

打个比方，家装翻新：施工队会换人，瓷砖在订货期间工程也会暂停，但没人会从头再来，因为施工档案写明了哪些已经做完、接下来做什么。

准确地说，持久型 agent 把任务（带有 ID、状态和进度的存储记录）与运行它的 worker 进程分开，所以任何 worker 都能接着做，而处于等待中的任务不占用任何 worker。

## FDE 为什么需要

一家银行的合规团队把文件更新 agent 做成了聊天助手的样子：分析师输入“更新 Harbor Foods”，由一个服务器进程跑完整个任务，每小时轮询邮箱收取客户的股权文件，然后等审批人点头同意。每周两次的部署会杀掉所有循环，而进度又没存在别处，结果 31 个更新任务在“等待文件”状态上一停就是好几周，有的已经逾期，却没有任何进程在运行。

FDE 把每个更新任务做成一条任务记录，每一步之后都保存。现在，一封邮件到达就会让对应的任务重新入队，审批是一个保存下来的状态，而不是一个循环，还有一份报告会标出闲置超过五天的任务。在预发布环境里，她在某一步进行到一半时杀掉了一个 worker，另一个 worker 把任务做完了。（示例场景。）

## 核心概念

### 聊天请求与持久任务

| | 聊天请求 | 持久任务 |
|---|---|---|
| 存活时间 | 几秒，一次连接 | 几分钟到几天 |
| 调用方得到 | 答案 | 一个任务 ID，之后是状态更新 |
| 进度存放在 | 进程内存 | 任务记录，每一步保存 |
| 等待期间 | 阻塞或超时 | 保存下来的状态，不占用进程 |
| 崩溃或部署 | 工作丢失 | 在任何 worker 上恢复 |

当任务的寿命超过一次请求、要等人或等事件、无人值守地运行，或者要依次更新多个系统时，就应该把它持久化；简短的提问则不需要。

### 组成部分

- **队列：** 存放新任务和事件（一条回复、一次审批、一个定时器），等空闲的 worker 来取（[基础知识](../../m1/06-reliability-scale/02-queues-and-workers.md)、[agent 方面的细节](./03-agent-task-queues-and-workers.md)）。
- **worker：** 可互换的进程，运行任务的下一步，然后放手；其中任何一个都可能挂掉。
- **存储的状态与检查点：** 数据库里的[任务记录](../16-agent-state-memory/04-task-state.md)，每一步之后保存，所以恢复时最多只需重做尚未完成的那一步（[持久化执行](./02-durable-execution.md)）。
- **暂停与恢复：** 一个等待状态，加上唤醒任务的事件（[审批暂停](./07-durable-human-approval.md)）。

持久化还会带来一些风险，后面会讲到：[失控的运行](./04-bounded-execution.md)、[重复的副作用](./05-duplicate-execution.md)，以及[同一个任务上的两次运行](./06-concurrency-and-stale-state.md)。

### 能保存进度的运行时

你很少需要从零开始做持久化。开源的 LangGraph 通过它的 Postgres checkpointer，在每一步保存图状态；Temporal 会把崩溃的 workflow 交给另一个进程，由它“从停下的地方继续”。托管方案（比如 Anthropic 的 Claude Managed Agents，测试版）会把会话历史保存在供应商那里，要对照客户的数据规定检查这一点。无论用哪种运行时，都要在任务执行到一半时杀掉一个 worker，看任务能否恢复（[恢复测试](./08-recovery-testing.md)）。

## 常见误区

- **“持久型 agent 就是会记住用户的 agent。”** 那是[记忆](../16-agent-state-memory/05-long-term-and-user-memory.md)。持久化指的是未完成的工作能保留下来；两者互不依赖，一个 agent 可以只有其中之一。
- **“持久型 agent 是一个永不停止的进程。”** worker 可以随时丢弃，等待中的任务也不运行任何东西，留下来的只有任务记录。
- **“演示之后再加持久化也不迟。”** 它会改变接口（返回任务 ID，而不是答案）、步骤的边界和每一个副作用，所以要在早期就设计进去。

## 典型面试题

<details>
<summary>什么是持久型 agent？它和聊天助手有什么区别？</summary>

它是任务比一次请求、一个进程活得更久的 agent。聊天请求在一次连接上给出答案，并随连接一起结束；持久任务则返回一个 ID，保存每一步，等待时不占用进程，并能在任何 worker 上恢复。

</details>

<details>
<summary>在 agent 里，持久化和长期记忆有什么区别？</summary>

记忆是 agent 跨会话知道的东西；持久化说的是未完成的工作能否保留下来。客服助手可以记得某位客户，却在重启时丢掉做到一半的退款；夜间批处理 agent 可以有持久化，却没有任何用户记忆。

</details>

<details>
<summary>你会怎么设计一个通宵审查 300 份合同、并把有风险的送交法务的 agent？</summary>

请求创建一个批处理任务并返回它的 ID。每份合同是一个排队的子任务，有自己的记录；worker 按合同保存审查结果，把有风险的合同挂起，等法务审核。被杀掉的 worker 最多丢掉一步。

</details>

<details>
<summary>每次部署之后，总有几个 agent 任务永远停在“进行中”。你会查什么？</summary>

查被部署杀掉的 worker 是否还留着对这些任务的认领，或者等待是不是做成了进程内的循环。我会每一步都保存状态，让过期的认领作废，好让另一个 worker 接手，并对闲置任务设置告警。

</details>

## 延伸阅读

- 文章：[Launch/Pause/Resume with simple APIs](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-06-launch-pause-resume.md)（HumanLayer，12-Factor Agents，约 3 分钟）
- 参考：[Understanding Temporal](https://docs.temporal.io/evaluate/understanding-temporal)（Temporal documentation，约 10 分钟）

## 相关页面

- [队列与 worker](../../m1/06-reliability-scale/02-queues-and-workers.md)
- [持久化执行（检查点、重放、恢复）](./02-durable-execution.md)
- [Agent 任务队列与 worker](./03-agent-task-queues-and-workers.md)
- [上下文与持久化存储](../16-agent-state-memory/02-context-vs-durable-persistence.md)
- [暂停 agent 等待人工审批](./07-durable-human-approval.md)
