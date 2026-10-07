---
title: Integration Failure Diagnosis
row: M1-L3.3
---
**In one sentence:** When a call to an outside API fails, the status code and error message tell you which of four buckets the problem falls into: authentication, networking, data format, or business logic.

## What it is

An integration "fails" in many different ways, and the fix depends entirely on which kind. A missing API key, a slow network, a malformed request body, and a legitimate business rule, like "you cannot book a date in the past," all look similar from the outside: your app shows an error. They are not the same problem, and treating them the same wastes time.

The first signal to read is the HTTP status code. Codes in the 400s mean the client did something the server did not accept. Codes in the 500s mean the server had a problem, often not caused by anything your app did. A separate category, timeouts, means no response came back at all within the time you allowed.

A concrete example: calling Open-Meteo's geocoding search for a made-up city name:

```
curl "https://geocoding-api.open-meteo.com/v1/search?name=Notarealplacexyz&count=1"
```

This returns a 200 status with no `results` field at all, not an error. That is a business logic outcome, the city genuinely does not exist, not a technical failure, and it belongs in the app's own logic, not a broken-integration report.

## Why an FDE needs this

A client will say "the integration is broken" and expect a fast, correct diagnosis, not guesswork. Confusing an authentication failure with a networking failure sends you down the wrong path, for example rotating a perfectly good API key while the real problem is the client's firewall. Naming precisely which layer is at fault, quickly, is one of the clearest signals of competence in this role.

## Key concepts

### The four buckets

| Bucket | What it means | Typical signal |
|---|---|---|
| Authentication or authorization | Caller's identity or permissions are wrong | 401 or 403 |
| Networking | Request never reached the server, or the response never came back | Timeout, connection refused, DNS failure |
| Format | Request or response shape does not match expectations | 400 or 422, or a parsing error |
| Business logic | Worked technically, but the system's rules reject the action | 404, 409, or a 200 with an error field |

Two signals fall outside these four, and the table below labels them separately: 429 is a rate limit (you sent too much, too fast), and 500, 502, and 503 are server-side failures in the other system, not in your request.

### Status code troubleshooting table

| Code | Meaning | Bucket | What to check |
|---|---|---|---|
| 400 | Bad Request | Format | Valid JSON, required fields, right types |
| 401 | Unauthorized | Authentication | Key or token missing, expired, malformed |
| 403 | Forbidden | Authorization | Credential valid, but lacks permission |
| 404 | Not Found | Business logic or format | URL correct, resource or ID actually exists |
| 409 | Conflict | Business logic | Action conflicts with current state, e.g. duplicate record |
| 422 | Unprocessable Entity | Format | Valid JSON but fails validation, e.g. bad email format |
| 429 | Too Many Requests | Rate limit | Exceeded call volume, check `Retry-After` header |
| 500 | Internal Server Error | Server-side, not yours | Other system has a bug or crashed |
| 502 | Bad Gateway | Networking, server-side | Proxy could not get a valid response from the API |
| 503 | Service Unavailable | Server-side | Service overloaded or down for maintenance |
| 504 | Gateway Timeout | Networking | Proxy gave up waiting for a response |

Full definitions of each code live on the Status Codes page; this table is specifically about which bucket each one points to when an integration breaks.

### Working the diagnosis in order

A practical order to check, fastest and most common first: confirm the request reached the server (networking), then that the credential is valid and permitted (authentication and authorization), then that the request and response shapes match (format), and only then assume the system is correctly rejecting the action on its own terms (business logic). Jumping straight to "rotate the key" before checking the actual error body wastes time.

## Common misconceptions

- **"Any error means the API is broken" and "a timeout and a 500 are the same problem."** Both are covered on [Error Responses and Timeouts](./03-error-responses-and-timeouts.md).
- **"A 200 means the integration worked."** A 200 with an empty or missing result field, like the geocoding example above, can still be a business logic outcome your app must handle.
- **"401 and 403 are interchangeable."** 401 means the server does not know who you are. 403 means it knows exactly who you are and has decided you cannot do this. A 401 means check the credential, a 403 means check permissions.

## Typical interview questions

<details>
<summary>A client's integration returns a 403. What do you check first, and why not the API key itself?</summary>

Check permissions and scopes on the credential, not whether it exists. A 403 means the server already recognized the caller and rejected the action based on what it is allowed to do, a different problem than a missing or invalid key, that would be a 401.

</details>

<details>
<summary>How do you tell whether a failure is a networking problem or a business logic problem?</summary>

A networking problem shows up as a timeout, a connection error, or a 502 or 504 from a proxy: the request never got a real answer from the target service. A business logic problem gets a normal response, often a 200, 404, or 409, where the service understood the request and is telling you the action is not valid.

</details>

<details>
<summary>A client insists "the integration is broken" but the API returned a 200 with an empty result. How do you respond?</summary>

Explain that a 200 with an empty or error-carrying body is a successful technical response describing a business outcome, not a failure of the integration itself, for example a search that legitimately found nothing. Walk through what the request actually asked for before assuming the system is at fault.

</details>

## Learn more

- Article: [REST API Testing Guide for Beginners](https://dev.to/_d7eb1c1703182e3ce1782/rest-api-testing-guide-for-beginners-ke4) (DEV)
- Reference: [System Design 101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo)

## Related

- [REST Conventions](./01-rest-conventions.md)
- [API Authentication](./02-auth.md)
- [Error Responses and Timeouts](./03-error-responses-and-timeouts.md)
- [Rate Limits](./04-rate-limits.md)
- [Status Codes](../02-how-web-apps-run/06-status-codes.md)
- [Retries and Backoff](../06-reliability-scale/03-retries-and-backoff.md)
