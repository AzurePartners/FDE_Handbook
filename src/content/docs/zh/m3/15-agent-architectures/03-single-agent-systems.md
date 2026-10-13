---
title: 单 agent 系统
row: M3-L3.3
---
**一句话：** 单 agent 系统就是一个 AI agent，带着自己的 profile、Skill 和工具，在一个循环里逐步选择下一步，直到任务完成、需要有人来处理，或者被某个限制叫停。

## 是什么

设想一位分析师从头到尾处理一个客户的问题：他有一份岗位说明，有一本只在需要时才翻开的流程手册，还有各个系统的登录权限。档案不会在几张办公桌之间传来传去。

单 agent 系统的运作方式与此相同。由一个 [agent](../13-agent-profiles/01-ai-agents.md) 负责目标、计划和答案。它的 [profile](../13-agent-profiles/02-agent-profiles.md) 定义这份工作，[Skill](../14-agent-skills/01-agent-skills.md) 把流程打包，工具则让代码可以取数据或执行操作。每一回合，模型回顾已经收集到的信息，然后选择：调用工具、加载 Skill、询问用户，或者结束。

“单”指的是由一个 agent 负责，而不是只有一次模型调用。

## FDE 为什么需要

一家财富管理公司的研究 agent 负责回答分析师的开放式问题，比如一项新关税会影响哪些持仓。它有 38 个工具，其中三个的描述都只有一句“搜索文档”，还有一个 9,000 词的提示词，里面按报告类型写满了“如果……就……”的规则。trace（逐步的运行记录）显示：它选错了搜索工具，在长时间运行中忘掉了客户的排除名单，还有一条查询被重复了 30 次。团队打算做五个 agent。

FDE 保留了一个 agent：12 个各不相同的工具，每种报告类型一个 Skill，一个负责浓缩 300 页申报文件的子 agent（subagent），以及由代码来保存排除名单、检查请求、设定回合上限，并把发给客户的备忘录扣下等待审批。评测集（固定的测试用例）通过了。（示例场景。）

## 核心概念

### 什么时候一个 agent 就是正确的设计

第一，正如 Anthropic 所说，“很难甚至不可能预测所需的步骤数”；能列出来的步骤应该放进[工作流](./01-workflows-vs-agents.md)。第二，工作之间紧密耦合，并且能放进一个上下文（模型在一次调用中看到的全部内容）：每一步都建立在前面的发现之上，比如一次分析或一份文档。Claude Code 的文档建议，当“多个阶段共享大量上下文，比如规划、实现和测试”时，就留在主 agent 上。一个 agent 也意味着只有一份 trace 需要审计。

### 它如何扩展，又如何失败

它的局限会体现在 trace 里，而不是以报错的形式出现：

| 失败 | trace 里看到什么 | 先试什么 |
|---|---|---|
| 工具混淆 | 一个看似合理但选错了的工具 | 合并相似的工具，改进[描述](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md) |
| 规则冲突 | 针对一种情况的规则破坏了另一种 | 把流程挪进 [Skill](../14-agent-skills/03-skill-decomposition.md) |
| 偏离任务 | 在长时间运行中丢掉了某个约束 | 从保存的[任务状态](../16-agent-state-memory/04-task-state.md)中重申该约束 |
| 失控的循环 | 同一个调用，毫无进展 | [回合上限](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)，然后是[预算](../17-persistent-agents/04-bounded-execution.md) |

重叠比数量更要紧。OpenAI 的指南提到，有些 agent“能顺利管理 15 个以上定义清晰、互不相同的工具，而另一些在只有不到 10 个相互重叠的工具时就已吃力”（工具目录的规模见 [Tool calling（函数调用）](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)）。Skill 比提示词文本能承载更多内容：在需要之前，只有每个 Skill 的名称和描述（Anthropic 的格式里约 100 个 token）留在上下文中。偏离会随上下文增长而加重，远在上下文窗口被填满之前就会发生（[上下文腐化](../../m2/08-prompting-context-structured-output/05-context-pollution.md)）。

### 先扩展，再加 agent

子 agent 是像工具一样被调用的帮手：它拿到全新的上下文和自己的工具，完成一项自成一体的工作，只返回最终结果。OpenAI 的 Agents SDK 提供了 `Agent.as_tool()`，用于“专家应该帮忙完成一个有边界的子任务，但不应该接管面向用户的对话”的情形，Claude Code 的子 agent 也是同样的做法。所有写操作都由主 agent 来做。永远不会变的步骤，比如校验或发布，留在 agent 外围的代码里。

## 常见误区

- **“复杂的任务需要多个 agent。”** OpenAI 的指南说要“先把单个 agent 的能力用到极致”。拆分的理由应该是需要隔离的上下文、不同的权限或并行的广度，而不只是任务难。
- **“选错工具说明工具太多。”** 相似的工具比数量多但各不相同的工具更容易让 agent 混淆；先合并那些看起来差不多的工具。
- **“一个 agent 就意味着一个巨大的提示词。”** 一份简短的 profile 加上按需加载的 Skill，就能让每次调用保持聚焦。
- **“陷入循环的 agent 需要更聪明的模型。”** 循环常常源于 agent 无法据以行动的[工具错误](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)，或者缺少明确的[完成标准](../13-agent-profiles/06-agent-success-criteria.md)。

## 典型面试题

<details>
<summary>什么是单 agent 系统？它在什么时候是正确的设计？</summary>

一个带有 profile、Skill 和工具的 agent 运行一个循环，并对答案负责。它适合步骤无法事先列出、但工作内容能放进一个上下文的开放式任务。

</details>

<details>
<summary>给 agent 一个 Skill 和给它一个子 agent 有什么区别？</summary>

Skill 把指令加载进 agent 自己的上下文，完整的历史都还在。子 agent 在全新的上下文里使用自己的工具工作，只返回一份摘要，适合体量大、自成一体的阅读任务。

</details>

<details>
<summary>一个 agent 在比较几份 50 页的合同时，从第三份起表现变差。你会改什么？</summary>

我会保留一个 agent，另加一个子 agent：每次调用读一份合同，返回一份附带条款引用的结构化摘要。主 agent 比较这些摘要并写出答案。

</details>

<details>
<summary>你的 agent 在长时间运行中会忘掉客户的排除名单。你怎么调试？</summary>

我会在 trace 里找到约束不再被遵守的那一步，检查那时的上下文大小，然后把该约束存进任务状态，把体量大的阅读工作卸出去，再补上长时间运行的评测用例。

</details>

## 延伸阅读

- 文章：[A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)（OpenAI，约 20 分钟）
- 文章：[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（Anthropic Engineering，约 15 分钟）

## 相关页面

- [AI agent](../13-agent-profiles/01-ai-agents.md)
- [工作流与 agent](./01-workflows-vs-agents.md)
- [多 agent 系统](./04-multi-agent-systems.md)
- [Tool calling（函数调用）](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)
- [Agent Skills](../14-agent-skills/01-agent-skills.md)
