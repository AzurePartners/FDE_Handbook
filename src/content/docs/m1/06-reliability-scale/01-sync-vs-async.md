---
title: Sync vs. Async
row: M1-L6.1
---
**In one sentence:** A synchronous request makes the caller wait until the work finishes; an asynchronous request replies immediately and finishes the work separately.

## What it is

The simplest pattern is synchronous: the server does the work, then replies, and the caller, a browser or another service, waits the whole time. That is fine for a fast database lookup that takes milliseconds. It breaks down for slow work, like calling a large language model or generating a report that takes 10 to 60 seconds. Making a caller wait that long risks a timeout, and a user who sees nothing happen often clicks the button again, sending the same slow work twice.

Asynchronous work flips this: the server accepts the request, immediately replies "got it, working on it," and hands the real work off to run separately. The caller gets an ID it can use to check progress later, instead of a finished result right away. Think of a sit-down restaurant with a ticket system: the waiter takes the order fast, the kitchen cooks it off to the side, and the food arrives when it is ready instead of everyone blocking the counter.

Async does not make the underlying work faster. Generating the report still takes the same total time. It only frees the caller from waiting for it.

## Why an FDE needs this

Systems start synchronous because it is the easiest thing to build first. The problem shows up once real traffic hits, when an LLM call or a report takes real time and users double-click the button, or the request times out with a confusing error. An FDE who recognizes this can move the slow work off the request path instead of chasing timeout settings that just delay the same failure.

## Key concepts

```python
# Synchronous: the request waits for the LLM call
@app.post("/summarize")
def summarize(text: str):
    result = call_llm(text)          # takes 20 seconds
    return {"summary": result}

# Asynchronous: the request returns immediately
@app.post("/summarize")
def summarize(text: str):
    job_id = queue.enqueue(call_llm, text)
    return {"job_id": job_id, "status": "processing"}
```

Use asynchronous handling when work is slow, calls a flaky outside service, or the caller does not need the answer instantly, like sending a confirmation email. Keep work synchronous when it is fast and the caller needs the result to continue, like checking whether a username is available.

A caller still needs to learn the result eventually. That usually means polling the job ID or receiving a webhook when it finishes, covered on the Webhook vs. Polling page. The queue and worker that actually run asynchronous work are their own topic too.

## Common misconceptions

- **"Async means faster."** It does not speed up the underlying work. It speeds up the caller's request by not making it wait for that work.
- **"Async here means the same thing as async/await in code."** This page is about an architecture pattern: accept a request, run the work separately, report back later. A language's async/await keywords are a different, code-level way of handling concurrency inside one process.
- **"Background jobs never need a status."** If work takes more than a couple of seconds, the caller needs a way to check progress, or it will assume the request failed.

## Typical interview questions

<details>
<summary>Why move a slow LLM call to run separately instead of inside the request handler?</summary>

A slow call can take many seconds, and HTTP requests often time out before that. Blocking also ties up the server while it waits, limiting how many other requests it can serve. Returning an ID immediately and doing the work separately avoids both problems.

</details>

<details>
<summary>Give an example of a task that should stay synchronous and one that should not.</summary>

Checking if a username is available should stay synchronous, since it is fast and the caller needs the answer to continue. Generating a yearly PDF report should be handled asynchronously, since it can take a long time and the caller can be notified when it is ready.

</details>

<details>
<summary>Does making a task asynchronous make it complete faster?</summary>

No. The work itself takes the same amount of time. What changes is that the caller is no longer blocked waiting for it, and can serve other requests or move on in the meantime.

</details>

## Learn more

- Article: [Job Queues Explained: Workers, Retries and Scheduling](https://blog.openreplay.com/job-queues-explained-workers-retries-scheduling/) (OpenReplay, about 15 min).
- Article: [Background Job and Queue Patterns, 2026 Engineering Reference](https://www.digitalapplied.com/blog/background-job-queue-patterns-2026-engineering-reference) (Digital Applied).

## Related

- [Queues and Workers](./02-queues-and-workers.md)
- [Retries and Backoff](./03-retries-and-backoff.md)
- [Webhook vs. Polling](../03-apis-data-integration/05-webhook-vs-polling.md)
