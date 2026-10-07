---
title: Stakeholder 模拟
row: M8-L3.3
---
**一句话：** Client-simulation 轮让你坐到一个角色扮演的怀疑者、技术负责人或业务负责人对面，评分看你是否针对每一位改变解释方式、承诺内容和反驳方式——同时不改变什么是真的。

## 是什么

面试官扮演客户方 stakeholder，有时友好，有时故意烦躁或不懂技术，给你一个任务：汇报第一版提案、解释为什么助手不能保证 100% 准确、向 CTO 传达三周延期、拒绝一个会破坏数据治理的功能。反复出现的三种角色是：**怀疑者**（"我们去年试过 AI，它胡编"）、**技术负责人**（"谁拿凭证、什么跑在我的 VPC 里、你的回滚是什么"）、**业务负责人**（"这要花多少钱、什么时候见到价值、我的团队怎么办"）。每一位需要不同的第一句话。

## FDE 为什么需要

FDE 一周的大部分时间在对话，面试官在决定能否把你单独放进客户的会议室。被打分的行为是：提方案前先问诊断性问题、反驳前先承认对方说对的部分、给出带明确取舍的选项、用 ownership 语言（"我周五之前给你"，不是"团队正在看"）、绝不承诺做不到的事。把这一轮当软性环节的候选人，挂掉的比例出人意料地高。

## 核心概念

### 一个事实，三种表述

| 角色 | 他们最先需要什么 | 什么能说服他们 | 什么会失去他们 |
|---|---|---|---|
| 怀疑者 | 承认上次的失败，以及这次有什么不同 | 证据：eval 集、拒答路径、带停止规则的试点 | 热情、术语、对准确率的承诺 |
| 技术负责人 | 边界：什么会碰他们的系统，用什么权限 | 画出的信任边界、最小权限、回滚、他们能读的日志 | 对凭证和数据流含糊其辞 |
| 业务负责人 | baseline、会动的数字、成本和日期 | 带取舍的选项、go/no-go 门槛、诚实的证据强度 | 把模型指标当业务价值来讲 |

### 承认、诊断、承担

用对方的话承认顾虑；用一两个问题诊断；用一个人名和日期承担下一步。反驳、坏消息和异议都适用。

### 传达坏消息

早说、说原因、给选项、给路径。"我们晚了三周，因为承诺的数据源在沙箱里不可用。两个选项：基于样本导出开发并在切换时接受一次对账；或者保持日期，我本周与你们的数据团队升级这个数据源。我建议第一个；我周四前确认样本。"

### 说"不"而不失去关系

说出对方说对的部分，陈述你不会跨过的原则（治理、安全、书面 non-goal），并提供你能做到的最接近的东西。"你说得对，销售需要这些数据。按你们的政策我不能把客户 PII 发给模型供应商；我可以脱敏后用哈希 ID 匹配，能拿到 90% 的价值。"

### 有分寸的承诺

说你会做什么、什么时候、什么会导致延误。在这一轮过度承诺会被记为信任失分，而不是热情。

## 常见误区

- **"技术角色想要更多架构。"** 他们想要边界和可运维性。先讲权限和回滚，不先讲组件。
- **"怀疑者需要被说服。"** 怀疑者需要先被听见。在承认他们的经历之前就反驳，对话就结束了。
- **"Ownership 语言是吹嘘。"** 它是问责。"我"会做什么，是客户需要听到的；"我们正在看"是他们从每个供应商那里都听过的。

## 典型面试题

<details>
<summary>客户的 VP 说"我需要它 100% 准确"。你怎么说？</summary>

先承认他们为什么需要这个（监管风险、品牌风险），然后把框架从准确率转到风险：任何读自由文本的系统都不是 100%，包括现在的人工流程；设计在错误不可接受的地方放确定性检查，在证据缺失的地方放拒答路径，在动作不可逆的地方放人工审批。给出 eval 集上的可衡量目标，以及在任何人依赖它之前证明这一点的试点。

</details>

<details>
<summary>IT 负责人不给你生产凭证。你怎么解锁？</summary>

问他们在防什么；提出最小权限——一个对你需要的两张表只读的 service account，在他们的 VPC 内，用他们的日志；主动提议先基于脱敏导出工作；点出他们那边能批准的人。不要争取宽泛权限。

</details>

<details>
<summary>部署延误了三周。告诉 CTO。</summary>

原因、影响、选项、建议、下一个检查点——按这个顺序，一分钟内。然后停下来，让对方回应。

</details>

## 延伸阅读

- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced）— client-simulation 场景与强模式
- 文章：[Forward Deployed Engineer (FDE) Interview Questions Guide](https://fde.academy/blog/forward-deployed-engineer-interview-questions)（FDE Academy）— client-simulation 轮与承认/诊断/承担框架
- 参考：[Stakeholder analysis guide](https://www.atlassian.com/software/confluence/resources/guides/how-to/stakeholder-analysis)（Atlassian）— power × interest 映射，按对象调整信息
- 参考：[Anthropic Forward Deployed Engineer Interview Guide](https://www.theforwarddeployed.io/interviews/anthropic) — 公开资料如何描述 customer-conversation simulation

## 相关页面

- [现场 Scoping](./02-live-scoping.md)
- [处理未知](./04-handling-unknowns.md)
- [STAR 与项目深挖](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
