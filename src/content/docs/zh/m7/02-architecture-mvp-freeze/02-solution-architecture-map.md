---
title: 解决方案架构图
row: M7-L2.2
---
**一句话：** 解决方案架构图是一页纸的图，画出系统的组件、数据流、工具、记忆和人工检查点，让别人能在你动手构建之前评审它。

## 是什么

架构图回答这几个问题：系统由哪些部分组成，各部分之间传递什么，每个部分被允许做什么，以及在哪里必须由人来批准。它在 Mini PRD 之后画，因为 PRD 说明系统必须做什么，架构图说明怎么做。

对 Course Support Assistant（课程支持助手）来说，一张最简的架构图包含五个部分：聊天入口、基于课程文档的检索步骤、负责作答的模型、置信度检查，以及转人工客服。完整的参考设计见 [技术设计：课程支持助手](../../m6/01-education-rag/03-technical-design.md)（M6）。你的应该更简单，并且贴合你的客户。

## FDE 为什么需要

没有架构图就开工的团队，会在构建中途为结构争论不休，评审人也无法判断安全性。架构图能在代码出现之前，把隐藏的决策摆到台面上，比如“谁可以发起退款”。

## 核心概念

每个选择背后的道理在其他页面讲解：[选择 agent 架构](../../m3/15-agent-architectures/05-choosing-an-agent-architecture.md) 和 [agent 的状态与记忆类型](../../m3/16-agent-state-memory/01-state-and-memory-types.md)（M3），[MCP 与传统 API 连接器](../../m4/01-external-apis-mcp-and-connector-design/01-mcp-and-traditional-api-connectors.md) 和 [与权限绑定的人在回路](../../m4/02-authentication-authorization-rbac-and-secrets/04-human-in-the-loop-tied-to-permissions.md)（M4），以及 [人在回路审批](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)（M2）。

### 你要交付什么

一张图加一张简短的表：

```
学员 -> 聊天入口 -> 检索器 -> 作答步骤 -> 置信度检查
                      |                     |
              课程文档（只读）    低：转人工客服
                                  高：附来源回复
```

| 部分 | 需要记录的决策 |
|---|---|
| 组件或 agent | 一个 agent 还是多个？为什么最简单的方案就够用 |
| 数据流 | 每一步的输入和输出是什么 |
| 工具与 MCP 方案 | 它能调用、读取或写入哪些系统，由谁批准 |
| 记忆与状态 | 每次对话保留什么，什么永远不存 |
| 人工检查点 | 哪些输出必须由人批准，或可以由人推翻 |
| 部署方式 | 在哪里运行，谁负责重启，如何访问 |

### 通过标准

- 图中每个箭头都标注了传递的内容。
- 每个工具都标明是读还是写，写操作要写明由谁来批准。
- 明确说明记忆策略，包括哪些内容你不会保留。
- 至少有一个人工检查点对应风险登记表中的某项风险。
- 一位没参加你规划过程的评审人，能把一个问题从头到尾追踪一遍。
- 你能说清为什么没有选择更复杂的设计。
- 至少有两份 ADR 记录了架构图上的选择。

## 常见误区

- **“agent 越多，系统越好。”** 每多一个 agent，就多一些交接和失败点。先用一个，只有当清晰的边界迫使你拆分时才拆。
- **“架构图一画好就定稿了。”** 它在架构评审时冻结，之后只能通过 [MVP 冻结与变更控制](./04-mvp-freeze-and-change-control.md) 来修改。
- **“人工审核是一种弱点。”** 一个放对位置的检查点，正是系统获准接触真实客户的前提。

## 典型面试题

<details>
<summary>给我讲讲你的架构。</summary>

学员的问题从聊天入口进来，检索器从已批准的课程文档中取出相关段落，模型只依据这些段落作答并引用来源，置信度检查把把握不大的回答转给人工客服。文档是只读的，对话之外不存储任何内容。

</details>

<details>
<summary>你为什么选择单个 agent？</summary>

这个工作流是一个线性任务，只用一套工具。加第二个 agent 会多出一次交接，却没有清晰的边界，所以我把它推迟了。

</details>

<details>
<summary>人在哪些环节参与？</summary>

低置信度的回答，以及任何超出文档范围的请求。这对应的是“助手编造答案”这项风险。

</details>

## 延伸阅读

- 文章：[Architecture Decision Records](https://adr.github.io/)（ADR GitHub 组织，用来记录架构图上的每个选择）。

## 相关页面

- [Mini PRD 与风险登记表](./01-mini-prd-and-risk-register.md)
- [配置、Skill 还是写代码](./03-configure-skill-or-code.md)
- [选择 agent 架构](../../m3/15-agent-architectures/05-choosing-an-agent-architecture.md)（M3）
- [技术设计：课程支持助手](../../m6/01-education-rag/03-technical-design.md)（M6）
