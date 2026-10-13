---
title: 工具结果与错误返回
row: M2-L4.7
---
**一句话：** 工具结果是工具运行后或被拒绝后，你的代码发回给模型的内容；它必须清楚说明工具是成功了、什么都没找到还是失败了，以及下一步该做什么。

## 是什么

模型从来看不到你的数据库，也看不到你的代码捕获的异常。它只能看到你的代码返回的内容，这些内容和那次调用的 ID 绑定在一起，模型就据此决定下一步怎么走。

打个比方，拿仓库拣货员的单据来说。“从 A12 货位拣出 3 件，共需 3 件”是成功。“商品 4471 未备货，现货 0 件”是诚实的空结果。“扫描枪离线，5 分钟后重试”是带有下一步指引的错误。工具结果应该是这三种之一，绝不能是一张空白单据或一份调试输出。

## FDE 为什么需要

在一家零售商那里，一个 FDE 把助手的三起事故都追溯到了工具结果。`get_order` 返回了 ERP 里完整的 80 个字段，于是模型把一条内部备注“因滥用拒付被标记”原样转述给了终端客户。`get_orders` 返回了空字符串，模型就编出一句“你的订单正在路上”。`cancel_order` 吞掉了支付网关的超时，只返回 `False`，于是模型确认了一次根本没发生的取消。一份带有数据库主机名的堆栈跟踪还出现在了聊天里。这些问题，没有一个能靠改提示词解决。

## 核心概念

### 小体量的结果，带 ID 和来源

只返回下一步需要的字段，再加上后续调用要用的稳定 ID，以及用于追踪的来源和数据截至时间的引用。Anthropic 的文档警告说，“臃肿的响应会浪费上下文，也让 Claude 更难提取出重要信息”。

```json
{"order_id": "A-1042", "status": "shipped", "shipped_on": "2026-09-20",
 "source": "erp:orders/A-1042", "as_of": "2026-09-29T10:14Z"}
```

### 空结果不是错误

空结果表示工具运行正常，而答案是“没有”，所以要发回一个正常的结果，并把查询条件回显出来：`{"orders": [], "count": 0, "customer_id": "C-77"}`。错误表示工具无法给出答案。空字符串或光秃秃的 `false` 会把这两种情况混在一起，于是模型可能把一次服务中断说成“什么都没找到”，或者干脆猜。

### 错误 payload

把错误写成指引：Anthropic 建议说明“出了什么问题，以及 Claude 接下来应该尝试什么”。要包含一个错误标志、问题所在、修复办法，以及重试是否有帮助。

```json
{"error": {"code": "ORDER_ALREADY_SHIPPED",
  "message": "订单 A-1042 已于 2026-09-20 发货，无法取消。",
  "fix": "改为提供退货：调用 start_return(order_id)。",
  "retryable": false}}
```

超时是可重试的（在你的代码自己的传输层重试之后）；违反业务规则而被拒绝则不可重试。写入失败必须如实说明（“取消未得到确认；没有任何改动”）。`retryable` 是团队的约定，不是供应商定义的字段。

| 供应商 | 结果的发送形式 | 错误信号 |
|---|---|---|
| Anthropic | 带 `tool_use_id` 的 `tool_result` | `is_error: true` |
| OpenAI Responses | 带 `call_id` 的 `function_call_output` | 无，所以要写进 `output` |
| Google Gemini | 带匹配 `id` 的 `FunctionResponse` | `response` 中的 `error` 键 |

MCP（模块四）使用 `isError: true`。

### 控制大小，又不泄露

用合理的默认值做过滤和分页。截断时要说明这一点，并说明如何缩小查询范围。对于大的产物，返回一个引用：Claude Code 会把超过默认 25,000 token 上限的 MCP 结果保存到文件里，只留下路径。

绝不要发送堆栈跟踪或原始的异常文本，它们可能暴露主机名、路径或密钥（CWE-209，属于 OWASP Top 10:2025 的 A10）。发送一条简短而安全的消息，并把详细信息按 trace ID 记入日志。默认行为各不相同：Microsoft.Extensions.AI 只发送“Error: Function failed.”，而有些 SDK 会把异常消息原样传过去。

### 限制尝试次数

Claude 常常会对一次无效的调用重试两三次，但这并不是保证。要在代码里强制设定上限，比如连续三次工具错误（Microsoft 的默认值），之后转入兜底流程，或者交给人处理。把结果当作数据，永远不要当作指令。

## 常见误区

- **“把整条记录都返回，数据越多越有帮助。”** 多余的字段会消耗 token、淹没答案，还可能暴露内部备注。
- **“堆栈跟踪能帮模型排错。”** 它没有给模型任何可以据以行动的信息，还可能泄露内部细节。
- **“模型自己会停止重试。”** 代码里没有上限的话，agent 可能围着一个失败的调用不断循环，白白烧钱。

## 典型面试题

<details>
<summary>工具运行之后，应该给模型发回什么？</summary>

一个简短、结构化、与调用 ID 绑定的结果：关键取值、稳定的记录 ID，以及来源或数据截至时间的引用。如果失败了，就改为发回一个带标志的错误。

</details>

<details>
<summary>空结果和错误有什么区别？</summary>

空结果表示工具运行正常，答案是“没有”：它是一个回显查询条件的正常结果。错误表示工具无法给出答案，所以要加上标志（Claude 上是 `is_error`，OpenAI 和 Gemini 上是一个错误对象）。

</details>

<details>
<summary>你的 `cancel_order` 工具遇到了支付网关超时。你返回什么？</summary>

一个带标志的错误：取消未得到确认，没有任何改动，`retryable: true`。绝不能返回 `False`，模型会把它读成成功。尝试次数上限会约束后续的重试。

</details>

<details>
<summary>你的助手泄露了一条内部欺诈备注和一份堆栈跟踪。哪里出了问题？</summary>

工具返回了整条记录和原始的异常文本。我会用白名单限定可返回的字段，把异常映射成安全的消息，把完整细节按 trace ID 记入日志，并检查框架的默认行为。

</details>

## 延伸阅读

- 参考：[Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)（Anthropic Claude Docs，约 15 分钟）
- 文章：[Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents)（Anthropic Engineering，约 25 分钟）

## 相关页面

- [工具调用循环与工具 trace](./02-tool-call-loop.md)
- [工具参数校验](./06-tool-argument-validation.md)
- [程序化 LLM 接口（输入、输出、错误、重试、日志）](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [集成故障诊断](../../m1/03-apis-data-integration/07-diagnosing-integration-failures.md)
- [提示词注入与越狱](../12-safety-guardrails-hitl/04-prompt-injection.md)
