---
title: 作品集构成
row: M8-L1.4
---
**一句话：** FDE 作品集是一个写成完整 case study 的深度 capstone，加上三个各证明一项不同能力的小型 case artifacts，全部标注成熟度，全部链接到审阅者能打开的东西。

## 是什么

构成规则是"一深三窄"。Capstone 是你的模块七 Practicum（或等价项目）：完整的九段 case study，含架构、ADR、eval 集、失败日志和交接包。三个小产物是一页纸的写作，各自锚定一项 capstone 没有充分展示的能力。作品集放在招聘方无需登录就能访问的地方：GitHub README、一个简单网站，或从简历头部链接的 Notion 页。

## FDE 为什么需要

FDE 面试官评估的是 T 型能力：在系统、AI、集成、生产、discovery 上有广度，在某一处有深度。一个项目展示不了全部，十个项目没人会读。Capstone 证明深度和端到端 ownership；三个小产物填补广度缺口。这样组织的作品集也提前准备好了面试故事：capstone 供项目深挖，每个小产物都是"讲一个你曾经……的例子"的现成答案。

## 核心概念

### 选择三个小产物

选 capstone 覆盖得薄的能力。常见选项：

| 产物类型 | 证明什么 | 课程中的例子 |
|---|---|---|
| 评估框架 | 你靠测量而不是靠希望 | 40 条 eval 集，带 rubric、baseline 运行和它捕获的一次回退（模块二第 5 课） |
| 集成或连接器 | 你能在别人的系统里工作 | 对真实 API 的只读查询工具，含认证、分页和错误返回（模块二第 4 课；模块四第 1 课） |
| Discovery 或 scoping 文档 | 你能找到真正的问题 | 模块五练习产出的 stakeholder map 加一页带 non-goals 的 PRD |
| 失败排查 | 你调试的是系统而不只是 prompt | 基于 trace 的失败归因，含修复和回归测试（模块三第 6 课） |
| 数据质量流水线 | 你能处理真实数据 | 公开数据集上的去重与新鲜度门槛（模块六第 3 课） |

### 一页产物模板

问题两句话，做了什么一段，一张图或一张表，证明有效的 eval 或检查，一个失败，一个链接。标题里带成熟度标签。

### 放在哪里

简历头部链接到作品集索引；每条简历 bullet 引用一个具体产物。每个产物链接到代码或文档。打不开的东西是声明，不是证据。

### 维护

淘汰不再代表你最佳水平的产物。2026 年求职时，作品集里领头的还是 2024 年的聊天机器人，发出的是错误信号。

## 常见误区

- **"有很多 repo 的 GitHub 主页就是作品集。"** 没写文档的 repo 不是可读的证据。三个有文档的产物胜过三十个没有的。
- **"Capstone 必须是我最炫的项目。"** 它必须是你能辩护得最深的项目。一个朴素但完整记录的项目，胜过一个你解释不清的雄心项目。
- **"交互式 demo 可以替代文档。"** Demo 展示 happy path，文档展示判断力。两者都用，但面试官读的是文档。

## 典型面试题

<details>
<summary>我应该先看你哪个项目？</summary>

点名 capstone，用一句话说明为什么（"那是我自己跑 discovery、建 eval 集、处理试点失败的项目"）。然后指向一个与你面试岗位相关的小产物。

</details>

<details>
<summary>我读了你的 eval 框架文档。为什么选那个指标？</summary>

解释客户或用户真正需要系统做对什么、这个指标为什么衡量了它、它没能衡量什么。然后提 baseline，以及改动后怎样重跑这个框架。

</details>

<details>
<summary>你的作品集缺什么？</summary>

诚实点出一项能力（例如"这里没有任何东西展示生产可观测性；我的试点有日志但没有告警"），并把它连到你的学习计划。见[技能缺口学习计划](../04-role-matching-narrative-job-search/04-skill-gap-learning-plan.md)。

</details>

## 延伸阅读

- 文章：[How do you become a Forward Deployed Engineer? (2026)](https://dev.to/manduks/how-do-you-become-a-forward-deployed-engineer-2026-2l8p)（DEV）— 招聘团队在找的三件作品集产物
- 文章：[AI & ML Engineer Portfolio: The Complete 2026 Guide](https://linkfolio.cv/blog/ai-ml-engineer-portfolio-guide-2026)（Linkfolio）— 五类突出的项目及呈现方式
- 文章：[How to Build an AI Portfolio That Gets You Hired](https://ai-tldr.dev/learn/building-ai-apps/ai-career-path/build-ai-portfolio/)（ai-tldr）— README 内容、no-answer eval 用例

## 相关页面

- [Case Study 结构](./01-case-study-structure.md)
- [成熟度标注](./03-maturity-labeling.md)
- [技能缺口学习计划](../04-role-matching-narrative-job-search/04-skill-gap-learning-plan.md)
