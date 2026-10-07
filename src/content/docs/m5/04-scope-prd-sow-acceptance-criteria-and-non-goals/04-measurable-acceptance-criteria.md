---
title: Measurable Acceptance Criteria
row: M5-L4.4
---
**In one sentence:** Acceptance criteria define, in measurable terms, what proves a deliverable is done, its inputs, expected outputs, quality bar, latency, risk handling, and human-review requirements, so "done" is an objective test rather than an opinion.

## What it is

**Acceptance criteria** are the concrete, checkable conditions a deliverable must meet to be accepted. For an AI feature they cover: the **inputs** it must handle, the **expected outputs** for those inputs, the **quality** bar (accuracy/behavior across cases, including edge and failure), the **latency** it must meet, how it handles **risk** (errors, refusals, escalation), and where **human review** is required. Written well, they turn "is it done?" into a set of tests you can run, and they define what the customer is agreeing to accept (tying to the SOW).

## Why an FDE needs this

Without measurable acceptance criteria, "done" is subjective and disputes follow, the customer expected something you didn't build, or judges quality by a case you never targeted. Defining them up front gives you a target to build toward, the basis for evaluation evidence, and a clear, mutually-agreed finish line. They're also what protect you: meeting the agreed criteria is meeting the obligation.

## Key concepts

- **Inputs & expected outputs:** the concrete behavior to satisfy.
- **Quality bar:** performance across normal, edge, and failure cases (not just the happy path).
- **Latency:** the speed requirement, measurable.
- **Risk handling:** required behavior on errors, refusals, escalation.
- **Human review:** where a person must be in the loop for acceptance.
- **Testable:** each criterion is something you can objectively check.

## Common misconceptions

- **"'Works well' is acceptance criteria."** It must be measurable, specific inputs, outputs, quality, latency, and risk handling you can test.
- **"Acceptance is judged at the end."** Define it up front so you build toward it and can prove it; retrofitting invites disputes.
- **"Only the happy path matters."** Criteria should cover edge and failure cases and required human review, where real acceptance risk lives.

## Typical interview questions

<details>
<summary>What makes good acceptance criteria for an AI feature?</summary>

They're measurable and testable: the inputs it must handle, the expected outputs, the quality bar across normal/edge/failure cases, the latency requirement, how it must handle errors and risk, and where human review is required. That turns "done" into an objective test and defines exactly what the customer is agreeing to accept.

</details>

<details>
<summary>Why define acceptance criteria before building, not after?</summary>

Because they give a target to design and build toward, form the basis for evaluation evidence, and create a mutually agreed finish line. Defining them after invites disputes, the customer judges by expectations or cases you never targeted, whereas agreed criteria up front protect both sides and make acceptance objective.

</details>

## Learn more

- Docs: [Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success) (measurable, specific criteria for AI outputs)
- Article: [Demystifying evals](https://anthropic.com/engineering/demystifying-evals-for-ai-agents) (turn acceptance criteria into eval tasks)

## Related

- [PRD vs SOW](./02-prd-vs-sow.md)
- [Show Real Failures, Not Clean-Data Theater](../06-demo-feedback-and-change-management/02-show-real-failures-not-clean-data-theater.md)
