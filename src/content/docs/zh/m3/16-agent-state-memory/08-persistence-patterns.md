---
title: 持久化模式（工作区、landing pad、journal）
row: M3-L4.8
---
**一句话：** 三种存储模式能让 agent 的工作在重启后保留下来：给单个任务存放工作文件的工作区，让成品等待下一步或等待人来取的 landing pad（成品中转区），以及记录每一步和每个决定的 journal（逐步记录的日志）。

## 是什么

一个长时间运行的 agent 任务会产生工作文件、交给别人的成品，以及一份记录它做过什么的历史；这三样如果都只放在进程内部，重启后就全没了。

打个比方，实验室里有三样东西：杂乱的工作台、放成品样本的出件托盘，还有一本没人会擦改的笔记本，所以同事随时可以接手。

准确地说，**工作区** 是为单个任务的工作文件提供的持久化存储。**landing pad** 是一个事先约定好的位置，检查过的产出连同一份 manifest 落在这里，manifest 是一个标记产出已完整的小文件。**journal** 是一份只追加的日志（只添加条目，从不修改），记录步骤、决定和落地事件。这些是本手册自己起的名字；工程师们的叫法是临时目录、输出文件夹或产物存储，以及事件日志或审计日志。

## FDE 为什么需要

一家银行的 know-your-customer（KYC，了解你的客户）agent 会检查每个企业客户，并为合规分析师写一份风险摘要。摘要直接写进了分析师的文件夹，其中一份在写到一半时就被签字确认了，缺了股权结构一节。批处理跑到一半崩溃后，没有任何记录显示哪些已经完成，于是重跑又生成了第二批内容不同的摘要。而且审计还在一个没人负责的临时存储桶里，发现了存放数月之久的护照扫描件。

FDE 给每个客户的审查配了一个会过期的工作区、一个最后才写 manifest 的 landing pad，以及一份记录步骤、来源和决定的 journal。在一次测试性崩溃之后，批处理从中断的地方继续，审计人员也能追溯每一个评级。（示例场景。）

## 核心概念

### 三者对照

| | 工作区 | Landing pad | Journal |
|---|---|---|---|
| 谁来读 | 这个任务本身，重启之后也一样 | 下一步、agent 或人 | 恢复代码、审计人员 |
| 保留到 | 任务关闭，外加一段宽限期 | 被取走，然后归档 | 审计留存期限届满 |

### 三者如何配合

顺序很重要，因为崩溃可能发生在任意两行之间：

```python
def land(task_id, src, pad):                  # pad 形如 landing/analysts/K-2291/
    manifest = pad / "manifest.json"
    if not manifest.exists():                 # 还没有落地
        shutil.copyfile(src, pad / src.name)  # 1. 产出文件
        tmp = pad / "manifest.tmp"
        tmp.write_text(json.dumps({"task": task_id, "file": src.name}))
        os.replace(tmp, manifest)             # 2. 最后写 manifest，且是原子操作
    journal.append(task_id, {"type": "landed", "path": str(pad)})  # 3. 记入 journal
```

读取方只根据 `manifest.json` 行动，这与 Microsoft 的 Claim Check 模式一致：写入成功之后才发布引用。[任务记录](./04-task-state.md)说明任务进行到哪一步；journal 则是它背后的历史。持久化执行（durable execution）引擎也会保存类似的步骤历史（Restate 把它叫作 journal，见[持久化执行](../17-persistent-agents/02-durable-execution.md)）。

### 命名与清理规则

- **范围与版本。** 每个路径里都带上流程和任务 ID（`work/kyc/K-2291/`），并给文件加版本号（`summary-v2.md`）。拒绝模型选定的、实际解析到工作区之外的路径，Anthropic 的文档对其 memory tool 就有这条要求。
- **只更正，不修改。** 要修正一条写错的 journal 条目，就追加一条更正，事件溯源（event sourcing）也是这么做的。
- **给每个存储指定负责人和过期时间。** Google ADK 的文档指出，已持久化的产物“会一直保留，直到被明确删除”。凡是被暂停的任务或[交接](../15-agent-architectures/07-handoffs-and-agent-contracts.md)引用的内容，绝不要删；journal 里只记录对应记录的 ID，不记个人信息：Microsoft 指出，只追加的存储与被遗忘权存在冲突。

### 从中断处恢复，而不是从头再来

重启后从头再来，会为已经完成的步骤再付一次成本，生成与人们已读过的内容不同的文字，重复执行副作用，还会丢掉已做出的决定：正如 Anthropic 在谈到自家多 agent 研究系统时所写的，“重启代价高昂，也让用户沮丧”。只重做正在执行中的那一步，并让副作用[可以安全地重复执行](../17-persistent-agents/05-duplicate-execution.md)。

## 常见误区

- **“任务失败了，重跑一遍就行。”** 只有对短小、便宜且不改动外部任何东西的任务才可以这么做；否则就依据 journal，从正在执行的那一步继续。
- **“输出文件夹里有这个文件，就说明它完成了。”** 文件在还没写完时就已经出现了。读取方要等最后写入的 manifest。
- **“工作文件只是临时的，用容器的磁盘就够了。”** 重启会[清空这块磁盘](../../m1/05-containers-deployment/02-volumes-and-persistence.md)，任务只能从头开始。

## 典型面试题

<details>
<summary>工作区、landing pad 和 journal 这三种模式分别是什么？</summary>

每个任务各有一份：存放工作文件的持久化工作区，让检查过的产出等待下一步或等待人来取的 landing pad，以及记录步骤和决定、用于恢复和审计的只追加 journal。

</details>

<details>
<summary>任务 journal 与 trace 有什么不同？</summary>

[trace](../18-agent-evaluation-debugging/02-agent-traces.md) 用来帮人调试，可以被抽样或脱敏。journal 则属于任务本身：完整、只追加，为审计而保留，重启时由代码读取。

</details>

<details>
<summary>为一个 Content Creation 流程设计持久化：调研、大纲、起草、审核、修订。</summary>

每篇文章配一个工作区，存放资料来源、大纲和草稿。Draft 把检查过的草稿连同 manifest 一起落地，Review 只从 manifest 开始工作。每一步、每个编辑决定和每次落地都记入 journal，所以重启后能从中断处继续。

</details>

<details>
<summary>重启之后，Review agent 审核了一份写了一半的草稿，哪里出了问题？</summary>

Draft 把文件直接写进了 Review 监视的文件夹，而 Review 把文件的出现当成了完成。我会让 Draft 在工作区里起草，只把检查过的文件落地并最后写 manifest，同时让 Review 只根据 manifest 行动。

</details>

## 延伸阅读

- 文章：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)（Anthropic，约 10 分钟）
- 参考：[Claim Check pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check)（Microsoft Azure Architecture Center，约 10 分钟）
- 参考：[Artifacts](https://adk.dev/artifacts/)（Google ADK，约 15 分钟）

## 相关页面

- [任务状态（计划、进度、产物）](./04-task-state.md)
- [持久化执行（检查点、重放、恢复）](../17-persistent-agents/02-durable-execution.md)
- [上下文与持久化存储](./02-context-vs-durable-persistence.md)
- [卷与持久化](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
- [Agent trace（步骤、工具调用、交接、状态变化）](../18-agent-evaluation-debugging/02-agent-traces.md)
