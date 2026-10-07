---
title: HTTP 方法
row: M1-L2.2
---
**一句话：** HTTP 方法是请求里的动词，告诉服务器客户端想执行哪种动作；选对方法，其他程序才能对这个请求会做什么做出安全的假设。

## 是什么

每个 HTTP 请求都会指明一个方法，最常用的是 `GET`、`POST`、`PUT`、`PATCH` 和 `DELETE`。方法不只是一个标签，它是对意图的承诺。`GET` 表示“给我数据，什么都别改”。`POST` 表示“新建一个东西，或者提交数据去处理”。`PUT` 表示“整个替换这个资源”。`PATCH` 表示“更新这个资源的一部分”。`DELETE` 表示“删除这个资源”。

因为方法表达了意图，围绕 HTTP 构建的工具不用读 body 就能做出安全的假设。浏览器和缓存会随意预取或重试 `GET` 请求，因为设计良好的 API 保证它们不会产生副作用。协议本身并不强制这一点，它只是约定；一个在 `GET` 上修改数据的 API，会打破所有浏览器和缓存都依赖的这个假设。

`GET` 和 `DELETE` 请求几乎从不带 body，它们操作的对象通常由 URL 本身指定，例如 `/customers/42`。`POST`、`PUT` 和 `PATCH` 通常带 body，最常见的是 JSON。一条好用的规则：查询参数描述你想拿回什么，body 描述你要发送什么。

## FDE 为什么需要

几乎每个客户集成项目都要调用别人的 API，或者对外提供你自己的 API；请求行为异常时，第一件要查的就是方法。客户本想用 `PATCH` 却发了 `PUT`，结果把不打算动的字段清空了。

## 核心概念

### 五个核心方法

| 方法 | 用途 | 典型 body |
|---|---|---|
| GET | 读取资源，没有副作用 | 无 |
| POST | 创建新资源，或提交数据 | JSON |
| PUT | 整个替换资源 | JSON |
| PATCH | 更新资源的一部分 | JSON |
| DELETE | 删除资源 | 无 |

### PUT 与 PATCH

发送 `PUT /customers/42`，body 里只有一个 name 字段，在严格的实现下会替换整条记录，没带上的字段都会被清空。用同样的 body 发送 `PATCH /customers/42`，则只修改 name，其他字段保持不变。

### 查询参数与请求 body

查询参数放在 URL 的 `?` 后面，主要配合 `GET` 使用，例如 `?city=Lahore&count=1`。查询字符串会出现在日志和浏览器历史记录里，所以敏感数据应该放在 body 中，绝不能放进查询字符串。

## 常见误区

- **“只要 API 这么设计，GET 请求也可以修改数据。”** 按照约定，`GET` 永远不应该有副作用。浏览器和缓存会默认 `GET` 请求是安全的并预取它们，所以在 `GET` 上修改数据的 API，会在技术栈的其他地方引发真实的 bug。
- **“PUT 和 PATCH 可以互换。”** `PUT` 替换整个资源，`PATCH` 只修改你发送的字段。用错了，可能会把你不想动的字段清空。
- **“POST 一定意味着‘存进数据库’。”** `POST` 的意思是“提交数据给服务器处理”。服务器拿这些数据做什么，由后端逻辑决定，而不是由方法本身决定。

## 典型面试题

<details>
<summary>PUT 和 PATCH 有什么区别？</summary>

PUT 用你发送的内容替换整个资源，所以你没带上的字段可能会被清空。PATCH 只更新请求 body 里包含的字段，其他内容保持不变。

</details>

<details>
<summary>什么时候把数据放在查询字符串里，什么时候放在请求 body 里？</summary>

查询参数用于筛选或调整 GET 请求的结果，比如页码或搜索词。body 则承载 POST、PUT 或 PATCH 要提交的实际数据。

</details>

<details>
<summary>为什么 API 要用不同的 HTTP 方法，而不是只用一个通用端点？</summary>

方法本身就表达了意图，服务器、浏览器和缓存因此可以做出安全的假设，比如 GET 请求不修改数据，所以可以随意重试或缓存。

</details>

## 延伸阅读

- 文章：[Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)（MDN，HTTP 概述，约 30 分钟）。
- 文章：[APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/)（freeCodeCamp，API 入门，约 2.5 小时，挑需要的章节看即可）。

## 相关页面

- [HTTP 请求与响应](./04-http-request-response.md)
- [状态码](./06-status-codes.md)
- [JSON](./07-json.md)
- [REST 设计约定](../03-apis-data-integration/01-rest-conventions.md)
- [幂等性](../06-reliability-scale/05-idempotency.md)
