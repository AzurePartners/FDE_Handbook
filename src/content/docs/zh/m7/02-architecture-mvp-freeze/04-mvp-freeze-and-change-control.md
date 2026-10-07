---
title: MVP 冻结与变更控制
row: M7-L2.4
---
**一句话：** MVP 冻结是在架构评审之后锁定范围；变更控制是一套小流程，决定之后提出的每个请求该怎么处理。

## 是什么

PRD、架构图和实现方式表评审通过后，就把它们冻结。冻结是一份注明日期的声明：“这就是 MVP。”此后，新的想法不能直接进入构建，每一个都要经过变更决策。

Shape Up 把其中的主要工具叫作 范围取舍（scope hammering）：时间不够时，你砍掉或重塑范围，而不是推迟截止日期（[Shape Up](https://basecamp.com/shapeup/3.5-chapter-14)）。时间预算（appetite）是固定的，范围才是可以调整的部分。

对 Course Support Assistant（课程支持助手）来说，一个典型的后期请求是“它能不能顺便查一下学员的注册状态？”这并不是对已冻结范围的澄清。它需要接入账户系统，而这本来就是非目标。

## FDE 为什么需要

客户是出于好意，但会不停地加需求。每一个小小的“好”，都要花掉你本来没有的时间，最后受损的是演示。一套公开可见的流程，让你可以说“这个阶段不做，它会按这个流程被考虑”，而听起来不像是在拒绝。

## 核心概念

请求的分类见 [新请求的分类](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md)（M5），完整的反馈闭环见 [形成闭环](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md)（M5）。

### 你要交付什么

一份冻结说明和一份变更日志。

冻结说明：

```
冻结时间：<日期>，架构评审之后
范围：mini PRD 中的 MVP 清单（5 项）
非目标：账户查询、多语言、语音
方法表版本：v1
变更规则：所有请求都走变更日志
```

变更日志，每个请求一行：

| 日期 | 请求 | 类别 | 对时间、成本、风险的影响 | 决定 |
|---|---|---|---|---|
| 第 9 天 | 显示注册状态 | 后续阶段 | 需要账户 API，增加风险 | 后续阶段 |
| 第 10 天 | 修正错误的答疑时间文本 | 澄清 | 范围不变 | 接受 |
| 第 11 天 | 增加第二个 FAQ 来源 | 变更 | 影响小，多一份文档 | 接受，去掉最好有的 X 项 |

### 通过标准

- 冻结注明了日期，并且基于一份评审过的架构，而不是凭感觉。
- 冻结后的每个请求都记录在日志里，带有类别和决定。
- 接受的变更要写明换掉了什么，或增加了多少时间，以及谁同意的。
- 冻结的 MVP 仍然可以按原来的验收标准进行测试。
- 被拒绝的请求保留在后续阶段清单里，不会丢失。

## 常见误区

- **“冻结意味着客户什么都不能改。”** 冻结意味着每个变更都要被评估代价、做出决定，而不是被悄悄吸收。
- **“每个请求都是变更。”** 很多请求只是对现有范围的澄清，接受它们成本很低，也是对的。
- **“再加一个小东西总没问题。”** 小东西会累积起来，而且每一个都需要测试。

## 典型面试题

<details>
<summary>冻结范围之后，你是怎么处理新请求的？</summary>

我把每个请求都记进日志，并归类为澄清、变更或后续阶段。对于变更，我会说明它对时间、成本和风险的影响，然后要么换掉别的内容，要么推迟。注册状态查询被放到了后续阶段，因为它需要账户 API。

</details>

<details>
<summary>什么是范围取舍（scope hammering）？</summary>

时间紧张时，砍掉或重塑范围，而不是推迟截止日期。它让交付日期保持真实，并迫使你给重要事项排出优先级。

</details>

<details>
<summary>如果客户坚持要加一个后期功能怎么办？</summary>

我会说明它在时间和风险上的影响，提出用它替换一个价值较低的项，或者把它排在下一阶段的第一位。决定权仍在项目发起人手里，但代价是摆在明面上的。

</details>

## 延伸阅读

- 书中章节：[Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14)（Shape Up，Basecamp，免费在线阅读），讲范围取舍。

## 相关页面

- [Mini PRD 与风险登记表](./01-mini-prd-and-risk-register.md)
- [配置、Skill 还是写代码](./03-configure-skill-or-code.md)
- [新请求的分类](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md)（M5）
- [形成闭环](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md)（M5）
