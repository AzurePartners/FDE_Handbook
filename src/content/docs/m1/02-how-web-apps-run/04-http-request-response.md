---
title: HTTP Requests and Responses
row: M1-L2.2
---
**In one sentence:** HTTP is the agreed-upon format a client and a server use to exchange a request and a response, both structured as plain text with a few required parts.

## What it is

HTTP (HyperText Transfer Protocol) is the language browsers, backends, and outside services use to talk to each other over the internet. Every time a browser loads a page, or a backend calls a weather API, it sends an HTTP request and gets an HTTP response back. In HTTP/1.1 both are plain text (HTTP/2 and HTTP/3 carry the same parts in a binary encoding), and both follow the same shape: a starting line, a set of headers, a blank line, and an optional body.

A request says what the client wants: which method (the action, its own page), which URL (the resource), which headers (metadata), and sometimes a body (data being sent). A response says what happened: a status code (a three-digit summary, its own page), headers, and usually a body with the data or an error message. Neither side needs to know how the other is built.

HTTP is a request-response protocol. The client always speaks first, and the server never sends anything unprompted. Each request and response is self-contained: the server does not automatically remember your last request unless the application explicitly stores something, such as a cookie, to bridge the two (covered on the Stateless HTTP page).

## Why an FDE needs this

When something breaks between a frontend and a backend, the fastest way to find out why is to look at the actual HTTP request and response, not guess from the error message on screen. If a client says "the form doesn't save," open the Network tab, find the request the form sent, and read its method, its body, and the exact status code and body the server sent back. That alone usually tells you whether the bug is in the frontend, the backend, or the request never left the browser at all.

## Key concepts

### The parts of a request

| Part | What it means | Example |
|---|---|---|
| Method | The action being requested | `GET`, `POST`, `PUT`, `DELETE` |
| URL / path | The resource being requested | `/weather?city=Lahore` |
| Headers | Metadata about the request | `Content-Type: application/json` |
| Body | Data sent with the request (optional) | `{"city": "Lahore"}` |

### The parts of a response

| Part | What it means | Example |
|---|---|---|
| Status code | Three-digit summary of the result | `200`, `404`, `500` |
| Headers | Metadata about the response | `Content-Type: application/json` |
| Body | The actual data or error message | `{"temp_c": 21.4}` |

### A raw HTTP request and response

This is what actually travels over the network when a browser asks an API for weather data.

Request:

```
GET /weather?city=Lahore HTTP/1.1
Host: api.example.com
Accept: application/json
User-Agent: Mozilla/5.0

```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 53

{"city": "Lahore", "temp_c": 32.1, "currency": "PKR"}
```

The blank line between the headers and the body is required. It is how the receiver knows the headers have ended and the body has begun.

### Headers worth recognizing

| Header | Meaning |
|---|---|
| `Content-Type` | What format the body is in, for example `application/json` |
| `Authorization` | Credentials, such as an API key or token |
| `Accept` | What formats the client is willing to receive |
| `Cookie` / `Set-Cookie` | Small pieces of state the server asks the browser to store and send back |

### Methods, briefly

The method is part of the starting line and communicates intent: `GET` reads data, `POST` creates or submits data, `PUT` and `PATCH` update, `DELETE` removes. The full set of methods, and how they are used, is its own page.

## Common misconceptions

- **"GET requests can't send any data."** A GET request can include data in the URL as a query string, for example `?city=Lahore`. It just should not include a body or change data on the server.
- **"The status code and the body always agree."** They usually do, but a poorly written server can send a `200 OK` with an error message in the body. Reading both is safer than reading either alone.
- **"HTTP requires a browser."** HTTP is a text-based protocol any program can speak, including `curl` or one backend calling another.

## Typical interview questions

<details>
<summary>What are the main parts of an HTTP request?</summary>

A method, a URL identifying the resource, a set of headers giving metadata, and an optional body carrying data. The message starts with a line combining the method and URL, followed by headers, a blank line, then the body if there is one.

</details>

<details>
<summary>What are the main parts of an HTTP response?</summary>

A status code summarizing the result, a set of headers, and usually a body with the actual data or an error message. The shape mirrors the request: a starting line, headers, a blank line, then the body.

</details>

<details>
<summary>A frontend developer says "I sent the request but got nothing back." How would you check what actually happened?</summary>

Open the browser's Network tab, find the request, and check whether it was sent at all, what status code came back, and what the response body contains. This separates a request that never left the browser from one the server answered with an error.

</details>

<details>
<summary>What does the Content-Type header do, and what happens if it is wrong?</summary>

It tells the receiver what format the body is in, such as `application/json`. If it is wrong, the receiving program may fail to parse the body even though the data itself is fine.

</details>

<details>
<summary>Why can a Python backend and a JavaScript frontend communicate without either knowing how the other is built?</summary>

They agree on one shared format, HTTP, for the request and response shape, and usually JSON for the body. Neither side needs to know the other's internals, only how to produce and parse that shared format.

</details>

## Learn more

- Article: [Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (MDN, about 30 min).
- Article: [HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) (MDN, about 20 min).
- Article: [The HTTP request and response cycle](https://backend.turing.edu/module2/lessons/how_the_web_works_http) (Turing School, about 30 min).

## Related

- [HTTP Methods](./05-http-methods.md)
- [Status Codes](./06-status-codes.md)
- [JSON](./07-json.md)
- [API Authentication](../03-apis-data-integration/02-auth.md)
