---
title: 现场 Scoping
row: M8-L3.2
---
**一句话：** 现场 scoping 就是当场说清第一版做什么、不做什么、怎么验证、什么时候停——一份带 non-goals 的口头 PRD，把拆解后的问题变成客户能说"是"或"否"的计划。

## 是什么

澄清和拆解之后，case 轮需要一个提案。现场 scoping 是让这个提案小、有边界、可检验的纪律：第一版限定在一个用户群和一个 workflow 切片，明确列出 non-goals，给出带数字和日期的验证计划，以及一条说明什么结果会终止或转向工作的停止规则。它是 Shape Up 的 appetite 与 no-gos，加上模块五的验收标准，用五分钟口头交付。

## FDE 为什么需要

范围蔓延是 FDE 项目的死法，面试官知道，说不出"第一版不做"的候选人，也没法对 VP 说。现场 scope 还展示排序判断：哪个工作流风险最高、先证明什么、如何在客户花大钱之前拿到证据。带 non-goals 和停止规则的提案是客户真正能决策的东西；没有它们的提案只是愿望。

## 核心概念

### 口头说出的四个部分

1. **做什么：** 一个用户群、一个 workflow 切片、一个输出、端到端。"第一版为东北区 40 名经理起草改派建议；每次变更由经理批准。"
2. **不做什么：** 点名那些诱人的相邻事项。"它不会写入 SAP、不覆盖其他区域、不处理海关扣留。"
3. **验证：** 指标、baseline、数字、样本、日期。"四周内，对比建议采纳率和决策时长与当前 50 例 baseline；成功标准是采纳率高于 60% 且没有错误改派触达客户。"
4. **停或继续：** "如果两周时采纳率低于 30%，我们停下来，先重新审视数据质量假设，再建任何东西。"

### 按风险排序，不按价值

最先建的是最可能杀死项目的东西。通常是数据访问或某个集成，不是模型质量。说出为什么。

### 需求类型

功能性（做什么）、非功能性（延迟、准确率阈值、可用性）和约束（安全、数据访问、时间线）。各放各的位置；约束在 scope 谈判中不可协商。

### 现场分类新请求

面试官追加请求时，大声分类：澄清（吸收）、正式变更（说出交换：什么出 scope，或日期后移）、下一阶段工作（记录，不建）。

## 常见误区

- **"第一版越大越有说服力。"** 带真实验证计划的小第一版更有说服力，因为它说明你以前交付过。
- **"Non-goals 是消极的。"** Non-goals 是让提案可信的东西。高管记得你说过不做什么，并会注意你是否守住了。
- **"停止规则听起来像在计划失败。"** 它听起来像知道什么证据会改变你的想法，而这是 FDE 的核心特质。

## 典型面试题

<details>
<summary>第一版具体做什么？</summary>

给出"做什么"的那句话，含用户群、workflow 切片和输出。然后一口气说完 non-goals。然后是验证数字和日期。

</details>

<details>
<summary>客户想在第一版里再加三个区域。你同意吗？</summary>

归为正式变更并说出交换："可以加区域，但每个区域多一个数据负责人和一套规则；要么第一版每个区域推迟大约三周，要么保持日期、多出的区域进入第二阶段。日期和覆盖范围，哪个对你更重要？"不要无条件同意；也不要不给选项地拒绝。

</details>

<details>
<summary>两周后你怎么知道该不该继续？</summary>

说出领先指标（建议采纳率、数据完整度、集成成功率）、阈值，以及在阈值两侧各会做什么。停止规则要早检查，不是最后才看。

</details>

## 延伸阅读

- 书：[Shape Up](https://basecamp.com/shapeup)（Basecamp，免费）— appetite、boundaries、no-gos、scope hammering
- 参考：[Product requirements guide](https://www.atlassian.com/agile/product-management/requirements)（Atlassian）— 含 non-goals 的 PRD 结构
- 参考：[Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success)（Claude docs）— AI 输出的可衡量验收标准
- 文章：[Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/)（Agility at Scale）— go/no-go 阈值与 baseline

## 相关页面

- [模糊问题澄清](./01-ambiguous-problem-clarification.md)
- [MVP 优先的设计演进](../02-coding-debugging-system-design/03-mvp-first-design-evolution.md)
- [Stakeholder 模拟](./03-stakeholder-simulation.md)
