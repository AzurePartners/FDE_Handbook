---
title: "Scaling Concepts: Concurrency, Bottlenecks & Horizontal Scaling"
row: M4-L4.4
---
**In one sentence:** Scaling is what happens when many users hit the system at once, and the judgment that matters is spotting where it will bottleneck (queue depth, database, or API limits) and knowing that horizontal scaling and queues, not heroics, are the usual answer, without needing to build a giant cluster yourself.

## What it is

Under load, a system that worked for one user can fall over. The general scaling concepts, load balancing, horizontal scaling, and database bottlenecks, are covered in Module 1 ([Load Balancing & Horizontal Scaling](../../m1/06-reliability-scale/09-load-balancing-and-horizontal-scaling.md) and its neighbours); here the emphasis is where **AI features** bind. Key ideas: **concurrency** (many requests in flight at once), **queue depth** (work waiting to be processed, a growing queue signals you can't keep up), **bottlenecks** (the slowest shared resource, often the database or a rate-limited external API, that caps throughput), and **horizontal scaling** (adding more instances to handle more load, versus vertical scaling, a bigger single machine). For AI features the bottleneck is frequently the model API's rate limit or a database, not your own compute. The FDE skill is judgment: predicting where load will bind and choosing queues/horizontal scaling appropriately, not building infrastructure for its own sake.

## Why an FDE needs this

A feature demoed with one user can break at customer scale, and the failure is usually a predictable bottleneck. An FDE has to anticipate "what happens at 500 concurrent users?" and design so the answer is "it queues and keeps up" rather than "it falls over." You rarely build large clusters, but you must reason about where the system binds and apply the standard remedies.

## Key concepts

- **Concurrency:** simultaneous in-flight requests; the system must handle bursts.
- **Queue depth:** backlog size; growing depth means throughput < arrival rate.
- **Bottleneck:** the limiting shared resource (DB, rate-limited API); optimize or scale it.
- **Horizontal scaling:** more instances behind a load balancer; usually preferred over one bigger machine.
- **Backpressure/queues:** absorb bursts and smooth load rather than overwhelming a bottleneck.
- **Judgment over cluster-building:** identify the bind and apply standard remedies; don't over-engineer.

## Common misconceptions

- **"It worked in the demo, so it scales."** One user hides bottlenecks that only appear under concurrency.
- **"Just add a bigger machine."** Vertical scaling has limits; horizontal scaling and queues usually scale further.
- **"The bottleneck is our compute."** For AI features it's often the model API rate limit or the database, scale/relieve the actual bind.

## Typical interview questions

<details>
<summary>A feature works for one user but you expect 500 concurrent. What do you check?</summary>

Where it will bottleneck: the model API's rate limits, the database, or any shared external dependency, and how deep the work queue would grow. I'd add queuing to absorb bursts, scale the binding resource (horizontal instances, higher API tier, DB capacity), and load-test to confirm throughput keeps up rather than the queue growing unbounded.

</details>

<details>
<summary>Horizontal vs vertical scaling?</summary>

Vertical scaling is a bigger single machine, simple but capped and a single point of failure. Horizontal scaling adds more instances behind a load balancer, which scales further and adds redundancy. For most production load, horizontal scaling plus queuing is the usual answer, with the real work being to relieve the actual bottleneck.

</details>

## Learn more

- Repo: [System Design Primer](https://github.com/donnemartin/system-design-primer) (horizontal scaling, queues, backpressure)
- Article: [Idempotency](https://algomaster.io/learn/system-design/idempotency) (safe retries, now applied to model calls)

## Related

- [Module 1 → Load Balancing & Horizontal Scaling](../../m1/06-reliability-scale/09-load-balancing-and-horizontal-scaling.md) (general scaling concepts)
- [Latency Budgets & Parallelization](./03-latency-budgets-and-parallelization.md)
- [Deployment, CI/CD & Rollback](../05-deployment-ci-cd-observability-and-production-readiness/01-build-test-deploy-and-rollback-ci-cd-basics.md)
