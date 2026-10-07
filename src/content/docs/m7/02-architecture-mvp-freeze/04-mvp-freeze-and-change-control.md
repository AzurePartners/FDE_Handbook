---
title: MVP Freeze and Change Control
row: M7-L2.4
---
**In one sentence:** An MVP freeze locks the scope after architecture review, and change control is the small routine that decides what happens to every request that arrives afterward.

## What it is

Once the PRD, architecture map and build method table are reviewed, you freeze them. The freeze is a dated statement: "this is the MVP." After that, new ideas do not go straight into the build. Each goes through a change decision.

Shape Up calls the main tool scope hammering: when time runs short, you cut or reshape scope instead of extending the deadline ([Shape Up](https://basecamp.com/shapeup/3.5-chapter-14)). The time budget is fixed and scope is the flexible part.

For the Course Support Assistant, a typical late request is "can it also check a student's enrollment status?" That is not a clarification of the frozen scope. It needs an account system connection that was a non-goal.

## Why an FDE needs this

Customers mean well and keep adding. Each small yes costs time you do not have, and the demo suffers. A visible routine lets you say "not in this phase, here is how it gets considered" without sounding like you refuse.

## Key concepts

Classifying requests is covered in [Classifying New Requests](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md) (M5), and the full feedback loop in [Close the Loop](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md) (M5).

### What you produce

A freeze note and a change log.

Freeze note:

```
Frozen: <date>, after architecture review
Scope: MVP list from mini PRD (5 items)
Non-goals: account lookups, multi-language, voice
Method table version: v1
Change rule: all requests go through the change log
```

Change log, one row per request:

| Date | Request | Class | Effect on time, cost, risk | Decision |
|---|---|---|---|---|
| day 9 | Show enrollment status | future phase | needs account API, adds risk | future phase |
| day 10 | Fix wrong office hours text | clarification | no scope change | accepted |
| day 11 | Add a second FAQ source | change | small, one more document | accepted, drop nice-to-have X |

### Pass bar

- The freeze is dated and tied to a reviewed architecture, not to a feeling.
- Every post-freeze request appears in the log with a class and a decision.
- Accepted changes name what was traded away or what time was added and who agreed.
- The frozen MVP is still testable against its original acceptance criteria.
- Rejected requests are kept as a future phase list, so nothing is lost.

## Common misconceptions

- **"Freezing means the customer cannot change anything."** It means changes are priced and decided, not absorbed silently.
- **"Every request is a change."** Many are clarifications of existing scope, and accepting those is cheap and correct.
- **"I can always add one more small thing."** Small things add up, and each needs testing.

## Typical interview questions

<details>
<summary>How did you handle new requests after you froze scope?</summary>

I logged each one and classified it as a clarification, a change, or a future phase. For a change I stated the time, cost and risk effect, and either traded something out or deferred. The enrollment lookup went to a future phase because it needed an account API.

</details>

<details>
<summary>What is scope hammering?</summary>

When time is tight, you cut or reshape scope instead of extending the deadline. It keeps the delivery date honest and forces a ranking of what matters.

</details>

<details>
<summary>What if the customer insists on a late feature?</summary>

I explain the effect in time and risk, offer to swap it for a lower-value item, or place it first in the next phase. The decision stays with the sponsor, but with the cost visible.

</details>

## Learn more

- Book chapter: [Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14) (Shape Up, Basecamp, free online), on scope hammering.

## Related

- [Mini PRD and Risk Register](./01-mini-prd-and-risk-register.md)
- [Configure, Skill or Code](./03-configure-skill-or-code.md)
- [Classifying New Requests](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md) (M5)
- [Close the Loop](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md) (M5)
