---
title: Agent-Level Metrics (Task Completion, Handoffs, Tool Use, Loops, Cost, Latency)
row: M3-L6.4
---
**In one sentence:** Agent-level metrics show how well an agent system does whole tasks: how often it completes them, how cleanly it hands off and uses tools, how often it loops, and what each completed task costs in money and time.

## What it is

[Single-call metrics](../../m2/11-ai-evaluation/04-core-metrics.md) grade one model response. An agent plans, calls tools and hands work to other agents, so one task can take dozens of model calls. Agent-level metrics measure whole tasks across many runs.

A courier company judges drivers this way: parcels delivered, wrong-door drops, laps around the block, fuel per delivered parcel and calls to dispatch, not each turn of the wheel.

A run is one attempt at one task, leaving an outcome (did the end state pass its check?) and a [trace](./02-agent-traces.md) of its steps. The metrics aggregate both.

## Why an FDE needs this

A software vendor's Content Operations flow (Research, Plan, Draft, Review) wrote comparison pages. Its dashboard showed 99% of model calls succeeding at about 3 cents each, yet marketing called the pilot slow and costly.

The FDE rebuilt the numbers per task from traces: 40 tasks, three runs each. Only 55% of runs produced a page an editor accepted. One run in five hit the 80-step cap, with Research repeating searches for a competitor price that was never published. Counting failed runs, each accepted page cost about $3. The FDE made repeated searches return "no new results," had Research hand unfound facts to the editor, and agreed per-task targets with the client. (Illustrative scenario.)

## Key concepts

### Task completion and consistency

Task completion rate is the share of runs whose end state passes the check [agent evaluation](./01-agent-evaluation.md) defines, like a ticket resolved in the system. An agent saying "done" proves nothing; count false claims of success separately. Runs vary, so repeat tasks and report pass^k (tasks passing all k runs) with the average.

### Handoffs and tool use

Handoff correctness is the share of handoffs that reach the right agent carrying data that passes [contract validation](../15-agent-architectures/07-handoffs-and-agent-contracts.md). Tool-use quality extends tool-call correctness from one call to the whole run: wrong tools, invalid arguments, and unnecessary or missing calls, such as a price quoted without a lookup. Microsoft Foundry's evaluators split Tool Selection (right tools, none unnecessary) from Tool Call Success (no technical errors).

### Loops, stalls and limit hits

A loop repeats a step without new information, such as an identical tool call. A stall keeps taking steps while the task state gains nothing. The limit-hit rate counts runs stopped by a step, token, cost or time cap (in the OpenAI Agents SDK, a `MaxTurnsExceeded` error). [Bounded execution](../17-persistent-agents/04-bounded-execution.md) stops them inside a run; here you count them per agent and task type.

### Cost, latency and interventions per task

Cost per completed task divides all spend (every agent, retry and failed run) by tasks completed, so a cheaper model that fails more can cost more. Kapoor et al. (2024) found accuracy-only benchmarks left agents needlessly complex and costly. Time each task from start to done at p50 and p95 (typical and slowest 5%), reporting waits for people separately. OpenAI's agent guide calls for human intervention on high-risk actions and after repeated failures: count planned approvals apart from rescues, where a person fixes or finishes a failing run.

### Agreeing thresholds

Agree a threshold per metric with the client before a pilot, from the agent's [success criteria](../13-agent-profiles/06-agent-success-criteria.md) and today's manual cost and time: say, 85% completion, pass^3 of 70%, caps hit in under 5% of runs. Ship only when all pass; dashboards are Module 4.

## Common misconceptions

- **"A high average completion rate means the agent is reliable."** An average can hide a task type that always fails; break it down by type and report pass^k.
- **"The step cap handles loops, so there is nothing to measure."** It limits damage, but every capped run is a failed task you paid for.
- **"More tool calls mean a more thorough agent."** Repeated or unneeded calls usually signal confusion or a loop.
- **"Zero human interventions is the goal."** Approvals on risky actions are by design; push down unplanned rescues.

## Typical interview questions

<details>
<summary>What is task completion rate for an agent?</summary>

The share of runs whose end state passes an agreed check, like the refund recorded in the system, not the agent's claim of success, reported with pass^k.

</details>

<details>
<summary>What is the difference between cost per call and cost per completed task?</summary>

Cost per call prices one request. Cost per completed task divides all spend, across agents, retries and failed runs, by tasks that passed; clients compare it with manual work.

</details>

<details>
<summary>Which metrics would you set for a Research, Draft and Review flow?</summary>

Editor acceptance as completion, pass^3, valid handoffs, tool calls per task, loop and cap-hit rates, cost and p95 time per accepted piece, and unplanned rescues, each with an agreed threshold.

</details>

<details>
<summary>After a model upgrade, completion held but cost per task doubled. Where do you look?</summary>

Per-task trace breakdowns: tokens and calls by agent, loop and cap-hit rates, retries. The model may think longer or search more; I fix that layer and rerun the tasks.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic, about 30 min)
- Reference: [Agent evaluators](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/agent-evaluators) (Microsoft Foundry docs, about 15 min)
- Article: [AI Agents That Matter](https://arxiv.org/abs/2407.01502) (Kapoor et al., 2024, about 40 min)

## Related

- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](../../m2/11-ai-evaluation/04-core-metrics.md)
- [Agent Evaluation (Tasks, Environments, Outcomes)](./01-agent-evaluation.md)
- [Trajectory Evaluation](./05-trajectory-evaluation.md)
- [Bounded Execution (Budgets, Step Limits, Trigger Control)](../17-persistent-agents/04-bounded-execution.md)
- [Agent Success Criteria and Definition of Done](../13-agent-profiles/06-agent-success-criteria.md)
