---
title: Rate Limits
row: M1-L3.1
---
**In one sentence:** A rate limit is a cap on how many requests, or how many tokens, a client can send in a given time window, and going over it gets a 429 response instead of an answer.

## What it is

Any API shared by many people needs to protect itself from a single client overwhelming it. A rate limit is a rule like "no more than 60 requests per minute." Going over it returns HTTP 429, "Too Many Requests," usually with a `Retry-After` header. Ignoring that and retrying immediately just triggers another 429.

LLM (large language model) APIs often add a second dimension: tokens per minute, the small chunks of text a model processes, counting both the prompt and the response. A script looping over a thousand rows calling an LLM as fast as possible will hit these limits quickly, especially on a newer account with a lower usage tier.

## Why an FDE needs this

Client work regularly involves calling an API at volume: syncing a CRM overnight, summarizing a batch of documents. A script written without rate limits in mind works fine in a small test, then fails partway through a real batch run with a wall of 429 errors and rows silently skipped, in front of the client.

## Key concepts

### Handling a 429

```python
import time, requests

def call_api(payload, max_attempts=5):
    for attempt in range(max_attempts):
        response = requests.post(API_URL, json=payload, headers=HEADERS, timeout=30)
        if response.status_code != 429:
            response.raise_for_status()
            return response.json()
        retry_after = response.headers.get("Retry-After", "")
        # Use the server's wait if it sent seconds; otherwise back off 1, 2, 4, 8 s
        wait = int(retry_after) if retry_after.isdigit() else 2 ** attempt
        if attempt < max_attempts - 1:
            time.sleep(wait)
    response.raise_for_status()  # still 429 after max_attempts: give up loudly
```

Wait the time the server asks for, double the wait when it gives none, and stop after a fixed number of attempts. Some 429s never clear by waiting: a monthly spend cap or an exhausted quota stays a 429 until someone raises the limit, so the loop must end and report the error.

### Client-side throttling

Instead of firing requests as fast as possible and reacting to 429s, a client can pace itself, for example one request per second if the limit is 60 per minute:

```python
def throttled_calls(items, calls_per_second=1):
    delay = 1 / calls_per_second
    for item in items:
        call_api(item)
        time.sleep(delay)
```

Pacing up front avoids failed attempts instead of reacting to them.

### Requests per minute vs tokens per minute

A request limit caps how many calls you can make. A token limit caps the total size sent and received, so a handful of long prompts can exhaust a token budget before hitting a request-count limit. LLM providers commonly enforce both at once. Anthropic, for example, limits requests, input tokens, and output tokens per minute separately, plus a monthly spend cap.

### Smoothing bursts with a queue

If an action can trigger a burst of calls at once, a bulk upload of 200 documents each needing a summary, a queue plus a worker at a steady rate keeps the system under the limit instead of firing all 200 at once. Covered on the Queues and Workers page.

## Common misconceptions

- **"A 429 means something is broken."** It means requests came in faster than the API allows. The fix is pacing the client, not debugging the call itself.
- **"Retrying immediately after a 429 is fine."** It usually triggers another 429 and can extend a penalty window.
- **"Rate limits only apply to obviously heavy usage."** A single script looping over a few hundred items can hit per-minute limits quickly, especially token limits on long prompts.

## Typical interview questions

<details>
<summary>What does a 429 mean, and what should a client do?</summary>

It means the client exceeded the API's rate limit. The client should back off, ideally using the `Retry-After` header if present, wait that long, then retry rather than resending immediately.

</details>

<details>
<summary>A batch job must summarize 500 documents against an API allowing 60 requests per minute. How would you design it?</summary>

Put the documents on a queue and process them with a worker paced to stay under 60 per minute, roughly one call per second, rather than firing all 500 at once. The worker should also back off on any 429s and track which documents succeeded.

</details>

<details>
<summary>How does a queue help a system stay within an API's rate limit?</summary>

Instead of a burst of user actions triggering a burst of API calls, a queue holds the excess work and a worker pulls from it at a steady rate that respects the limit, smoothing spikes into a stream the API can handle.

</details>

## Learn more

- Reference: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) (Anthropic API documentation)
- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, rate limiting section)

## Related

- [Integration Failure Diagnosis](./07-diagnosing-integration-failures.md)
- [Retries and Backoff](../06-reliability-scale/03-retries-and-backoff.md)
- [Queues and Workers](../06-reliability-scale/02-queues-and-workers.md)
- Goes deeper in Module 4: [API Versions, Rate Limits & Fallback Sources](../../m4/01-external-apis-mcp-and-connector-design/03-api-versions-rate-limits-and-fallback-sources.md)
