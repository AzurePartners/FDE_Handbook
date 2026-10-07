---
title: STAR 与项目深挖
row: M8-L4.3
---
**一句话：** Behavioral 轮和项目深挖是同一种能力的两个方向：STAR 给一个 60–90 秒的故事一个形状（Situation、Task、Action、Result），FDE 版本再加上判断、取舍、失败和复盘，让面试官听到你怎么决策，而不只是发生了什么。

## 是什么

Behavioral 或 values 轮要故事：端到端负责一件事、一个难缠的 stakeholder、一个被逆转的坏决策、没有职权时推动对齐、信息不全时交付、一次失败、跨客户发现的模式、一次说"不"。项目深挖从你简历上选一项，花 45 分钟顺着面试官拉出的任何线索往下走。两者都按 ownership 语言、具体性和对错误的诚实打分。STAR 的 FDE 改编加三个节拍：你做出的**判断**和否掉的备选、故事里的**失败**或挫折、以及**复盘**——你会怎么做得不同。

## FDE 为什么需要

Behavioral 问题出现在 FDE 面试的每个阶段，包括 recruiter screen 和技术轮的开头；有些创业公司没有专门的一轮，而是在 case 里问。故事是面试官判断"没有公司的人在场时，你和客户在一起会怎么表现"的唯一证据。没有失败、没有取舍的故事会被读成排练过的或不是你的。深挖还额外检查简历是否属实；每条 bullet 都可能变成 45 分钟。

## 核心概念

### FDE 故事的形状

| 节拍 | 时间 | 说什么 |
|---|---|---|
| Situation | 10 秒 | 客户、约束、baseline |
| Task | 10 秒 | 你具体负责什么 |
| 判断 | 15 秒 | 决策、否掉的备选、为什么 |
| Action | 20 秒 | 你做了什么，用"我"陈述 |
| 失败 | 10 秒 | 出了什么错或差点出错 |
| Result | 15 秒 | 数字及证据强度；客户那边变了什么 |
| 复盘 | 10 秒 | 你会怎么做得不同 |

口述大约 90 秒。每个故事都计时，直到落在窗口内；面试官会追问，要留出空间。

### 要准备的八个故事

端到端 ownership；难缠的 stakeholder；逆转的技术决策；无职权的对齐；在截止日期和不完整信息下交付；一次失败和教训；跨客户或用户发现的、改变了团队做法的模式；对客户说"不"并守住。尽量把每个故事对应到一个作品集产物。

### 深挖准备

对 capstone，要能对任何组件往下走三层：为什么用这个检索方法、eval 显示了什么、哪个失败用例驱动了改动、trace 长什么样。面试官会一直拉线直到边缘；边缘应该是真实的未知，而不是你记忆的空白。

### "我"与"我们"

你的决策和行动用"我"，团队的用"我们"。面试官严格筛选能说清自己贡献的候选人；通篇"我们"的故事会被记为参与，而不是 ownership。

### 公司价值观

AI lab 在 behavioral 轮里评估使命契合。读公司公开的价值观和近期工作，确保至少两个故事能自然地连上，不要硬套。

## 常见误区

- **"STAR 就够了。"** 纯 STAR 产出一个整齐但没有判断的故事。加上决策、失败和复盘。
- **"故事越长越显深度。"** 深度来自追问。四分钟的回答剥夺了面试官追问的机会。
- **"失败故事应该有好结局。"** 应该有诚实的结局。带清晰教训和行为改变的失败，比靠运气救回来的更强。

## 典型面试题

<details>
<summary>讲一次你和客户意见不合并坚持立场的经历。</summary>

情境和他们想要什么；他们说对的部分；你坚持的原则（治理、书面 non-goal、安全）；你提供的替代选项；结果和之后的关系；下次你会更早做什么。

</details>

<details>
<summary>讲讲你交付过的技术上最有挑战的东西。</summary>

以客户问题开头，不以技术开头。然后是判断（选的方案和否掉的方案）、最难的部分、途中的失败、可衡量的结果、复盘。预期面试官会在某个组件上往下深挖三层。

</details>

<details>
<summary>讲一次部署出问题的经历。</summary>

对整个结果负责，包括你没建的部分。原因、第一个小时你做了什么、什么时候告诉客户什么、修复，以及之后的流程改动。

</details>

<details>
<summary>你逆转过什么技术决策？</summary>

见[技术债与架构变更故事](../02-coding-debugging-system-design/04-technical-debt-and-architecture-change-stories.md)。"我还没需要逆转过"是弱答案。

</details>

## 延伸阅读

- 参考：[Behavioral interviews & STAR](https://www.techinterviewhandbook.org/behavioral-interview/)（Tech Interview Handbook）— 基础方法与题库
- 文章：[Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde)（Aced）— 八类 FDE 故事与 60–90 秒规则
- 文章：[OpenAI Forward Deployed Engineer Interview](https://igotanoffer.com/en/advice/openai-forward-deployed-engineer-interview)（IGotAnOffer）— behavioral 问题出现在每个阶段
- 章节：[Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/)（Google SRE）— 失败故事的语气

## 相关页面

- [基于背景的叙事](./02-background-based-narratives.md)
- [Case Study 结构](../01-portfolio-case-study-resume/01-case-study-structure.md)
- [Stakeholder 模拟](../03-fde-case-decomposition-customer-simulation/03-stakeholder-simulation.md)
