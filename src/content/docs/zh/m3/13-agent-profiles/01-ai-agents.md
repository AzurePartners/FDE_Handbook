---
title: AI agent
row: M3-L1.1
---
**一句话：** AI agent 是这样一种系统：语言模型在循环中自己选择下一步（调用哪个工具、怎样处理结果、何时停止），朝着目标推进，而这一切都发生在代码设定的限制之内。

## 是什么

聊天机器人答完一句就等着。agent 拿到的是一个目标，比如“找出三条近期、有来源的远程办公统计数据”，然后自己琢磨出步骤：搜索、阅读、剔除一个 2019 年的数字、再搜索，直到三条都核实无误才停下。

打个比方，要穿过城区有三种办法：一个路口一个路口地给司机指路（聊天机器人），搭一条固定的公交线路（工作流），或者把地址告诉出租车司机（agent）。出租车司机自己选路线，交通规则和计价器照样管着他。

准确地说，Anthropic 把 agent 描述为“通常就是 LLM 基于环境反馈、在循环中使用工具”：模型读取每一个结果，再选择下一步动作（机制见[工具调用循环](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)）。循环外围的代码设定限制：可用的工具、步数、花费，以及哪些操作要等人批准。

## FDE 为什么需要

一家物流公司的“IT 支持 agent”其实是个聊天助手，它的提示词以“你是一名资深系统管理员”开头。它没有任何工具，却有两次对员工说“已完成，你的账号已解锁”，而实际上什么都没变。IT 部门的处理办法是：把它接入整个管理控制台。

FDE 指出，这其实是一个带着角色设定的聊天机器人，并把它重建成了 agent：一份简短的 profile，只读的状态查询，一个解锁工具（由代码限定，只能解锁已验证身份的需求方本人的账号），以及 10 步的上限。查询和解锁本人账号的操作自行运行并记录日志；授予访问权限要等 IT 人员处理；其余一切只生成一张起草好的工单。（示例场景。）

## 核心概念

### Agent、聊天机器人还是固定工作流

| 系统 | 谁来选下一步 | 示例 |
|---|---|---|
| 聊天机器人 | 人，每一轮 | 标题创意，由人逐条提出需求 |
| 固定工作流 | 代码，按固定顺序 | 调研、列提纲、起草、审阅，各调用一次 |
| Agent | 模型，在限制之内 | 一直挑选来源，直到三个数字都核实无误 |

OpenAI 的 agent 指南也是这么看的：“简单的聊天机器人、单轮 LLM 或情感分类器”都不是 agent。更多内容见[工作流与 agent](../15-agent-architectures/01-workflows-vs-agents.md)。

### 不只是一个提示词

搭建 agent 时，大致按下面的顺序添加各个部分：

- **[Profile](./02-agent-profiles.md)：** 这份工作、它的限制，以及何时升级。
- **[知识](./03-profile-vs-knowledge.md)：** 事实来自有人负责的来源，而不是写在 profile 里。
- **[Skill](../14-agent-skills/01-agent-skills.md)：** 可复用的流程，比如调研或审阅。
- **[代码](../14-agent-skills/05-instruction-only-vs-code-backed-skills.md)：** 用于精确、可重复步骤的脚本和检查。
- **[工具](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)：** 它能读取或改动什么。
- **[状态与记忆](../16-agent-state-memory/01-state-and-memory-types.md)：** 进度，以及哪些内容会带到下一次。
- **[多 agent](../15-agent-architectures/04-multi-agent-systems.md)：** 放在最后，只有单个 agent 不够用时才上；每多一个，都会增加成本和失败点。

### 自主程度的梯度

自主性指的是 agent 在人过目之前能走多远：

- **建议：** 它提出方案，由人来执行（比如一份调研简报）。
- **经批准后行动：** 它准备好具体操作，等人说“可以”再执行（比如发布）。
- **独立行动：** 它自己行动并记录日志，由人抽查样本（比如保存草稿）。

按操作逐个设定，从低处起步，随着 trace 和评测赢得信任再逐步调高。Claude Agent SDK 把这个旋钮做成了权限模式（permission modes），从 `plan`（只做规划、不做修改）到 `default`（需要审批）再到 `bypassPermissions`（不再提示）。参见[人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)。

### Agent SDK

Agent SDK 和框架负责运行这个循环，并增加会话、权限或追踪等能力：Claude Agent SDK、OpenAI Agents SDK、Microsoft Agent Framework、Google 的 Agent Development Kit（ADK）和 LangGraph（截至 2026 年 9 月）。Anthropic 建议先“直接使用 LLM API”，因为框架可能“掩盖底层的提示词和响应”。

## 常见误区

- **“agent 就是配了个好角色设定的提示词。”** 角色设定改变的是语气，而不是能力；没有工具、循环和代码限制，它就还是个聊天机器人。
- **“只要会调用工具，就是 agent。”** 固定的“先搜索再总结”流水线是工作流；agent 会自己选择下一步。
- **“自主性越高，agent 越好。”** Anthropic 警告说，自主性意味着“更高的成本，以及错误不断累积的可能”。每个操作只授予它所需的最低自主程度。
- **“模型自己知道什么时候算完成。”** 模型会提前收工，或者陷入循环，所以要用代码限制步数和花费，并检查[完成标准](./06-agent-success-criteria.md)。

## 典型面试题

<details>
<summary>什么是 AI agent？</summary>

这是一个系统：模型在循环中自己决定下一步（用哪个工具、结果意味着什么、何时停止），朝着目标推进，同时被限定在代码设定的工具、限制和审批之内。

</details>

<details>
<summary>agent 与聊天机器人、固定工作流有什么区别？</summary>

聊天机器人由用户决定每一轮怎么走；工作流由代码固定步骤；agent 则由模型来安排步骤，用可预测性换取灵活性。

</details>

<details>
<summary>要给一个负责调研、撰写和发布博客文章的 agent 划定范围，你会怎么做？</summary>

需要一份写明职责和禁止操作的 profile，把品牌事实作为知识，配上搜索和起草工具，再用代码限制步数、检查每个被引用的来源确实被检索到过；发布由编辑审批。第一步，我会先测试固定工作流是不是就够了。

</details>

<details>
<summary>你如何决定给 agent 多高的自主程度？</summary>

按操作逐个决定，看出错的代价有多大、能否撤销：读取和起草可以自行运行并记录日志；发布或付款要等审批，直到 trace 和评测证明可以放宽。

</details>

## 延伸阅读

- 课程：[What is an Agent?](https://huggingface.co/learn/agents-course/unit1/what-are-agents)（Hugging Face，约 6 分钟）
- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic，约 15 分钟）
- 文章：[A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)（OpenAI，约 20 分钟）

## 相关页面

- [工具调用循环与工具 trace](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [Agent Profile（Profile.md）](./02-agent-profiles.md)
- [工作流与 agent](../15-agent-architectures/01-workflows-vs-agents.md)
- [Agent 状态与记忆类型](../16-agent-state-memory/01-state-and-memory-types.md)
- [AI 编程工具](../../m1/01-ai-assisted-development/02-tool-forms.md)
