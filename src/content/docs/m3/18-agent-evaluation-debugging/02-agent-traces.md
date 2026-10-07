---
title: Agent Traces (Steps, Tool Calls, Handoffs, State Changes)
row: M3-L6.2
---
**In one sentence:** An agent trace is the step-by-step record of one task across agents and workers: every model call, tool call, handoff and state change, with inputs, outputs, errors, timing and tokens, under one trace ID.

## What it is

A final answer shows what an agent system produced; a trace shows how: which agent did what, with which tools, and what changed.

Think of a relay race filmed with split times: it shows whether a runner was slow or a baton dropped; the final time cannot.

Precisely, a trace is a tree of spans: units of work, each with IDs (its own, its parent's, the trace's), timing, attributes (named fields) and a status. The root covers the task, children the agent runs, grandchildren their model calls, tool calls, handoffs and state changes. Anthropic's eval guide calls this record a transcript, "also called a trace or trajectory."

## Why an FDE needs this

A travel firm's planner agent hands trips to flight and hotel agents on separate workers. Some trips were confirmed with no hotel. Each worker logged final outputs under its own ID, and handoffs went unrecorded, so three teams spent a week rewording prompts.

The FDE started one trace per trip, carried in every queue message, with spans for every agent, tool call, handoff payload and record change. The first failing trace settled it: the planner sent `04/03` for March 4, the hotel agent read April 3, found no rooms and still reported `done`. (Illustrative scenario.)

## Key concepts

### What each step records

| Step | Records |
|---|---|
| Agent run | Profile and skill versions, input, output |
| Model call | [Per-call record](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md): model, tokens (for cost), stop reason |
| Tool call | Arguments, result or error ([tool traces](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)) |
| Handoff | Sender, receiver, payload, [contract](../15-agent-architectures/07-handoffs-and-agent-contracts.md) validation |
| State change | What changed where, old and new value |
| Failure | Error type, retries, limit hit |

### One trace across agents and workers

Within one process, spans nest automatically. Across a queue or service, the trace context (trace and parent span IDs) must travel with the work (context propagation), or each worker starts an orphan trace. Work resumed days later, say after an [approval](../17-persistent-agents/07-durable-human-approval.md), can start a linked trace. The failing trip:

```text
trace 9f2a61  task TRIP-5530                        48s  23k tokens
  agent planner v4
    handoff  planner -> hotel  {"check_in": "04/03", "nights": 2}
  agent hotel v2  (worker-7, via queue)
    tool   search_rooms(city="Madrid", check_in="2026-04-03") -> 0 rooms
    state  task.hotel: pending -> done  (no booking ID)
  agent planner v4
    state  trip.status: planning -> confirmed
```

### Conventions and tools

OpenTelemetry's generative AI semantic conventions (status: Development) name spans such as `invoke_workflow` (a multi-agent process), `invoke_agent`, `chat` (a model call), `execute_tool` and `update_memory`, but define no handoff span. Google's ADK implements them; Microsoft Agent Framework also uses OpenTelemetry. The OpenAI Agents SDK traces by default, handoffs included; `group_id` links a conversation's traces. Langfuse, LangSmith and Arize Phoenix display traces; dashboards are Module 4.

### Sampling, retention and redaction

- **Sampling:** keep every pilot trace. At scale, tail sampling (decided after a trace ends) can keep all failures and some successes; head sampling, decided upfront, cannot.
- **Retention:** traces copy client data; agree how long they live and who reads them. OpenAI's Agents SDK tracing is unavailable under Zero Data Retention.
- **Redaction:** OpenTelemetry instrumentations should not capture prompts, outputs or tool arguments by default; the OpenAI Agents SDK does unless `trace_include_sensitive_data` is `False` ([masking](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)).

### Traces, tasks and evals

Tag each root span with the task ID and versions (profile, skills, prompts, model); store the trace ID with each [eval result](./01-agent-evaluation.md) and failure case, so a failing score opens its steps for [failure attribution](./03-failure-attribution.md) and [replayable tests](./06-replayable-tests.md).

## Common misconceptions

- **"Our logs already have everything."** Without a shared ID, workers' logs cannot be joined into one run, and rarely record handoffs or state changes.
- **"The SDK's tracing covers the whole run."** It sees only its own runner; queue hops and your record updates usually need propagated context and custom spans.
- **"Capture everything, just in case."** Traces hold prompts and customer records: capture metadata always, content by policy, with retention limits.
- **"Tracing can wait until production."** Traces show why an eval task failed, from the first test run.

## Typical interview questions

<details>
<summary>What is an agent trace?</summary>

A tree of spans under one trace ID for one task: agent runs containing model calls, tool calls, handoffs and state changes, each with timing, status and redacted inputs and outputs.

</details>

<details>
<summary>How does a trace differ from a log?</summary>

A log line records one event; a trace links a run's events by trace and parent IDs, showing order, nesting and which agent or worker acted.

</details>

<details>
<summary>How do you keep one trace per task across queue workers?</summary>

Start the root span when the task is created and put its trace context and task ID in every queue message, so each worker's spans join it.

</details>

<details>
<summary>Security wants tracing off over customer data. What do you propose?</summary>

Change what is captured, not whether: metadata always, content masked or in restricted short-retention storage, failures kept by tail sampling, provider defaults checked, all agreed with their privacy owner.

</details>

## Learn more

- Article: [Inside the LLM Call: GenAI Observability with OpenTelemetry](https://opentelemetry.io/blog/2026/genai-observability/) (OpenTelemetry, about 5 min)
- Reference: [Tracing](https://openai.github.io/openai-agents-python/tracing/) (OpenAI Agents SDK, about 10 min)

## Related

- [The Tool-Call Loop and Tool Traces](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Failure Attribution in Agent Systems](./03-failure-attribution.md)
- [Full Request Lifecycle](../../m1/02-how-web-apps-run/11-full-request-lifecycle.md)
- [Handoffs and Agent Contracts](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
