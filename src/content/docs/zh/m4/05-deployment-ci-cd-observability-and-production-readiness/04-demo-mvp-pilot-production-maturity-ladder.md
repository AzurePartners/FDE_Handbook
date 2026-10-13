---
title: Demo → MVP → Pilot → Production 成熟度阶梯
row: M4-L5.4
---
**一句话：** 软件按 Demo、MVP、Pilot、Production 这几个阶段逐步成熟，每个阶段对工程和治理（可靠性、安全、可观测性、用户支持）的要求都更高，所以知道自己处在哪个阶段，就知道下一步需要什么，也能避免把 Demo 当成产品。

## 是什么

一个系统会沿着成熟度阶梯向上爬：

- **Demo：** 证明这个想法行得通，但只跑通一次，且只走正常路径；工程投入极少。
- **MVP：** 能给真实用户带来真实价值的最小版本；需要基本的可靠性和错误处理。
- **Pilot：** 在真实环境中有限范围地推出，面向真实用户，并带有成功标准；需要可观测性、安全审查、用户支持，以及一份 go/no-go 计划。
- **Production：** 全面推出；需要整套能力：可靠性、扩展、监控、事故响应、治理和维护。

每一级台阶都抬高了工程和治理的门槛。这个阶梯就是一份检查清单，用来回答“这个阶段到底需要什么？”

## FDE 为什么需要

一个常见又代价高昂的错误，是把 Demo 当成已经生产就绪，承诺一个光鲜的 Demo 可以直接上线。每往上一级，都需要上一级不具备的能力（真正的错误处理、安全审查、监控、用户支持）。了解这个阶梯，FDE 就能设定现实的预期（“这是个 Demo；上生产还需要 X、Y、Z”），为达到下一级台阶界定工作范围，并在工程和治理上的缺口变成事故之前就找出来。

## 核心概念

| 阶段 | 证明了什么 | 新增的要求 |
| --- | --- | --- |
| Demo | 这个想法有可能行得通 | 很少；只走正常路径 |
| MVP | 真实价值、真实用户 | 基本的可靠性、错误处理 |
| Pilot | 在现实中行得通（范围有限） | 可观测性、安全、用户支持、成功标准 |
| Production | 在规模化下行得通，并能持续 | 扩展、监控、事故响应、治理、维护 |

*（试点设计的细节见 [M5-L7.1](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md)。）*

## 常见误区

- **“Demo 能跑，所以可以上线了。”** 从 Demo 到 Production 要跨好几级台阶，每一级都要增加实实在在的工程和治理工作。
- **“每个阶段只是多打磨一下。”** 每个阶段增加的是不同的能力（安全审查、监控、用户支持），而不只是打磨。
- **“跳过 Pilot，直接上 Production。”** Pilot 能限制影响范围，并产出证据，为全面推出提供依据。

## 典型面试题

<details>
<summary>成熟度有哪几个阶段，每个阶段增加了什么？</summary>

Demo（想法跑通一次，工程投入极少）；MVP（给真实用户带来真实价值，有基本的可靠性和错误处理）；Pilot（有限范围的真实推出，配有可观测性、安全审查、用户支持和成功标准）；Production（全面规模化，配有监控、事故响应、治理和维护）。每一级都抬高了工程和治理的门槛。

</details>

<details>
<summary>为什么把 Demo 当成已经生产就绪是危险的？</summary>

因为 Demo 只证明了正常路径能跑通一次；它缺少真实用户所需要的错误处理、安全审查、可观测性、扩展能力和用户支持。原样上线，就意味着要在生产环境里、当着客户的面，以事故的形式把这些缺口一个个暴露出来。这个阶梯点明了往后每个阶段到底需要什么。

</details>

## 延伸阅读

- 文章：[Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html)（Chip Huyen；作为成熟度阶梯的渐进式搭建）
- 文章：[Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/)（阶段之间的 go/no-go gate）

## 相关页面

- [设计试点](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md)
- [构建、测试、部署与回滚](./01-build-test-deploy-and-rollback-ci-cd-basics.md)
