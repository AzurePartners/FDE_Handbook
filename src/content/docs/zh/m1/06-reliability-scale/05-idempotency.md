---
title: 幂等性
row: M1-L6.2
---
**一句话：** 幂等操作无论执行多少次，最终结果都一样，所以安全地重试它永远不会产生重复。

## 是什么

设想用户觉得页面有点慢，双击了“立即支付”。如果支付端点每收到一个请求就扣一次款，这一双击就意味着扣两次钱。幂等性就是用来防止这种情况的：同样的输入，操作执行一次还是五次，结果都一样。就像电梯按钮，按五次“5”，电梯也不会去五趟 5 楼。

这一点之所以重要，是因为网络并不可靠。客户端发出请求，服务器处理完了，响应却在回来的路上丢了。客户端什么都没收到，于是重试。这就是至少一次投递（at-least-once delivery）：保证请求至少送达一次，但不保证不会送达多次。正是幂等性让重试在这种不确定性下变得安全。

## FDE 为什么需要

这是一个经典的生产 bug：外部服务响应慢时，用户双击了“保存”，结果应用里出现了同一条记录的两份副本。它在早期测试中很少暴露，因为那时没人双击，也没有东西超时。在客户项目里，它表现为客户被重复扣费，或者 webhook 触发了两次导致出现重复行。在上线前就发现支付或“创建记录”流程缺少幂等键，可以避免一次难堪的事故。

## 核心概念

### 幂等的 HTTP 方法

| 方法 | 是否幂等？ | 原因 |
|---|---|---|
| GET | 是 | 读取不会改变任何东西 |
| PUT | 是 | 把资源设置为某个状态，每次得到的都是同一状态 |
| DELETE | 是 | 删除一个已删除的东西，它仍然是删除状态 |
| POST | 默认不是 | 普通的 POST 通常每次都会新建一个东西 |

### 幂等键

这是 POST 的标准解法：客户端为这次操作生成一个唯一 ID 并随请求发送。服务器检查是否已经处理过这个键。如果处理过，就返回原来的结果，而不是再做一遍。

```python
@app.post("/charge")
def charge(payload: ChargeRequest, idempotency_key: str = Header(...)):
    existing = db.get_result(idempotency_key)
    if existing:
        return existing            # already processed
    result = process_payment(payload)
    db.save_result(idempotency_key, result)
    return result
```

两个完全相同的请求同时到达时，可能都查不到这个键，所以真实系统还会在存储层用唯一约束保存这个键，下面就讲。

### 用唯一约束去重

唯一约束是在存储层阻止重复的方法。如果“同一客户在同一购物车会话中只能有一个订单”绝不能出现两次，那么在 `(customer_id, session_id)` 上加约束，就能让第二次插入明确报错，而不是悄悄插入一条重复数据。

```sql
CREATE TABLE orders (
    customer_id INTEGER,
    session_id TEXT,
    result TEXT,
    UNIQUE (customer_id, session_id)
);
```

幂等性是操作的属性：执行两次是安全的。去重（查找幂等键或唯一约束）则是保证这一属性的机制。

## 常见误区

- **“重试才是 bug。”** 在不可靠的网络上，重试是正确的行为。真正的 bug 是端点不能安全地被重试。
- **“幂等键只用于支付。”** 任何不能重复的创建操作都能受益：表单提交、由 webhook 触发的邮件、工单。
- **“光靠唯一约束就能解决一切。”** 它能阻止重复行，但应用仍然需要捕获违反约束的错误，并妥善地返回原来的结果。

## 典型面试题

<details>
<summary>一个操作是幂等的，是什么意思？</summary>

用同样的输入执行多次，最终结果和执行一次相同。按照惯例，GET、PUT 和 DELETE 是幂等的；POST 不是，除非应用额外加了幂等键之类的机制。

</details>

<details>
<summary>如果“立即支付”被点了两次，你会如何防止重复扣款？</summary>

让客户端为每次结账尝试生成一个唯一的幂等键。服务器检查是否见过这个键；如果见过，就返回已存储的结果，而不是再扣一次。在交易标识上加唯一约束，可以再多一层保护。

</details>

<details>
<summary>什么是至少一次投递？为什么它让幂等性成为必需？</summary>

它保证请求会送达一次或多次，但绝不会是零次。客户端并不总能判断一个看似失败的请求是否其实已经成功，所以它可能会重试，这就要求被重试的操作是幂等的，否则就会出现重复。

</details>

## 延伸阅读

- 文章：[Idempotency](https://algomaster.io/learn/system-design/idempotency)（AlgoMaster，讲解幂等性，约 15 分钟）。
- 文章：[Why Is My Job Running Twice? Understanding Idempotency and Deduplication](https://medium.com/@surajs78/why-is-my-job-running-twice-understanding-idempotency-and-deduplication-in-distributed-systems-d56edbcad051)（Medium，分布式系统中的幂等与去重）。
- 文章：[Preventing Race Conditions with Locks, Atomic Updates, and Idempotency](https://oatllo.com/preventing-race-conditions-web-app)（oatllo，用锁、原子更新和幂等性防止竞态条件）。

## 相关页面

- [重试与退避](./03-retries-and-backoff.md)
- [竞态条件](./06-race-conditions.md)
- [HTTP 请求与响应](../02-how-web-apps-run/04-http-request-response.md)
- 模块 4 有更深入的讲解：[可靠性：超时、重试、降级、熔断器、批处理与缓存](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
