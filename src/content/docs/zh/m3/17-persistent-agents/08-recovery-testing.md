---
title: 恢复测试（故障注入）
row: M3-L5.8
---
**一句话：** 恢复测试，就是在任务进行到一半时故意弄坏一个持久型 agent（persistent agent），比如终止它的 worker、丢掉一次模型回复、把一条消息投递两次，再检查它是否从正确的步骤继续，并且没有任何东西被重复发送、重复支付或重复更新。

## 是什么

[持久型 agent](./01-persistent-agents.md) 应该扛得住崩溃、部署和丢失的消息。恢复测试通过故意弄坏真实任务，来证明你的 agent 做到了这一点。

打个比方，消防演习：平面图上标出的出口说明不了什么，要等有人按响火警铃、在楼外清点人数，才算数。

准确地说，故障注入（failure injection，也称 fault injection）是在某一个点上引入一个已知的故障，并且事先写好预期结果。Microsoft 的工程手册把它称为“测试某一个条件的具体方法”，不同于混沌工程（chaos engineering），后者是“一种产生新信息的实践”。同样的演练适用于任何会保存任务状态的运行时，比如 LangGraph 或 Temporal。

## FDE 为什么需要

一家财富管理公司的金融研究 agent 要花两天时间生成季度客户回顾，最后经过合规审批，发布到客户门户。供应商此前靠重启一个空闲的 worker，就“演示了恢复”。试点期间，一次部署在步骤中途终止了 worker：一份回顾从头重新开始（上线的是内存型 checkpointer），另一份被发布了两次。还有一个审批整个周末无人答复，对应的任务就这样悄无声息地一直等着。

FDE 暂停了试点，建了一张失败矩阵，这张矩阵还发现了步数预算在重启时被重置的问题。修复之后，通过这张矩阵成了上线标准。（示例场景。）

## 核心概念

### 要注入的失败

| 失败 | 如何触发 |
|---|---|
| 在步骤中途终止 worker | 对其进程执行 `kill -9`，或强制停止其容器 |
| 在工具调用期间重启 | 分别在调用之前、调用期间，以及调用之后但结果保存之前让它崩溃 |
| 丢掉一次模型响应 | 让调用超时或挂起 |
| 让审批超时 | 用模拟时钟，或跳过时间的测试模式（Temporal 就有一个） |
| 把一条消息投递两次 | 把同一条消息入队两次，或让锁在运行中途过期 |

要用硬终止：SIGKILL“无法被捕获、阻塞或忽略”（Python 文档），和崩溃一样。部署同样会终止进程：Kubernetes 先发 SIGTERM，宽限期（默认 30 秒）过后再发 SIGKILL，仍在运行的步骤都会被终止。Anthropic 的 Python SDK 默认会对超时和 5xx 错误重试两次，所以要连续丢掉三次回复。

### 可以瞄准的崩溃点

随机终止很少能命中“先行动、后记录”之间的空档，所以要加上可由测试启用的崩溃点：

```python
def crash_point(name):                        # 除非测试启用，否则什么也不做
    if os.environ.get("CRASH_AT") == name:
        os.kill(os.getpid(), signal.SIGKILL)  # 像真实崩溃一样退出

portal.publish(review, idempotency_key=f"{task.id}:publish")
crash_point("after_publish")                  # 已执行，尚未记录
store.complete_step(task.id, "publish")

def test_crash_after_publish(start_worker, portal, store):
    task = store.create_task("review:ACME-Q3")
    start_worker(env={"CRASH_AT": "after_publish"}).wait()
    start_worker().wait()                     # 由一个全新的进程接着执行
    assert store.get(task.id).status == "done"
    assert portal.count(ref=task.id) == 1
```

使用录制好的模型回复（[Agent 工作流的可重放测试](../18-agent-evaluation-debugging/06-replayable-tests.md)），让变化的只有失败本身。

### 事后要检查什么

- **恢复的步骤正确：** 任务从被中断的那一步继续，而不是从头开始。
- **没有重复的副作用：** 在沙箱目标系统里统计邮件、记录或付款的数量，而不是看被终止的 worker 没来得及写完的日志（[去重](./05-duplicate-execution.md)）。
- **状态与 journal（逐步记录的日志）一致：** 任务记录、[journal](../16-agent-state-memory/08-persistence-patterns.md) 和目标系统逐步讲述的是同一个故事。
- **预算依然有效：** 崩溃之前的用量仍然计入，每次都崩溃的任务最终会进入[死信队列](./03-agent-task-queues-and-workers.md)。

### 何时运行，以及留下什么证据

试点之前，要在预发布环境里跑这张矩阵；对运行时做了任何变更（框架、checkpointer、队列、部署或新工具）之后，也要再跑一遍。把每条结果（注入点、预期结果与实际结果的对比、trace ID、版本）归档到交付资料包里，方便客户自己重跑。

## 常见误区

- **“我们的框架会给每一步做检查点，所以恢复自然没问题。”** 比如 LangGraph 的内存型 checkpointer，重启后就会丢掉一切。只有真的杀掉进程，才能证明恢复可行。
- **“我们重启了 worker，它接着干下去了，所以恢复已经测过了。”** 真实的崩溃发生在步骤中途，而不是任务之间，所以要把硬终止瞄准“行动之后、记录之前”这个空档。
- **“任务完成了，说明恢复成功了。”** 它可能已经发布了两次，或者超支了；还要检查目标系统、journal 和预算。

## 典型面试题

<details>
<summary>持久型 agent 的恢复测试是什么？</summary>

在真实任务的某个选定点注入一个已知的故障，比如终止 worker，然后对照预期结果，检查恢复的步骤、副作用、journal 和预算。

</details>

<details>
<summary>故障注入测试与混沌工程有什么区别？</summary>

故障注入测试的是一个已知的条件，结果可以预测，通常在预发布环境里做。混沌工程是做实验，常常在生产环境里做，目的是找出没人预料到的弱点。试点需要的是前者。

</details>

<details>
<summary>对一个先等 48 小时审批、再给供应商发邮件的 agent，你会怎么做恢复测试？</summary>

在发送前后对 worker 发 SIGKILL，丢掉模型回复，直到超出 SDK 的重试次数，用跳过时间的时钟让审批过期，并把请求入队两次。通过的标准：只发出一封邮件，恢复的步骤正确，预算用量延续下来。

</details>

<details>
<summary>崩溃测试之后，journal 里只记录了一次发布，但门户上显示了两次。发生了什么？</summary>

worker 在发布之后、记录之前死掉了，所以恢复后的那一步又发布了一次。我会加上“任务 + 步骤”的幂等键，再重新跑那个崩溃点作为证明。

</details>

## 延伸阅读

- 文章：[Fault Injection Testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/fault-injection-testing/)（Microsoft Engineering Fundamentals Playbook，约 8 分钟）
- 参考：[Testing - Python SDK](https://docs.temporal.io/develop/python/best-practices/testing-suite)（Temporal documentation，约 10 分钟）

## 相关页面

- [持久化执行（检查点、重放、恢复）](./02-durable-execution.md)
- [重复执行与去重](./05-duplicate-execution.md)
- [测试用例类型](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [Agent 工作流的可重放测试](../18-agent-evaluation-debugging/06-replayable-tests.md)
- [持久化模式（工作区、landing pad、journal）](../16-agent-state-memory/08-persistence-patterns.md)
