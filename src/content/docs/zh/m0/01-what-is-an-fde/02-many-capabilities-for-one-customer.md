---
title: 为一个客户交付多种能力
row: M0-L1.2
---
**一句话：** 产品工程师为许多客户做一种能力，而 FDE 为一个客户交付多种能力，并帮助把在那里行之有效的东西变成下一个客户能用的产品。

## 是什么

Palantir 的工程博客这样描述它的两条工程路线："Dev"工程师做一种会被许多客户使用的能力，"Delta"工程师（Palantir 的前线部署工程师）为单个客户交付许多能力。两条路线从相反的方向做同一个产品：产品团队在客户群里横向铺开，FDE 在一个客户内部纵向深入。

一周之内，一个 FDE 可能要给客户的工单系统写一个 connector，清洗一份混乱的数据导出，修一个在客户文档格式上失效的 prompt，为一位经理搭一个小看板，再做一场培训。每件事都不大，合起来才让产品在这个客户那里真正可用。

## FDE 为什么需要

它解释了新人常有的两个困惑。第一，为什么 FDE 的工作看起来比产品工程师零散：工作的单位是一个客户的结果，而不是一个功能。第二，为什么它仍然是工程而不是服务：FDE 也是产品了解客户真实需求的渠道。

## 核心概念

### 两个方向

| | 产品工程师 | FDE |
|---|---|---|
| 工作单位 | 面向所有用户的一个功能 | 一个客户的一个结果 |
| 成功的样子 | 整个客户群都在用 | 这个客户的指标变了 |
| 被复用的是什么 | 产品 | 产品，加上 FDE 在一线学到的东西 |
| 主要风险 | 做出没人需要的东西 | 做出只有一个客户能用的东西 |

### 中间的那个判断

FDE 每做一样东西，都要问一个问题：这是这个客户特有的，还是下一个客户也会需要？客户特有的部分留在这次部署里；通用的部分以功能需求、可复用组件、模板或 eval 集的形式回到产品团队。本手册把这个阶段叫作 **Productize**（见 [FDE 交付生命周期](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)）。没有这一步，FDE 团队就只是软件公司里的一个服务部门。

### 为什么 AI 放大了这种模式

McGrew 在 Y Combinator 的 Lightcone 播客里的观点是：AI Agent 往往没有现成的产品可以参照，因此大量产品发现必须在客户内部完成，而 FDE 就是发生这种发现的地方。

## 常见误区

- **"多种能力就意味着一切从零开始。"** FDE 在产品之上构建，只在产品不够用的地方写定制代码。重做产品已有的功能是危险信号。
- **"客户定制的工作是浪费。"** 这正是团队发现什么可以通用的方式。只有当什么都没回流时，它才是浪费。
- **"产品工程师和 FDE 是竞争关系。"** 两者互相依赖：FDE 带回一线证据，产品团队把它变成每个客户都能得到的东西。

## 典型面试题

<details>
<summary>你为一个客户做了一样东西，怎么判断它该不该进入产品？</summary>

问三件事：是否至少还有两三个客户有同样的需求；能否在不依赖这个客户特有假设（他们的字段名、他们的流程特点）的情况下构建；产品团队能否维护它。带给产品团队的应该是证据（哪些客户、多频繁、省了什么），而不只是代码。

</details>

<details>
<summary>一个从不把工作回流到产品的 FDE 团队会出什么问题？</summary>

每个新客户的成本都和上一个一样，定制代码越积越多却没人负责，公司的利润结构变得像咨询公司。FDE 自己也会因为重复同样的工作而耗尽精力。

</details>

## 延伸阅读

- 文章：[Dev versus Delta: Demystifying Engineering Roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)（Palantir 博客，约 10 分钟）— "为多个客户做一种能力 vs. 为一个客户做多种能力"的原始说法
- 视频：[The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo)（Y Combinator）— 03:19 "How Palantir Invented It"一节，约 5 分钟

## 相关页面

- [FDE 的四类责任](./03-four-fde-responsibilities.md)
- [FDE 与软件工程师、AI 工程师](../02-fde-vs-adjacent-roles/03-fde-vs-software-and-ai-engineer.md)
- [FDE 与咨询、系统集成商](../02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)
