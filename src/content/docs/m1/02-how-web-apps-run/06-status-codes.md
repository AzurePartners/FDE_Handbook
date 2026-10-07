---
title: Status Codes
row: M1-L2.2
---
**In one sentence:** A status code is a three-digit number at the start of every HTTP response that tells you, at a glance, whether the request succeeded, failed, or needs something else before it can complete.

## What it is

Every HTTP response starts with a status code. It is the fastest signal available for understanding what happened, faster than reading the response body or checking logs. Status codes are grouped into five ranges by their first digit: 1xx means "still processing," 2xx means "it worked," 3xx means "go look somewhere else," 4xx means "the client did something the server won't accept," and 5xx means "the server itself failed."

You do not need to memorize every code. You need to recognize the range on sight, and know the handful of specific codes that come up constantly: 200, 400, 401, 403, 404, 429, and 500 cover most real situations. The code is chosen by the server, based on how the backend decided to respond, and it is meant to be a reliable summary a frontend or script can act on without parsing the body.

## Why an FDE needs this

Status codes are the fastest way to narrow a bug on a support call. When a user reports "the app broke," the status code from the failed request tells you which side to look at first. A 400 or 404 usually points at what the client sent. A 401 or 403 points at authentication or permissions. A 429 points at a rate limit, not a bug. A 500 or 502 points at the server or something it depends on. Reading the status code before anything else saves real time in a live debugging session with a client watching.

## Key concepts

### The five ranges

| Range | Meaning | When you see it |
|---|---|---|
| 1xx | Informational, request received, still processing | Rare in everyday API work |
| 2xx | Success | The request completed as expected |
| 3xx | Redirection | Look elsewhere: usually follow a new URL; 304 means use your cached copy |
| 4xx | Client error | Something about the request itself was wrong |
| 5xx | Server error | The server failed while handling a valid request |

### The codes worth knowing by number

| Code | Name | Meaning |
|---|---|---|
| 200 | OK | The request succeeded |
| 201 | Created | A new resource was successfully created |
| 204 | No Content | The request succeeded and there is nothing to return |
| 301 / 302 | Moved | The resource lives at a new URL, permanently or temporarily |
| 400 | Bad Request | The request was malformed or missing required data |
| 401 | Unauthorized | The request needs valid credentials that were missing or wrong |
| 403 | Forbidden | The server refuses the request; logging in again will not help |
| 404 | Not Found | The requested resource does not exist |
| 408 | Request Timeout | The server gave up waiting for the rest of the request |
| 429 | Too Many Requests | The client hit a rate limit |
| 500 | Internal Server Error | The server hit an unexpected error while processing |
| 502 | Bad Gateway | A server acting as a middleman got an invalid response from another server |
| 503 | Service Unavailable | The server is temporarily unable to handle the request, often overloaded or down for maintenance |

### Matching a code to a real situation

In an API that returns a city's weather, a request to `/weather?city=` with no city given should return a `400`, since the client sent an incomplete request. A request for a city that does not exist should return a `404`. If the weather provider itself is down when the backend calls it, the backend should return a `502`, since it is acting as a client to a broken upstream server.

```
GET /weather?city= HTTP/1.1
Host: api.example.com

HTTP/1.1 400 Bad Request
Content-Type: application/json

{"error": "city is required"}
```

## Common misconceptions

- **"404 always means the whole page is broken."** A 404 means the specific resource requested was not found. The rest of the app, and even the same page's other requests, can be working fine.
- **"500 errors are always the client's fault for sending bad data."** A 500 specifically means the server failed unexpectedly. If the client sent bad data, a well-written backend should catch it and return a 400, not crash into a 500.
- **"A 200 status code means the data is correct."** A 200 only means the server successfully processed the request. The body could still contain an empty result or data the frontend cannot use.
- **"3xx codes are errors."** A 3xx code is a redirection instruction, not a failure. Most HTTP clients follow it automatically without the user noticing.

## Typical interview questions

<details>
<summary>What do the five ranges of HTTP status codes mean, in general?</summary>

1xx is informational, still processing. 2xx means success. 3xx means redirection to another URL. 4xx means the client sent something the server would not accept. 5xx means the server failed while handling an otherwise valid request.

</details>

<details>
<summary>What is the difference between a 401 and a 403?</summary>

A 401 means the request lacks valid credentials, so the server does not know who is asking, or the credentials were wrong. A 403 means the server does know who is asking, but that identity is not allowed to perform the action.

</details>

<details>
<summary>A client's system returns a 502 when calling your API. What does that tell you?</summary>

A 502 means a server acting as a middleman received an invalid response from another server it depends on. Check whether your backend's own calls to its upstream dependencies are succeeding, since the failure is likely one step further back.

</details>

<details>
<summary>You see a 429 in the logs. Is that a bug?</summary>

Not necessarily. A 429 usually means a rate limit was hit by design, often to protect the server from being overwhelmed. The response usually calls for retrying after a delay rather than treating it as a defect to fix in the code.

</details>

## Learn more

- Article: [Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (MDN, about 30 min).
- Article: [HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) (MDN, about 20 min).

## Related

- [HTTP Requests and Responses](./04-http-request-response.md)
- [HTTP Methods](./05-http-methods.md)
- [Full Request Lifecycle](./11-full-request-lifecycle.md)
- [Error Responses and Timeouts](../03-apis-data-integration/03-error-responses-and-timeouts.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
