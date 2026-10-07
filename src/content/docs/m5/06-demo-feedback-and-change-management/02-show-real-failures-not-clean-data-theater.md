---
title: Show Real Failures, Not Clean-Data Theater
row: M5-L6.2
---
**In one sentence:** In demos and reviews, show the system's real failures, limitations, and next steps rather than a curated happy path on clean data, because honest failure-showing builds trust and surfaces problems early, while "clean-data theater" hides risk until production.

## What it is

**Clean-data theater** is the temptation to demo only the cases that work, on curated data, so the system looks flawless. **Showing real failures** is the opposite discipline: demo on realistic data, include the cases where it struggles, and be explicit about current limitations and what you'll do next. This connects to evaluation evidence, a demo is one run; honest delivery shows how it performs across cases, including failures. The goal is that the customer's understanding of the system matches reality, not a staged version of it.

## Why an FDE needs this

A flawless demo on clean data sets expectations the real system won't meet, and when it fails on real inputs in production, trust collapses. Showing failures honestly does the reverse: it's more credible, it surfaces problems while they're cheap to address, and it lets you and the customer decide together how to handle the weak cases (guardrail, exclude, accept). An FDE who shows real limitations is trusted; one who does clean-data theater is setting up a future disappointment.

## Key concepts

- **Realistic data in demos:** show it on data like production, not curated samples.
- **Show the failures:** include cases it struggles with; name current limitations.
- **State next steps:** what you'll do about the gaps.
- **Trust through honesty:** matching expectations to reality is what builds credibility.
- **Ties to acceptance/evaluation:** evidence across cases, not one happy run.

## Common misconceptions

- **"Show only what works, to build confidence."** A flawless demo on clean data sets expectations reality breaks; honesty builds durable trust.
- **"Failures make us look bad."** Hiding them and having them surface in production looks far worse; naming them shows control.
- **"The demo is the proof it's ready."** A demo is one run; readiness needs evidence across cases including failures.

## Typical interview questions

<details>
<summary>Why show failures in a demo instead of a polished happy path?</summary>

Because a flawless demo on clean data sets expectations the real system won't meet, and when it fails on real inputs later, trust collapses. Showing realistic data, the cases it struggles with, and current limitations is more credible, surfaces problems early while they're cheap, and lets us decide together how to handle the weak cases. Honesty builds durable trust; clean-data theater borrows against it.

</details>

<details>
<summary>What's the risk of clean-data theater?</summary>

It creates a gap between the customer's belief and the system's real behavior. That gap gets discovered in production, on real data, at the worst time, destroying trust and often triggering emergency rework. Showing reality up front trades a little demo polish for accurate expectations and a safe deployment.

</details>

## Learn more

- Article: [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) (show real traces & failure categories)

## Related

- [Measurable Acceptance Criteria](../04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md)
- [Demo-Driven Development](./01-demo-driven-development.md)
