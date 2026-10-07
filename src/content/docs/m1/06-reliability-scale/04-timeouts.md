---
title: Timeouts
row: M1-L6.2
---
**In one sentence:** A timeout limits how long a caller waits for a response before giving up, instead of waiting forever.

## What it is

Any call to another service, a database, an API, another server, can hang: the network drops a packet, the other side is overloaded, or it never answers. Without a limit, the caller waits indefinitely, holding a thread or connection open. A timeout sets a maximum wait, after which the caller gives up and frees that resource.

Most HTTP libraries split this into two timeouts. A connect timeout limits how long the caller waits to establish the connection, the handshake before data moves. A read timeout limits how long it waits for data once connected, covering a server that connects fine but sits silently. A slow server usually trips the read timeout, not the connect timeout.

## Why an FDE needs this

Many HTTP libraries have no default timeout, or one so long it might as well not exist. One slow dependency call with no timeout set can hang a request handler indefinitely. Under real traffic, several hung requests can exhaust all available workers, taking down a system with no bug of its own.

## Key concepts

| | Connect timeout | Read timeout |
|---|---|---|
| Limits | Time to establish the connection | Time waiting for data once connected |
| Trips when | The other host is unreachable or slow to accept | The other host accepted but never responds |

"No timeout" is the default in many libraries, and it is a danger, not a safe choice: it means "wait forever," turning one slow dependency into an outage for everything waiting on it.

## Common misconceptions

- **"Timeouts and retries are the same thing."** A timeout decides when to give up on one attempt; a retry decides whether to try again after that. A system needs both.
- **"No timeout is safer than a short one."** No timeout means "wait forever." A caller stuck waiting can exhaust its own resources, with no bug in its own code.

## Typical interview questions

<details>
<summary>What happens if a caller sets no timeout on a slow dependency call?</summary>

The caller can hang indefinitely, tying up the thread or connection that made the call. Under load this can exhaust available workers and take down the caller's system, even though its code has no bug.

</details>

<details>
<summary>What is the difference between a connect timeout and a read timeout?</summary>

A connect timeout limits how long the caller waits to establish the connection. A read timeout limits how long it waits for data once connected. A server that never responds after accepting trips the read timeout.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, reliability section).

## Related

- [Retries and Backoff](./03-retries-and-backoff.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
- Goes deeper in Module 4: [Reliability: Timeouts, Retries, Fallbacks, Circuit Breakers, Batching & Caching](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
