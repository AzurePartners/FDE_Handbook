---
title: Webhook vs. Polling
row: M1-L3.3
---
**In one sentence:** Polling means repeatedly asking another system "has anything changed yet," while a webhook means the other system calls you the moment something happens.

## What it is

Two systems that need to stay in sync have two options. Polling is your system asking, on a schedule, "anything new?" checking every five minutes with `GET /orders?since=<last_check>`. A webhook flips this around: the other system sends a request the instant something happens, in practice just an incoming HTTP POST with a JSON body describing what happened.

A useful rule of thumb: whoever knows when something happened should start the action. If your system checks its own database, polling is natural. If the other system knows first, a payment provider knows the instant a payment clears, a webhook fits better, since polling means guessing how often to ask.

## Why an FDE needs this

Webhooks and polling show up constantly in client integrations: syncing a CRM, reacting to a payment, picking up a file once it finishes processing. Choosing the wrong one causes real problems, events arriving late because a system only polls occasionally, or a client's server overwhelmed by requests polling too aggressively. Webhooks introduce their own failure modes: one that never arrives, or arrives twice.

## Key concepts

### When to use each

| | Polling | Webhooks |
|---|---|---|
| Who starts it | Your system, on a timer | The other system, when something happens |
| Latency | Depends on poll frequency | Near-instant |
| Setup | Simple, a scheduled call | Public URL, security, retries |
| Good fit | Low-frequency changes | Time-sensitive events, like payments |

### Webhook signatures

Because a webhook is an incoming request from the open internet, your endpoint has to verify it came from the claimed system. The standard approach: the sender computes an HMAC of the raw payload with a shared secret and sends it in a header, often with a timestamp against replays. Your endpoint recomputes it over the raw body and compares in constant time; a mismatch means reject.

```
POST /webhooks/payment-received
X-Signature: t=1727870000,v1=<64-hex-char HMAC-SHA256 of timestamp + body>
Content-Type: application/json

{"event": "payment.succeeded", "amount": 4999}
```

Skipping verification means anyone who discovers the URL could send fake events, for example a fake "payment succeeded."

### Retries

Networks are unreliable, so most webhook providers retry a delivery if your endpoint does not respond, often expecting a 2xx response within seconds. So your endpoint might receive the same event twice, meaning handling it must be safe to repeat, and it must respond quickly, doing slow work afterward.

A common pattern: a client uploads a file to a SaaS tool, which processes it in the background and fires a webhook once done, since nobody knows in advance how long that takes. Polling here means guessing an interval, too often wastes load, too rarely feels slow.

## Common misconceptions

- **"Webhooks are always better than polling."** Webhooks need a public endpoint, security, and retry logic. For infrequent or low-stakes changes, polling on a reasonable schedule is simpler and adequate.
- **"A webhook will only ever arrive once."** Most providers guarantee "at least once" delivery, not "exactly once." Duplicate deliveries are expected, not a bug.
- **"Polling more often always gets you fresher data."** Polling too aggressively can hit rate limits or get your access revoked. Poll on the schedule the API's documentation recommends.

## Typical interview questions

<details>
<summary>How do you decide between polling and a webhook for a given integration?</summary>

Ask who knows when the event happens. If the other system knows first, a payment clearing, a webhook avoids guessing an interval and reacts immediately. If your own system checks its own state, or you cannot expose a public endpoint, polling is simpler.

</details>

<details>
<summary>Why do webhook payloads need a signature?</summary>

Because a webhook endpoint is a public URL that accepts incoming requests, anyone who finds it could send a fake payload claiming to be real. A signature, computed with a secret shared only between sender and receiver, lets the endpoint confirm the request genuinely came from the expected source.

</details>

<details>
<summary>A payment provider's webhook fires twice for the same event. How should your endpoint handle that?</summary>

By making the handler safe to run more than once, checking whether that event's ID was already processed before applying its effect, rather than assuming each delivery is unique.

</details>

## Learn more

- Article: [Webhooks vs API Polling](https://hookdeck.com/webhooks/faq/webhook-vs-api-polling) (Hookdeck)
- Article: [Webhooks vs APIs, the Difference](https://www.authgear.com/post/webhooks-vs-apis-difference/) (Authgear)

## Related

- [REST Conventions](./01-rest-conventions.md)
- [Integration Failure Diagnosis](./07-diagnosing-integration-failures.md)
- [Idempotency](../06-reliability-scale/05-idempotency.md)
- [Integration Boundaries](./06-integration-boundaries.md)
