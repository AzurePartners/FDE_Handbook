---
title: Agent Skills
row: M3-L2.1
---
**一句话：** Skill 是为某一类任务（比如对比同业公司、撰写备忘录）打包的一套有名字、可复用的步骤、检查和可选脚本，agent 只在任务需要时才加载它。

## 是什么

[AI agent](../13-agent-profiles/01-ai-agents.md) 的 [profile](../13-agent-profiles/02-agent-profiles.md) 说明它承担哪份工作。Skill 则说明这份工作里某一项反复出现的任务该怎么做：步骤、输入、输出、检查，有时还有脚本或参考文件。

打个比方，看航空公司的检查单：飞行员不会背下每一套程序，遇到相应的情形就抽出对应的检查单，而且检查单一更新，所有机组都能用上新版。

准确地说，Skill 是指令加上可选的文件，agent 通过一段简短的描述找到它，只在需要时才把它加载进自己的上下文。

## FDE 为什么需要

一家财富管理客户运行着一个调研 agent 和一个备忘录 agent，两者的系统提示词里各自粘贴了一份公司内部的同业对比方法。投资委员会修改同业规则后，只更新了调研 agent 的提示词，于是备忘录开始混用按两套规则生成的表格。两周后，一位投资组合经理才发现问题：这套方法只存在于各个 agent 的整段提示词里，没有任何测试覆盖到它。

FDE 把这套方法收进一个 `compare-peers` Skill，两个 agent 都加载它：比率计算放进脚本，另配 8 家示例公司及其预期表格，并指定了负责人。下一次规则变更，只改了一处，跑了一遍测试。（示例场景。）

## 核心概念

### Skill 里包含什么

除了指令，Skill 还可以打包脚本（比如比率计算）和参考文件（比如备忘录模板）。一个金融调研 agent 可能带有这些 Skill：

```text
research-company    根据申报文件和新闻整理背景
extract-financials  把申报文件中的数字提取成固定表格
compare-peers       与指定的同业公司对比各项比率
summarize-call      提炼财报电话会的要点
write-memo          按公司内部模板撰写投资备忘录
review-memo         对照委员会评分标准（rubric）审阅备忘录草稿
```

在请求用到某个 Skill 之前，agent 只能看到每个 Skill 的名称和简短描述。每个 Skill 的契约见 [Skill 输入、输出与检查](./04-skill-inputs-outputs-and-checks.md)。

### Skill 与提示词、工具和子 agent

| | 是什么 | 在 agent 的上下文中 | 最适合 |
|---|---|---|---|
| 系统提示词 | profile 和常设规则 | 始终在 | 适用于每个任务的规则 |
| Skill | 某一项任务的做法 | 需要之前只有它的描述 | 可重复的任务 |
| 工具 | 由你的代码运行的函数 | 它的定义，通常每次调用都在 | 数据访问和操作 |
| 子 agent（subagent） | 有自己上下文和权限的独立 agent | 只有它的结果 | 隔离、并行或受限的工作 |

它们可以组合使用：`compare-peers` 告诉 agent 该调用哪个[工具](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)，以及拿到结果后怎么处理。

### Agent Skills 格式与开放标准

Anthropic 于 2025 年 10 月 16 日推出 Agent Skills：它是一个文件夹，里面有一个 `SKILL.md` 指令文件，外加可选的脚本和资源（[格式与加载方式](./02-skill-md-and-progressive-disclosure.md)）。2025 年 12 月 18 日，Anthropic 把这一格式作为开放标准发布在 agentskills.io，该网站列出了几十个兼容的产品，包括 OpenAI 的 Codex、Google 的 Gemini CLI、GitHub Copilot 和 Cursor。兼容不等于完全一致：各家支持的字段和运行环境并不相同（Anthropic 的 API 不给 Skill 开放网络访问，Claude Code 则开放），所以每个 Skill 都要在实际部署的地方测试。

### 可维护、可测试、可复用

每套流程只有一个存放位置、一个负责人和自己的测试，并像代码一样做[版本管理](./06-skill-composition-and-versioning.md)。要分开测两件事：该用这个 Skill 的时候，agent 会不会选它；选了之后，输出对不对。而且同一个文件夹可以供所有需要它的 agent 使用。

## 常见误区

- **“Skill 不过是存下来的提示词。”** 它只在需要时才加载，可以打包脚本和文件，而且多个 agent 可以共用并测试它。
- **“agent 有了 Skill，就会照着做。”** 什么时候加载、遵循到什么程度，都由模型自己决定。硬性规则要放进代码，比如[操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md)。
- **“Skill 只能在 Claude 上用。”** 这一格式是开放标准，OpenAI、Google、GitHub 等都支持，只是各有一些差异。

## 典型面试题

<details>
<summary>什么是 Skill？</summary>

针对某一类任务、有名字且可复用的能力，agent 只在请求需要时才加载。它打包了步骤、输入、输出和检查，外加可选的脚本和参考文件。

</details>

<details>
<summary>Skill 和工具有什么区别？</summary>

工具是我的代码应模型请求而运行的函数，比如 `get_financials`。Skill 是模型要读的一套做法，比如公司内部的同业对比方法，它往往还会说明该调用哪些工具。

</details>

<details>
<summary>一个调研 agent 需要市场数据、公司内部的对比方法和一项独立的合规检查，你会怎么搭？</summary>

为市场数据 API 做一个工具；为这套方法做一个 Skill，由它调用那个工具和一个比率脚本；再做一个合规子 agent，它有自己的上下文和只读权限，因此能独立地审核备忘录。

</details>

<details>
<summary>某个平台声称支持 Agent Skills，你要检查什么？</summary>

它认哪些 frontmatter 字段，是否运行随 Skill 打包的脚本、网络受到什么限制，以及谁能安装和使用 Skill。然后我会在那个平台上跑每个 Skill 的测试用例，而不是相信那个标签。

</details>

## 延伸阅读

- 文章：[Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained)（Claude blog，约 12 分钟）
- 参考：[Agent Skills Overview](https://agentskills.io/home)（agentskills.io，约 3 分钟）
- 文章：[Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（Anthropic Engineering，约 8 分钟）

## 相关页面

- [AI agent](../13-agent-profiles/01-ai-agents.md)
- [SKILL.md 文件与渐进式披露](./02-skill-md-and-progressive-disclosure.md)
- [Skill 拆分](./03-skill-decomposition.md)
- [纯指令 Skill 与代码支撑的 Skill](./05-instruction-only-vs-code-backed-skills.md)
- [工具 schema 与工具设计](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md)
