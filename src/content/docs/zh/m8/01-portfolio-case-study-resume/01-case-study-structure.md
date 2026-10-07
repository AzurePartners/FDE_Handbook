---
title: Case Study 结构
row: M8-L1.1
---
**一句话：** Case study 是按固定顺序写成的一个项目的书面记录——Problem → Discovery → Architecture → Trade-offs → Build → Eval → Failure → Outcome → Next Step——让读者能跟上你的判断，而不只是看到你的产出。

## 是什么

作品集 case study 是一份两到四页的文档（或 README 中的一节），把一个项目讲成一串决策。它不是功能清单，也不是 demo 视频。这九段顺序就是模块五的 FDE 交付生命周期压缩成的叙事：客户要什么、你发现了什么、你选择建什么以及为什么、你放弃了什么、你交付了什么、你怎么证明它有效、它在哪里坏了、客户那边发生了什么变化、你接下来会做什么。

## FDE 为什么需要

Hiring manager 会从你简历里挑一两个项目，用整场 screen 来谈。他们在检查：你能否说出自己的决策，你是否量化过任何东西，你是否知道系统在哪里失效。按这个顺序写好的项目，在问题被问出来之前就已经回答了。它也是 take-home 评审者希望和代码一起收到的文档：设计取舍说明的权重常常与代码本身相当。

## 核心概念

### 九个部分各自证明什么

| 部分 | 用一两段写 | 读者由此了解到你的什么 |
|---|---|---|
| Problem | 业务问题、用户、baseline（现在怎么做）、约束 | 你从客户出发，而不是从技术出发 |
| Discovery | 你问了什么、问了谁、什么让你意外 | 你不把第一个请求当成需求 |
| Architecture | 组件、数据流、模型放在哪、哪些是确定性代码 | 你能画出系统并解释每个框 |
| Trade-offs | 你否掉的两三个备选方案及原因 | 你做了选择，而不是用了默认值 |
| Build | 你实际实现了什么，范围如实陈述 | 你的范围声明与事实一致 |
| Eval | eval 集、指标、baseline、数字 | 你能回答"你怎么知道它有效？" |
| Failure | 真实失败案例以及你怎么处理 | 你知道系统的边界 |
| Outcome | 用户或业务发生了什么变化，标注证据强度 | 你把模型指标和业务价值分开 |
| Next step | 再给一个月你会做什么，以及你有意推迟的东西 | 你想到了 demo 之后 |

### 证据，不是形容词

每一段都应链接到一个产物：图、ADR、eval 表格、trace、changelog 条目、前后对比表。有链接的 case study 可以核验；没有链接的只是声明。

### 每段一页太长，一句话太短

每段 150–300 词。Eval 和 Failure 两段通常值得最多篇幅，因为它们最稀缺、最有说服力。

## 常见误区

- **"Case study 应该展示项目的成功。"** 有记录在案的失败和修复，比一个"从未失败"的项目更让评审者信任。没有 Failure 段的 case study 读起来要么没做完，要么没检验过。
- **"架构是最重要的部分。"** 没有 Discovery 和 Trade-offs 的架构，是谁都能画的一张图。体现判断力的是它周围的那几段。
- **"项目越多越好。"** 一个完整记录的项目胜过五个 README 存根。见[作品集构成](./04-portfolio-composition.md)。

## 典型面试题

<details>
<summary>从头讲一讲这个项目。</summary>

按九段顺序口述，把大部分时间放在 Discovery、Trade-offs 和 Eval 上。先说 baseline 再说方案（"现在一个分析师做一份报告大约两小时"），点出一个被否掉的备选方案，给出一个带 baseline 的 eval 数字，最后说下一步会做什么。

</details>

<details>
<summary>你怎么知道它有效？</summary>

描述 eval 集（多少条、怎么选的、谁标的）、指标，以及和 baseline 对比的数字。然后说出 eval 没覆盖的一点，以及你是怎么发现的。

</details>

<details>
<summary>如果重来一次你会怎么做？</summary>

指向一个具体的段：一个本该更早问的 Discovery 问题、一个现在会反过来选的 trade-off、一条本该最先写的 eval 用例。含糊的"多花点时间测试"是弱答案；具体的"我会在检索层之前先建 eval 集，因为第一版优化错了问题类型"是强答案。

</details>

## 延伸阅读

- 文章：[How to Build an AI Portfolio That Gets You Hired](https://ai-tldr.dev/learn/building-ai-apps/ai-career-path/build-ai-portfolio/)（ai-tldr）— 为什么一个小 eval 集和一份诚实的失败清单是杠杆最高的产物
- 文章：[AI & ML Engineer Portfolio: The Complete 2026 Guide](https://linkfolio.cv/blog/ai-ml-engineer-portfolio-guide-2026)（Linkfolio）— 以结果和系统开头，展示 evals，链接可运行的东西
- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic Engineering）— 可信的 Eval 段建立在什么之上
- 参考：[Architecture Decision Records](https://adr.github.io/) — Trade-offs 段背后的产物

## 相关页面

- [基于证据的简历条目](./02-evidence-based-resume-bullets.md)
- [成熟度标注](./03-maturity-labeling.md)
- [STAR 与项目深挖](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
