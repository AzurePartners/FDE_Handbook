---
title: Four FDE Responsibilities
row: M0-L1.3
---
**In one sentence:** A complete FDE owns a loop of four responsibilities (Discovery, Production, Adoption and Feedback): choosing the customer problem worth solving, making the solution run safely in the real environment, getting real users to actually use it, and carrying field lessons back into the product.

## What it is

The four responsibilities are a way to describe any FDE job by what it is accountable for, independent of its title.

| Responsibility | What you own | "Done" means | Where this handbook teaches it |
|---|---|---|---|
| **Discovery** | Deciding which customer problem is worth solving, out of everything the customer asks for | A problem with a named user, a baseline, a sponsor and agreed success criteria | Module 5, Lessons 2–5 |
| **Production** | Making the solution run safely, reliably and maintainably in the customer's real environment | It runs on real data, with real permissions, monitored, outside the demo | Modules 1–4 |
| **Adoption** | Getting the intended users to use it and change how they work | Real usage, and the agreed metric moves | Module 5, Lesson 7 |
| **Feedback** | Carrying what you learned back to the product | Reusable parts are in the product; the next customer is cheaper | Module 5, Lesson 7 |

## Why an FDE needs this

It gives you three practical tools. You can place any job description on the model and see which responsibilities it actually includes. You can assess your own gaps (most engineers are strong in Production and weak in Discovery or Adoption). And you can predict where a project will die, because each responsibility has a typical failure.

## Key concepts

### It is a loop, not a checklist

Feedback is what makes the next Discovery faster: once the product already handles the common cases, the next engagement can start from a better baseline. That is why the four are drawn as a cycle.

### Each responsibility has a typical failure

| Responsibility skipped | What happens |
|---|---|
| Discovery | The team builds the wrong thing well |
| Production | The project stays a proof of concept forever |
| Adoption | It launches and nobody uses it |
| Feedback | Every customer costs as much as the first one |

### Most real jobs cover part of the loop

A platform-focused FDE at a model-infrastructure company may spend most of their time on Production. An FDE who sits with business teams and prototypes before handing work to a backend team covers part of Discovery. An FDE running ten customers at once touches all four, but thinly. None of these is a lesser FDE. The useful question is which part you own, so that expectations, evaluation and career plans match it.

## Common misconceptions

- **"Launch is the finish line."** Launching is the end of Production. Adoption is a separate responsibility with its own failure mode.
- **"Feedback is the product manager's job."** The product manager decides what goes into the product, but the FDE is the one holding the evidence. If the FDE doesn't bring it back, nobody does.
- **"A real FDE must cover all four."** Complete coverage is the full form of the role, not the minimum bar.

## Typical interview questions

<details>
<summary>Tell me about a project that launched but wasn't adopted. What would you do differently?</summary>

Name the specific adoption blocker (users didn't trust the output, it added a step to their workflow, no one measured the before), then say what you would do earlier: involve the end users during Discovery, agree on an adoption metric in the scope, plan training and a fallback path before launch.

</details>

<details>
<summary>Which of the four responsibilities are you strongest and weakest at?</summary>

Be specific and honest. Pair the weakness with what you are doing about it, ideally with a concrete artifact (a discovery interview you ran, an adoption metric you tracked).

</details>

## Learn more

- Article: [A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1) (Palantir blog, about 10 min) — what Discovery, Production and Adoption look like in one working day

## Related

- [Echo and Delta Roles](./04-echo-and-delta-roles.md)
- [FDE Delivery Lifecycle](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
- [Role Tests](../02-fde-vs-adjacent-roles/02-role-tests.md)
