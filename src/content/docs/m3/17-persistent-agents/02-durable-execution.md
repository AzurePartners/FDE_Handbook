---
title: Durable Execution (Checkpoints, Replay, Recovery)
row: M3-L5.2
---
**In one sentence:** Durable execution runs a multi-step task so each finished step and its result are saved outside the process, letting another worker continue after a crash, redeploy or restart instead of starting over.

## What it is

An agent task is a chain of steps: model calls, tool calls, waits. Durable execution saves progress after each step outside the process, not in the model's [context](../16-agent-state-memory/02-context-vs-durable-persistence.md), so a crash costs at most the running step.

Think of chess by mail: a game changes hands via a photo of the board (a checkpoint) or the scoresheet of every move (a history), replayed on an empty board. Nobody rethinks a played move.

Precisely: a durable runtime (a workflow engine, or an agent framework with a checkpointer) records each step boundary, and after a failure another worker rebuilds the position from those records.

## Why an FDE needs this

An insurer moved its claims-intake agent onto a durable workflow engine. Its tools ran as recorded steps, but the model calls and one repair-quotes API call stayed in the workflow code itself. After a node restart, replay re-ran all of them. Some model calls picked a different tool than the history recorded, so the engine halted dozens of claims with non-determinism errors, and the quotes vendor got duplicate requests.

The FDE moved each model and API call into a recorded step and added idempotency keys to quote requests. In a kill test, finished steps returned recorded results with no new model calls. (Illustrative scenario.)

## Key concepts

### What a checkpoint holds

A checkpoint wraps the job's [task state](../16-agent-state-memory/04-task-state.md) with what a fresh process needs: the position (next step, loop counters), finished results or pointers, work in flight (pending tool calls, approvals, messages) and workflow, prompt and model versions. Microsoft Agent Framework saves executor state, pending messages, pending requests and responses, and shared state after every superstep. Microsoft calls checkpoint storage "a trust boundary": guard it like production data.

### Resume or replay

| | Resume from saved state | Replay a recorded history |
|---|---|---|
| Stores | A state snapshot after each step | Log of completed steps and results |
| Recovery | Load the latest, run the next step | Rerun the code, reusing recorded results |
| Rule | New code must read old state | Code must be deterministic |
| Examples | LangGraph graphs, Microsoft Agent Framework | Temporal, Azure Durable Functions, LangGraph Functional API |

Replay matches each step the code requests against the history, so Temporal's docs put "LLM/AI invocations" in Activities (recorded steps); a mismatch raises a non-determinism error. Histories are capped (Temporal: 51,200 events or 50 MB); Continue-As-New carries state into a fresh one.

### Model and tool calls as recorded steps

Model calls are slow, paid and non-deterministic; many tool calls change other systems. So durable designs record each call as a step and return its saved result on recovery. Temporal's OpenAI Agents SDK integration runs model invocations as Activities; Google ADK's Resume reruns only the interrupted tool call. A step that acted but crashed before its result was saved still runs again ([Duplicate Execution and Deduplication](./05-duplicate-execution.md)).

### How often to checkpoint

The interval caps how much work a crash can lose. LangGraph's durability modes show the trade-off: `"exit"` saves only when the run ends (fastest, no mid-run recovery), `"async"` saves while the next step runs (small risk of a lost checkpoint) and `"sync"` saves before it starts. For agents, checkpoint after every model call, tool call and approval; a write costs far less than a repeated model call.

## Common misconceptions

- **"Retries already make our agent durable."** Retries repeat a call inside a live process; if the process dies, the loop and its progress die too.
- **"Replay means every model call runs again."** History-based engines return recorded results for finished steps. (LangGraph's time-travel replay deliberately reruns later nodes.)
- **"We can deploy new workflow code while runs are in flight."** Replayed runs must request the same steps in the same order: version the change (Temporal offers patching and worker versioning) or let old runs finish on old code.

## Typical interview questions

<details>
<summary>What is durable execution, and what goes into a checkpoint?</summary>

Saving progress outside the process at each step, so another worker can continue after a crash. A checkpoint holds the position, finished results, work in flight such as pending approvals, and versions.

</details>

<details>
<summary>How does resuming from a checkpoint differ from replaying a history?</summary>

Resume loads the latest saved state and runs the next step (LangGraph graphs). Replay reruns the code against a log of completed steps, reusing recorded results (Temporal), so the code must be deterministic.

</details>

<details>
<summary>Where would you checkpoint a research, outline, draft, review and revise agent?</summary>

After every model call, tool call and approval, synchronously, in a database, with drafts stored by reference, so a crash in review never reruns research or changes an approved outline.

</details>

<details>
<summary>After an outage, recovered runs cost double and some outlines changed. What do you check?</summary>

Whether model calls ran outside recorded steps, or checkpoints were saved only at exit: either way recovery re-asked the model. I would make each call a step, checkpoint synchronously and add a kill-and-resume test.

</details>

## Learn more

- Article: [OpenAI Agents SDK Integration for Temporal](https://github.com/temporalio/sdk-python/tree/main/temporalio/contrib/openai_agents) (Temporal on GitHub, Background Concepts, about 8 min)
- Reference: [Durable orchestrations](https://learn.microsoft.com/en-us/azure/durable-task/common/durable-task-orchestrations) (Microsoft Learn, about 15 min)
- Reference: [Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers) (LangChain docs, about 25 min)

## Related

- [Persistent Agents](./01-persistent-agents.md)
- [Task State (Plans, Progress, Artifacts)](../16-agent-state-memory/04-task-state.md)
- [Duplicate Execution and Deduplication](./05-duplicate-execution.md)
- [Recovery Testing (Failure Injection)](./08-recovery-testing.md)
- [Persistence Patterns (Workspace, Landing Pad, Journal)](../16-agent-state-memory/08-persistence-patterns.md)
