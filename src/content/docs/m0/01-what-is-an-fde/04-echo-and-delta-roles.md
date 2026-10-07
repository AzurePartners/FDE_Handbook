---
title: Echo and Delta Roles
row: M0-L1.4
---
**In one sentence:** Palantir splits field work between Echo, embedded analysts who decide which problem to solve, and Delta, deployed engineers who build it; many companies merge both into one person, so the split describes responsibility, not seniority or tech stack.

## What it is

At Palantir, a customer-facing team has two kinds of people. **Echo** team members are embedded analysts and customer leads, often with deep domain experience (a former military officer at a defense customer, a former clinician at a hospital). They decide what problem the customer should solve and manage the relationship. **Delta** team members are the forward deployed engineers in the narrow sense: they prototype fast and turn the chosen problem into a running system.

Other companies cut the same team differently. Many startups expect one FDE to do both. Some organizations add a third role that coaches the customer's business team on using the system. The structure varies; the two underlying questions do not: *what should we build?* and *how do we make it work?*

## Why an FDE needs this

Job descriptions rarely use these words, but they lean one way or the other. Knowing the split helps you read a posting ("is this mostly Echo work or mostly Delta work?"), plan your growth, and see why Discovery and Production need different strengths.

## Key concepts

### Two questions, two strengths

| | Echo | Delta |
|---|---|---|
| Core question | What should this customer solve first? | How do we make it work here? |
| Typical background | Domain expert, analyst, consultant | Engineer who prototypes quickly |
| Main responsibility | Discovery, relationship, adoption | Production |
| Failure mode alone | Decides on things that can't be built in time | Builds a polished solution to the wrong problem |

### Split by responsibility, not rank

The division is not junior versus senior, technical versus non-technical, or ML versus non-ML. It only separates who decides what to do from who makes it real. An Echo needs enough technical literacy to judge feasibility; a Delta needs enough business sense to push back on a bad problem.

### One person, two hats

A solo FDE does both jobs. The common trap is that building always feels more urgent, so Discovery gets squeezed. Experienced solo FDEs protect time for stakeholder conversations and revisit "is this still the right problem?" at each demo.

## Common misconceptions

- **"Echo is the non-technical role."** Echo work requires judging what is technically feasible and what data exists. Purely non-technical Echoes make promises Delta can't keep.
- **"Delta just codes what Echo decides."** Delta is expected to challenge scope based on what they find in the customer's systems.
- **"You have to pick one forever."** Many people move between the two, and many FDE roles blend them.

## Typical interview questions

<details>
<summary>Are you more of an Echo or a Delta? How do you cover the other side?</summary>

Pick honestly, give evidence, then explain how you compensate: a Delta-leaning candidate might describe how they run structured stakeholder interviews; an Echo-leaning one might show a prototype they built themselves.

</details>

<details>
<summary>How would you prototype quickly in an unfamiliar customer environment?</summary>

Start with the narrowest end-to-end path on real (or realistic) data, use the customer's existing tools where possible, get it in front of a user within days, and treat every gap you discover (missing data, permissions, unexpected formats) as a Discovery finding, not just a bug.

</details>

## Learn more

- Article: [Who Wants to Be a Delta?](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035) (Palantir blog, about 10 min) — what the Delta role involves and who it suits
- Video: [The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo) (Y Combinator) — chapter 09:51, "Echo and Delta Teams Explained," about 4 minutes

## Related

- [Four FDE Responsibilities](./03-four-fde-responsibilities.md)
- [FDE Title Variation](../02-fde-vs-adjacent-roles/01-fde-title-variation.md)
- [FDE Delivery Lifecycle](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
