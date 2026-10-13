---
title: 多 agent 系统
row: M3-L3.4
---
**一句话：** 多 agent 系统把一个任务拆给多个 AI agent，每个 agent 有自己的指令、上下文和工具，换来并行工作和更干净的上下文，代价是更多的 token 和更难的协调。

## 是什么

[agent](../13-agent-profiles/01-ai-agents.md) 就是一个在循环中选择下一步的模型。多 agent 系统让几个 agent 共同处理一个任务，每个 agent 有自己的 profile（岗位说明）、上下文（它能看到的全部内容）和工具。

打个比方，厨房里各个灶台的厨师分头干活，能加快出菜；但四个厨师互不交流，一起给同一口锅调味，只会把菜毁掉。

Anthropic 的定义是“多个 agent（在循环中自主使用工具的 LLM）协同工作”。除非代码把信息传过去，否则 agent 之间什么都不共享。

## FDE 为什么需要

一家薪资软件供应商用六个 agent 来响应招标文件（很长的供应商调查问卷）：由一个牵头 agent 把每份文件拆成五个部分，交给并行的撰写 agent。安全部分承诺 SSO 是标配，而定价部分却把它作为附加项出售，上线日期也前后不一致。每份回复消耗的 token 是单 agent 原型的数倍，而且没人说得清，一条有争议的陈述是哪个 agent 写的。

FDE 只把并行 agent 留给“读”的环节：三个只读的调研 agent，每个负责一个来源（产品文档、以往的答复、安全资料库），把带引用的片段存进一个共享文件。由一个撰写 agent 依据这些片段，以及销售负责人确认过的交易信息表，起草整份回复；每一步都有 trace。（示例场景。）

## 核心概念

### 三种常见形态

| 形态 | 运作方式 | 适用场景 |
|---|---|---|
| Orchestrator 与 worker | 牵头 agent 在运行时拆分任务，并合并各 worker 的结果 | 范围广的调研，每个来源一个 worker |
| 主管与专家 | 主 agent 像调用工具一样调用固定的专家，并且只有它与用户对话 | 领域各不相同，比如 CRM 和日历 |
| 对等交接 | 一个 agent 把控制权和对话交给另一个对等的 agent | 分诊：账单问题交给账单 agent |

OpenAI 把后两种分别称为 manager 模式（“agents as tools”）和去中心化模式。

### 多个 agent 真正能换来什么

- **并行的广度。** Anthropic 2025 年的 Research 系统以 Claude Opus 4 为牵头 agent、以 Claude Sonnet 4 为子 agent（subagent），在一次内部评测中比单独一个 Claude Opus 4 高出 90.2%；并行把复杂查询的调研时间最多缩短了 90%。
- **每个子任务有一份干净的上下文。** 每个子 agent 在自己的上下文里搜索，只返回要紧的内容，让牵头 agent 免受[上下文污染](../../m2/08-prompting-context-structured-output/05-context-pollution.md)。
- **每个角色有各自独立的权限。** Claude Code 给每个子 agent“特定的工具访问权限和独立权限”，所以读取不可信网页的 agent 可以不持有任何写工具，从而限制[提示词注入](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md)造成的损害。

### 它们的代价：正反两方构建者的说法

- **token。** Anthropic 测得，agent 消耗的 token 约为聊天的 4 倍，多 agent 系统约为 15 倍；它们“之所以有效，主要是因为能帮助投入足够多的 token 去解决问题”。
- **延迟。** 每经过牵头 agent 中转一次，就多一次模型调用，而牵头 agent 要等最慢的那个 worker。
- **协调失败。** Anthropic 早期的牵头 agent 会为简单的查询生成 50 个子 agent。在 Cognition 的“Don't Build Multi-Agents”（2025 年 6 月）中，子 agent 在做一个 Flappy Bird 仿制版时，做出了 Super Mario 风格的背景和一只风格不搭的鸟：“行动带有隐含的决策，而相互冲突的决策会带来糟糕的结果。”它在 2026 年 4 月的后续文章中说，一种范围更窄的模式如今行得通：agent 只贡献想法，写入则保持串行。
- **更难调试。** 糟糕的结果可能出在任何一个 agent 或任何一次交接上，所以 [agent trace](../18-agent-evaluation-debugging/02-agent-traces.md) 必须覆盖每一个 agent。

### 在哪里划算，在哪里吃力

它们的价值体现在广度上：相互独立的子任务，以及以读为主的调研。当每个部分都依赖共同的决策时，它们就吃力了，比如一份文档或一次代码改动。2025 年 12 月 Google 与 MIT 的一项研究发现，在可并行的金融推理任务上，集中式协调使结果提高了 80.9%，而在顺序规划任务上，每一种多 agent 设计都比单个 agent 差 39 到 70%。

## 常见误区

- **“同一个团队里的 agent 知道其他 agent 知道的事。”** 每个 agent 只能看到自己的上下文；发现和决策必须明确地传递出去。
- **“把一个大提示词拆给多个小 agent 能省 token。”** 每个 agent 都要重新加载指令和输入，协调还会增加调用。
- **“给每个 agent 分一节，报告就自己写成了。”** 各节共用术语、数字和承诺：并行化调研，写作只保留一个撰写 agent。

## 典型面试题

<details>
<summary>什么是多 agent 系统？它能换来什么？</summary>

几个 agent 共同处理一个任务，每个 agent 有自己的 profile、上下文和工具。它换来的是并行的广度、干净的上下文和按角色划分的权限，代价是数倍的 token 和更大的协调风险。

</details>

<details>
<summary>orchestrator 加 worker 与对等交接有什么区别？</summary>

orchestrator 拆分任务、运行 worker 并合并它们的结果，所以控制权始终集中。交接则是把控制权和对话交给一个对等的 agent，比如从分诊 agent 交给账单 agent，而且不涉及任何合并。

</details>

<details>
<summary>客户想要一份关于 40 个竞争对手的每周简报。你会用多个 agent 吗？</summary>

调研环节会用，因为各个竞争对手相互独立。名单是固定的，所以可以由代码为每个竞争对手各派出一个只读 agent，各自返回一份带引用的简短摘要。简报则由一个 agent 来写。

</details>

<details>
<summary>你的多 agent 报告有些主题重复，有些又漏掉了。最可能是哪里出了问题？</summary>

多半是牵头 agent 的委派含糊，Anthropic 早期也发现过这一点。我会在 trace 里检查牵头 agent 发出的任务消息，给每个 worker 明确各自的目标、边界和输出格式，并补一个评测用例。

</details>

## 延伸阅读

- 文章：[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)（Cognition，约 10 分钟）
- 文章：[Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working)（Cognition，2026 年的后续文章，约 10 分钟）
- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，约 20 分钟）

## 相关页面

- [单 agent 系统](./03-single-agent-systems.md)
- [选择 agent 架构](./05-choosing-an-agent-architecture.md)
- [在 agent 之间拆分工作](./06-splitting-work-across-agents.md)
- [交接与 agent 契约](./07-handoffs-and-agent-contracts.md)
- [Agent 系统中的失败归因](../18-agent-evaluation-debugging/03-failure-attribution.md)
