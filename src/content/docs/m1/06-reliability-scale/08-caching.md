---
title: Caching
row: M1-L6.4
---
**In one sentence:** A cache is a copy of data kept somewhere fast to reach, so the app does not redo slow work every time the same data is needed again.

## What it is

Fetching data is often slow relative to reading a value already in memory. Calling an outside weather API takes real network time. The same request often repeats, many users asking for the weather in one city, so redoing that slow work every time wastes time and money, since the answer barely changes minute to minute.

A cache stores the result the first time, then serves the stored copy for later requests. A cache hit means the answer came from the cache. A cache miss means it was not there yet, so the app does the slow work once and stores it.

Caching happens at several layers: the browser caches images and some API responses, a CDN caches static files close to users, the app server can cache computed results in memory, and a shared cache like Redis stores data outside any single server so multiple servers can share it.

## Why an FDE needs this

Outside API calls are usually the slowest, most fragile part of a client's app, and also the most cacheable: an exchange rate does not need fetching fresh on every request. Caching them speeds up the app and protects it from rate limits and outages on the provider's side. Skipping caching is fine with light traffic. Under real load, the same uncached call multiplied by thousands of users can hit a rate limit or run up a bill. The harder skill is being honest that cached data can be a little out of date.

## Key concepts

```python
import time
_cache = {}

def get_exchange_rate(base, target, ttl_seconds=3600):
    key = (base, target)
    cached = _cache.get(key)
    if cached and time.time() - cached["time"] < ttl_seconds:
        return cached["value"]                   # cache hit
    value = call_exchange_rate_api(base, target)  # cache miss
    _cache[key] = {"value": value, "time": time.time()}
    return value
```

**TTL**, time to live, is how long a cached value is kept before it is refreshed. A short TTL keeps data fresher; a long TTL is cheaper but risks serving stale data longer.

**Cache invalidation** means removing or updating a cached value before its TTL expires, because the underlying data changed. If a user edits a record and the app has a cached copy, that cache needs invalidating, or the user sees their own edit disappear. It is easy to miss a code path that changes data without clearing the matching entry.

**The stale data trade-off**: every cache bets slightly out-of-date data is an acceptable price for speed. That bet is reasonable for a weather forecast, less for an account balance.

| Layer | Caches | Typical TTL |
|---|---|---|
| Browser | Images, scripts, some API responses | Minutes to days |
| CDN | Static files | Minutes to hours |
| App server (in-memory) | Computed results, small lookups | Seconds to minutes |
| Redis or similar | Anything multiple servers must share | Seconds to hours |

## Common misconceptions

- **"Caching always means faster and better."** It means faster and cheaper, but also possibly stale, fine only if the staleness is acceptable for that data.
- **"A cache miss is a bug."** A miss is normal, especially right after the cache clears. Only an unexpectedly high miss rate suggests a problem.
- **"Invalidation happens automatically."** It does not, unless the code that changes the data also clears or updates the matching cache entry.

## Typical interview questions

<details>
<summary>What is the difference between a cache hit and a cache miss?</summary>

A hit means the data was already in the cache and got served immediately. A miss means it was not, so the app did the underlying slow work and stored the result.

</details>

<details>
<summary>What is cache invalidation and why is it considered hard?</summary>

Removing or refreshing a cached value when the underlying data changes. It is hard because every code path that changes the data must also clear the matching cache entry, and it is easy to miss one.

</details>

<details>
<summary>A dashboard shows old numbers after a client made a change. What would you check first?</summary>

Whether the dashboard reads from a cache, its TTL, and whether the write path that made the change also invalidates that entry. If the TTL has not expired and nothing cleared it, the fix is adding invalidation on the write path.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, caching section).
- Reference: [system-design-101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo, GitHub).

## Related

- [Race Conditions](./06-race-conditions.md)
- [Load Balancing and Horizontal Scaling](./09-load-balancing-and-horizontal-scaling.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
- Goes deeper in Module 4: [Reliability: Timeouts, Retries, Fallbacks, Circuit Breakers, Batching & Caching](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
- Goes deeper in Module 4: [Cost Model: Tokens, Model Choice & When to Use Code](../../m4/04-reliability-cost-latency-and-scale/02-cost-model-tokens-model-choice-and-when-to-use-code.md)
