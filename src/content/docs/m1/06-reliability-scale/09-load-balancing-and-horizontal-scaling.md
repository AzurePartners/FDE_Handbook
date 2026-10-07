---
title: Load Balancing and Horizontal Scaling
row: M1-L6.4
---
**In one sentence:** When one server cannot handle the traffic, you either make that server bigger (vertical scaling) or run more copies and split the traffic between them (horizontal scaling), which needs a load balancer.

## What it is

Vertical scaling means giving a single server more CPU, memory, or disk. It is simple, since the app does not change, but it has a ceiling and remains a single point of failure: if that server goes down, everything goes down with it.

Horizontal scaling means running multiple copies of the server and spreading traffic across them. It has no real ceiling and survives one server crashing, but each copy must behave consistently no matter which one handles a request. That job belongs to a load balancer, which sits in front of the servers and routes each request to one of them.

For horizontal scaling to work, each server needs to be stateless: it cannot keep something like a shopping cart only in its own memory, or a request routed elsewhere would find nothing there. Stateless servers keep that data somewhere shared, like a database or Redis, so any server can handle any request.

## Why an FDE needs this

A client's system that worked fine in a pilot with 10 users can fall over at 500, and the cause is almost never "the code is slow." It is usually that the app was never built to run more than one copy. "Just add more servers" does nothing if they are not stateless, since a request can land on a server with none of the user's data.

## Key concepts

| | Vertical scaling | Horizontal scaling |
|---|---|---|
| How | Bigger single machine | More copies of the machine |
| Ceiling | Limited by the biggest machine | Effectively unlimited |
| Failure | Single point of failure | Survives one instance failing |
| Requirement | None | App must be stateless |

```
                 +-----------+
 requests  --->  |   Load    |  ---> Server A
                 | Balancer  |  ---> Server B
                 |           |  ---> Server C
                 +-----------+
```

A load balancer also checks server health and stops sending traffic to one that stopped responding, so horizontal scaling improves reliability, not just capacity.

**Session data**: a classic mistake is storing a logged-in user's session only in the memory of the server that handled their login. The next request can land on a different server that has never heard of that session, and the user gets logged out at random. Moving session data to a shared store like Redis fixes this. Sticky sessions, pinning each user to one server, are a workaround, but lose the session if that server dies.

Adding more app servers does not help if the bottleneck is somewhere else, most often the database, covered on Database Bottlenecks.

## Common misconceptions

- **"Adding more servers always fixes slowness."** Only if the app servers are the bottleneck and are stateless. If the database is the bottleneck, more app servers just send more requests at an already overloaded database.
- **"Vertical scaling is old-fashioned."** It is often the simplest, cheapest first step before traffic justifies the extra complexity of horizontal scaling.
- **"A stateless server has no data."** It means it does not keep per-request state only in local memory. It can still read and write shared data.

## Typical interview questions

<details>
<summary>What is the difference between vertical and horizontal scaling?</summary>

Vertical scaling gives one server more resources. Horizontal scaling runs multiple copies and spreads traffic with a load balancer, giving a higher ceiling and surviving one instance failing, but it requires the app to be stateless.

</details>

<details>
<summary>Why do app servers need to be stateless to scale horizontally?</summary>

A load balancer can send a user's requests to any available server. If a server keeps user-specific data only in its own memory, a request routed elsewhere would not find it. Keeping that state in a shared store, like a database or Redis, lets any server handle any request correctly.

</details>

<details>
<summary>A client added more app servers but the app is still slow. What would you check?</summary>

Whether the database is the real bottleneck, since more app servers do not help if they wait on one overloaded database. I would check for slow queries, missing indexes, and connection pool usage against the limit.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, load balancers and scaling sections).
- Reference: [system-design-101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo, GitHub).

## Related

- [Caching](./08-caching.md)
- [Database Bottlenecks](./10-database-bottlenecks.md)
- [Compute Options](../05-containers-deployment/05-compute-options.md)
- Goes deeper in Module 4: [Scaling Concepts: Concurrency, Bottlenecks & Horizontal Scaling](../../m4/04-reliability-cost-latency-and-scale/04-scaling-concepts-concurrency-bottlenecks-and-horizontal.md)
