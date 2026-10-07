---
title: 技术债与架构变更故事
row: M8-L2.4
---
**一句话：** 每个候选人都应能解释自己项目里的一条真实技术债和一次真实架构变更——它是什么、为什么接受或做出、代价是什么、学到了什么——因为这两个故事证明项目是真的，而且做决策的人是你。

## 是什么

技术债故事描述你有意采取（或继承）的一条捷径及其后果：客户新增区域时崩掉的硬编码映射、试点期间够用的单线程摄取、只覆盖英文工单的 eval 集。架构变更故事描述你在证据面前逆转或升级的一个决策：错误分析后从纯向量检索改为混合检索、trace 显示循环后把单 agent 拆成 workflow、一次险情后加入审批门。两者都应作为 ADR 或 changelog 条目存在于你的 capstone 中。

## FDE 为什么需要

Hiring manager 和技术面试官用这两个问题来检测项目是否真是你的、是否碰到过现实。从没遇到技术债、从没改变形态的项目，要么没在真实输入上跑过，要么不是讲故事的人做的。FDE 还要不断向客户解释技术债（"这在你当前的量上没问题；到这个规模就不行了"），所以不带防御性地描述一条捷径本身就是工作的一部分。

## 核心概念

### 技术债故事的结构

1. 捷径是什么，一句话。
2. 当时为什么是对的选择（appetite、风险、当时不知道的事）。
3. 后来具体付出了什么代价。
4. 你做了什么，或者你打算什么时候做什么。

### 架构变更故事的结构

1. 原始决策及其理由（最好有 ADR）。
2. 改变你想法的证据（一个 eval 数字、一条 trace、一次试点失败、一个客户约束）。
3. 新决策以及它换掉了什么。
4. 你如何在不弄坏试点的情况下迁移。

### 把它写成 ADR

Architecture Decision Record 记录当时的上下文、决策和后果。一个有三份 ADR 和一份 changelog 的项目，等于提前写好了面试故事。在项目进行中写，不要在面试前补；日期很重要。

### 语气

既不忏悔，也不防御。技术债是选择 appetite 的正常结果；能力在于知道你接受了什么、什么时候到期。

## 常见误区

- **"我应该把技术债藏起来。"** 面试官默认每个真实项目都有技术债。没有技术债故事的候选人会被认为没有真实项目。
- **"架构变更说明第一版设计错了。"** 它说明第一版设计遇到了证据。变更本身是 eval 循环在工作的证明。
- **"从头重写也算架构变更。"** 除非你能说出支持重写的证据和保留了什么，否则它算警示信号。

## 典型面试题

<details>
<summary>讲讲你项目里的一条技术债。</summary>

"医生匹配步骤用了一套手写规则做姓名归一化。对试点来说是对的：两个州、9,000 行、每次合并都有人审。客户新增五个州后，误合并率从不到 1% 升到约 4%。我用概率匹配器替换了规则，低置信度的配对保留人工审核；原来的规则集仍在 feature flag 后面服务最初两个州，直到新匹配器的 eval 覆盖它们。"

</details>

<details>
<summary>你改过什么架构决策，为什么？</summary>

给出原始决策、证据、新决策和取舍。"纯向量检索漏掉了依赖精确条款编号的政策问题。对 30 个失败做错误分析，19 个是关键词未命中。改为带 reciprocal-rank fusion 的混合检索后，eval 集上 groundedness 从 78% 升到 91%；代价是多了一个需要保持新鲜的索引。"

</details>

<details>
<summary>系统里现在还有什么技术债？</summary>

说一条、它的触发条件和计划。"摄取是单进程的；每晚要 40 分钟。文档量到当前五倍左右时会成问题。计划是带 worker 的队列，触发条件是摄取窗口超过两小时。"

</details>

## 延伸阅读

- 参考：[Architecture Decision Records](https://adr.github.io/) — context、decision、consequences 模板
- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic）— 应当驱动架构变更的证据
- 文章：[A postmortem of three recent issues](https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues)（Anthropic）— 不带防御性地解释什么坏了的公开范例
- 章节：[Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/)（Google SRE）

## 相关页面

- [端到端 AI 系统设计](./02-end-to-end-ai-system-design.md)
- [Case Study 结构](../01-portfolio-case-study-resume/01-case-study-structure.md)
- [STAR 与项目深挖](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
