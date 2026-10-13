---
title: 企业 SSO（SAML/OIDC）与服务账号
row: M4-L2.5
---
**一句话：** 企业 SSO 让员工通过公司的身份提供方（IdP），使用 SAML 或 OIDC 完成认证；服务账号（service account）则是供机器使用的机器身份，FDE 的集成几乎总是用服务账号来认证，而不是用某个人的身份。

## 是什么

**SSO** 把登录集中交给**身份提供方（IdP）**，比如 Okta 或 Microsoft Entra ID；各个应用信任 IdP 来认证用户。**SAML**（较老，基于 XML）和 **OIDC**（较新，基于 JSON/JWT，建立在 OAuth 之上）是实现这一点的两种协议；客户的 IdP 用哪一种，你就对接哪一种。另外，**服务账号**是一种机器身份，拥有自己的凭证和限定范围的权限，供后端服务、作业和集成使用。关键的区别在于：当*你的集成*在没有用户在场的情况下调用某个系统时，它会用服务账号（机器身份）来认证，而不是冒充某个人。

## FDE 为什么需要

客户要求面向员工的应用使用他们自己的 SSO，而不是另设一套密码，所以你要与客户的 IdP 配置 SAML/OIDC 信任关系（交换元数据、映射属性和组、测试重定向）。你的后端集成还需要按最小权限配置的服务账号，创建和保护的方式与其他凭证一样。把这两件事做对，往往是企业部署能否获得批准的硬性前提。

## 核心概念

- **IdP：** 集中的认证方（Okta、Entra ID）；各个应用信任它。
- **SAML 与 OIDC：** 两种 SSO 协议；客户的 IdP 用哪种，就支持哪种。
- **属性与组映射：** 传递邮箱和所属的组，让应用能据此授权。
- **服务账号：** 供集成和作业使用的机器身份；权限受限，凭证存放在密钥存储里，并轮换。
- **集成以服务的身份认证，而不是以人的身份：** 别把某个人的登录用在自动化上。
- **SCIM（相关）：** 账号的开通与停用，和登录是两件事。

## 常见误区

- **“SSO 就是共用一个密码。”** 用户在 IdP 上完成认证，应用从头到尾看不到密码。
- **“自动化可以用我的登录。”** 集成应该使用服务账号，这样访问权限有范围限制、可审计，而且这个人离职后也不受影响。
- **“SAML 和 OIDC 可以互相直接替换。”** 目标相同，但协议和配置不同；IdP 支持哪种，你就实现哪种。

## 典型面试题

<details>
<summary>为什么 FDE 的集成通常用服务账号而不是个人身份来认证？</summary>

因为集成是无人值守运行的，不应该依赖某个人的凭证：个人凭证的权限更宽，绑定在那个人身上，人一离职就会消失。服务账号让集成拥有自己的身份：范围受限、遵循最小权限、可审计，还能独立轮换和治理。

</details>

<details>
<summary>把一个应用接入客户的 SSO，需要做哪些事？</summary>

使用 SAML 或 OIDC（客户用哪种就用哪种）与对方的身份提供方建立信任关系：交换元数据，配置重定向和回调，并映射邮箱、组成员关系等属性，让应用既能认证用户，又能按组对用户授权。最后端到端地测试登录。

</details>

## 延伸阅读

- 视频：[OAuth 2.0 & OpenID Connect in plain English](https://www.youtube.com/watch?v=996OiexHze0)（Nate Barbettini，Okta；其中讲 OIDC 的那一半适用于这里）
- 文章：[Authorization vs Authentication](https://www.oauth.com/oauth2-servers/openid-connect/authorization-vs-authentication/)（oauth.com；服务身份与用户身份的对比）

## 相关页面

- [认证与授权](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [密钥管理与轮换](./03-secret-management-environment-variables-and-rotation.md)
