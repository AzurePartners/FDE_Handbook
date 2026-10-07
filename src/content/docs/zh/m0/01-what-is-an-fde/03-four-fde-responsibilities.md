---
title: FDE 的四类责任
row: M0-L1.3
---
**一句话：** 一个完整的 FDE 要对一个由四类责任组成的闭环负责（Discovery、Production、Adoption、Feedback）：选出值得解决的客户问题，让方案在真实环境里安全运行，让真实用户真的用起来，并把一线经验带回产品。

## 是什么

四类责任是一种描述任何 FDE 岗位的方法：看它对什么负责，而不看它叫什么。

| 责任 | 你负责什么 | "完成"意味着 | 本手册在哪里讲 |
|---|---|---|---|
| **Discovery（问题发现）** | 从客户提出的所有要求里，判断哪个问题值得解决 | 一个有明确用户、baseline、出资人和约定成功标准的问题 | 模块五第 2–5 课 |
| **Production（生产工程）** | 让方案在客户真实环境里安全、稳定、可维护地运行 | 在 demo 之外，用真实数据、真实权限运行，并有监控 | 模块一至模块四 |
| **Adoption（业务采用）** | 让目标用户使用它并改变工作方式 | 有真实使用，约定的指标发生变化 | 模块五第 7 课 |
| **Feedback（产品回流）** | 把学到的东西带回产品 | 可复用的部分进入产品，下一个客户更便宜 | 模块五第 7 课 |

## FDE 为什么需要

它提供三个实用工具。你可以把任何一份 JD 放到这个模型上，看清它实际包含哪几类责任。你可以评估自己的短板（大多数工程师强在 Production，弱在 Discovery 或 Adoption）。你还可以预判项目会死在哪里，因为每类责任都有典型的失败方式。

## 核心概念

### 这是一个闭环，不是一张清单

Feedback 让下一次 Discovery 更快：一旦产品已经能处理常见情况，下一个项目就能从更好的起点开始。所以四类责任画成一个循环。

### 每类责任都有典型的失败

| 被跳过的责任 | 结果 |
|---|---|
| Discovery | 团队把错误的东西做得很好 |
| Production | 项目永远停在 PoC |
| Adoption | 上线了，没人用 |
| Feedback | 每个客户的成本都和第一个一样 |

### 大多数真实岗位只覆盖闭环的一部分

模型基础设施公司里偏平台的 FDE，大部分时间可能都在 Production 上。坐在业务团队旁边做原型、再交给后端团队实现的 FDE，覆盖的是 Discovery 的一部分。同时服务十个客户的 FDE 四类都碰，但每类都分得很薄。这些都不算"次一等"的 FDE。有用的问题是你负责的是哪一部分，这样期望、考核和职业规划才能对得上。

## 常见误区

- **"上线就是终点。"** 上线是 Production 的终点。Adoption 是另一类责任，有自己的失败方式。
- **"Feedback 是产品经理的事。"** 产品经理决定什么进入产品，但证据在 FDE 手里。FDE 不带回来，就没人带回来。
- **"真正的 FDE 必须四类全占。"** 全覆盖是这个角色的完整形态，不是最低门槛。

## 典型面试题

<details>
<summary>讲一个上线了但没人用的项目。如果重来你会怎么做？</summary>

说出具体的采用障碍（用户不信任输出、它给工作流多加了一步、没人测过"之前"），然后说你会提前做什么：在 Discovery 阶段就让最终用户参与，在 scope 里约定采用指标，上线前规划培训和兜底路径。

</details>

<details>
<summary>四类责任里，你最强和最弱的分别是哪一类？</summary>

具体且诚实。把短板和你正在采取的行动放在一起说，最好有具体的产物（你做过的一次 discovery 访谈、你跟踪过的一个采用指标）。

</details>

## 延伸阅读

- 文章：[A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1)（Palantir 博客，约 10 分钟）— Discovery、Production、Adoption 在一个工作日里是什么样子

## 相关页面

- [Echo 与 Delta 分工](./04-echo-and-delta-roles.md)
- [FDE 交付生命周期](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
- [角色判据](../02-fde-vs-adjacent-roles/02-role-tests.md)
