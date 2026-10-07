---
title: Mini PRD 与风险登记表
row: M7-L2.1
---
**一句话：** Mini PRD 是一份两页的说明，写清你要做什么、怎么判断它可行；风险登记表列出可能让你停下来的因素，每一项都有负责人和应对措施。

## 是什么

做出 go 决策之后，你要把需求发现的成果变成一份客户和评审人都能签字的计划。Mini PRD（产品需求文档）包含目标工作流、MVP 范围、验收标准和非目标。风险登记表与它配套。

对 Course Support Assistant（课程支持助手）来说，目标工作流是：学员提问，助手依据已批准的课程文档作答并注明来源，任何不确定的问题都转给人工客服。完整版本见 [PRD：课程支持助手](../../m6/01-education-rag/02-prd.md)（M6）。你的版本更短，并且针对你自己的客户。

## FDE 为什么需要

没有书面验收标准，“完成”就由演示时嗓门最大的利益相关方说了算。没有非目标，每个新请求都会变成范围。没有风险登记表，那个足以毁掉项目的风险（比如过时的退款政策）就会由客户来发现。

## 核心概念

范围、PRD 与 SOW 的区别、验收标准、现状与目标状态，分别在 [范围](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/01-scope-problem-users-mvp-must-nice-to-have-non-goals.md)、[PRD 与 SOW](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/02-prd-vs-sow.md)、[可度量的验收标准](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md)、[现状与目标状态](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/04-as-is-vs-to-be-documenting-the-process-change.md) 和 [架构假设：假设、风险与技术债](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/03-architecture-hypothesis-assumptions-risks-and-tech-debt.md)（均为 M5）中讲解。

### 你要交付什么

Mini PRD 骨架：

```
1. 问题（取自已获批的简报，一句话）
2. 用户与目标工作流（5 到 8 步）
3. MVP 范围（必须有的功能，最多 5 项）
4. 非目标（至少 3 项，明确写出）
5. 验收标准（可衡量，每条配一个测试）
6. 待解决问题与依赖
```

风险登记表：

| 风险 | 可能性 | 影响 | 缓解措施 | 负责人 |
|---|---|---|---|---|
| 退款政策文档相互矛盾 | 高 | 高 | 请财务给出唯一信息源；在回答中注明文档和日期 | 我 |
| 助手编造答案 | 中 | 高 | 只依据检索到的文本作答；兜底转人工 | 我 |
| 工单中出现学员数据 | 中 | 高 | 建索引前去掉姓名 | 客服主管 |

现在就把每条验收标准转成两三个种子评测用例；Alpha 之后，[评测集与基线](../04-evaluation-hardening/01-evaluation-set-and-baseline.md) 会在这组种子用例的基础上扩充。

把重要的技术选择记录成简短的 ADR（架构决策记录：一页纸，包含背景、决策和后果）。[ADR 网站](https://adr.github.io/) 提供了模板。

### 通过标准

- 每条验收标准都可度量、可测试，例如“10 个测试问题中至少 8 个回答正确并引用了来源”。
- 每条验收标准都有两三个种子评测用例。
- 至少写了三个非目标，且没有一个与 MVP 清单冲突。
- 目标工作流标明了人在哪里介入。
- 每项风险都有负责人和具体的缓解措施，而不是“多加小心”。
- 客户或评审人已签字，版本注明日期。

## 常见误区

- **“PRD 是一份很长的文档。”** 在实战项目里它只有两页。篇幅会掩盖思路的不清晰。
- **“非目标就是以后再做的事。”** 非目标是这次交付中不会做的事。以后要做的工作放进后续阶段清单。
- **“风险只有技术风险。”** 通常还没轮到模型出问题，数据访问、归属和客户的配合度就已经把项目拖垮了。

## 典型面试题

<details>
<summary>你从 MVP 里砍掉了什么，为什么？</summary>

我砍掉了账户查询和多语言回答。账户查询需要一个在可用时间内接不上的 API，而客户的问题大多是英文的政策和课程安排咨询。我把这两项都写成了非目标，这样后续的相关请求就有明确的去处。

</details>

<details>
<summary>你是怎么写验收标准的？</summary>

每一条都写明一个数字和一个测试。例如，10 个测试问题中至少 8 个必须回答正确并引用来源，每个超出范围的问题都必须转给人工。这两条评审人都能检查。

</details>

<details>
<summary>你最大的风险是什么，你是怎么处理的？</summary>

退款文档相互矛盾。缓解措施是从财务那里拿到唯一的权威信息源，并在每个回答中显示文档名称和日期，让内容是否过时一目了然。

</details>

## 延伸阅读

- 文章：[Architecture Decision Records](https://adr.github.io/)（ADR GitHub 组织，提供模板和示例）。

## 相关页面

- [Go / No-Go 决策](../01-practicum-kickoff/04-go-no-go-decision.md)
- [解决方案架构图](./02-solution-architecture-map.md)
- [MVP 冻结与变更控制](./04-mvp-freeze-and-change-control.md)
- [可度量的验收标准](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md)（M5）
