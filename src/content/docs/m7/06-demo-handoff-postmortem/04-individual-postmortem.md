---
title: Individual Postmortem
row: M7-L6.4
---
**In one sentence:** An individual postmortem is your own written review of the project: what failed, why, what you would change, and which parts you can reuse for the next customer.

## What it is

When the Course Support Assistant is delivered, you sit down and write what actually happened. Not a victory summary and not a confession. A factual account with causes, aimed at making the next project better.

The method is covered in [Postmortem](../../m5/07-pilot-value-handoff-and-productization/06-postmortem.md) and separating reusable parts in [Separating Customer-Specific Logic from Reusable Assets](../../m5/07-pilot-value-handoff-and-productization/07-separating-customer-specific-logic-from-reusable-assets.md) (M5). This page is the outline you submit. The blameless tone comes from the Google SRE chapter below: focus on systems and decisions, not on fault.

## Why an FDE needs this

Without a written review, the same mistakes repeat on the next client, and the lessons stay in your head. Reusable assets, such as an eval set template or a feedback log, stay buried in a customer folder. Writing it down is how experience becomes a practice.

## Key concepts

### What you produce

A postmortem of about two pages in this order.

```
1. Summary: what was built, for whom, result in three sentences.
2. Timeline: key dates (discovery, freeze, alpha, RC, demo) and what slipped.
3. What went well: two or three items with evidence.
4. What failed: each with impact.
5. Why: root cause for each failure (data, scope, prompt, process, communication).
6. What I would change: one concrete action per failure.
7. Reusable assets: what moves to the next customer, what stays customer-specific.
8. Open items: unresolved issues and who owns them.
```

Example entry: "Failure: stale deadlines in answers. Impact: two coordinators got last term's date. Cause: document update was manual and untracked. Change: add a freshness date to each source and a weekly check. Reusable: the freshness check script."

### Pass bar

- Every failure has a cause that goes beyond "I ran out of time."
- Each cause links to evidence: a log entry, a feedback ID, or an eval case.
- Each change is a specific action you can start next time.
- The reusable list separates generic assets from customer data and logic.
- The tone is factual, with no blame on teammates or on the client.
- At least one failure is something you did, not only something that happened to you.

## Common misconceptions

- **"A postmortem is for disasters."** It is for any project. Small misses show patterns.
- **"Blameless means no one is accountable."** It means you examine decisions and conditions. You still own your actions.
- **"Reusable means copy the whole project."** Reuse the pattern, such as the eval structure, and strip customer-specific content. Client data never goes in the reusable list.
- **"Listing what went wrong is enough."** "The demo was rushed" is a symptom and "communicate more" cannot be acted on. Name causes and concrete changes, and include failures, not only successes.

## Typical interview questions

<details>
<summary>What would you do differently?</summary>

Pick the most expensive mistake, state its cause, and give one concrete change. Example: I waited until proxy testing to chase the finance coordinator for the deferral policy, so a whole question type failed late. Next time I close every open data dependency before the MVP freeze.

</details>

<details>
<summary>What failed in your project, and why?</summary>

Name a real failure, give the evidence, and trace it to a root cause such as a missing requirement, bad data, or an untested assumption. Avoid blaming the model without evidence.

</details>

<details>
<summary>Which parts would you reuse for the next customer?</summary>

Templates and patterns: the task sheet, feedback log, eval structure, handoff checklist. Not the customer data, policies, or prompt wording tied to their domain.

</details>

## Learn more

- Article: [Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/) (Google SRE Book, about 15 min).

## Related

- [Handoff Package Submission](./03-handoff-package-submission.md)
- [Known Limitations and Fix List](../04-evaluation-hardening/04-known-limitations-and-fix-list.md)
- [Postmortem](../../m5/07-pilot-value-handoff-and-productization/06-postmortem.md)
- [Separating Customer-Specific Logic from Reusable Assets](../../m5/07-pilot-value-handoff-and-productization/07-separating-customer-specific-logic-from-reusable-assets.md)
