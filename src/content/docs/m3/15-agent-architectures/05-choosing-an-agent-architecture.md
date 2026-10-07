---
title: Choosing an Agent Architecture
row: M3-L3.5
---
**In one sentence:** Choosing an agent architecture means picking the simplest design that reliably does the job (from plain code up to several agents) and defending that choice with evidence about risk, cost and reliability.

## What it is

The options form a ladder: plain code; a [workflow](./01-workflows-vs-agents.md), where code fixes the steps and a model fills some in; [one agent](./03-single-agent-systems.md), where the model picks each next step; or [several agents](./04-multi-agent-systems.md). Each rung up adds flexibility and costs money, speed, consistency and testability.

Think of staffing: a clerk with a checklist is cheap and predictable, a specialist handles surprises but needs trust, and a team covers more but loses information at each handoff.

The rule, in Anthropic's words: "finding the simplest solution possible, and only increasing complexity when needed." You choose per process, often per step.

## Why an FDE needs this

A mortgage lender's pilot checked loan files with six agents, chosen because "multi-agent is the modern approach." Each file took about four minutes and 40 model calls, reruns gave different verdicts, one agent computed income ratios itself, and nobody could tell compliance which agent had flagged an applicant.

The questions below exposed the mismatch: every file followed the same steps, errors were costly and regulated, and documents came in a dozen known types. The FDE rebuilt it as a workflow: a model classifies and extracts, tested code applies lending rules, one agent handles unusual documents, and an underwriter decides. The justification compared errors, cost per file and audit trail, never sophistication. (Illustrative scenario.)

## Key concepts

### Five questions that decide it

| Question | Simpler if | More autonomy if |
|---|---|---|
| Can the steps be listed in advance? | Same path every time | Path depends on findings |
| How costly is a wrong action? | Money, filings, irreversible | A reviewed draft |
| How varied are the inputs? | A few known types | Open-ended |
| What latency and cost are acceptable? | Seconds, cents per item | Minutes, dollars per task |
| How will it be tested and audited? | Rules an auditor traces | Outcomes an eval checks |

### The default order and when to climb

Start on the lowest rung that could work. Climb only when your eval set, test cases built from the [success criteria](../13-agent-profiles/06-agent-success-criteria.md), shows a failure the next rung fixes:

- **Code to workflow:** the input is language (emails, scanned forms) that rules cannot handle reliably.
- **Workflow to one agent:** the path varies; routes keep multiplying or the "other" branch keeps growing. Anthropic suggests agents where you "can't hardcode a fixed path."
- **One agent to several:** after clearer tools and instructions, it still picks wrong tools (OpenAI's test); a subtask needs its own security boundary (Microsoft's); or broad parallel research is worth about 15 times a chat's tokens (Anthropic's figure).

### Writing and revisiting the justification

Write a short decision record in the client's terms (illustrative):

```text
Decision: workflow, plus one agent for unusual documents
Rejected: the six-agent pilot
Risk:     lending rules in tested code; an underwriter decides
Quality:  96% vs 78% correct, 150 labeled files, 3 runs each
Cost:     5 model calls, 20 s per file (pilot: 40, 4 min)
Audit:    each step logs inputs, outputs and rule version
Revisit:  unusual documents above 15%, or a new model
```

"More advanced" is not a reason a client can check; error rates, cost and audit trails are. The record is a hypothesis: re-run the evals when a trigger fires. A new model is one: on a browsing benchmark, Anthropic found a model upgrade beat doubling the older model's token budget, so a simpler design may pass. Move down as readily as up.

## Common misconceptions

- **"Multi-agent is more advanced, so it is better."** It multiplies model calls, handoffs and debugging. Use it only for a need one agent cannot meet.
- **"An agent is more flexible, so it is the safer choice."** Unneeded flexibility is variation you must test and explain; for known steps, a workflow is cheaper and easier to audit.
- **"Once the architecture is chosen, it is settled."** Inputs, volumes and models change; re-run the evals when a revisit trigger fires.

## Typical interview questions

<details>
<summary>What does "the simplest viable architecture" mean?</summary>

The lowest rung that meets the agreed success criteria on an eval set, within the client's risk, cost and latency limits. Viable is measured, not assumed.

</details>

<details>
<summary>How does the case for an agent differ from the case for more agents?</summary>

An agent needs a path that varies. More agents need failures that survive clearer tools and instructions, a separate permission boundary, or parallel breadth worth the tokens.

</details>

<details>
<summary>A CEO wants "a team of AI agents," like a competitor's, for invoice disputes. How do you respond?</summary>

Agree success criteria and map the steps. Most disputes follow a known path, so I'd propose a workflow with one agentic step for exceptions and show both designs' error rate and cost per dispute on one eval set.

</details>

<details>
<summary>A new model generation ships. Would you change your architecture?</summary>

Not by default. I re-run the evals on the new model with the current design and the next simpler one, and simplify if the simpler one passes.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 20 min)
- Reference: [AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) (Microsoft Learn, about 30 min)

## Related

- [Workflows vs Agents](./01-workflows-vs-agents.md)
- [Single-Agent Systems](./03-single-agent-systems.md)
- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Model Judgment vs Deterministic Code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)
- [Agent Success Criteria and Definition of Done](../13-agent-profiles/06-agent-success-criteria.md)
