---
title: Pausing Agents for Human Approval
row: M3-L5.7
---
**In one sentence:** Pausing an agent for human approval means saving its state and the exact action it proposes, releasing the worker that ran it, and resuming from that point when a person decides, minutes or days later.

## What it is

Some agent steps must wait for a person, and the answer may take days. Keeping a program running meanwhile fails: a deploy erases the wait, and each waiting run ties up a worker (a process that runs tasks).

Think of an expense form awaiting a manager's signature: you leave it in the tray, marked with what to sign and by when, rather than wait at the desk.

Precisely, a durable approval pause is a [checkpoint](./02-durable-execution.md) at the approval point: the runtime stores the run's state and a pending request, marks the run waiting and frees the worker. Any worker resumes it when the decision arrives. Which actions need a person is [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md).

## Why an FDE needs this

A logistics client's accounts-payable agent paused payments over $10,000 for a controller. The approval email read "Approve payment to Nordfreight?" with no amount, so controllers approved from memory. Rejections reached the agent as errors, so it re-sent the request. Twelve requests sat three weeks during a controller's leave, and a four-day-old approval paid an invoice the supplier had since credited.

The FDE rebuilt the request around the exact `pay_invoice` call, evidence, invoice version and a deadline (reminder at 24 hours, deputy at 48, expiry at 72). Rejections now return with the reason, and resumed runs re-read the invoice first. (Illustrative scenario.)

## Key concepts

### Save, release, resume

```python
def pause(run, call):
    approvals.create(run_id=run.id, call=call, evidence=run.evidence(),
                     based_on=version_of(call.args), expires_at=now() + TTL)
    run.status = "waiting_approval"
    store.save(run)                            # the worker is now free

def resume(request_id, decision):              # any worker, days later
    req = approvals.consume(request_id)        # atomic: works only once
    run = store.load(req.run_id)
    if decision.kind != "reject" and version_of(req.call.args) != req.based_on:
        decision = Decision("void", "invoice changed since the request")
    run.continue_with(req.call, decision)      # becomes the tool result
```

The request holds the exact call (tool, arguments, call ID), not a summary. OpenAI's Agents SDK docs require consuming each request once, so "concurrent or replayed submissions cannot resume the same snapshot twice."

### How runtimes express the wait

| Style | What happens | Examples |
|---|---|---|
| Interrupt | The run stops and returns the pending request | LangGraph `interrupt()`, OpenAI Agents SDK `needs_approval` |
| Signal or external event | A waiting workflow receives the decision | Temporal Signals, Durable Functions `WaitForExternalEvent` |
| Approval task | Completing an approvals-table row enqueues a resume | Your database or ticketing tool |

In Anthropic's Claude Agent SDK, a permission callback "can stay pending indefinitely" in a live process, while a `defer` hook decision lets the process exit "and resume later from the persisted session."

### Approve, edit or reject

Approve runs the stored call with an idempotency key. Edited arguments pass the same validation and action gate as the model's; LangChain warns big edits may make the model "re-evaluate its approach and potentially execute the tool multiple times." Reject returns the reason as a tool result, so the agent revises or closes the task.

### Deadlines and stale approvals

Waiting is unbounded by default: a LangGraph interrupt "waits indefinitely," and Claude Code's deferred calls have "no timeout or retry limit" (session files are deleted after 30 days by default). Race a durable timer against the decision, as Microsoft's docs show: remind, ask a deputy, then expire as a rejection.

Just before acting, re-read the target and compare its version with `based_on`; if it changed, void the approval and ask again ([general version checks](./06-concurrency-and-stale-state.md)).

## Common misconceptions

- **"If nobody answers, the runtime times the request out."** Many runtimes wait indefinitely by default; build the deadline yourself.
- **"Whoever has the approval link may approve."** OpenAI's docs say "possession of a run ID or decision ID is not authorization." Authenticate and authorize the reviewer.
- **"An approval stays valid until someone uses it."** It covers the data the reviewer saw. Expire it and re-check the target.

## Typical interview questions

<details>
<summary>What does it mean to pause an agent durably for approval?</summary>

The run stores its state and the exact pending call, then frees the worker. A decision resumes it on any worker, so the wait survives deploys and holds no process.

</details>

<details>
<summary>How do interrupts differ from signals or external events?</summary>

An interrupt ends the run and hands back the pending request; you re-run it with the decision. With signals or external events, an engine such as Temporal keeps the execution waiting and delivers the decision to it.

</details>

<details>
<summary>How would you design editor approval for a Content Operations agent?</summary>

Store the exact publish call (article, version, channel), the diff and a deadline, then free the worker. The endpoint authenticates the editor, consumes the request once and enqueues a resume. Remind at 24 hours, escalate at 48, expire at 72; publish only if the version is unchanged.

</details>

<details>
<summary>Editors approved, but some runs never resumed. How do you debug it?</summary>

Trace one request: decision stored, resume enqueued and consumed, state loaded? Usual culprits: state lost in a deploy, a silently failed resume, or a release that changed the agent so old state no longer loads.

</details>

## Learn more

- Reference: [Human Interaction Pattern](https://learn.microsoft.com/en-us/azure/durable-task/common/durable-task-human-interaction) (Microsoft Learn, about 15 min)
- Reference: [Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) (OpenAI Agents SDK, about 12 min)
- Reference: [Human-in-the-loop](https://docs.langchain.com/oss/python/langchain/human-in-the-loop) (LangChain docs, about 15 min)

## Related

- [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](./02-durable-execution.md)
- [Concurrency and Stale State in Agent Systems](./06-concurrency-and-stale-state.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
- [Persistent Agents](./01-persistent-agents.md)
