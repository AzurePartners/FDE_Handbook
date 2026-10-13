---
title: Agent Profile（Profile.md）
row: M3-L1.2
---
**一句话：** agent profile 是一份简短的文档，把 agent 定义成一份工作（角色、目标、职责、禁止操作、输入、输出、升级条件和成功标准），它依据 agent 所服务的业务流程来写，而不是一句话的角色设定。

## 是什么

像“你是一名资深研究员”这样的角色设定，只告诉模型该用谁的口吻说话。profile 告诉它的是这份工作本身：它负责什么、绝不能做什么、接收和返回什么、何时该问人，以及怎样才算完成。

对新员工来说，一份岗位说明书（谁来分派工作、什么需要签字确认）比一句“你文笔很好”有用得多；profile 就是给模型的这样一份说明书。

`Profile.md` 是本手册给这个文件起的名字；各框架把它叫作指令（instructions）或系统提示词。提示词里的角色行（[提示词结构](../../m2/08-prompting-context-structured-output/01-prompt-structure.md)）限定的是单次请求的范围；profile 定义的则是跨越多个步骤和多次运行的一份工作。

## FDE 为什么需要

一家制造企业的供应商入驻 agent 只用一句话定义：“你是一名资深采购专员。帮忙办理新供应商入驻。”一个月内，它批准了两家供应商，发邮件向其中一家索要银行账户信息，还在验证失败后从邮件签名里抄了一个税号。由于没有定义它的工作，也就没有人追问过它为什么有写权限。

FDE 依据采购团队的入驻流程重新搭建了它：它负责准备入驻资料包，绝不批准供应商，也不经手银行账户信息；税号对不上时转给合规团队；每一个检查清单条目都有证据或已标出缺口，才算完成。写权限被撤掉了；这份 profile 由采购负责人负责，存放在客户的代码仓库中。（示例场景。）

## 核心概念

### 从角色设定到岗位定义

从业务流程出发，而不是从一个形容词出发。OpenAI 的 agent 指南建议依据“现有的操作规程、客服话术或政策文档”来写指令；然后和流程负责人逐行确认。于是“你是一名一丝不苟的编辑”就变成了“对照审核清单检查草稿；逐项返回通过或不通过；绝不修改草稿。”每一行都应当能在输出或 trace 里查验。

### 最小 profile

一个 Content Research agent，写成 Claude Code 的子 agent（subagent）文件（`.claude/agents/content-research.md`）：frontmatter 配置运行时；正文则成为系统提示词。

```text
---
name: content-research
description: 当已批准的简报需要带来源的调研时使用。
tools: WebSearch, WebFetch, Read
---
角色：内容团队的调研员。
目标：给 Draft agent 提供它需要的一切，使它不必再做调研。
职责：查找可信来源；提取陈述并附上链接；列出缺口。
禁止：撰写文案；估算数字；使用黑名单中的来源。
输入：已批准的简报（主题、受众、问题）。
输出：调研简报（陈述、来源、缺口），状态为 done 或 needs_input。
升级：来源相互矛盾或缺失时，交给内容负责人。
成功标准：每条陈述都链接到支持它的来源；每个问题都已回答或已标出。
```

### Profile 存放在哪里

profile 放在 Anthropic 的 `system` 字段、OpenAI Agents SDK 的 `instructions`、Google ADK 的 `instruction`，或者像上面那样的定义文件里。编程 agent 也会读取仓库里的文件，比如 `AGENTS.md`（[AI 编程工具](../../m1/01-ai-assisted-development/02-tool-forms.md)），这类文件主要存放项目层面的指令，而不是某一个 agent 的工作。运行时会强制执行 `tools`（如果省略，子 agent 会继承所有可供子 agent 使用的工具），而正文只起引导作用（[禁止操作](./04-responsibilities-and-prohibited-actions.md)）。用 Git 给 profile 做版本管理（[提示词版本管理](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md)）。

### 对比 Research、Draft 与 Review

| | Research | Draft | Review |
|---|---|---|---|
| 负责 | 有来源的陈述、缺口 | 依照简报和风格指南撰写的文案 | 针对每个检查清单条目给出结论 |
| 绝不 | 撰写文案 | 添加未经调研的陈述 | 修改或发布 |

每一个“绝不”都是别人的职责。在 Anthropic 的研究系统里，像“调研半导体短缺”这样含糊的任务，常常让子 agent 误解任务，或者做重复的搜索。

## 常见误区

- **“规则越多，profile 越安全。”** Anthropic 警告说，硬编码“复杂而脆弱的逻辑”会让系统变得脆弱。把事实挪到[知识来源](./03-profile-vs-knowledge.md)，把流程挪到 [Skill](../14-agent-skills/01-agent-skills.md)。
- **“`description` 只是个标签。”** 父 agent 会读取它来判断何时委派任务。Google ADK 的文档更推荐“负责处理关于当前账单的咨询”，而不是只写“账单 agent”。
- **“profile 由工程师来写，业务方只看演示。”** 它的边界是业务决策，所以应由流程负责人批准 profile 及其每一次变更。

## 典型面试题

<details>
<summary>什么是 agent profile？</summary>

一份有版本管理的、针对单个 agent 的岗位定义：角色、目标、职责、禁止操作、输入、输出、升级条件和成功标准。它的文本会成为系统提示词；它的限制也在运行时里设置。

</details>

<details>
<summary>profile 和提示词里的角色行有什么区别？</summary>

角色行针对单次请求设定范围和语气；profile 则定义跨越多次运行的一份工作：agent 要交接什么、绝不能做什么、哪些情况要升级。

</details>

<details>
<summary>你会怎样定义一个负责催收逾期发票的 agent？</summary>

依据催收流程，并向信用控制专员了解：发送已批准的催款提醒并记录回复；绝不提供折扣或分期付款方案；遇到争议就升级；每张逾期发票都有了记录在案的下一步，才算完成。然后我会测试“我能付一半吗？”

</details>

<details>
<summary>Review agent 不审阅草稿，反而去改写草稿，你会修哪里？</summary>

我先查 trace 里有没有修改草稿的工具调用，再看 profile 里有没有“改进草稿”之类的措辞。然后我把输出改成按检查清单逐项通过或不通过，写明禁止修改，移除编辑工具，并补一条评测用例。

</details>

## 延伸阅读

- 文章：[A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)（OpenAI，约 20 分钟）
- 参考：[Simple agents](https://adk.dev/agents/llm-agents/)（Google ADK docs，约 10 分钟）
- 参考：[Create custom subagents](https://code.claude.com/docs/en/sub-agents)（Claude Code docs，文件格式部分约 15 分钟）

## 相关页面

- [AI agent](./01-ai-agents.md)
- [提示词结构](../../m2/08-prompting-context-structured-output/01-prompt-structure.md)
- [将 agent 知识与 profile 分离](./03-profile-vs-knowledge.md)
- [Agent 职责与禁止操作](./04-responsibilities-and-prohibited-actions.md)
- [Agent 成功标准与完成标准](./06-agent-success-criteria.md)
