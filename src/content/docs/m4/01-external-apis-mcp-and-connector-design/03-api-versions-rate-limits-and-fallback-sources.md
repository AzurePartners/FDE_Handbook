---
title: API Versions, Rate Limits & Fallback Sources
row: M4-L1.3
---
**In one sentence:** External APIs change versions, cap how often you can call them, and sometimes charge per call, so a durable integration pins versions, respects rate limits, and has fallback sources rather than hard-coding one vendor's current behavior into business logic.

## What it is

Every external dependency is a moving target. **Versions** change: an endpoint you rely on can be deprecated or altered, so you pin to a specific version and upgrade deliberately. **Rate limits** cap requests per unit time (the concept and the 429/backoff basics are in Module 1 — [Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md)); here the point is designing for them alongside version drift. Some tools are **paid**, so call volume is a cost. And any single source can fail or be wrong, so critical paths benefit from **fallback sources** (a secondary provider, a cache, a degraded mode). The overarching rule: don't bake one vendor's quirks and current capabilities into your core logic, wrap them so they can change.

## Why an FDE needs this

Integrations that assume the vendor never changes break in production when the vendor inevitably does. Hard-coding a provider's behavior into business logic makes swapping or upgrading painful and couples your reliability to theirs. An FDE designs for version drift, rate limits, and provider failure from the start, so an API change or outage is a config change or a fallback, not an outage of your feature.

## Key concepts

- **Pin versions; upgrade deliberately:** avoid "latest"; know when behavior changes.
- **Respect rate limits:** throttle, batch, back off on 429; don't hammer.
- **Cost-awareness:** paid tools mean call volume is spend; cache and minimize.
- **Fallback sources:** secondary provider, cache, or degraded mode for critical paths.
- **Don't hard-code vendor capabilities:** wrap providers behind your own interface (ties to the connector contract).

## Common misconceptions

- **"The API will always behave like it does today."** Versions deprecate and change; pin and plan upgrades.
- **"Rate limits won't hit us."** Under real load they will; design throttling and backoff up front.
- **"One provider is enough for a critical path."** Single sources fail; have a fallback or degraded mode.

## Typical interview questions

<details>
<summary>How do you make an integration resilient to a vendor changing their API?</summary>

Pin to a specific API version and upgrade deliberately, wrap the vendor behind your own connector interface so business logic doesn't depend on its quirks, respect rate limits with throttling and backoff, and have a fallback source or degraded mode for critical paths. Then a change or outage is a contained config/fallback event, not a feature outage.

</details>

<details>
<summary>What do you do when you start hitting a provider's rate limit?</summary>

Back off on 429s with exponential backoff and jitter, batch requests where possible, cache repeated results, and spread or queue load. If the limit is structural for the use case, request a higher tier or add a second source, rather than retrying aggressively and making it worse.

</details>

## Learn more

- Docs: [Rate limits](https://platform.claude.com/docs/en/api/rate-limits) (Claude docs; a concrete vendor-limit example)
- Article: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (wrap vendor APIs behind stable contracts)
- Article: [Circuit Breaker](https://martinfowler.com/bliki/CircuitBreaker.html) (Martin Fowler; fallback when a provider is down)

## Related

- [Module 1 → Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md) (the concept)
- [Reliability: Timeouts, Retries, Fallbacks & Caching](../04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
- [Designing a Minimal Connector Contract](./04-designing-a-minimal-connector-contract.md)
