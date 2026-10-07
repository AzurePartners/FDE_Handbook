---
title: "Reliability: Timeouts, Retries, Fallbacks, Circuit Breakers, Batching & Caching"
row: M4-L4.1
---
**In one sentence:** Model and API calls fail, slow down, and rate-limit, so production reliability comes from timeouts, retries with backoff, fallbacks, circuit breakers, batching, and caching, the standard toolkit for staying up when a dependency doesn't.

## What it is

Depending on a single endpoint makes your feature exactly as reliable as that endpoint. The generic building blocks, timeouts, retries with backoff, idempotency, and caching, are covered in Module 1 ([Retries and Backoff](../../m1/06-reliability-scale/03-retries-and-backoff.md) and its neighbours); applied to model and API calls, the toolkit is:

- **Timeout:** cap how long you wait before giving up, so a stuck call doesn't hang forever.
- **Retry with backoff + jitter:** retry transient errors (429, 503, timeout), waiting longer each time, randomized, so you don't hammer a struggling service.
- **Fallback:** a secondary model/provider or degraded mode when the primary fails.
- **Circuit breaker:** after repeated failures, stop calling and fail fast, probing periodically to recover.
- **Batching:** combine many small calls into fewer to cut overhead and stay under limits.
- **Caching:** reuse recent results instead of recomputing/recalling.

## Why an FDE needs this

Customers judge a feature by whether it works when needed, and "the provider was down" isn't acceptable for production. These techniques turn provider hiccups into invisible blips. Retries must be paired with **idempotency** so a retried write doesn't double-charge or double-post.

## Key concepts

| Technique | Handles |
| --- | --- |
| Timeout | Hung/slow calls |
| Retry + backoff/jitter | Transient errors, without thundering-herd |
| Fallback | Primary provider failing |
| Circuit breaker | Sustained outage; fail fast |
| Batching | Overhead and rate limits |
| Caching | Repeated identical work/cost |

## Common misconceptions

- **"Retry immediately and often."** That worsens an overloaded provider; use backoff, jitter, and a cap.
- **"One provider is enough."** A single dependency is a single point of failure; have a fallback for critical paths.
- **"Retries are always safe."** Only if the operation is idempotent; otherwise a retry can duplicate side effects.

## Typical interview questions

<details>
<summary>How do you keep a feature reliable when the model provider has issues?</summary>

Timeouts so calls don't hang; retries with exponential backoff and jitter for transient errors; a fallback provider or degraded mode; a circuit breaker to fail fast during an outage; and batching/caching to reduce load and cost. Retried writes are made idempotent so they don't duplicate side effects.

</details>

<details>
<summary>What's the risk of naive retries and how do you avoid it?</summary>

Two risks: aggressive immediate retries add load to a struggling provider (thundering herd), and retrying a non-idempotent operation can double a charge or message. Backoff with jitter and a cap fix the first; idempotency keys fix the second.

</details>

## Learn more

- Article: [Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) (Martin Fowler)
- Docs: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) (Claude docs; 429 handling, retry-after)
- Docs: [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing) (async, ~50% cheaper for non-urgent work)

## Related

- [Module 1 → Retries and Backoff](../../m1/06-reliability-scale/03-retries-and-backoff.md) (generic reliability building blocks)
- [API Versions, Rate Limits & Fallback Sources](../01-external-apis-mcp-and-connector-design/03-api-versions-rate-limits-and-fallback-sources.md)
- [Cost Model](./02-cost-model-tokens-model-choice-and-when-to-use-code.md)
