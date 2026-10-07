---
title: 需求发现资料包
row: M7-L1.2
---
**一句话：** 需求发现资料包由五份简短文档组成，用来证明你在动手设计之前，已经理解了客户的问题、相关人员、现有工作流、知识缺口和依赖。

## 是什么

需求发现是倾听阶段。你要和身处问题之中的人交谈，梳理今天工作是怎么完成的，并写下你还不知道的东西。需求发现资料包就是你交给评审人、证明这些工作已经做过的材料。

对 Course Support Assistant（课程支持助手）来说，需求发现意味着和一位客服主管、一位课程协调员以及一部分学员交谈，然后阅读现有的 FAQ、退款政策和一批历史工单。访谈技巧本身见 [需求发现访谈](../../m5/02-customer-discovery-and-stakeholder-interviews/01-discovery-interviews.md) 和 [提问技巧](../../m5/02-customer-discovery-and-stakeholder-interviews/02-questioning-technique-5-whys-facts-vs-opinions-vs-incentives.md)（M5）。本页讲的是你必须产出什么。

## FDE 为什么需要

跳过需求发现的团队，做出来的是对表面需求的响应，而不是对真实问题的解决。客服主管可能会说要“一个聊天机器人”，而真正的痛点是退款规则散落在三份互相矛盾的文档里。没有资料包，直到演示时都没人发现问题，到那时助手会信心满满地引用过时的那一份。

## 核心概念

### 你要交付什么

五项内容，每项不超过一页：

| 内容项 | 包含什么 | 概念页面 |
|---|---|---|
| 利益相关方地图 | 谁拍板、谁使用、谁受影响、谁会阻挠 | [利益相关方梳理](../../m5/02-customer-discovery-and-stakeholder-interviews/03-stakeholder-mapping.md)（M5） |
| 问题简报 | 已获批的简报，根据访谈发现更新 | [项目选择](./01-project-selection.md) |
| 现状工作流 | 参与者、步骤、输入、输出、决策、交接点 | [梳理工作流](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/01-mapping-a-workflow-actors-steps-inputs-outputs-decisions.md)（M5） |
| 领域知识缺口 | 你还没弄懂的术语和规则，以及谁能解释 | 无 |
| 数据与权限依赖 | 什么数据、归谁所有、访问状态、敏感程度 | [PII/PHI 处理](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)（M4） |

一条最简的知识缺口记录长这样：

```
缺口：第 2 周之后的部分退款怎么计算？
为什么重要：助手不能自己猜一个数字
谁能解答：财务协调员
状态：未解决，第 3 天已提问
```

一条最简的依赖记录：

```
数据：历史客服工单（最近 6 个月）
负责人：客服主管
访问状态：已收到 100 张匿名化工单样本
敏感程度：包含学员姓名，必须删除
```

### 通过标准

满足以下条件时，评审人接受资料包：

- 至少访谈了两位真人，可以是利益相关方或合格的代理人（客户组织可以是虚构的），并且笔记把事实和观点分开记录。
- 一个陌生人也能顺着现状工作流走下来，并看出时间耗在哪里。
- 每个未解决的缺口都有一位能解决它的具名人员。
- 每个数据源都有所有者和访问状态，敏感字段都已标出。
- 资料包里没有解决方案设计。设计属于架构阶段。

## 常见误区

- **“需求发现就是开一次启动会。”** 一次会议只能让你听到项目发起人的视角。你还需要日常使用者，因为他们知道流程实际上在哪里出问题。
- **“我不懂这个领域，应该藏着。”** 恰恰相反。一份公开的、每项都有负责人的缺口清单是优势。藏起来的缺口会在生产环境里变成错误答案。
- **“数据访问可以等到构建阶段再说。”** 数据缺失或受限是 Alpha 卡住最常见的原因。现在就把状态记下来。

## 典型面试题

<details>
<summary>你是怎么确认自己理解了客户的问题的？</summary>

我访谈了一位客服主管和两位代理学员，然后画出现状工作流，再拿去和主管核对。这张图显示客服人员在手动回答同样的退款和课程安排问题。让利益相关方确认这张图，就是我的验证。

</details>

<details>
<summary>你发现了哪些领域知识缺口，又是怎么补上的？</summary>

我维护了一张缺口表，每一项都有负责人。比如我不清楚部分退款怎么算，就去问了财务协调员，并把答案连同来源一起记下来。没有得到答复的内容，都被明确列为局限。

</details>

<details>
<summary>如果客户不能共享数据，你会怎么做？</summary>

我会要一小份保留结构的匿名化或合成样本，并把这项依赖标记为风险。如果连这个都拿不到，我会在 [Go / No-Go 决策](./04-go-no-go-decision.md) 时提出来，而不是基于猜测去构建。

</details>

## 延伸阅读

- 书中章节：[Principles of Shaping](https://basecamp.com/shapeup/1.1-chapter-02)（Shape Up，Basecamp，免费在线阅读，讲如何在动手前塑造问题）。

## 相关页面

- [项目选择](./01-project-selection.md)
- [项目验证](./03-project-validation.md)
- [利益相关方梳理](../../m5/02-customer-discovery-and-stakeholder-interviews/03-stakeholder-mapping.md)（M5）
- [现状与目标状态](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/04-as-is-vs-to-be-documenting-the-process-change.md)（M5）
