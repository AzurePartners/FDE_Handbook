---
title: 审核与 critic 模式
row: M3-L3.8
---
**一句话：** 审核或 critic 模式是增加一个步骤：在工作往下走之前，对照明确的标准检查它，把不合格的退回去修改，并在标准通过或达到上限时停止。

## 是什么

审核步骤会在下一步使用某项工作成果之前检查它，并把具体的失败项退回去重做一次。

打个比方，建筑检查员不会轻信电工，而是对照电气规范检测线路，列出每一处不合格，再回来复查一两次。

准确地说，这就是 evaluator-optimizer 循环：生成，对照标准评判，修改，重复，直到标准通过或达到上限。critic 可以是同一个模型（自我审核）、一次单独的调用或一个 Review agent，也可以是测试之类的代码。与离线给评测集打分的 [LLM 裁判](../../m2/11-ai-evaluation/07-llm-as-judge.md)不同，critic 检查线上实际处理的每一个条目，并引导它如何修改。

## FDE 为什么需要

一家财富管理机构的 Content Operations 流程（Research、Plan、Draft、Review）负责撰写每周市场评论。它的 Review agent 其实就是起草用的那个模型，被告知要“把它改到完美为止”。草稿循环了五六次，成本成倍增加，因为总有某个措辞还可以再润色。但合规部门还是发现了一个年初至今的收益率与基金说明书相矛盾，而审核者从未看到过那份说明书。

FDE 把数字和免责声明的检查挪进代码，由代码读取基金说明书里的数据；给一个独立的 critic 一份四项的、只分通过或不通过的评分标准（rubric）和调研笔记；把修改次数上限定为两次；并把仍然失败的稿件送给编辑。（示例场景。）

## 核心概念

### evaluator-optimizer 循环

Anthropic 的 *Building effective agents* 描述了这样一种做法：一次模型调用负责生成，另一次“在循环中提供评估和反馈”，适用于标准明确、且改进确实能带来可衡量提升的场景。OpenAI 的 Agents SDK 和 LangGraph 也都有相关文档：

```python
def produce(brief, facts, notes):
    draft = write(brief)
    for attempt in range(MAX_REVISIONS + 1):
        failures = code_checks(draft, facts)         # 先做精确检查
        if not failures:
            failures = critic(draft, notes, RUBRIC)
        if not failures:
            return {"status": "passed", "draft": draft}
        if attempt < MAX_REVISIONS:
            draft = revise(draft, failures)          # 只修改列出的问题
    return {"status": "needs_editor", "draft": draft, "failures": failures}
```

critic 返回[结构化输出](../../m2/08-prompting-context-structured-output/06-structured-output.md)：逐条评分项给出通过或不通过，并附上证据和修改建议。要在所有标准都通过时停止，而不是等 critic 挑不出新毛病时才停，同时要给轮数设上限：Google 的 ADK 文档就警告说，它的 `LoopAgent`“本身并不会决定何时停止循环”。

### 自我审核与独立审核者

自我审核成本低，用来润色就够了。Self-Refine（Madaan 等，2023）报告在七项任务上都有提升，但 Huang 等人（ICLR 2024）发现，没有外部反馈时，模型很难修正自己的推理，有时反而变得更差。

独立的审核者有自己的 profile，有一个带着来源、而不是带着起草对话的全新上下文，使用只读工具，比如 Claude Code 示例里的 code-reviewer 子 agent（subagent），还可能换用另一个模型。

### 怎样的 critic 才有用

critic 需要两样东西：一是一份明确的评分标准，其中的二元标准来自 agent 的[成功标准](../13-agent-profiles/06-agent-success-criteria.md)；二是外部信号：测试、校验器、重新计算的数字、来源。CRITIC（Gou 等，ICLR 2024）用工具检查改进了自我纠错。Anthropic 的 Agent SDK 指南把“清晰定义的规则”（并说明哪些规则没通过、原因是什么）列为最好的反馈，并把用 LLM 按模糊规则做评判称为“通常不是一种很稳健的方法”。

### critic 何时不划算

每一轮都要花一次评判和一次重写。关于多 agent 失败的 MAST 研究（Cemri 等，2025）发现，许多复核者只检查表面细节，比如代码能不能编译：一个生成出来的国际象棋游戏通过了审核，却没有对照国际象棋规则检查。在 [agent 评测](../18-agent-evaluation-debugging/01-agent-evaluation.md)中埋入已知的错误；如果某个 critic 抓不到任何代价高昂的错误，就把它去掉。

## 常见误区

- **“模型把自己的草稿再读一遍，就能发现错误。”** 没有新信息，自查就和草稿共享同样的盲区，还可能把对的答案改错。要给审核者来源、测试或评分标准。
- **“审核的轮数越多，输出越好。”** 每一轮都会增加成本和延迟，而且一次修改可能破坏原本已经通过的部分。要给循环设上限。
- **“有了 Review agent，输出就可以放心发布。”** 它只能发现自己的标准和输入让它看得到的问题；精确的事实应当放进代码，代价高的操作仍然需要[人工审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)。

## 典型面试题

<details>
<summary>evaluator-optimizer 模式是什么，什么时候适用？</summary>

一次调用负责生成，另一次对照明确的标准做评判，第一次调用据此修改，直到标准通过或达到上限。它适用于标准明确、反馈确实能带来可衡量提升的场景，比如翻译。

</details>

<details>
<summary>自我审核与独立的审核者 agent 有什么区别？</summary>

自我审核复用写作者的模型，往往还复用它的上下文，所以共享它的盲区。独立的审核者带有自己的指令、一个带着来源的全新上下文、只读工具，还可能用另一个模型。

</details>

<details>
<summary>你会怎样设计客户通讯流程中的 Review 步骤？</summary>

先由代码检查数字、免责声明和链接。然后由一个独立的 critic，对照调研笔记套用一份简短的二元评分标准，并给出证据和修改建议。两轮修改之后，仍未通过的项交给编辑。

</details>

<details>
<summary>你的 critic 让成本翻了一倍，已发布的错误却没有减少。接下来怎么办？</summary>

在 trace 里把它标出的问题，和实际发布出去的错误对照一下。如果它标的是文风问题，却漏掉了事实错误，就给它提供来源，或者把这项检查挪进代码，然后在埋入的错误上重新测量；如果它仍然什么都抓不到，就把它去掉。

</details>

## 延伸阅读

- 文章：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)（Anthropic，约 15 分钟）
- 文章：[Building agents with the Claude Agent SDK](https://claude.com/blog/building-agents-with-the-claude-agent-sdk)（Anthropic，约 10 分钟）
- 练习：[Evaluator optimizer](https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer)（Claude Cookbook，约 15 分钟）

## 相关页面

- [工作流模式（提示词链、路由、并行化）](./02-workflow-patterns.md)
- [LLM 裁判](../../m2/11-ai-evaluation/07-llm-as-judge.md)
- [Skill 输入、输出与检查](../14-agent-skills/04-skill-inputs-outputs-and-checks.md)
- [多 agent 系统](./04-multi-agent-systems.md)
- [人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
