---
title: 缓存
row: M1-L6.4
---
**一句话：** 缓存是把数据的副本放在一个能快速读取的地方，这样每次再需要同样的数据时，应用就不必把慢的工作重做一遍。

## 是什么

和读取内存里现成的值相比，获取数据往往很慢。调用外部天气 API 要花实实在在的网络时间。而同样的请求经常重复出现，比如很多用户都在查同一个城市的天气。答案几分钟内几乎不会变，每次都重做这项慢工作，既浪费时间又浪费钱。

缓存在第一次时把结果存下来，之后的请求直接返回存好的副本。缓存命中（cache hit）表示答案来自缓存。缓存未命中（cache miss）表示缓存里还没有，于是应用做一次慢工作，并把结果存起来。

缓存存在于多个层次：浏览器会缓存图片和部分 API 响应；CDN 在离用户近的地方缓存静态文件；应用服务器可以在内存里缓存计算结果；像 Redis 这样的共享缓存则把数据存在任何单台服务器之外，让多台服务器共用。

## FDE 为什么需要

外部 API 调用通常是客户应用中最慢、最脆弱的部分，也是最适合缓存的部分：汇率没必要每个请求都重新拉一次。缓存这些调用能让应用更快，也能保护它不受服务商那边的限流和故障影响。流量小的时候不做缓存也没问题。但在真实负载下，同一个未缓存的调用乘以成千上万的用户，就可能触发限流或跑出一张大账单。更难的一点是坦然承认：缓存的数据可能会稍微过时。

## 核心概念

```python
import time
_cache = {}

def get_exchange_rate(base, target, ttl_seconds=3600):
    key = (base, target)
    cached = _cache.get(key)
    if cached and time.time() - cached["time"] < ttl_seconds:
        return cached["value"]                   # cache hit
    value = call_exchange_rate_api(base, target)  # cache miss
    _cache[key] = {"value": value, "time": time.time()}
    return value
```

**TTL**（time to live，存活时间）是缓存值在被刷新之前保留多久。TTL 短，数据更新鲜；TTL 长，成本更低，但返回过期数据的时间也可能更长。

**缓存失效（cache invalidation）**是指因为底层数据变了，在 TTL 到期之前就删除或更新缓存值。如果用户编辑了一条记录，而应用里存着这条记录的缓存副本，就必须让这份缓存失效，否则用户会看到自己的修改“消失”了。很容易漏掉某条修改了数据却没有清除对应缓存条目的代码路径。

**过期数据的取舍**：每一个缓存都在赌，稍微过时的数据是换取速度时可以接受的代价。对天气预报来说，这个赌注很合理；对账户余额来说就没那么合理了。

| 层次 | 缓存什么 | 典型 TTL |
|---|---|---|
| 浏览器 | 图片、脚本、部分 API 响应 | 几分钟到几天 |
| CDN | 静态文件 | 几分钟到几小时 |
| 应用服务器（内存） | 计算结果、小型查找表 | 几秒到几分钟 |
| Redis 或类似组件 | 任何需要多台服务器共享的数据 | 几秒到几小时 |

## 常见误区

- **“缓存总是意味着更快更好。”** 它意味着更快、更便宜，但也可能过期；只有当这种过期对该数据可以接受时，才没问题。
- **“缓存未命中是 bug。”** 未命中是正常的，尤其是在缓存刚被清空之后。只有未命中率高得反常，才说明有问题。
- **“失效会自动发生。”** 不会，除非修改数据的那段代码同时清除或更新了对应的缓存条目。

## 典型面试题

<details>
<summary>缓存命中和缓存未命中有什么区别？</summary>

命中表示数据已经在缓存里，直接返回。未命中表示缓存里没有，于是应用做了底层的慢工作，并把结果存起来。

</details>

<details>
<summary>什么是缓存失效？为什么大家都说它难？</summary>

它是指在底层数据变化时，删除或刷新对应的缓存值。难就难在每一条修改数据的代码路径都必须同时清除对应的缓存条目，而漏掉一条非常容易。

</details>

<details>
<summary>客户做了修改之后，仪表盘显示的还是旧数字。你会先检查什么？</summary>

检查仪表盘是否读的是缓存、TTL 是多少，以及做出这次修改的写路径是否也让对应条目失效了。如果 TTL 还没到期，也没有任何东西清除它，解决办法就是在写路径上加上失效处理。

</details>

## 延伸阅读

- 文档：[System Design Primer](https://github.com/donnemartin/system-design-primer)（GitHub，系统设计入门，看缓存部分）。
- 文档：[system-design-101](https://github.com/ByteByteGoHq/system-design-101)（ByteByteGo，GitHub 上的图解系统设计）。

## 相关页面

- [竞态条件](./06-race-conditions.md)
- [负载均衡与水平扩展](./09-load-balancing-and-horizontal-scaling.md)
- [集成故障诊断](../03-apis-data-integration/07-diagnosing-integration-failures.md)
- 模块 4 有更深入的讲解：[可靠性：超时、重试、降级、熔断器、批处理与缓存](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
- 模块 4 有更深入的讲解：[成本模型：token、模型选择与何时改用代码](../../m4/04-reliability-cost-latency-and-scale/02-cost-model-tokens-model-choice-and-when-to-use-code.md)
