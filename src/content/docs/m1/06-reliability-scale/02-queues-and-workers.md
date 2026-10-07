---
title: Queues and Workers
row: M1-L6.1
---
**In one sentence:** A queue holds jobs waiting to run, and a worker is a separate process that pulls jobs off the queue and runs them.

## What it is

Once work moves off the request path (see Sync vs. Async), something has to actually run it. A queue is an ordered holding area for jobs waiting to run. A job is one unit of work, with input and a unique ID, so its progress and result can be looked up later. A worker is a separate process that pulls jobs off the queue, does the work, and records the result.

This separation is what makes the pattern useful. The server that accepted the request stays free to handle the next one. The worker can run on a different machine, and more workers can be added when the queue backs up, without touching the code that accepts requests.

A dead-letter queue holds jobs that failed too many times, so a person can inspect what went wrong instead of the job retrying forever or silently vanishing.

## Why an FDE needs this

Putting a task on a queue is not the same as it being handled. A job can sit there, fail silently, or never get picked up if the worker that should run it crashed. "The queue handled it" is not "the system handled it." In client work this shows up as a report that never generates or an email that never sends, with nothing in the interface to say why. A system is reliable only if failed jobs stay visible, usually through a dead-letter queue and monitoring, not just a queue.

## Key concepts

| Term | What it is |
|---|---|
| Job | One unit of work, with input and a unique ID |
| Queue | The ordered holding area for jobs waiting to run |
| Worker | A separate process that pulls jobs and runs them |
| Dead-letter queue | Holds jobs that failed too many times, for a person to inspect |

Workers crash and get redeployed like any other process. A job that was in progress at that moment needs a retry plan, covered on the Retries and Backoff page, or it is simply lost.

Adding more workers speeds up a backed-up queue only if the workers themselves are the bottleneck. If every job calls a rate-limited external API or a database that is already at its connection limit, more workers just create more callers waiting on that same limit.

## Common misconceptions

- **"Putting it on a queue makes it reliable."** A queue only holds work until something runs it. Reliability comes from retries, dead-letter handling, and monitoring that someone actually watches.
- **"Worker crashes are rare enough to ignore."** Workers crash and get redeployed routinely. A job in progress at that moment needs a retry plan.
- **"More workers always clears the backlog faster."** Only if workers are the bottleneck. If they are all waiting on the same rate-limited API or database, adding more just adds more waiting.

## Typical interview questions

<details>
<summary>What is a dead-letter queue and why does it matter?</summary>

A separate place where jobs go after failing more than a set number of times, instead of retrying forever or disappearing. It matters because it makes failures visible so someone can fix what broke.

</details>

<details>
<summary>A client says "we put it on a queue, so it's handled." What would you ask?</summary>

Is there monitoring for jobs that fail or get stuck? Is there a dead-letter queue or alert for repeated failures? What happens if a worker crashes mid-job? Who checks failed jobs, and how often?

</details>

<details>
<summary>Why might adding more workers not speed up a backed-up queue?</summary>

If the real bottleneck is something the workers all share, like a rate-limited external API or a database connection limit, more workers just means more callers waiting on that same limit. The fix is addressing the shared bottleneck, not adding workers.

</details>

## Learn more

- Article: [Job Queues Explained: Workers, Retries and Scheduling](https://blog.openreplay.com/job-queues-explained-workers-retries-scheduling/) (OpenReplay, about 15 min).
- Article: [Why Your Background Jobs Fail in Production](https://dev.to/damir-karimov/why-your-background-jobs-fail-in-production-3nne) (DEV).

## Related

- [Sync vs. Async](./01-sync-vs-async.md)
- [Retries and Backoff](./03-retries-and-backoff.md)
- [Connection Limits and Pooling](./07-connection-limits-and-pooling.md)
