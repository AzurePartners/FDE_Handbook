---
title: Run Log and Failure Triage
row: M7-L3.3
---
**In one sentence:** A run log records what the system did at each step of each test run, and triage means fixing the failures that block the real workflow before anything else.

## What it is

Each time you run the alpha, write down the input, the intermediate outputs (what was retrieved, which tool was called, what the model returned), the final output, and whether it worked. When a run fails, you can then see where it went wrong instead of guessing.

A trace is the automatic version of this: a record of the steps inside one run. What traces contain is covered in [Agent Traces](../../m3/18-agent-evaluation-debugging/02-agent-traces.md) (M3). The OpenTelemetry primer explains the same idea for ordinary software. For an alpha, a simple log file or table is enough.

## Why an FDE needs this

Without a log, you fix the last thing you saw. A support assistant that answers a refund question wrongly could have retrieved the wrong paragraph, ignored the right one, or been given an outdated file. These need different fixes. Logs also give the client proof of what you tried, which matters when a stakeholder asks why something is still broken.

## Key concepts

Triage is ordering. A failure that stops the happy path (the app crashes, retrieval returns nothing) outranks a failure that makes an answer slightly clumsy. Fix blockers first, then wrong answers, then polish. Observability tooling for production is in [Logs, Metrics, Traces](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md) (M4); the alpha needs only the minimum that explains each failure.

### What you produce

A run log with one row per run:

| Run | Input | Retrieved source | Model output (short) | Result | Failure note | Severity |
|---|---|---|---|---|---|---|
| 007 | "Refund window for Data Analysis Bootcamp?" | refund-policy.pdf, section 2 | "14 days from start date" | Pass | none | none |
| 008 | "Can I defer my place?" | (nothing retrieved) | "I do not know" | Fail | Deferral policy not loaded | Blocker |
| 009 | "Is the Python course still running?" | old-catalog.pdf | "Yes, enrolling now" | Fail | Stale catalog used | Wrong answer |
| 010 | "What is the transfer policy?" | transfer-policy.pdf (scanned, no text) | "I do not know" | Fail | Scanned PDF not parsed | Wrong answer |

Severity levels: Blocker (stops the path), Wrong answer, Polish.

### Pass bar

- Every test run has a row, including passes.
- Each failure row names the step where it broke, backed by the logged intermediate output.
- No open Blocker remains when you declare alpha.
- Fixes are recorded with the run number that confirmed them.

## Common misconceptions

- **"Logging only the final answer is enough."** The final answer cannot tell you which step failed. Record intermediate outputs.
- **"Fix the most interesting failure first."** Fix whatever blocks the real workflow. Interesting edge cases wait.
- **"I need a tracing platform before alpha."** A text file or spreadsheet that meets the pass bar is fine. Add tooling when volume demands it.

## Typical interview questions

<details>
<summary>How did you decide which failure to fix first?</summary>

I ranked by whether it blocked the workflow. The missing deferral policy stopped a whole question type, so it came before the stale catalog answer, which came before wording issues.

</details>

<details>
<summary>What did you record for each run, and why?</summary>

Input, retrieved sources, model output, result and a failure note. Intermediate outputs let me say which step failed instead of blaming the model.

</details>

<details>
<summary>How is a run log different from a trace?</summary>

A trace is the automatic step-by-step record of one run. A run log is my table across many runs. In an alpha the log can be filled from trace output or by hand.

</details>

## Learn more

- Article: [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) (OpenTelemetry docs, about 10 minutes).

## Related

- [Reproducible Setup](./02-reproducible-setup.md)
- [Alpha Pass Condition](./04-alpha-pass-condition.md)
- [Failure Attribution Report](../04-evaluation-hardening/02-failure-attribution-report.md)
- [Agent Traces](../../m3/18-agent-evaluation-debugging/02-agent-traces.md) (M3)
