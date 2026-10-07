---
title: 模块 7：FDE 端到端实战项目
---
**一句话：** 在实战项目中，你要把一个客户式项目从需求发现一路做到交接，产出的证据和真正的前线部署工程师（FDE）交给客户的一样。

## 是什么

模块 1 到 6 讲的是各个组成部分；模块 7 把它们用到同一个项目上。你选定一个已获批准的用例，做需求发现，冻结 MVP，把它做出来，找真实用户或代理用户测试，最后向利益相关方答辩。

本模块不按固定周数安排：总共预留 52 到 78 小时。每个阶段都以一个关卡收尾，也就是一份交付物，评审人检查通过后你才能进入下一阶段。

每一页都会给出 **你要交付什么** 和 **通过标准**，并链接到前面模块中的概念页面。

## FDE 为什么需要

FDE 岗位的面试官很少问“你会做 agent（智能体）吗？”。他们会问“讲讲你交付过的一个项目”：客户需要什么，你砍掉了什么，哪里出过问题，最后交出去了什么。实战项目让你拥有这样一个故事，以及能支撑它的文档，这些就是你的作品集：参见 [案例研究结构](../../m8/01-portfolio-case-study-resume/01-case-study-structure.md) 和 [作品集构成](../../m8/01-portfolio-case-study-resume/04-portfolio-composition.md)（M8）。

## 核心概念

### 你要交付什么

每个阶段一份关卡交付物：

| 阶段 | 关卡交付物 | 预计用时 |
|---|---|---|
| 1. 实战项目启动 | 获批的问题简报和需求发现资料包，以及 go / no-go 决策 | 6 到 10 小时 |
| 2. 架构与 MVP 冻结 | Mini PRD、包含至少两份 ADR 的架构图、冻结的 MVP 范围 | 10 到 14 小时 |
| 3. Alpha 构建 | 一条端到端路径，别人照着你的说明就能跑起来 | 12 到 18 小时 |
| 4. 评测与加固 | 带评测结果、失败报告和优先级修复清单的 Beta 版 | 10 到 14 小时 |
| 5. 代理用户测试 | 带反馈日志和下一阶段计划的候选发布版本（RC） | 8 到 12 小时 |
| 6. 演示、答辩与交接 | 客户演示、交接包、个人复盘 | 6 到 10 小时 |

这些阶段对应 [FDE 交付生命周期](../../m0/03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)（M0）：阶段 1 是 Qualify 和 Discover，阶段 2 是 Define，阶段 3 是 Build 和 Integrate，阶段 4 是 Evaluate，阶段 5 是面向代理用户的 Deploy 和 Adopt，阶段 6 是 Handoff。复盘中沉淀的可复用资产会进入 Productize。

### 关卡如何运作

每个关卡由项目评审人（导师、教师或 AI 工程师）检查；每一页提到的“评审人”都是指他们。通过项目的提交渠道提交关卡交付物。关卡未通过时，按评审人指出的问题修改后重新提交。本模块按关卡计通过 / 不通过：六个关卡按顺序全部签字通过，才算通过。

### 选择项目

大多数学员会改编一个 M6 的原型案例；也可以在获批领域里做原创项目，前提是评审人批准它的问题简报。获批领域包括金融、医疗、内容、教育，或评审人批准的其他领域。每个原型案例都有一份 PRD 和技术设计可供对照：

- [辅导 / 客服 RAG](../../m6/01-education-rag/01-case-overview.md)
- [内容运营](../../m6/02-content-operations/01-case-overview.md)
- [医疗服务机构调研](../../m6/03-provider-research/01-case-overview.md)
- [交易台](../../m6/04-trading-desk/01-case-overview.md)

[跨案例对比](../../m6/05-cross-case/01-comparison.md) 比较了它们的难度。本模块的示例都以 Course Support Assistant（课程支持助手）为例，它基于“辅导 / 客服 RAG”构建。

## 常见误区

- **“实战项目比的是谁做的 agent 最炫。”** 一个范围窄、评测诚实、交接干净的系统，胜过一个只能在演示里跑通的宏大系统。
- **“我已经知道要做什么了，可以跳过需求发现。”** 评审人首先检查的就是需求发现资料包；问题没有经过验证的项目过不了阶段 1。
- **“目标是把所有功能都做完。”** 关卡检查的是冻结的范围，以及一份清楚列出你推迟了哪些内容的清单。

## 典型面试题

<details>
<summary>讲讲你端到端交付过的一个项目。</summary>

按演示叙事的顺序讲：问题、原有工作流、解决方案、可运行的系统、评测、局限、价值。提一处你砍掉的范围，以及一个你发现并修复的失败。

</details>

<details>
<summary>你是怎么判断这个项目值得做的？</summary>

讲验证这一步：问题真实存在的证据，确认数据和权限可用的检查，价值估算，以及在写代码之前做出的 go / no-go 决策。

</details>

## 延伸阅读

- 书：Shape Up（Basecamp，免费在线阅读）：[Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03)（划定边界）、[Get One Piece Done](https://basecamp.com/shapeup/3.2-chapter-11)（先完成一块）、[Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14)（决定何时停下）。

## 相关页面

- [项目选择](../01-practicum-kickoff/01-project-selection.md)
- [客户演示叙事](../06-demo-handoff-postmortem/01-client-demo-narrative.md)
- [FDE 交付生命周期](../../m0/03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)（M0）
- [案例研究结构](../../m8/01-portfolio-case-study-resume/01-case-study-structure.md)（M8）
- [作品集构成](../../m8/01-portfolio-case-study-resume/04-portfolio-composition.md)（M8）
