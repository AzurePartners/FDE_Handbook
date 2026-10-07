---
title: 导读
---
**一句话：** Module 6 讲解四个复杂度逐级上升的 Azure Partners 真实项目。每个项目都用同一套四件套交付文档来呈现，你可以看到同一套 FDE 方法如何落在四种不同的技术深度上。

## 这个 Module 是什么

Module 1 到 5 每页讲一个概念：RAG、tool calling、agent 状态、数据溯源、需求调研、范围管理。这个 Module 把这些概念重新组装起来。每个 lesson 是 Azure Partners 实际定过范围或做过的一个项目，通过团队为它写的文档来讲。

行业只是背景，不是重点。辅导助手、营销工作室、医生名单和交易研究台看起来毫无关联。它们共有一个问题，也是 FDE 每次都要问的问题：**这个问题真正需要的最少机制是什么？输出要满足什么条件，别人才能信任它？** 四个答案一个比一个重。每往上一级，都是问题本身的某个特征要求的，而不是为了显得高级。

## 复杂度阶梯

| Lesson | 案例 | 相比上一个案例新增了什么 | Agent 数量 |
|---|---|---|---|
| 1 | 教育辅导 / 客服 | 检索、引用、拒答和升级转人工，仅此而已 | 不需要 |
| 2 | 内容运营（Puffo Marketing Studio） | 职责分离、结构化交接、独立审核、人工编辑 | 4 |
| 3 | 医疗机构研究 | 两道人工 gate、掌管所有数字的确定性流水线、带有看不到答案的 critic 的挑战者 | 5 |
| 4 | 金融研究 / 交易研究台 | 时点数据、evidence ID、冻结的规则、发布检查、按真实结果打分 | 6 |

完整的横向对比表见 [跨案例对比](../05-cross-case/01-comparison.md)。

## 四件套交付文档

每个 lesson 都围绕同样的几份文档，按真实项目产出的顺序排列。每一份都约束下一份。

| # | 文档 | 回答的问题 | 负责人 |
|---|---|---|---|
| 1 | PRD | 做什么、给谁用、为什么做、哪些明确不做？ | 产品经理 |
| 2 | Technical Design | 怎么搭建？哪个组件负责哪个决策？ | 工程师 |
| 3 | Delivery Plan | 谁做什么、按什么顺序、每一块什么时候算完成？ | 工程师估时间；PM 砍范围直到排得下 |
| 4 | Repository | 设计落成的代码 | 架构师；是交付物，但不设页面 |

第 3 步的协商值得注意。只有工程师能说清一件事要做多久，PM 决定产品可以不要什么。一份排得进日历的计划，来自双方各尽其职，而不是一方压倒另一方。

代码仓库不公开，所以 handbook 不讲代码。取而代之的是，每个 Technical Design 页面都以一小节结尾，说明当前构建与设计的关系。Lesson 1 没有仓库，所以它的 Technical Design 之后有一页 [n8n 参考实现](../01-education-rag/04-reference-build-n8n.md)，承担同样的角色。

## 参考设计与真实文档

Technical Design 页面都按同一套九节骨架撰写，达到生产系统应有的标准：原则、架构与所有权、信任边界与 gate、状态与数据、独立检查、失败处理、评测、运维、当前构建。按顺序读完四份，就能清楚看到阶梯每一级到底新增了什么。

Lesson 2 到 4 的 PRD 和 Lesson 4 的 Delivery Plan 是项目的真实文档，以阅读指南的形式呈现。Lesson 1 没有项目文档，它的 PRD 和 Technical Design 是为 handbook 撰写的教学参考，并明确标注。

| Lesson | PRD | Technical Design | Delivery Plan |
|---|---|---|---|
| 1. 辅导 / 客服 RAG | 教学参考 | 参考设计，另有 n8n 参考实现 | 无 |
| 2. 内容运营 | 项目文档 | 参考设计 | 无 |
| 3. 医疗机构研究 | 项目文档 | 参考设计 | 无 |
| 4. 交易研究台 | 项目文档 | 参考设计，源自项目自己的文档 | 项目文档 |

## 怎么使用这个 Module

**如果你是新手（"先看地图"）。** 读每个 lesson 的 **案例概览**，再读 [跨案例对比](../05-cross-case/01-comparison.md)。大约半小时就能掌握整条主线。

**如果你在准备面试（"全部过一遍"）。** 完整读 Lesson 4。它的文档最全，也是面试官最会深挖的。每读一个 PRD 页面，先凭记忆说出产品规则再往下读，然后把 **典型面试题** 大声答一遍。

**如果你要写自己的文档。** PRD 和 Delivery Plan 以 Lesson 4 的页面作为参考格式；技术设计以四份 Technical Design 中的任何一份作为骨架。

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic）。本 Module 每个 lesson 背后"先用最简单方案"的原则。
- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic）

## 相关页面

- [案例概览：辅导 / 客服 RAG](../01-education-rag/01-case-overview.md)
- [跨案例对比](../05-cross-case/01-comparison.md)
- [术语表](../06-glossary/01-glossary.md)
