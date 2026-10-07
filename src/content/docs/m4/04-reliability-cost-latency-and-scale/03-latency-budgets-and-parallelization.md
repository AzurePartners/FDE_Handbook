---
title: Latency Budgets & Parallelization
row: M4-L4.3
---
**In one sentence:** A latency budget is the total time a response is allowed to take, and because sequential agents, multi-turn calls, and tool chains add up fast, you manage it with streaming, trimming, and parallelizing independent steps, accepting the added complexity that parallelism brings.

## What it is

A **latency budget** is the agreed ceiling on how long a feature may take to respond (e.g. under 3 seconds). LLM systems blow budgets easily because work is often **sequential**: an agent calls a tool, waits, reasons, calls another, waits, each step adds its latency, and multi-turn or multi-agent chains multiply it. Levers to stay in budget: **stream** output so it feels fast, **trim** prompts/steps, and **parallelize** independent steps (fire tool calls that don't depend on each other at once). Parallelization helps but adds complexity, coordinating results, handling partial failures, so it's a deliberate trade-off.

## Why an FDE needs this

A feature that takes 30 seconds feels broken even if correct. FDEs design multi-step agent systems where latency silently accumulates, and have to keep the total within what the use case tolerates. Knowing where time goes (which step, sequential vs parallelizable) and the tools to cut it is what makes an AI feature usable, not just accurate.

## Key concepts

- **Latency budget:** the total time ceiling for the use case.
- **Sequential cost:** each tool call / turn / agent adds latency; chains add up.
- **Streaming:** improves perceived latency by showing output as it's generated.
- **Parallelize independent steps:** run non-dependent calls concurrently to cut wall-clock time.
- **Parallelism's cost:** coordination, partial failures, and rate limits, added complexity to weigh.
- **Measure per step:** trace where time actually goes (ties to observability).

## Common misconceptions

- **"A faster model fixes latency."** Perceived speed comes mostly from streaming and structure; multi-step chains dominate real latency.
- **"Parallelize everything."** Only independent steps parallelize cleanly; it adds coordination and failure-handling complexity.
- **"Latency is a model problem."** It's largely an architecture problem, how many sequential steps and calls you designed.

## Typical interview questions

<details>
<summary>Why do agent systems become slow, and what do you do about it?</summary>

Because work is sequential, each tool call, turn, and agent hop adds latency, and chains multiply it. I set a latency budget, stream output to improve perceived speed, trim unnecessary steps and context, and parallelize independent calls to cut wall-clock time, accepting the coordination complexity that adds. I measure per step to see where time actually goes.

</details>

<details>
<summary>What's the trade-off with parallelization?</summary>

It reduces wall-clock latency for independent steps but adds complexity: coordinating and combining results, handling partial failures where one branch fails, and staying within rate limits when many calls fire at once. So I parallelize where steps are genuinely independent and the latency win justifies the added handling.

</details>

## Learn more

- Article: [Building effective agents — parallelization](https://www.anthropic.com/engineering/building-effective-agents) (sectioning / voting)
- Article: [Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (parallel sub-agents trade tokens for speed)

## Related

- [Reliability toolkit](./01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
- [Scaling Concepts](./04-scaling-concepts-concurrency-bottlenecks-and-horizontal.md)
