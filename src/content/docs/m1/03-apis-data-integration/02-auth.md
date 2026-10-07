---
title: API Authentication
row: M1-L3.1
---
**In one sentence:** Authentication is how an API proves who (or what) is calling it, usually through a secret value sent with every request, and authorization is the separate question of what that identity is allowed to do.

## What it is

Authentication ("authn") answers "who is this?" Authorization ("authz") answers "is this identity allowed to do this specific thing?" A request can be authenticated and still rejected, for example an employee account trying to delete another department's records.

Most APIs use an API key, a bearer token, or an OAuth flow. All three attach a secret credential the server checks before doing any work.

Some public, low-risk APIs need no key at all:

```
curl "https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY"
```

Most business APIs are not this open, because customer records and billing data must be restricted.

## Why an FDE needs this

Client integrations almost always require credentials, and wrong authentication is a common reason a demo works on a laptop and fails once deployed. An FDE needs to know where a key belongs (a header, not the URL) and how to tell an authentication failure from other failures. Committing a key to a public repository is a real security incident, covered on the Secrets Management page.

## Key concepts

### API keys

An API key is a single secret string issued to your application, usually sent as a header:

```
curl -H "X-API-Key: your-key-here" "https://api.example.com/data"
```

Keys are common for server-to-server calls with no human user, such as a billing provider. A leaked key usually grants full access until revoked, so keys never belong in client-side code (anyone can inspect a browser) or in a repository.

### Bearer tokens

A bearer token is a credential sent in the `Authorization` header, most often as `Authorization: Bearer <token>`. "Bearer" means whoever holds the token can use it, so it must travel over HTTPS and be stored carefully. Tokens are often short-lived and tied to a user, unlike a long-lived API key tied to an application.

```
curl -H "Authorization: Bearer eyJhbGciOi..." "https://api.example.com/orders"
```

### OAuth, at a high level

OAuth lets a user grant one application limited access to their data on another service without sharing their password, for example an app asking to read your Google calendar:

```
User -> Client app: "log in"
Client app -> Auth server: redirect user to approve access
User -> Auth server: approves ("yes, this app can read my calendar")
Auth server -> Client app: sends back a short-lived authorization code
Client app -> Auth server: exchanges the code for an access token
Client app -> API: uses the token to make requests
```

The client app never sees the user's password. It swaps the code server-side for a token scoped to whatever the user approved. Access tokens expire and are renewed with a longer-lived refresh token, so a stolen access token is useful only briefly.

### Scopes

A scope is a specific permission attached to a token, such as "read calendar." A well-designed integration requests the narrowest scope that does the job, the same least-privilege idea that applies to API keys.

### Sessions: cookies and tokens

HTTP is stateless: the server remembers nothing between requests, so a logged-in user must attach proof of identity to every request. A **session cookie** holds a random ID the server creates at login; the server keeps the session data in its own store, and the browser stores the cookie and sends it back automatically (`Set-Cookie`, then `Cookie` headers). A **token**, often a JWT (JSON Web Token), is signed data containing the user's identity; the client stores it (in memory or browser storage) and attaches it to the `Authorization` header itself, and the server verifies the signature with no lookup.

Logging out deletes a server-side session, so its cookie stops working at once. A JWT was never stored, so it keeps working until it expires unless the server keeps a blocklist. Because cookies are sent automatically, they are exposed to CSRF (Cross-Site Request Forgery), where another site triggers a request from the user's browser; tokens readable by JavaScript are exposed to XSS (Cross-Site Scripting), where injected script steals them.

### Authentication vs authorization

| Question | Concept | Example failure |
|---|---|---|
| Who is calling? | Authentication (authn) | Invalid or missing API key, 401 response |
| What are they allowed to do? | Authorization (authz) | Valid key, but no permission for this resource, 403 response |

## Common misconceptions

- **"An API key and a password are basically the same thing."** A password identifies a human. An API key identifies an application and should be generated, stored in a secret manager, and rotated.
- **"If a request is authenticated, it is automatically authorized."** These are separate checks. A valid token proves identity; the server still decides whether that identity may perform the action.
- **"Putting the API key in the URL is fine over HTTPS."** URLs get logged by servers, proxies, and browser history even over HTTPS. Keys belong in headers, not the query string.
- **"A token is always safer than a cookie."** Cookies are exposed to CSRF, tokens readable by JavaScript to XSS. Neither is safe by default.

## Typical interview questions

<details>
<summary>What is the difference between authentication and authorization?</summary>

Authentication confirms who is making the request. Authorization decides what that identity may do. Failing the first typically returns 401; failing the second returns 403.

</details>

<details>
<summary>Where should an API key live in a request, and why?</summary>

In a request header, not in the URL's query string. Query strings end up in server logs, browser history, and proxy caches.

</details>

<details>
<summary>In plain terms, what problem does OAuth solve?</summary>

It lets a user grant an application limited access to their data on another service without sharing their password. The user approves a scope, and the application receives a token instead.

</details>

<details>
<summary>What is the difference between a session cookie and a JWT?</summary>

A session cookie holds a random ID the browser sends automatically, which the server looks up in its session store. A JWT is a signed, self-contained token the client attaches itself, which the server verifies without a lookup.

</details>

<details>
<summary>A teammate wants to hardcode an API key directly in the source file so the demo works faster. What do you say?</summary>

Do not, even temporarily. A key committed to git history is hard to remove and readable by anyone with repo access. An environment variable takes the same effort.

</details>

## Learn more

- Article: [APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/) (freeCodeCamp, about 2.5 hours, pick the sections you need)
- Article: [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (OWASP, about 30 min)

## Related

- [REST Conventions](./01-rest-conventions.md)
- [Integration Failure Diagnosis](./07-diagnosing-integration-failures.md)
- [Secrets Management](../04-git-debugging-testing-security/09-secrets-management.md)
- [HTTP Requests and Responses](../02-how-web-apps-run/04-http-request-response.md)
- Goes deeper in Module 4: [Authentication vs Authorization: Keys, OAuth, Sessions & Tokens](../../m4/02-authentication-authorization-rbac-and-secrets/01-authentication-vs-authorization-keys-oauth-sessions-and.md)
