---
title: Agent Task Queues and Workers
row: M3-L5.3
---
**In one sentence:** An agent task queue holds each agent task until a worker finishes it; configured well, it keeps tasks through crashes, sets aside repeat failures, serves urgent work first and paces model calls to rate limits.

## What it is

An agent task can take minutes, so the request that starts it only queues the task's ID and returns ([basics](../../m1/06-reliability-scale/02-queues-and-workers.md)); separate worker processes pull tasks and run the agent.

Think of a garage's job board: a card is filed only once the car is fixed, and a card whose mechanic walks off returns to the board after a set time.

Precisely: the queue leases each message to one worker, hiding it from others until a timer (a visibility timeout, lock or ack deadline) runs out. The worker acknowledges, deleting the message, once its work is saved; an expired lease means redelivery, so delivery is at least once.

## Why an FDE needs this

A software company's support reply agent pulled tickets from Amazon SQS on default settings. Runs took two to four minutes but the visibility timeout was 30 seconds, so tickets reappeared mid-run and got second replies. Adding workers as the queue grew turned a Monday backlog into rate-limit (429) errors; each task handed back counted as a receive, pushing healthy tickets past the receive limit into an unwatched dead-letter queue. Urgent tickets waited behind a 5,000-ticket re-tagging job.

The FDE gave tasks a five-minute lease that workers extend while running, sized the pool to the rate limit, alerted on dead-lettered tasks and gave re-tagging its own queue. (Illustrative scenario.)

## Key concepts

### Acknowledge late, lease long enough

Acknowledge only after results are saved. Celery, a Python task queue, acknowledges by default "just-in-time before being executed," so a worker killed mid-run loses its task; set `task_acks_late = True`.

A lease shorter than the run lets a second worker start a task still in progress, and defaults suit short jobs: SQS hides a message for 30 seconds (up to 12 hours), Azure Service Bus locks it for 1 minute (up to 5). Keep leases modest, extending them while the worker lives (SQS `ChangeMessageVisibility`, Service Bus lock renewal, Temporal activity heartbeats). Per-step [checkpoints](./02-durable-execution.md) make a redelivery cheap; [deduplication](./05-duplicate-execution.md) makes it safe.

### Limited retries and a dead-letter queue

Every unacknowledged delivery counts; past a limit (SQS `maxReceiveCount`, Service Bus max delivery count, default 10) the task moves to a dead-letter queue (DLQ). Poison tasks, which fail every time (say, a document too big for the context window), repeat model calls on every retry, so dead-letter permanent errors at once and give transient ones (timeouts, 429s, 5xx) a few [backed-off attempts](../../m1/06-reliability-scale/03-retries-and-backoff.md). Temporal retries activities without limit unless you cap them. Alert on every DLQ entry.

### Pools sized to the rate limit

The pool size, not the arrival rate, caps concurrent model calls; which messages deserve a task is [trigger control](./04-bounded-execution.md). Size the pool from the account-wide rate limit: calls in flight equal calls per second times seconds per call, so 120 requests per minute with 15-second calls sustains about 30. Tokens may bind first: 400,000 input tokens per minute fits only 20 calls of 20,000 tokens. Workers wait on a shared limiter before taking tasks: one handed back after a 429 still counts as a delivery.

### Priorities

One first-in, first-out queue puts urgent work behind bulk jobs. Give each class its own queue with reserved workers or a reserved rate-limit share; a shared pool that always drains the urgent queue first can starve bulk work. Anthropic also lets you cap a workspace's rate limits, so a bulk job's key cannot exhaust the organization's limit.

## Common misconceptions

- **"Once a worker picks up a task, it will finish."** With early acknowledgement, a crash or restart mid-run loses the task silently.
- **"A longer visibility timeout is always safer."** It prevents duplicate runs but delays recovery: a crashed worker's task stays hidden until the lease ends.
- **"More workers make the agents faster."** Past the rate limit they add only 429s; Microsoft warns unbounded autoscaling "only moves the overload to downstream dependencies."

## Typical interview questions

<details>
<summary>What is an acknowledgement, and when should a worker send it?</summary>

It tells the queue the task is done, deleting it. I send it only after results are saved; if the worker dies first, the task is redelivered, so handlers must tolerate repeats.

</details>

<details>
<summary>How does a visibility timeout differ from a model call timeout?</summary>

A call timeout bounds one wait on the provider. A visibility timeout is how long the queue waits before giving the whole task to another worker, so it must outlast the run or be extended.

</details>

<details>
<summary>Design queues for urgent live tickets and a 50,000-ticket re-tagging job.</summary>

Two queues: live tickets get reserved workers and a reserved share of the rate limit; re-tagging gets a capped pool. Both use late acknowledgement, lease extension and an alerting DLQ.

</details>

<details>
<summary>During a rate-limit spike, 300 healthy tasks landed in the dead-letter queue. Why?</summary>

Workers took tasks, hit 429s and released them, and each release counted as a delivery until the redrive limit tripped. I would re-drive them, gate pickup on a shared limiter and pause consumers during provider outages.

</details>

## Learn more

- Article: [Competing Consumers pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/competing-consumers) (Microsoft Learn, about 10 min)
- Article: [Priority Queue pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/priority-queue) (Microsoft Learn, about 10 min)
- Reference: [Amazon SQS visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) (AWS documentation, about 6 min)

## Related

- [Queues and Workers](../../m1/06-reliability-scale/02-queues-and-workers.md)
- [Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md)
- [Bounded Execution (Budgets, Step Limits, Trigger Control)](./04-bounded-execution.md)
- [Duplicate Execution and Deduplication](./05-duplicate-execution.md)
- [Retries and Backoff](../../m1/06-reliability-scale/03-retries-and-backoff.md)
