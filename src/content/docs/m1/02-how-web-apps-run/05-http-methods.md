---
title: HTTP Methods
row: M1-L2.2
---
**In one sentence:** The HTTP method is the verb in a request, telling the server what kind of action the client wants, and picking the right one lets other programs make safe assumptions about what a request will do.

## What it is

Every HTTP request names a method: `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` are the ones that come up constantly. The method is not just a label; it is a promise about intent. `GET` means "give me data, do not change anything." `POST` means "create something new, or submit data for processing." `PUT` means "replace this resource entirely." `PATCH` means "update part of this resource." `DELETE` means "remove this resource."

Because the method communicates intent, tools built around HTTP can make safe assumptions without reading the body. Browsers and caches pre-fetch or retry `GET` requests freely, since a well-built API guarantees they cause no side effects. Nothing in the protocol enforces this; it is a convention, and an API that changes data on `GET` breaks the assumption every browser and cache relies on.

`GET` and `DELETE` requests almost never carry a body; what they act on is usually identified by the URL itself, for example `/customers/42`. `POST`, `PUT`, and `PATCH` usually carry a body, most often JSON. A useful rule: query parameters describe what you want back; the body describes what you are sending.

## Why an FDE needs this

Almost every client integration involves calling someone else's API or exposing one of your own, and the method is the first thing to check when a request behaves unexpectedly. A client sends `PUT` when they meant `PATCH` and wipes out fields they did not intend to touch.

## Key concepts

### The five core methods

| Method | Purpose | Typical body |
|---|---|---|
| GET | Read a resource, no side effects | None |
| POST | Create a new resource, or submit data | JSON |
| PUT | Replace a resource entirely | JSON |
| PATCH | Update part of a resource | JSON |
| DELETE | Remove a resource | None |

### PUT versus PATCH

`PUT /customers/42` with a body containing only a name would, under a strict implementation, replace the whole record, clearing any field left out. `PATCH /customers/42` with the same body changes only the name and leaves everything else untouched.

### Query parameters vs. request body

Query parameters go in the URL after a `?`, used mostly with `GET`, for example `?city=Lahore&count=1`. Query strings show up in logs and browser history, so sensitive data belongs in the body, never the query string.

## Common misconceptions

- **"GET requests can change data if the API is built that way."** By convention `GET` should never have side effects. Browsers and caches pre-fetch `GET` requests assuming they are safe, so an API that changes data on `GET` causes real bugs elsewhere in the stack.
- **"PUT and PATCH are interchangeable."** `PUT` replaces the whole resource. `PATCH` changes only the fields you send. Using the wrong one can wipe out fields you did not mean to touch.
- **"POST always means 'save to the database.'"** `POST` means "submit data for the server to process." What the server does with it is up to the backend logic, not the method itself.

## Typical interview questions

<details>
<summary>What is the difference between PUT and PATCH?</summary>

PUT replaces the entire resource with what you send, so any field you leave out may be cleared. PATCH updates only the fields included in the request body, leaving everything else unchanged.

</details>

<details>
<summary>When would you put something in the query string versus the request body?</summary>

Query parameters filter or shape a GET request, such as a page number or search term. The body carries the actual data for POST, PUT, or PATCH.

</details>

<details>
<summary>Why do APIs use different HTTP methods instead of one generic endpoint?</summary>

The method itself communicates intent, so servers, browsers, and caches can make safe assumptions, for example that GET requests can be retried or cached freely because they do not change data.

</details>

## Learn more

- Article: [Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (MDN, about 30 min).
- Article: [APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/) (freeCodeCamp, about 2.5 hours, pick the sections you need).

## Related

- [HTTP Requests and Responses](./04-http-request-response.md)
- [Status Codes](./06-status-codes.md)
- [JSON](./07-json.md)
- [REST Conventions](../03-apis-data-integration/01-rest-conventions.md)
- [Idempotency](../06-reliability-scale/05-idempotency.md)
