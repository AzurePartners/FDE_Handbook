---
title: Forward Deployed Engineer
row: M0-L1.1
---
**一句话：** Forward Deployed Engineer（FDE，前线部署工程师）是嵌入某个具体客户的工程师，他要对一个系统在该客户真实的系统、权限和工作流里跑起来、被用起来、产生可衡量的结果负责。

## 是什么

"Forward deployed"借用自军事用语：部署在靠近前线的位置，而不是待在总部。放到软件里，意思是工程师在客户问题真正所在的地方工作（客户的数据、系统和人），而不是在供应商办公室里为一个抽象的用户开发。很多 FDE 是远程工作的；"前线"说的是离客户问题有多近，不是工位在哪里。

Palantir 在 2010 年代让这个角色广为人知。大约从 2024 年起，AI 公司和 AI Agent 创业公司大量采用它，因为 AI 产品在大型组织里几乎不可能开箱即用。Palantir 早期高管、后来担任 OpenAI 首席研究官的 Bob McGrew 把这种模式概括为"规模化地做那些无法规模化的事"。

定义里的关键词是**负责**。评价一个 FDE，看的是系统是否真的为这个客户起作用，而不是写了多少行代码、计了多少工时、交了多少文档。

## FDE 为什么需要

定义决定你在优化什么。一个以为工作是"去客户那里写代码"的工程师，代码合并就停下了。一个知道工作是"让它为客户起作用"的工程师，会继续推进数据访问、评测、上线、培训和移交，而大多数企业 AI 项目恰恰卡在这些环节。面试官会直接考这一点，比如问"为什么选 FDE 而不是软件工程师？"

## 核心概念

### "为客户起作用"指什么

| 条件 | 要问的问题 | 常见的失败方式 |
|---|---|---|
| 在真实环境中运行 | 它是否在 demo 之外，用真实数据、真实权限跑着？ | 数据访问或安全审查一直走不完，卡在 PoC |
| 被真实用户使用 | 目标用户是否在日常工作中使用它？ | 上线了，然后没人用 |
| 产生可衡量的结果 | 一个重要的指标是否相对 baseline 发生了变化？ | 没人测过"之前"，价值无法证明 |
| 可以被维护 | FDE 离开后，客户或产品团队能否继续运行它？ | 知识只在一个人脑子里 |

### 为什么 AI 让这个角色流行起来

Demo 和一个能用的企业系统之间的差距，在 AI 上最大。模型输出是概率性的，有用的数据分散在许多互不相通的系统里，Agent 需要有人去授予权限，质量必须用评测来证明而不能想当然。供应商无法在总部弥合这个差距，必须有人在每个客户内部去做。

### 这份工作不是什么

它不只是驻场写代码，不只是售前 demo，也不只是提建议。第 2 课会逐一画出这些边界。

## 常见误区

- **"FDE 就是经常出差的软件工程师。"** 地点是次要的。决定性的特征是对客户结果负责。
- **"FDE 是会写代码的客服。"** FDE 通常要负责生产系统，经常承担整个部署的资深级别责任。
- **"FDE 必须是机器学习专家。"** 大部分工作是集成、数据、评测和变革管理。需要多深的 ML 能力因公司而异。

## 典型面试题

<details>
<summary>你为什么想做 FDE 而不是软件工程师？</summary>

答案要落在"负责"上，而不是出差或工作多样：你想对一个系统是否真的为真实客户起作用负责，包括那些麻烦的部分（数据访问、采用、移交），并希望一线经验能影响产品。举一个你过去把事情推进到"代码合并"之后的例子。

</details>

<details>
<summary>用一句话说，FDE 负责什么？</summary>

让公司的产品或 AI 系统在一个客户的真实环境里跑起来、被用起来、产生可衡量的结果，并把学到的东西带回产品。

</details>

<details>
<summary>一个客户部署什么时候算"完成"？</summary>

当它用真实数据在生产环境运行，目标用户依赖它，事先约定的指标相对 baseline 有了变化，并且除你之外有人能运维它。代码合并或通过 demo 都不算"完成"。

</details>

## 延伸阅读

- 文章：[What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)（The Pragmatic Engineer，约 20 分钟，部分付费）— Palantir、OpenAI 等公司如何定义和配置这个角色
- 视频：[The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo)（Y Combinator Lightcone）— 从 02:19 "The Role of a Forward Deployed Engineer"开始看，约 10 分钟

## 相关页面

- [FDE 的四类责任](./03-four-fde-responsibilities.md)
- [FDE 头衔的差异](../02-fde-vs-adjacent-roles/01-fde-title-variation.md)
- [FDE 与软件工程师、AI 工程师](../02-fde-vs-adjacent-roles/03-fde-vs-software-and-ai-engineer.md)
