---
title: 轨迹评测
row: M3-L6.5
---
**一句话：** 轨迹评测（trajectory evaluation）给 agent 在一次运行中走过的步骤（调用的工具、参数、顺序、交接）评分，而不只看它最后停在哪里，这样侥幸通过，以及途中的违规，都能被抓出来。

## 是什么

agent 是通过一系列步骤得到结果的：查询、工具调用、交接、记录变更。一次运行中按顺序排列的这些步骤，构成这次运行的**轨迹**（trajectory）。[Agent 评测](./01-agent-evaluation.md)给一次运行的终点评分；轨迹评测给它走过的路径评分。

数学老师让你写出解题过程，也是这个道理：答案对但方法错，要扣分；方法不同但同样成立，照样拿满分。

准确地说，轨迹是从这次运行的 [trace](./02-agent-traces.md) 中读出来的，再对照参考路径、依据代码里的策略规则，或者按评分标准（rubric）里的条目来评分。

## FDE 为什么需要

一家物业管理公司的维修 agent 会查租约、预约承包商，它的结果评测在 50 个任务里通过了 45 个。可是在这些通过的任务里，有 9 个跳过了 `get_lease`，直接假定房东付费，而每份测试租约恰好都是这样。另有 3 个任务里，它在物业经理批准之前就预约了金额超过 500 美元的维修工作，而这种先后顺序，最终状态是看不出来的。第一个修复办法是与一条录制好的路径做精确匹配，结果把三分之一的正常运行也判为失败，于是大家干脆不再理会它。

FDE 保留了结果检查，用代码给大额预约加了 gate，并新增三项路径检查：预约前先查租约，大额预约前先获得批准，不使用 agent 工具清单以外的工具。（示例场景。）

## 核心概念

### 对照参考路径

参考路径（golden path）列出预期的步骤；工具用三种方式把运行结果与它比对：

| 模式 | 何时通过 | 示例 |
|---|---|---|
| 精确 | 调用、参数和顺序都相同，没有多余的调用 | 受监管场景下的固定脚本 |
| 按顺序 | 列出的调用按该顺序出现，允许有多余的调用 | 先 `get_lease`，后 `book_contractor` |
| 任意顺序 | 列出的调用全部出现，允许有多余的调用 | 互不依赖的查询 |

Google 的 ADK、Microsoft Foundry 和 LangChain 的 AgentEvals 都提供这类模式。交接也算步骤；只在参数确实重要的地方才匹配参数，比如账户 ID。

### 严格匹配何时过于死板

多数任务不止一条正确的路径。τ-bench 客服基准为每个任务保存一条参考路径，但这条路径“并非唯一正确的路径”；它根据最终的数据库状态和必需的回复，给航空和零售任务评分（τ²-bench 又加入了电信场景）。只在顺序本身就是要求的流程里使用精确匹配，或者把它当作已知良好路径上的告警。

### 步骤级策略检查

有些规则管的是路径本身，它们来自 agent 的[禁止操作](../13-agent-profiles/04-responsibilities-and-prohibited-actions.md)：批准之前不得写入，不得使用角色之外或禁用清单上的工具。

```python
def policy_violations(steps, allowed, needs_approval):
    problems, approved = [], set()
    for s in steps:
        if s["type"] == "approval" and s["decision"] == "approve":
            approved.add(s["call_id"])
        elif s["type"] == "tool":  # 已执行的调用
            if s["tool"] not in allowed:
                problems.append(f"{s['id']}: outside role")
            if needs_approval(s) and s["id"] not in approved:
                problems.append(f"{s['id']}: before approval")
    return problems  # 只要有一条，这次运行就判为失败
```

评测检查负责衡量，[操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md) 负责阻止：两者都要保留。

### 用评分标准评判轨迹

有些方面需要判断，比如一次交接是否带上了下一个 agent 所需的信息。把评分项写成“是”或“否”的问题，交给人或 [LLM 裁判](../../m2/11-ai-evaluation/07-llm-as-judge.md)来打分，有没有参考路径都可以。先做校准：在 AgentRewardBench（2025）中，12 个 LLM 裁判里，没有哪一个在每个基准上都表现最好，这些基准由经专家审查的网页 agent 轨迹组成。

### 把路径与结果结合起来

先给结果评分；任何一条策略违规，都会让这次运行失败。匹配得分和评分项结果属于诊断信息，用于 [agent 级指标](./04-agent-level-metrics.md)。结果通过而路径未通过，说明这次运行靠的是运气，或者不安全；结果未通过而路径没有问题，往往指向数据、工具或评分器；两者都失败，就去找第一个出错的步骤（[失败归因](./03-failure-attribution.md)）。

## 常见误区

- **“结果通过了，步骤就无所谓。”** 这次运行可能只是碰巧对了，或者违反了某条最终状态根本不会记录的规则。
- **“与 golden path 精确匹配是最严格的测试。”** 它会把走了其他路线的合法运行判为失败，于是大家学会无视它。
- **“评测显示 agent 一直守着自己的角色，所以可以不要 gate 了。”** 评测只是抽取一部分用例来测；生产环境会带来新的输入和被注入的指令。

## 典型面试题

<details>
<summary>什么是轨迹评测，它能抓住什么问题？</summary>

给一次运行的步骤评分，而不只看最终状态。它能抓住侥幸通过的情况，比如跳过了一次查询却碰巧答对；也能抓住隐藏的违规，比如批准之前就写入。

</details>

<details>
<summary>精确匹配、按顺序匹配和任意顺序匹配有什么区别？</summary>

精确匹配要求调用、参数和顺序都相同，不能有多余的调用。按顺序匹配要求列出的调用按先后次序出现，允许有多余的调用；任意顺序匹配要求它们全部出现，顺序不限。遇到真正的依赖关系，我用按顺序匹配。

</details>

<details>
<summary>要给退款 agent 写轨迹检查，你会写哪些？</summary>

在 `issue_refund` 之前，必须已经核实身份并查阅政策；超过额度的退款必须事先获得批准；不得使用清单之外的工具；再加一条由裁判来判断的评分项：引用的金额与工具结果是否一致？

</details>

<details>
<summary>模型升级之后，路径检查失败了，但结果依然通过。怎么办？</summary>

我会去读失败的 trace。如果是合法的新路径，比如把查询合并成批量查询，说明检查太严了：只保留必需的步骤和真正的依赖关系。如果是跳过了核实，那就是真正的回归。

</details>

## 延伸阅读

- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic，约 30 分钟）
- 参考：[How to evaluate your agent with trajectory evaluations](https://docs.langchain.com/langsmith/trajectory-evals)（LangChain docs，约 15 分钟）
- 参考：[Evaluation Criteria](https://adk.dev/evaluate/criteria/)（Google ADK docs，约 20 分钟）

## 相关页面

- [Agent 评测（任务、环境、结果）](./01-agent-evaluation.md)
- [LLM 裁判](../../m2/11-ai-evaluation/07-llm-as-judge.md)
- [Agent trace（步骤、工具调用、交接、状态变化）](./02-agent-traces.md)
- [Agent 级指标（任务完成率、交接、工具调用、循环、成本、延迟）](./04-agent-level-metrics.md)
- [未授权请求、按用户的访问权限与操作 gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
