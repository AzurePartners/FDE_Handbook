---
title: Agent 任务队列与 worker
row: M3-L5.3
---
**一句话：** agent 任务队列把每个 agent 任务保管到 worker 完成为止；配置得当，它能让任务扛过崩溃、把反复失败的任务单独搁置、先处理紧急工作，并让模型调用的节奏与限流相匹配。

## 是什么

agent 任务可能要跑几分钟，所以发起它的请求只把任务 ID 放进队列就返回（[基础知识](../../m1/06-reliability-scale/02-queues-and-workers.md)）；独立的 worker 进程来取任务，并运行 agent。

打个比方，修车行的工单板：只有车修好了，才会把卡片归档；如果接这张卡片的师傅中途走开了，卡片过了规定的时间就会回到工单板上。

准确地说，队列以租约的方式把每条消息交给一个 worker，在计时器（可见性超时、锁或 ack 截止时间）走完之前，不让其他 worker 看到这条消息。worker 在保存好工作成果之后发送确认（acknowledgement，简称 ack），确认会把消息删除；租约过期就意味着重复投递，所以这是至少一次投递。

## FDE 为什么需要

一家软件公司的客服回复 agent 用默认设置从 Amazon SQS 拉取工单。每次运行要两到四分钟，可见性超时却只有 30 秒，于是工单在运行中途重新出现，被回复了第二次。队列一变长就加 worker，结果周一积压的任务变成了一堆限流（429）错误；每个被退回的任务都算一次接收，把本来正常的工单推过了接收次数上限，进了一个没人盯着的死信队列。紧急工单则排在一个 5,000 张工单的重新打标签任务后面。

FDE 给任务设了五分钟的租约，worker 在运行期间不断续租；按限流确定 worker 池的大小；对进入死信队列的任务设了告警；并让重新打标签任务用自己的队列。（示例场景。）

## 核心概念

### 延后确认，租约要给足

只有在结果保存之后才确认。Python 任务队列 Celery 默认“在任务执行之前就即时确认”，所以运行中途被杀掉的 worker 会丢掉它的任务；要设置 `task_acks_late = True`。

租约比运行时间短，就会让第二个 worker 去启动一个仍在进行中的任务，而默认值适合短任务：SQS 把一条消息隐藏 30 秒（最长 12 小时），Azure Service Bus 把它锁定 1 分钟（最长 5 分钟）。把租约设得适中，并在 worker 还活着的时候不断续租（SQS 的 `ChangeMessageVisibility`、Service Bus 的锁续期、Temporal 的 activity 心跳）。每一步的[检查点](./02-durable-execution.md)让重复投递的代价很小；[去重](./05-duplicate-execution.md)则让重复投递变得安全。

### 有限的重试与死信队列

每一次没有被确认的投递都会计数；超过上限（SQS 的 `maxReceiveCount`，Service Bus 的最大投递次数，默认 10）之后，任务就会被移入死信队列（DLQ）。毒丸任务（poison task）每次都会失败（比如一份文档太大，超出了上下文窗口），每次重试都会重复调用模型，所以对永久性错误要立刻送进死信队列，对暂时性错误（超时、429、5xx）则只给几次[带退避的尝试](../../m1/06-reliability-scale/03-retries-and-backoff.md)。除非你设置上限，否则 Temporal 会无限次地重试 activity。死信队列里每多一条都要告警。

### 按限流确定大小的 worker 池

限制并发模型调用数的是池的大小，而不是任务到达的速率；哪些消息值得变成一个任务，则属于[触发控制](./04-bounded-execution.md)。要根据整个账号的限流来确定池的大小：进行中的调用数等于每秒调用数乘以每次调用的秒数，所以在每分钟 120 个请求、每次调用 15 秒的情况下，大约能同时维持 30 个。token 限额可能先成为瓶颈：每分钟 400,000 个输入 token，只够 20 次各 20,000 token 的调用。worker 在领任务之前，要先在共享的限流器上等待：一个在遇到 429 后被退回的任务，仍然算作一次投递。

### 优先级

只用一个先进先出的队列，紧急工作就会排在批量任务后面。给每一类任务各设一个队列，并预留 worker 或预留一份限流额度；一个总是先清空紧急队列的共享池，可能会让批量任务一直得不到处理。Anthropic 也允许你给一个工作区的限流设上限，这样批量任务所用的 key 就无法耗尽整个组织的限额。

## 常见误区

- **“worker 一旦领到任务，就一定会做完。”** 如果采用提前确认，运行中途发生崩溃或重启，任务会悄无声息地丢失。
- **“可见性超时越长越安全。”** 它能防止重复运行，却会推迟恢复：崩溃的 worker 手里的任务会一直被隐藏，直到租约结束。
- **“worker 越多，agent 就越快。”** 超过限流之后，多出来的 worker 只会带来更多的 429；Microsoft 警告说，不设上限的自动扩缩容“只是把过载转移到了下游依赖”。

## 典型面试题

<details>
<summary>什么是确认？worker 应该在什么时候发送它？</summary>

它告诉队列任务已经完成，队列随即把任务删除。我只在结果保存之后才发送确认；如果 worker 在此之前死掉，任务会被重新投递，所以处理函数必须能容忍重复执行。

</details>

<details>
<summary>可见性超时和模型调用超时有什么区别？</summary>

调用超时限定的是对模型供应商的一次等待。可见性超时是队列在把整个任务交给另一个 worker 之前等待的时间，所以它必须比一次运行更长，或者被续期。

</details>

<details>
<summary>为紧急的实时工单和一个 50,000 张工单的重新打标签任务设计队列。</summary>

两个队列：实时工单拥有预留的 worker 和预留的一份限流额度；重新打标签用一个有上限的池。两者都采用延后确认、租约续期和会触发告警的死信队列。

</details>

<details>
<summary>限流高峰期间，有 300 个本来正常的任务进了死信队列。为什么？</summary>

worker 领走任务，撞上 429 后又把任务放回，每放回一次都算一次投递，直到触发转入死信队列的次数上限。我会把这些任务从死信队列重新投回（redrive）原队列，让领取任务必须先通过共享限流器，并在供应商宕机期间暂停消费者。

</details>

## 延伸阅读

- 文章：[Competing Consumers pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers)（Microsoft Learn，约 10 分钟）
- 文章：[Priority Queue pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue)（Microsoft Learn，约 10 分钟）
- 参考：[Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)（AWS documentation，约 6 分钟）

## 相关页面

- [队列与 worker](../../m1/06-reliability-scale/02-queues-and-workers.md)
- [限流](../../m1/03-apis-data-integration/04-rate-limits.md)
- [有界执行（预算、步数上限、触发控制）](./04-bounded-execution.md)
- [重复执行与去重](./05-duplicate-execution.md)
- [重试与退避](../../m1/06-reliability-scale/03-retries-and-backoff.md)
