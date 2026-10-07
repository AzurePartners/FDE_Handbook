---
title: 技能缺口学习计划
row: M8-L4.4
---
**一句话：** 技能缺口计划就是在 FDE 八个能力维度上，用四个熟练度等级——Know、Use、Build、Design——给自己打分，与目标岗位的期望对比，把差距变成一份短小、带日期的"要建的东西"清单，而不是"要读的东西"。

## 是什么

课程的能力模型（M5-L1.4）有八个维度：Systems、AI、Agents、Integration、Production、Discovery、Communication、Domain。评级有四级。**Know**：你能解释它并在别人的系统里认出它。**Use**：你能操作和配置已有的实现。**Build**：你能按 spec 自己实现并带测试。**Design**：你能针对特定客户在备选方案中选择它、论证取舍，并写出 spec 让别人去建。计划是一张表：你的当前等级、目标岗位的期望等级、每个缺口对应一个产物。

## FDE 为什么需要

FDE 岗位对各维度的权重不同：Palantir 式岗位期望 Integration 和 Systems 达到 Build、AI 达到 Use；AI lab 岗位期望 AI 和 Agents 达到 Build、Discovery 达到 Design；垂直 AI 创业公司期望 Domain 达到 Design。知道自己的等级，能告诉你该投哪一格（见 [FDE 与相邻岗位](./01-fde-and-adjacent-roles.md)），以及面试官问"你缺什么"时怎么答。它还让备考保持诚实：读可观测性的文章只能把你从零推到 Know；只有给真实系统加上仪表化才能推到 Build。

## 核心概念

### 自评表

| 维度 | "Build" 长什么样 | "Design" 长什么样 |
|---|---|---|
| Systems | 你部署并调试过带数据库、队列和外部 API 的服务 | 你能针对客户约束在计算、存储和消息选项间做选择 |
| AI | 你实现过带 eval 集的 RAG 或结构化输出 | 你能针对一个案例在 RAG、长上下文、微调之间选择并辩护 |
| Agents | 你建过带校验和停止条件的 tool-calling 循环 | 你能根据证据决定 workflow、单 agent 还是多 agent |
| Integration | 你接过带认证、分页、重试和错误返回的真实 API | 你能写出别人可实现的连接器契约 |
| Production | 你给自己运行的系统加过日志、trace、指标和一条告警 | 你能为客户定义"production"需要什么并排序 |
| Discovery | 你做过访谈并产出 stakeholder map 和 PRD | 你能调和冲突的 stakeholder 并设定客户接受的 non-goals |
| Communication | 你给非技术用户做过 demo、写过周报 | 你能向高管传达坏消息并谈判取舍 |
| Domain | 你能为一个行业的 workflow 和数据建模 | 你能分辨一个问题里哪些是领域特有的、哪些是通用的 |

### 缺口到产物

每个缺口变成一件带日期的可构建的东西："Production：Use → Build。10 月 20 日前给 capstone 加上 OpenTelemetry trace 和一条告警；写成产物 #3。"阅读清单是产物的输入，本身不是计划。

### 排序

先补目标面试中最常让候选人挂掉的缺口。AI lab 通常是 Discovery/Communication（case 和 simulation 轮）；Palantir 式通常是 Integration/Systems 深度。

### 每次面试后更新

每次被拒或某轮艰难都是一个数据点。当天就更新表格，趁记忆还没模糊。

## 常见误区

- **"我需要处处达到 Design。"** 没有岗位要求这个。大多数 FDE 岗位需要三四个维度的 Build、其余 Know 或 Use、一个维度的 Design。
- **"证书能补缺口。"** 证书把你推到 Know。面试官用你自己的产物考 Build 和 Design。
- **"计划是一次性的。"** 它是你求职期间持续更新的文档；作品集和计划应该始终一致。

## 典型面试题

<details>
<summary>你和这个岗位之间最大的差距是什么？</summary>

诚实地说出一个维度和一个等级（"生产可观测性我在 Use；我看过 dashboard，但只给一个小服务加过仪表"）、你为此做了什么、以及前 90 天你希望得到什么。具体胜过谦虚。

</details>

<details>
<summary>你会怎么安排前 30/60/90 天？</summary>

1–30 天：学产品和客户环境、旁听通话、交付一个小胜利。31–60 天：端到端负责一次部署、建一个可复用的集成。61–90 天：推动一项跨客户的改进、提出提高团队吞吐的流程或工具。把其中一项与你点出的缺口挂钩。

</details>

<details>
<summary>这个领域每月都在变，你怎么保持技能更新？</summary>

描述一个循环，不是一个清单：模型或工具变化时你会重建的一个小 eval 或连接器、一组你读的来源、一份记录什么改变了你想法的笔记。提一件上个季度因为新证据而具体改变的事。

</details>

## 延伸阅读

- 课程量表：八维度自评与 Know / Use / Build / Design 等级（模块五第 1 课）— 无需外部资源
- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced）— 六周计划与第一周的自我审计
- 文章：[Forward Deployed Engineer Interview Guide 2026](https://www.sundeepteki.org/advice/the-definitive-guide-to-forward-deployed-engineer-interviews-in-2026)（Sundeep Teki）— 岗位侧重如何因公司而异
- 参考：[Behavioral interviews](https://www.techinterviewhandbook.org/behavioral-interview/)（Tech Interview Handbook）— 用证据回答"你的弱点是什么"

## 相关页面

- [FDE 与相邻岗位](./01-fde-and-adjacent-roles.md)
- [作品集构成](../01-portfolio-case-study-resume/04-portfolio-composition.md)
- [基于背景的叙事](./02-background-based-narratives.md)
