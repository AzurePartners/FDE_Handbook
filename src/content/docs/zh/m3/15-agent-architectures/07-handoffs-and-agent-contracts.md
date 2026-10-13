---
title: 交接与 agent 契约
row: M3-L3.7
---
**一句话：** 交接是把工作从一个 agent 传给另一个 agent；agent 契约则是这次交换事先约定好、可以检查的格式：任务、必需的输入、结构化的结果，以及带错误信息的状态。

## 是什么

在多 agent 系统中，工作会在 agent 之间流转：Research 把发现交给 Draft，分诊 agent 把客户转给账单 agent。每一次流转就是一次交接；所传内容事先约定好的格式，就是 agent 契约。

打个比方，护士交接班：不会把十二个小时重演一遍，只是一份简短的结构化报告（做了什么、还有什么没处理），外加病历放在哪里的指引。

准确地说，交接要么转移控制权，要么把另一个 agent 当作工具来调用；契约由代码在边界处检查。把对话转给人工，则属于[升级](../../m2/12-safety-guardrails-hitl/08-escalation-and-human-takeover.md)。

## FDE 为什么需要

一家软件公司的 Research agent 把简报交给 Draft agent。一次提示词微调之后，Research 把来源写成了 Markdown 正文，而没有填进 `sources` 字段。没有任何报错：Draft 的代码看不到来源，于是连续三周，Draft 都凭记忆写稿，还引用了一个已经停用的定价档位。Draft 还拿到了 Research 的完整对话记录，所以一个被否决的切入角度反复冒出来。

FDE 写了一份带版本号的 `research_brief` 契约，由代码在 Draft 启动前检查，把没有来源的简报退回给 Research。现在 Draft 拿到的是简报、已做出的决定和一个文件夹链接，每次提示词改动时还会运行契约测试。（示例场景。）

## 核心概念

### 两种交接方式

| | 转移控制权 | 把 agent 当作工具 |
|---|---|---|
| 谁来回答用户 | 接收方（分诊的典型做法） | 调用方，在检查结果之后 |
| 接收方看到什么 | 通常是整段对话 | 通常只有调用方发来的内容 |
| 示例 | OpenAI Agents SDK 的交接、Google ADK 的 `transfer_to_agent` | OpenAI 的 `Agent.as_tool()`、ADK 的 `AgentTool`、Claude Code 的子 agent（subagent） |

### 契约的四个部分

- **任务：** 目标、边界，以及已经做出的决定（读者、被否决的切入角度），否则 agent 之间会互相矛盾（[多 agent 系统](./04-multi-agent-systems.md)）。
- **必需的输入：** 给 ID 和链接，不要粘贴副本。
- **结构化的中间输出：** 一个有名字、形状固定的产物（[schema 的具体机制](../../m2/08-prompting-context-structured-output/06-structured-output.md)）。
- **状态与错误，** 这样失败绝不会看起来像一个结果。

```json
{
  "contract": "research_brief/v2",
  "task_id": "T-2291",
  "status": "done",
  "claims": [{"text": "每个套餐都包含 SSO", "source_url": "https://vendor.example/changelog"}],
  "decisions": ["读者：IT 经理", "不做价格对比"],
  "errors": [],
  "workspace": "content-ops/T-2291/"
}
```

每个 agent 的输出都在它的 [profile](../13-agent-profiles/05-agent-inputs-outputs-escalation.md) 中声明；契约则是各方共同的约定，像[数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)一样做版本管理。跨供应商时，这种交换由 Agent2Agent（A2A）协议统一规范，它是 Google 贡献的 Linux Foundation 项目：Agent Card 列出能力，任务带有“需要输入”或“失败”等状态。

### 在边界处校验

在下一个 agent 行动之前，由代码而不是接收方模型来检查每份 payload：先查 schema，再查业务规则（任务 ID 是否匹配、状态是否为 `done`、每条陈述是否都有来源）。Microsoft 的编排指南要求“在把 agent 的输出传给下一个 agent 之前先校验它”；校验失败时，带着错误信息把它退回给发送方一次，或者请一个人来处理，或者直接停止。

把 payload 当作数据，而不是指令：被注入到 Research 所读网页里的文字可能随之一起传下去，所以 OWASP 说要“校验并清理 agent 之间的通信”。框架自带的护栏未必在每次交接时都会运行：OpenAI 的 SDK 只对第一个 agent 运行输入护栏。

### 哪些上下文会随之传递

各家的默认做法不同：OpenAI 的 SDK 会把“此前的全部对话历史”交给被转入的 agent，除非用输入过滤器裁掉它；嵌套的 agent 调用通常从空白开始。要按每道边界分别决定：通常是任务、决定和引用（记录 ID、一个 [landing pad](../16-agent-state-memory/08-persistence-patterns.md)（成品中转区）文件夹）；Anthropic 建议子 agent“把轻量的引用传回给协调者”。转发的历史还会到达接收方的模型供应商那里；对它不该看到的内容要做[过滤](../../m2/08-prompting-context-structured-output/04-context-engineering.md)。

## 常见误区

- **“交接就是转发聊天记录。”** 对话记录会撑大上下文、让被否决的想法死灰复燃，还会暴露数据。应当发送任务、决定和引用。
- **“payload 符合 schema，交接就成功了。”** 格式正确不等于内容属实：一份有效的简报仍然可能引用一个失效的链接。
- **“我们自己 agent 发来的消息是安全的。”** 读过被投毒网页的 agent，可能把被注入的文字原样传下去；要把 payload 当作不可信的数据。

## 典型面试题

<details>
<summary>agent 契约是什么，包含哪些内容？</summary>

工作在 agent 之间传递时，事先约定、带版本号的格式：任务和决定、必需的输入、结构化输出，以及带机器可读错误信息的状态，由代码在边界处校验。

</details>

<details>
<summary>转移控制权与把 agent 当作工具调用有什么区别？</summary>

转移控制权，是让专家 agent 成为当前负责的 agent，由它回答用户，并且往往能看到完整的历史。调用则由调用方继续掌控全局，只发送它选定的内容，并检查结果。

</details>

<details>
<summary>设计一次从分诊 agent 到账单 agent 的交接。</summary>

用转移控制权，因为账单 agent 应当接管这段对话；payload 经过校验（账户 ID、有争议的扣款、原因），并且只带相关的几轮对话。账单 agent 自己重新读取账户；设一个上限，防止 agent 之间把客户来回踢皮球。

</details>

<details>
<summary>Review 放行了一份草稿，其中有两条陈述，Research 曾把它们标为未验证。你会去哪里排查？</summary>

查 trace 里从 Draft 到 Review 的那次交接：Draft 的契约多半没有逐条陈述的状态，所以那个标记丢了。我会让逐条陈述的状态贯穿每一份契约，拒收使用了未验证陈述的草稿，并新增一个评测用例。

</details>

## 延伸阅读

- 文章：[How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，约 20 分钟）
- 参考：[AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)（Microsoft Learn，约 30 分钟）
- 参考：[Handoffs](https://openai.github.io/openai-agents-python/handoffs/)（OpenAI Agents SDK，约 10 分钟）

## 相关页面

- [多 agent 系统](./04-multi-agent-systems.md)
- [结构化输出与 JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [Agent 输入、输出与升级条件](../13-agent-profiles/05-agent-inputs-outputs-escalation.md)
- [Schema 与数据契约](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Agent trace（步骤、工具调用、交接、状态变化）](../18-agent-evaluation-debugging/02-agent-traces.md)
