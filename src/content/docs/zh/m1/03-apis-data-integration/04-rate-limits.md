---
title: 限流
row: M1-L3.1
---
**一句话：** 限流是对客户端在一个时间窗口内能发送多少请求（或多少 token）设定的上限，超出上限就会收到 429 响应，而不是正常的结果。

## 是什么

任何被很多人共用的 API 都需要防止某一个客户端把它压垮。限流就是这样一条规则，比如“每分钟不超过 60 个请求”。超出上限会返回 HTTP 429，即“Too Many Requests”，通常还带有 `Retry-After` header。不理会它而立刻重试，只会再收到一个 429。

LLM（大语言模型）API 通常还会加上第二个维度：每分钟 token 数。token 是模型处理文本时切分出的小片段，提示词和响应都要计入。一个脚本如果遍历一千行数据、尽可能快地调用 LLM，很快就会撞上这些上限，尤其是在用量等级较低的新账号上。

## FDE 为什么需要

客户项目里经常要大批量调用 API：夜间同步 CRM、批量总结一批文档。一个没考虑限流的脚本，在小规模测试中跑得好好的，到了真正的批量运行时却半途失败，满屏 429 错误，还有一些行被悄悄跳过，而且是当着客户的面。

## 核心概念

### 处理 429

```python
import time, requests

def call_api(payload, max_attempts=5):
    for attempt in range(max_attempts):
        response = requests.post(API_URL, json=payload, headers=HEADERS, timeout=30)
        if response.status_code != 429:
            response.raise_for_status()
            return response.json()
        retry_after = response.headers.get("Retry-After", "")
        # 服务器给了秒数就按它等；否则依次退避 1、2、4、8 秒
        wait = int(retry_after) if retry_after.isdigit() else 2 ** attempt
        if attempt < max_attempts - 1:
            time.sleep(wait)
    response.raise_for_status()  # 达到 max_attempts 仍是 429：明确报错放弃
```

服务器要求等多久就等多久；没给时间就把等待时间翻倍；尝试固定次数后停止。有些 429 靠等待永远解决不了：月度消费上限或配额耗尽造成的 429，在有人调高上限之前会一直存在，所以循环必须结束并报告错误。

### 客户端节流

与其尽可能快地发请求、再对 429 做出反应，客户端可以主动控制节奏，比如上限是每分钟 60 次，就每秒发一个请求：

```python
def throttled_calls(items, calls_per_second=1):
    delay = 1 / calls_per_second
    for item in items:
        call_api(item)
        time.sleep(delay)
```

事先控制节奏，是在避免失败，而不是等失败发生后再应对。

### 每分钟请求数与每分钟 token 数

请求数上限限制的是你能调用多少次。token 上限限制的是发送和接收的总量，所以少数几个长提示词就可能先耗尽 token 预算，而请求次数还远没到上限。LLM 服务商通常同时执行这两种限制。以 Anthropic 为例，它分别限制每分钟的请求数、输入 token 数和输出 token 数，另外还有月度消费上限。

### 用队列削平突发流量

如果某个操作会一下子触发一大批调用，比如批量上传 200 份文档、每份都要生成摘要，那么用一个队列加一个以稳定速率处理的 worker，就能让系统保持在上限以内，而不是一次性发出 200 个请求。详见队列与 worker 那一页。

## 常见误区

- **“429 说明哪里坏了。”** 它说明请求来得比 API 允许的快。解决办法是给客户端控速，而不是去调试这次调用本身。
- **“收到 429 后立刻重试没问题。”** 这通常会再触发一个 429，还可能延长惩罚窗口。
- **“只有明显的高强度使用才会碰到限流。”** 一个遍历几百条数据的脚本，就可能很快撞上每分钟的上限，尤其是长提示词带来的 token 上限。

## 典型面试题

<details>
<summary>429 是什么意思？客户端应该怎么做？</summary>

它表示客户端超出了 API 的限流上限。客户端应该退避，最好按 `Retry-After` header（如果有）给出的时间等待，然后再重试，而不是立刻重发。

</details>

<details>
<summary>一个批处理任务要调用 API 总结 500 份文档，而该 API 每分钟只允许 60 个请求。你会怎么设计？</summary>

把文档放进队列，由一个 worker 处理，控制速率保持在每分钟 60 次以内，大约每秒一次，而不是一次性发出 500 个请求。worker 还应该在遇到 429 时退避，并记录哪些文档已经处理成功。

</details>

<details>
<summary>队列如何帮助系统保持在 API 的限流上限以内？</summary>

如果没有队列，一波用户操作会直接触发一波 API 调用。有了队列，多出来的工作先存在队列里，worker 以符合上限的稳定速率从中取任务，把流量尖峰削平成 API 能承受的平稳请求流。

</details>

## 延伸阅读

- 文档：[Rate limits](https://platform.claude.com/docs/en/api/rate-limits)（Anthropic API 文档中的限流说明）
- 文档：[System Design Primer](https://github.com/donnemartin/system-design-primer)（GitHub，看限流相关章节）

## 相关页面

- [集成故障诊断](./07-diagnosing-integration-failures.md)
- [重试与退避](../06-reliability-scale/03-retries-and-backoff.md)
- [队列与 worker](../06-reliability-scale/02-queues-and-workers.md)
- 模块 4 深入讲解：[API 版本、限流与备用数据源](../../m4/01-external-apis-mcp-and-connector-design/03-api-versions-rate-limits-and-fallback-sources.md)
