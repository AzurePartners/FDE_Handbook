---
title: "Architecture Hypothesis: Assumptions, Risks & Tech Debt"
row: M5-L5.3
---
**In one sentence:** Turn requirements into an explicit architecture hypothesis, "we believe this design will work because…", and document the assumptions it rests on, the risks that could break it, and the technical debt you're knowingly taking on, so the design can be tested and revisited rather than treated as fact.

## What it is

An **architecture hypothesis** frames your design as a testable belief, not a certainty: "given these requirements, we believe design X will meet them because Y." Making it a hypothesis forces you to state the **assumptions** it depends on (the data is clean enough, the API can handle the load, the model is accurate enough), the **risks** that could invalidate it (a dependency is slower than expected, the data is messier), and the **technical debt** you're deliberately accepting to move fast (a shortcut you'll pay back later). Documented, these become things to validate early and revisit, rather than silent bets.

## Why an FDE needs this

Designs are built on assumptions, and unstated assumptions are where projects fail, the one that turns out wrong invalidates the whole approach after you've built on it. Framing the architecture as a hypothesis with explicit assumptions and risks tells you what to validate first (test the riskiest assumption early), makes the design revisable when reality differs, and lets you take on tech debt consciously (recorded, with a payback plan) rather than accidentally. It's how an FDE designs under uncertainty responsibly.

## Key concepts

- **Hypothesis, not fact:** "we believe X works because Y", testable and revisable.
- **Assumptions:** what the design depends on being true; validate the riskiest first.
- **Risks:** what could invalidate the design; watch and mitigate.
- **Technical debt:** deliberate shortcuts, recorded with a payback intent.
- **Validate early:** de-risk the hypothesis before building everything on it.

## Common misconceptions

- **"The architecture is decided; move on."** It's a hypothesis resting on assumptions; treat it as testable, not settled.
- **"Assumptions are obvious, no need to write them."** The dangerous ones are invisible until they break; writing them down is what lets you validate them.
- **"Tech debt is just bad code."** Deliberate, recorded tech debt is a legitimate speed trade-off; the problem is unrecorded, accidental debt.

## Typical interview questions

<details>
<summary>What does it mean to treat an architecture as a hypothesis?</summary>

Framing it as "we believe this design meets the requirements because…", explicitly stating the assumptions it depends on, the risks that could invalidate it, and any tech debt taken on deliberately. That makes it testable, you validate the riskiest assumptions early, and revisable when reality differs, rather than a fixed bet you only discover was wrong after building on it.

</details>

<details>
<summary>How do you handle a risky assumption in your design?</summary>

Identify it explicitly, then de-risk it early, run a quick spike or prototype to test the riskiest assumption before building everything on top of it. If it holds, proceed; if not, revise the architecture while it's cheap. The goal is to fail fast on assumptions rather than discover them wrong late.

</details>

## Learn more

- Docs: [Architecture Decision Records](https://adr.github.io/) (templates: context, decision, consequences)
- Note: keep an assumptions & risks log next to the ADRs.

## Related

- [Build vs Buy vs Configure](./02-build-vs-buy-vs-configure.md)
- [Avoiding Premature Optimization](./04-avoiding-premature-optimization-and-what-you-can-t-defer.md)
