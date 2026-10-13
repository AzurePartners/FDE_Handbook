---
title: 工作流与 agent
row: M3-L3.1
---
**一句话：** 工作流由代码决定运行哪些步骤、按什么顺序，模型只负责完成其中的个别步骤；agent 则由模型自己决定下一步，包括用哪个工具、何时算完成。

## 是什么

在**工作流** 中，下一步做什么由你的代码决定：步骤和顺序事先固定，模型只在其中一部分步骤里工作。在 **agent** 中则由模型决定：它在[工具调用循环](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)中读取目标和目前的结果，选出下一个动作或工具（即由你的代码代它运行的函数），并说明何时完成。

工作流像一份菜谱：步骤固定，每一步之内可以有判断（“盐适量”）。agent 像一位被告知“用冰箱里现有的东西做顿晚饭”的厨师。

按 Anthropic 的说法，工作流是“通过预定义的代码路径”来编排模型和工具，而在 agent 中，模型自己掌控流程，自己决定怎样调用工具。注意：OpenAI 的 agent 指南用“workflow”一词指业务流程本身。

## FDE 为什么需要

一家区域性保险公司的营销团队把 Content Operations 做成了一条固定的模型调用链：Research、Plan、Draft、Review。Research 汇总三次预设搜索的结果，所以遇到新话题（比如法规变更）时，草稿引用的来源单薄，或者已经过时。一家供应商建议换成一个自主的 agent，让它握有所有工具，包括 `publish_post`。

FDE 只改了一个步骤。Research 变成一个 agent 循环：模型自己选择查询词并搜索，直到简报里的每个问题都有一个最新的来源，并受步数上限约束。Plan 和 Draft 仍然是单次调用，免责声明和禁用措辞由代码检查，由编辑审批，只有代码才能发布。现在草稿引用的是最新来源，合规团队也保住了审批记录。（示例场景。）

## 核心概念

### 取舍

| | 工作流 | Agent |
|---|---|---|
| 可预测性 | 每次运行路径相同 | 每次运行路径都可能不同 |
| 测试 | 单独测每一步，再测整条路径 | 测完整任务，每个任务运行多次 |
| 成本与延迟 | 由路径决定，容易做预算 | 随模型每多走一步而增长 |

Anthropic 的总结是：工作流“为定义明确的任务提供可预测性和一致性，而当需要大规模的灵活性和由模型驱动的决策时，agent 是更好的选择”。

### 含一个智能体式步骤的工作流

多数业务流程一开始就是工作流：它们本来就是已知的步骤序列，带有签字确认和审计轨迹，用代码实现既能原样保留这些环节，又能让每一步都可以单独测试。当某一步的路径无法预先写成脚本（比如调研）时，只有这一步才变成有上限的 agent 循环。12-Factor Agents 指南指出，许多号称 AI agent 的产品其实“大部分是确定性代码，只在恰到好处的位置点缀一些 LLM 步骤”。

### Content Operations：哪些环节保持确定性

| 步骤 | 谁来决定 | 原因 |
|---|---|---|
| Research | agent 循环，设步数上限 | 下一次搜索取决于已经找到的内容 |
| Plan、Draft | 各一次模型调用 | 判断发生在步骤内部，而不是步骤的顺序上 |
| Review | 先由代码检查，再由模型 | 免责声明和禁用的说法是规则，语气才需要判断 |
| 审批 | 一位指定的编辑 | 由一个要为此负责的人签字确认 |
| 发布 | 审批通过后由代码执行 | 对外公开，难以撤回 |

审批、计算（报价中的保费来自费率系统）、发布，以及任何有书面规则可依的事项，都留在代码里；单个操作的情况见[模型判断与确定性代码](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)。

## 常见误区

- **“一个系统要么是工作流，要么是 agent。”** 很多系统是两者混合：由代码固定顺序，只有无法预先写成脚本的步骤才作为 agent 循环运行。
- **“工作流很死板，处理不了杂乱的输入。”** 固定的只是路径：步骤里的模型可以读懂杂乱的文本，而且[路由](./02-workflow-patterns.md)会把不同的输入送上不同的路径。
- **“把流程写进 agent 的提示词，效果就和工作流一样。”** 像“一定先送审”这样的规则，通常成立，但不是每次都成立。必须执行的步骤应该放进代码。
- **“我们用的是 agent SDK，所以我们做的是 agent。”** OpenAI 的 Agents SDK、LangGraph 和 Google 的 ADK 同样可以运行由代码编排的工作流。

## 典型面试题

<details>
<summary>怎么判断一个系统是工作流还是 agent？</summary>

看下一步由谁决定。如果每一条可能的路径都写在代码里，那它就是工作流，不管它调用了多少次模型。如果每个下一步动作都是模型在运行时选的，那它就是 agent。

</details>

<details>
<summary>什么是含一个智能体式步骤的工作流？</summary>

顺序由代码固定，只有路径取决于它所找到内容的那一步（比如调研）才作为有上限的 agent 循环运行。审批和发布仍然是可预测的。

</details>

<details>
<summary>在 Content Operations 流程（Research、Plan、Draft、Review、发布）中，哪些步骤保持确定性？</summary>

步骤顺序本身、Review 中的规则检查（免责声明、禁用说法、链接）、编辑的审批、发布，以及任何报出的数字，这些数字来自权威数据源（system of record）。Research 是最适合做成智能体式步骤的候选。

</details>

<details>
<summary>一个内容 agent 有时会跳过审核就发布，而且成本波动很大。你会改什么？</summary>

我会把流程从提示词挪进代码：只有审核和审批都通过之后才会执行发布，模型只在需要判断的步骤里工作。然后在同一批简报上，对比每篇文章的质量和成本。

</details>

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic，约 15 分钟）
- 参考：[Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)（OpenAI Agents SDK docs，约 5 分钟）

## 相关页面

- [AI agent](../13-agent-profiles/01-ai-agents.md)
- [工作流模式（提示词链、路由、并行化）](./02-workflow-patterns.md)
- [单 agent 系统](./03-single-agent-systems.md)
- [选择 agent 架构](./05-choosing-an-agent-architecture.md)
- [模型判断与确定性代码](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)
