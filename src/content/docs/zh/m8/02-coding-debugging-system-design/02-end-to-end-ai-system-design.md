---
title: 端到端 AI 系统设计
row: M8-L2.2
---
**一句话：** FDE system design 轮要求你设计一次跨 frontend、backend、data、tools、agents、state、auth、deployment 和 observability 的真实客户部署，评分看你说出的取舍多于你画出的框。

## 是什么

60 分钟一轮，题目类似"为一家医院设计一个私有化 RAG 系统，5,000 万份文档，受 HIPAA 约束"或"为一个替 500 名仓库经理改派运单的 agent 设计评估框架"。与经典 system design 不同，模型只是众多组件之一，客户的约束（身份系统、网络边界、合规、遗留数据）对设计的影响大于吞吐量数字。面试官想听一条从用户到数据再回来的连贯路径，带信任边界、失败模式，以及证明它有效的计划。

## FDE 为什么需要

这一轮是 FDE 生命周期中 Design 步骤的排练。评分标准与客户架构师会用的一样：设计是否尊重他们的 auth 和数据边界、你离开后能否被运维、模型出错时会怎样、成本多少。AI lab 的面试还格外强调评估："你怎么知道它有效？"是区分候选人的那个问题。

## 核心概念

### 九层，以及每层必须大声回答的一个问题

| 层 | 要说出的答案 |
|---|---|
| Frontend / Space | 谁用、从哪用、系统不确定时他们看到什么 |
| Backend | 哪个路由调模型、什么是确定性代码、限制是什么 |
| Data | 来源、新鲜度、溯源、PII 处理、每个来源谁负责 |
| Tools / connectors | 读还是写、每个工具的认证、schema、错误返回 |
| Agents / workflow | 用 workflow 还是 agent，为什么；循环在哪停 |
| State / memory | 什么被持久化、存哪、存多久、谁能读 |
| Auth | 身份提供方、在代码中强制的按用户权限、service account |
| Deployment | 客户 VPC 还是托管、secrets、回滚、环境 |
| Observability | 日志、每次模型调用和工具调用的 trace、指标、告警、eval 回归运行 |

### 先画信任边界

在画组件之前，先画出客户网络与其他一切之间的那条线。每一条跨线的箭头都需要一个认证机制和一个数据处理答案。

### 失败模式与各自的应对

过期数据、错误的工具参数、来自文档的 prompt injection、模型宕机、rate limit、无权限的用户。至少点出四个并说系统对每个怎么做。面试官在听：模型是否在任何动作上拥有最终决定权。

### 评估作为一个组件

eval 集放在哪、prompt 或模型改动后怎么重跑、通过阈值是多少、谁审查失败。没有这些的设计是 demo 架构。

### 带备选方案陈述取舍

"我选托管推理，因为客户没有 GPU 容量；代价是数据离开他们的网络，用零留存协议和调用前 PII 脱敏来缓解。备选方案——自托管开源权重模型——能解决边界问题，但要付出质量和他们无法配置人手的运维负担。"

## 常见误区

- **"我应该展示最完整的架构。"** 面试官明确要看先有 walking skeleton 再加固。见 [MVP 优先的设计演进](./03-mvp-first-design-evolution.md)。
- **"模型就是设计。"** 模型只是一个框。数据访问、权限和评估才是设计在客户环境中失败的地方。
- **"非功能需求是脚注。"** 延迟预算、单任务成本、隐私和审计通常是决定架构的约束。前五分钟就把它们问出来。

## 典型面试题

<details>
<summary>为一家银行的内部政策设计知识助手，你从哪开始？</summary>

澄清用户、源文档（多少、多久变一次、谁负责）、身份系统、任何东西能否离开网络。然后画信任边界、带每个 chunk 新鲜度和访问元数据的摄取路径、带按用户过滤的检索、带引用和拒答路径的 grounded 回答、eval 集。说清什么是确定性的（政策版本查询）、什么归模型（基于检索段落起草）。

</details>

<details>
<summary>交接之后你怎么知道系统还在正常工作？</summary>

版本化的 eval 集在每次 prompt、模型或索引改动后重跑并有通过阈值；每周抽样生产 trace 做错误分析；拒答率、groundedness、延迟和单任务成本的指标；客户侧一个会看 dashboard 的负责人。说出你会配置的第一条告警。

</details>

<details>
<summary>客户要求亚秒级响应，你的 RAG 路径要 1.5 秒。你怎么办？</summary>

先测量：检索、重排、生成各自一个数字。然后按便宜程度依次上杠杆——缓存高频查询、重排前裁剪候选集、流式输出以降低首 token 时间、分类步骤用更小的模型、预计算 embedding。说出每次改动后你会复查的质量指标。

</details>

## 延伸阅读

- 参考：[System Design Primer](https://github.com/donnemartin/system-design-primer) — 经典构件与面试章节
- 文章：[Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html)（Chip Huyen）— 一次加一层的 AI 专属层次
- 参考：[LLM System Design Interview](https://datatalksclub.github.io/podwiki/wiki/llm-system-design-interview/)（DataTalksClub wiki）— 画图前要问的问题、延迟/成本计划
- 参考：[AI System Design Guide](https://github.com/ombharatiya/ai-system-design-guide)（GitHub）— RAG、agents、evals 的题库与白板练习
- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic）— workflow vs agent，以及何时不加复杂度

## 相关页面

- [MVP 优先的设计演进](./03-mvp-first-design-evolution.md)
- [实用型 Coding 与 Debugging 轮](./01-practical-coding-and-debugging-round.md)
- [现场 Scoping](../03-fde-case-decomposition-customer-simulation/02-live-scoping.md)
