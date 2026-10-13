---
title: 有界执行（预算、步数上限、触发控制）
row: M3-L5.4
---
**一句话：** 有界执行是指由代码给任何 agent 任务能消耗的资源设上限（步数、token、金额和时间），终止陷入循环或停滞的任务，并决定哪些事件可以触发一次模型调用。

## 是什么

持久型 agent（persistent agent）无人值守地运行，由邮件之类的事件触发。每一步都是一次要付费的模型调用，而一个陷入混乱的 agent 会一直重试，直到它之外的某样东西喊停。

打个比方，按“封顶报价”承包的工程队：到了封顶金额就停工，并向你说明哪些已经做完、哪些还没做。

准确地说，这是由代码而不是提示词实施的控制，分三个层级：在步骤之间检查的单任务限制和循环检测器；对哪些事件可以启动运行的触发控制；以及覆盖所有任务的额度、紧急开关（kill switch）和告警。[工具调用循环](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)的回合上限是最内层。

## FDE 为什么需要

一家货运经纪公司的 agent 负责回复承运商的邮件，每封邮件触发一次运行，唯一的限制是每次运行的回合上限。某个节假日的周末，一家承运商的工单系统对 agent 发来的每封邮件都新建一张工单来确认，而 agent 又回复了每一条确认：共 900 封邮件，每次运行都没有超出它的上限。这个周末花掉了平时一个月的支出，却没人发现。

FDE 在模型之前加了过滤器，跳过 agent 自己发的邮件、机器人发的邮件，以及 `Auto-Submitted` header（RFC 3834 中标记机器发送邮件的字段）不是 `no` 的邮件；给每个邮件 thread 设了跨多次运行的预算和无进展检查；还加了按小时统计的花费告警。（示例场景。）

## 核心概念

### 单任务限制与停止

给以下几项设上限：步数（模型调用次数）、token（含子 agent（subagent）的用量）、成本（含付费工具）和运行期间的实际耗时；暂停中的任务所等待的时间有它自己的[截止时间](./07-durable-human-approval.md)。框架自带的上限覆盖的是一次运行或一个会话：Google ADK 的 `max_llm_calls` 按每次运行计数（默认 500），而 Claude Agent SDK 的 `max_turns` 和 `max_budget_usd` 默认没有限制，并且它的回合计数会随每条消息重新开始。重试和新消息都可能让这类计数重新开始，所以要把用量记录在[任务记录](../16-agent-state-memory/04-task-state.md)里。

在每一步之前检查，绝不在工具调用进行到一半时检查。到达上限时，把任务保存为 `stopped_at_limit`，把已完成的部分成果和停止原因交给人或审核队列（[升级](../13-agent-profiles/05-agent-inputs-outputs-escalation.md)），并把它标记为终态，这样队列就永远不会重试它。先发出警告，让 agent 有机会收尾（LangGraph 的 `RemainingSteps` 能让 graph 转入兜底路径；Anthropic 测试版的 task budgets 会给模型显示一个倒计时，“只是软提示，而不是硬性上限”），但真正的停止要在代码里强制执行。

### 循环与停滞

有两种检测器会在任何上限之前触发。**重复：** 同一个工具加同样的参数，或者同一个错误。Google 的 Gemini CLI 会标记连续五次相同的调用；12-Factor Agents 建议对出错的工具最多试大约三次，然后升级。**无进展：** 调用各不相同，但任务记录没有任何增长，就像 Anthropic 早期的研究 agent“在网上无休止地搜寻根本不存在的来源”。

```python
LIMITS = {"steps": 40, "tokens": 500_000, "usd": 4.0, "seconds": 1800}

def stop_reason(task):
    for name, cap in LIMITS.items():
        if task.usage[name] >= cap:
            return f"{name} limit"
    last = task.call_hashes[-3:]        # 对 (tool, args) 取哈希
    if len(last) == 3 and len(set(last)) == 1:
        return "repeated call"
    if task.steps_since_progress >= 5:
        return "no progress"
    return None
```

### 触发控制

事件的接线方式常常是每来一个事件就启动一次运行（ADK 的 Pub/Sub 触发器会为每条消息创建一个会话），所以要在模型之前先放一层廉价的代码：**过滤**，去掉 agent 自己的消息、机器人、自动回复和重复消息；**防抖**，等对话安静满一分钟，再针对所有新内容只运行一次；**批处理**，把紧急程度低的事件合并到定时运行里；并且**每个对话只允许一个活跃的运行**，新消息会并入这个运行（[如何强制做到这一点](./06-concurrency-and-stale-state.md)）。

### 额度、紧急开关与告警

按租户设置的额度，限制每个客户账号每天的 token 数或金额（[端点额度](../../m2/07-llm-application-foundations/09-adding-an-llm-endpoint.md)）。紧急开关是 worker 在每一步之前都会检查的一个标志；一旦拨动，任务就会在保存好状态之后暂停。当某个租户接近它的额度时，以及当因触及上限而停止的次数或每小时的花费突然上升时，都要告警（仪表盘见模块四）。

## 常见误区

- **“`max_tokens` 限制了一个任务的成本。”** 它限制的是一次调用；一个任务可以调用几百次。
- **“告诉 agent‘最多搜索十次’就是一种限制。”** 模型可能无视它，也可能数错；真正的限制，是代码拒绝执行下一步。
- **“对同一个工具的多次调用就说明陷入了循环。”** 批处理会用许多不同的参数调用同一个工具；要标记的是完全相同的调用，或者没有进展。

## 典型面试题

<details>
<summary>什么是有界执行？</summary>

由代码强制执行的上限：限制每个任务的步数、token、金额和时间，再加上循环与停滞检测、触发控制、按租户的额度、紧急开关和告警。

</details>

<details>
<summary>单任务预算和工具调用循环的回合上限有什么区别？</summary>

回合上限只约束一次运行里的一个循环。单任务预算则跨越每一次运行、重试和恢复，所以它的计数器存放在任务记录里。

</details>

<details>
<summary>在一个很繁忙的 Slack 频道里，你会怎样控制 agent 的触发？</summary>

在代码里做：丢弃机器人发的消息、它自己发的消息和只有 emoji 的回复；对每个 thread 防抖一分钟；每个 thread 只允许一个活跃的运行；再设一个每日 token 额度。

</details>

<details>
<summary>一个任务一夜之间花了 400 美元，却没有触及 30 步的上限。为什么？</summary>

很可能是重试或新消息让计数重新开始了，也可能是每一步都带着巨大的上下文。我会检查每次运行的 trace，把计数器放进任务记录，并加上 token 和金额的上限。

</details>

## 延伸阅读

- 文章：[Compact Errors into Context Window](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-09-compact-errors.md)（HumanLayer，12-Factor Agents，约 3 分钟）
- 参考：[How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop)（Claude Agent SDK documentation，约 20 分钟）

## 相关页面

- [工具调用循环与工具 trace](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [Agent 任务队列与 worker](./03-agent-task-queues-and-workers.md)
- [限流](../../m1/03-apis-data-integration/04-rate-limits.md)
- [Agent 级指标（任务完成率、交接、工具调用、循环、成本、延迟）](../18-agent-evaluation-debugging/04-agent-level-metrics.md)
- [为现有服务添加 LLM 端点](../../m2/07-llm-application-foundations/09-adding-an-llm-endpoint.md)
