---
title: Webhook 与轮询
row: M1-L3.3
---
**一句话：** 轮询是反复问另一个系统“有变化了吗”，而 webhook 是在事情发生的那一刻由另一个系统主动调用你。

## 是什么

两个需要保持同步的系统有两种做法。轮询是你的系统按计划去问“有新东西吗？”，比如每五分钟用 `GET /orders?since=<last_check>` 查一次。webhook 则反过来：事情一发生，另一个系统就立刻发来一个请求，实际上就是一个带 JSON 请求体的 HTTP POST，描述发生了什么。

一个好用的经验法则：谁先知道事情发生了，就由谁发起动作。如果你的系统查的是自己的数据库，轮询很自然。如果另一个系统先知道，比如支付服务商在付款到账的那一刻就知道，webhook 更合适，因为轮询意味着你得猜该多久问一次。

## FDE 为什么需要

webhook 和轮询在客户集成中随处可见：同步 CRM、响应一笔付款、在文件处理完成后把它取回来。选错了会带来实际问题：系统只是偶尔轮询，导致事件到得很晚；或者轮询太频繁，把客户的服务器压垮。webhook 也有自己的失败方式：一直没到，或者到了两次。

## 核心概念

### 各自适用的场景

| | 轮询 | Webhook |
|---|---|---|
| 由谁发起 | 你的系统，按定时器 | 另一个系统，在事情发生时 |
| 延迟 | 取决于轮询频率 | 几乎实时 |
| 搭建成本 | 简单，一个定时调用 | 需要公网 URL、安全措施、重试 |
| 适合场景 | 低频变化 | 时间敏感的事件，比如付款 |

### Webhook 签名

webhook 是从公网发来的请求，所以你的端点必须验证它确实来自声称的那个系统。标准做法是：发送方用共享密钥对原始 payload 计算 HMAC，放在 header 里发送，通常还附带时间戳以防重放攻击。你的端点对原始请求体重新计算一遍，用恒定时间比较；不一致就拒绝。

```
POST /webhooks/payment-received
X-Signature: t=1727870000,v1=<64-hex-char HMAC-SHA256 of timestamp + body>
Content-Type: application/json

{"event": "payment.succeeded", "amount": 4999}
```

跳过验证，意味着任何发现这个 URL 的人都能发送伪造事件，比如一条假的“付款成功”。

### 重试

网络不可靠，所以大多数 webhook 服务商在你的端点没有响应时会重新投递，通常要求在几秒内返回 2xx 响应。因此你的端点可能收到同一个事件两次，这意味着处理逻辑必须能安全地重复执行；端点还要快速响应，慢的工作放到之后再做。

一个常见模式：客户把文件上传到某个 SaaS 工具，工具在后台处理，完成后触发一个 webhook，因为没人能提前知道处理要花多久。这种情况下用轮询就得猜一个间隔：太频繁浪费资源，太稀疏又显得慢。

## 常见误区

- **“webhook 总是比轮询好。”** webhook 需要公网端点、安全措施和重试逻辑。对于不频繁或无关紧要的变化，按合理的频率轮询更简单，也够用。
- **“一个 webhook 只会到达一次。”** 大多数服务商保证的是“至少一次”投递，而不是“恰好一次”。重复投递是预期行为，不是 bug。
- **“轮询越频繁，数据就越新。”** 轮询过于频繁可能触发限流，甚至被吊销访问权限。按 API 文档推荐的频率轮询。

## 典型面试题

<details>
<summary>对于一个具体的集成，你怎么在轮询和 webhook 之间做选择？</summary>

问一句：谁知道事件什么时候发生？如果另一个系统先知道，比如付款到账，webhook 不用猜间隔，能立刻响应。如果是你的系统检查自己的状态，或者你无法暴露公网端点，轮询更简单。

</details>

<details>
<summary>为什么 webhook 的 payload 需要签名？</summary>

因为 webhook 端点是一个接收外部请求的公网 URL，任何找到它的人都能发送冒充真实事件的伪造 payload。签名用只有发送方和接收方共享的密钥计算，让端点能确认请求确实来自预期的来源。

</details>

<details>
<summary>支付服务商的 webhook 对同一个事件触发了两次。你的端点应该怎么处理？</summary>

让处理逻辑可以安全地执行多次：在应用该事件的效果之前，先检查这个事件 ID 是否已经处理过，而不是假设每次投递都是唯一的。

</details>

## 延伸阅读

- 文章：[Webhooks vs API Polling](https://hookdeck.com/webhooks/faq/webhook-vs-api-polling)（Hookdeck，webhook 与 API 轮询对比）
- 文章：[Webhooks vs APIs, the Difference](https://www.authgear.com/post/webhooks-vs-apis-difference/)（Authgear，webhook 与 API 的区别）

## 相关页面

- [REST 设计约定](./01-rest-conventions.md)
- [集成故障诊断](./07-diagnosing-integration-failures.md)
- [幂等性](../06-reliability-scale/05-idempotency.md)
- [集成边界](./06-integration-boundaries.md)
