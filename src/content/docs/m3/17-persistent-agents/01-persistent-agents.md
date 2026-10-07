---
title: Persistent Agents
row: M3-L5.1
---
**In one sentence:** A persistent agent is an agent whose task outlives one request and one process: the work is queued, progress is saved after every step, and the task can wait for days or survive a crash or deploy, then continue.

## What it is

A chat request lives and dies with one connection: the user asks, the model answers, nothing keeps running. An agent collecting a client's documents may need days: it waits on people and outside events and must survive crashes and deploys (new code releases, which restart processes).

Think of a home renovation: crews change and work pauses while tiles are on order, yet nobody starts over, because the job file says what is done and what comes next.

Precisely: a persistent agent separates the task (a stored record with an ID, status and progress) from the worker process running it, so any worker can continue it and a waiting task occupies none.

## Why an FDE needs this

A bank's compliance team built a document-refresh agent like a chat assistant: an analyst typed "refresh Harbor Foods" and one server process ran the whole job, polling a mailbox hourly for the client's ownership documents, then awaiting a reviewer's yes. Twice-weekly deploys killed every loop, and with progress stored nowhere else, 31 refreshes sat at "waiting for documents" for weeks, some overdue, with nothing running.

The FDE made each refresh a task record saved after every step. An arriving email now re-queues its task, the approval is a saved status rather than a loop, and a report flags tasks idle over five days. In staging, she killed a worker mid-step; another finished the task. (Illustrative scenario.)

## Key concepts

### Chat request vs persistent task

| | Chat request | Persistent task |
|---|---|---|
| Lives for | Seconds, one connection | Minutes to days |
| Caller gets | The answer | A task ID, then status updates |
| Progress lives in | Process memory | A task record, saved per step |
| While waiting | Blocks or times out | Saved status, no process held |
| Crash or deploy | Work lost | Resumes on any worker |

Persist a task when it outlasts a request, waits on people or events, runs unattended or updates several systems in sequence; a quick question does not.

### The parts

- **Queue:** holds new tasks and events (a reply, an approval, a timer) for a free worker ([basics](../../m1/06-reliability-scale/02-queues-and-workers.md), [agent specifics](./03-agent-task-queues-and-workers.md)).
- **Workers:** interchangeable processes that run a task's next step and let go; any can die.
- **Stored state and checkpoints:** the [task record](../16-agent-state-memory/04-task-state.md) in a database, saved after each step so recovery repeats at most the unfinished step ([Durable Execution](./02-durable-execution.md)).
- **Pause and resume:** a waiting status plus the event that wakes the task ([approval pauses](./07-durable-human-approval.md)).

Persistence adds risks covered later: [runaway runs](./04-bounded-execution.md), [repeated side effects](./05-duplicate-execution.md) and [two runs on one task](./06-concurrency-and-stale-state.md).

### Runtimes that save progress

You rarely build persistence from scratch. Open-source LangGraph saves graph state at every step with its Postgres checkpointer, and Temporal hands a crashed workflow to another process that "resumes at the point where it stopped." Hosted options, like Anthropic's Claude Managed Agents (beta), keep session history with the provider; check that against client data rules. Whatever the runtime, kill a worker mid-task and watch it resume ([Recovery Testing](./08-recovery-testing.md)).

## Common misconceptions

- **"A persistent agent is one that remembers users."** That is [memory](../16-agent-state-memory/05-long-term-and-user-memory.md). Persistence means unfinished work survives; an agent can have either without the other.
- **"A persistent agent is a process that never stops."** Workers are disposable and a waiting task runs nothing; only the task record persists.
- **"We can add persistence after the demo."** It changes the interface (a task ID, not an answer), step boundaries and every side effect, so design it in early.

## Typical interview questions

<details>
<summary>What is a persistent agent, and how does it differ from a chat assistant?</summary>

An agent whose task outlives one request and one process. A chat request answers on one connection and dies with it; a persistent task returns an ID, saves each step, waits without a process and resumes on any worker.

</details>

<details>
<summary>How does persistence differ from long-term memory in an agent?</summary>

Memory is what the agent knows across sessions; persistence is whether unfinished work survives. A support bot can remember a customer yet lose a half-done refund on restart; a nightly batch agent can be persistent with no user memory.

</details>

<details>
<summary>How would you design an agent that reviews 300 contracts overnight and sends risky ones to legal?</summary>

The request creates a batch task and returns its ID. Each contract is a queued subtask with its own record; workers save findings per contract and park risky ones in legal review. A killed worker loses one step at most.

</details>

<details>
<summary>After every deploy, a few agent tasks sit "in progress" forever. What do you check?</summary>

Whether a worker the deploy killed left its claim on them, or a wait was a loop inside the process. I would save state per step, expire stale claims so another worker resumes, and alert on idle tasks.

</details>

## Learn more

- Article: [Launch/Pause/Resume with simple APIs](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-06-launch-pause-resume.md) (HumanLayer, 12-Factor Agents, about 3 min)
- Reference: [Understanding Temporal](https://docs.temporal.io/evaluate/understanding-temporal) (Temporal documentation, about 10 min)

## Related

- [Queues and Workers](../../m1/06-reliability-scale/02-queues-and-workers.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](./02-durable-execution.md)
- [Agent Task Queues and Workers](./03-agent-task-queues-and-workers.md)
- [Context vs Durable Persistence](../16-agent-state-memory/02-context-vs-durable-persistence.md)
- [Pausing Agents for Human Approval](./07-durable-human-approval.md)
