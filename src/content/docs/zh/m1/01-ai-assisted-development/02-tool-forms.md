---
title: AI 编程工具
row: M1-L1.2
---
**一句话：** AI 编程工具有不同的形态：一种是自动补全，在你打字时建议下一行；另一种是智能体式工具，能自行读代码库、规划改动、编辑多个文件、运行命令。你用的是哪种形态，决定了在无人看管时你该多大程度上信任它的输出。

## 是什么

“编辑器里的 AI”有两类。第一类是自动补全：你打字时，它建议接下来的一两行，你可以接受或忽略。它从不打开终端，不跑测试，也不碰你没在看的文件。

第二类是智能体式工具：你用自然语言给它一个任务，它会读取整个项目中的相关文件，规划改动，编辑多个文件，运行命令，然后向你汇报。它不太像更聪明的自动补全，更像一个你交了工单的初级工程师：速度快，但活儿还得有人检查。

Claude Code 和 Codex 是起步于终端（CLI）的智能体式工具，现在也提供 IDE 插件、桌面应用和网页版 agent（智能体）。Cursor 是一个完整的 IDE，既有自动补全，也有 agent 模式。三者都遵循“读取、规划、编辑、运行”的流程。

## FDE 为什么需要

客户团队可能已经有自己偏好的 AI 工具，FDE 需要用手头现有的任何一款都能高效干活。智能体式工具一次就能做出大范围、跨多个文件的改动，需要完整审查，这更像审查同事的 pull request，而不是扫一眼某一行建议。

## 核心概念

### 三款工具对比

| 工具 | 使用形态 | 免费选项（截至 2026 年 10 月） |
|---|---|---|
| Claude Code | CLI、IDE 插件（VS Code、JetBrains）、桌面应用、网页版 | 无，付费方案起步为 Pro，每月 20 美元 |
| Codex | CLI、IDE 插件、桌面应用、网页版（在 ChatGPT 中） | ChatGPT Free，有用量上限 |
| Cursor | 桌面 IDE、CLI、网页版 agent | Hobby 档免费 |

### Plan 模式

Plan 模式（规划模式）是这样一个步骤：AI 在做任何改动之前，先提出它打算做什么、大致怎么做。你批准或调整计划之后，它才开始编辑。这样能在十个文件被改动之前，而不是之后，发现理解上的偏差。

### 权限

智能体式工具在执行有风险的操作前会先征求同意，比如运行 shell 命令、删除文件、发起网络调用。你可以单次批准，也可以配置哪些类型的操作自动放行。正是在这一环，人可以在错误命令执行之前把它拦下来。

### 上下文文件简介

每种智能体式工具在会话开始时都会读取一个项目文件：`CLAUDE.md`、`AGENTS.md`，或者 Cursor 放在 `.cursor/rules` 中的规则。详见 [上下文管理](./05-context-management.md)。

## 常见误区

- **“自动补全和智能体式 AI 是一回事。”** 自动补全是在你打字时给出建议。智能体式工具会根据一条指令直接行动，编辑多个文件、运行命令。
- **“Claude Code 和 ChatGPT 一样有免费档。”** 它需要付费方案，起步为每月 20 美元的 Pro，或者按量付费的 API 额度。价格会变，请以厂商页面为准。
- **“IDE 里的 agent 和 CLI 里的 agent 工作原理完全不同。”** 两者都遵循同样的“读取、规划、编辑、运行”循环，区别只在于你在哪里输入、终端在哪里。

## 典型面试题

<details>
<summary>智能体式 AI 和自动补全有什么区别？</summary>

自动补全在你打字时建议下一行。智能体式 AI 接收任务描述，读取整个项目，规划并编辑多个文件，还能运行命令，最后汇报它做了什么。

</details>

<details>
<summary>用一两句话解释 Plan 模式。</summary>

AI 在编辑任何内容之前，先提出它打算改什么、大致怎么改，这样你可以在文件被改动之前批准或调整方向。

</details>

<details>
<summary>Claude Code、Codex 和 Cursor 中，哪个有初学者今天就能用上的免费选项？</summary>

Codex 可以在 ChatGPT 上免费使用，但有用量上限；Cursor 的 Hobby 档免费。Claude Code 没有免费档。

</details>

<details>
<summary>客户那边只装了 Cursor。和使用 Claude Code 相比，你的工作流会有什么变化？</summary>

变化不大，两者都遵循“读取、规划、编辑、运行”。你改用 Cursor 的规则文件，而不是 `CLAUDE.md`；改用它的 agent 面板，而不是终端。

</details>

## 延伸阅读

- 文章：[Claude Code best practices](https://code.claude.com/docs/en/best-practices)（Anthropic 文档，Claude Code 最佳实践，约 45 分钟）
- 课程：[Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action)（Anthropic Academy，Claude Code 实战）

## 相关页面

- [AI 编程工作流](./01-ai-coding-workflow.md)
- [上下文管理](./05-context-management.md)
- [开发环境](./03-dev-environment.md)
