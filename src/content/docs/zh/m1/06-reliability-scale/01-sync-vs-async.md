---
title: 同步与异步
row: M1-L6.1
---
**一句话：** 同步请求会让调用方一直等到工作完成；异步请求则立即返回，工作另行完成。

## 是什么

最简单的模式是同步：服务器把活干完再回复，调用方（浏览器或另一个服务）全程等待。如果只是一次毫秒级的数据库查询，这完全没问题。但遇到慢任务就撑不住了，比如调用大语言模型，或者生成一份要 10 到 60 秒的报表。让调用方等这么久，很容易超时；而用户看到页面没反应，往往会再点一次按钮，于是同样的慢任务被发了两遍。

异步则反过来：服务器接下请求后，马上回复“收到，正在处理”，然后把真正的工作交出去另行执行。调用方拿到的不是现成结果，而是一个 ID，之后可以凭它查询进度。可以想象一家用取餐小票的餐厅：服务员很快记下订单，后厨在一旁做菜，菜做好了再端上来，而不是所有人都堵在柜台前干等。

异步并不会让工作本身变快。报表生成的总耗时还是那么长，只是调用方不用再傻等了。

## FDE 为什么需要

系统一开始往往是同步的，因为这最容易先做出来。问题要等到真实流量进来才暴露：LLM 调用或报表确实要花时间，用户连点按钮，或者请求超时，报一个让人看不懂的错误。能识别出这种情况的 FDE，会把慢任务移出请求路径，而不是去反复调超时参数，那只会把同样的失败往后推。

## 核心概念

```python
# Synchronous: the request waits for the LLM call
@app.post("/summarize")
def summarize(text: str):
    result = call_llm(text)          # takes 20 seconds
    return {"summary": result}

# Asynchronous: the request returns immediately
@app.post("/summarize")
def summarize(text: str):
    job_id = queue.enqueue(call_llm, text)
    return {"job_id": job_id, "status": "processing"}
```

当工作很慢、要调用不稳定的外部服务，或者调用方并不需要马上拿到结果时（比如发送确认邮件），用异步处理。当工作很快、调用方需要拿到结果才能继续时（比如检查用户名是否可用），保持同步。

调用方最终还是要知道结果。通常的做法是拿着任务 ID 轮询，或者在任务完成时接收 webhook，这部分在“Webhook 与轮询”一页讲。真正执行异步工作的队列和 worker 也是单独的主题。

## 常见误区

- **“异步就是更快。”** 它并不会加快工作本身，只是让调用方的请求不必等这项工作完成，所以响应更快。
- **“这里的异步和代码里的 async/await 是一回事。”** 本页讲的是一种架构模式：接收请求、另行执行工作、之后再回报结果。编程语言里的 async/await 关键字是另一回事，是在单个进程内处理并发的代码层手段。
- **“后台任务不需要状态。”** 如果工作要花好几秒以上，调用方就需要一种查询进度的方式，否则它会以为请求失败了。

## 典型面试题

<details>
<summary>为什么要把慢的 LLM 调用移出请求处理函数，单独执行？</summary>

慢调用可能要很多秒，而 HTTP 请求往往等不到那时就超时了。阻塞等待还会占住服务器，限制它能同时处理的其他请求数量。立即返回一个 ID、把工作另行执行，可以同时避免这两个问题。

</details>

<details>
<summary>分别举一个应该保持同步和不应该同步的任务例子。</summary>

检查用户名是否可用应该保持同步，因为它很快，而且调用方需要这个结果才能继续。生成年度 PDF 报表应该异步处理，因为它可能耗时很长，等报表好了再通知调用方即可。

</details>

<details>
<summary>把任务改成异步，它会完成得更快吗？</summary>

不会。工作本身的耗时不变。变化在于调用方不再被阻塞，在此期间可以去处理其他请求或继续做别的事。

</details>

## 延伸阅读

- 文章：[Job Queues Explained: Workers, Retries and Scheduling](https://blog.openreplay.com/job-queues-explained-workers-retries-scheduling/)（OpenReplay，讲解任务队列、worker、重试与调度，约 15 分钟）。
- 文章：[Background Job and Queue Patterns, 2026 Engineering Reference](https://www.digitalapplied.com/blog/background-job-queue-patterns-2026-engineering-reference)（Digital Applied，后台任务与队列模式的工程参考）。

## 相关页面

- [队列与 worker](./02-queues-and-workers.md)
- [重试与退避](./03-retries-and-backoff.md)
- [Webhook 与轮询](../03-apis-data-integration/05-webhook-vs-polling.md)
