---
title: Retries and Backoff
row: M1-L6.2
---
**In one sentence:** A retry tries the same request again after a failure, and backoff spaces those retries out so a struggling service gets a chance to recover.

## What it is

Any call to an outside service can fail: the network drops, the service is slow, or it is temporarily overloaded. A retry simply calls the same request again, assuming the failure was temporary.

Retrying instantly is a bad idea. If a service is struggling, an instant retry from every failed client piles on more load at the worst moment. This pileup is called a retry storm. Exponential backoff fixes this by waiting longer between each retry, for example 1, 2, 4, then 8 seconds. Jitter adds a small random amount to each wait so many clients do not retry at exactly the same moment and slam the service together.

## Why an FDE needs this

Client integrations fail in small, temporary ways constantly: a weather API times out once, an exchange rate service returns a 503 during a deploy, an LLM API briefly throttles a traffic spike. No retries means every blip becomes a user-facing error. Retrying every error type with no backoff turns a small blip into a bigger outage or a large bill from hammering a provider. Interviewers test the same judgment: retry the right errors, back off correctly, know when to stop.

## Key concepts

### Which errors to retry

| Retry these | Do not retry these |
|---|---|
| Network timeouts | 400 Bad Request (the request is wrong) |
| 429 Too Many Requests | 401 or 403 (auth will not fix itself) |
| 502, 503, 504 (likely temporary) | 404 Not Found, 422 Validation error |

Retry errors that suggest a temporary problem on the other end. Do not retry errors that say the request itself was wrong, since retrying gets the same result every time. A timed-out POST may have already succeeded, so retry it only if the endpoint is idempotent.

### Exponential backoff with jitter

```python
import random, time

def call_with_retry(fn, max_attempts=5, base=1, cap=30):
    for attempt in range(max_attempts):
        try:
            return fn()
        except RetryableError:
            if attempt == max_attempts - 1:
                raise
            wait = min(cap, base * (2 ** attempt))
            wait += random.uniform(0, wait * 0.1)  # jitter
            time.sleep(wait)
```

### Retry storms and Retry-After

A retry storm happens when a dependency goes down, every client retries at once, and the flood keeps it down even after the original problem clears. Jitter, backoff caps, and a max attempt count prevent this. Some systems add a circuit breaker: after enough failures, stop calling the dependency for a cooldown period instead of retrying. When an API returns a `Retry-After` header, honor it instead of guessing.

## Common misconceptions

- **"More retries is always safer."** Excess retries against a struggling service can turn a small outage into a longer one, and multiply costs on a billed API.
- **"Retry every failed request."** Retrying a 400 or 401 wastes calls, since the request fails the same way every time.
- **"Backoff just means a fixed wait before retrying."** A fixed delay does not scale with how bad the problem is. Exponential backoff gives real room to recover.

## Typical interview questions

<details>
<summary>Why add jitter to exponential backoff instead of just doubling the wait?</summary>

Without jitter, clients that failed at the same moment all retry at the same moment again, recreating the spike that caused the failure. Jitter spreads retries out so the recovering service sees a trickle instead of synchronized waves.

</details>

<details>
<summary>Would you retry a 404 response? Why or why not?</summary>

No. A 404 means the resource does not exist, which is not temporary. Retrying wastes a call and gets the same result. Retries make sense for errors suggesting a temporary, other-end problem, like a 503 or a timeout.

</details>

<details>
<summary>What is a retry storm and how do you prevent one?</summary>

A feedback loop where a dependency fails, clients retry, the extra load keeps it failing, and that triggers even more retries. Prevent it with exponential backoff plus jitter, a capped max wait and attempt count, and optionally a circuit breaker.

</details>

<details>
<summary>An API returns a `Retry-After` header on a 429. What should the caller do with it?</summary>

Wait at least that long before retrying instead of guessing a delay. Many LLM and rate-limited APIs send this header so callers do not need their own backoff estimate for that response.

</details>

## Learn more

- Article: [Job Queues Explained: Workers, Retries and Scheduling](https://blog.openreplay.com/job-queues-explained-workers-retries-scheduling/) (OpenReplay, about 15 min).
- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, rate limiting and reliability sections).

## Related

- [Timeouts](./04-timeouts.md)
- [Idempotency](./05-idempotency.md)
- [Rate Limits](../03-apis-data-integration/04-rate-limits.md)
- Goes deeper in Module 4: [Reliability: Timeouts, Retries, Fallbacks, Circuit Breakers, Batching & Caching](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
