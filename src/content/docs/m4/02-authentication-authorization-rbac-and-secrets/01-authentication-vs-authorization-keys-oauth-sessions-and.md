---
title: "Authentication vs Authorization: Keys, OAuth, Sessions & Tokens"
row: M4-L2.1
---
**In one sentence:** Authentication proves *who* a caller is; authorization decides *what* they may do; and the common mechanisms, API keys, OAuth tokens, sessions, and JWTs, are the concrete ways systems carry that identity and permission with each request.

## What it is

**Authentication (authn)** is the login step: a password, key, or token establishing identity. **Authorization (authz)** is the permission check that happens after: may this identity read this record, call this endpoint? A request can be authenticated but not authorized. The underlying credential mechanics, API keys, OAuth 2.0 access tokens, OpenID Connect ID tokens, sessions, and JWTs, are covered in Module 1 ([Auth: API Key, Bearer Token, OAuth](../../m1/03-apis-data-integration/02-auth.md)); this page is about the authz layer that sits on top of them.

Note the HTTP naming: **401** means not authenticated; **403** means authenticated but not authorized.

## Why an FDE needs this

Nearly every integration authenticates somehow, and most access bugs are really authz bugs (the caller is known but can see too much or too little). Knowing the mechanisms lets you pick the right one, debug 401 vs 403 quickly, and avoid the classic mistakes: over-broad API keys, expired tokens, or treating "logged in" as "allowed."

## Key concepts

| Concept | Question / role |
| --- | --- |
| Authentication | Who are you? (401 on failure) |
| Authorization | What may you do? (403 on failure) |
| API key | Simple caller identity; scope it, rotate it |
| OAuth token | Scoped, expiring delegated access; refresh tokens renew it |
| OIDC ID token | Proves user identity for login |
| Session / JWT | Carry identity across requests (server-state vs signed token) |

## Common misconceptions

- **"Logged in means allowed."** Authn is not authz; every action still needs a permission check on the resource.
- **"401 and 403 are the same."** 401 = who are you; 403 = known but not permitted.
- **"Access tokens last forever."** They expire in minutes/hours; refresh tokens renew them.

## Typical interview questions

<details>
<summary>Difference between authentication and authorization, and the matching HTTP codes?</summary>

Authentication proves identity (fails with 401, "not authenticated"); authorization decides what that identity may do on a resource (fails with 403, "authenticated but not permitted"). Authn happens first; authz is checked per action and per resource on the server.

</details>

<details>
<summary>When would you use an API key vs an OAuth token?</summary>

An API key is a simple caller credential, fine for machine-to-machine access to a service you control or a simple API, but coarse. OAuth is for delegated access on a user's behalf without their password, with scoped, expiring tokens, used when acting for a user against their data in another system.

</details>

## Learn more

- Article: [Authorization vs Authentication](https://www.oauth.com/oauth2-servers/openid-connect/authorization-vs-authentication/) (oauth.com)
- Article: [OAuth 2 Simplified](https://aaronparecki.com/oauth-2-simplified/) (Aaron Parecki; roles, tokens, flows in plain language)
- Video: [OAuth 2.0 & OpenID Connect in plain English](https://www.youtube.com/watch?v=996OiexHze0) (Nate Barbettini, Okta; first 30 min)

## Related

- [Module 1 → Auth: API Key, Bearer Token, OAuth](../../m1/03-apis-data-integration/02-auth.md) (credential mechanics)
- [RBAC, Least Privilege & Read/Write Permissions](./02-rbac-least-privilege-and-read-write-permissions.md)
- [Enterprise SSO & Service Accounts](./05-enterprise-sso-saml-oidc-and-service-accounts.md)
