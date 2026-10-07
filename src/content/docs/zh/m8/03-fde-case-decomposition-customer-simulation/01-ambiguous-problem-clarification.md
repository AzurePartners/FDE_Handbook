---
title: 模糊问题澄清
row: M8-L3.1
---
**一句话：** 当客户说"用 AI 提高销售/效率/研究质量"时，前十分钟属于六个问题——目标、用户、workflow、数据、baseline、constraints——面试官评分的是你有没有在提出任何方案之前先问它们。

## 是什么

Decomposition 或 open-ended case 轮以一个来自角色扮演客户的、故意模糊的题目开场：一座城市想缩短应急响应时间，一家银行想统一三个并购来的欺诈检测系统，一家药企想让研究员查询内部化合物数据。没有正确的架构，但有正确的第一步：大声澄清六个维度，标注你的假设，然后才拆解。Palantir 把这一轮叫作 decomposition，并发布过关于开放性问题的指引；如今所有 AI lab 和大多数创业公司都在跑某个版本，而它是通过率最低的一轮。

## FDE 为什么需要

这是 FDE 生命周期中 Discovery 步骤压缩成的一小时。面试官检查的和客户高管会检查的一样：你是把第一句话当成需求，还是去找它背后的问题？在第一分钟就跳到技术方案的候选人，是 FDE 面试中最常见的淘汰原因。会澄清、会点出缺失、会把假设摆在台面上的候选人，展示的正是让部署不去建错东西的行为。

## 核心概念

### 六个问题

| 维度 | 问什么 | 为什么会改变设计 |
|---|---|---|
| 目标 | 六个月后什么算成功？哪个数字要动？ | 优化响应时间、成本还是覆盖率，会得到不同的系统 |
| 用户 | 谁每天碰产出？谁拍板？谁怀疑？ | 决定界面、权限和采用风险 |
| Workflow | 现在一步一步怎么做？时间花在哪？ | 揭示 AI 该介入和不该介入的位置 |
| 数据 | 有什么、什么形态、多新、谁负责、能否离开网络？ | 数据访问通常是风险最高的未知项 |
| Baseline | 现在的数字是多少？怎么测的？ | 没有 baseline 就没有结果 |
| Constraints | 合规、身份、预算、时间线、什么不能变 | 约束比偏好更快地排除选项 |

### 标注假设

面试官不回答时（常常是故意的），陈述一个假设并做标记："我假设通话数据有时间戳和位置；如果没有，那就成为第零个工作流。"新信息到来时回头修订假设。

### 事实、观点、动机

来自模块五：把客户知道的、相信的和希望是真的三者分开。"销售下滑是因为销售花太多时间做研究"在你看到 workflow 之前只是观点。

### 半路的变数

预期中途会加一个新约束（"数据负责人刚说不允许外部 API"）。把它当作真正的考题：重述目标、调整假设，说出什么变了、什么没变。

### 时间分配

十分钟澄清，五分钟陈述假设和成功指标，然后拆解。更长就是拖延；更短就是猜。

## 常见误区

- **"提问浪费时间。"** 这一轮就是按提问打分的。什么都不问、给错误问题设计了完美系统的候选人会被淘汰。
- **"早点说出一项技术显得能干。"** 在了解 workflow 之前说出 RAG 或 agent，传递的是你把问题往工具上套。
- **"面试官不知道答案说明问题问得不好。"** 面试官不给答案，是在提示你做出并标注一个假设。

## 典型面试题

<details>
<summary>物流客户说"我们想要一个处理运单改派的 AI agent"。你先问什么？</summary>

目标：今天一次错误改派的代价是什么，他们想动哪个数字——延误、成本还是经理的时间？用户：现在谁做改派，谁签字？Workflow：带我走一遍从告警到系统变更的一次改派。数据：哪些系统存运单、天气和运力，多新，agent 能否写入？Baseline：每周多少次改派、每次多久、错误率。Constraints：是否每次变更都要人批准；哪些区域规则不同。

</details>

<details>
<summary>客户说不出 baseline。怎么办？</summary>

如实说明，然后提出前两周怎么得到一个：抽 50 个近期案例、计时、按结果分类。把 baseline 测量作为第一个交付物，并把成功指标标记为"暂定"直到 baseline 存在。

</details>

<details>
<summary>进行到一半，面试官说数据不能离开客户网络。什么会变？</summary>

重述目标，然后走一遍设计：除非有私有部署，托管推理出局；脱敏和本地检索成为必需；eval 集必须在网络内构建。说出什么不变：workflow、成功指标和人工审批门。

</details>

## 延伸阅读

- 文章：[How to Answer Decomposition Interview Questions](https://www.tryexponent.com/blog/decomposition-interview)（Aced）— 这一轮的端到端演练
- 文章：[Forward Deployed Engineer interview questions (2026): every round](https://dev.to/manduks/forward-deployed-engineer-interview-questions-2026-every-round-with-real-examples-4klc)（DEV）— 决定 offer 的 case study 轮
- 书：[The Mom Test](https://www.momtestbook.com/)（Rob Fitzpatrick）— 问过去的行为，不问观点
- 方法：[5 Whys](https://www.atlassian.com/team-playbook/plays/5-whys)（Atlassian）
- 视频：[How to Talk to Users](https://www.youtube.com/watch?v=MT4Ig2uqjTc)（Y Combinator，32 分钟）— 五个核心问题，不推销
- 参考：[Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success)（Claude docs）— 把目标转成可衡量的指标

## 相关页面

- [现场 Scoping](./02-live-scoping.md)
- [处理未知](./04-handling-unknowns.md)
- [端到端 AI 系统设计](../02-coding-debugging-system-design/02-end-to-end-ai-system-design.md)
