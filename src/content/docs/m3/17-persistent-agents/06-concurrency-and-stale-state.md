---
title: Concurrency and Stale State in Agent Systems
row: M3-L5.6
---
**In one sentence:** Concurrency problems arise when two agent runs, or an agent and a person, change the same task or record at once; stale state is acting on data that changed after it was read.

## What it is

A persistent agent rarely has its data to itself: customers send a second message before the first reply, schedules add runs, parallel sub-agents share a task record, and staff edit the same tickets. When any two change the same data at once, you get double replies or one update silently undoing another ([the basics](../../m1/06-reliability-scale/06-race-conditions.md)).

Picture two coworkers sharing an inbox with no way to claim an email: the customer gets two answers, and one undoes what the other promised.

Precisely, agents widen the gap between reading state and acting on it: seconds per model call, minutes per run, sometimes days awaiting approval, where ordinary code takes milliseconds. MITRE's CWE-367 names the resulting bug a time-of-check to time-of-use (TOCTOU) race. Outdated memories are [another problem](../16-agent-state-memory/07-memory-pollution-staleness-privacy.md).

## Why an FDE needs this

A home insurer's claims assistant answered WhatsApp messages, each starting an agent run. Customers often type three short messages in a row, so runs overlapped: two or three replies, one asking for a policy number just sent. One run read a claim, spent 40 seconds on model and tool calls, then saved the whole record back, reopening a claim an adjuster had just closed.

The FDE leased each conversation to one run at a time, parked mid-run messages for that run to read before replying, and made claim writes send only changed fields plus the version read. (Illustrative scenario.)

## Key concepts

### One active run per task or conversation

A [queue lease](./03-agent-task-queues-and-workers.md) stops two workers taking one message, not two messages about one conversation starting two runs. For that, lease the conversation or task ID: a lock that expires unless renewed between steps, so a crashed worker cannot hold it forever. Temporal builds this in: one running workflow per ID, with Signal-With-Start sending new messages to it or starting it.

The trap: a run stalled in a slow model call can outlive its lease and still write after a second run takes over. The standard fix is a fencing token: each lease gets a higher number, writes carry it, and storage rejects a number lower than one it has seen.

### Version checks and re-reads

Apply optimistic locking to every agent write: it succeeds only if the version you read is unchanged. Many APIs take an ETag (a version tag) in an `If-Match` header, which HTTP defines against the "lost update" problem; a mismatch returns `412 Precondition Failed`. Patch only changed fields. On a conflict, re-read and decide again; the old plan rests on old facts.

```python
def act_on(task_id, attempts=3):
    for _ in range(attempts):
        task = store.get(task_id)            # data plus its version
        plan = decide(task)                  # slow: model calls, read-only tools
        if store.update(task_id, plan.changes, if_version=task.version):
            return plan
        # changed meanwhile: re-read and re-decide
    return escalate(task_id, "task kept changing")
```

After a long pause such as an approval, re-read what the decision relied on (status, balance, whether someone already replied) before acting irreversibly ([approval pauses](./07-durable-human-approval.md)).

### Messages that arrive mid-run

LangChain's LangSmith Deployment calls this "double texting," with four strategies: enqueue (the default: run it next), reject, interrupt (stop, keep progress, add the new input) and rollback (discard the run, start fresh). Anthropic's Claude Managed Agents (beta) queues events behind earlier ones and accepts a `user.interrupt`. Queuing suits most chat if no reply goes out while newer messages wait; interrupt only between steps, as stopping mid-tool-call can leave half-finished actions. Debouncing bursts belongs to [Bounded Execution](./04-bounded-execution.md).

## Common misconceptions

- **"Our agent handles one conversation at a time, so concurrency does not apply."** Each worker, webhook and schedule can start a parallel run, and people keep editing records.
- **"Deduplication stops double replies."** It stops one message being processed twice, not two different messages starting two runs.
- **"A lock with a timeout keeps runs apart."** A run can outlive its lease in a slow model call and write after another took over; fence or version-check writes.
- **"On a version conflict, just retry the write."** That write carries a decision made on old data: re-read and decide again.

## Typical interview questions

<details>
<summary>What is stale state, and why are agents especially exposed to it?</summary>

Data a run still relies on after it changed. Agents hold reads through model calls, long runs and approvals, so I version-check writes and re-read before irreversible actions.

</details>

<details>
<summary>How does a concurrency bug differ from a duplicate-execution bug?</summary>

A duplicate repeats the same work; deduplication and idempotency keys stop it. A concurrency bug is different runs or people changing shared data at once; one run per key and version checks stop it.

</details>

<details>
<summary>Three quick messages get three agent replies. How do you redesign it?</summary>

One lease or workflow per conversation ID, with mid-run messages queued for it. Before sending, the run checks for newer messages and folds them in.

</details>

<details>
<summary>An agent's CRM update erased a salesperson's edit made mid-run. How do you fix it?</summary>

Trace timestamps typically show a whole-record save from the agent's stale copy landing after the edit. I patch only changed fields with the version read, and re-decide on conflicts.

</details>

## Learn more

- Reference: [Double texting](https://docs.langchain.com/langsmith/double-texting) (LangChain docs, about 5 min)
- Article: [How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html) (Martin Kleppmann, about 25 min)

## Related

- [Race Conditions](../../m1/06-reliability-scale/06-race-conditions.md)
- [Duplicate Execution and Deduplication](./05-duplicate-execution.md)
- [Pausing Agents for Human Approval](./07-durable-human-approval.md)
- [Task State (Plans, Progress, Artifacts)](../16-agent-state-memory/04-task-state.md)
- [Agent Task Queues and Workers](./03-agent-task-queues-and-workers.md)
