---
title: Agent 成功标准与完成标准
row: M3-L1.6
---
**一句话：** 成功标准在构建之前，用可衡量的方式说清 agent 做出的好成果是什么样；完成标准是每次运行在 agent 停止之前必须通过的检查清单。

## 是什么

agent 自己决定每一步怎么走，包括何时停下。成功标准是 [agent profile](./02-agent-profiles.md) 的最后一个字段，它给 agent 一个目标，并在构建之前回答“我们怎么知道它有效？”

可以参照施工队的收尾清单（punch list）：“把厨房弄漂亮些”没法检查，“橱柜装好、插座能用、验收通过”就可以。Scrum 团队把自己的这份清单叫作完成标准（definition of done）。

**成功标准** 是针对多次运行的具体、可衡量的目标：结果、质量门槛、时间和成本上限，以及绝不能发生的事。**完成标准** 是其中单次运行就能检查的部分，在 agent 停止之前检查。

## FDE 为什么需要

一家出版商的 Content Research agent 只有一条标准：“产出全面、高质量的研究。”试点中有些简报只搜了两次就交了上来，标成已完成，却有一半陈述没有来源；另一些运行花了 40 分钟反复改写一份在第十分钟就已可用的简报。编辑退回了近一半，每份的理由都不一样。

FDE 和执行主编重写了这条标准。一份简报有五到八条陈述（每条都引用 agent 实际打开过的页面）外加一条反方观点，才算完成；成功则是编辑接受 10 份简报中的 8 份，无需补充研究，且每份在 15 分钟内完成。agent 停止之前，由代码检查这份清单。（示例场景。）

## 核心概念

### 从业务目标到可衡量的标准

据 Anthropic 的 agent 评测指南，Descript 围绕“别弄坏东西，做我要求的事，并且做好”为其视频剪辑 agent 构建了评测。把每个部分都变成可检查的：

| 类别 | 含糊的说法 | 可衡量的说法 |
|---|---|---|
| 结果 | “好的研究” | 5 到 8 条有来源的陈述，回答了问题 |
| 质量门槛 | “高质量” | 编辑接受 10 份中的 8 份，无需补充研究 |
| 时间和成本 | “又快又便宜” | 15 分钟以内，每份简报的成本符合约定 |
| 绝不能发生 | “要小心” | 绝不引用没打开过的页面 |

“绝不能发生”的事项在每次运行中都是通过或失败二选一，需要提示词之外的控制措施（[禁止操作](./04-responsibilities-and-prohibited-actions.md)）。

### Agent 可自查的标准与只能由评测者判断的标准

凡是输出和运行日志能够证明的（字段、实际打开过的来源、格式、合计），都属于完成标准，由代码确认，而不是听 agent 的一面之词。Anthropic 那些长时间运行的编码 agent 会过早地“宣布工作已完成”；解决办法是：列一份功能清单，每一项开始时都标为失败，只有测试之后才能标为通过。

```python
def unmet_checks(brief, opened_urls):
    claims = brief.get("claims", [])
    gaps = [f"claim {c['id']}: source not opened"
            for c in claims if c.get("source_url") not in opened_urls]
    if not 5 <= len(claims) <= 8:
        gaps.append(f"{len(claims)} claims, need 5 to 8")
    if not brief.get("counterpoint"):
        gaps.append("no counterpoint")
    return gaps  # 为空：完成；否则把缺口退回
```

Claude Code 的 `Stop` hook 可以运行这类检查，并附上理由，阻止 agent 结束。

内容是否属实、来源质量和有用性需要评测者来判断，也就是人，或经过校准的 [LLM 裁判](../../m2/11-ai-evaluation/07-llm-as-judge.md)，并且要看多次运行。之后的 [agent 评测](../18-agent-evaluation-debugging/01-agent-evaluation.md)会把清单项变成代码评分器，把其余的变成评分标准（rubric）条目，把每条“绝不能发生”的事变成一个设法诱发它的测试。

### 完成就该停下

Anthropic 观察到，研究 agent 会“在已经有足够结果时仍在继续”。一旦所有检查都通过，agent 就返回，而不是继续打磨；如果有某项通不过，它就带着原因返回部分成果（[升级条件](./05-agent-inputs-outputs-escalation.md)）。OpenAI 的 GPT-5 提示词指南建议你“明确写出停止条件”。步数上限（[有界执行](../17-persistent-agents/04-bounded-execution.md)）只是兜底。

## 常见误区

- **“‘高质量’就是一条成功标准。”** 它只是一个愿望；标准是可检查的，比如“每条陈述都引用 agent 打开过的页面”。
- **“好的输出我们一看就知道。”** 那样每位审核人的判断都会不同，就像那些编辑一样。构建之前先商定标准。
- **“运行结束了，所以任务就完成了。”** 循环在模型不再调用工具或碰到上限时结束；这两种情况都不能证明工作做得好。
- **“通过了检查清单，就说明工作做得好。”** 它证明的是结构和来源，而不是内容是否属实或有用，这两项要由评测者通过多次运行来衡量。

## 典型面试题

<details>
<summary>成功标准和完成标准有什么区别？</summary>

成功标准是在多次运行上衡量的目标：结果、质量、时间和成本、绝不能发生的事。完成标准是其中逐次运行、由代码在 agent 停止之前检查的子集。

</details>

<details>
<summary>哪些标准 agent 可以自己检查，哪些需要评测者？</summary>

结构：必需的章节、有效的格式、与检索到的来源挂钩的陈述、对得上的合计。内容是否属实、来源质量和有用性需要人，或经过校准的裁判，并且要看多次运行。

</details>

<details>
<summary>销售团队想要一个“找到好线索”的 agent。你会怎么定义成功？</summary>

我会先问销售代表拿到线索后做什么，再设定目标：销售代表接受大多数线索，每份名单有时间和成本上限，还有“绝不能发生”的事，比如绝不联系潜在客户。每条线索都符合约定的客户画像并附有来源，就是完成检查。

</details>

<details>
<summary>agent 有时搜两次就停，有时一跑就是 40 分钟。你会改什么？</summary>

两种情况都说明缺少完成标准。我会加上能返回失败项及原因的代码检查，检查通过就停止，通不过就带着原因返回部分成果。

</details>

## 延伸阅读

- 参考：[Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests)（Anthropic docs，约 30 分钟）
- 文章：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)（Anthropic Engineering，约 10 分钟）

## 相关页面

- [Agent Profile（Profile.md）](./02-agent-profiles.md)
- [AI 评测](../../m2/11-ai-evaluation/01-ai-evaluation.md)
- [Agent 评测（任务、环境、结果）](../18-agent-evaluation-debugging/01-agent-evaluation.md)
- [Agent 级指标（任务完成率、交接、工具调用、循环、成本、延迟）](../18-agent-evaluation-debugging/04-agent-level-metrics.md)
- [Agent 输入、输出与升级条件](./05-agent-inputs-outputs-escalation.md)
