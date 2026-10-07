---
title: Go / No-Go Decision
row: M7-L1.4
---
**In one sentence:** The go or no-go decision is the checkpoint where you read your validation evidence and choose one of four paths: proceed, scope down, change projects, or run a validation experiment first.

## What it is

Validation produces evidence. This step turns it into a decision recorded in writing, so the choice is deliberate and the reviewer can see your reasoning.

Four outcomes are allowed:

| Decision | Use when |
|---|---|
| Proceed | All four checks hold and risks are acceptable |
| Scope down | The problem is real but the full version does not fit time or data |
| Change project | A check fails and cannot be fixed (no data, no users) |
| Experiment first | A key verdict is unsure and a cheap test can settle it |

Picking an approach is covered in [The Architecture Decision Tree](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md) (M5), and scope shape in [Scope: Problem, Users, MVP, Must/Nice-to-Have, Non-Goals](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/01-scope-problem-users-mvp-must-nice-to-have-non-goals.md) (M5).

## Why an FDE needs this

Saying "no" or "not yet" early is a core FDE skill. A customer who hears it in week one loses nothing. A customer who hears it after a failed demo loses trust. For the Course Support Assistant, a scope down might be: answer FAQ and policy questions only, leave account lookups out.

## Key concepts

### What you produce

A one-page Decision Record:

```
Decision: scope down
Evidence: Validation Note, section 2
Reason: policy and FAQ answers are solvable; account lookups need
        an API we cannot access in the time available
Conditions: finance coordinator confirms refund rules by day 5
Reviewer: <name>, date
```

### Pass bar

- One of the four decisions is stated clearly.
- The reason points to specific evidence from the Validation Note.
- Any condition has an owner and a date.
- If scoping down, the cut items are listed so they carry into non-goals later.
- If changing projects, the new choice goes back through [Project Selection](./01-project-selection.md).

## Common misconceptions

- **"A no-go means I failed."** A well-argued no-go or change of project is a pass of this step. Building the wrong thing is the failure.
- **"Scope down means do less polish."** It means do fewer problems. The remaining problem still needs a finished, tested path.

## Typical interview questions

<details>
<summary>Tell me about a decision to cut or change scope.</summary>

After validation, I found the policy and FAQ answers were solvable but account lookups needed an API I could not access. I chose to scope down, listed lookups as a non-goal, and recorded the decision with a condition on getting confirmed refund rules.

</details>

<details>
<summary>When would you run an experiment instead of deciding?</summary>

When one verdict is unsure and a cheap test can settle it, such as running ten real questions against a policy document. I set the test, an owner and a deadline, then decide with the result.

</details>

## Learn more

- Book chapter: [The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08) (Shape Up, Basecamp, free online), on betting and the circuit breaker.

## Related

- [Project Validation](./03-project-validation.md)
- [Mini PRD and Risk Register](../02-architecture-mvp-freeze/01-mini-prd-and-risk-register.md)
- [The Architecture Decision Tree](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md) (M5)
