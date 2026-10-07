---
title: User-Adoption Friction
row: M5-L7.3
---
**In one sentence:** A working solution fails if people don't use it, and adoption friction, workflow changes, training needs, trust, the burden of human review, and organizational resistance, is what stands between a shipped system and a used one.

## What it is

**Adoption friction** is everything that makes people not use a solution even when it works:

- **Workflow change:** it asks people to work differently, and change is hard.
- **Training:** people don't know how to use it well.
- **Trust:** they don't trust the AI's output, so they ignore or double-check everything.
- **Human-review burden:** if using it means reviewing every output, it may be more work than before.
- **Organizational resistance:** fear, politics, or incentives that discourage adoption.

Addressing friction means designing for the humans, not just the technical function, easing the workflow change, building trust gradually, minimizing review burden, and managing the organizational side.

## Why an FDE needs this

FDEs (and interviewers) have seen technically excellent systems fail because no one adopted them, the highest-stakes failure, because the whole investment is wasted. Adoption is often harder than the engineering. Recognizing friction lets you design to reduce it (fit the existing workflow, build trust with transparency and a light human-review path, train users, address resistance) so the solution is actually used, and the value from your metrics actually materializes. This is why the To-Be process view and change management matter.

## Key concepts

- **Fit the workflow:** minimize how much people must change how they work.
- **Build trust gradually:** transparency, showing reasoning, starting with a human check then earning autonomy.
- **Minimize review burden:** don't make using it more work than not.
- **Train:** ensure people can actually use it well.
- **Manage resistance:** address fear, politics, and incentives, not just the tech.

## Common misconceptions

- **"If it works, people will use it."** Working is necessary, not sufficient; adoption friction sinks working systems.
- **"Adoption is the customer's problem."** An FDE owning the outcome owns adoption; a shipped-but-unused system is a failure.
- **"Trust comes automatically from accuracy."** Trust is built through transparency and experience; users distrust a black box even when it's right.

## Typical interview questions

<details>
<summary>A technically working solution isn't being adopted. What friction do you look for?</summary>

Whether it forces an uncomfortable workflow change, whether people were trained to use it, whether they trust its output or feel they must double-check everything, whether the human-review burden makes it more work than before, and whether there's organizational resistance, fear, politics, or incentives. Then I reduce the biggest frictions, since a working but unused system delivers no value.

</details>

<details>
<summary>How do you build user trust in an AI feature?</summary>

Gradually and through transparency: show the reasoning or sources behind outputs, start with the AI assisting a human who reviews, then expand its autonomy as confidence grows, and be honest about its limits. Trust comes from experience and visibility, not just from accuracy, users won't rely on a black box even when it's usually right.

</details>

## Learn more

- Article: [ADKAR change-management model](https://www.prosci.com/methodology/adkar) (Prosci; awareness → desire → knowledge → ability → reinforcement)

## Related

- [As-Is vs To-Be Workflow Mapping](../03-as-is-to-be-workflow-mapping-and-requirement-decomposition/04-as-is-vs-to-be-documenting-the-process-change.md)
- [Handoff Package](./05-the-handoff-package.md)
