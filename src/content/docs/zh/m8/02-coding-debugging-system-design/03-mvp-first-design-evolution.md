---
title: MVP 优先的设计演进
row: M8-L2.3
---
**一句话：** 设计轮里，你先从证明风险最高部分的最薄端到端路径开始，然后一次加一个组件并说明理由，而不是在前五分钟画出一整套分布式架构。

## 是什么

MVP 优先演进是模块五"选择能工作的最简架构"在设计面试中的版本。你点出风险最高的未知项（通常是数据访问或集成，很少是模型），设计能端到端检验它的最小系统，然后口述升级路径：试点暴露问题时加什么，以及在那之前有意不做什么。这一轮结束时的架构可能和"一上来画全"的候选人画的一样，但面试官全程看着你为每个框给出理由。

## FDE 为什么需要

客户环境会惩罚过早的复杂度：每多一个组件都需要凭证、安全审查、负责人和 runbook。FDE 面试官——尤其在 AI lab——会明确扣分那些直接跳到完美生产设计的候选人，因为部署就是这样卡住的。他们想听到"这是证明我们能连上客户系统的最小路径；稳定之后，这是我们加固的方式"。这句话也说明你从内部理解 Demo → MVP → Pilot → Production 的阶梯。

## 核心概念

### Walking skeleton

一个用户、一个真实数据源、一次模型调用、一个输出、一个检查。逻辑可以先 mock，但集成必须真实。skeleton 的任务是回答"我们能拿到数据并返回吗"，不是"模型好不好"。

### 复杂度阶梯

规则/脚本 → 单次模型调用 → RAG → tool calling → workflow → 单 agent → 多 agent。只有当前一级在真实用例上明显失效时才升一级。说出你在哪一级、什么证据会让你往上走。

### 即使在 MVP 中也必须先有的不可妥协项

secrets 不进代码、对接客户身份系统的认证、输入校验、日志。这些不是"以后"的事，它们是 MVP 和 demo 的区别。

### 推迟，但带触发条件

每个推迟的组件都说明把它引入的触发条件："任务超过请求超时时加队列；eval 显示多跳问题检索命中率低时加 reranker；单任务成本超预算时加缓存。"

### 口述演进过程

60 分钟的可用结构：5 分钟澄清问题，10 分钟 skeleton，20 分钟按面试官提示逐层增加（"如果有 5,000 万份文档呢？"），15 分钟失败模式与评估，10 分钟取舍与你仍然不会建的东西。

## 常见误区

- **"从小开始显得初级。"** 从小开始并带有明确的增长触发条件是资深模式。一次画全反而显得你从没运维过任何东西。
- **"MVP 可以跳过 auth 和日志。"** 那就是 demo，面试官会直接说出来。
- **"演进就是加 agent。"** 大多数演进加的是数据质量、评估和可观测性，不是更多模型调用。把这点说出来。

## 典型面试题

<details>
<summary>你会先建什么？</summary>

穿过风险最高未知项的最薄路径。说出这个未知项（"我们能否在他们 VPC 内用 service account 读取工单系统的 API"）、检验它的两周 skeleton，以及你会从中学到什么。

</details>

<details>
<summary>你的设计里为什么没有队列？</summary>

因为当前需求里没有任何东西超过请求超时。说出会加队列的触发条件（长时任务、批处理、需要安全重试），以及如何在不改变现有接口的情况下加入。

</details>

<details>
<summary>面试官加了约束：现在有 5,000 万份文档、10,000 名用户。什么会变？</summary>

逐层走：摄取变成带新鲜度跟踪的批处理流水线；检索需要带元数据过滤和按用户权限检查的索引；出现缓存和延迟预算；eval 集扩展以覆盖新文档类型；可观测性变成强制项。说出什么不变：auth 模型和引用/拒答行为。

</details>

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic）— 只有在明显改善结果时才加复杂度
- 文章：[Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html)（Chip Huyen）— 逐个组件的增量构建
- 书：[Shape Up](https://basecamp.com/shapeup)（Basecamp，免费）— "先做完一块"与固定 appetite 作为设计工具
- 文章：[How to Answer Decomposition Interview Questions](https://www.tryexponent.com/blog/decomposition-interview)（Aced）— decomposition 框架中的 walking-skeleton 步骤

## 相关页面

- [端到端 AI 系统设计](./02-end-to-end-ai-system-design.md)
- [成熟度标注](../01-portfolio-case-study-resume/03-maturity-labeling.md)
- [现场 Scoping](../03-fde-case-decomposition-customer-simulation/02-live-scoping.md)
