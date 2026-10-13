---
title: 工具 schema 与工具设计
row: M2-L4.5
---
**一句话：** 工具定义就是名称、描述和参数 schema 这三样东西，模型靠它们判断何时、如何调用你的代码；好的工具设计让这些调用不容易出错，也容易测试。

## 是什么

模型从来看不到工具背后的代码，只能看到它的定义：一个名称、一段纯文本描述，以及一份 JSON Schema，里面给出每个输入的名称、类型和含义（见相关页面）。Anthropic 的说法是：“Claude 永远看不到你的实现。”

这就像一张由临时工填写的表格，而这位临时工从没进过后台：标签是否清楚、有没有勾选框、有没有“退款请用 B 表”这样的提示，决定了表格交回来时填得对不对。

各家主流模型供应商都会把这三部分当作提示词文本发给模型，每次请求都要计费。工具设计决定每个工具做什么、怎么描述，这样模型才能正确调用它，你也才能验证它。

## FDE 为什么需要

设想一个包裹配送助手，它把客户的 REST API 原样照搬成 `get_shipment(id)` 和 `update_shipment(id, data)`，描述分别只有“获取一个运单”和“更新一个运单”。trace 显示出三种失败。终端客户给出的订单号形如 `ORD-20931877`，而 `id` 要的是内部 UUID。“我的包裹到哪了？一定要周五送到”这样一句话就可能触发 `update_shipment`，因为没有任何地方说明什么时候不该用它。自由格式的 `data` 甚至让模型能把 `status` 设成“delivered”。

FDE 围绕终端客户要办的事重新设计：一个只读的 `get_delivery_status(order_number)`，外加一个独立的 `request_delivery_reschedule`。没有任何工具能设置状态。模型没有变，变的是定义。

## 核心概念

### 名称与描述

名称用简短的 snake_case，格式为 verb_noun（动词_名词）；各家供应商的命名规则不同。Anthropic 称，详细的描述是“影响工具表现的最重要因素，远超其他”。描述要写明工具做什么、何时用、何时不该用、各参数的含义，以及它的限制（准确地说，Azure OpenAI 把描述限制在 1,024 个字符以内）。Anthropic 格式的写法如下：

```json
{
  "name": "request_delivery_reschedule",
  "description": "请求把一个包裹改到新的日期送达。仅用于改期，不用于查询状态（查询状态请用 get_delivery_status）。需要承运商批准。",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_number": {"type": "string", "description": "ORD- 加 8 位数字，例如 ORD-20931877"},
      "new_date": {"type": "string", "description": "YYYY-MM-DD"},
      "reason": {"type": "string", "enum": ["not_home", "address_issue", "other"]}
    },
    "required": ["order_number", "new_date", "reason"]
  }
}
```

### 引导模型的参数

- **含义明确的名称：** 用 `order_number`，而不是 `id`。
- **格式和示例：** 每条描述里都要有。
- **固定选项用枚举：** 目的是“让非法状态无法表示”（OpenAI）。
- **用扁平结构，不要嵌套：** OpenAI 警告说，嵌套的参数会被遗漏或误用。
- **代码已经知道的，就不要再让模型填：** 客户 ID 由会话提供。

Anthropic 把这称为 poka-yoke（防错设计）：有个工具曾要求传入绝对文件路径，结果“模型使用这个方法时毫无差错”。

### 窄工具，每个只有一个副作用

Anthropic 认为，“只是包装现有软件功能或 API 端点”的工具是一种常见错误：`search_contacts` 比 `list_contacts` 好。相反的错误是开放式的 `run_sql(query)`，OWASP 的 LLM03:2026 过度自主权（excessive agency）建议避免这样做：尽量缩小每个工具能做的事。

Anthropic 和 OpenAI 都建议把本来就属于一起的步骤合并：合并的是步骤，而不是副作用。把读和写分开，这样每个工具都能单独测试、打上标记（比如 MCP 的 `readOnlyHint`），也能单独设置审批 gate（见相关页面）。

### 分两层验证

| 层 | 测试对象 | 方式 |
|---|---|---|
| 代码 | 工具背后的函数 | 单元测试，不用模型：真实的、不存在的和格式错误的订单号，以及过去的日期 |
| 模型 | 工具选择与参数 | 约 15 条评测提示词，在 trace 中检查 |

要包含近似用例、不需要工具的问题，以及缺少日期、需要先问一个澄清问题的情形；每次改动描述、schema 或模型之后都要重跑。

## 常见误区

- **“模型能读到我的代码，所以定义可以写短一点。”** 它只能看到定义；如果 schema 是由 SDK 生成的，那就意味着只有你的 docstring 和类型注解。
- **“schema 严格，参数就正确。”** 严格模式只保证形状和类型，不保证订单真的存在。这要靠工具代码去检查。
- **“只要不在定义里写出某项能力，我们就安全。”** Microsoft 警告不要只靠这一点。要用权限来强制执行限制。

## 典型面试题

<details>
<summary>工具定义里包含什么？哪一部分最重要？</summary>

一个名称、一段描述，以及一份参数 schema，里面列出每个输入的名称、类型、描述和是否必填。模型只凭这些做判断，所以描述最重要，包括说明什么时候不该用这个工具。

</details>

<details>
<summary>包装一个 API 端点和设计一个工具有什么区别？</summary>

包装只是照抄后端：内部 ID、自由格式的请求体、把所有内容都列出来的结果。设计出来的工具对应一项用户任务，接收模型能知道的输入，只有一个副作用，比如 `get_delivery_status(order_number)`，而不是 `get_shipment(id)`。

</details>

<details>
<summary>为客服助手设计一个可验证的退款工具。</summary>

`request_refund(order_number, reason)`，其中 `reason` 是枚举；客户 ID 由会话提供，金额由代码计算。描述把它限定在用户明确提出退款的情形。我会先给这个函数写单元测试，再跑评测提示词，检查模型在什么时候调用它。

</details>

<details>
<summary>模型在遇到订单状态问题时调用了 `search_help_articles`。你怎么修？</summary>

通常是几个工具的描述有重叠，或者订单工具的描述里根本没提到配送。我会加上写明“何时不该用”、互相指向对方的句子，把这些提示词加进评测集，然后重跑。强制指定使用某个工具会掩盖问题。

</details>

## 延伸阅读

- 课程：[What are Tools? (Agents Course, Unit 1)](https://huggingface.co/learn/agents-course/unit1/tools)（Hugging Face，约 10 分钟）
- 文章：[Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)（Anthropic Engineering，约 25 分钟）
- 练习：[Tool evaluation](https://platform.claude.com/cookbook/tool-evaluation-tool-evaluation)（Anthropic Claude Cookbook，约 45 分钟）

## 相关页面

- [结构化输出与 JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Tool calling（函数调用）](./01-tool-calling.md)
- [工具参数校验](./06-tool-argument-validation.md)
- [评测集（正常、边界、失败、对抗性用例）](../11-ai-evaluation/02-evaluation-sets.md)
- [人在回路审批](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
