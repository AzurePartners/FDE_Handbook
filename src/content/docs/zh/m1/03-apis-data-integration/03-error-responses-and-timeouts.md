---
title: 错误响应与超时
row: M1-L3.1
---
**一句话：** 失败的 API 调用有两种情况：要么返回了一个状态码和一段你能读的错误响应体，要么在你愿意等待的时间内根本没有返回；这两种情况需要不同的处理方式。

## 是什么

API 调用出问题时，失败有两种不同的形态。第一种是有响应：服务器回复了，但状态码不在 200 段，通常还附带一个描述问题的 JSON 响应体。第二种是超时：根本没有响应，所以没有状态码，也没有响应体可读，只有一片沉默。

一个规范的 API 会返回结构化的错误响应体，而不只是状态码，这样调用方才能据此处理：

```json
{
  "error": {
    "code": "invalid_date",
    "message": "start_date must be before end_date"
  }
}
```

状态码告诉你大致类别（客户端错误还是服务器错误）。响应体告诉你具体错在哪里；一个好的 `code` 字段能让你的代码直接按错误类型分支处理，而不用去解析英文文本。

## FDE 为什么需要

客户会说“集成坏了”，并期待你快速、准确地判断到底发生了什么。读错误响应体而不只看状态码，往往决定了你是两分钟修好真正的问题，还是瞎猜一个小时。

## 核心概念

### 读错误响应体

大多数 API 即使在失败时，也会在响应体里放有用的细节：哪个字段无效，期望的值是什么，有时还会给一个文档链接。开发阶段，调用失败时一定要把响应体记录到日志里，而不只是状态码。各状态码的完整含义在状态码那一页；这一页讲的是读到状态码之后该怎么做。

### 设置明确的超时

好的客户端代码会设置明确的超时，而不是无限等待，并且把超时和错误响应分开处理：

```python
import requests
try:
    r = requests.get("https://api.open-meteo.com/v1/forecast",
                      params={"latitude": 31.5, "longitude": 74.3, "current_weather": True},
                      timeout=5)
    r.raise_for_status()
except requests.exceptions.Timeout:
    print("no response within 5 seconds")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error (4xx or 5xx): {e}")
```

### 超时与错误响应

超时和 500 都说明出了问题，但指向的方向不同。500 表示服务器收到了请求，并报告自己那边出了问题。超时表示什么都没有返回：网络慢、服务器过载、防火墙丢包或服务器宕机，在调用方看来完全一样。这指向的是网络或基础设施问题，不一定是服务器的应用代码；要诊断根因，光看客户端自己的日志不够，这部分在集成故障诊断那一页讲。

## 常见误区

- **“只要报错，就说明 API 坏了。”** 一个格式规范的错误响应，比如日期范围不对返回 400，说明 API 完全在按设计工作。问题出在你的应用怎么调用它。
- **“超时和 500 是同一个问题。”** 500 表示服务器有回复，并告诉你它那边出了问题。超时表示什么都没有返回。
- **“光看状态码就知道该修什么。”** 具体细节通常在错误响应体里。两个不同的 400 响应，可能指向完全不同的问题。

## 典型面试题

<details>
<summary>为什么客户端代码总要设置明确的超时？</summary>

不设超时，一个卡住的连接可能让请求无限期阻塞，用户只能盯着转圈，不知道它会不会结束。明确的超时把无限等待变成一个清晰、可处理的失败。

</details>

<details>
<summary>一个 API 调用返回了 400。你接下来看什么？</summary>

看响应体，而不只是状态码。大多数 API 会附带一条消息或错误码，说明哪个字段或哪个值被拒绝了，这比单看状态码有用得多。

</details>

<details>
<summary>在你自己的代码里，怎么区分超时和 500 错误？</summary>

500 会作为 HTTP 错误被捕获，带有状态码，通常还有响应体；超时是另一种异常（在 Python 里是 `requests.exceptions.Timeout`），因为在设定的等待时间内根本没有收到响应而抛出。两者应该作为不同情况分别处理，而不是合并成一个笼统的“失败了”分支。

</details>

## 延伸阅读

- 文章：[REST API Testing Guide for Beginners](https://dev.to/_d7eb1c1703182e3ce1782/rest-api-testing-guide-for-beginners-ke4)（DEV，REST API 测试入门）

## 相关页面

- [状态码](../02-how-web-apps-run/06-status-codes.md)
- [集成故障诊断](./07-diagnosing-integration-failures.md)
- [重试与退避](../06-reliability-scale/03-retries-and-backoff.md)
- [超时](../06-reliability-scale/04-timeouts.md)
