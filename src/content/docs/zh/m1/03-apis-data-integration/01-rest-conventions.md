---
title: REST 设计约定
row: M1-L3.1
---
**一句话：** REST 是一种 API 设计风格：每一份数据都是一个有自己 URL 的“资源”，你通过标准的 HTTP 方法、header 和查询参数来操作它。

## 是什么

REST 是 Representational State Transfer（表述性状态转移）的缩写，是一套设计 API 的约定。一个客户、一个订单、一份天气预报，都是有自己 URL 的“资源”，你用标准的 HTTP 方法来操作它。只要你在浏览器里打开过一个网址，你就已经发过 REST 风格的请求：浏览器发出一个 GET 请求，服务器返回一个页面。

API（Application Programming Interface，应用程序编程接口）是一个软件请求另一个软件做事的方式，不需要人去点按钮。REST API 就是把这个思路建立在 HTTP 之上：返回的不是 HTML 页面，而是供程序读取的数据，几乎总是 JSON。

以 Open-Meteo 为例，这是一个免费的天气服务，不用注册：

```
curl "https://api.open-meteo.com/v1/forecast?latitude=31.5&longitude=74.3&current_weather=true"
```

URL 就是资源，即某个地点的天气预报。方法是 GET，意思是“把数据给我，什么都别改”。响应是程序可以解析的 JSON。HTTP 方法本身在 HTTP 方法那一页讲；这一页讲的是建立在方法之上的约定。

## FDE 为什么需要

几乎每个客户集成都要调用别人的 API，或者暴露一个自己的 API。客户会说“直接从我们的 CRM 里拉数据就行”，而这件事就是通过 REST API 完成的。不理解资源命名、header 和请求的结构，你就没法快速看懂 API 文档。

## 核心概念

### 资源与 URL

REST API 把数据组织成资源，每个资源对应一个 URL 模式，通常是复数名词。`/customers` 列出所有客户，`/customers/42` 指向其中一个。`GET /customers/42` 读取它，`PATCH /customers/42` 更新它的一部分，`DELETE /customers/42` 删除它。嵌套资源表示归属关系：`/customers/42/orders` 的意思是“属于客户 42 的订单”。URL 读起来应该像通往某个东西的路径，而不是一次函数调用；当某个动作没法对应到资源上时，`/customers/42/cancel` 这种写法是务实的例外。

### Header

header 是随请求一起发送的元数据：

- `Content-Type: application/json` 告诉服务器请求体是 JSON。
- `Authorization: Bearer <token>` 证明调用者是谁，在 API 认证那一页讲。
- `Accept: application/json` 告诉服务器希望用什么格式回复。

### 查询参数与请求体

查询参数决定返回什么；请求体承载你要发送的内容。完整规则见 [HTTP 方法](../02-how-web-apps-run/05-http-methods.md)。

### 过滤、排序与分页

设计良好的 REST API 用查询参数完成常见操作：`?status=active` 用来过滤，`?sort=-created_at` 用来排序。列表很少一次返回全部数据。分页把结果拆成多页，比如 `?page=2&limit=50`，或者用游标 `?after=abc123`。忽略分页是常见 bug：客户抱怨“少了记录”，很多时候只是把第 1 页当成了完整列表。

### 各方法的幂等性

幂等请求发一次和发十次，效果相同。按约定，GET、PUT 和 DELETE 是幂等的；POST 不是，同一个“创建订单”请求发两次，通常会创建两个订单。重试失败的 PUT 是安全的；重试失败的 POST 可能产生重复数据。

### 版本管理（简述）

API 会随时间变化。常见约定是在 URL 里带版本号，`/v1/customers` 和 `/v2/customers`，这样破坏性变更不会悄悄影响所有调用方。完整内容在 Schema 与数据契约那一页。

## 常见误区

- **“REST API 必须返回 JSON。”** REST 并没有要求 JSON。有的 API 返回 XML 或纯文本。JSON 只是常见约定，因为它易读、易解析。
- **“只要 URL 能返回数据，就算 RESTful。”** REST 约定包括可预测的资源命名、正确使用方法和标准状态码。一个所有操作（包括读取）都用 POST 的 API 技术上能用，但它无视了那些让 API 易于猜测和复用的约定。
- **“不需要 key 的 API 不够安全，不能用。”** 很多生产环境的 API（包括 Open-Meteo）都是公开、免 key 的，因为数据并不敏感。访问控制取决于数据是什么，而不是有没有 key。

## 典型面试题

<details>
<summary>除了通过 HTTP 返回 JSON，一个 API 还要满足什么才算 RESTful？</summary>

基于资源、可预测的 URL，正确使用 HTTP 方法，标准状态码，以及无状态的请求（每个请求自带所需的一切）。一个完全不管这些、只是返回 JSON 的 API，并没有真正遵循 REST 约定。

</details>

<details>
<summary>客户的 API 返回一份很长的记录列表，但你的应用只显示了 50 条。你先查什么？</summary>

先查 API 是否分页。看文档里有没有 page、limit、offset 或游标参数，再看响应里有没有“下一页”链接或总数。

</details>

<details>
<summary>为什么一个请求是否幂等很重要？</summary>

它决定了重试失败的请求是否安全。超时后重试幂等请求（GET、PUT、DELETE）是安全的，因为重复执行不会改变结果。重试非幂等的 POST 可能产生重复数据，所以需要额外处理，比如使用幂等键。

</details>

<details>
<summary>为什么很多 API 要在 URL 里带 /v1/ 这样的版本号？</summary>

这样破坏性变更可以作为 /v2/ 发布，现有调用方继续不受影响地使用 /v1/，而不是所有集成同时崩掉。

</details>

## 延伸阅读

- 文章：[APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/)（freeCodeCamp，约 2.5 小时，挑需要的章节看）
- 文章：[How to Use a REST API](https://uibakery.io/blog/how-to-use-a-rest-api)（UI Bakery，约 20 分钟）
- 文章：[REST API Testing Guide for Beginners](https://dev.to/_d7eb1c1703182e3ce1782/rest-api-testing-guide-for-beginners-ke4)（DEV，选读）

## 相关页面

- [HTTP 方法](../02-how-web-apps-run/05-http-methods.md)
- [API 认证](./02-auth.md)
- [集成故障诊断](./07-diagnosing-integration-failures.md)
- [Schema 与数据契约](./10-schema-and-data-contracts.md)
