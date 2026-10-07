---
title: 配置、Skill 还是写代码
row: M7-L2.3
---
**一句话：** 对 MVP 中的每项能力，你都要决定是通过平台配置、可复用的 Skill、自定义代码来实现，还是有意推迟。

## 是什么

架构图上的每项能力都需要一种实现方式。能满足验收标准的方式里，成本最低的那个胜出。

- 配置：在平台里设置好，不写逻辑。本项目的 agent 平台（Puffo/Pavlov）用于快速配置 Space、对话入口和 agent 协作。
- Skill：编写可复用的指令（可以附带脚本），由 agent 在需要时加载。
- 代码：编写并测试你自己的程序，用于必须精确的步骤。
- 推迟：这次交付不做，列为非目标或后续阶段。

对 Course Support Assistant（课程支持助手）来说，聊天入口可以用配置实现；“用我们的客服语气回答并附引用”这一行为可以做成 Skill；退款窗口期的日期计算可以写成代码（具体某位学员是否符合退款条件，仍然交给人来判断）；多语言回答可以推迟。

## FDE 为什么需要

为平台已经提供的功能写代码，是在浪费时间。把精确计算塞进提示词，结果就不可靠。选错方式，就是两周的项目拖成四周的原因。

## 核心概念

相关概念页面有 [自建、采购还是配置](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/02-build-vs-buy-vs-configure.md)（M5），[Agent Skills](../../m3/14-agent-skills/01-agent-skills.md) 和 [纯指令 Skill 与代码支撑的 Skill](../../m3/14-agent-skills/05-instruction-only-vs-code-backed-skills.md)（M3），以及 [成本模型：token、模型选择与何时用代码](../../m4/04-reliability-cost-latency-and-scale/02-cost-model-tokens-model-choice-and-when-to-use-code.md)（M4）。

### 你要交付什么

一张能力决策表，每项能力一行：

| 能力 | 方式 | 理由 | 负责人 | 测试 |
|---|---|---|---|---|
| 聊天入口 | 配置 | 平台已提供，无需逻辑 | 我 | 学员能打开并提问 |
| 客服语气与引用格式 | Skill | 可复用的指令，不涉及精确计算 | 我 | 样例回答引用了来源 |
| 退款窗口期日期计算 | 代码 | 必须精确且可测试 | 我 | 单元测试用例通过 |
| 多语言回答 | 推迟 | 不在验收标准中 | 无 | 已列为非目标 |

### 决策问题（按顺序）

1. 它在验收标准里吗？不在就推迟。
2. 平台已经提供了吗？提供了就配置。
3. 它是判断或风格问题、措辞可以有变化吗？是就用 Skill。
4. 结果必须精确、可重复或可审计吗？是就写代码。

### 通过标准

- 架构图上的每项能力都有且只有一种实现方式。
- 每个“代码”行都说明了为什么配置或 Skill 不够用。
- 每个“推迟”行都出现在非目标里。
- 平台功能已在平台上实际确认，而不是想当然。
- 这张表符合你的时间预算（appetite）：所有“代码”行加起来，在时间内有可能做完。

## 常见误区

- **“写代码才是正经方案。”** 代码的构建和维护成本最高。只在必须精确的地方用它。
- **“程序能做的，Skill 都能做。”** Skill 是引导模型行为的。每次都必须算对的计算，应该放在代码里。
- **“推迟就是失败。”** 记录了理由的推迟，是范围控制。

## 典型面试题

<details>
<summary>你是怎么决定哪些写代码、哪些用配置的？</summary>

我按顺序问：它在验收标准里吗，平台提供了吗，它是判断问题还是需要精确，然后只把需要精确的部分写成代码。退款窗口期的计算写成了代码，因为日期算错会带来实际损失；具体某位学员的退款决定仍然由人来做。

</details>

<details>
<summary>你推迟了什么，为什么？</summary>

多语言回答。验收标准里没有任何一条需要它，而且文档全是英文，所以我把它记录为非目标。

</details>

<details>
<summary>什么时候用 Skill 是错误的选择？</summary>

当输出必须精确或可审计的时候，比如资格规则或金额合计。Skill 依赖模型遵循指令，而这一点是有波动的。我会把这一步移到经过测试的代码里。

</details>

## 延伸阅读

- 书中章节：[Risks and Rabbit Holes](https://basecamp.com/shapeup/1.4-chapter-05)（Shape Up，Basecamp，免费在线阅读），讲如何明确划出不做的工作。

## 相关页面

- [解决方案架构图](./02-solution-architecture-map.md)
- [MVP 冻结与变更控制](./04-mvp-freeze-and-change-control.md)
- [自建、采购还是配置](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/02-build-vs-buy-vs-configure.md)（M5）
- [Agent Skills](../../m3/14-agent-skills/01-agent-skills.md)（M3）
