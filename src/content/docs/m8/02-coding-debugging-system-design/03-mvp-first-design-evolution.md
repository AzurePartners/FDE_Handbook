---
title: MVP-First Design Evolution
row: M8-L2.3
---
**In one sentence:** In a design round you start with the thinnest end-to-end path that proves the risky part, then add components one at a time with a stated reason for each, instead of drawing a complete distributed architecture in the first five minutes.

## What it is

MVP-first evolution is the design-interview version of Module 5's "choose the simplest architecture that works." You name the highest-risk unknown (usually data access or integration, rarely the model), design the smallest system that tests it end to end, and then narrate an upgrade path: what you add when the pilot exposes a problem, and what you deliberately leave out until then. The architecture at the end of the round may be the same one a "draw everything" candidate produced, but the interviewer has watched you justify every box.

## Why an FDE needs this

Customer environments punish premature complexity: every extra component needs credentials, a security review, an owner, and a runbook. FDE interviewers, particularly at AI labs, explicitly penalize candidates who jump to the perfect production design, because that is how deployments stall. They want to hear "here is the minimal path that proves we can reach the customer's systems; once that is stable, here is how we harden it." That sentence also demonstrates that you understand the Demo → MVP → Pilot → Production ladder from the inside.

## Key concepts

### The walking skeleton

One user, one real data source, one model call, one output, one check. Mocked logic is fine if the integration is real. The skeleton's job is to answer "can we get to the data and back?" not "is the model good?"

### The complexity ladder

Rules or scripts → single model call → RAG → tool calling → workflow → single agent → multiple agents. Each rung is added only when the previous one demonstrably fails a real case. Say which rung you are on and what evidence would move you up.

### Non-negotiables that come first even in the MVP

Secrets out of code, authentication against the customer's identity system, input validation, and logging. These are not "later" items; they are the difference between an MVP and a demo.

### Deferred, with a trigger

For each deferred component, state the trigger that brings it in: "Add a queue when tasks exceed the request timeout; add a reranker when the eval shows retrieval misses on multi-hop questions; add caching when cost per task exceeds the budget."

### Narrating the evolution

A useful structure for 60 minutes: five minutes of clarifying questions, ten minutes on the skeleton, twenty minutes adding layers in response to interviewer prompts ("what if there are 50 million documents?"), fifteen minutes on failure modes and evaluation, ten minutes on trade-offs and what you would still not build.

## Common misconceptions

- **"Starting small looks junior."** Starting small with named triggers for growth is the senior pattern. Drawing everything at once looks like you have never had to operate any of it.
- **"The MVP can skip auth and logging."** Then it is a demo, and the interviewer will say so.
- **"Evolution means adding agents."** Most evolutions add data quality, evaluation, and observability, not more model calls. Say that.

## Typical interview questions

<details>
<summary>What is the first thing you would build?</summary>

The thinnest path through the riskiest unknown. Name the unknown ("whether we can read the ticketing system's API with a service account inside their VPC"), the two-week skeleton that tests it, and what you will learn from it.

</details>

<details>
<summary>Why is there no queue in your design?</summary>

Because nothing in the current requirements exceeds a request timeout. State the trigger that would add one (long-running tasks, batch jobs, a need to retry safely) and how you would add it without changing the interfaces you already have.

</details>

<details>
<summary>The interviewer adds a constraint: now there are 50 million documents and 10,000 users. What changes?</summary>

Walk the layers: ingestion becomes a batch pipeline with freshness tracking; retrieval needs an index with metadata filters and per-user permission checks; caching and a latency budget appear; the eval set grows to cover the new document types; observability becomes mandatory. Say what does not change: the auth model and the citation/refusal behavior.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic) — add complexity only when it demonstrably improves outcomes
- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen) — the incremental build-up, component by component
- Book: [Shape Up](https://basecamp.com/shapeup) (Basecamp, free) — "get one piece done" and fixed appetite as design tools
- Article: [How to Answer Decomposition Interview Questions](https://www.tryexponent.com/blog/decomposition-interview) (Aced) — the walking-skeleton step in the decomposition framework

## Related

- [End-to-End AI System Design](./02-end-to-end-ai-system-design.md)
- [Maturity Labeling](../01-portfolio-case-study-resume/03-maturity-labeling.md)
- [Live Scoping](../03-fde-case-decomposition-customer-simulation/02-live-scoping.md)
