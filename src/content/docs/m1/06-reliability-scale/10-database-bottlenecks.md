---
title: Database Bottlenecks
row: M1-L6.4
---
**In one sentence:** App servers are easy to add because they are stateless, but the database holds the actual state, so it is often the real limit once an app has scaled out.

## What it is

Adding more app servers is straightforward: they are interchangeable copies with no data of their own (see Load Balancing and Horizontal Scaling). The database cannot simply be copied five times with each copy taking independent writes, since they would disagree about the data. That makes it the part most likely to become the bottleneck as traffic grows.

A handful of problems cause most database slowdowns: slow queries, missing indexes, N+1 queries, and lock contention.

## Why an FDE needs this

"The app is slow" almost always turns into "one part of the database work is slow" once you look closer. A client blames the server, adds more app servers, and nothing improves, because the app servers were never the bottleneck. Recognizing the specific problem separates a fix from a longer outage.

## Key concepts

### Slow queries

A query that scans far more rows than it needs to gets slower as the table grows. A query fine in testing on a thousand rows can take seconds against a million. Most databases can show a query's execution plan, revealing a full scan versus an index.

### Missing indexes

An index lets the database jump to matching rows instead of scanning every row, similar to a book's index versus reading every page. A query filtering or sorting on a column with no index forces a full scan. Indexes speed up reads but add overhead to writes, so they get added deliberately on columns actually searched or joined on often.

### N+1 queries

This happens when code fetches a list, then loops over it and runs one more query per item, for example fetching 50 orders and querying each order's customer separately: 1 query plus 50 more. The fix is fetching the related data in one query with a join or a batched lookup.

```python
# N+1: one query per order
orders = db.query("SELECT * FROM orders")
for order in orders:
    customer = db.query(
        "SELECT * FROM customers WHERE id = %s", order.customer_id
    )

# Fixed: one query total
rows = db.query("""
    SELECT orders.*, customers.*
    FROM orders JOIN customers ON orders.customer_id = customers.id
""")
```

### Lock contention

A database locks a row while it is being written, so a second write waits. This is normal and usually brief. It becomes a bottleneck when many operations compete for the same rows, or a transaction holds a lock longer than needed.

### Read replicas

At a high level, read replicas are synced copies of the database that serve read queries, taking load off the primary. Writes still go to the primary, and replicas lag slightly behind it. This helps a read-heavy app but does not solve a write bottleneck, and a slow query is still slow on a replica.

Two related fixes live on their own pages: Connection Limits and Pooling, and cutting repeated reads out entirely with Caching.

## Common misconceptions

- **"More app servers fix a slow database."** They add more callers waiting on the same slow database, which can make things worse, not better.
- **"An index always makes things faster."** Indexes speed up matching reads but slow down writes to that table, so adding one to every column is not free.
- **"Read replicas let you scale writes too."** Replicas serve reads only. Writes still go through the primary.

## Typical interview questions

<details>
<summary>What is an N+1 query problem and how do you fix it?</summary>

Fetching a list, then running one more query per item in a loop, instead of one query for everything. The fix is combining it into a single query with a join or a batched lookup.

</details>

<details>
<summary>What does a database index do, and why not add one to every column?</summary>

It lets the database jump to matching rows instead of scanning the whole table. Every index adds overhead to writes, so indexes are added deliberately on columns actually queried often.

</details>

<details>
<summary>A client added more app servers but the app is still slow. What would you check on the database side?</summary>

Slow queries and their execution plans, missing indexes, an N+1 pattern in the code, and whether connections are exhausted or requests are stuck behind locks.

</details>

## Learn more

- Reference: [System Design Primer](https://github.com/donnemartin/system-design-primer) (GitHub, database section).
- Reference: [system-design-101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo, GitHub).

## Related

- [Connection Limits and Pooling](./07-connection-limits-and-pooling.md)
- [Caching](./08-caching.md)
- [Load Balancing and Horizontal Scaling](./09-load-balancing-and-horizontal-scaling.md)
- Goes deeper in Module 4: [Scaling Concepts: Concurrency, Bottlenecks & Horizontal Scaling](../../m4/04-reliability-cost-latency-and-scale/04-scaling-concepts-concurrency-bottlenecks-and-horizontal.md)
