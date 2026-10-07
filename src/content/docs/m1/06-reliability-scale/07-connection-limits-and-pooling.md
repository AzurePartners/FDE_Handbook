---
title: Connection Limits and Pooling
row: M1-L6.3
---
**In one sentence:** A connection pool is a small set of already-open connections an app keeps ready to reuse, instead of opening a new one for every request, because a database can only handle so many connections at once.

## What it is

Opening a database connection is not free. It involves a network handshake, authentication, and setup on the database side, taking tens of milliseconds. Opening one per query and closing it right after wastes that cost repeatedly, and every database caps how many connections it will hold open.

A connection pool solves both problems. The app opens a fixed number of connections up front and keeps them alive. A request that needs the database borrows a connection from the pool, uses it, and returns it, instead of opening and closing its own. Reusing connections is faster than establishing new ones, and the pool keeps the app from opening more than it means to.

## Why an FDE needs this

Every database caps its total connections. Each app server keeps its own pool, so more app servers means more pools, and the sum of every pool's max size can exceed what the database allows. This is a common, avoidable incident: a client scales out to handle more traffic, and the database starts rejecting connections, not because it is doing more work, but because too many idle connections are held open across the new copies. The fix is sizing each pool with the total server count in mind.

## Key concepts

**Pool size** is the maximum number of connections a single app instance's pool will hold. Too small, and requests queue up waiting for a free connection. Too large, multiplied across many app servers, and it can exceed the database's connection limit on its own.

**Waiting on the pool**: when every connection is busy, a new request usually waits, often with its own short timeout, rather than failing. A spike in slow queries can starve the pool: connections stay checked out longer, so requests pile up, and the app looks slow even though the database may not be overloaded.

**The math across servers**: if a database allows 100 connections and each of 5 app servers runs a pool of 30, that is 150 possible connections against a limit of 100. This is easy to miss until a second or third server is added.

**Pooling versus caching**: pooling makes reusing a connection cheap; it does not reduce query count. Cutting queries in the first place is a caching problem, covered on the Caching page.

## Common misconceptions

- **"A bigger pool is always better."** A pool that is too large, multiplied across every app server, can push the total past what the database allows, even if no single server looks busy.
- **"Pool exhaustion means the database is overloaded."** It can also mean queries are running slowly and holding connections longer, starving the pool without the database doing more work.
- **"Pooling and caching solve the same problem."** Pooling makes each database round trip cheaper. Caching avoids some round trips entirely. A system usually needs both.

## Typical interview questions

<details>
<summary>What is a connection pool and why does an app use one instead of opening a new connection per request?</summary>

A set of already-open connections an app keeps ready to reuse. Opening a connection has real setup cost, and every database caps how many it will accept, so reusing a fixed set is faster and keeps the app within that limit.

</details>

<details>
<summary>A client added more app servers and the database started rejecting connections. What would you check?</summary>

Whether the sum of every app server's pool size now exceeds the database's total connection limit. More app servers each running their own pool can add up past what the database allows.

</details>

<details>
<summary>Requests are slow and timing out waiting for a database connection. What are two possible causes?</summary>

The pool may simply be too small for the traffic. Or queries may be running slowly and holding connections longer than usual, so the pool looks exhausted even though the database is just backed up on slow work.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, scaling section).

## Related

- [Load Balancing and Horizontal Scaling](./09-load-balancing-and-horizontal-scaling.md)
- [Database Bottlenecks](./10-database-bottlenecks.md)
- [Caching](./08-caching.md)
- Goes deeper in Module 4: [Scaling Concepts: Concurrency, Bottlenecks & Horizontal Scaling](../../m4/04-reliability-cost-latency-and-scale/04-scaling-concepts-concurrency-bottlenecks-and-horizontal.md)
