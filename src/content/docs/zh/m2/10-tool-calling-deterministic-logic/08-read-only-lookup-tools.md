---
title: 只读查询工具
row: M2-L4.8
---
**一句话：** 只读查询工具让 AI 助手从掌管某个事实的系统里取得一个当前事实，比如成绩、订单状态或工单状态，并且不改动任何东西。

## 是什么

助手没办法知道昨晚那笔付款有没有成功。这个事实存放在权威数据源（system of record）里，也就是掌管它的那个正式应用：成绩归成绩册，订单归计费系统，工单归工单系统。模型提出一次查询，由你的代码执行查询或 API 的 `GET` 请求，并返回选定的字段。

打个比方，拿银行柜员的账户屏幕来说。它显示你的余额和刷新时间，却没有“转账”按钮。转账发生在别处，还要经过额外的检查。

只读是要强制保证的，而不是声明出来的。代码只能读取，它使用的凭证也只允许读取：一个只有 `SELECT` 权限的数据库登录账号，或者一个带只读 scope（权限范围）的 API token。

## FDE 为什么需要

一所在线学校的客服助手，依据放在知识库里的每晚 CSV 导出数据作答。下午 3 点，一名学员问：“我的分期款扣成功了吗？”凌晨 2 点的导出数据写的是“pending”，但这笔扣款在中午已经失败。助手回答“无需处理”，十天后，这名学员的课程访问权限被暂停了。

FDE 用三个查询工具取代了这份导出数据，它们用只读凭证调用实时的成绩册、计费系统和工单系统 API。政策和 FAQ 文本仍然放在 RAG 里。

## 核心概念

### Northwind 的查询工具

| 工具 | 读取来源 | 参数 |
|---|---|---|
| `get_grades(course_id)` | 成绩册 | `data-analytics` 或 `python-ai` |
| `get_order_status(order_id)` | 计费系统 | 与 `ORD-[0-9]{6}` 完全匹配 |
| `get_ticket_status(ticket_id)` | 工单系统 | 与 `TCK-[0-9]{4}` 完全匹配 |

没有任何工具接收 `student_id`；它由代码从已登录的会话里填入，所以查询只能看到该学员自己的记录。

### 选择字段并加上标签

Anthropic 建议只返回“高信号信息”：易读的标签，加上用于引用和后续调用的记录 ID。要写明单位和币种。

```json
{"order_id": "ORD-104118",
 "item": "Data Analytics Foundations，分期款第 2 期（共 4 期）",
 "amount": 125.00, "currency": "USD",
 "status": "payment_failed",
 "status_updated_at": "2025-09-10",
 "next_step": "2025-09-13 自动重试",
 "as_of": "2025-09-12T19:00:00Z"}
```

`status_updated_at` 是记录最后一次变更的时间。`as_of` 是读取数据的时间；如果数据来自缓存或副本，它必须是数据本身的真实时间，这样助手才能说“截至下午 3 点”。支付卡信息和员工备注不要放进去。

### 把查询和政策结合起来

相互独立的只读查询“通常可以安全地并行运行”（Anthropic 文档）；需要另一个查询结果的查询则要等待它。

“ORD-104118 扣款失败了。我会失去访问权限吗？”这个问题需要 `get_order_status("ORD-104118")`（2025-09-10 失败），再加上检索到的“付款计划”FAQ（“10 天后暂停课程访问权限”）。暂停日期由代码而不是模型来计算：2025-09-20。对于“我的 Data Analytics 能及格吗？”，参与分还没有录入，所以代码只对已录入的成绩项加权：(0.3 × 85 + 0.5 × 88) / 0.8 = 86.9。

### 用真实的问题测试

拿一份答案已知的练习数据副本来测试：

```text
“ORD-104118 的状态？”                          一个工具
“TCK-5531 和我的 Data Analytics 成绩？”        两个工具
“ORD-104118 扣款失败了。我会失去访问权限吗？”  查询加政策
“ORD-999999 的状态？”                          未知 ID
“我的成绩是多少？”                             有歧义：两门课
“成绩是怎么加权的？”                           不需要查询
```

留意选错的工具、错误的参数和漏掉的调用，并核对每一个数字和日期。

## 常见误区

- **“只读工具不会造成任何损害。”** 查询正是私有数据进入模型的途径，其中可能包含其他用户的记录，或者谁都不该看到的字段。
- **“我把工具描述成只读，它就是只读的。”** OWASP 的过度自主权（excessive agency）条目（2025 年版中是 LLM06，2026 年 8 月版中是 LLM03）描述了这样的情形：一个本意只用来读取的工具，它所用的数据库身份却也能 `UPDATE` 和 `DELETE`。要用凭证来强制保证只读。
- **“把数据库导出到知识库里，让 RAG 去找订单。”** 导出数据会过期，还可能返回别人的数据行。
- **“只要是工具返回的，就是最新的。”** 工具读到的可能是缓存或夜间同步的数据。要返回 `as_of`。

## 典型面试题

<details>
<summary>什么是只读查询工具？为什么不直接用知识库？</summary>

它是这样一种工具：代码只从权威数据源读取选定的字段。对于某一个人的当前数据，实时查询是准确的，而建过索引的副本会过期。政策文本则仍然适合用 RAG。

</details>

<details>
<summary>管控查询工具和管控操作工具有什么不同？</summary>

查询不会改动任何东西，所以可以并行运行、随意重试，通常也不需要审批。操作工具则需要在任何副作用之前先做校验、做防重复保护，有时还需要审批。两者都需要按用户限定访问范围。

</details>

<details>
<summary>一名学员问：“我的分期款扣款失败了。我会失去访问权限吗？”设计这个流程。</summary>

模型为已登录的学员调用 `get_order_status`。应用检索付款计划政策，由代码计算暂停日期。答案要引用订单 ID、政策和数据截至时间。

</details>

<details>
<summary>助手说测验 2 是 78 分，可成绩册在重新批改后显示的是 86 分。你怎么排查？</summary>

打开 trace。如果没有 `get_grades` 调用，说明它是根据对话历史作答的。如果返回的是 78，说明数据路径上有过期数据。如果返回的是 86，说明模型读错了，那就修正标签。把这个用例加进评测集。

</details>

## 延伸阅读

- 文章：[Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)（Anthropic Engineering，约 25 分钟）
- 练习：[Customer service agent with client-side tools](https://platform.claude.com/cookbook/tool-use-customer-service-agent)（Anthropic Claude Cookbook，约 30 分钟）

## 相关页面

- [RAG 与替代方案（长上下文、微调、数据库、API）](../09-rag-knowledge-bases/09-rag-vs-alternatives.md)
- [工具 schema 与工具设计](./05-tool-design.md)
- [未授权请求、按用户的访问权限与操作 gate](../12-safety-guardrails-hitl/05-action-gates.md)
- [人在回路审批](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [API 认证](../../m1/03-apis-data-integration/02-auth.md)
