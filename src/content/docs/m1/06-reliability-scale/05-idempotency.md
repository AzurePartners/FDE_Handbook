---
title: Idempotency
row: M1-L6.2
---
**In one sentence:** An idempotent operation gives the same end result no matter how many times you run it, so retrying it safely never causes duplicates.

## What it is

Imagine a user double-clicks "Pay Now" because the page felt slow. If the payment endpoint charges the card every time it gets a request, that double-click means a double charge. Idempotency prevents this: the operation produces the same outcome whether it runs once or five times with the same input, like an elevator button: pressing "5" five times does not send the elevator to floor 5 five times.

This matters because networks are unreliable. A client can send a request, the server can process it, and the response can get lost coming back. The client, seeing nothing, retries. This is at-least-once delivery: the request is guaranteed to arrive at least once, with no guarantee against arriving more than once. Idempotency is what makes retrying safe under that uncertainty.

## Why an FDE needs this

This is a classic production bug: a user double-clicks Save while an outside service is slow, and the app ends up with two copies of the same record. It rarely shows up in early testing, where nobody double-clicks and nothing times out. In client work it shows up as double-billed customers or duplicate rows from a webhook that fired twice. Spotting a missing idempotency key on a payment or "create record" flow before it ships prevents an embarrassing incident.

## Key concepts

### Idempotent HTTP methods

| Method | Idempotent? | Why |
|---|---|---|
| GET | Yes | Reading does not change anything |
| PUT | Yes | Setting a resource to a state gives the same state every time |
| DELETE | Yes | Deleting something already deleted leaves it deleted |
| POST | No, by default | A plain POST usually creates a new thing each time |

### Idempotency keys

The standard fix for POST: the client generates a unique ID for the operation and sends it along. The server checks if it already processed that key. If so, it returns the original result instead of redoing the work.

```python
@app.post("/charge")
def charge(payload: ChargeRequest, idempotency_key: str = Header(...)):
    existing = db.get_result(idempotency_key)
    if existing:
        return existing            # already processed
    result = process_payment(payload)
    db.save_result(idempotency_key, result)
    return result
```

Two identical requests arriving at the same moment can both miss the lookup, so real systems also store the key under a unique constraint, covered next.

### Dedup with a unique constraint

A unique constraint is a storage-level way to block duplicates. If "one order per customer per cart session" should never happen twice, a constraint on `(customer_id, session_id)` makes the second insert fail loudly instead of silently duplicating.

```sql
CREATE TABLE orders (
    customer_id INTEGER,
    session_id TEXT,
    result TEXT,
    UNIQUE (customer_id, session_id)
);
```

Idempotency is a property of the operation: running it twice is safe. Deduplication, a key lookup or a unique constraint, is the mechanism that enforces it.

## Common misconceptions

- **"Retrying is the bug."** Retrying is correct behavior for unreliable networks. The bug is an endpoint that is not safe to retry.
- **"Idempotency keys are only for payments."** Any create action that must not duplicate benefits: form submissions, webhook-triggered emails, support tickets.
- **"A unique constraint alone solves everything."** It stops duplicate rows, but the app still needs to catch the violation and return the original result gracefully.

## Typical interview questions

<details>
<summary>What does it mean for an operation to be idempotent?</summary>

Running it multiple times with the same input produces the same end result as running it once. GET, PUT, and DELETE are idempotent by convention; POST is not, unless the app adds something like an idempotency key.

</details>

<details>
<summary>How would you prevent a double charge if "Pay Now" gets clicked twice?</summary>

Have the client generate a unique idempotency key per checkout attempt. The server checks if it has seen that key; if so, it returns the stored result instead of charging again. A unique constraint on the transaction identifier adds a second layer.

</details>

<details>
<summary>What is at-least-once delivery, and why does it make idempotency necessary?</summary>

A guarantee that a request arrives one or more times, never zero. Since a client cannot always tell if a request that seemed to fail actually succeeded, it may retry, which means the operation being retried needs to be idempotent or duplicates happen.

</details>

## Learn more

- Article: [Idempotency](https://algomaster.io/learn/system-design/idempotency) (AlgoMaster, about 15 min).
- Article: [Why Is My Job Running Twice? Understanding Idempotency and Deduplication](https://medium.com/@surajs78/why-is-my-job-running-twice-understanding-idempotency-and-deduplication-in-distributed-systems-d56edbcad051) (Medium).
- Article: [Preventing Race Conditions with Locks, Atomic Updates, and Idempotency](https://oatllo.com/preventing-race-conditions-web-app) (oatllo).

## Related

- [Retries and Backoff](./03-retries-and-backoff.md)
- [Race Conditions](./06-race-conditions.md)
- [HTTP Requests and Responses](../02-how-web-apps-run/04-http-request-response.md)
- Goes deeper in Module 4: [Reliability: Timeouts, Retries, Fallbacks, Circuit Breakers, Batching & Caching](../../m4/04-reliability-cost-latency-and-scale/01-reliability-timeouts-retries-fallbacks-circuit-breakers.md)
