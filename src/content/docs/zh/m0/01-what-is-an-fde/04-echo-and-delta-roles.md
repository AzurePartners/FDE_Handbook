---
title: Echo 与 Delta 分工
row: M0-L1.4
---
**一句话：** Palantir 把一线工作分成 Echo（驻场分析师，决定解决哪个问题）和 Delta（部署工程师，把它做出来）；很多公司把两者合在一个人身上，所以这种分工描述的是责任，而不是级别或技术栈。

## 是什么

在 Palantir，面向客户的团队里有两类人。**Echo** 成员是驻场分析师和客户负责人，通常有深厚的领域经验（国防客户那里的前军官、医院客户那里的前临床医生）。他们决定客户应该解决什么问题，并维护客户关系。**Delta** 成员是狭义上的前线部署工程师：快速做原型，把选定的问题变成一个运行中的系统。

其他公司对同一支团队有不同的切法。很多创业公司期望一个 FDE 两件事都做。有些组织再加第三个角色，专门辅导客户的业务团队用好系统。结构各不相同，但底层的两个问题不变：*我们该做什么？* 以及 *怎么让它在这里跑起来？*

## FDE 为什么需要

JD 很少用这两个词，但总会偏向其中一边。理解这种分工能帮你读懂招聘信息（"这主要是 Echo 的活还是 Delta 的活？"），规划自己的成长，也能看清为什么 Discovery 和 Production 需要不同的长处。

## 核心概念

### 两个问题，两种长处

| | Echo | Delta |
|---|---|---|
| 核心问题 | 这个客户应该先解决什么？ | 怎么让它在这里跑起来？ |
| 典型背景 | 领域专家、分析师、咨询顾问 | 擅长快速做原型的工程师 |
| 主要责任 | Discovery、客户关系、Adoption | Production |
| 单独存在时的失败方式 | 决定了来不及做出来的事 | 把错误的问题解决得很漂亮 |

### 按责任划分，不按级别

这种划分不是初级对资深、技术对非技术，也不是做 ML 对不做 ML。它只区分谁决定做什么、谁把它变成现实。Echo 需要足够的技术素养来判断可行性；Delta 需要足够的业务感觉，能对一个糟糕的问题说不。

### 一个人，两顶帽子

单人 FDE 两份工作都要做。常见的陷阱是：动手开发总显得更紧急，于是 Discovery 被挤掉。有经验的单人 FDE 会给 stakeholder 沟通留出固定时间，并在每次 demo 时重新问一遍"这还是对的问题吗？"

## 常见误区

- **"Echo 是非技术岗位。"** Echo 的工作需要判断技术上什么可行、有哪些数据。完全不懂技术的 Echo 会做出 Delta 兑现不了的承诺。
- **"Delta 只是按 Echo 的决定写代码。"** Delta 应该根据在客户系统里发现的情况，对范围提出质疑。
- **"只能永远选一边。"** 很多人在两者之间切换，很多 FDE 岗位本身就是两者的混合。

## 典型面试题

<details>
<summary>你更偏 Echo 还是 Delta？另一边你怎么补？</summary>

诚实选择，给出证据，再说明你怎么弥补：偏 Delta 的候选人可以讲自己如何做结构化的 stakeholder 访谈；偏 Echo 的候选人可以展示一个自己动手做的原型。

</details>

<details>
<summary>在一个陌生的客户环境里，你怎么快速做原型？</summary>

从最窄的端到端路径开始，用真实（或接近真实）的数据，尽量用客户现有的工具，几天内就放到一个用户面前；把发现的每个缺口（缺数据、缺权限、意外的格式）都当作 Discovery 的发现，而不只是 bug。

</details>

## 延伸阅读

- 文章：[Who Wants to Be a Delta?](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035)（Palantir 博客，约 10 分钟）— Delta 角色做什么、适合什么样的人
- 视频：[The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo)（Y Combinator）— 09:51 "Echo and Delta Teams Explained"一节，约 4 分钟

## 相关页面

- [FDE 的四类责任](./03-four-fde-responsibilities.md)
- [FDE 头衔的差异](../02-fde-vs-adjacent-roles/01-fde-title-variation.md)
- [FDE 交付生命周期](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
