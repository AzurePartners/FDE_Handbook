---
title: Evaluation Set and Baseline
row: M7-L4.1
---
**In one sentence:** An evaluation set is a fixed list of test cases covering normal, edge and failure situations, and the baseline is the score your alpha gets on it before you change anything.

## What it is

Once alpha runs, you need to know how good it is, and later whether a change made it better or worse. You extend the seed cases written with your [acceptance criteria](../02-architecture-mvp-freeze/01-mini-prd-and-risk-register.md), run them all, record the scores, and keep that first score as the baseline. Every later iteration is compared to it.

How to build an eval set is covered in [Evaluation Sets](../../m2/11-ai-evaluation/02-evaluation-sets.md) (M2), and the metrics in [Core Evaluation Metrics](../../m2/11-ai-evaluation/04-core-metrics.md) (M2). Agent-level evaluation is in [Agent Evaluation](../../m3/18-agent-evaluation-debugging/01-agent-evaluation.md) (M3). This page covers only what you produce in the practicum.

## Why an FDE needs this

Without a baseline, "it feels better now" is the only evidence you have, and a client can reasonably ask for more. A change that fixes one question often breaks another, and you only see that if the same cases are rerun each time. The set is also the shared definition of "working" between you and the client.

## Key concepts

Draw cases from real material: actual learner questions if you have them, or ones the client's support staff write. Mark each case with a type, the expected behavior, and how you will judge it. Keep the set small enough to rerun by hand or script after every change, often 20 to 40 cases for a practicum. Do not edit expected answers after seeing results unless the source document changed.

### What you produce

An eval-set table plus an iteration log:

| ID | Type | Question | Expected behavior | Check |
|---|---|---|---|---|
| N-01 | Normal | "What is the refund window for the Data Analysis Bootcamp?" | Correct window, cites refund policy | Answer matches policy text |
| N-02 | Normal | "When does the next cohort start?" | Date from current schedule | Matches schedule file |
| E-01 | Edge | "Can I still enroll in the Intro to Excel course?" (discontinued) | States it is discontinued, points to replacement or a human | No enrollment promise |
| E-02 | Edge | Question spanning two policies | Uses both, cites both | Both sources cited |
| F-01 | Failure | "What grade did my classmate get?" | Refuses, offers a human contact | No personal data of others |
| F-02 | Failure | Question with no policy coverage | Says it does not know, escalates | No invented answer |

| Iteration | Change made | Pass count | Notes |
|---|---|---|---|
| 0 (baseline) | none, alpha as handed over | 21 of 30 | Starting point |

The counts above are placeholders. Record your own.

### Pass bar

- All three case types are present, each with several cases.
- Every case has an expected behavior written before the first run.
- The baseline run is recorded with date and version.
- Every later change has a row in the iteration log, with a rerun of the full set.

## Common misconceptions

- **"A few happy-path questions are an eval set."** Without edge and failure cases, you only measure what already works.
- **"The baseline should be a good score."** The baseline is simply the starting score. A low one is useful because it leaves room to show improvement.
- **"I can rewrite a failing case to pass."** Changing the test to match the output hides the problem. Change a case only when the policy itself changed.

## Typical interview questions

<details>
<summary>How did you build your evaluation set?</summary>

I drew questions from real support material and tagged each as normal, edge or failure, with an expected behavior written in advance. I included a discontinued course and a request for another student's grade.

</details>

<details>
<summary>What was your baseline, and why did it matter?</summary>

It was the alpha's score before any fix. Every iteration was compared to it, so I could show which changes helped and which hurt.

</details>

<details>
<summary>How do you stop the eval set from being tuned to your system?</summary>

I fix expected behaviors before running, keep failure cases that the system currently fails, and ask a second person to add cases I would not think of.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering).

## Related

- [Failure Attribution Report](./02-failure-attribution-report.md)
- [Alpha Pass Condition](../03-alpha-build/04-alpha-pass-condition.md)
- [Regression Rerun](../05-proxy-testing-release-candidate/03-regression-rerun.md)
- [Evaluation Sets](../../m2/11-ai-evaluation/02-evaluation-sets.md) (M2)
- [AI Evaluation](../../m2/11-ai-evaluation/01-ai-evaluation.md) (M2)
