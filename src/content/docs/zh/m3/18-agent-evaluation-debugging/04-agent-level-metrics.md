---
title: Agent 级指标（任务完成率、交接、工具调用、循环、成本、延迟）
row: M3-L6.4
---
**一句话：** agent 级指标衡量一个 agent 系统完成整个任务的表现：完成的比例有多高，交接和使用工具有多规范，陷入循环的频率有多高，以及每完成一个任务要花多少钱、多少时间。

## 是什么

[单次调用指标](../../m2/11-ai-evaluation/04-core-metrics.md)评的是模型的一次回复。agent 会做计划、调用工具，还会把工作交给其他 agent，所以一个任务可能要几十次模型调用。agent 级指标衡量的是跨多次运行的完整任务。

快递公司就是这样评价司机的：送达的包裹数、投错门的次数、绕街区兜圈的次数、每送达一个包裹的油耗，以及联系调度的次数，而不是看方向盘的每一次转动。

一次运行是对一个任务的一次尝试，会留下一个结果（最终状态通过检查了吗？）和一份[记录各个步骤的 trace](./02-agent-traces.md)。这些指标汇总的就是这两样东西。

## FDE 为什么需要

一家软件供应商的 Content Operations 工作流（Research、Plan、Draft、Review）负责撰写产品对比页。它的仪表盘显示 99% 的模型调用成功，每次约 3 美分，可市场部却说这个试点又慢又贵。

FDE 根据 trace，按任务重新计算了这些数字：40 个任务，每个跑三次。只有 55% 的运行产出了编辑接受的页面。每五次运行就有一次触到 80 步的上限，原因是 Research 反复搜索一个竞争对手从未公布过的价格。把失败的运行也算上，每个被接受的页面成本约 3 美元。FDE 让重复的搜索返回“没有新结果”，让 Research 把没找到的事实交给编辑处理，并与客户商定了按任务设定的目标。（示例场景。）

## 核心概念

### 任务完成与一致性

任务完成率是最终状态通过检查的运行所占的比例，这里的检查由 [agent 评测](./01-agent-evaluation.md)定义，比如系统里的某张工单已被解决。agent 说“完成了”什么也证明不了；要把虚报成功的情况单独统计。每次运行的结果会有波动，所以要重复运行任务，并把 pass^k（k 次运行全部通过的任务）和平均值一起报告。

### 交接与工具调用

交接正确率是指送达了正确的 agent、且携带的数据通过[契约校验](../15-agent-architectures/07-handoffs-and-agent-contracts.md)的交接所占的比例。工具调用质量把单次调用的正确性扩展到整个运行过程：选错工具、参数无效，以及多余或缺失的调用，比如没有查询就报出了价格。Microsoft Foundry 的评测器把 Tool Selection（选对了工具，没有多余调用）和 Tool Call Success（没有技术错误）分开。

### 循环、停滞与触及上限

循环是指在没有新信息的情况下重复同一步骤，比如完全相同的工具调用。停滞是指不断执行步骤，而任务状态毫无进展。触及上限率统计的是被步数、token、成本或时间上限叫停的运行（在 OpenAI Agents SDK 里是一个 `MaxTurnsExceeded` 错误）。[有界执行](../17-persistent-agents/04-bounded-execution.md)负责在一次运行内部把它们叫停；而在这里，要按 agent 和任务类型统计它们。

### 单任务的成本、延迟与人工干预

每个已完成任务的成本，是用全部开销（每个 agent、每次重试和每次失败的运行）除以已完成的任务数，所以一个更便宜却更容易失败的模型，花费反而可能更多。Kapoor et al.（2024）发现，只看准确率的基准会让 agent 变得不必要地复杂和昂贵。统计每个任务从开始到完成的耗时，看 p50 和 p95（典型值和最慢的 5%），等待人工的时间单独报告。OpenAI 的 agent 指南要求对高风险操作以及反复失败之后引入人工干预：把事先安排的审批和补救分开统计，补救是指由人来修复或完成一个失败的运行。

### 商定阈值

试点开始前，和客户为每个指标商定一个阈值，依据是该 agent 的[成功标准](../13-agent-profiles/06-agent-success-criteria.md)以及目前人工处理的成本和耗时：比如完成率 85%，pass^3 达到 70%，触及上限的运行不到 5%。所有指标都达标才能上线；仪表盘见模块四。

## 常见误区

- **“平均完成率高，说明 agent 可靠。”** 平均值可能掩盖某个总是失败的任务类型；要按类型拆开来看，并报告 pass^k。
- **“步数上限已经管住了循环，没什么可衡量的。”** 它只是限制损失，但每一次触到上限的运行，都是一个你花了钱却失败了的任务。
- **“工具调用越多，agent 越细致。”** 重复或不必要的调用，通常是困惑或循环的信号。
- **“人工干预为零才是目标。”** 对有风险的操作进行审批本来就是设计好的；要压低的是计划之外的补救。

## 典型面试题

<details>
<summary>agent 的任务完成率是什么？</summary>

最终状态通过某项约定检查的运行所占的比例，比如系统里确实记录了退款，而不是 agent 自称成功，并且要连同 pass^k 一起报告。

</details>

<details>
<summary>单次调用成本和单个已完成任务的成本有什么区别？</summary>

单次调用成本只给一次请求定价。单个已完成任务的成本，是把所有开销（包括各个 agent、重试和失败的运行）除以通过的任务数；客户会拿它和人工处理做比较。

</details>

<details>
<summary>你会为一个 Research、Draft、Review 的工作流设哪些指标？</summary>

任务完成率以编辑是否接受来判定，再加上 pass^3、有效交接、每个任务的工具调用次数、循环率和触及上限率、每篇被接受的内容的成本和 p95 耗时，以及计划之外的补救，每项指标都要有商定好的阈值。

</details>

<details>
<summary>模型升级后，完成率没变，但单任务成本翻了一倍。你会去看哪里？</summary>

看每个任务的 trace 明细：各个 agent 的 token 和调用次数、循环率和触及上限率、重试。可能是模型想得更久，或者搜索得更多；我会修复那一层，然后重跑这些任务。

</details>

## 延伸阅读

- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic，约 30 分钟）
- 参考：[Agent evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators)（Microsoft Foundry docs，约 15 分钟）
- 文章：[AI Agents That Matter](https://arxiv.org/abs/2407.01502)（Kapoor et al., 2024，约 40 分钟）

## 相关页面

- [核心评测指标（准确率、完整性、格式合规、拒答、延迟、成本）](../../m2/11-ai-evaluation/04-core-metrics.md)
- [Agent 评测（任务、环境、结果）](./01-agent-evaluation.md)
- [轨迹评测](./05-trajectory-evaluation.md)
- [有界执行（预算、步数上限、触发控制）](../17-persistent-agents/04-bounded-execution.md)
- [Agent 成功标准与完成标准](../13-agent-profiles/06-agent-success-criteria.md)
