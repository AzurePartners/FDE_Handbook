---
title: Multi-Agent Systems
row: M3-L3.4
---
**In one sentence:** A multi-agent system splits one task across several AI agents, each with its own instructions, context and tools, gaining parallel work and cleaner contexts at the cost of more tokens and harder coordination.

## What it is

An [agent](../13-agent-profiles/01-ai-agents.md) is one model choosing its next step in a loop. A multi-agent system puts several agents on one task, each with its own profile (job description), context (everything it can see) and tools.

Think of a kitchen: cooks at separate stations speed up service, but four cooks seasoning one pot without talking spoil it.

Anthropic's definition is "multiple agents (LLMs autonomously using tools in a loop) working together." Agents share nothing unless code passes it on.

## Why an FDE needs this

A payroll software vendor answered requests for proposals (long vendor questionnaires) with six agents: a lead split each into five sections for parallel writers. The security section promised single sign-on as standard while pricing sold it as an add-on, and go-live dates differed. Each response cost several times the single-agent prototype's tokens, and nobody could say which agent wrote a disputed claim.

The FDE kept parallel agents only for reading: three read-only researchers, one per source (product docs, past answers, security library), save cited snippets to a shared file. One writer drafts the whole response from them and a deal sheet the sales lead confirms; every step is traced. (Illustrative scenario.)

## Key concepts

### Three common shapes

| Shape | How it works | Good fit |
|---|---|---|
| Orchestrator and workers | A lead splits the task at run time and merges workers' results | Broad research, one worker per source |
| Supervisor and specialists | A main agent calls fixed specialists like tools and alone talks to the user | Distinct domains, such as CRM and calendar |
| Peer handoffs | One agent hands control and the conversation to a peer | Triage: billing questions go to a billing agent |

OpenAI calls the last two the manager ("agents as tools") and decentralized patterns.

### What several agents genuinely buy

- **Parallel breadth.** Anthropic's 2025 Research system (a Claude Opus 4 lead, Claude Sonnet 4 subagents) beat a lone Claude Opus 4 by 90.2% on an internal eval; parallelism cut research time by up to 90% on complex queries.
- **A clean context per subtask.** Each subagent searches in its own context and returns only what matters, sparing the lead [context pollution](../../m2/08-prompting-context-structured-output/05-context-pollution.md).
- **Separate permissions per role.** Claude Code gives each subagent "specific tool access, and independent permissions," so an agent reading untrusted pages can hold no write tools, limiting [prompt injection](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md) damage.

### What they cost, from builders on both sides

- **Tokens.** Anthropic measured agents at about 4 times a chat's tokens and multi-agent systems at about 15 times; they "work mainly because they help spend enough tokens to solve the problem."
- **Latency.** Each hop through a lead adds a model call, and the lead waits for its slowest worker.
- **Coordination failures.** Anthropic's early lead agents spawned 50 subagents for simple queries. In Cognition's "Don't Build Multi-Agents" (June 2025), subagents building a Flappy Bird clone made a Super Mario-style background and a mismatched bird: "Actions carry implicit decisions, and conflicting decisions carry bad results." Its April 2026 follow-up says a narrower pattern now works: agents contribute ideas while writes stay single-threaded.
- **Harder debugging.** A bad result can start in any agent or handoff, so [agent traces](../18-agent-evaluation-debugging/02-agent-traces.md) must span every agent.

### Where they pay off and where they struggle

They pay off on breadth: independent subtasks and read-heavy research. They struggle when every part depends on shared decisions, as in one document or one code change. A December 2025 Google and MIT study found central coordination improved results by 80.9% on parallelizable financial reasoning, while every multi-agent design did 39 to 70% worse than one agent on sequential planning.

## Common misconceptions

- **"Agents on the same team know what the others know."** Each sees only its own context; findings and decisions must be passed on explicitly.
- **"Splitting a big prompt into small agents saves tokens."** Each agent reloads instructions and inputs, and coordination adds calls.
- **"Give each agent a section and the report writes itself."** Sections share terms, numbers and commitments: parallelize research, keep one writer.

## Typical interview questions

<details>
<summary>What is a multi-agent system, and what does it buy you?</summary>

Several agents, each with its own profile, context and tools, sharing one task. It buys parallel breadth, clean contexts and per-role permissions for several times the tokens and more coordination risk.

</details>

<details>
<summary>How does an orchestrator with workers differ from peer handoffs?</summary>

An orchestrator splits the task, runs workers and merges their results, so control stays central. A handoff passes control and the conversation to a peer, like triage to billing, and nothing is merged.

</details>

<details>
<summary>A client wants a weekly brief on 40 competitors. Would you use several agents?</summary>

For research, yes: competitors are independent. Since the list is fixed, code can fan out one read-only agent per competitor, each returning a short cited summary. One agent writes the brief.

</details>

<details>
<summary>Your multi-agent reports repeat some topics and miss others. What is likely wrong?</summary>

Vague delegation from the lead, as Anthropic found early on. I would check the lead's task messages in the trace, give each worker a distinct objective, boundary and output format, and add an eval case.

</details>

## Learn more

- Article: [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) (Cognition, about 10 min)
- Article: [Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working) (Cognition, 2026 follow-up, about 10 min)
- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic, about 20 min)

## Related

- [Single-Agent Systems](./03-single-agent-systems.md)
- [Choosing an Agent Architecture](./05-choosing-an-agent-architecture.md)
- [Splitting Work Across Agents](./06-splitting-work-across-agents.md)
- [Handoffs and Agent Contracts](./07-handoffs-and-agent-contracts.md)
- [Failure Attribution in Agent Systems](../18-agent-evaluation-debugging/03-failure-attribution.md)
