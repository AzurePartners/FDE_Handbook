---
title: 上下文管理
row: M1-L1.2
---
**一句话：** 上下文管理就是决定把什么放进 AI 的上下文窗口，也就是它实际能看到的文本，因为除了眼前的内容，AI 对你的项目没有任何记忆。

## 是什么

上下文管理是使用 Claude Code、Codex、Cursor 等 AI 编程工具时最基本的协作模式之一。上下文窗口是 AI 模型在一次对话中能容纳的文本（消息、读过的文件、命令输出、它自己的回复），以 token 计量。AI 并不像共事一年的同事那样了解你的代码库。它只知道当前会话中输入、粘贴或读取进来的内容。它可能对一个从没打开过的文件给出信心十足却错误的回答，也可能在其他文本把十分钟前的某个决定挤出视野后，把它忘掉。

上下文文件负责在每次新会话中带上少量固定不变的信息，省得你反复输入。Claude Code 读取项目根目录下的 `CLAUDE.md`，Codex 读取 `AGENTS.md`，Cursor 读取 `.cursor/rules` 中的规则（以及 `AGENTS.md`），里面存放测试命令、目录结构之类的信息。它们不能代替你把某个任务所需的具体文件交给 AI。

## FDE 为什么需要

客户的代码库可能很大，没有被指向正确文件的 AI 工具只能靠猜，猜得像不像都有可能。FDE 如果只给出含糊的错误描述，而不是真实的堆栈跟踪，得到的也只会是含糊、通用的修复方案。准确地把 AI 需要的文件和错误交给它，结果就是一次修好，而不是当着客户的面猜上三轮。

## 核心概念

### 给 AI 什么

把它指向涉及的具体文件或函数，而不是整个仓库。粘贴真实的错误信息，而不是你转述的版本。精准的小范围上下文胜过庞大而模糊的上下文。

### 长会话会变差，那就重新开始

会话进行得越久，窗口里就塞满了旧的文件内容和走不通的尝试。相关细节被挤掉，回答开始跑偏。这是正常的限制，并不说明你做错了什么。解决办法是开一个新会话，或者压缩当前会话，丢掉其余内容。

### 子 agent 让上下文保持干净

有些工具支持子 agent（subagent）：为一个有明确边界的任务（比如搜索代码库）单独开的 AI 会话，它只汇报一个简短的结果，而不是把整个探索过程倒进你的主对话。

### 绝不该放进上下文的东西

永远不要把密钥、API key、密码或真实的客户数据粘贴进提示词。修 bug 不需要真实的密钥，用占位符就行。真实的客户数据要走经过批准的工具，而不是直接粘贴一行数据。

## 常见误区

- **“AI 会永远记住我们之前的对话。”** 它只知道当前窗口里的内容，或者上下文文件在会话开始时重新告诉它的内容。
- **“上下文越多越好。”** 超过一定程度后，无关的文本会挤掉真正重要的内容，让回答变差。
- **“有了 CLAUDE.md 和 AGENTS.md，就不用再把具体文件指给 AI 了。”** 它们只存放少量固定信息。具体任务仍然需要附上实际的文件。

## 典型面试题

<details>
<summary>用通俗的话说，什么是上下文窗口？</summary>

AI 模型一次能容纳并进行推理的文本，以 token 计量：包括你的消息、它读过的文件、它自己的回复。窗口之外的任何内容，它都看不到。

</details>

<details>
<summary>一个很长的 AI 会话开始给出更差的回答，你会怎么做？</summary>

重新开一个会话或压缩当前会话，然后只带回仍然重要的文件和信息，而不是继续往已经杂乱的上下文里堆东西。

</details>

<details>
<summary>CLAUDE.md 或 AGENTS.md 文件起什么作用？又不起什么作用？</summary>

这是工具在每次会话开始时都会读取的文件，存放少量固定信息，比如测试命令和约定。它不能代替你把任务所需的具体文件交给 AI。

</details>

<details>
<summary>为什么要用子 agent，而不是直接在主会话里做搜索？</summary>

子 agent 在自己独立的上下文中执行一个有边界的任务，只返回简短的结果，让探索过程中的噪音不进入主窗口。

</details>

## 延伸阅读

- 文章：[Claude Code best practices](https://code.claude.com/docs/en/best-practices)（Anthropic 文档，Claude Code 最佳实践，约 45 分钟）
- 文章：[Claude Code custom subagents](https://code.claude.com/docs/en/sub-agents)（Anthropic 文档，自定义子 agent，含只读评审模式）

## 相关页面

- [AI 编程工具](./02-tool-forms.md)
- [AI 代码审查](./06-verify-dont-trust.md)
- [密钥管理](../04-git-debugging-testing-security/09-secrets-management.md)
- 模块 2 深入讲解：[Token 与上下文窗口](../../m2/07-llm-application-foundations/02-tokens-and-context-windows.md)
- 模块 2 深入讲解：[上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- 模块 2 深入讲解：[上下文污染与上下文腐化](../../m2/08-prompting-context-structured-output/05-context-pollution.md)
