---
title: 完整的请求生命周期
row: M1-L2.4
---
**一句话：** 在浏览器里点一下，就会触发一整串步骤：DNS 查询、建立连接、加密、发送请求、后端逻辑、返回响应；能顺着这条链路追下去，是找到真正故障点的最快办法。

## 是什么

Web 应用里的每个动作，无论是点击按钮还是加载页面，背后都是同一套流程。首先，如果浏览器还不知道服务器的地址，就要做一次 DNS 查询，把域名转换成 IP 地址。接着，浏览器向这个地址建立连接；如果是 HTTPS，还要进行 TLS 握手，建立加密并验证服务器身份。这之后，真正的 HTTP 请求才会经由这条连接发出。后端收到请求后运行自己的逻辑，其中可能包括读写数据库或调用外部服务，然后返回一个 HTTP 响应，浏览器再使用这个响应，比如渲染新内容。

```
Browser needs api.example.com
        |
        v
DNS lookup: name to IP address
        |
        v
Connection opens to that IP address, on port 443
        |
        v
TLS handshake: browser and server agree on encryption
        |
        v
HTTP request sent over the encrypted connection
        |
        v
Backend runs logic, reads/writes database, maybe calls external services
        |
        v
HTTP response received
        |
        v
Shown as one row in the browser's Network tab
```

这套流程大部分是自动完成的，而且很快。浏览器 DevTools 里的 Network 面板，是查看其中可见部分（也就是请求和响应本身）的主要工具。它会记录页面发出的每个 HTTP 请求，显示方法、URL、状态码、头、耗时以及请求和响应的 body。大多数浏览器按 F12 或右键选择“检查”（Inspect）即可打开 DevTools。

## FDE 为什么需要

在和客户一起现场调试时，能否实时地把一个请求从按钮点击一路追到数据库查询再追回来，决定了你看起来是胸有成竹还是手足无措。它还能帮你避开一个常见陷阱：轻信 AI 编程工具对某段代码作用的描述，而不是通过观察实际的请求和响应去确认。如果 AI 说“这个端点返回用户的订单历史”，追一下真实请求，就知道这话是不是真的。

## 核心概念

### 在 Network 面板里查看请求

对每个请求，Network 面板会显示名称（URL）、方法、状态码、类型（API 调用是 `fetch`，页面本身是 `document`）和耗时。点开一个请求，会出现几个子标签页，分别展示请求头、响应头，以及请求负载或响应 body，准确显示发出了什么、收回了什么。

### 完整追踪示例：点击“Get Weather”

1. 用户点击“Get Weather”。前端 JavaScript 读取城市名，发送 `GET /weather?city=Lahore`。
2. 在 Network 面板里，这表现为一行记录：方法 `GET`，状态 `200`，类型 `fetch`。
3. 响应 body 里是包含天气数据的 JSON。
4. 在代码里找到对应的后端路由，比如 FastAPI 应用中的 `@app.get("/weather")`。
5. 读一下这个函数，可以看到它调用了天气服务商，格式化结果并以 JSON 返回，与 Network 面板里看到的一致。

```python
@app.get("/weather")
def get_weather(city: str):
    forecast = fetch_forecast(city)
    return {"city": city, "forecast": forecast}
```

如果 Network 面板显示的是 `500` 而不是 `200`，下一步就是去检查 `fetch_forecast` 以及它调用的服务商，而不是靠猜。

## 常见误区

- **“Network 面板里什么都没有，说明后端挂了。”** 也可能是前端根本没尝试发送请求，比如页面上更早的地方出了 JavaScript 错误。同时看一下 Console 面板，就能分辨是哪种情况。
- **“Network 面板里请求很快，整个页面就快。”** Network 面板只统计它追踪的请求耗时。渲染和其他浏览器工作不在这个计时之内，依然可能让页面显得很慢。
- **“DNS 和 TLS 是网络工程师才需要管的事。”** 它们很少需要操心，但 DNS 配置错误或 TLS 证书过期，正是“网站完全打不开”的常见原因。
- **“追踪一个请求就得把后端每一行都读一遍。”** 追踪的意思是跟着这一个请求走过的具体路径，通常只占代码库的一小部分。

## 典型面试题

<details>
<summary>完整讲一遍单个请求的生命周期，从点击按钮到页面更新。</summary>

如果还不知道 IP 地址，先由 DNS 把域名转换成 IP 地址；浏览器建立连接，如果是 HTTPS 还要完成 TLS 握手；HTTP 请求经由这条连接发出；后端运行逻辑并返回响应；浏览器使用这个响应，比如更新页面。

</details>

<details>
<summary>对单个请求，Network 面板能给你哪些信息？</summary>

方法、完整 URL、状态码、请求和响应的头与 body，以及耗时信息。这些合在一起，能准确显示发出了什么、收回了什么。

</details>

<details>
<summary>一个请求在 Network 面板里根本没出现，和一个请求出现了但状态是 500，分别说明什么？</summary>

请求在 Network 面板里没出现，说明前端根本没发出它，通常是因为 JavaScript 错误。请求出现了但显示失败且没有状态码，指向网络层面的问题，比如 DNS 或连接被拒绝。请求出现且状态为 500，说明它已经到达服务器，是服务器自身的逻辑在处理时失败了。

</details>

<details>
<summary>AI 工具告诉你某个端点“返回用户完整的订单历史”。你会怎么确认，而不是直接相信？</summary>

在浏览器里触发这个请求，打开 Network 面板，读实际的响应 body，看返回了哪些数据。然后检查该路由对应的后端代码，确认逻辑与之相符。

</details>

## 延伸阅读

- 文章：[Inspect network activity](https://developer.chrome.com/docs/devtools/network)（Chrome DevTools 官方文档，查看网络活动）。
- 视频：[Chrome DevTools 101, Network](https://www.youtube.com/watch?v=e1gAyQuIFQo)（YouTube，Network 面板入门）。
- 文章：[Chrome DevTools Network Tab guide](https://guides.codepath.org/webdev/Chrome-DevTools-Network-Tab)（CodePath，Network 面板使用指南）。

## 相关页面

- [IP 地址与端口](./02-dns-ip-ports.md)
- [HTTPS、域名与证书](../05-containers-deployment/07-domains-and-certificates.md)
- [HTTP 请求与响应](./04-http-request-response.md)
- [状态码](./06-status-codes.md)
- [日志与堆栈跟踪](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)
