---
title: 为现有服务添加 LLM 端点
row: M2-L1.9
---
**一句话：** LLM 端点是在现有后端里新增的一条窄路由（比如 `POST /triage`）：它在成本限制的把关之下调用模型，把模型的每种结果变成明确的 HTTP 响应，并且可以关掉。

## 是什么

客户很少需要一个全新的 AI 应用。他们需要的是在已有登录、日志和部署的软件里增加一项新能力，比如工单分类建议。你要做的是加一条路由。

调用本身很容易，真正的工作在于管控。账单告警，就像大额消费之后银行给你发的短信；消费限额，则是这张卡直接被拒付。你的端点需要的是那张被拒付的卡。

模块一已经讲过基础：从服务端发起调用（Anthropic 和 OpenAI 官方的 TypeScript SDK 在没有 `dangerouslyAllowBrowser` 标志时会拒绝在浏览器里运行），从配置中读取 key，自己设置超时而不是沿用 SDK 默认的 10 分钟（[超时](../../m1/06-reliability-scale/04-timeouts.md)），并把耗时长的工作移到后台任务。

## FDE 为什么需要

一家软件公司想在自己的工单系统里加上 AI 分诊：`POST /tickets/{id}/triage` 返回 `{category, priority, summary}`，演示也跑通了。第一周，有客户粘贴了一份几兆字节的日志，端点把它原样全部转发给了模型。被截断的 JSON 变成了一个 500，合作方的集成对它重试了三次，SDK 又重试了两次。流式输出到一半被拒答，屏幕上只留下半截摘要。最先发现账单异常的是财务；唯一的管控手段只是一条告警。（示例场景。）

## 核心概念

### 调用之前的 gate

OWASP 的 LLM Top 10 2026（2026 年 8 月）把失控的用量命名为 LLM06:2026 Unbounded Consumption，其中包括钱包拒绝服务（Denial of Wallet）攻击，并警告：“单靠传统的请求限流已经不够了。”完成认证之后，加上四道 gate：

- **输入上限：** 先限制字符数，再做一次发送前的 token 计数。
- **输出上限：** 固定的 `max_tokens`，用 Anthropic 的话说是“严格上限”，包含思考 token，因此最坏情况下的成本事先就能知道。
- **额度：** 每个客户账户（租户）每天可用的 token 数或美元金额。
- **模型供应商的支出上限：** 作为最后一道防线，超限时直接让调用失败，而不只是发告警。

```python
@app.post("/tickets/{ticket_id}/triage")
def triage(ticket_id: str, user=Depends(current_user)):
    if flags.is_on("triage_off"):              # 紧急开关
        return manual_queue(ticket_id)
    text = load_ticket(ticket_id)
    if len(text) > MAX_CHARS or count_tokens(text) > MAX_IN:
        raise HTTPException(413, f"Limit: {MAX_IN} tokens")
    if quota.used_today(user.tenant) >= DAILY_TOKENS:
        raise HTTPException(429, headers={"Retry-After": str(secs_to_reset())})
    return triage_ticket(text, max_tokens=400)
```

### 把结果映射为 HTTP 响应

拒答和截断从模型供应商那里是以 200 返回的，而供应商返回的错误说的是你的服务器出了问题，而不是调用方（供应商返回 401，意味着你的 key 出了问题）。所以要改为返回你自己定义的结果。一种站得住脚的约定如下：

| 结果 | 响应 |
|---|---|
| 输入超过上限 | 413，在响应体里写明上限 |
| 额度用完 | 429，带 `Retry-After` |
| 模型供应商过载或超时 | 503 并带 `Retry-After`，或 504 |
| 模型供应商认证错误或支出上限错误 | 500 或 503，同时发出告警 |
| 被截断，或修复循环之后仍然无效 | 200 `needs_review`，或 502 |
| 被拒答 | 200 `refused`，附一条安全消息 |
| 由兜底模型作答 | 200，`fallback_used: true` |

响应里要带上请求 ID，并让非暂时性的结果不可重试：客户端 3 次 × 修复循环 3 次 × SDK 3 次尝试，一次点击最多可能产生 27 次计费调用。

### 流式输出与一次校验过的响应

流式输出会边生成边发送文本，通常以 server-sent events 的形式。发出第一个字节之后，你就已经承诺了 200，所以较晚出现的拒答或截断，只能作为最后一个事件送达，客户端必须把已收到的部分文本标记出来或删除。JSON 在完整之前无法校验：给人读的文字可以流式输出，而代码要据以执行动作的字段，则应返回一次校验过的响应。

### 紧急开关与契约

紧急开关（kill switch）是一个运行时标志，最先检查，打开后无需重新部署就能把请求切到兜底路径，比如人工队列（需要重启才能生效的就太慢了）。要在预发布环境里测试它。契约也要写成文档，比如用 OpenAPI 3.2（它可以描述事件流）：各项上限、结果枚举、状态码、重试规则、额度，以及紧急开关的行为。

## 常见误区

- **“每分钟请求数的限流就能把成本控制住。”** 一个请求就可能带着一份粘贴进来的日志，或者引发一次很长的推理。要加上 token 上限、输出上限和额度。
- **“模型返回了 200，所以我的端点也返回 200。”** 被截断、被拒答和无效的回复同样是 200。要先检查停止原因并做校验。
- **“模型输出无效就该返回 422。”** 422 是在怪调用方。糟糕的模型输出属于上游失败：返回 502，或者 200 `needs_review`。

## 典型面试题

<details>
<summary>模型调用之前应该放哪些检查？</summary>

输入上限和发送前的 token 计数、固定的 `max_tokens`、按租户的额度，以及作为最后一道防线的模型供应商支出上限。

</details>

<details>
<summary>支出告警与支出上限有什么区别？</summary>

告警只是在流量照常通过的同时发出通知。上限则会让请求停下来；我会把这种错误当作不可重试的，必要时触发紧急开关。

</details>

<details>
<summary>什么时候该流式输出回复，什么时候该返回一次校验过的响应？</summary>

给人读的文字用流式输出，并以一个结果事件收尾。代码要写进工单的字段，则返回一次校验过的 JSON 响应。

</details>

<details>
<summary>账单一夜之间涨到了三倍，日志里没有任何错误。你会怎么办？</summary>

先调低额度或打开紧急开关把影响控制住，再按 key 和租户拆分用量，找出循环、超大输入或成倍放大的重试。

</details>

## 延伸阅读

- 练习：[Build and deploy an Azure OpenAI (Flask) chatbot](https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-openai-chatbot-python)（Microsoft Learn，约 45 分钟）
- 参考：[LLM06:2026 Unbounded Consumption](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM06_UnboundedConsumption.md)（OWASP GenAI Security Project，约 8 分钟）

## 相关页面

- [Web 应用的分层](../../m1/02-how-web-apps-run/10-frontend-backend-database-layers.md)
- [状态码](../../m1/02-how-web-apps-run/06-status-codes.md)
- [同步与异步](../../m1/06-reliability-scale/01-sync-vs-async.md)
- [程序化 LLM 接口（输入、输出、错误、重试、日志）](./08-programmatic-llm-interfaces.md)
- [LLM API（请求、响应、流式输出、SDK）](./03-llm-apis.md)
