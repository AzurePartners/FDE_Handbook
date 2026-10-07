---
title: End-to-End AI System Design
row: M8-L2.2
---
**In one sentence:** The FDE system design round asks you to design a real customer deployment across frontend, backend, data, tools, agents, state, auth, deployment, and observability, and it scores the trade-offs you name more than the boxes you draw.

## What it is

A 60-minute round with a prompt such as "design a private RAG system for a hospital with 50 million documents and HIPAA constraints" or "design an evaluation harness for an agent that reroutes shipments for 500 warehouse managers." Unlike classic system design, the model is one component among many, and the customer's constraints (identity system, network boundary, compliance, legacy data) shape the design more than throughput numbers do. The interviewer wants a coherent walk from user to data and back, with trust boundaries, failure modes, and a plan for proving it works.

## Why an FDE needs this

This round is a rehearsal of the Design step in the FDE lifecycle. The evaluation criteria are the same ones a customer's architect will apply: does the design respect their auth and data boundaries, can it be operated after you leave, what happens when the model is wrong, and what does it cost. AI-lab loops add an emphasis on evaluation: "how do you know it is working?" is the question that separates candidates.

## Key concepts

### The nine layers, and the one question each must answer

| Layer | The question to answer out loud |
|---|---|
| Frontend / Space | Who uses it, from where, and what do they see when the system is uncertain |
| Backend | Which route calls the model, what is deterministic code, what are the limits |
| Data | Sources, freshness, provenance, PII handling, who owns each source |
| Tools / connectors | Read vs write, auth per tool, schema, error returns |
| Agents / workflow | Workflow or agent, and why; where the loop stops |
| State / memory | What persists, where, for how long, who can read it |
| Auth | Identity provider, per-user permissions enforced in code, service accounts |
| Deployment | Customer VPC vs hosted, secrets, rollback, environments |
| Observability | Logs, traces per model call and tool call, metrics, alerts, eval regression runs |

### Trust boundaries first

Draw the line between the customer's network and everything else before drawing components. Every arrow that crosses the line needs an auth mechanism and a data-handling answer.

### Failure modes and the plan for each

Stale data, wrong tool arguments, prompt injection from a document, model outage, rate limits, a user without permission. Name at least four and say what the system does for each. Interviewers listen for whether the model ever has the final say on an action.

### Evaluation as a component

Where the eval set lives, how it is re-run after a prompt or model change, what the pass threshold is, and who reviews failures. A design without this is a demo architecture.

### Trade-offs, stated with the alternative

"I chose hosted inference because the customer has no GPU capacity; the trade-off is data leaving their network, mitigated by a zero-retention agreement and PII redaction before the call. The alternative, self-hosting an open-weights model, would fix the boundary issue at the cost of quality and an ops burden they cannot staff."

## Common misconceptions

- **"I should show the most complete architecture."** Interviewers explicitly look for a walking skeleton first, then hardening. See [MVP-First Design Evolution](./03-mvp-first-design-evolution.md).
- **"The model is the design."** The model is one box. Data access, permissions, and evaluation are where designs fail in customer environments.
- **"Non-functional requirements are a footnote."** Latency budget, cost per task, privacy, and audit are usually the constraints that decide the architecture. Ask for them in the first five minutes.

## Typical interview questions

<details>
<summary>Design a knowledge assistant for a bank's internal policies. Where do you start?</summary>

Clarify users, the source documents (how many, how often they change, who owns them), the identity system, and whether anything may leave the network. Then draw the trust boundary, the ingestion path with freshness and access metadata per chunk, retrieval with per-user filtering, a grounded answer with citations and a refusal path, and the eval set. Say what is deterministic (policy version lookup) and what the model does (drafting from retrieved passages).

</details>

<details>
<summary>How do you know the system is working after you hand it over?</summary>

A versioned eval set re-run on every prompt, model, or index change with a pass threshold; production traces sampled weekly for error analysis; metrics on refusal rate, groundedness, latency, and cost per task; and an owner on the customer side who reads the dashboard. Name the first alert you would configure.

</details>

<details>
<summary>A customer demands sub-second responses. Your RAG path takes 1.5 seconds. What do you do?</summary>

Measure first: retrieval, reranking, and generation each get a number. Then the levers in order of cheapness — cache frequent queries, prune the candidate set before reranking, stream the answer so time-to-first-token drops, use a smaller model for classification steps, precompute embeddings. State which quality metric you will re-check after each change.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) — the classic building blocks and the interview section
- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen) — the AI-specific layers added one at a time
- Reference: [LLM System Design Interview](https://datatalksclub.github.io/podwiki/wiki/llm-system-design-interview/) (DataTalksClub wiki) — questions to ask before drawing, and the latency/cost plan
- Reference: [AI System Design Guide](https://github.com/ombharatiya/ai-system-design-guide) (GitHub) — question bank and whiteboard exercises for RAG, agents, and evals
- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic) — workflow vs agent, and when not to add complexity

## Related

- [MVP-First Design Evolution](./03-mvp-first-design-evolution.md)
- [Practical Coding and Debugging Round](./01-practical-coding-and-debugging-round.md)
- [Live Scoping](../03-fde-case-decomposition-customer-simulation/02-live-scoping.md)
