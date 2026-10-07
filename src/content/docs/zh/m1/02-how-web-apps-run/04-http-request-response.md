---
title: HTTP 请求与响应
row: M1-L2.2
---
**一句话：** HTTP 是客户端和服务器约定好的格式，用来交换一个请求和一个响应；两者都是纯文本结构，包含几个必需的部分。

## 是什么

HTTP（超文本传输协议）是浏览器、后端和外部服务在互联网上相互通信的语言。浏览器每加载一个页面，后端每调用一次天气 API，都会发出一个 HTTP 请求，并收到一个 HTTP 响应。在 HTTP/1.1 中，请求和响应都是纯文本（HTTP/2 和 HTTP/3 用二进制编码承载同样的部分），结构也一样：一行起始行、一组请求头或响应头、一个空行，以及可选的消息体（body）。

请求说明客户端想要什么：用哪个方法（要执行的动作，有单独一页讲），哪个 URL（要访问的资源），哪些头（元数据），有时还有一个 body（要发送的数据）。响应说明发生了什么：一个状态码（三位数的结果摘要，也有单独一页讲）、一组头，通常还有一个 body，装着数据或错误信息。双方都不需要知道对方是怎么实现的。

HTTP 是请求-响应式协议。总是客户端先开口，服务器从不主动发送任何东西。每个请求和响应都是独立的：服务器不会自动记住你的上一个请求，除非应用显式地存了点东西（比如 cookie）把两者衔接起来（详见“无状态 HTTP”一页）。

## FDE 为什么需要

前端和后端之间出问题时，最快的排查办法是去看实际的 HTTP 请求和响应，而不是根据屏幕上的错误提示去猜。如果客户说“表单保存不了”，就打开 Network 面板，找到表单发出的那个请求，看它的方法、body，以及服务器返回的确切状态码和 body。光这一步通常就能判断 bug 出在前端、后端，还是请求根本没离开浏览器。

## 核心概念

### 请求的组成部分

| 部分 | 含义 | 示例 |
|---|---|---|
| 方法 | 请求要执行的动作 | `GET`、`POST`、`PUT`、`DELETE` |
| URL / 路径 | 请求的资源 | `/weather?city=Lahore` |
| 请求头 | 关于请求的元数据 | `Content-Type: application/json` |
| Body | 随请求发送的数据（可选） | `{"city": "Lahore"}` |

### 响应的组成部分

| 部分 | 含义 | 示例 |
|---|---|---|
| 状态码 | 三位数的结果摘要 | `200`、`404`、`500` |
| 响应头 | 关于响应的元数据 | `Content-Type: application/json` |
| Body | 实际的数据或错误信息 | `{"temp_c": 21.4}` |

### 原始的 HTTP 请求和响应

浏览器向 API 请求天气数据时，网络上实际传输的就是下面这些内容。

请求：

```
GET /weather?city=Lahore HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0

```

响应：

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 53

{"city": "Lahore", "temp_c": 32.1, "currency": "PKR"}
```

头和 body 之间的空行是必需的。接收方正是靠它判断头已经结束、body 开始了。

### 值得认得的头

| 头 | 含义 |
|---|---|
| `Content-Type` | body 的格式，例如 `application/json` |
| `Authorization` | 凭证，比如 API key 或 token |
| `Accept` | 客户端愿意接收哪些格式 |
| `Cookie` / `Set-Cookie` | 服务器让浏览器存下并在之后回传的少量状态 |

### 方法简介

方法是起始行的一部分，用来表达意图：`GET` 读取数据，`POST` 创建或提交数据，`PUT` 和 `PATCH` 更新，`DELETE` 删除。完整的方法列表及用法单独有一页讲。

## 常见误区

- **“GET 请求不能发送任何数据。”** GET 请求可以在 URL 里以查询字符串的形式带数据，例如 `?city=Lahore`。只是它不应该带 body，也不应该修改服务器上的数据。
- **“状态码和 body 总是一致的。”** 通常一致，但写得不好的服务器可能返回 `200 OK`，body 里却是错误信息。两个都看，比只看其中一个更稳妥。
- **“HTTP 离不开浏览器。”** HTTP 是基于文本的协议，任何程序都能用它通信，包括 `curl`，或者一个后端调用另一个后端。

## 典型面试题

<details>
<summary>HTTP 请求主要由哪几部分组成？</summary>

一个方法、一个标识资源的 URL、一组提供元数据的请求头，以及可选的承载数据的 body。消息以一行包含方法和 URL 的起始行开头，接着是请求头、一个空行，有 body 的话再跟上 body。

</details>

<details>
<summary>HTTP 响应主要由哪几部分组成？</summary>

一个概括结果的状态码、一组响应头，通常还有一个 body，装着实际数据或错误信息。结构和请求对称：起始行、头、空行，然后是 body。

</details>

<details>
<summary>前端开发说“我发了请求，但什么都没收到”。你会怎么确认实际发生了什么？</summary>

打开浏览器的 Network 面板，找到这个请求，看它到底有没有发出去、返回了什么状态码、响应 body 里是什么。这样就能区分是请求根本没离开浏览器，还是服务器返回了错误。

</details>

<details>
<summary>Content-Type 头有什么用？如果它写错了会怎样？</summary>

它告诉接收方 body 是什么格式，比如 `application/json`。如果写错了，即使数据本身没问题，接收方的程序也可能解析失败。

</details>

<details>
<summary>为什么 Python 后端和 JavaScript 前端互相不了解对方的实现，也能通信？</summary>

它们在请求和响应的结构上约定了同一种格式，也就是 HTTP，body 通常再约定用 JSON。双方都不需要了解对方的内部实现，只要会生成和解析这种共同格式即可。

</details>

## 延伸阅读

- 文章：[Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)（MDN，HTTP 概述，约 30 分钟）。
- 文章：[HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages)（MDN，HTTP 消息格式，约 20 分钟）。
- 文章：[The HTTP request and response cycle](https://backend.turing.edu/module2/lessons/how_the_web_works_http)（Turing School，HTTP 请求-响应周期，约 30 分钟）。

## 相关页面

- [HTTP 方法](./05-http-methods.md)
- [状态码](./06-status-codes.md)
- [JSON](./07-json.md)
- [API 认证](../03-apis-data-integration/02-auth.md)
