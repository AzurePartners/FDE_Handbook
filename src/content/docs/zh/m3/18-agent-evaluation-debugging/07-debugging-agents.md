---
title: 用 trace 和评测调试 agent
row: M3-L6.7
---
**一句话：** 调试 agent，就是先复现一次失败，在它的 trace 里找到第一个出错的步骤，在原因所在的那一层修复（往往不是提示词），再用一个新测试和一轮评测来证明修复有效。

## 是什么

agent 出了问题，最容易想到的办法是再往提示词里加一行。借助 trace（对每次运行的逐步记录）和评测（在大量任务上运行的自动化测试）来调试，就是用证据取代这种猜测。

餐厅经理发现上桌的菜是凉的，不会去改菜单上的措辞，而是沿着后厨的出餐线一路查下去，找到菜变凉的那个工位。

agent 的行为来自好几个层，提示词只是其中之一。[trace](./02-agent-traces.md) 会告诉你是哪一层最先出了问题；评测则告诉你一次修复有没有帮上忙，有没有弄坏别的用例。

## FDE 为什么需要

一家软件公司的内容运营 agent（Research、Plan、Draft、Review）一直在发布去年的价格。好几周里，团队不断给 Draft 的提示词打补丁：“绝对不要猜测价格”“务必核实价格”，还有一张粘贴进去的价格表。每个补丁只修好一个例子；后来 Draft 干脆不再报价了。

FDE 把 12 个失败的任务各重跑了 5 次，把每一份 trace 都读了一遍。第一个出错的步骤出现在 Draft 之前：Research 的 `search_docs` 返回了一个已归档的价格页面，而 Review 没有任何规则能把它拦住。FDE 把已归档的页面从索引里移除，加了一段代码，把引用的价格与价格 API 做核对，把其中三次运行保存为[可重放测试](./06-replayable-tests.md)，并把 Draft 的提示词恢复了原样。评测显示没有价格错误，也没有新增的失败。（示例场景。）

## 核心概念

### 调试循环

```text
1 复现  用同一个输入重跑几次
2 定位  找出第一个输入、输出、工具调用、
        交接或状态变化出错的步骤
3 归因  说出是哪一层造成的
4 修复  只改一处，并且改在那一层
5 测试  把失败的那次运行变成可重放测试
6 重跑  对照基线，重新运行评测集
```

agent 在不同次运行之间是“非确定性的，即使提示词完全相同”（Anthropic），所以要衡量失败率。LangGraph 的 time travel 功能可以从保存下来的检查点重新运行，还可以带上修改过的状态，以便在出错的那一步验证修复。

### 按层修复

一旦[失败归因](./03-failure-attribution.md)指明了是哪一层：

| 原因出在 | 就在那里修复 | 它取代的提示词补丁 |
|---|---|---|
| 数据 | 数据源、索引或过滤条件 | “忽略旧页面” |
| 工具描述或 schema | 名称、描述、受约束的参数 | “使用正确的工具” |
| Profile 或 Skill 的指令 | 该条指令本身，并纳入版本管理 | 无：提示词本身就是修复 |
| 业务规则 | 用[代码](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)强制执行 | “再检查一遍计算” |
| 权限 | 权限的授予，或操作 gate | “绝不要打开工资单文件” |
| 超时或预算 | 根据成功运行的情况来确定上限 | “动作快一点” |
| Agent 边界 | 交接契约；合并或拆分 agent | “仔细阅读任务说明” |

### 为什么提示词补丁只是把失败挪来挪去

同一个提示词要应对所有用例，所以为某一次失败加的一行，会牵动其他用例（[提示词脆弱性](../../m2/08-prompting-context-structured-output/07-prompt-brittleness.md)）。补丁越堆越多，最后变成互相冲突的“务必”和“绝不”规则；而且不管怎么措辞，都修不好一条过期的记录、缺少的权限或过短的超时，模型只能想办法绕过去。Anthropic 在构建 SWE-bench agent 时，花在优化工具上的时间比花在提示词上的还多。只有当模型拿到了正确的信息和工具却仍然选错时，才去改提示词。

### 何时停止调试、转为重新设计

出现以下情况时就该重新设计：某一类失败在正确的层上修复之后依然存在，每次修复都会弄坏另一个用例，或者 trace 显示出结构性的原因（上下文塞得太满、工具功能重叠、交接时丢失信息）。OpenAI 的 agent 指南建议在“提示词里包含大量条件语句”时拆分 agent，但重新设计也可能意味着减少 agent 的数量，或者改用固定的工作流。把证据带到[选择 agent 架构](../15-agent-architectures/05-choosing-an-agent-architecture.md)里去讨论。

## 常见误区

- **“评测失败就说明 agent 错了。”** 有时错的是任务或评分器：Claude Opus 4.5 在 CORE-Bench 上只得了 42%，直到 Anthropic 发现评分过于死板、任务含糊不清，修复这些问题并采用更宽松的脚手架（scaffold）之后，分数升到了 95%。
- **“我修完之后它通过了，所以修好了。”** 对一个每 5 次会失败 1 次的问题，一次通过说明不了什么；先重跑它，再跑整个评测集。
- **“换个更大的模型就能修好。”** 再强的模型，也用不上工具从未返回过的记录，也用不了它没有的权限。

## 典型面试题

<details>
<summary>agent 做某个任务失败了，你怎么调试？</summary>

先复现，得到一个失败率；在 trace 里找到第一个出错的步骤，以及它所在的层；只修那一层；把这次运行保留为测试，再重新运行评测。

</details>

<details>
<summary>调试 agent 与调试代码有什么不同？</summary>

方法相同，证据不同：各次运行有差异，所以我要衡量失败率；我读的是一份决策的 trace，而不是堆栈跟踪；而且输出错了也不会报错。

</details>

<details>
<summary>trace 显示 agent 算错了折扣。你会去改提示词吗？</summary>

不会。如果它的输入没错，这种算术就该放进代码里：我会把折扣计算挪到一个经过测试的工具里，把这次运行保留为测试，再重新运行评测。

</details>

<details>
<summary>提示词已经改写了十次，失败却一直在换地方。接下来怎么办？</summary>

先冻结提示词，逐个定位每次失败的第一个出错步骤。数据、工具或交接方面的原因就在那里修；如果提示词已经是一堆条件语句，我会建议拆分 agent，并用评测来检验。

</details>

## 延伸阅读

- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，约 20 分钟）
- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic，约 30 分钟）

## 相关页面

- [复现、缩小范围、最小化](../../m1/04-git-debugging-testing-security/06-reproduce-narrow-minimize.md)
- [Agent 系统中的失败归因](./03-failure-attribution.md)
- [Agent 工作流的可重放测试](./06-replayable-tests.md)
- [提示词脆弱性与可移植性](../../m2/08-prompting-context-structured-output/07-prompt-brittleness.md)
- [选择 agent 架构](../15-agent-architectures/05-choosing-an-agent-architecture.md)
