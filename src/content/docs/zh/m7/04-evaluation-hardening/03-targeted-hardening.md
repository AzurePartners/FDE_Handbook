---
title: 针对性加固
row: M7-L4.3
---
**一句话：** 针对性加固是指只在观察到的失败或明确的风险确实需要时，才加上护栏、兜底或重试之类的保护措施。

## 是什么

加固让系统更安全、更可靠。“针对性”指的是每一项控制措施都对应一个具体问题。[避免过早优化](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md)（M5）提醒过，不要做与当前风险无关的优化：因为听起来专业，就去加缓存、多模型路由或复杂的监控，而真正的失败却原封不动地摆在那里。

本页的规则很简单：你加的每一项控制措施，都必须能对应到失败归因报告中的某一行，或风险登记表中某个有名有姓的风险。两者都对应不上，就先别做。为什么要推迟这些工作，见[避免过早优化](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md)（M5）。

## FDE 为什么需要

在客户现场的时间是有限的。助手还在泄露其他学员的成绩，你却花三天给一个从没出过故障的服务写重试逻辑，这笔账不划算。针对性加固还能让接手系统的客户看得懂这个系统，因为每项控制措施都有书面理由。

## 核心概念

常见的控制措施及对应的概念页：护栏见[输入与输出护栏](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md)（M2），兜底见[拒答与兜底](../../m2/12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)（M2），重试见[可靠性](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)（M4），时效性见[时效性关卡](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/02-freshness-gates-provenance-and-data-lineage.md)（M4），人工审核见[人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)（M2），日志见[日志、指标与 trace](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md)（M4）。每加一项控制措施，都要重跑评测集，确认这个失败修好了，而且没有弄坏别的东西。

### 你要交付什么

一份加固台账：

| 控制措施 | 触发原因 | 作用位置 | 添加后的检查 | 结果 |
|---|---|---|---|---|
| 面向学员的索引不再包含原始工单 | F-01，权限失败 | 检索索引 | F-01 现在会拒答 | 通过 |
| “没有来源就不作答”规则，并升级给人工 | F-02，规则失败 | 作答步骤 | F-02 现在会升级 | 通过 |
| 课程目录加上时效日期，屏蔽过期文件 | E-01，数据失败 | 检索过滤器 | E-01 会说明课程已停开 | 通过 |
| 模型超时后重试 | 观察到的超时，Run 011 和 019 | 模型调用 | 重跑中没有超时失败 | 通过 |
| 响应缓存 | 无 | 无 | 未构建 | 推迟 |

最后一行才是重点：把你考虑过但没有做的事情写下来，并附上理由。

### 通过标准

- 每项控制措施在“触发原因”一列都有对应的触发用例或明确风险。
- 每项控制措施都有检查方式，并且之后重跑了评测集。
- 推迟的想法都列了出来，并写明理由。
- 没有任何控制措施让之前通过的用例变差。

## 常见误区

- **“护栏越多越安全。”** 额外的控制措施会增加复杂度，还可能挡住正常的问题。每一项都需要理由。
- **“加固是最后的打磨步骤。”** 加固从失败报告出发。没有这些证据，你就是在瞎猜。
- **“不做某项控制就是失职。”** 带着书面理由、在风险较低时不做，这是一个决策。悄悄不做才是问题。

## 典型面试题

<details>
<summary>你加固了哪些地方？是怎么决定的？</summary>

我只添加与归因报告中的失败挂钩的控制措施：从面向学员的索引中移除原始工单，加一条“没有来源就不作答”的规则，再加一个时效性过滤器。每一项都有一个用例证明它确实生效。

</details>

<details>
<summary>你选择了不做哪些东西？</summary>

响应缓存和模型路由。我的评测和日志中都没有显示延迟或成本问题，所以我把它们记为推迟。

</details>

<details>
<summary>加固过程中你怎么避免过早优化？</summary>

我要求每项控制措施都要对应一个失败用例或明确的风险。对应不上的，就放进推迟清单。

</details>

## 延伸阅读

- 书籍章节：[Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)（Google SRE Book，讲重试、超时和优雅降级）。

## 相关页面

- [失败归因报告](./02-failure-attribution-report.md)
- [已知局限与修复清单](./04-known-limitations-and-fix-list.md)
- [Mini PRD 与风险登记表](../02-architecture-mvp-freeze/01-mini-prd-and-risk-register.md)
- [避免过早优化](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md)（M5）
- [输入与输出护栏](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md)（M2）
