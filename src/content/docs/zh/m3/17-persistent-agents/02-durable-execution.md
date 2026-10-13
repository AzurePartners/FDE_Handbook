---
title: 持久化执行（检查点、重放、恢复）
row: M3-L5.2
---
**一句话：** 持久化执行（durable execution）运行多步骤任务的方式是：每个完成的步骤及其结果都保存在进程之外，这样崩溃、重新部署或重启之后，另一个 worker 可以接着做，而不必从头开始。

## 是什么

agent 任务是一串步骤：模型调用、工具调用、等待。持久化执行在每一步之后把进度保存在进程之外，而不是放在模型的[上下文](../16-agent-state-memory/02-context-vs-durable-persistence.md)里，所以一次崩溃最多损失正在运行的那一步。

打个比方，通信对弈：一盘棋换人接手，可以靠一张棋盘的照片（检查点），也可以靠记着每一步走法的记录纸（历史），在空棋盘上按记录重走一遍。没有人会把已经走过的棋再想一遍。

准确地说，持久化运行时（工作流引擎，或带有 checkpointer 的 agent 框架）会记录每个步骤的边界，失败之后，另一个 worker 根据这些记录重建当前局面。

## FDE 为什么需要

一家保险公司把理赔受理 agent 迁到了一个持久化工作流引擎上。它的工具都作为已记录的步骤运行，但模型调用和一个维修报价 API 调用仍然留在工作流代码里。一次节点重启之后，重放把这些调用又全部重新执行了一遍。有些模型调用选中的工具与历史里记录的不一致，于是引擎因为非确定性错误让几十个理赔案件停了下来，报价供应商还收到了重复的请求。

FDE 把每个模型调用和 API 调用都挪进了已记录的步骤，并给报价请求加上幂等键。在终止测试中，已完成的步骤直接返回记录下来的结果，没有产生新的模型调用。（示例场景。）

## 核心概念

### 检查点里存什么

检查点在这项工作的[任务状态](../16-agent-state-memory/04-task-state.md)之上，再加上一个全新进程所需的内容：当前位置（下一步、循环计数器）、已完成的结果或指向结果的指针、进行中的工作（待处理的工具调用、审批、消息），以及工作流、提示词和模型的版本。Microsoft Agent Framework 在每个超步（superstep）之后保存执行器（executor）的状态、待处理的消息、待处理的请求与响应，以及共享状态。Microsoft 把检查点存储称为“信任边界”：要像对待生产数据一样保护它。

### 恢复还是重放

| | 从保存的状态恢复 | 重放记录的历史 |
|---|---|---|
| 保存的内容 | 每一步之后的状态快照 | 已完成步骤及其结果的日志 |
| 恢复方式 | 加载最新的快照，运行下一步 | 重新运行代码，复用记录下来的结果 |
| 规则 | 新代码必须能读懂旧状态 | 代码必须是确定性的 |
| 例子 | LangGraph 的 graph、Microsoft Agent Framework | Temporal、Azure Durable Functions、LangGraph Functional API |

重放会把代码请求的每一步与历史逐一比对，所以 Temporal 的文档把“LLM/AI 调用”放在 Activity（已记录的步骤）里；对不上就会抛出非确定性错误。历史有上限（Temporal：51,200 个事件或 50 MB）；Continue-As-New 会把状态带入一份全新的历史。

### 把模型调用和工具调用作为已记录的步骤

模型调用速度慢、要付费，而且是非确定性的；许多工具调用会改动其他系统。所以持久化的设计把每次调用都记录为一个步骤，恢复时返回它保存下来的结果。Temporal 的 OpenAI Agents SDK 集成把模型调用作为 Activity 运行；Google ADK 的 Resume 只重新运行被中断的那一次工具调用。已经动了手、却在结果保存之前崩溃的步骤，仍然会再运行一遍（[重复执行与去重](./05-duplicate-execution.md)）。

### 多久做一次检查点

间隔决定了一次崩溃最多会丢多少工作。LangGraph 的几种保存模式（durability modes）体现了这种取舍：`"exit"` 只在运行结束时保存（最快，但运行中途无法恢复），`"async"` 在下一步运行的同时保存（有小概率丢失检查点），`"sync"` 在下一步开始之前保存。对 agent 来说，要在每次模型调用、工具调用和审批之后都做检查点；一次写入的代价远低于重复一次模型调用。

## 常见误区

- **“有了重试，我们的 agent 就已经是持久化的了。”** 重试是在一个还活着的进程里重复一次调用；进程一旦死掉，循环和它的进度也随之消失。
- **“重放就是每个模型调用都再跑一遍。”** 基于历史的引擎会为已完成的步骤返回记录下来的结果。（LangGraph 的 time-travel 重放则会有意重新运行后面的节点。）
- **“运行还在进行时，我们可以直接部署新的工作流代码。”** 被重放的运行必须以相同的顺序请求相同的步骤：要给这次改动做版本管理（Temporal 提供 patching 和 worker versioning），或者让旧的运行在旧代码上跑完。

## 典型面试题

<details>
<summary>什么是持久化执行？检查点里要放什么？</summary>

在每一步把进度保存在进程之外，这样崩溃之后另一个 worker 可以接着做。检查点里放当前位置、已完成的结果、进行中的工作（比如待处理的审批）以及版本信息。

</details>

<details>
<summary>从检查点恢复和重放历史有什么区别？</summary>

恢复是加载最新保存的状态，运行下一步（LangGraph 的 graph）。重放是对照已完成步骤的日志重新运行代码，复用记录下来的结果（Temporal），所以代码必须是确定性的。

</details>

<details>
<summary>对一个依次经过调研、大纲、起草、审核、修订五个步骤的 agent，你会在哪里做检查点？</summary>

在每次模型调用、工具调用和审批之后，同步写入数据库，草稿按引用存放，这样审核阶段的崩溃既不会重新运行调研，也不会改动已批准的大纲。

</details>

<details>
<summary>一次宕机之后，恢复的运行花了双倍的钱，有些大纲还变了。你会查什么？</summary>

查模型调用是否在已记录的步骤之外运行，或者检查点是否只在退出时才保存：不管是哪种情况，恢复时都会重新问一遍模型。我会把每次调用都做成一个步骤，同步做检查点，并加一个终止后恢复的测试。

</details>

## 延伸阅读

- 文章：[OpenAI Agents SDK Integration for Temporal](https://github.com/temporalio/sdk-python/tree/main/temporalio/contrib/openai_agents)（Temporal on GitHub，“Background Concepts”一节，约 8 分钟）
- 参考：[Durable orchestrations](https://learn.microsoft.com/en-us/azure/durable-task/common/durable-task-orchestrations)（Microsoft Learn，约 15 分钟）
- 参考：[Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers)（LangChain docs，约 25 分钟）

## 相关页面

- [持久型 agent](./01-persistent-agents.md)
- [任务状态（计划、进度、产物）](../16-agent-state-memory/04-task-state.md)
- [重复执行与去重](./05-duplicate-execution.md)
- [恢复测试（故障注入）](./08-recovery-testing.md)
- [持久化模式（工作区、landing pad、journal）](../16-agent-state-memory/08-persistence-patterns.md)
