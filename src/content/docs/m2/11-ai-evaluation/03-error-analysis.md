---
title: Error Analysis and Failure Case Documentation
row: M2-L5.3
---
**In one sentence:** Error analysis means reading a sample of an AI feature's real outputs, noting what went wrong in each failure, and grouping and counting those notes to decide what to fix first.

## What it is

Before scoring an AI feature, find out how it actually fails. Error analysis is that step, done by hand: read real outputs, note each failure, then group and count the notes.

A teacher grading 30 essays writes a margin note on each, then sees that 12 say "no evidence for the claim." She reteaches that one skill, not the whole unit.

Andrew Ng's *Machine Learning Yearning* describes hand-reviewing about 100 errors and counting each category's share. That share is a ceiling: fixing a type behind 5% of errors removes at most 5%. Hamel Husain and Shreya Shankar call error analysis the most important activity in LLM evals, because it decides which evals to write.

## Why an FDE needs this

An insurer's claims assistant has been live a month. The claims director says "agents tell me it's bad" and wants a bigger model. The FDE instead reads 100 random, redacted conversations with a senior claims handler, who decides what counts as a failure. The largest group is answers quoted from a superseded policy document, a data freshness problem no bigger model would fix. Missed injury escalations are rarer but riskiest, so they are fixed first too. The client gets failure types with counts instead of an opinion.

## Key concepts

### Reading and noting (open coding)

Open coding, a qualitative research term, means a free-text note per case, with no fixed category list. Practitioners suggest reviewing about 100 traces (a trace is the full record of one request: input, retrieved context, tool calls, output). Mark each pass or fail and note the **first** thing that went wrong, since later errors often follow from it. Write observations ("quoted the 2023 deductible table"), not guesses ("the model got confused").

### Grouping into failure types (axial coding)

Axial coding, done after 30 to 50 notes, groups them into about 5 to 10 named categories that are distinct, clear enough for someone else to apply, and each pointing toward a fix. Use application-specific names ("missed injury escalation"), with general modes such as hallucination or format drift beneath them. Stop when new traces stop revealing new types, a point called theoretical saturation. An LLM can propose groupings after a person writes the first notes, but review them: it clusters by surface wording.

### Counting and choosing what to fix

| Failure type (illustrative) | Count (of 100) | Likely layer |
|---|---|---|
| Answered from superseded policy | 14 | Retrieval data |
| Date sent as `03/04`, not `2026-04-03` | 4 | Validation code |
| Missed injury escalation | 2 | Routing rule |

Take counts from a random sample: thumbs-down conversations reveal types but overstate how often they happen. Weigh frequency against impact, and ask "can we just fix it?" before building any automated check.

### The failure case record

```text
Case FC-017 (random log sample, trace 8f3a2c)
Input: "What's my deductible for water damage?"
Actual: "$500" (2023 table)
Expected: $1,000 per the 2026 policy, source cited
Category: answered from superseded policy
Suspected cause (hypothesis): old policy PDF still indexed
Status: fixed; now eval case EV-112
```

Each record becomes an eval case, so every later change is checked against it. Recurring categories feed the documented known limitations.

## Common misconceptions

- **"We know how it fails, so we can list the categories up front."** Brainstormed lists miss failures specific to your data; people refine criteria while grading (Shankar et al., 2024).
- **"Error analysis means running a hallucination score over the logs."** Generic scores do not say what to fix; named failure types do.
- **"Fix the failure the executive saw in the demo."** The most memorable failure is rarely the most common or costly.
- **"It is a one-time step before launch."** Every prompt, model or data change can create new failure types.

## Typical interview questions

<details>
<summary>What is error analysis, and why do it before choosing metrics?</summary>

It is reading real outputs, noting failures, then grouping and counting the notes as named failure types. It shows which failures actually happen, so you measure those, not generic qualities.

</details>

<details>
<summary>What is the difference between open coding and axial coding?</summary>

Open coding is a free-text observation per failing case, with no fixed list. Axial coding groups those notes into a few distinct, named, actionable categories, then relabels and counts every case.

</details>

<details>
<summary>A client calls their assistant bad and wants a bigger model. What do you do first?</summary>

Review about 100 random, redacted conversations with their domain expert, noting the first failure in each. Group, count and check the top causes: often stale data or a tool bug a model swap would not fix.

</details>

<details>
<summary>Your analysis says 40% of failures are "hallucinated policy details." How do you check that?</summary>

Open full traces to see what the model was given. If the right policy was never retrieved, it is a data problem. Confirm cases with the expert, since expected answers can be wrong.

</details>

## Learn more

- Article: [Q: Why is "error analysis" so important in AI evals, and how is it performed?](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html) (hamel.dev, about 10 min)
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, about 30 min)

## Related

- [Reproduce, Narrow, Minimize](../../m1/04-git-debugging-testing-security/06-reproduce-narrow-minimize.md)
- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](./02-evaluation-sets.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](./04-core-metrics.md)
- [Documenting Known Limitations](../12-safety-guardrails-hitl/09-known-limitations.md)
