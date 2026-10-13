---
title: Agent 输入、输出与升级条件
row: M3-L1.5
---
**一句话：** agent 的输入、输出和升级条件是 profile 中的一部分，规定它开始工作需要什么、必须交回什么并附上状态，以及何时停下来把决定交给别人。

## 是什么

医院检验科就是这样工作的：标签不全的样本会被退回并说明原因，结果标明是最终报告还是初步报告，某项数值超出危急值界限时，会打电话通知病房。

agent 的 [profile](./02-agent-profiles.md) 声明的是同样的接口。**输入** 是有名字的字段，每个字段要么必填、要么可选，并带有来源和字段缺失时的处理规则。**输出** 是一个有名字的交付物，结构固定，同时带有 **状态**，说明它是否已完成。**升级条件** 是可观察的触发条件，每个都有一个接收方，也就是接下来做决定的人、队列或 agent。

## FDE 为什么需要

一家软件供应商的销售团队让一个 agent 回答客户的安全问卷。面对一家银行时，agent 假定这家银行用的是 Enterprise 套餐，答应了只有法务才能批准的可用性承诺，编造了政策库里没有的答案，还跳过了解析器读不出来的一个工作表。银行的律师后来把这些答案当作承诺引用。（示例场景。）

FDE 声明了必填输入（其中包括套餐）、一个每条答案附有来源、并带有状态的 `questionnaire_response`，以及五个带接收方的升级触发条件。下一份问卷回复的状态是 `partial`：212 条有来源的答案，加两个未决问题，每个都带着原因转给了相应的接收方。

## 核心概念

### 输入：已声明、有来源、最先检查

这个 agent 需要文件和客户（来自需求方），以及套餐（来自 CRM）；如果 CRM 里没有套餐，它就返回 `needs_input`，并指明缺的字段。可选的截止日期默认为五个工作日，并记录为一条假设。OpenAI 的 agent 指南要求“必填信息缺失时要有替代步骤”。在任何模型调用之前，先在代码里检查必填字段。

### 输出：带状态的命名交付物

```json
{
  "deliverable": "questionnaire_response",
  "status": "partial",
  "answers_file": "bank_v1.xlsx",
  "answered": 212,
  "open": [
    {"id": "4.7", "reason": "weak_evidence", "sent_to": "security_team"},
    {"id": "9.2", "reason": "missing_authority", "sent_to": "legal"}
  ],
  "assumptions": ["due_date: 2026-10-06 (default)"]
}
```

代码按状态分流：`done` 进入下一步，`needs_input` 回到需求方，`escalated` 交给接收方，`partial` 交给审核人。[结构化输出](../../m2/08-prompting-context-structured-output/06-structured-output.md)用来强制这个结构；agent SDK 都支持最终输出 schema（Claude Agent SDK 的 `output_format`、OpenAI Agents SDK 的 `output_type`、Google ADK 的 `output_schema`）。

### 升级条件应当是可观察的触发条件

“拿不准就升级”无法测试；“没有找到已批准的答案”则可以。

| 条件 | 可观察的触发条件 | 接收方 |
|---|---|---|
| 缺少授权 | 问题在法律条款清单上 | 法务队列 |
| 证据薄弱 | 政策库里没有已批准的答案 | 安全团队队列 |
| 来源冲突 | 两个已批准的答案互相矛盾 | 政策负责人 |
| 工具反复失败 | 解析器在同一个工作表上失败 3 次 | 平台队列 |
| 预算用完 | 达到步数或成本上限 | 需求方，以 `partial` 状态返回 |

证据检查见[知识缺口与证据不足](../../m2/09-rag-knowledge-bases/08-knowledge-gaps.md)，运行上限见[有界执行](../17-persistent-agents/04-bounded-execution.md)。升级时发给角色或队列，而不是具体的人，并附上一个明确的问题、已有的证据和目前完成的工作。把进行中的聊天转人工是另一回事（见相关页面）。

### 交出部分工作，而不是猜测

模型倾向于作答；OpenAI 2025 年的一篇论文认为，训练和评测奖励猜测，而不是奖励承认不确定。要求每个字段都必填会进一步加大压力：填满格子的唯一办法就是编造。Anthropic 的 Agent SDK 文档建议，当“任务可能没有全部信息”时，把字段设为可选。加入带原因的未决项，这样即使运行被上限打断，也能交回已完成的工作。

## 常见误区

- **“agent 可以从上下文里推断出缺失的输入。”** 默默猜测（比如假定是 Enterprise 套餐）会给出一个自信却错误的答案。为每个输入声明处理方式：查询、取默认值、询问或停止。
- **“告诉 agent 拿不准就升级就够了。”** 它“是否拿不准”的感觉无法测试，而且这句话没有指明接收方。
- **“部分完成或已升级的运行就是失败的运行。”** 在证据或授权到头的地方停下，是正确的做法。真正的失败是一个看起来像已完成的猜测。

## 典型面试题

<details>
<summary>agent 的输入、输出和升级条件里要写什么？</summary>

输入：有名字的字段，必填或可选，每个字段都有来源和缺失值规则。输出：一个有名字、有结构的交付物，带状态。升级：可观察的触发条件，每个都有接收方。

</details>

<details>
<summary>`needs_input` 和 `escalated` 有什么区别？</summary>

`needs_input` 表示需求方补上缺失或含糊的输入，就能让任务继续。`escalated` 表示必须由别人来决定：缺少授权、来源冲突或工具失败。接收方不同，状态也不同。

</details>

<details>
<summary>为一家保险公司准备理赔档案的 agent 定义接口。</summary>

输入：理赔 ID、保单号（缺失时去查询）、出险日期（缺失则返回 `needs_input`）。输出：一个 `claim_file`，其中的承保结论引用保单条款，再加上状态。欺诈迹象交给调查部门，承保范围不清的交给理赔员。

</details>

<details>
<summary>输出看起来很完整，但审核人一再发现编造的答案。你会检查什么？</summary>

检查 schema 是否在逼着模型猜测（每个字段都必填，没有 `partial` 状态），运行前是否检查了输入，以及工具失败时是升级，还是任由模型凭记忆作答。

</details>

## 延伸阅读

- 参考：[Contact humans with tool calls](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-07-contact-humans-with-tools.md)（HumanLayer 12-Factor Agents，约 5 分钟）
- 参考：[Get structured output from agents](https://code.claude.com/docs/en/agent-sdk/structured-outputs)（Claude Agent SDK docs，约 10 分钟）

## 相关页面

- [Agent Profile（Profile.md）](./02-agent-profiles.md)
- [结构化输出与 JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [升级通道与人工接管](../../m2/12-safety-guardrails-hitl/08-escalation-and-human-takeover.md)
- [交接与 agent 契约](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
- [Agent 成功标准与完成标准](./06-agent-success-criteria.md)
