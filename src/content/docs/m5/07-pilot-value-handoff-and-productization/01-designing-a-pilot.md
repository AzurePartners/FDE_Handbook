---
title: Designing a Pilot
row: M5-L7.1
---
**In one sentence:** A pilot is a controlled rollout to real users doing real work, with a defined duration, success criteria, and a go/no-go decision at the end, so you learn how the solution performs in reality before committing to full production.

## What it is

A **pilot** puts the solution in front of **real users** in their **real workflow** for a defined **duration**, rather than launching to everyone. It has **success criteria** set up front (tied to the metrics from discovery), a way to measure and gather feedback, a limited blast radius so problems affect few and are reversible, and a **go/no-go decision** at the end, based on evidence, to expand, iterate, or stop. It's the rung between MVP and production on the maturity ladder (stage definitions live in [M4-L5.4](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md)).

## Why an FDE needs this

Real usage reveals what demos and evaluation can't: how actual users behave, what edge cases they hit, whether it fits the workflow, and whether it moves the metric. Launching straight to everyone bets the whole outcome, and the customer relationship, on assumptions. A well-designed pilot limits that risk and produces the evidence to justify (or stop) full rollout. An FDE runs the pilot as a deliberate learning phase with criteria and a decision, not a soft launch you hope goes fine.

## Key concepts

- **Real users, real workflow:** not a test group doing artificial tasks.
- **Defined duration:** long enough to learn, bounded so it doesn't drift.
- **Success criteria up front:** tied to discovery metrics; decided before, not after.
- **Limited blast radius:** few users, reversible; contain problems.
- **Go/no-go at the end:** evidence-based decision to expand, iterate, or stop.

## Common misconceptions

- **"We tested it, just launch to everyone."** Testing isn't real usage; a pilot limits risk and reveals real-world behavior first.
- **"A pilot is a soft launch you hope works."** It's a deliberate learning phase with real users, a duration, success criteria, and a decision.
- **"No complaints means it succeeded."** Success is measured against the agreed criteria and observed behavior, not the absence of complaints.

## Typical interview questions

<details>
<summary>How do you design a pilot?</summary>

Put the solution in front of real users in their real workflow for a defined duration, with success criteria set up front and tied to the discovery metrics, instrumentation and a feedback channel to measure what happens, and a limited, reversible blast radius. It ends in an evidence-based go/no-go decision to expand, iterate, or stop, rather than drifting into full rollout.

</details>

<details>
<summary>Why pilot instead of launching to all users?</summary>

Because real usage reveals behavior, edge cases, workflow fit, and whether it actually moves the metric, things testing and demos can't show, while a pilot contains the risk. It produces the evidence to justify or halt full rollout, instead of betting the whole outcome and the customer relationship on assumptions.

</details>

## Learn more

- Article: [Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/) (pre-AI baselines, go/no-go thresholds)
- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen)

## Related

- [Demo → MVP → Pilot → Production Ladder](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md)
- [Baseline, Success Metrics & Attribution](./02-baseline-success-metrics-north-star-and-attribution.md)
