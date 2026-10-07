---
title: Regression Rerun
row: M7-L5.3
---
**In one sentence:** A regression rerun means running your critical evaluation cases again after fixes, to prove you did not break something that used to work.

## What it is

You fixed the stale-deadline bug from proxy testing. The fix changed how the Course Support Assistant picks documents. Did refund questions still get the right policy page? You do not guess. You rerun the cases that matter and compare to the baseline.

The concept is covered in [Regression Testing for Prompts, Models, Tools and Data](../../m2/11-ai-evaluation/08-regression-testing.md) (M2) and, for multi-step systems, [Replayable Tests for Agent Workflows](../../m3/18-agent-evaluation-debugging/06-replayable-tests.md) (M3). This page is the submission.

## Why an FDE needs this

Fixes in prompt-based systems have side effects. A prompt tweak that cures one failure can quietly worsen another. Finding that out at the client demo is expensive.

## Key concepts

### What you produce

A rerun table, one row per critical case, plus the list of fixes since the last run.

| Case ID | Type | Baseline | Before fixes | After fixes | Change |
|---|---|---|---|---|---|
| N-01 refund window | normal | pass | pass | pass | none |
| E-03 changed deadline | edge | fail | fail | pass | fixed |
| F-03 out-of-scope question | failure | pass | pass | fail | regression |

Add the changes made (prompt version, data refresh, config) and the date of the rerun.

### Pass bar

- All critical cases are rerun, not a sample you picked after seeing results.
- Every fixed case from the feedback log is in the set.
- Any regression is either fixed and rerun or listed as a known limitation.
- Same eval set, same settings, and recorded versions as the baseline.

## Common misconceptions

- **"I only need to rerun the case I fixed."** The point is the other cases. A fix can break neighbors.
- **"A model is nondeterministic, so rerunning proves nothing."** Variation means you compare patterns across the set, and rerun borderline cases more than once.

## Typical interview questions

<details>
<summary>A fix improved three cases and broke one. Do you ship?</summary>

Look at what broke. If it is a critical or safety case, no. Fix or revert, then rerun. If it is minor, document it as a known limitation and tell the client.

</details>

<details>
<summary>What goes in your regression set?</summary>

Cases tied to acceptance criteria, past failures, and refusals. Every bug you fix adds a case.

</details>

## Learn more

- Article: [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) (Hamel Husain, about 20 min).

## Related

- [Feedback Triage](./02-feedback-triage.md)
- [Release Candidate](./04-release-candidate.md)
- [Regression Testing for Prompts, Models, Tools and Data](../../m2/11-ai-evaluation/08-regression-testing.md)
