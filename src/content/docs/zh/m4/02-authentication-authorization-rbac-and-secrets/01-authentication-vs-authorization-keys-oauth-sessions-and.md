---
title: "认证与授权：key、OAuth、会话与 token"
row: M4-L2.1
---
**一句话：** 认证（authentication，简称 authn）证明调用方是*谁*，授权（authorization，简称 authz）决定调用方*能做什么*；常见的机制，即 API key、OAuth token、会话和 JWT，则是系统在每个请求中携带这种身份和权限的具体方式。

## 是什么

**认证**（authn）是登录这一步：用密码、key 或 token 确立身份。**授权**（authz）是随后进行的权限检查：这个身份能不能读取这条记录、调用这个端点？一个请求可以通过认证，却没有获得授权。底层的凭证机制，包括 API key、OAuth 2.0 access token、OpenID Connect ID token、会话和 JWT，在模块一中已有讲解（[API 认证](../../m1/03-apis-data-integration/02-auth.md)）；本页讲的是叠在它们之上的授权层。

注意 HTTP 状态码的含义：**401** 表示未通过认证；**403** 表示已通过认证，但没有获得授权。

## FDE 为什么需要

几乎每个集成都要以某种方式做认证，而大多数访问方面的 bug 其实是授权 bug（系统知道调用方是谁，但对方能看到的东西太多或太少）。了解这些机制，你就能选对方案，快速排查 401 与 403，并避开几个经典错误：权限过大的 API key、过期的 token，或者把“已登录”当成“已允许”。

## 核心概念

| 概念 | 回答的问题 / 作用 |
| --- | --- |
| 认证 | 你是谁？（失败时返回 401） |
| 授权 | 你能做什么？（失败时返回 403） |
| API key | 简单的调用方身份；要限定 scope（权限范围），并定期轮换 |
| OAuth token | 带 scope、会过期的委托访问；用 refresh token 续期 |
| OIDC ID token | 证明用户身份，用于登录 |
| 会话 / JWT | 在多个请求之间携带身份（服务端状态与签名 token） |

## 常见误区

- **“登录了就等于被允许。”** 认证不等于授权，每个操作仍然需要针对资源做一次权限检查。
- **“401 和 403 是一回事。”** 401 是“你是谁”，403 是“知道你是谁，但不允许”。
- **“access token 永远有效。”** 它们几分钟或几小时就会过期，要靠 refresh token 续期。

## 典型面试题

<details>
<summary>认证和授权有什么区别？各自对应哪个 HTTP 状态码？</summary>

认证证明身份（失败时返回 401，“未认证”）；授权决定该身份能对某个资源做什么（失败时返回 403，“已认证但不被允许”）。先认证，再授权；授权要在服务端针对每个操作、每个资源逐一检查。

</details>

<details>
<summary>什么时候用 API key，什么时候用 OAuth token？</summary>

API key 是简单的调用方凭证，适合用来访问你自己掌控的服务或简单的 API，属于机器对机器的访问，但粒度粗。OAuth 用于在不拿到用户密码的前提下代表用户访问，token 带 scope、会过期；当你要代表某个用户去访问他在另一个系统里的数据时，就用它。

</details>

## 延伸阅读

- 文章：[Authorization vs Authentication](https://www.oauth.com/oauth2-servers/openid-connect/authorization-vs-authentication/)（oauth.com）
- 文章：[OAuth 2 Simplified](https://aaronparecki.com/oauth-2-simplified/)（Aaron Parecki；用通俗的语言讲解角色、token 和流程）
- 视频：[OAuth 2.0 & OpenID Connect in plain English](https://www.youtube.com/watch?v=996OiexHze0)（Nate Barbettini，Okta；前 30 分钟）

## 相关页面

- [模块一 → API 认证](../../m1/03-apis-data-integration/02-auth.md)（凭证机制）
- [RBAC、最小权限与读写权限](./02-rbac-least-privilege-and-read-write-permissions.md)
- [企业 SSO 与服务账号](./05-enterprise-sso-saml-oidc-and-service-accounts.md)
