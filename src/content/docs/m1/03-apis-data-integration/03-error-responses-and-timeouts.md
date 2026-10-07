---
title: Error Responses and Timeouts
row: M1-L3.1
---
**In one sentence:** A failed API call either comes back with a status code and an error body you can read, or it never comes back at all within the time you were willing to wait, and those two situations need different handling.

## What it is

When an API call does not go as planned, there are two different shapes of failure. The first is a response: the server answered, but with a status code outside the 200 range, usually along with a JSON body describing what went wrong. The second is a timeout: no response arrives at all, so there is no status code and no body to read, only silence.

A well-behaved API returns a structured error body, not just a status code, so the caller can act on it:

```json
{
  "error": {
    "code": "invalid_date",
    "message": "start_date must be before end_date"
  }
}
```

The status code tells you the general category (client error, server error). The body tells you specifically what was wrong, and a good `code` field lets your own code branch on the error without parsing English text.

## Why an FDE needs this

A client will say "the integration is broken" and expect a fast, correct read of what actually happened. Reading the error body, not just the status code, is often the difference between fixing the real problem in two minutes and guessing for an hour.

## Key concepts

### Reading an error body

Most APIs put useful detail in the response body even on failure: which field was invalid, what value was expected, sometimes a link to documentation. Always log the body on a failed call during development, not just the status code. Full status code meanings are on the Status Codes page; this page is about what to do once you have read one.

### Setting an explicit timeout

Good client code sets an explicit timeout rather than waiting forever, and handles that case separately from an error response:

```python
import requests
try:
    r = requests.get("https://api.open-meteo.com/v1/forecast",
                      params={"latitude": 31.5, "longitude": 74.3, "current_weather": True},
                      timeout=5)
    r.raise_for_status()
except requests.exceptions.Timeout:
    print("no response within 5 seconds")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error (4xx or 5xx): {e}")
```

### Timeout vs error response

A timeout and a 500 both mean something went wrong, but point in different directions. A 500 means the server received the request and reports a problem on its own end. A timeout means nothing came back at all, a slow network, an overloaded server, a firewall dropping packets, or a dead server all look identical from the caller's side. That points toward network or infrastructure issues, not necessarily the server's application code, and diagnosing the root cause needs more than the client's own logs, covered on the Diagnosing Integration Failures page.

## Common misconceptions

- **"Any error means the API is broken."** A well-formed error response, like a 400 for a bad date range, means the API is working exactly as designed. The failure is in how your app used it.
- **"A timeout and a 500 are the same problem."** A 500 means the server responded and told you something went wrong on its end. A timeout means nothing came back at all.
- **"The status code alone tells you what to fix."** The error body usually has the specific detail. Two different 400 responses can point at completely different problems.

## Typical interview questions

<details>
<summary>Why should client code always set an explicit timeout?</summary>

Without one, a hung connection can block a request indefinitely, leaving a user staring at a spinner with no way to know if it will resolve. An explicit timeout turns an indefinite wait into a clear, handleable failure.

</details>

<details>
<summary>An API call returns a 400 status. What do you look at next?</summary>

The response body, not just the code. Most APIs include a message or error code describing which field or value was rejected, which is far more actionable than the status code alone.

</details>

<details>
<summary>How do you tell a timeout apart from a 500 error in your own code?</summary>

A 500 is caught as an HTTP error with a status code and usually a body; a timeout is a separate exception (in Python, `requests.exceptions.Timeout`) raised because no response arrived at all within the configured wait time. They should be handled as distinct cases, not merged into one generic "it failed" branch.

</details>

## Learn more

- Article: [REST API Testing Guide for Beginners](https://dev.to/_d7eb1c1703182e3ce1782/rest-api-testing-guide-for-beginners-ke4) (DEV)

## Related

- [Status Codes](../02-how-web-apps-run/06-status-codes.md)
- [Integration Failure Diagnosis](./07-diagnosing-integration-failures.md)
- [Retries and Backoff](../06-reliability-scale/03-retries-and-backoff.md)
- [Timeouts](../06-reliability-scale/04-timeouts.md)
