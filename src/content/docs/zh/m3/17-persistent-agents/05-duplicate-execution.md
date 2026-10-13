---
title: 重复执行与去重
row: M3-L5.5
---
**一句话：** 重复执行，就是持久型 agent（persistent agent）在重试、崩溃或收到重复消息之后，把某一步再做一遍；去重则让这次重复认出第一次尝试，于是一笔退款、一封邮件或一次预订只会发生一次。

## 是什么

持久型 agent 靠重试来扛过失败，所以任何一步都可能运行两次。重复读取会浪费 token；重复的副作用（发生在 agent 之外的改动，比如发出一封邮件或转出一笔钱）则会让客户受到两次影响。

打个比方，你点了“支付”之后，付款页面卡住了。再点一次之前，你会先去账户里查有没有这个发票号对应的付款记录。agent 也需要养成同样的习惯。

准确地说，Amazon SQS 标准队列这类队列承诺至少一次投递，持久化运行时则承诺至少一次执行：不会丢任何东西，但任何东西都可能重复。“恰好一次”是一种需要你自己做出来的效果：给每条消息、每个任务和每次写入一个稳定的 ID，重复的请求就能拿到第一次的结果。

## FDE 为什么需要

一家物业管理公司的维修 agent 会根据租户邮件预订承包商。一次水管爆裂，来了两个水管工，收了两笔上门费。trace 显示，worker 在预订调用之后、保存进度之前重启了；恢复后的运行重新问了模型，模型选了另一家公司，于是工具里按参数匹配的重复检查看到的是一次新的预订。另外，一次被重试的邮件 webhook 还开出了第二张工单。

FDE 让接收环节丢弃已经见过的消息 ID；让 agent 在行动之前，用“任务 + 步骤”键保存每一个决策，并在重启后重放它；还把这个键存进预订的参考字段，以便在任何重试之前先去查询。随后的[终止 worker 测试](./08-recovery-testing.md)只产生了一次预订。（示例场景。）

## 核心概念

### 重复从哪里来

- **重复投递：** 队列或 webhook 重发了一条消息，或者[过期的租约](./03-agent-task-queues-and-workers.md)把一个正在运行的任务交给了第二个 worker。
- **超时后重试：** 写入已经成功，丢的只是响应。
- **行动后崩溃：** Temporal 描述过 worker 在“通知服务器之前一刻”崩溃，于是 activity 被重新运行。
- **恢复：** 在 interrupt 或重试之后，LangGraph 会“从函数的开头”重新运行该节点。
- **重复请求：** “你取消了没有？请取消。”带有一个新的消息 ID。

### 对任务和消息去重

把每条传入消息的来源 ID（邮件的 `Message-ID`、webhook 的事件 ID）记录在带唯一约束的列里，这样数据库就会拒绝重复项。用业务键来构造任务 ID，比如 `refund:C-7731` 里的投诉编号，这样重复的请求就能找到已有的任务。

### 每次写入都带幂等键

每次写入都带一个由任务和步骤构成的[幂等键](../../m1/06-reliability-scale/05-idempotency.md)；Temporal 建议用 run ID 加 activity ID，它“在各次重试之间保持一致，但在不同的 Workflow Execution 之间是唯一的”。由目标系统来强制执行这个键；如果它做不到，就把键存进一个可搜索的参考字段。

### 行动之前先保存决策

重新询问的模型可能做出不同的选择（据 Anthropic 所述，“相同的输入在不同的 API 调用中可能产生不同的输出”）。持久化运行时会记录并重放模型的回复（[持久化执行](./02-durable-execution.md)）；如果代码在同一步里既做决策又行动，就必须自己把决策保存下来：

```python
def act(task_id, step, decide):
    rec = decisions.get(task_id, step)
    if rec is None:
        tool, args = decide()                        # 模型调用
        rec = decisions.insert(task_id, step, tool, args, key=f"{task_id}:{step}")
    elif rec.status == "done":
        return rec.result
    elif found := target.find(rec.tool, rec.key):    # 待定：先查询
        return decisions.done(rec, found)
    result = target.run(rec.tool, rec.args, idempotency_key=rec.key)
    return decisions.done(rec, result)
```

超时或遗留的待定记录意味着结果未知，而不是失败：先查询，再用同一个键重试。如果既没有键也无法查询，就去问人，并把这一步报告为未确认（[工具结果与错误返回](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)）。

## 常见误区

- **“我们的队列或工作流引擎对每一步恰好执行一次。”** 它们承诺的是至少一次；Temporal 自己也要求 activity 是幂等的。
- **“每次调用生成一个新的 UUID，就是幂等键。”** 每次尝试都在变的键，会让每次重试看起来都是新的。
- **“崩溃之后，agent 会做出同样的决策。”** 模型的输出在不同调用之间会变化；要保存决策，并重放它。
- **“超时就说明写入失败了。”** 写入可能已经成功，丢的只是响应。先查一下。

## 典型面试题

<details>
<summary>什么是重复执行，它由什么引起？</summary>

某一步或某个副作用运行了不止一次。原因有：消息被重复投递、超时后的重试、在行动和保存之间崩溃、恢复时重跑的步骤，以及用户问了两次。

</details>

<details>
<summary>对任务去重与幂等的工具调用有什么区别？</summary>

任务去重防止重复的消息启动第二次运行；幂等键防止被重试或被恢复的步骤重复执行它的写入。运行中途的崩溃并不是重复消息，所以两者都需要。

</details>

<details>
<summary>你的 agent 的退款调用超时了，接下来会怎样？</summary>

结果未知，而不是失败，所以它会拿这一步的键去账单系统里查有没有对应的退款：查到了，就把这一步标为完成；没查到，就用同一个键重试；既没有键也无法查询，就去问人。

</details>

<details>
<summary>一次部署之后，同一个投诉产生了两笔金额不同的退款。发生了什么？</summary>

多半是 worker 在第一笔退款和保存它之间重启了，恢复后的运行重新问了模型，得到了一个新的金额。我会在行动之前用“任务 + 步骤”键保存每个决策，再重放它，并用终止 worker 测试来证明修复有效。

</details>

## 延伸阅读

- 参考：[Activity Definition: Idempotency](https://docs.temporal.io/activity-definition#idempotency)（Temporal documentation，约 5 分钟）
- 文章：[Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)（Amazon Builders' Library）
- 参考：[Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts#side-effects-called-before-interrupt-must-be-idempotent)（LangChain docs，副作用一节，约 5 分钟）

## 相关页面

- [幂等性](../../m1/06-reliability-scale/05-idempotency.md)
- [持久化执行（检查点、重放、恢复）](./02-durable-execution.md)
- [Agent 任务队列与 worker](./03-agent-task-queues-and-workers.md)
- [工具结果与错误返回](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)
- [Agent 系统中的并发与过期状态](./06-concurrency-and-stale-state.md)
