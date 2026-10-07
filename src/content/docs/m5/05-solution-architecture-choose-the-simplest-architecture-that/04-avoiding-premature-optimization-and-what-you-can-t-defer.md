---
title: Avoiding Premature Optimization (and What You Can't Defer)
row: M5-L5.4
---
**In one sentence:** Defer the engineering complexity that isn't needed yet, scale, caching, elaborate abstractions, but never defer the security and data baselines, because those are expensive or impossible to retrofit and cause real harm if skipped.

## What it is

**Premature optimization** is building for problems you don't have yet, optimizing for scale before you have users, adding caching before there's a cost problem, creating elaborate abstractions before you know the shape of the work. The discipline is to defer that complexity until it's justified by a real need. But there's a critical exception: some baselines **cannot** be deferred, security (auth, access control, secret handling) and data fundamentals (privacy, minimization, basic quality/validation). These are cheap to build in early and painful or impossible to retrofit, and skipping them causes real harm (a breach, leaked PII) rather than just a performance issue.

## Why an FDE needs this

Both directions are failure modes. Over-engineering for imagined scale wastes the scarce engagement time and adds complexity that slows delivery and debugging. But treating security and data protection as "later" optimizations is dangerous, retrofitting auth or privacy into a live system touching customer data is a nightmare, and a gap causes an incident. An FDE has to know which complexity to defer (most performance/scale work) and which baseline to never defer (security, data), so the solution is both lean and safe.

## Key concepts

- **Defer:** scale, caching, elaborate abstractions, and performance work until a real need appears.
- **Never defer:** security baselines (auth, access, secrets) and data fundamentals (privacy, validation).
- **YAGNI for complexity; not for safety:** "you aren't gonna need it" applies to optimization, not to security/data.
- **Retrofit cost:** security and privacy are cheap early, brutal to add to a live system.
- **Lean and safe:** simplicity everywhere except the non-negotiable baselines.

## Common misconceptions

- **"Build for scale from day one."** Premature scale work wastes time; defer it until real load justifies it.
- **"Add security once it's in production."** Retrofitting auth/privacy is painful and gaps cause incidents; build the baseline in early.
- **"Simplicity means skipping security too."** Simplicity applies to unnecessary complexity, not to the security and data baselines, which are mandatory.

## Typical interview questions

<details>
<summary>What complexity do you defer, and what do you never defer?</summary>

I defer premature optimization, scaling, caching, elaborate abstractions, and performance work until a real need justifies it. I never defer the security baseline (authentication, access control, secret handling) or data fundamentals (privacy, minimization, basic validation), because those are cheap to build in early, painful or impossible to retrofit, and cause real harm if skipped.

</details>

<details>
<summary>Why is skipping security different from skipping optimization?</summary>

Skipping optimization at worst costs performance you can add later when needed. Skipping the security or data baseline risks a breach or a privacy incident, real harm, and retrofitting auth or privacy into a live system handling customer data is enormously harder than building it in from the start. So optimization is deferrable; the security/data baseline is not.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) ("only add complexity when it demonstrably improves outcomes")
- Note: non-negotiables you can't defer — secrets, auth, input validation, logging.

## Related

- [Architecture Hypothesis, Assumptions & Tech Debt](./03-architecture-hypothesis-assumptions-risks-and-tech-debt.md)
- [PII/PHI Handling & Compliance Basics](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)
