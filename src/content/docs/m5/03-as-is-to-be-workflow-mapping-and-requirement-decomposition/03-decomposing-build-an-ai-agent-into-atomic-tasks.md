---
title: Decomposing “Build an AI Agent” into Atomic Tasks
row: M5-L3.3
---
**In one sentence:** A vague ask like "build an AI agent" has to be decomposed into atomic tasks with their dependencies and failure boundaries, so the work becomes estimable, buildable, and safe, with clear points where a failure is contained rather than cascading.

## What it is

"Build an AI agent" is not a task, it's a project. **Decomposition** breaks it into **atomic tasks** (small units that can each be built and verified: "fetch the ticket," "classify intent," "look up the account," "draft a reply," "check policy," "send or escalate"). It maps **dependencies** (which tasks must finish before others) and **failure boundaries** (where a failure is caught and handled, so one step's failure doesn't corrupt the whole flow). The result is a plan of small, ordered, independently-verifiable pieces with defined error containment.

## Why an FDE needs this

You can't estimate, build, or safely operate an undifferentiated "agent." Decomposition is what makes the work tractable: small tasks are estimable and testable (ties to estimation and TDD), dependencies reveal the critical path, and failure boundaries determine where guardrails and human gates go. It's also how you find the risky parts early. Without it, you get a monolith that's hard to build, debug, and trust.

## Key concepts

- **Atomic task:** smallest independently buildable/verifiable unit.
- **Dependencies:** ordering constraints; reveal the critical path.
- **Failure boundaries:** where an error is caught and contained, not propagated.
- **Verifiability:** each atomic task has a clear "did it work?" check.
- **Risk localization:** decomposition surfaces the hard/risky steps to tackle first.

## Common misconceptions

- **"'Build an agent' is a task."** It's a project; decompose it into atomic, verifiable steps before building.
- **"Failure handling is one global try/catch."** Define boundaries per step so a failure is contained where it happens.
- **"Decompose only for estimation."** It also drives testing, guardrail placement, and finding the risky parts early.

## Typical interview questions

<details>
<summary>How do you turn "build an AI agent" into something buildable?</summary>

I decompose it into atomic tasks, small, independently verifiable steps like fetch, classify, look up, draft, check policy, send/escalate, then map the dependencies between them and define failure boundaries where each step's errors are caught and contained. That makes the work estimable and testable, reveals the critical path and the risky steps, and shows where guardrails and human gates belong.

</details>

<details>
<summary>What's a failure boundary and why define one per step?</summary>

It's the point where a step's failure is caught and handled rather than propagating. Defining one per step means a single failure, a tool timing out, a bad model output, is contained and can be retried, defaulted, or escalated locally, instead of corrupting the whole flow or producing a silent wrong result downstream.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (task-decomposition patterns)
- Book: [Shape Up](https://basecamp.com/shapeup) ("scopes" and mapping unknowns)

## Related

- [Allocating Steps](./02-allocating-steps-automation-ai-deterministic-code-or-human.md)
- [Estimation & Capacity](../04-scope-prd-sow-acceptance-criteria-and-non-goals/04-measurable-acceptance-criteria.md)
