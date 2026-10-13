---
title: Skill 拆分
row: M3-L2.3
---
**一句话：** Skill 拆分，就是把 agent 越来越长的大一统提示词拆成一个个独立的 Skill，每个 Skill 只负责一个步骤，输入和输出都能命名、能测试，而适用于所有步骤的规则仍留在 profile 里。

## 是什么

团队把每个新任务和每次修补都追加到同一份系统提示词里，直到它变成“超长提示词”：每条规则都对每个任务生效。拆分则是沿着真实流程的各个步骤把它切开，变成 agent 需要时才加载的 Skill。

设想整栋房子只接了一路电路：一只出故障的电水壶，就会让每个房间都黑灯；如果每个房间各有一路，故障就只留在原地，容易找，也容易测。

准确地说，每个 Skill 负责一个步骤，这个步骤的输入和输出都能命名、能检查；[profile](../13-agent-profiles/02-agent-profiles.md) 则保留适用于每个步骤的身份和规则。Decomposed Prompting 论文（Khot 等人，ICLR 2023）点出了好处：每个子任务的提示词都可以单独改进、进一步拆分，或者换成代码。

## FDE 为什么需要

一家云安全供应商的内容 agent 靠一份 6,000 词的系统提示词运行，这份提示词是 8 个月里一点点长出来的。为收紧草稿而加的一行（“要简洁”），让调研步骤丢掉了来源链接。法务提出的“绝不点名竞争对手”规则本是针对对外发布的文案，结果调研步骤在内部笔记里也不再点名这些公司。一篇文章写得不好，没人说得清是哪个步骤出了问题。

FDE 与内容负责人一起梳理出 5 个步骤，各有命名的输入和输出，每个步骤一个 Skill。禁止点名竞争对手的规则留在 profile 里，限定只对外发布的文案适用，并由审核 Skill 检查。现在修一处起草问题，只会动到起草这一步。（示例场景。）

## 核心概念

### 超长提示词的警告信号

提示词只增不减，因为没人知道删掉一段会弄坏什么。为一个任务写的规则，在另一个任务里也会触发。修好一个任务，另一个任务又坏了。OpenAI 的 agent 指南补充了第四个信号：“条件语句过多（多个 if-then-else 分支）。”

### 沿输入和输出来切

在工作交接的地方下刀：每个 Skill 接收一个命名的输入，返回一个同事能检查的输出。从客户书面的操作规程入手，而不是沿用旧提示词的段落划分。Content Creation 流程如下：

```text
profile    角色、受众、禁止宣称、升级条件（适用于每个步骤）

research   简报                   -> 来源笔记，每条陈述附一个链接
outline    简报 + 笔记            -> 提纲，每节附来源
draft      提纲 + 笔记            -> 草稿
review     草稿 + 简报 + 评分标准 -> 问题清单
revise     草稿 + 问题清单        -> 修订稿、变更日志
```

profile 保留在每个步骤都成立的内容；Skill 承载流程。Claude Code 的文档也是这么说的：始终加载的 `CLAUDE.md` 文件里，如果某一节“已经变成一套流程，而不再是一条事实”，就把它改成 Skill。像字数统计这种只有唯一正确答案的步骤，交给[代码](./05-instruction-only-vs-code-backed-skills.md)。

### 选择拆分粒度

| | 太粗 | 太细 |
|---|---|---|
| 示例 | 一个 `write-article` Skill，从调研一直到修订 | `write-headline`、`write-intro`、`add-links` |
| 症状 | 规则仍会冲突；失败难以定位 | 没人会单独检查的输出；交接更多 |
| 解决办法 | 在出现中间输出的地方拆开 | 把总是一起运行的步骤合并 |

大小合适的 Skill，其输出值得单独检查，其描述也不与其他 Skill 重叠，因为 agent 是依据[描述](./02-skill-md-and-progressive-disclosure.md)来选 Skill 的。

### 先单独测试每个 Skill

把真实的上游输出保存下来作为固定输入，比如给提纲 Skill 用的调研笔记，让每个 Skill 单独通过之后再串起来。然后测试整个流程，因为[错误会层层累积](../../m2/07-llm-application-foundations/07-chat-vs-system-reliability.md)。流程失败时，把每个步骤用它日志里记录的输入重跑一遍，找出最先出错的那个。

## 常见误区

- **“拆分 agent，就是给每个步骤配一个单独的 agent。”** Skill 是同一个 agent 加载进自己上下文的指令。另设 agent 会增加交接，需要有理由，比如权限不同。
- **“按规则类型（语气、SEO、法务）各做一个 Skill，是干净的拆法。”** 规则不是步骤：语气 Skill 没有自己的输入和输出，又处处都要用，所以它属于 profile 或某个共享文件。
- **“端到端流程通过了，说明每个 Skill 都没问题。”** 后面的步骤可能掩盖前面的错误；而流程一旦失败，又说不出是哪个步骤坏了。

## 典型面试题

<details>
<summary>什么是 Skill 拆分？怎么判断一个 agent 需要拆分？</summary>

把越来越长的提示词拆成 Skill，每个步骤一个，各有命名的输入和输出，同时由 profile 保留适用于每个步骤的规则。信号有：提示词只增不减，规则相互冲突，修好一个任务又弄坏另一个。

</details>

<details>
<summary>哪些内容属于 profile，哪些属于 Skill？</summary>

profile 放身份和适用于每个任务的规则：角色、受众、禁止操作、升级条件。Skill 放一套流程，只在对应任务出现时才加载。

</details>

<details>
<summary>你会怎样拆分一个市场团队的内容 agent？</summary>

我会和内容负责人一起梳理出调研、提纲、起草、审核和修订，每一步都有命名的输出，比如带来源的笔记。受众和禁止宣称的内容留在 profile 里，字数统计交给代码，每个 Skill 先在保存的输入上通过测试，再测试整个流程。

</details>

<details>
<summary>客户团队提议做 30 个微型 Skill，每种段落类型一个，你怎么回应？</summary>

各种段落类型总是在同一份草稿里一起运行，也没人会单独检查它们，所以我会把它们并进起草 Skill。只有在某个输出需要单独审核、且描述互不重叠的地方，我才会拆开。

</details>

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic，约 15 分钟）
- 文章：[A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)（OpenAI，约 20 分钟）

## 相关页面

- [Agent Skills](./01-agent-skills.md)
- [Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)
- [Skill 组合与版本管理](./06-skill-composition-and-versioning.md)
- [在 agent 之间拆分工作](../15-agent-architectures/06-splitting-work-across-agents.md)
- [可复用的提示词模板](../../m2/08-prompting-context-structured-output/03-reusable-prompt-templates.md)
