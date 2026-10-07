---
title: REST Conventions
row: M1-L3.1
---
**In one sentence:** REST is a style for designing APIs where every piece of data is a "resource" with its own URL, and you act on it with standard HTTP methods, headers, and query parameters.

## What it is

REST stands for Representational State Transfer: a set of conventions for designing APIs. A customer, an order, or a weather forecast is a "resource" with its own URL, and you act on it using standard HTTP methods. If you have ever visited a URL in a browser, you have already made a REST-style request: the browser sent a GET request and the server sent back a page.

An API (Application Programming Interface) is how one piece of software asks another to do something, instead of a person clicking a button. A REST API is that idea built on HTTP, returning data, almost always JSON, for a program to read instead of an HTML page.

Take Open-Meteo, a free weather service, no signup required:

```
curl "https://api.open-meteo.com/v1/forecast?latitude=31.5&longitude=74.3&current_weather=true"
```

The URL is the resource, a forecast for a location. The method is GET, meaning "give me data, do not change anything." The response is JSON a program can parse. The methods themselves are covered on the HTTP Methods page; this page is about the conventions built on top of them.

## Why an FDE needs this

Almost every client integration involves calling someone else's API or exposing one of your own. A client will say "just pull the data from our CRM," and that happens through a REST API. Without understanding resource naming, headers, and request shape, you cannot read API documentation quickly.

## Key concepts

### Resources and URLs

A REST API organizes data into resources, each with a URL pattern, usually a plural noun. `/customers` lists all customers, and `/customers/42` refers to one. `GET /customers/42` reads it, `PATCH /customers/42` updates part of it, `DELETE /customers/42` removes it. Nested resources express ownership: `/customers/42/orders` means "orders belonging to customer 42." A URL should read like a path to a thing, not a function call; `/customers/42/cancel` is a pragmatic exception when an action does not map onto a resource.

### Headers

Headers are metadata sent with a request:

- `Content-Type: application/json` tells the server the body is JSON.
- `Authorization: Bearer <token>` proves who is calling, covered on the Auth page.
- `Accept: application/json` tells the server what format to reply in.

### Query parameters vs request body

Query parameters shape what comes back; the body carries what you send. See [HTTP Methods](../02-how-web-apps-run/05-http-methods.md) for the full rule.

### Filtering, sorting, and pagination

Well-designed REST APIs use query parameters for common operations: `?status=active` to filter, `?sort=-created_at` to order. Lists rarely return everything at once. Pagination splits results into pages, `?page=2&limit=50` or a cursor like `?after=abc123`. Skipping it is a common bug: a "we're missing records" complaint is often just page 1 mistaken for the whole list.

### Idempotency by method

An idempotent request has the same effect whether sent once or ten times. GET, PUT, and DELETE are conventionally idempotent; POST is not, sending the same "create an order" request twice usually creates two orders. Retrying a failed PUT is safe; a failed POST can duplicate data.

### Versioning, briefly

APIs change over time. A common convention is a version in the URL, `/v1/customers` versus `/v2/customers`, so a breaking change does not silently affect every caller, covered in full on the Schema and Data Contracts page.

## Common misconceptions

- **"REST APIs must return JSON."** Nothing in REST requires JSON. Some return XML or plain text. JSON is just the common convention because it is easy to read and parse.
- **"Any URL that returns data is 'RESTful'."** REST conventions include predictable resource naming, correct method use, and standard status codes. An API that uses POST for every action, including reads, technically works but ignores the conventions that make it easy to guess and reuse.
- **"An API without a key is not secure enough to use."** Plenty of production APIs, including Open-Meteo, are public and keyless because the data is not sensitive. Access control depends on what the data is, not on whether a key exists.

## Typical interview questions

<details>
<summary>What makes an API "RESTful" beyond just returning JSON over HTTP?</summary>

Predictable resource-based URLs, correct use of HTTP methods, standard status codes, and stateless requests (each carries what it needs). An API that ignores all of this but returns JSON is not really following REST conventions.

</details>

<details>
<summary>A client's API returns a very long list of records but your app only shows 50. What do you check first?</summary>

Whether the API paginates results. Check the docs for a page, limit, offset, or cursor parameter, and check the response for a "next page" link or total count.

</details>

<details>
<summary>Why does it matter whether a request is idempotent?</summary>

It determines whether retrying a failed request is safe. Retrying an idempotent request (GET, PUT, DELETE) after a timeout is safe because repeating it does not change the outcome. Retrying a non-idempotent POST can create a duplicate, so it needs extra care, such as an idempotency key.

</details>

<details>
<summary>Why do many APIs put a version like /v1/ in the URL?</summary>

So a breaking change can ship as /v2/ while existing callers keep using /v1/ unchanged, instead of every integration breaking at once.

</details>

## Learn more

- Article: [APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/) (freeCodeCamp, about 2.5 hours, pick the sections you need)
- Article: [How to Use a REST API](https://uibakery.io/blog/how-to-use-a-rest-api) (UI Bakery, about 20 min)
- Article: [REST API Testing Guide for Beginners](https://dev.to/_d7eb1c1703182e3ce1782/rest-api-testing-guide-for-beginners-ke4) (DEV, optional)

## Related

- [HTTP Methods](../02-how-web-apps-run/05-http-methods.md)
- [API Authentication](./02-auth.md)
- [Integration Failure Diagnosis](./07-diagnosing-integration-failures.md)
- [Schema and Data Contracts](./10-schema-and-data-contracts.md)
