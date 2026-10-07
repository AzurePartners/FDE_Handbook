---
title: 成熟度标注
row: M8-L1.3
---
**一句话：** 你展示的每个项目都带四个标签之一——Demo、MVP、Pilot 或 Production——把项目标到高于它实际达到的等级，是最快失去面试官信任的方式。

## 是什么

成熟度阶梯的定义在[模块四第 5 课（M4-L5.4）](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md)，本页只是把它用在"怎么给自己的工作贴标签"上。按那里的定义：**Demo** 在 happy path 上把想法跑通一次，工程量极少。**MVP** 是给真实用户带来真实价值的最小版本，需要基本的可靠性和错误处理。**Pilot** 是带真实用户和成功标准的有限真实上线，需要可观测性、安全审查、支持和 go/no-go 计划。**Production** 是全面上线，需要完整的一套：可靠性、扩展、监控、事故响应、治理和维护。标签由证据决定，与 UI 有多精致无关。

## FDE 为什么需要

FDE 就生活在这些阶段的边界上：工作的很大一部分就是把客户从 Demo 推到 Pilot 再到 Production，并知道每一步需要什么。面试官听到"我们把它部署到了生产"，会追问规模、事故响应和现在谁负责。如果诚实答案是"那只是个 demo"，接下来的面试就变成了可信度问题而不是能力问题。反过来，一个说"这个到了 pilot，6 名用户按书面成功标准用了 3 周；没到 production，因为没有 on-call 轮值也没有治理负责人"的候选人，恰好展示了这个岗位要求的判断力。

## 核心概念

### 阶梯与证据

| 标签 | 最低证据（按 M4-L5.4） | 下一级才会加上、因此这一级仍缺的 |
|---|---|---|
| Demo | 在准备好的输入上跑过一次；录屏或现场演示 | 真实用户得到真实价值、错误处理、别人能不能跑起来 |
| MVP | 真实用户在核心路径上得到真实价值；基本可靠性和错误处理；别人能按说明跑起来 | 可观测性、安全审查、支持、书面成功标准和 go/no-go 计划 |
| Pilot | 有限的真实上线：真实用户、真实流程、确定时长、成功标准、可观测性、安全审查、支持、结束时的 go/no-go 决定 | 规模、全面上线量级的监控、事故响应与 on-call、治理、维护负责人 |
| Production | 全面上线，完整的一套：可靠性、扩展、监控、事故响应、治理、维护 | 按定义不缺；但要能说出仍然脆弱的部分 |

### 标签放标题里，不放脚注里

把标签放在读者第一眼看到的地方："支持助手（Pilot，6 用户，3 周）"。藏在后面的段落里，会被读成想让读者往高处猜。

### "Production-grade" 不是标签

"Production-grade code" 描述的是代码质量，不是系统经历了什么。只有当你也能说出它在哪里、为谁运行时才用这个词。

### 允许降级

如果一个东西在公司内部被叫作"production"，但没有监控、只有一个用户，在作品集里就标为 Pilot 或 MVP。你描述的是证据，不是复述公司的措辞。往上也一样：如果你的"pilot"有真实用户，但没有安全审查、没有可观测性、没有成功标准，那它是一个有用户的 MVP，诚实的标签就是 MVP。

## 常见误区

- **"有公开 URL 就是 production。"** 公开 URL 是托管，不是 production。Production 关乎全面上线、谁依赖它、它坏了会怎样。
- **"诚实标注会让项目显得小。"** 它让你显得可靠，而可靠正是这套面试筛选的特质。一个运行良好的 pilot 是极好的 FDE 故事。
- **"只有 capstone 需要标签。"** 每个产物，包括三个小的，都带标签。作品集里的一致性本身就是信号。

## 典型面试题

<details>
<summary>这个上过 production 吗？</summary>

用标签和证据回答："到了 pilot。通过客户的安全审查后，6 名客服按书面成功标准在真实工单上用了 3 周，有 trace 和我们每天看的 dashboard。没到 production，因为全面上线那一套还不具备：没有 on-call 轮值、没有事故流程、客户侧没有治理负责人。"如有必要，再说 production 需要什么。

</details>

<details>
<summary>从 pilot 到 production 需要什么？</summary>

说出 Production 这一级新增的缺口：面向全部用户的扩展、该量级下的监控与告警、事故响应流程和 on-call 轮值、治理（谁批准变更、谁审计）、客户侧的维护负责人、runbook。按风险排序。这是关于 FDE 生命周期的问题，不是关于项目的。

</details>

<details>
<summary>试点期间坏过什么？</summary>

至少准备一次具体事故和你做的改动。pilot 阶段说"什么都没坏"不可信。

</details>

## 延伸阅读

- 手册：[Demo → MVP → Pilot → Production 成熟度阶梯（M4-L5.4）](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md) — 本页所依据的定义
- 文章：[Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/)（Agility at Scale）— 阶段之间的 go/no-go 门槛，虚荣指标 vs 生产 KPI
- 文章：[Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html)（Chip Huyen）— 每个成熟度阶段加入什么
- 章节：[Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)（Google SRE）— 生产规模的监控意味着什么

## 相关页面

- [基于证据的简历条目](./02-evidence-based-resume-bullets.md)
- [作品集构成](./04-portfolio-composition.md)
- [MVP 优先的设计演进](../02-coding-debugging-system-design/03-mvp-first-design-evolution.md)
