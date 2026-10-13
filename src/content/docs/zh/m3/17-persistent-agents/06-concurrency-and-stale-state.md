---
title: Agent 系统中的并发与过期状态
row: M3-L5.6
---
**一句话：** 两次 agent 运行（或一个 agent 和一个人）同时修改同一个任务或记录时，就会出现并发问题；过期状态则是依据读取之后已经变化的数据来行动。

## 是什么

持久型 agent（persistent agent）很少独占自己的数据：客户在第一条回复出来之前就发了第二条消息，定时任务会额外启动运行，并行的子 agent（subagent）共用一份任务记录，员工也在编辑同样的工单。任何两方同时修改同一份数据，就会出现重复回复，或者一次更新悄悄撤销了另一次更新（[基础知识](../../m1/06-reliability-scale/06-race-conditions.md)）。

设想两个同事共用一个收件箱，却没有办法认领一封邮件：客户收到了两份答复，其中一份还推翻了另一份的承诺。

准确地说，agent 拉大了读取状态与依据状态行动之间的间隔：一次模型调用要几秒，一次运行要几分钟，等待审批有时甚至要几天，而普通代码只需要几毫秒。MITRE 的 CWE-367 把由此产生的 bug 称为检查时到使用时（time-of-check to time-of-use，TOCTOU）竞态。记忆过期则是[另一个问题](../16-agent-state-memory/07-memory-pollution-staleness-privacy.md)。

## FDE 为什么需要

一家家庭财产险公司的理赔助手负责回复 WhatsApp 消息，每条消息都会启动一次 agent 运行。客户经常连着发三条很短的消息，于是多次运行重叠在一起：他们收到两三条回复，其中一条还在索要刚刚发过的保单号。有一次运行读取了一个理赔案件，花了 40 秒做模型调用和工具调用，然后把整条记录存了回去，结果重新打开了一个理赔员刚刚关闭的案件。

FDE 给每个对话加了租约，同一时间只让一次运行持有；把运行期间到来的消息暂存起来，供该运行在回复前读取；并让理赔案件的写入只发送变更的字段，外加读取时的版本。（示例场景。）

## 核心概念

### 每个任务或对话只允许一次活跃运行

[队列租约](./03-agent-task-queues-and-workers.md)只能防止两个 worker 取走同一条消息，防不了同一个对话的两条消息启动两次运行。要解决这个问题，就对对话 ID 或任务 ID 加租约：这是一把锁，除非在步骤之间续期，否则就会过期，所以崩溃的 worker 不可能永远占着它。Temporal 内置了这个机制：每个 ID 只有一个在运行的工作流，Signal-With-Start 会把新消息发给它，或者启动它。

陷阱在于：卡在一次缓慢的模型调用里的运行，可能比它的租约活得更久，并且在第二次运行接手之后仍然去写入。标准的解法是 fencing token：每份租约拿到一个更大的编号，写入时带上这个编号，存储会拒绝编号低于已见编号的写入。

### 版本检查与重新读取

对 agent 的每次写入都使用乐观锁：只有你读取的版本没有变化，写入才会成功。很多 API 通过 `If-Match` 请求头接收 ETag（版本标签），HTTP 就是用它来应对“丢失更新”问题的；版本不匹配时会返回 `412 Precondition Failed`。只对变更的字段打补丁。发生冲突时，重新读取并重新决策；旧的计划建立在旧的事实上。

```python
def act_on(task_id, attempts=3):
    for _ in range(attempts):
        task = store.get(task_id)            # 数据及其版本
        plan = decide(task)                  # 耗时：模型调用、只读工具
        if store.update(task_id, plan.changes, if_version=task.version):
            return plan
        # 期间被改动过：重新读取，重新决策
    return escalate(task_id, "task kept changing")
```

经过审批这类长时间暂停之后，要先重新读取这个决策所依据的内容（状态、余额、是否已有人回复过），再执行不可逆操作（[审批暂停](./07-durable-human-approval.md)）。

### 运行期间到来的消息

LangChain 的 LangSmith Deployment 把这种情况叫作“double texting”，并提供四种策略：enqueue（默认：接下来运行它）、reject、interrupt（停止，保留进度，加入新输入）和 rollback（丢弃这次运行，重新开始）。Anthropic 的 Claude Managed Agents（测试版）会把事件排在先前的事件后面，并接受 `user.interrupt`。只要在有更新的消息等待期间不发出回复，排队就适合大多数聊天场景；interrupt 只在步骤之间使用，因为在工具调用中途停下，可能留下做了一半的操作。对连发的消息做防抖，属于[有界执行](./04-bounded-execution.md)。

## 常见误区

- **“我们的 agent 一次只处理一个对话，所以并发不适用。”** 每个 worker、webhook 和定时任务都可能启动一次并行的运行，而且人也一直在编辑记录。
- **“去重能防止重复回复。”** 它防止的是同一条消息被处理两次，而不是两条不同的消息启动两次运行。
- **“带超时的锁能让各次运行互不干扰。”** 一次运行可能在缓慢的模型调用中比它的租约活得更久，并在另一次运行接手之后写入；要用 fencing token 或版本检查来保护写入。
- **“版本冲突时，重试这次写入就行。”** 这次写入带着基于旧数据做出的决策：要重新读取，再重新决策。

## 典型面试题

<details>
<summary>什么是过期状态，为什么 agent 尤其容易遇到它？</summary>

运行仍在依赖的、但已经发生变化的数据。agent 会在模型调用、长时间运行和审批期间一直持有读到的数据，所以我会对写入做版本检查，并在不可逆操作之前重新读取。

</details>

<details>
<summary>并发 bug 与重复执行 bug 有什么区别？</summary>

重复是把同一份工作再做一遍，去重和幂等键可以防止它。并发 bug 则是不同的运行或不同的人同时修改共享数据，每个键只允许一次运行，再加上版本检查，可以防止它。

</details>

<details>
<summary>三条连发的消息得到了三条 agent 回复。你会怎么重新设计？</summary>

每个对话 ID 一个租约或一个工作流，运行期间到来的消息排队等它处理。发送之前，这次运行先检查有没有更新的消息，并把它们合并进来。

</details>

<details>
<summary>agent 对 CRM 的更新抹掉了销售在运行期间做的一处修改。你会怎么修复？</summary>

trace 的时间戳通常会显示，agent 用过期的副本做的整条记录保存，是在那处修改之后才落地的。我会只对变更的字段打补丁，并带上读取时的版本，发生冲突就重新决策。

</details>

## 延伸阅读

- 参考：[Double texting](https://docs.langchain.com/langsmith/double-texting)（LangChain docs，约 5 分钟）
- 文章：[How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)（Martin Kleppmann，约 25 分钟）

## 相关页面

- [竞态条件](../../m1/06-reliability-scale/06-race-conditions.md)
- [重复执行与去重](./05-duplicate-execution.md)
- [暂停 agent 等待人工审批](./07-durable-human-approval.md)
- [任务状态（计划、进度、产物）](../16-agent-state-memory/04-task-state.md)
- [Agent 任务队列与 worker](./03-agent-task-queues-and-workers.md)
