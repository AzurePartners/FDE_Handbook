---
title: Read-Only Lookup Tools
row: M2-L4.8
---
**In one sentence:** A read-only lookup tool lets an AI assistant fetch one current fact, such as a grade, an order status or a ticket status, from the system that owns it, without changing anything.

## What it is

An assistant cannot know whether last night's payment went through. That fact lives in the system of record, the official app that owns it: the gradebook for grades, billing for orders, the helpdesk for tickets. The model proposes a lookup, and your code runs the query or API `GET` and returns selected fields.

Think of a bank teller's account screen. It shows your balance and when it was refreshed, but it has no "transfer" button. Moving money happens elsewhere, with extra checks.

Read-only is enforced, not declared. The code must only read, and its credential must allow only reading: a database login with `SELECT` only, or an API token with a read-only scope.

## Why an FDE needs this

An online school's support assistant answered from a nightly CSV export in its knowledge base. At 3 pm a student asks, "Did my installment go through?" The 2 am export says "pending", but the charge failed at noon. The assistant says "nothing to do", and ten days later the student's course access is paused.

The FDE replaces the export with three lookup tools calling the live gradebook, billing and helpdesk APIs with a read-only credential. Policy and FAQ text stays in RAG.

## Key concepts

### The Northwind lookup tools

| Tool | Reads from | Argument |
|---|---|---|
| `get_grades(course_id)` | Gradebook | `data-analytics` or `python-ai` |
| `get_order_status(order_id)` | Billing | Fully matches `ORD-[0-9]{6}` |
| `get_ticket_status(ticket_id)` | Helpdesk | Fully matches `TCK-[0-9]{4}` |

No tool takes a `student_id`; code fills it from the signed-in session, so lookups only see that student's records.

### Choosing and labeling the fields

Anthropic advises returning "only high signal information": readable labels plus the record ID for citations and follow-up calls. Name units and currency.

```json
{"order_id": "ORD-104118",
 "item": "Data Analytics Foundations, installment 2 of 4",
 "amount": 125.00, "currency": "USD",
 "status": "payment_failed",
 "status_updated_at": "2025-09-10",
 "next_step": "Automatic retry on 2025-09-13",
 "as_of": "2025-09-12T19:00:00Z"}
```

`status_updated_at` is when the record last changed. `as_of` is when the data was read; behind a cache or replica, it must be the data's real time, so the assistant can say "as of 3 pm." Card details and staff notes stay out.

### Combining lookups and policy

Independent read-only lookups "are usually safe to run in parallel" (Anthropic docs); a lookup that needs another's result waits for it.

"ORD-104118 failed. Will I lose access?" needs `get_order_status("ORD-104118")` (failed 2025-09-10) plus the retrieved Payment plans FAQ ("pause course access after 10 days"). Code, not the model, computes the pause date: 2025-09-20. For "Am I passing Data Analytics?", participation is not posted, so code weights posted work only: (0.3 × 85 + 0.5 × 88) / 0.8 = 86.9.

### Testing with realistic questions

Test against a practice copy of the data with known answers:

```text
"Status of ORD-104118?"                  one tool
"TCK-5531 and my Data Analytics grades?"  two tools
"ORD-104118 failed. Will I lose access?"  lookup plus policy
"Status of ORD-999999?"                   unknown ID
"What's my grade?"                        ambiguous: two courses
"How are grades weighted?"                no lookup needed
```

Watch for wrong tools, wrong arguments and missing calls, and check every number and date.

## Common misconceptions

- **"Read-only tools can't hurt anything."** A lookup is how private data reaches the model, including another user's records or fields nobody should see.
- **"If I describe the tool as read-only, it is read-only."** OWASP's Excessive Agency entry (LLM06 in 2025, LLM03 in the August 2026 list) describes a read-intended tool whose database identity can also `UPDATE` and `DELETE`. Enforce it with the credential.
- **"Export the database into the knowledge base and let RAG find the order."** The export goes stale and can return the wrong person's row.
- **"If the tool returned it, it's current."** The tool may read a cache or nightly sync. Return `as_of`.

## Typical interview questions

<details>
<summary>What is a read-only lookup tool, and why not use the knowledge base?</summary>

It is a tool whose code only reads selected fields from the system of record. For one person's current data, a live lookup is exact, while an indexed copy goes stale. RAG stays right for policy text.

</details>

<details>
<summary>How does governing a lookup tool differ from governing an action tool?</summary>

A lookup changes nothing, so it can run in parallel, be retried freely and usually skip approval. An action tool needs validation before any side effect, duplicate protection and sometimes approval. Both need per-user scoping.

</details>

<details>
<summary>A student asks, "My installment failed. Will I lose access?" Design the flow.</summary>

The model calls `get_order_status` for the signed-in student. The app retrieves the payment-plan policy, and code computes the pause date. The answer cites the order ID, the policy and the as-of time.

</details>

<details>
<summary>The assistant said 78 on Quiz 2, but the gradebook shows 86 after a regrade. How do you debug it?</summary>

Open the trace. No `get_grades` call means it answered from history. A returned 78 means a stale data path. A returned 86 means the model misread it, so fix the labels. Add the case to the test set.

</details>

## Learn more

- Article: [Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Anthropic Engineering, about 25 min)
- Practice: [Customer service agent with client-side tools](https://platform.claude.com/cookbook/tool-use-customer-service-agent) (Anthropic Claude Cookbook, about 30 min)

## Related

- [RAG vs Alternatives (Long Context, Fine-Tuning, Databases, APIs)](../09-rag-knowledge-bases/09-rag-vs-alternatives.md)
- [Tool Schemas and Tool Design](./05-tool-design.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../12-safety-guardrails-hitl/05-action-gates.md)
- [Human-in-the-Loop Approval](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [Auth: API Key, Bearer Token, OAuth](../../m1/03-apis-data-integration/02-auth.md)
