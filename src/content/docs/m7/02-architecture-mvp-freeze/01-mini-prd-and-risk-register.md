---
title: Mini PRD and Risk Register
row: M7-L2.1
---
**In one sentence:** The mini PRD is a two-page statement of what you will build and how you will know it works, and the risk register lists what could stop you, each with an owner and a response.

## What it is

After a go decision you convert discovery into a plan the customer and reviewer can sign. The mini PRD (product requirements document) holds the to-be workflow, the MVP scope, acceptance criteria and non-goals. The risk register sits beside it.

For the Course Support Assistant, the to-be workflow is: a student asks a question, the assistant answers from approved course documents with a source, and anything uncertain goes to a human agent. The full-size version is in the [PRD: Course Support Assistant](../../m6/01-education-rag/02-prd.md) (M6). Yours is shorter and specific to your customer.

## Why an FDE needs this

Without written acceptance criteria, "done" is whatever the loudest stakeholder says at the demo. Without non-goals, every request becomes scope. Without a risk register, the one risk that kills the project (for example, stale refund policy) is found by the customer.

## Key concepts

Scope, PRD versus SOW, acceptance criteria and as-is versus to-be are taught in [Scope](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/01-scope-problem-users-mvp-must-nice-to-have-non-goals.md), [PRD vs SOW](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/02-prd-vs-sow.md), [Measurable Acceptance Criteria](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md), [As-Is vs To-Be](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/04-as-is-vs-to-be-documenting-the-process-change.md) and [Architecture Hypothesis: Assumptions, Risks & Tech Debt](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/03-architecture-hypothesis-assumptions-risks-and-tech-debt.md) (all M5).

### What you produce

Mini PRD skeleton:

```
1. Problem (from the approved brief, one sentence)
2. Users and to-be workflow (5 to 8 steps)
3. MVP scope (must have, max 5 items)
4. Non-goals (at least 3, named explicitly)
5. Acceptance criteria (measurable, each with a test)
6. Open questions and dependencies
```

Risk register:

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Refund policy documents conflict | high | high | Ask finance for the single source; cite document and date in answers | me |
| Assistant invents an answer | medium | high | Answer only from retrieved text; fall back to human handoff | me |
| Student data appears in tickets | medium | high | Strip names before indexing | support lead |

Turn each acceptance criterion into two or three seed eval cases now; [Evaluation Set and Baseline](../04-evaluation-hardening/01-evaluation-set-and-baseline.md) extends this seed set after Alpha.

Record major technical choices as short ADRs (architecture decision records: one page with context, decision and consequences). The [ADR site](https://adr.github.io/) has templates.

### Pass bar

- Every acceptance criterion is measurable and testable, such as "at least 8 of 10 test questions answered correctly with a cited source."
- Each acceptance criterion has two or three seed eval cases.
- At least three non-goals are written, and none contradicts the MVP list.
- The to-be workflow shows where a human steps in.
- Each risk has an owner and a concrete mitigation, not "be careful."
- The customer or reviewer has signed it, and the version is dated.

## Common misconceptions

- **"A PRD is a long document."** For the practicum it is two pages. Length hides unclear thinking.
- **"Non-goals are things I will do later."** Non-goals are things you will not do in this delivery. Later work goes in a future phase list.
- **"Risks are only technical."** Data access, ownership and customer availability usually sink projects before the model does.

## Typical interview questions

<details>
<summary>What did you cut from the MVP and why?</summary>

I cut account lookups and multi-language answers. Lookups needed an API I could not reach in the time available, and the customer's questions were mostly English policy and schedule queries. I wrote both as non-goals so later requests had a clear route.

</details>

<details>
<summary>How did you write acceptance criteria?</summary>

Each one named a number and a test. For example, at least 8 of 10 test questions must be answered correctly with a cited source, and every out-of-scope question must hand off to a human. A reviewer can check both.

</details>

<details>
<summary>What was your biggest risk and how did you handle it?</summary>

Conflicting refund documents. The mitigation was to get one source of truth from finance and to show document name and date in each answer, so staleness is visible.

</details>

## Learn more

- Article: [Architecture Decision Records](https://adr.github.io/) (ADR GitHub organization, templates and examples).

## Related

- [Go / No-Go Decision](../01-practicum-kickoff/04-go-no-go-decision.md)
- [Solution Architecture Map](./02-solution-architecture-map.md)
- [MVP Freeze and Change Control](./04-mvp-freeze-and-change-control.md)
- [Measurable Acceptance Criteria](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md) (M5)
