---
title: FDE 与相邻岗位
row: M8-L4.1
---
**一句话：** Forward Deployed Engineer、Applied AI Engineer、Solutions Engineer、AI Consultant 及其邻近岗位，不是靠"写不写代码"区分，而是靠模块零的三个问题——代码是否进入生产、现场经验是否回流到公司自有的产品、岗位是否按结果考核——知道你想要哪组答案，决定了你投哪里、怎么讲故事。

## 是什么

模块零用"对什么负责"来定义 FDE（[FDE 的四类责任，M0-L1.3](../../m0/01-what-is-an-fde/03-four-fde-responsibilities.md)），并给出三个判据来给任何岗位定位（[角色判据，M0-L2.2](../../m0/02-fde-vs-adjacent-roles/02-role-tests.md)）。本页把它们用到求职上。FDE 处于售后，在客户环境里基于自己公司的产品构建，交付按生产标准要求的代码，把学到的东西带回产品，并按采用率、客户指标等结果考核。每个相邻岗位都至少在一个判据上给出不同的答案。Solutions engineer 和 sales engineer 处于售前，写 demo 或 PoC 代码，按技术层面的赢单考核。Solutions architect 设计然后交出去。Applied AI Engineer（Anthropic 和许多 AI 创业公司用的头衔）在三个判据上和 FDE 一样，只是更强调 evals 和模型质量。技术咨询和系统集成商确实会端到端地设计、构建和运营生产系统，也常有按结果付费的合同；不同之处在于他们跨多家供应商的平台工作，复用沉淀在公司的方法论而不是产品里（[FDE 与咨询、系统集成商，M0-L2.5](../../m0/02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)）。Implementation 和 professional-services 工程师配置一个固定的产品。核心软件工程师为所有客户构建产品本身。

## FDE 为什么需要

职位描述不断混用这些头衔，而 recruiter screen 开场就是"为什么是 FDE 不是 SWE"。定位不了岗位的候选人答不了这个问题。区别还决定备考方向：Palantir 式 FDE 面试考数据工程、本体建模和 decomposition；AI lab 考 RAG、evals、agents 和客户对话；solutions-engineering 面试考 demo 和异议处理。投错格子会浪费几个月。而对相邻岗位的轻慢回答（"顾问只是出主意"）会让面试官觉得你不了解自己要进入的市场。

## 核心概念

### 对比

| 岗位 | 生命周期位置 | 代码进入生产？ | 经验回流到公司自有产品？ | 考核依据 | 同时服务客户数（信号，不是定义） |
|---|---|---|---|---|---|
| Forward Deployed Engineer | 售后，嵌入式 | 是，按生产标准要求 | 是 | 结果：采用率、客户指标、扩单 | 一个到少数几个；也存在同时负责十个客户的多客户变体（见 M0-L2.1） |
| Applied AI Engineer | 售后，嵌入式或靠近产品 | 是 | 是 | 结果，外加 eval 与质量门槛 | 少数 |
| Solutions Engineer / Sales Engineer | 售前 | demo 和 PoC 代码 | 间接，作为对产品的反馈 | 技术赢单、成交 | 许多 |
| Solutions Architect | 售前后期、售后早期 | 有时；参考设计 | 有时 | 设计被接受并交接 | 若干 |
| 技术咨询 / 系统集成商 | 全生命周期，常负责运营 | 是，常常端到端 | 否；复用进入公司的方法论和加速器 | 按合同：工时、固定范围或结果 | 每个团队若干 |
| Implementation / Professional services | 售后 | 配置，少量代码 | 很少 | 配置好的产品上线 | 若干 |
| Software Engineer（核心） | 产品 | 是，在产品里 | 它本身就是产品 | 功能对所有客户发布 | 不适用 |

### 客户数是信号，不是判据

模块零描述了一个同时负责十个客户、为所有客户 on-call 的 FDE（[FDE 头衔的差异，M0-L2.1](../../m0/02-fde-vs-adjacent-roles/01-fde-title-variation.md)）。客户数多说明四类责任被摊得薄、岗位偏向 Production，但不说明它是不是 FDE 工作。把客户数和三个判据放在一起看。

### 读职位描述

用 M0-L2.1 的六个问题：代码最终跑在哪、之后谁维护；按什么考核；同时服务多少客户；是否有一个工作所依托并回馈的产品；谁决定做什么；多少时间面向客户。再看风格：evals、RAG 和 agents（AI lab）还是 pipelines、数据建模和平台配置（Palantir/Databricks）。

### 回答"为什么是 FDE 不是 SWE"

连到你已经选择做过的事：一次你直接和自己所建东西的用户打交道、对结果而非工单负责、或在别人的系统里修好问题的经历。"我喜欢和人打交道"和"技术版咨询"是会挂的答案。

### 公司类型（截至 2026 年）

前沿 AI lab（OpenAI、Anthropic、Cohere、Scale）、企业数据平台（Palantir、Databricks、Snowflake）、垂直 AI 创业公司（ElevenLabs、Sierra、Harvey、Decagon）、新增 FDE 团队的成熟公司（Salesforce、Adobe、Ramp、Rippling、四大咨询）。每类对各轮的权重不同。

## 常见误区

- **"顾问只出主意，FDE 才动手建。"** 技术咨询和系统集成商会设计、构建、集成并运营生产系统，不少还按结果付费。区分 FDE 的是产品：FDE 基于自己公司的产品交付，学到的东西回到产品里，于是下一个客户的服务成本更低。见 M0-L2.5。
- **"写生产代码的就是 FDE。"** 外包团队和集成商也写。看经验流向哪里、岗位按什么考核（M0-L2.2）。
- **"负责十个客户的 FDE 其实是 solutions engineer。"** 客户数改变的是责任摊得多薄，不是三个判据是否成立。Solutions engineer 处于售前、按成交考核，和客户数无关。
- **"Applied AI Engineer 是研究岗。"** 在大多数公司它就是换了名字的 FDE，只是 eval 更严格。

## 典型面试题

<details>
<summary>为什么是 FDE 而不是普通软件工程岗？</summary>

说出一段具体经历：你在客户的约束内工作、对结果负责，并且更喜欢这种方式。然后说你在核心 SWE 岗会怀念什么（直接的反馈循环、脏的真实数据），在销售侧岗位会怀念什么（成交后的 ownership）。

</details>

<details>
<summary>这和顾问有什么区别？</summary>

不在于写不写代码；好的技术顾问也交付生产系统。区别在产品关系：FDE 基于自己公司的产品构建，并把学到的东西回馈给产品，公司每个客户的成本随时间下降；岗位按结果而不是按利用率考核。说你想要其中哪一点、为什么。

</details>

<details>
<summary>这和 solutions architect 有什么区别？</summary>

架构师跨若干客户设计后交接；FDE 在客户环境里构建、上生产、坏了要负责，并按客户指标是否变动来考核。说你想要哪个、为什么，用你自己的工作作证据。

</details>

<details>
<summary>你觉得 FDE 每天实际做什么？</summary>

与 stakeholder 的 discovery 对话、生产代码（集成、pipeline、RAG 或 agent 组件、内部工具）、企业约束下的设计（身份、网络、合规、遗留数据）、事故响应，以及把模式反馈给产品团队。提一下你所面试公司的差旅或驻场实际情况，以及职位描述暗示的客户数。

</details>

## 延伸阅读

- 手册：[角色判据（M0-L2.2）](../../m0/02-fde-vs-adjacent-roles/02-role-tests.md) — 本页所依据的三个问题
- 手册：[FDE 头衔的差异（M0-L2.1）](../../m0/02-fde-vs-adjacent-roles/01-fde-title-variation.md) — 按责任读职位描述；六个问题
- 手册：[FDE 与咨询、系统集成商（M0-L2.5）](../../m0/02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)
- 文章：[What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)（The Pragmatic Engineer；部分付费）
- 文章：[Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)（Palantir）— "一个能力服务多个客户"vs"多个能力服务一个客户"
- 文章：[Forward Deployed Engineer vs Applied AI Engineer (2026)](https://fde.academy/blog/forward-deployed-engineer-vs-applied-ai-engineer)（FDE Academy）
- 视频：[Software 3.0](https://www.youtube.com/watch?v=LCEmiRjPEtQ)（Andrej Karpathy，YC AI Startup School）— 描述 AI 原生岗位的词汇

## 相关页面

- [基于背景的叙事](./02-background-based-narratives.md)
- [技能缺口学习计划](./04-skill-gap-learning-plan.md)
- [导言](../00-introduction/01-introduction.md)
