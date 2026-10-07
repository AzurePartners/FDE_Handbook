---
title: 候选发布版本
row: M7-L5.4
---
**一句话：** 候选发布版本是你认为已经可以交接的版本，它被冻结并打上标签，同时写明了支撑证据、未解决的问题和后续步骤。

## 是什么

经过代理用户测试、反馈分诊和回归重跑之后，你停止改动，给一个构建版本命名：`rc1`。从这时起，只有阻塞性的修复才能进入，而每一次这样的修复都会产生 `rc2`。你演示和交接的，就是这个候选发布版本。

Course Support Assistant（课程支持助手）的 rc1 是一个确定的组合：某个提示词版本、截至某个日期的文档集、某个模型及其设置，以及一份配置。如何记录这些内容见[版本记录](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)，构建、测试、部署、回滚的完整周期见[构建、测试、部署与回滚](../../m4/05-deployment-ci-cd-observability-and-production-readiness/01-build-test-deploy-and-rollback-ci-cd-basics.md)（M4）。它在“演示、MVP、试点”这条阶梯上处于什么位置，见[从演示到生产的成熟度阶梯](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md)（M4）。

请按这条阶梯给它定级。只经过代理用户测试的实战项目，处于 MVP 以下，最多算 MVP。只有当真实用户在他们真实的工作流中用过它，并且你拿得出试点所需的证据（成功标准、可观测性、安全审查、支持安排以及 go/no-go 计划），才能称它为试点（Pilot）。面试官会追问这一点，详见[成熟度标注](../../m8/01-portfolio-case-study-resume/03-maturity-labeling.md)（M8）。

## FDE 为什么需要

没有冻结的候选版本，客户周二看到的系统就和你周一测试的不一样，也没有人说得清某个回答为什么变了。有了命名的版本，你也才能回滚。

## 核心概念

### 你要交付什么

一页纸的候选发布版本记录。

```
RC：course-support-assistant rc1   日期：<日期>
版本：提示词 v7 | 文档快照 <日期> | 模型 <名称> | 配置 <hash>
证据：评测重跑结果表、3 次代理用户测试、运行日志链接
反馈日志：共 14 条；已修复 6 条，列为局限 3 条，下一阶段 3 条，个人偏好 2 条
剩余局限：（逐条列出，每条附变通办法）
下一阶段计划：（按优先级排序，注明负责人和大致工作量）
回滚：如何回到上一个版本
```

### 通过标准

- 一个陌生人也能准确说出 rc1 由哪些版本组成。
- 反馈记录中的每一项都有最终状态。
- 局限用用户能理解的话来写（比如“无法回答按国家区分的费用问题”），而不是内部术语。
- 下一阶段计划写明了哪些内容不在 rc1 中，以及原因。
- 冻结之后，没有任何改动是在没有新 rc 编号的情况下进入的。

### 如何切出候选版本

按顺序执行以下步骤：完成反馈记录，重跑关键用例，写好局限清单，记录版本，给构建打标签，最后才去约演示时间。任何一步没通过，打标签就要等。告诉客户的协调员他们正在测试的是哪个版本，这样每份反馈报告都能对应到具体的构建。

## 常见误区

- **“候选发布版本就是成品。”** 它是一个通过了你的标准的版本，仍可能带有已记录的局限。
- **“冻结之后做点小调整无伤大雅。”** 没有版本号的调整会破坏可追溯性。应该切出 rc2，并重跑关键用例。
- **“下一阶段计划就是一张愿望清单。”** 它是一份按优先级排序的清单，与真实反馈和已知局限挂钩。
- **“局限清单看起来太难看，可以删减一些。”** 隐藏了严重失败的构建，不能算候选发布版本。完整的清单才能建立信任。

## 典型面试题

<details>
<summary>一个版本要满足哪些条件，才能叫作候选发布版本？</summary>

关键评测在有记录的基线上通过，反馈都有最终状态，版本已经记录，局限已经写明，并且改动已经冻结。

</details>

<details>
<summary>冻结之后，最后一刻冒出一个 bug，你怎么办？</summary>

先判断严重程度。如果它阻塞了主要工作流或者是安全问题，就修复它，切出 rc2，并重跑关键用例。否则就把它记为已知局限。

</details>

<details>
<summary>如果重新来一遍，你会怎么做？</summary>

说出一个具体的改变，比如更早地冻结文档快照，这样测试之间的回答就不会来回变化。

</details>

## 延伸阅读

- 书籍章节：[Release Engineering](https://sre.google/sre-book/release-engineering/)（Google SRE Book，讲有版本管理、可复现的发布）。

## 相关页面

- [回归重跑](./03-regression-rerun.md)
- [客户演示叙事](../06-demo-handoff-postmortem/01-client-demo-narrative.md)
- [版本记录](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)
- [构建、测试、部署与回滚](../../m4/05-deployment-ci-cd-observability-and-production-readiness/01-build-test-deploy-and-rollback-ci-cd-basics.md)
- [从演示到生产的成熟度阶梯](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md)（M4）
- [成熟度标注](../../m8/01-portfolio-case-study-resume/03-maturity-labeling.md)（M8）
