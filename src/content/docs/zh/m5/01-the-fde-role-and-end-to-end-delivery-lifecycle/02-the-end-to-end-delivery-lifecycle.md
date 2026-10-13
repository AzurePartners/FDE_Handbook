---
title: 端到端交付生命周期
row: M5-L1.2
---
**一句话：** 一个 FDE 项目会走完整个流程：Qualify（立项判断）→ Discover（问题发现）→ Scope（范围界定）→ Design（设计）→ Build（构建）→ Evaluate（评测）→ Pilot（试点）→ Handoff（交接）→ Product Feedback（产品回流），了解整个流程，你就不会在没弄懂问题之前急着动手构建，也不会在工作交接、经验回流之前就停手。

## 是什么

生命周期给出了每个阶段的名称和目的：

- **Qualify：** 这是不是一个真实、值得做、而且帮得上忙的问题？
- **Discover：** 弄清真正的问题、用户和约束。
- **Scope：** 约定哪些会做（以及哪些不做）。
- **Design：** 选择最简可行架构。
- **Build：** 迭代地实现它。
- **Evaluate：** 证明它表现如何，包括失败的情况。
- **Pilot：** 带着成功标准，在真实环境中小范围推广。
- **Handoff：** 转移所有权，让客户能自己运行它。
- **Product Feedback：** 把一线经验回流到产品 / 团队。

它是迭代的：构建期间，需求发现会重新展开；而人们常常跳过的评测、交接和产品回流这几个阶段，恰恰是价值得以落实的地方。

## FDE 为什么需要

脑子里没有这个完整的流程，人就容易一上来就写代码（跳过 Qualify 和 Discover），做到“能演示”就收手（跳过 Evaluate、Handoff 和 Feedback）。这两种都是经典的失败。有了生命周期，你就能给自己定位（“我们还在 Discover 阶段，先别敲定设计”），也能确保那些不起眼、价值却很高的阶段真的会发生。

## 核心概念

```
Qualify -> Discover -> Scope -> Design -> Build -> Evaluate -> Pilot -> Handoff -> Product Feedback
              ^_____________________ 边学边迭代 _____________________|
```

- **每个阶段都有退出标准：** 没达到就不要进入下一阶段。
- **迭代是常态：** 构建中学到的东西，会把你送回 Scope 阶段。
- **Qualify 在最前，Feedback 在最后：** 这是最常被跳过的两个阶段。

## 常见误区

- **“第一天就开始构建。”** 在 Qualify 和 Discover 之前就构建，有可能把一个错误的问题解决得很高效。
- **“能演示就算做完了。”** 做完的意思是：已评测、已试点、已交接，经验也已回流。
- **“生命周期是严格线性的。”** 它是迭代的；随着了解的深入，你会回头重访前面的阶段。

## 典型面试题

<details>
<summary>讲讲 FDE 的交付生命周期。</summary>

先对问题做立项判断；再弄清真正的需求、用户和约束；界定做什么、不做什么；设计最简单的架构；迭代构建；如实评测，包括失败的情况；带着真实用户和成功标准做试点；完成交接，让客户能自己运行；最后把一线经验回流到产品。整个过程是迭代的，而人们常跳过的评测、交接和产品回流，恰恰是价值真正得以落实的地方。

</details>

<details>
<summary>为什么要把 Qualify 和 Product Feedback 单列为明确的阶段？</summary>

Qualify 避免把投入花在不真实或不合适的问题上。Product Feedback 把这个项目教给你的东西留下来，让产品变好，也让下一次部署成本更低。这两个阶段都很容易被跳过，也都会在一个又一个项目之间不断累积价值。

</details>

## 延伸阅读

- 文章：[A Day in the Life of a Palantir FDSE](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1)
- 书：[Shape Up](https://basecamp.com/shapeup)（Basecamp，免费；塑形 → 下注 → 构建的循环）

## 相关页面

- [需求发现访谈](../02-customer-discovery-and-stakeholder-interviews/01-discovery-interviews.md)
- [把一线经验回流到产品](../07-pilot-value-handoff-and-productization/08-feeding-learnings-back-to-product.md)
