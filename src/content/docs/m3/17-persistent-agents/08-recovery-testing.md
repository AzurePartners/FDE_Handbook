---
title: Recovery Testing (Failure Injection)
row: M3-L5.8
---
**In one sentence:** Recovery testing means breaking a persistent agent on purpose mid-task (killing its worker, dropping a model reply, delivering a message twice), then checking that it resumes at the right step without sending, paying or updating anything twice.

## What it is

A [persistent agent](./01-persistent-agents.md) should survive crashes, deploys and lost messages. Recovery testing proves yours does by breaking real tasks on purpose.

Think of a fire drill: exits on a floor plan prove nothing until someone pulls the alarm and counts heads outside.

Precisely, failure (or fault) injection introduces one known failure at one point, with the expected outcome written first. Microsoft's engineering playbook calls it "a specific approach to testing one condition," unlike chaos engineering, "a practice for generating new information." The same drill works on any runtime that saves task state, such as LangGraph or Temporal.

## Why an FDE needs this

A wealth manager's Finance research agent builds quarterly client reviews over two days, ending with compliance approval and publication to the client portal. The vendor had "shown recovery" by restarting an idle worker. In the pilot, a deploy killed workers mid-step: one review restarted from scratch (an in-memory checkpointer had shipped), another was published twice. An approval nobody answered over a weekend left its task waiting silently.

The FDE paused the pilot and built a failure matrix, which also caught a step budget resetting on restarts. After fixes, passing the matrix became a go-live criterion. (Illustrative scenario.)

## Key concepts

### The failures to induce

| Failure | How to induce it |
|---|---|
| Kill a worker mid-step | `kill -9` its process, or force-stop its container |
| Restart during a tool call | Crash before the call, during it, and after it but before the result is saved |
| Drop a model response | Make the call time out or hang |
| Time out an approval | A fake clock, or a time-skipping test mode (Temporal has one) |
| Deliver a message twice | Enqueue one message twice, or let a lock expire mid-run |

Use a hard kill: SIGKILL "cannot be caught, blocked, or ignored" (Python docs), like a crash. Deploys kill too: Kubernetes sends SIGTERM, then SIGKILL after a grace period (30 seconds by default), killing any step still running. Anthropic's Python SDK retries timeouts and 5xx errors twice by default, so drop three replies in a row.

### Crash points you can aim

Random kills rarely hit the act-then-record gap, so add crash points tests can arm:

```python
def crash_point(name):                        # no-op unless a test arms it
    if os.environ.get("CRASH_AT") == name:
        os.kill(os.getpid(), signal.SIGKILL)  # die like a real crash

portal.publish(review, idempotency_key=f"{task.id}:publish")
crash_point("after_publish")                  # acted, not yet recorded
store.complete_step(task.id, "publish")

def test_crash_after_publish(start_worker, portal, store):
    task = store.create_task("review:ACME-Q3")
    start_worker(env={"CRASH_AT": "after_publish"}).wait()
    start_worker().wait()                     # a fresh process resumes
    assert store.get(task.id).status == "done"
    assert portal.count(ref=task.id) == 1
```

Use recorded model replies ([Replayable Tests](../18-agent-evaluation-debugging/06-replayable-tests.md)) so only the failure varies.

### What to check afterwards

- **Right resume step:** the task picks up at the interrupted step, not the start.
- **No duplicate side effects:** count emails, records or payments in the sandbox target system, not in logs a killed worker never finished ([deduplication](./05-duplicate-execution.md)).
- **State and journal agree:** the task record, the [journal](../16-agent-state-memory/08-persistence-patterns.md) and the target system tell the same story, step by step.
- **Budgets hold:** usage before the crash still counts, and a task that crashes every time ends in the [dead-letter queue](./03-agent-task-queues-and-workers.md).

### When to run, and the evidence

Run the matrix in staging before a pilot and after any runtime change (framework, checkpointer, queue, deploy or new tool). File each result (injection point, expected versus observed outcome, trace ID, versions) in the delivery pack for the client to re-run.

## Common misconceptions

- **"Our framework checkpoints every step, so recovery just works."** LangGraph's in-memory checkpointers, for one, lose everything on restart. Only a killed process proves recovery.
- **"We restarted the worker and it carried on, so recovery is tested."** Real crashes land mid-step, not between tasks, so aim a hard kill between acting and recording.
- **"The task finished, so it recovered."** It may have published twice or overspent; check the target system, journal and budgets too.

## Typical interview questions

<details>
<summary>What is recovery testing for a persistent agent?</summary>

Injecting one known failure, like a killed worker, at a chosen point in a real task, then checking resume step, side effects, journal and budgets against the expected outcome.

</details>

<details>
<summary>How does fault injection testing differ from chaos engineering?</summary>

Fault injection tests one known condition with a predicted outcome, usually in staging. Chaos engineering experiments, often in production, to find weaknesses nobody predicted. A pilot needs the first.

</details>

<details>
<summary>How would you recovery-test an agent that waits 48 hours for approval, then emails a supplier?</summary>

SIGKILL the worker around the send, drop model replies past the SDK's retries, expire the approval with a time-skipping clock and enqueue the request twice. Pass: one email, the right resume step, budgets carried over.

</details>

<details>
<summary>After a crash test, the journal lists one publish but the portal shows two. What happened?</summary>

The worker died after publishing but before recording it, so the resumed step published again. I would add a task-and-step idempotency key, then re-run that crash point as proof.

</details>

## Learn more

- Article: [Fault Injection Testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/fault-injection-testing/) (Microsoft Engineering Fundamentals Playbook, about 8 min)
- Reference: [Testing - Python SDK](https://docs.temporal.io/develop/python/best-practices/testing-suite) (Temporal documentation, about 10 min)

## Related

- [Durable Execution (Checkpoints, Replay, Recovery)](./02-durable-execution.md)
- [Duplicate Execution and Deduplication](./05-duplicate-execution.md)
- [Three Kinds of Test Case: Happy, Edge, Failure](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [Replayable Tests for Agent Workflows](../18-agent-evaluation-debugging/06-replayable-tests.md)
- [Persistence Patterns (Workspace, Landing Pad, Journal)](../16-agent-state-memory/08-persistence-patterns.md)
