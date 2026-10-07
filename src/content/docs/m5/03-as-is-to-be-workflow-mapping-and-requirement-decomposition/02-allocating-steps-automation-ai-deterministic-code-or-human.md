---
title: "Allocating Steps: Automation, AI, Deterministic Code or Human"
row: M5-L3.2
---
**In one sentence:** Once a workflow is mapped, each step is best handled by one of four things, simple automation, an AI model, deterministic code, or a human, and matching each step to the right one is the heart of designing an AI-assisted workflow.

## What it is

Not every step should be done the same way. The four options:

- **Simple automation:** rote, rule-free movement (trigger, copy, notify).
- **AI/model:** steps needing language understanding, judgment, classification, or drafting.
- **Deterministic code:** steps that must be exact and rule-based (calculations, validation, enforcing limits).
- **Human:** steps needing accountability, high-stakes judgment, or approval.

Allocating steps means going through the map and assigning each to its best-fit handler, keeping fuzzy/language work with the model, exact/consequential work in code, and irreversible/high-stakes decisions with a human.

## Why an FDE needs this

The instinct to "make it all AI" produces systems that are unreliable where they needed to be exact and over-engineered where simple automation would do. The reverse, hard-coding everything, wastes what models are uniquely good at. Correctly allocating each step, model decides, code executes, human approves the risky, is what makes an AI-assisted workflow both capable and safe. It directly connects to the architecture decisions in Lesson 5.

## Key concepts

| Step type | Best handler |
| --- | --- |
| Rote movement/trigger | Simple automation |
| Language, judgment, classification | AI/model |
| Exact calculation, rules, money | Deterministic code |
| High-stakes / irreversible / accountable | Human |

- **Model decides, code executes:** keep authority over consequences in code.
- **Human for the irreversible:** gate high-stakes steps (ties to HITL/permissions).

## Common misconceptions

- **"Make every step AI."** Exact and consequential steps belong in code; some steps just need simple automation; risky ones need a human.
- **"Code everything; models are unreliable."** That wastes the model's strength on language and judgment.
- **"Allocation is obvious."** It's a deliberate design decision with real reliability and safety consequences.

## Typical interview questions

<details>
<summary>How do you decide what each workflow step should be handled by?</summary>

I match each step to its best-fit handler: simple automation for rote movement, an AI model for language/judgment/classification, deterministic code for anything exact or consequential (calculations, rules, money), and a human for high-stakes or irreversible decisions. The principle is model decides, code executes, human approves the risky.

</details>

<details>
<summary>A step calculates a customer's refund. Who handles it?</summary>

Deterministic code, because it must be exact and authorized; the model can interpret the request and propose it, but the amount and policy limits are enforced in code, and if it's above a threshold a human approves. Letting a probabilistic model be the final authority on money is unsafe.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (when a workflow or plain code beats an agent)
- Note: tag each To-Be step — Automation / AI / Deterministic code / Human.

## Related

- [Mapping a Workflow](./01-mapping-a-workflow-actors-steps-inputs-outputs-decisions.md)
- [Architecture: Simplest Thing That Works](../05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md)
