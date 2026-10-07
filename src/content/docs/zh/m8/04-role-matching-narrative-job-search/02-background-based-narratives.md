---
title: 基于背景的叙事
row: M8-L4.2
---
**一句话：** 你的面试叙事是一座从"你已经做过的事"通向 FDE 工作的桥——Domain Expert → FDE、Backend → FDE、AI Engineer → FDE、Startup Generalist → FDE——最结实的桥是"我已经非正式地做过这份工作，这是证据"。

## 是什么

叙事是开启 recruiter screen、并为后续每一轮定调的两分钟故事：你从哪来、带过来了什么、为补缺口刻意建了什么、以及为什么 FDE 是下一步而不是绕路。每种背景都有天然的强项和可预见的疑虑，叙事要在面试官提出之前先回应那个疑虑。课程的 Practicum 和 case artifacts 是让这座桥可信的证据。

## FDE 为什么需要

没有人带着完整的 FDE 画像来，招聘团队知道这一点。进入这个岗位最可靠的路径是：早期创业公司工程师、亲手写代码的 solutions architect、有生产部署经验的数据工程师、直接和客户打过交道的后端工程师，以及越来越多学会构建的领域专家。面试官筛的是：你是否清楚这份工作里哪些部分你没做过，并且有具体证据说明你能做。掩盖缺口的叙事在第一次深挖时就会失败；点出缺口并展示工作的叙事能通过。

## 核心概念

### 四座常见的桥

| 背景 | 带过来的 | 可预见的疑虑 | 能消除疑虑的证据 |
|---|---|---|---|
| 领域专家（金融、医疗、运营）→ FDE | Discovery 直觉、stakeholder 沟通、了解真实 workflow | 你能构建和调试生产系统吗？ | 有你自己代码的 capstone、带真实认证的集成、一个 debugging 故事、你建的 eval 集 |
| 后端/数据工程师 → FDE | 生产代码、集成、可靠性 | 你能做 discovery、能面对怀疑的 VP 吗？ | 真实或模拟项目的 stakeholder map 和 PRD、一次给非技术用户的 demo、一个"说不"的故事 |
| AI/ML 工程师 → FDE | evals、RAG、agents、模型判断 | 你能在别人乱糟糟的系统里交付并对结果负责吗？ | 有真实用户的试点、auth/权限集成、交接包、带成熟度标签的作品集 |
| 创业公司多面手 → FDE | 端到端 ownership、速度、和用户聊过 | 你在任何地方有深度吗、能在企业约束下工作吗？ | 一个深度产物（eval 框架或连接器）、合规意识的设计、体现刻意取舍的 ADR |

### 叙事模板

起点（一句）→ 你持续在做的、看起来像 FDE 工作的事（两句，含一个具体例子）→ 你识别出的缺口和为补它建的东西（两句，指向一个作品集产物）→ 为什么是这家公司的这个岗位（一句，具体）。

### 把 ownership 说明白

不管什么背景，叙事里至少要有一个你对结果而非任务负责的时刻：别人依赖的系统、你做出并捍卫的决策、你修好的失败。

### 按公司类型调整

同一叙事，面对 Palantir 式面试以生产可靠性开头，面对 AI lab 以 evals 和客户对话开头。改重点，不改事实。

## 常见误区

- **"我应该把自己表现成已经是 FDE。"** 面试官更尊重清晰的桥，而不是戏服。说出缺口和证据。
- **"领域专家拿不到 FDE 岗位。"** 领域知识加一次真实构建，是垂直 AI 公司最强的画像之一；疑虑在工程深度，capstone 就是回答。
- **"AI 工程师的路最容易。"** 他们的缺口最常见：没有面向客户的交付经历。要明确准备这个答案。

## 典型面试题

<details>
<summary>介绍一下你的背景。</summary>

两分钟，用上面的模板。以对这家公司的具体理由收尾。计时；多数候选人讲到四分钟，把场子讲丢了。

</details>

<details>
<summary>你从来没有面向客户的头衔。我为什么该相信你能做这部分？</summary>

给出非正式证据：你直接支持过的用户、给非技术观众做过的 demo、和 stakeholder 就某个需求推回过、capstone 里的 stakeholder map 和访谈笔记。然后说出你知道自己没做过的（比如向高管传达延期），以及你怎么练习的。

</details>

<details>
<summary>你是领域背景。凌晨两点集成坏了怎么办？</summary>

讲 capstone 里的 debugging 故事：失败、怎么复现、定位它的日志或 trace、修复、测试。然后承认第一次事故你会希望有资深工程师搭档，并说你会从中学到什么。

</details>

## 延伸阅读

- 文章：[Who Wants to be a Delta?](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035)（Palantir）— 一位后端工程师转向 forward-deployed 工作
- 文章：[Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)（Palantir）
- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced）— 最可靠的四种入行背景与"桥故事"
- 参考：[Behavioral interviews](https://www.techinterviewhandbook.org/behavioral-interview/)（Tech Interview Handbook）— 组织两分钟自我介绍

## 相关页面

- [FDE 与相邻岗位](./01-fde-and-adjacent-roles.md)
- [STAR 与项目深挖](./03-star-and-project-deep-dives.md)
- [基于证据的简历条目](../01-portfolio-case-study-resume/02-evidence-based-resume-bullets.md)
