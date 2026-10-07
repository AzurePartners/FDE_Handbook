---
title: FDE 交付生命周期
row: M0-L3.1
---
**一句话：** 一个 FDE 项目会经历十个阶段（Qualify → Discover → Define → Build → Integrate → Evaluate → Deploy → Adopt → Handoff → Productize），它们归入四类责任：Discovery、Production、Adoption 和 Feedback。

## 是什么

生命周期就是把第 1 课的四类责任，拆成你在一个客户项目里实际经历的各个阶段。

| 阶段 | 关键问题 | 典型产出 | 责任 |
|---|---|---|---|
| **Qualify（立项判断）** | 这件事值得做吗？我们做得到吗？ | 做/不做的决定、出资人、已知约束 | Discovery |
| **Discover（问题发现）** | 真正的问题是什么？现在的工作是怎么完成的？ | Stakeholder 地图、现状流程、baseline | Discovery |
| **Define（范围定义）** | 我们到底要做什么？怎么知道它成功了？ | 范围、PRD 或 SOW、验收标准、架构假设 | Discovery |
| **Build（构建）** | 能不能先把最窄的一条有用路径跑通？ | 一个端到端运行的切片、定期 demo | Production |
| **Integrate（集成）** | 它能否和客户真实的数据、系统、权限一起工作？ | Connector、访问权限、数据契约 | Production |
| **Evaluate（评测）** | 它是否可靠到值得信任？ | Eval 集、失败报告、修复 | Production |
| **Deploy（部署）** | 它是否在生产环境运行，我们能否看到它在做什么？ | 部署、监控、runbook | Production |
| **Adopt（采用）** | 真实用户在用吗？指标变了吗？ | 试点结果、培训、工作流变化 | Adoption |
| **Handoff（移交）** | FDE 之外的人能运行它吗？ | 运维指南、每种失败方式的负责人 | Adoption |
| **Productize（产品化）** | 什么东西要回到产品里？ | 可复用资产、产品反馈 | Feedback |

## FDE 为什么需要

它是你将要负责的每个项目的提纲，也是后面每个模块背后的结构。它还给了你和客户、同事之间的共同语言（"我们还在 Integrate 阶段，卡在安全审查"）。

## 核心概念

### 这不是瀑布流程

Build、Integrate、Evaluate 会循环很多次。好的 FDE 会尽早、频繁地展示一条窄而能用的路径（demo 驱动开发），而不是攒着所有功能做一次大揭幕。采用阶段的问题常常会把你送回 Define，因为用户的实际行为揭示了另一个问题。

### 每个阶段都有一个退出问题

一个阶段的问题还没回答就往下走，是项目后期失败最常见的原因：问题没定义就开发，没评测就部署，没被采用就宣布成功。

### Production 是四个阶段，不是一个

初学者常以为"开发"就是全部的工程工作。在企业 AI 里，大部分时间花在 Integrate、Evaluate 和 Deploy 上：数据访问、权限、质量证明和可运维性。

## 常见误区

- **"Deploy 是终点。"** 它后面还有三个阶段，而且正是它们决定这个项目有没有创造价值。
- **"每个阶段都需要正式签字。"** 小项目可能一周就走过好几个阶段。阶段是要回答的问题，不是文书工作。
- **"Qualify 是销售的事。"** 对一个糟糕的用例说不，是 FDE 能做的最有价值的事情之一。

## 典型面试题

<details>
<summary>讲讲你会怎么和一个新客户推进一个十二周的项目。</summary>

前一到两周做 Qualify 和 Discover（stakeholder、现有流程、baseline，第一天就开始申请数据访问）。定义一个窄范围并附上验收标准。第一个月内做出并演示一条薄的端到端路径，然后循环 Integrate 和 Evaluate。部署给一个试点小组，对照 baseline 衡量采用情况，准备移交，并列出应该回到产品的东西。

</details>

<details>
<summary>项目最常卡在哪个阶段？为什么？</summary>

通常是 Integrate：数据访问、权限和安全审查花的时间远多于开发。标准的应对是在 Discover 阶段就开始提这些申请。

</details>

## 延伸阅读

- 文章：[A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1)（Palantir 博客，约 10 分钟）— 一个工作周里同时出现的几个阶段
- 视频：[The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo)（Y Combinator）— 41:14 "Building with Demo-Driven Development"一节，约 4 分钟

## 相关页面

- [生命周期与模块对照](./02-lifecycle-to-module-map.md)
- [FDE 的四类责任](../01-what-is-an-fde/03-four-fde-responsibilities.md)
- [为一个客户交付多种能力](../01-what-is-an-fde/02-many-capabilities-for-one-customer.md)
