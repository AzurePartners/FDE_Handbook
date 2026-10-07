---
title: The End-to-End Delivery Lifecycle
row: M5-L1.2
---
**In one sentence:** An FDE engagement runs a full arc, Qualify → Discover → Scope → Design → Build → Evaluate → Pilot → Handoff → Product Feedback, and knowing the whole arc keeps you from jumping to building before you understand, or stopping before the work is handed off and its lessons fed back.

## What it is

The lifecycle names each phase and its purpose:

- **Qualify:** is this a real, worth-doing problem we can help with?
- **Discover:** understand the actual problem, users, and constraints.
- **Scope:** agree what will (and won't) be built.
- **Design:** choose the simplest architecture that works.
- **Build:** implement it, iteratively.
- **Evaluate:** prove how it performs, including failures.
- **Pilot:** limited real-world rollout with success criteria.
- **Handoff:** transfer ownership so the customer can run it.
- **Product Feedback:** feed field learnings back to the product/team.

It iterates, discovery reopens during build, and the phases people skip (evaluate, handoff, feedback) are where value is secured.

## Why an FDE needs this

Without the arc in mind, the pull is to start coding immediately (skipping qualify/discover) and stop at "it demos" (skipping evaluate/handoff/feedback). Both are classic failures. The lifecycle lets you locate yourself ("we're still in discovery, don't commit to a design"), and ensures the unglamorous, high-value phases actually happen.

## Key concepts

```
Qualify -> Discover -> Scope -> Design -> Build -> Evaluate -> Pilot -> Handoff -> Product Feedback
              ^________________ iterate as you learn ________________|
```

- **Each phase has an exit criterion:** don't advance until it's met.
- **Iteration is expected:** learning in build sends you back to scope.
- **Qualify at the front, Feedback at the back:** the phases most often skipped.

## Common misconceptions

- **"Start building on day one."** Building before qualify/discover risks solving the wrong problem efficiently.
- **"Done means it demos."** Done means evaluated, piloted, handed off, and its lessons fed back.
- **"The lifecycle is strictly linear."** It iterates; you revisit earlier phases as you learn.

## Typical interview questions

<details>
<summary>Walk through the FDE delivery lifecycle.</summary>

Qualify the problem; discover the real need, users, and constraints; scope what will and won't be built; design the simplest architecture; build iteratively; evaluate honestly including failures; pilot with real users and success criteria; hand off so the customer can run it; and feed field learnings back to the product. It iterates, and the phases people skip, evaluate, handoff, feedback, are where value is actually secured.

</details>

<details>
<summary>Why include Qualify and Product Feedback as explicit phases?</summary>

Qualify prevents investing in a problem that isn't real or isn't a fit. Product Feedback captures what the engagement taught, so the product improves and the next deployment is cheaper. Both are easy to skip and both compound value across engagements.

</details>

## Learn more

- Article: [A Day in the Life of a Palantir FDSE](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1)
- Book: [Shape Up](https://basecamp.com/shapeup) (Basecamp, free; shaping → betting → building cycle)

## Related

- [Discovery Interviews](../02-customer-discovery-and-stakeholder-interviews/01-discovery-interviews.md)
- [Feeding Learnings Back to Product](../07-pilot-value-handoff-and-productization/08-feeding-learnings-back-to-product.md)
