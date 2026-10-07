---
title: Duplicate Execution and Deduplication
row: M3-L5.5
---
**In one sentence:** Duplicate execution is a persistent agent repeating a step after a retry, crash or repeated message; deduplication lets the repeat recognize the first attempt, so a refund, email or booking happens only once.

## What it is

Persistent agents survive failures by trying again, so any step can run twice. A repeated read wastes tokens; a repeated side effect (a change outside the agent, like an email sent or money moved) hits the customer twice.

Think of a payment page that freezes after you click Pay. Before clicking again, you check your account for a payment with that invoice number. An agent needs the same habit.

Precisely: queues such as Amazon SQS standard queues promise at-least-once delivery and durable runtimes at-least-once execution: nothing is lost, anything may repeat. "Exactly once" is an effect you build by giving each message, task and write a stable ID, so a repeat gets the first result.

## Why an FDE needs this

A property manager's maintenance agent booked contractors from tenant emails. One burst pipe brought two plumbers and two call-out fees. The trace showed a worker restart after the booking call, before saving progress; the resumed run re-asked the model, which picked a different firm, so the tool's argument-matching duplicate check saw a new booking. A retried email webhook had also opened a second work order.

The FDE made intake drop already-seen message IDs, had the agent save each decision with a task-and-step key before acting and replay it after restarts, and stored the key in the booking's reference field for lookups before any retry. A [kill-the-worker test](./08-recovery-testing.md) then produced one booking. (Illustrative scenario.)

## Key concepts

### Where duplicates come from

- **Redelivery:** a queue or webhook resends a message, or an [expired lease](./03-agent-task-queues-and-workers.md) hands a running task to a second worker.
- **Retry after a timeout:** the write landed; only the reply was lost.
- **Crash after acting:** Temporal describes a worker crashing "just before it notifies" the server, so the activity reruns.
- **Resume:** after an interrupt or retry, LangGraph re-runs the node "from the start of its function."
- **Repeat request:** "Did you cancel it? Please cancel." has a new message ID.

### Deduplicating tasks and messages

Record each incoming message's source ID (an email's `Message-ID`, a webhook's event ID) in a column with a unique constraint, so the database rejects repeats. Build task IDs from business keys, such as the complaint number in `refund:C-7731`, so a repeat request finds the existing task.

### Idempotency keys on every write

Every write carries an [idempotency key](../../m1/06-reliability-scale/05-idempotency.md) built from the task and step; Temporal suggests run ID plus activity ID, "consistent across retry attempts but unique among Workflow Executions." The target system enforces it; if it cannot, store the key in a searchable reference field.

### Save the decision before acting

A re-asked model may choose differently ("identical inputs may produce different outputs across API calls," per Anthropic). Durable runtimes record and replay the model's reply ([Durable Execution](./02-durable-execution.md)); code that decides and acts in one step must save it:

```python
def act(task_id, step, decide):
    rec = decisions.get(task_id, step)
    if rec is None:
        tool, args = decide()                        # the model call
        rec = decisions.insert(task_id, step, tool, args, key=f"{task_id}:{step}")
    elif rec.status == "done":
        return rec.result
    elif found := target.find(rec.tool, rec.key):    # pending: look first
        return decisions.done(rec, found)
    result = target.run(rec.tool, rec.args, idempotency_key=rec.key)
    return decisions.done(rec, result)
```

A timeout or leftover pending record means unknown, not failed: look before retrying with the same key. With neither keys nor lookup, ask a person and report the step as unconfirmed ([Tool Results and Error Returns](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)).

## Common misconceptions

- **"Our queue or workflow engine runs each step exactly once."** They promise at least once; Temporal itself asks for idempotent activities.
- **"A new UUID per call is an idempotency key."** A key that changes each attempt makes every retry look new.
- **"After a crash, the agent will decide the same way."** Model output varies between calls; save the decision and replay it.
- **"A timeout means the write failed."** It may have landed with only the reply lost. Look first.

## Typical interview questions

<details>
<summary>What is duplicate execution, and what causes it?</summary>

A step or side effect running more than once. Causes: redelivered messages, retries after timeouts, crashes between acting and saving, steps re-run on resume, and users asking twice.

</details>

<details>
<summary>How does deduplicating tasks differ from idempotent tool calls?</summary>

Task deduplication stops a repeated message from starting a second run; idempotency keys stop a retried or resumed step from repeating its write. A crash mid-run is not a duplicate message, so you need both.

</details>

<details>
<summary>Your agent's refund call timed out. What happens next?</summary>

Unknown, not failed, so it searches the billing system for a refund with the step's key: found, mark the step done; not found, retry with the same key; no keys or lookup, ask a person.

</details>

<details>
<summary>After a deploy, one complaint produced two refunds of different amounts. What happened?</summary>

Probably a worker restart between the first refund and its save, so the resumed run re-asked the model and got a new amount. I would save each decision with a task-and-step key before acting, replay it, and prove the fix with a kill-the-worker test.

</details>

## Learn more

- Reference: [Activity Definition: Idempotency](https://docs.temporal.io/activity-definition#idempotency) (Temporal documentation, about 5 min)
- Article: [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) (Amazon Builders' Library)
- Reference: [Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts#side-effects-called-before-interrupt-must-be-idempotent) (LangChain docs, side-effects section, about 5 min)

## Related

- [Idempotency](../../m1/06-reliability-scale/05-idempotency.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](./02-durable-execution.md)
- [Agent Task Queues and Workers](./03-agent-task-queues-and-workers.md)
- [Tool Results and Error Returns](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md)
- [Concurrency and Stale State in Agent Systems](./06-concurrency-and-stale-state.md)
