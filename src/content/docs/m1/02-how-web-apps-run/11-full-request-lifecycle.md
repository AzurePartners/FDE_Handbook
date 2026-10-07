---
title: Full Request Lifecycle
row: M1-L2.4
---
**In one sentence:** A single click in a browser sets off a full chain of steps, DNS lookup, connection, encryption, request, backend logic, and response, and being able to follow that chain is the fastest way to find where something actually broke.

## What it is

Every action in a web app, a button click, a page load, sets off the same underlying sequence. First, if the browser does not already know the server's address, it performs a DNS lookup to turn the domain name into an IP address. Next, the browser opens a connection to that address and, for HTTPS, performs a TLS handshake to set up encryption and verify the server's identity. Only then does the actual HTTP request travel over that connection. The backend receives it, runs its logic, which may include reading or writing a database or calling an external service, and sends back an HTTP response, which the browser uses, for example to render new content.

```
Browser needs api.example.com
        |
        v
DNS lookup: name to IP address
        |
        v
Connection opens to that IP address, on port 443
        |
        v
TLS handshake: browser and server agree on encryption
        |
        v
HTTP request sent over the encrypted connection
        |
        v
Backend runs logic, reads/writes database, maybe calls external services
        |
        v
HTTP response received
        |
        v
Shown as one row in the browser's Network tab
```

Most of this sequence happens automatically and quickly, and the browser's DevTools Network tab is the main tool for inspecting the parts you can see: the request and response themselves. It records every HTTP request the page makes and shows its method, URL, status code, headers, timing, and both bodies. Most browsers open DevTools with F12 or right-click, "Inspect."

## Why an FDE needs this

In a live client debugging session, being able to trace one request from a button click to a database query and back, in real time, is the difference between looking competent and looking lost. It also protects you from a common trap: trusting what an AI coding tool claims a piece of code does, instead of confirming it by watching the actual request and response. If an AI says "this endpoint returns the user's order history," tracing the real request tells you whether that is true.

## Key concepts

### Reading a request in the Network tab

For each request, the Network tab shows the name (URL), method, status code, type (`fetch` for API calls, `document` for the page), and timing. Clicking a request opens sub-tabs for the request headers, response headers, and the payload or response body, showing exactly what was sent and what came back.

### A worked trace: clicking "Get Weather"

1. User clicks "Get Weather." Frontend JavaScript reads the city and sends `GET /weather?city=Lahore`.
2. In the Network tab, this shows up as a row: method `GET`, status `200`, type `fetch`.
3. The response body contains the JSON with weather data.
4. In the code, the matching backend route is found, for example `@app.get("/weather")` in a FastAPI app.
5. Reading that function shows it calls a weather provider, formats the result, and returns it as JSON, matching what the Network tab showed.

```python
@app.get("/weather")
def get_weather(city: str):
    forecast = fetch_forecast(city)
    return {"city": city, "forecast": forecast}
```

If the Network tab showed a `500` instead of a `200`, the next step would be checking `fetch_forecast` and the provider it calls, rather than guessing.

## Common misconceptions

- **"If the Network tab shows nothing, the backend is down."** It could also mean the frontend never tried to send the request, for example due to a JavaScript error earlier on the page. Checking the Console tab alongside the Network tab tells the difference.
- **"A fast request in the Network tab means the whole page is fast."** The Network tab only times the requests it tracks. Rendering and other browser work happen outside that timing and can still make the page feel slow.
- **"DNS and TLS are things only network engineers deal with."** They rarely need attention, but a DNS misconfiguration or an expired TLS certificate are common causes of "the site is completely unreachable."
- **"Tracing a request means reading every line of the backend."** Tracing means following the specific path that one request takes, which is usually a small fraction of the codebase.

## Typical interview questions

<details>
<summary>Walk through the full lifecycle of a single request, from a button click to the page updating.</summary>

DNS turns the domain into an IP address if it is not already known, the browser opens a connection and, for HTTPS, completes a TLS handshake, the HTTP request travels over that connection, the backend runs its logic and returns a response, and the browser uses that response, for example to update the page.

</details>

<details>
<summary>What information does the Network tab give you for a single request?</summary>

The method, the full URL, the status code, the request and response headers and bodies, and timing information. Together, these show exactly what was sent and exactly what came back.

</details>

<details>
<summary>A request fails to appear in the Network tab at all. What does that suggest, versus a request that appears with a 500 status?</summary>

A request missing from the Network tab suggests the frontend never sent it, often because of a JavaScript error. A request that appears as failed with no status points at the network, such as DNS or a refused connection. A request that appears with a 500 reached the server and the server's own logic failed while handling it.

</details>

<details>
<summary>An AI tool tells you an endpoint "returns the user's full order history." How would you confirm that, rather than trust the claim?</summary>

Trigger the request in the browser, open the Network tab, and read the actual response body to see what data comes back. Then check the backend code for that route to confirm the logic matches.

</details>

## Learn more

- Article: [Inspect network activity](https://developer.chrome.com/docs/devtools/network) (Chrome DevTools).
- Video: [Chrome DevTools 101, Network](https://www.youtube.com/watch?v=e1gAyQuIFQo) (YouTube).
- Article: [Chrome DevTools Network Tab guide](https://guides.codepath.org/webdev/Chrome-DevTools-Network-Tab) (CodePath).

## Related

- [IP Addresses and Ports](./02-dns-ip-ports.md)
- [HTTPS, Domains and Certificates](../05-containers-deployment/07-domains-and-certificates.md)
- [HTTP Requests and Responses](./04-http-request-response.md)
- [Status Codes](./06-status-codes.md)
- [Logs and Stack Traces](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)
