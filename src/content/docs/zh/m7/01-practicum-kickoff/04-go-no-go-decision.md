---
title: Go / No-Go 决策
row: M7-L1.4
---
**一句话：** Go / No-Go 决策是一个检查点：你审视验证证据，从四条路径中选一条：继续推进、缩小范围、更换项目，或先做一次验证实验。

## 是什么

验证产出的是证据。这一步把证据变成一个书面记录的决策，让选择是深思熟虑的，评审人也能看到你的推理过程。

允许的结果有四种：

| 决策 | 适用情况 |
|---|---|
| 继续推进 | 四项检查都成立，风险可以接受 |
| 缩小范围 | 问题真实存在，但完整版本在时间或数据上做不下来 |
| 更换项目 | 某项检查不通过且无法补救（没有数据、没有用户） |
| 先做实验 | 某个关键结论不确定，而一个低成本测试就能定论 |

如何选择技术方案见 [架构决策树](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md)（M5），范围如何划定见 [范围：问题、用户、MVP、必须有 / 最好有、非目标](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/01-scope-problem-users-mvp-must-nice-to-have-non-goals.md)（M5）。

## FDE 为什么需要

尽早说“不”或者“还不行”，是 FDE 的一项核心能力。客户在第一周听到这句话，什么都不会损失；在一次失败的演示之后才听到，失去的是信任。对 Course Support Assistant（课程支持助手）来说，缩小范围可以是：只回答 FAQ 和政策问题，不做账户查询。

## 核心概念

### 你要交付什么

一页纸的决策记录：

```
决策：缩小范围
证据：验证说明，第 2 节
理由：政策和 FAQ 类问题可以解决；账户查询需要一个
      在现有时间内无法接入的 API
条件：财务协调员在第 5 天前确认退款规则
评审人：<姓名>，日期
```

### 通过标准

- 清楚写明四种决策中的一种。
- 理由指向验证说明中的具体证据。
- 每个附加条件都有负责人和日期。
- 如果缩小范围，要列出被砍掉的内容，以便之后写进非目标。
- 如果更换项目，新的选择要重新走一遍 [项目选择](./01-project-selection.md)。

## 常见误区

- **“No-go 就说明我失败了。”** 论证充分的 no-go 或更换项目，同样算通过这一步。做错东西才是失败。
- **“缩小范围就是少做些打磨。”** 缩小范围是少解决几个问题。留下的那个问题仍然需要一条完整、经过测试的路径。

## 典型面试题

<details>
<summary>讲一次你决定砍掉或调整范围的经历。</summary>

验证之后，我发现政策和 FAQ 类问题可以解决，但账户查询需要一个我无法访问的 API。我选择缩小范围，把账户查询列为非目标，并记录了这个决策，附加条件是拿到经过确认的退款规则。

</details>

<details>
<summary>什么时候你会先做实验，而不是直接做决策？</summary>

当某个结论不确定，而一个低成本测试就能定论的时候，比如拿十个真实问题去对照一份政策文档跑一遍。我会定好测试内容、负责人和截止日期，然后根据结果做决策。

</details>

## 延伸阅读

- 书中章节：[The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08)（Shape Up，Basecamp，免费在线阅读），讲下注机制和断路器。

## 相关页面

- [项目验证](./03-project-validation.md)
- [Mini PRD 与风险登记表](../02-architecture-mvp-freeze/01-mini-prd-and-risk-register.md)
- [架构决策树](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md)（M5）
