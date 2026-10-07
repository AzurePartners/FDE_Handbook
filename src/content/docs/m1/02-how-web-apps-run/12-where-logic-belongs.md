---
title: Logic Placement
row: M1-L2.3
---
**In one sentence:** Each layer of a web app runs on a different machine controlled by a different party, and putting a security check or a secret in the wrong layer is a common way real apps get broken into.

## What it is

A web app is split into layers partly for trust. The browser and frontend run on the user's own device, so the user can see and change anything happening there. The backend runs on a server the company controls, which the user cannot inspect or tamper with. The database stores data that survives between requests.

This difference in who controls the machine is the whole reason for the rule "validation and secrets live on the server." A check written only in frontend JavaScript is a user convenience: a technical user can bypass it by sending a different request directly to the backend. The backend has no such problem, since the user never sees or runs its code.

The frontend's job is presentation and responsiveness. The backend's job is authority: deciding what is allowed, and holding secrets like API keys. The database's job is durable storage, plus its own protection through constraints like "this email must be unique."

## Why an FDE needs this

A large share of real security incidents come down to exactly this mistake: a check that only existed in the frontend, or a secret left where anyone could read it. If an AI-written feature puts a price calculation or an API key inside frontend JavaScript, that is a hole someone will find, not a style preference to fix later.

## Key concepts

### What belongs where

| Concern | Belongs in | Why |
|---|---|---|
| Layout, animations, instant field feedback | Frontend | About what the user sees, no network round trip needed |
| Real validation, like "this price cannot be negative" | Backend | The frontend's copy can be bypassed by the user |
| Permission checks, like "can this user delete this record" | Backend | Only the backend knows who is actually asking |
| API keys, database passwords | Backend, in environment variables | The browser can be inspected; the server cannot |
| Long-term storage, uniqueness rules | Database | Survives restarts, enforced even if backend code has a bug |

### A concrete example

Say a form sets a discount, and the rule is "discount cannot exceed 50%." A frontend-only check is easy to bypass, since anyone can send a request directly to the backend with `discount: 90`:

```python
# Backend check: cannot be bypassed by the client
if discount > 50:
    raise HTTPException(status_code=400, detail="Discount too high")
```

The frontend check is still worth keeping, for instant feedback, but it cannot be the only check.

## Common misconceptions

- **"If the frontend hides a button, the feature is protected."** A user can still send the underlying request directly to the backend, bypassing the button.
- **"Validating on the frontend is enough."** Frontend validation runs on a machine the user controls. It needs a matching check on the backend.
- **"An API key is fine in frontend code if it's obfuscated or minified."** Minifying makes it harder to read, not impossible. Any value sent to the browser can be extracted.

## Typical interview questions

<details>
<summary>Why should real input validation happen on the backend and not just the frontend?</summary>

Frontend code runs on the user's own device, where it can be read, modified, or bypassed. The backend runs on a server the user cannot access, making it the only layer that can enforce a rule the user cannot get around.

</details>

<details>
<summary>Where should an API key for a third-party service be stored, and why?</summary>

On the backend, in an environment variable, never in frontend code. Frontend code is delivered to and readable by anyone using the app, so a secret placed there is effectively public.

</details>

<details>
<summary>A client's app has a discount field that only checks its limit in the browser. What is the risk, and what would you tell them?</summary>

Anyone can bypass the browser check and send a request directly to the backend with an out-of-range value. Keep the frontend check for responsiveness, but add the same check on the backend, the only layer the user cannot circumvent.

</details>

## Learn more

- Article: [Server-side web frameworks](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Web_frameworks) (MDN, about 25 min).
- Article: [Client-Server overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview) (MDN, about 20 min).

## Related

- [Web App Layers](./10-frontend-backend-database-layers.md)
- [API Authentication](../03-apis-data-integration/02-auth.md)
- [Input Validation](../04-git-debugging-testing-security/10-input-validation.md)
