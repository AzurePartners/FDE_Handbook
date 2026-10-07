---
title: Targeted Hardening
row: M7-L4.3
---
**In one sentence:** Targeted hardening means adding a protection, such as a guardrail, fallback or retry, only where an observed failure or a named risk calls for it.

## What it is

Hardening makes a system safer and more dependable. Targeted means each control answers a specific problem. [Avoiding Premature Optimization](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md) (M5) warns against optimization unrelated to current risks: adding caching, multi-model routing or elaborate monitoring because they sound professional, while the real failures sit untouched.

The rule on this page is simple. Every control you add must point to a row in your failure attribution report or to a named risk in your risk register. If it points to neither, do not build it yet. The reasoning behind deferring work is in [Avoiding Premature Optimization](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md) (M5).

## Why an FDE needs this

Time at a client is limited. Spending three days on retry logic for a service that never failed, while the assistant still reveals other learners' grades, is the wrong trade. Targeted hardening also keeps the system understandable for the client who inherits it, because each control has a written reason.

## Key concepts

Typical controls and the concept pages that explain them: guardrails in [Input and Output Guardrails](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md) (M2), fallbacks in [Refusals and Fallbacks](../../m2/12-safety-guardrails-hitl/07-refusals-and-fallbacks.md) (M2), retries in [Reliability](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md) (M4), freshness in [Freshness Gates](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/02-freshness-gates-provenance-and-data-lineage.md) (M4), human review in [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md) (M2), and logging in [Logs, Metrics, Traces](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md) (M4). After each control, rerun the eval set to confirm the failure is fixed and nothing else broke.

### What you produce

A hardening ledger:

| Control | Triggered by | Where it applies | Check after adding | Result |
|---|---|---|---|---|
| Learner-facing index excludes raw tickets | F-01, Permission failure | Retrieval index | F-01 now refuses | Pass |
| "No source, no answer" rule with human escalation | F-02, Rule failure | Answer step | F-02 now escalates | Pass |
| Freshness date on catalog, stale file blocked | E-01, Data failure | Retrieval filter | E-01 mentions discontinued | Pass |
| Retry on model timeout | Observed timeouts, runs 011 and 019 | Model call | No timeout failures in rerun | Pass |
| Response caching | none | none | not built | Deferred |

The last row is the point: write down what you considered and skipped, with the reason.

### Pass bar

- Every control has a triggering case or named risk in the "Triggered by" column.
- Each control has a check, and the eval set was rerun afterward.
- Deferred ideas are listed with their reason.
- No control weakens a previously passing case.

## Common misconceptions

- **"More guardrails always means safer."** Extra controls add complexity and can block valid questions. Each one needs a reason.
- **"Hardening is a final polish step."** It starts from the failure report. Without that evidence, you are guessing.
- **"Skipping a control is negligence."** Skipping one with a written reason and a low risk is a decision. Skipping silently is the problem.

## Typical interview questions

<details>
<summary>What did you harden, and how did you decide?</summary>

I only added controls tied to failures in my attribution report: removing raw tickets from the learner-facing index, a no-source-no-answer rule, and a freshness filter. Each had a case that proved it worked.

</details>

<details>
<summary>What did you choose not to build?</summary>

Response caching and model routing. Nothing in my eval or logs showed latency or cost problems, so I logged them as deferred.

</details>

<details>
<summary>How do you avoid premature optimization during hardening?</summary>

I require each control to point to a failing case or named risk. If it cannot, it goes on the deferred list.

</details>

## Learn more

- Book chapter: [Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) (Google SRE Book), on retries, timeouts and graceful degradation.

## Related

- [Failure Attribution Report](./02-failure-attribution-report.md)
- [Known Limitations and Fix List](./04-known-limitations-and-fix-list.md)
- [Mini PRD and Risk Register](../02-architecture-mvp-freeze/01-mini-prd-and-risk-register.md)
- [Avoiding Premature Optimization](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/04-avoiding-premature-optimization-and-what-you-can-t-defer.md) (M5)
- [Input and Output Guardrails](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md) (M2)
