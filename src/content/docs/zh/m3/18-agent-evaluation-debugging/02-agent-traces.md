---
title: Agent trace（步骤、工具调用、交接、状态变化）
row: M3-L6.2
---
**一句话：** agent trace 是一个任务跨多个 agent 和 worker 的逐步记录：包含每一次模型调用、工具调用、交接和状态变化，附带输入、输出、错误、耗时和 token，全部归在同一个 trace ID 下。

## 是什么

最终答案展示的是 agent 系统产出了什么；trace 展示的是它怎么做到的：哪个 agent 用哪些工具做了什么，又改变了什么。

打个比方，带分段计时的接力赛录像：它能显示是哪位选手慢了，还是接力棒掉了；而最终成绩做不到这一点。

准确地说，trace 是一棵由 span 组成的树，span 就是一个工作单元：每个 span 都带有 ID（自己的、父级的、所属 trace 的）、耗时、属性（命名字段）和状态。根节点覆盖整个任务，子节点是各个 agent 的运行，再下一层是它们的模型调用、工具调用、交接和状态变化。Anthropic 的评测指南把这种记录称为对话记录（transcript），“也叫 trace 或轨迹”。

## FDE 为什么需要

一家旅行公司的 planner agent 把行程交给 flight agent 和 hotel agent，它们运行在不同的 worker 上。有些行程在没订到酒店的情况下就被确认了。每个 worker 只用自己的 ID 记录最终输出，交接没有留下任何记录，结果三个团队花了一周时间改写提示词。

FDE 让每个行程对应一个 trace，随每条队列消息一起传递，并为每次 agent 运行、工具调用、交接 payload 和记录变更建立 span。看了第一个失败的 trace 就水落石出：planner 发出的 `04/03` 指的是 3 月 4 日，hotel agent 却读成了 4 月 3 日，查不到空房，仍然报告 `done`。（示例场景。）

## 核心概念

### 每一步记录什么

| 步骤 | 记录内容 |
|---|---|
| Agent 运行 | profile 和 Skill 的版本、输入、输出 |
| 模型调用 | [单次调用记录](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md)：模型、token（用于核算成本）、停止原因 |
| 工具调用 | 参数、结果或错误（[工具 trace](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)） |
| 交接 | 发送方、接收方、payload、[agent 契约](../15-agent-architectures/07-handoffs-and-agent-contracts.md)校验 |
| 状态变化 | 什么东西在哪里变了，旧值和新值 |
| 失败 | 错误类型、重试、触及的上限 |

### 跨 agent 和 worker 的同一个 trace

在同一个进程内，span 会自动嵌套。跨越队列或服务时，trace 上下文（trace ID 和父 span ID）必须随工作一起传递（上下文传播，context propagation），否则每个 worker 都会开出一个孤立的 trace。几天之后才恢复的工作，比如在[审批](../17-persistent-agents/07-durable-human-approval.md)之后，可以另起一个相互关联的 trace。出问题的那个行程：

```text
trace 9f2a61  task TRIP-5530                        48s  23k tokens
  agent planner v4
    handoff  planner -> hotel  {"check_in": "04/03", "nights": 2}
  agent hotel v2  (worker-7, 经队列)
    tool   search_rooms(city="Madrid", check_in="2026-04-03") -> 0 rooms
    state  task.hotel: pending -> done  (无预订 ID)
  agent planner v4
    state  trip.status: planning -> confirmed
```

### 约定与工具

OpenTelemetry 的生成式 AI 语义约定（状态：Development）定义了这样一些 span 名称：`invoke_workflow`（一个多 agent 流程）、`invoke_agent`、`chat`（一次模型调用）、`execute_tool` 和 `update_memory`，但没有定义交接 span。Google 的 ADK 实现了这套约定；Microsoft Agent Framework 同样使用 OpenTelemetry。OpenAI Agents SDK 默认开启追踪，交接也包含在内；`group_id` 把同一场对话的多个 trace 关联起来。Langfuse、LangSmith 和 Arize Phoenix 可以展示 trace；仪表盘见模块四。

### 抽样、留存与脱敏

- **抽样：** 试点期间保留每一个 trace。规模上去之后，尾部抽样（tail sampling，在 trace 结束后再决定）可以保留所有失败和一部分成功；头部抽样（head sampling，一开始就决定）做不到。
- **留存：** trace 会复制客户数据；要约定它们保存多久、谁能查看。启用 Zero Data Retention 时，OpenAI Agents SDK 的追踪不可用。
- **脱敏：** OpenTelemetry 的埋点默认不应捕获提示词、输出或工具参数；OpenAI Agents SDK 则会捕获，除非把 `trace_include_sensitive_data` 设为 `False`（[掩码](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)）。

### Trace、任务与评测

给每个根 span 打上任务 ID 和各项版本（profile、Skill、提示词、模型）的标签；把 trace ID 和每个[评测结果](./01-agent-evaluation.md)、每个失败用例存在一起，这样一个失败的分数就能展开成它的各个步骤，用于[失败归因](./03-failure-attribution.md)和[可重放测试](./06-replayable-tests.md)。

## 常见误区

- **“我们的日志里已经什么都有了。”** 没有共享的 ID，各个 worker 的日志就无法拼成一次完整的运行，而且很少记录交接或状态变化。
- **“SDK 的追踪覆盖整个运行过程。”** 它只看得到自己的 runner；经过队列的环节和你对记录的更新，通常需要传播上下文和自定义 span。
- **“先全部记下来，以防万一。”** trace 里包含提示词和客户记录：元数据始终记录，内容按策略记录，并限定留存时间。
- **“追踪可以等到生产环境再说。”** 从第一次测试运行起，trace 就能说明一个评测任务为什么失败。

## 典型面试题

<details>
<summary>什么是 agent trace？</summary>

一个任务在同一个 trace ID 下的一棵 span 树：各次 agent 运行包含模型调用、工具调用、交接和状态变化，每一项都带有耗时、状态，以及经过脱敏的输入和输出。

</details>

<details>
<summary>trace 和日志有什么区别？</summary>

一行日志只记录一个事件；trace 通过 trace ID 和父 ID 把一次运行里的各个事件串起来，显示先后顺序、嵌套关系，以及是哪个 agent 或 worker 做的。

</details>

<details>
<summary>任务经过多个队列 worker 时，你怎样保证一个任务只对应一个 trace？</summary>

在任务创建时就开出根 span，并把它的 trace 上下文和任务 ID 放进每条队列消息，这样每个 worker 的 span 都会并入同一个 trace。

</details>

<details>
<summary>安全团队因为涉及客户数据，要求关闭追踪。你会提议怎么做？</summary>

调整记录什么，而不是记不记：元数据始终记录，内容做掩码或放进受限的短留存存储，失败的 trace 靠尾部抽样保留，同时核对供应商的默认设置，这一切都要和对方的隐私负责人商定。

</details>

## 延伸阅读

- 文章：[Inside the LLM Call: GenAI Observability with OpenTelemetry](https://opentelemetry.io/blog/2026/genai-observability/)（OpenTelemetry，约 5 分钟）
- 参考：[Tracing](https://openai.github.io/openai-agents-python/tracing/)（OpenAI Agents SDK，约 10 分钟）

## 相关页面

- [工具调用循环与工具 trace](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [程序化 LLM 接口（输入、输出、错误、重试、日志）](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Agent 系统中的失败归因](./03-failure-attribution.md)
- [完整的请求生命周期](../../m1/02-how-web-apps-run/11-full-request-lifecycle.md)
- [交接与 agent 契约](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
