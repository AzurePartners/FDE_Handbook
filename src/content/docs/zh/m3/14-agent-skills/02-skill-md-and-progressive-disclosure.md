---
title: SKILL.md 文件与渐进式披露
row: M3-L2.2
---
**一句话：** SKILL.md 文件是打包一个 Skill 的 Markdown 文件：开头一小段头部说明这个 Skill 做什么、什么时候用，而渐进式披露（progressive disclosure）指的是 agent 只在需要时才读取其余内容。

## 是什么

Skill（见 [Agent Skills](./01-agent-skills.md)）是一个文件夹，其中唯一必需的文件是 `SKILL.md`。文件开头是称为 frontmatter 的头部，用 YAML（普通的 `key: value` 行）写在两行 `---` 之间；之后是用 Markdown 写的指令：步骤、示例和检查。参考文件、模板和脚本可以放在旁边。

Anthropic 把 Skill 比作一本编排得当的手册：先看目录，需要时才翻开某一章或附录。

准确地说，渐进式披露分三个层级加载一个 Skill：名称和描述始终加载，请求匹配时加载正文，只有正文指向随附文件时才加载这些文件。OpenAI 的 Codex 文档中记载的顺序与此相同。

## FDE 为什么需要

一家制造企业的法务团队给合同 agent 配了一个 NDA 审阅 Skill。律师很快发现，agent 给出的批注都很笼统，完全无视公司的审查手册（playbook），而且成本在上升。trace（逐步的运行记录）揭示了原因：描述写的是“法律文件助手”，律师输入的却是“帮我批注这份保密协议”，所以这个 Skill 很少被加载；一旦加载，它那 1,700 行的 `SKILL.md` 装着整本审查手册和六个国家的规则，会多占约 20,000 个 token。（示例场景。）

FDE 用律师的话重写了描述，把审查手册和每个国家一份的规则文件移进 `references/`，并把触发测试加进评测集。

## 核心概念

### 文件结构

```markdown
---
name: reviewing-ndas
description: 按公司审查手册审阅 NDA，标出需要修改的条款。当被要求审阅或批注 NDA 或保密协议时使用。
---
# 审阅 NDA
1. 运行 scripts/extract_clauses.py，列出 NDA 的各个条款。
2. 把每个条款与 references/playbook.md 对照。
3. 涉及国别规则时，只读 references/law-<country>.md。
输出：一张修改表（条款、审查手册规则、新措辞），格式参照 references/example-review.md。
返回之前，检查每处修改都引用了一条审查手册规则。
```

Agent Skills 开放标准要求有 `name`（最多 64 个小写字母、数字和连字符，须与文件夹同名）和 `description`（最多 1,024 个字符）。

### 描述就是触发条件

agent 通过把请求与描述相匹配来挑选 Skill，所以每条描述都必须说明这个 Skill 做什么、什么时候用，并且用第三人称、用用户的话来写。描述相互重叠，就会选错。YAML 写坏了同样会让 Skill 藏起来：没加引号的冒号（`Use when: ...`）会破坏头部，Claude Code 就没有可匹配的描述了。

### 什么时候加载什么

| 层级 | 何时加载 | 预算 |
|---|---|---|
| 1. `name` 和 `description` | 始终加载，启动时 | 每个 Skill 约 100 个 token |
| 2. `SKILL.md` 正文 | 请求匹配时 | 不超过 5,000 个 token 和 500 行 |
| 3. 参考文件、模板、脚本 | 正文指向它们时 | 打开之前不占用；脚本只返回输出 |

已安装的 Skill 每次调用的开销很小（见[上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)），不过 Anthropic 提醒，装得太多，agent 可能会漏掉合适的那个。参考文件要直接从 `SKILL.md` 链接；嵌套的链接可能只会被读到一部分。

### Skill 存放在哪里

- **项目文件夹：** Claude Code 读取 `.claude/skills/<name>/SKILL.md`，通过 Git 共享。
- **API 上传：** Anthropic 的 Skills API 为工作区存放一个压缩成 zip 的文件夹。
- **应用设置：** 每个 claude.ai 用户各自上传一个 zip。

各个使用入口各存一份副本，所以 Git 仍是事实来源。

### 第三方 Skill 就是安装的软件

Skill 的脚本和指令是以 agent 的访问权限运行的，所以 Anthropic 建议只用可信来源，并审计其中每个文件以及它会抓取的每个 URL。2026 年 2 月，研究人员报告在 OpenClaw 助手的市场 ClawHub 上发现了 341 个会窃取数据的恶意 Skill。要固定在你审查过的版本上（见 [Skill 组合与版本管理](./06-skill-composition-and-versioning.md)）。

## 常见误区

- **“agent 启动时会把每个 Skill 完整读一遍。”** 只读名称和描述，其余内容在需要时才加载。
- **“按需加载，所以 SKILL.md 多长都无所谓。”** 加载进来的正文会一直留在上下文里，与任务争抢空间。细节要挪进参考文件。
- **“Skill 只是文本，装上很安全。”** 它的指令可以让 agent 运行代码或把数据发送出去。要像审计软件一样审计它。

## 典型面试题

<details>
<summary>Agent Skills 中的渐进式披露是什么？</summary>

分阶段加载一个 Skill：名称和描述始终加载，每个约 100 个 token；请求匹配时加载正文；只有正文需要时才加载随附文件。

</details>

<details>
<summary>Skill 的描述和正文有什么区别？</summary>

描述是触发条件：它始终被加载，说明这个 Skill 做什么、什么时候用。正文是具体做法，只有 Skill 被触发之后才会读。

</details>

<details>
<summary>你会怎样重构一个涵盖五个国家、长达 2,000 行的 SKILL.md？</summary>

步骤、输出格式和检查留在正文里，控制在 500 行以内。审查手册和各国规则做成参考文件，从 `SKILL.md` 链接过去，这样 agent 只读它需要的部分。

</details>

<details>
<summary>有个 Skill 一直不会自行触发，你怎么排查？</summary>

我先检查 frontmatter 能不能被解析，因为 YAML 写坏了就没有可匹配的描述。然后在 trace 里把描述和真实请求对比，用用户的话重写描述，再补上应该触发和不应该触发的测试提示词。

</details>

## 延伸阅读

- 文章：[Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（Anthropic，约 8 分钟）
- 参考：[Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)（Anthropic Claude Docs，约 25 分钟）
- 参考：[Specification](https://agentskills.io/specification)（Agent Skills，约 5 分钟）

## 相关页面

- [Agent Skills](./01-agent-skills.md)
- [Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)
- [上下文工程](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [提示词注入与越狱](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md)
- [纯指令 Skill 与代码支撑的 Skill](./05-instruction-only-vs-code-backed-skills.md)
