---
title: 导言
---
**一句话：** 本手册覆盖 FDE 课程的最后一步：把你做过的东西整理成招聘方能核验的证据，并为决定 Forward Deployed Engineer offer 的那几轮面试做准备。

## 模块八的目的

走到这个模块时，你已经有了 Practicum 项目（模块七）、案例知识（模块六），以及一堆决策、评估和失败记录。这些东西本身不会让你被录用。它们必须被打包成陌生人十分钟就能核验的形式，也必须在 60 分钟面试的压力下随时调得出来。模块八讲的就是这两种转换。

这里的页面是从面试官那一侧写的。每个知识点都回答同一个问题：面试官想弄清什么，什么证据能让他确信？

## FDE 面试流程长什么样

各公司对轮次的叫法不同，但整体形状在 Palantir、OpenAI、Anthropic、Databricks、ElevenLabs、Salesforce 和大多数 AI 原生创业公司之间高度一致：3 到 6 周内经历 5 到 8 个阶段。

| 阶段 | 典型时长 | 在判断什么 |
|---|---|---|
| Recruiter screen | 30 分钟 | 为什么是 FDE 而不是 SWE；基本沟通；后续轮次的难度会被调到多高 |
| Hiring-manager screen | 45–60 分钟 | 对你一两个项目的深挖；ownership；判断力 |
| Coding / debugging | 60 分钟或 take-home | 面对脏数据的实用工程能力，不是算法题 |
| System design | 60 分钟 | 一次真实部署：数据流、auth、可观测性、失败模式、取舍 |
| Decomposition / open-ended case | 45–60 分钟 | 一个模糊的客户问题；你能否现场 scope |
| Client simulation / role-play | 45 分钟 | 汇报、反驳、传达坏消息，同时不过度承诺 |
| Behavioral / values | 45–60 分钟 | 关于 ownership、模糊性、失败、说"不"的 STAR 故事 |
| Take-home（AI lab 与部分创业公司） | 3–8 小时 | 构建一个小型端到端系统，然后为它辩护 |

有两轮在标准软件工程面试中没有对应物：decomposition case 和 client simulation。大多数淘汰发生在这里，原因多半是候选人把它们当成 system design 来答。Decomposition 格式由 Palantir 发明，现在已经是各家 FDE 面试的标志性一轮。

截至 2026 年底的公司要点：

- **Palantir（FDSE）：** recruiter call、coding screen、一场从 coding、decomposition、re-engineering（调试陌生代码库）、learning（把面试官当作活资源一起解题）和 system design 中抽取的 virtual onsite，最后是 hiring-manager final。Decomposition 几乎出现在每一轮 loop 中。面试期间禁止使用 AI 工具。
- **OpenAI（FDE）：** recruiter screen、约五小时的基于其 API 的 take-home、take-home walkthrough 并追问 RAG、evals 和 guardrails，然后是含 hiring-manager、technical 和 case 轮的 onsite。
- **Anthropic（Forward Deployed / Applied AI Engineer）：** recruiter screen、实用型 coding（rate limiter 和 streaming 题被频繁提及）、customer-conversation simulation、system design 和 values 轮。Anthropic 公开了候选人 AI 使用政策：可以用 Claude 备考并润色你自己起草的材料；除非另行说明，live 面试和 take-home 中不得使用 AI。

## 四课如何对应面试轮次

| 课程 | 对应的面试阶段 |
|---|---|
| 1. Portfolio、Case Study 与 Resume Packaging | 简历筛选、recruiter screen、hiring-manager screen、take-home 文档 |
| 2. Coding、Debugging 与 System Design | coding、re-engineering、take-home 答辩、system design |
| 3. FDE Case：Decomposition 与 Customer Simulation | decomposition case、client simulation |
| 4. 岗位匹配、面试叙事与求职策略 | recruiter screen、behavioral、决定投哪些岗位 |

## 如何使用本手册

这是一本参考手册，不是课程。左侧边栏是路线图；每页是一个知识点，结构相同：是什么、FDE 为什么需要、核心概念、常见误区、典型面试题（附参考答案）、延伸阅读。

**如果你刚开始求职：** 先读第 4 课（哪类岗位适合你），再读第 1 课（准备证据），最后读第 2、3 课（练习各轮）。

**如果你已经约好面试：** 直接去对应那一轮的课，读完误区，把每道典型题先大声答一遍再看参考答案。

每页都标注了大纲行号（如 `M8-L3.1`），可以追溯到 master curriculum。

## 延伸阅读

- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced，原 Exponent）— 逐轮拆解、50+ 题、六周计划
- 文章：[How do you become a Forward Deployed Engineer? (2026)](https://dev.to/manduks/how-do-you-become-a-forward-deployed-engineer-2026-2l8p)（DEV）— 五阶段流程与三件作品集产物
- 文章：[Anthropic 候选人 AI 使用指引](https://www.anthropic.com/careers)（Anthropic careers 页）
- 文章：[Inside the Palantir engineering interview loop](https://www.techinterview.org/post/3233476805/palantir-interview-process/)（techinterview.org）
- 文章：[What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)（The Pragmatic Engineer；部分付费）

## 相关页面

- [Case Study 结构](../01-portfolio-case-study-resume/01-case-study-structure.md)
- [模糊问题澄清](../03-fde-case-decomposition-customer-simulation/01-ambiguous-problem-clarification.md)
- [FDE 与相邻岗位](../04-role-matching-narrative-job-search/01-fde-and-adjacent-roles.md)
