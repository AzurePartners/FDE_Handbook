---
title: 重试与退避
row: M1-L6.2
---
**一句话：** 重试是在失败后再发一次同样的请求，退避则是把这些重试的间隔拉开，让吃力的服务有机会恢复。

## 是什么

任何对外部服务的调用都可能失败：网络断了，服务响应慢，或者暂时过载。重试就是假定这次失败是暂时的，再把同样的请求发一遍。

立即重试是个坏主意。如果服务已经很吃力，每个失败的客户端都马上重试，只会在最糟糕的时刻继续加压。这种堆积叫作重试风暴。指数退避的做法是每次重试之间等得越来越久，比如 1、2、4、再 8 秒。抖动则在每次等待上加一小段随机时间，避免大量客户端在完全相同的时刻一起重试、一起砸向服务。

## FDE 为什么需要

客户系统的集成总在以各种小而暂时的方式出错：天气 API 偶尔超时一次，汇率服务在部署期间返回 503，LLM API 在流量高峰时短暂限流。不做重试，每个小波动都会变成用户看得到的错误。对所有错误类型都重试且不做退避，又会把小波动放大成更大的故障，或者因为狂刷服务商而收到一张大账单。面试官考察的也是同样的判断力：重试该重试的错误，正确退避，知道何时停手。

## 核心概念

### 哪些错误该重试

| 应该重试 | 不应重试 |
|---|---|
| 网络超时 | 400 Bad Request（请求本身有误） |
| 429 Too Many Requests | 401 或 403（认证问题不会自己好） |
| 502、503、504（很可能是暂时的） | 404 Not Found、422 校验错误 |

重试那些表明对端出现暂时问题的错误。不要重试那些说明请求本身有误的错误，因为每次重试都会得到同样的结果。一个超时的 POST 可能其实已经成功了，所以只有在端点是幂等的情况下才重试它。

### 带抖动的指数退避

```python
import random, time

def call_with_retry(fn, max_attempts=5, base=1, cap=30):
    for attempt in range(max_attempts):
        try:
            return fn()
        except RetryableError:
            if attempt == max_attempts - 1:
                raise
            wait = min(cap, base * (2 ** attempt))
            wait += random.uniform(0, wait * 0.1)  # jitter
            time.sleep(wait)
```

### 重试风暴与 Retry-After

重试风暴是这样发生的：某个依赖挂了，所有客户端同时重试，即使最初的问题已经解决，这股洪流仍然把它压得起不来。抖动、退避上限和最大尝试次数可以防止这种情况。有些系统还会加一个熔断器：失败次数够多之后，在一段冷却期内停止调用该依赖，而不是继续重试。如果 API 返回了 `Retry-After` 响应头，就照它说的等，不要自己猜。

## 常见误区

- **“重试越多越保险。”** 对一个吃力的服务过度重试，可能把短暂故障拖成更长的故障，在按量计费的 API 上还会让费用成倍增加。
- **“所有失败的请求都要重试。”** 重试 400 或 401 只是浪费调用，因为请求每次都会以同样的方式失败。
- **“退避就是重试前固定等一会儿。”** 固定延迟不会随问题严重程度变化。指数退避才能给服务留出真正的恢复空间。

## 典型面试题

<details>
<summary>为什么要在指数退避上加抖动，而不是单纯把等待时间翻倍？</summary>

没有抖动的话，在同一时刻失败的客户端会在同一时刻再次重试，重新制造出导致失败的那波尖峰。抖动把重试分散开，正在恢复的服务看到的是涓涓细流，而不是一波波整齐的冲击。

</details>

<details>
<summary>你会重试 404 响应吗？为什么？</summary>

不会。404 表示资源不存在，这不是暂时性问题。重试只会浪费一次调用，结果还是一样。重试适用于那些表明对端出现暂时问题的错误，比如 503 或超时。

</details>

<details>
<summary>什么是重试风暴？如何防止？</summary>

它是一个反馈循环：依赖出故障，客户端重试，额外的负载让它持续故障，进而触发更多重试。防止的办法是指数退避加抖动、限制最大等待时间和尝试次数，必要时再加一个熔断器。

</details>

<details>
<summary>API 在返回 429 时带了 `Retry-After` 响应头，调用方应该怎么处理？</summary>

至少等待这么长时间再重试，而不是自己猜一个延迟。很多 LLM API 和有限流的 API 都会发送这个响应头，这样调用方对这次响应就不需要自己估算退避时间了。

</details>

## 延伸阅读

- 文章：[Job Queues Explained: Workers, Retries and Scheduling](https://blog.openreplay.com/job-queues-explained-workers-retries-scheduling/)（OpenReplay，讲解任务队列、worker、重试与调度，约 15 分钟）。
- 文档：[System Design Primer](https://github.com/donnemartin/system-design-primer)（GitHub，系统设计入门，看限流与可靠性部分）。

## 相关页面

- [超时](./04-timeouts.md)
- [幂等性](./05-idempotency.md)
- [限流](../03-apis-data-integration/04-rate-limits.md)
- 模块 4 有更深入的讲解：[可靠性：超时、重试、降级、熔断器、批处理与缓存](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
