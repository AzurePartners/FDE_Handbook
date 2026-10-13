---
title: Agent 工作流的可重放测试
row: M3-L6.6
---
**一句话：** 可重放测试把一次 agent 运行变成可以重跑的场景：同样的输入、同样的初始状态、录制好的工具响应，再对照预期结果和关键步骤进行检查，全程不碰线上系统。

## 是什么

agent 的一次运行失败后，本能的反应是再跑一遍。可是这次运行依赖的远不止那条请求：记忆里存了什么，工具返回了什么，当时线上用的是哪个版本的提示词和模型。到了明天，这些都已经变了。

可重放测试把这一切冻结下来，就像根据一次事故重建的飞行模拟器场景：天气一样，发动机故障一样，但怎么操作仍由飞行员来决定。

准确地说，测试运行器（runner）加载保存下来的状态，让 agent 处理保存下来的输入，用录制内容回答工具调用，再检查结果和关键步骤。“最小”指的是仍能复现该行为的最小一块。这与持久化执行运行时里用于崩溃恢复的[重放](../17-persistent-agents/02-durable-execution.md)不是一回事。

## FDE 为什么需要

一家软件公司的客服流程里有三个 agent：Triage 给工单打标签，Research 查看状态页，Reply 为客服人员起草回复。一次持续两小时的宕机期间，有 40 位客户收到的回复写着“目前没有已知事故”。到了早上，每次重跑都能答对，于是这个 bug 被以“无法复现”为由关闭。下一次宕机时，它又出现了。

FDE 从一条投诉的 trace ID 出发，建了一个测试：以 Triage 的交接作为输入，以账户和区域作为初始状态，再加上状态工具录制的宕机响应。每次重放都失败了：状态工具的代码忽略了 `incidents` 列表，而这个列表只在宕机期间才出现。修复之后，这个测试在使用真实模型的 5 次运行中通过了 5 次，并加入了测试套件。（示例场景。）

## 核心概念

### 最小可重放测试

```json
{
  "source_trace": "tr_5be07a",
  "input": {"from": "triage", "ticket": "仪表盘从 9:40 起就打不开了？"},
  "initial_state": {"account": "ACME-204", "region": "eu-west"},
  "tool_recording": "recordings/support-031.jsonl",
  "expect": {"outcome": "草稿点明了尚未解决的事故",
             "steps": ["get_status before draft_reply"],
             "never": ["send_reply"]},
  "versions": {"model": "<exact model ID>",
               "profiles": {"research": "2.3.0", "reply": "1.8.2"},
               "skills": {"summarize-status": "1.4.1"}}
}
```

在多 agent 流程中，从出问题的那个 agent 开始，把它收到的交接作为输入。每次运行前都重新加载初始状态，这样各次运行互不影响。

trace ID 和 `versions` 就是留下来的日志证据：记录确切的模型 ID，而不是可能指向更新模型版本的模型别名，并且保留一份已脱敏的关键 [trace 步骤](./02-agent-traces.md)，因为追踪工具会删除旧的 trace。

### 录制和重放工具响应

按顺序记录每次工具调用的名称、参数和结果。重放时，由一个包装层（wrapper）把它们提供出来，就像一个用真实数据构建的[模拟对象](../../m1/04-git-debugging-testing-security/08-unit-vs-integration-tests.md)，并遵守三条规则：

- **未录制的调用会让测试失败。** 比如 VCR.py 库的 `none` 模式，就“保证不会发出任何新的 HTTP 请求”。
- **写入只会被捕获，不会发出**，留给测试去检查。
- **录制内容要经过清理**，提交前去掉其中的客户数据（[敏感数据与 PII 保护](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)）。

改动某一个录制的值再重放，可以确认一次[失败归因](./03-failure-attribution.md)。

### 衔接测试与行为测试

| | 衔接测试 | 行为测试 |
|---|---|---|
| 模型 | 录制的输出 | 真实模型，运行多次 |
| 检查对象 | 你的代码：路由、解析、交接、状态 | Agent 的决策 |
| 结果 | 每次相同，免费，速度快 | 得到一个通过率，消耗 token |
| 运行时机 | 每次提交 | 提示词、Skill、工具或模型发生变更时；每晚运行 |

比如 LangSmith 的 pytest 插件，就能把模型调用缓存到磁盘上，用于衔接测试；提示词变了就要重新录制。输出每次不尽相同（[生成参数](../../m2/07-llm-application-foundations/05-generation-settings.md)），所以要把行为测试的通过率与基线对比（[回归测试](../../m2/11-ai-evaluation/08-regression-testing.md)）。

## 常见误区

- **“把同一个请求再跑一遍，就能复现失败。”** 记忆、工具数据和版本都已经变了；重跑测试的是另一种情形。
- **“录制了工具响应，测试就是确定性的。”** 它们冻结的是外部世界，而不是模型；把模型输出也一并重放，各次运行确实会完全一致，但测的就只有你自己的代码了。
- **“重放测试通过了，说明线上集成没问题。”** 录制内容冻结的是昨天的 API；真实响应变了，它也发现不了。要定期重新录制，并审查 diff。
- **“重放测试失败了，重新录制一遍就行。”** 那样会把今天的行为（连同其中的 bug）变成预期结果。先读 trace。

## 典型面试题

<details>
<summary>一个最小的可重放 agent 测试里要放什么？</summary>

输入，或者出问题的 agent 收到的交接；初始状态；录制的工具响应；预期结果；少量必须出现或绝不能出现的步骤；trace ID 和各个版本。

</details>

<details>
<summary>衔接测试和行为测试有什么区别？</summary>

衔接测试连模型输出也一起重放：免费，每次运行结果相同，检查的是我自己的代码。行为测试则让真实模型对着录制好的工具运行多次，达到阈值才算通过。

</details>

<details>
<summary>Review agent 批准了一条被禁止的说法。你怎么把它变成测试？</summary>

输入：trace 里 Draft 的交接。状态：Review 加载的品牌规则。工具：录制好的结果。预期：给出一个点明该说法的“revise”判定，并且没有发布调用。它必须在修复前失败，修复后 5 次运行全部通过。

</details>

<details>
<summary>模型升级之后，一个重放测试遇到了没有录制过的工具调用。这算回归吗？</summary>

不一定：新模型走了一条没有录制过的路径，所以我会去读 trace。如果只是一次无害的额外查询，就扩充录制内容；如果是在批准之前写入，那就是真正的回归，要阻止这次升级。

</details>

## 延伸阅读

- 文章：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)（Anthropic，约 30 分钟）
- 参考：[Usage](https://vcrpy.readthedocs.io/en/latest/usage.html)（VCR.py documentation，约 5 分钟）
- 参考：[Why evaluate agents](https://adk.dev/evaluate/)（Google ADK docs，约 15 分钟）

## 相关页面

- [提示词、模型、工具与数据的回归测试](../../m2/11-ai-evaluation/08-regression-testing.md)
- [单元测试与集成测试](../../m1/04-git-debugging-testing-security/08-unit-vs-integration-tests.md)
- [Agent trace（步骤、工具调用、交接、状态变化）](./02-agent-traces.md)
- [用 trace 和评测调试 agent](./07-debugging-agents.md)
- [恢复测试（故障注入）](../17-persistent-agents/08-recovery-testing.md)
