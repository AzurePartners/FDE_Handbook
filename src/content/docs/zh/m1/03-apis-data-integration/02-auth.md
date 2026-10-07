---
title: API 认证
row: M1-L3.1
---
**一句话：** 认证是 API 确认“谁（或什么程序）在调用它”的方式，通常靠每个请求都带上的一个密钥值；授权则是另一个问题：这个身份被允许做什么。

## 是什么

认证（authentication，简称 authn）回答“这是谁？”。授权（authorization，简称 authz）回答“这个身份能不能做这件具体的事？”。一个请求可以通过认证，但仍然被拒绝，比如某个员工账号试图删除另一个部门的记录。

大多数 API 使用 API key、Bearer token 或 OAuth 流程。三者都会附带一个秘密凭证，服务器在干活之前先检查它。

有些公开、低风险的 API 根本不需要 key：

```
curl "https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY"
```

大多数业务 API 没这么开放，因为客户记录和账单数据必须受到限制。

## FDE 为什么需要

客户集成几乎都需要凭证，而认证配错是“演示在笔记本上能跑、部署后就挂”的常见原因。FDE 需要知道 key 应该放在哪里（header 里，而不是 URL 里），也要能把认证失败和其他失败区分开。把 key 提交到公开仓库是真正的安全事故，这部分在密钥管理那一页讲。

## 核心概念

### API key

API key 是发给你的应用的一个秘密字符串，通常放在 header 里发送：

```
curl -H "X-API-Key: your-key-here" "https://api.example.com/data"
```

key 常用于没有人类用户参与的服务器到服务器调用，比如对接计费服务商。key 一旦泄露，通常在吊销前都拥有完整权限，所以 key 绝不能放在客户端代码里（任何人都能在浏览器里查看），也不能放进仓库。

### Bearer token

Bearer token 是放在 `Authorization` header 里发送的凭证，最常见的写法是 `Authorization: Bearer <token>`。“Bearer”（持有者）的意思是谁拿着这个 token 谁就能用，所以它必须通过 HTTPS 传输，并且要小心保存。token 通常有效期短、绑定到某个用户；API key 则通常长期有效、绑定到某个应用。

```
curl -H "Authorization: Bearer eyJhbGciOi..." "https://api.example.com/orders"
```

### OAuth 概览

OAuth 让用户在不交出密码的前提下，授权一个应用有限地访问自己在另一个服务上的数据，比如某个应用请求读取你的 Google 日历：

```
User -> Client app: "log in"
Client app -> Auth server: redirect user to approve access
User -> Auth server: approves ("yes, this app can read my calendar")
Auth server -> Client app: sends back a short-lived authorization code
Client app -> Auth server: exchanges the code for an access token
Client app -> API: uses the token to make requests
```

客户端应用始终看不到用户的密码。它在服务器端用授权码换取一个 token，这个 token 的权限范围就是用户批准的范围。access token 会过期，并通过有效期更长的 refresh token 续期，所以即使 access token 被盗，也只在很短时间内有用。

### Scope（权限范围）

scope 是附加在 token 上的具体权限，比如“读取日历”。设计良好的集成只申请完成任务所需的最小 scope，这和 API key 适用的最小权限原则是同一个思路。

### 会话：cookie 与 token

HTTP 是无状态的：服务器在两次请求之间什么都不记得，所以已登录的用户必须在每个请求里附上身份证明。**会话 cookie** 保存的是服务器在登录时生成的一个随机 ID；会话数据存在服务器自己的存储里，浏览器保存 cookie 并自动带回去（先是 `Set-Cookie`，之后是 `Cookie` header）。**token** 常见的是 JWT（JSON Web Token），它是包含用户身份的签名数据；客户端自己保存它（在内存或浏览器存储里），并自己把它放进 `Authorization` header，服务器验证签名即可，不用查任何存储。

退出登录会删除服务器端的会话，对应的 cookie 立刻失效。JWT 从来没有被存起来，所以除非服务器维护一个黑名单，它会一直有效直到过期。因为 cookie 会被自动发送，它面临 CSRF（Cross-Site Request Forgery，跨站请求伪造）风险，即另一个网站借用户的浏览器发起请求；而 JavaScript 能读取的 token 面临 XSS（Cross-Site Scripting，跨站脚本）风险，即注入的脚本把它偷走。

### 认证与授权

| 问题 | 概念 | 失败示例 |
|---|---|---|
| 谁在调用？ | 认证（authn） | API key 无效或缺失，返回 401 |
| 允许它做什么？ | 授权（authz） | key 有效，但没有访问该资源的权限，返回 403 |

## 常见误区

- **“API key 和密码基本是一回事。”** 密码识别的是人。API key 识别的是应用，应该由系统生成、存放在密钥管理器里，并定期轮换。
- **“请求通过了认证，就自动获得了授权。”** 这是两次独立的检查。有效的 token 只证明身份；服务器仍要决定这个身份能否执行该操作。
- **“走 HTTPS 的话，把 API key 放在 URL 里没问题。”** 即使走 HTTPS，URL 也会被服务器、代理和浏览器历史记录下来。key 应该放在 header 里，而不是查询字符串里。
- **“token 总是比 cookie 安全。”** cookie 面临 CSRF 风险，JavaScript 能读取的 token 面临 XSS 风险。两者默认都不安全。

## 典型面试题

<details>
<summary>认证和授权有什么区别？</summary>

认证确认是谁在发请求。授权决定这个身份能做什么。认证失败通常返回 401；授权失败返回 403。

</details>

<details>
<summary>API key 应该放在请求的哪里？为什么？</summary>

放在请求 header 里，而不是 URL 的查询字符串里。查询字符串会出现在服务器日志、浏览器历史和代理缓存中。

</details>

<details>
<summary>用大白话说，OAuth 解决了什么问题？</summary>

它让用户在不交出密码的前提下，授权一个应用有限地访问自己在另一个服务上的数据。用户批准一个 scope，应用拿到的是 token，而不是密码。

</details>

<details>
<summary>会话 cookie 和 JWT 有什么区别？</summary>

会话 cookie 保存一个随机 ID，由浏览器自动发送，服务器到自己的会话存储里查找它。JWT 是一个签名的、自包含的 token，由客户端自己附加到请求上，服务器不用查找就能验证。

</details>

<details>
<summary>队友想把 API key 直接硬编码在源文件里，好让演示快点跑起来。你怎么说？</summary>

别这么做，临时也不行。key 一旦提交进 git 历史就很难清除，任何能访问仓库的人都能看到。用环境变量花的工夫是一样的。

</details>

## 延伸阅读

- 文章：[APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/)（freeCodeCamp，约 2.5 小时，挑需要的章节看）
- 文章：[Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)（OWASP 密钥管理速查表，约 30 分钟）

## 相关页面

- [REST 设计约定](./01-rest-conventions.md)
- [集成故障诊断](./07-diagnosing-integration-failures.md)
- [密钥管理](../04-git-debugging-testing-security/09-secrets-management.md)
- [HTTP 请求与响应](../02-how-web-apps-run/04-http-request-response.md)
- 模块 4 深入讲解：[认证与授权：Key、OAuth、会话与 Token](../../m4/02-authentication-authorization-rbac-and-secrets/01-authentication-vs-authorization-keys-oauth-sessions-and.md)
