---
title: RAG vs Alternatives (Long Context, Fine-Tuning, Databases, APIs)
row: M2-L3.9
---
**In one sentence:** RAG is one way to give a model facts it lacks, alongside long context, fine-tuning, database queries and live API calls, and a good assistant sends each question to the source that owns the answer.

## What it is

A model knows only its training data, frozen at a cutoff date, so the application must supply private or current facts. Retrieval-augmented generation (RAG) pastes the best-matching document passages into the prompt; it is one way among several.

Think of a bank. A librarian finds the policy page. A teller reads your balance live, never from last month's photocopy. A calculator does the interest. Each source below owns one kind of answer.

## Why an FDE needs this

Northwind Academy's assistant answers from policies, but a contractor also indexed nightly grade and order exports so it could "answer anything". Asked whether her installment went through, Amina Rahman got an export row where ORD-104118 looked fine; billing said `payment_failed`. Another student's near-identical order row also ranked, and the model mentioned it.

The FDE removes every record from the index, keeps RAG for current policies, and answers record questions with live, read-only lookups to the systems of record (where official data lives), scoped to the signed-in student.

## Key concepts

### Comparison table

| Source | Best for | Weak at |
|---|---|---|
| Long context (everything, every request) | Small, stable sets | Cost, quality at length, per-user filtering |
| RAG (top chunks from an index) | Large or changing documents | Misses, stale index, counting |
| Fine-tuning (further training) | Format, tone, labels | Facts, citations, freshness |
| Database query | Filters, counts, averages | Questions over prose |
| Live API (system of record) | One person's current state | Only what it exposes |
| Plain code | Rules and arithmetic | Reading intent |

### Long context vs RAG

Context windows now reach about 1M tokens, and Anthropic's Contextual Retrieval post (2024) suggests skipping RAG below about 200,000 tokens, with prompt caching to cut repeat cost. But each request re-pays for the whole corpus, accuracy degrades with length (context rot; see Lost in the Middle and RULER), and a prompt cannot hide a document from users who lack access. Li et al. (2024) found long context better on average quality, but RAG far cheaper.

### Fine-tuning is for behavior

RAG consistently beat unsupervised fine-tuning at adding knowledge (Ovadia et al., 2024), and fine-tuning on new facts raised hallucination (Gekhman et al., 2024). OpenAI announced in 2026 it is winding down self-serve fine-tuning, and Anthropic's API never offered it; check current docs. Use it for format or tone, after prompting falls short.

### Errors a misused knowledge base adds

- **Stale copies.** Indexed records are a cache with no invalidation.
- **Conflicting versions.** Retrieval returned the 2025 refund policy and the superseded 2023 one; the answer blended them.
- **Leaked records.** Other customers' similar rows rank highly; telling the model to ignore them is not access control (OWASP Vector and Embedding Weaknesses).
- **Retrieval misses.** Search returned only the top matches, two of Amina's three quiz scores, so the model silently averaged 92 and 85, not 92, 78 and 85.

### Combining sources

Real questions mix types, so route each part to its owner:

```text
"Can I get a refund on Python for AI?"
policy      <- RAG: current refund policy
enrollment  <- live lookup: enrolled 2025-09-02, 18% done
eligibility <- code: day 10 < 14 and 18% < 25%, so full refund
answer      <- model explains, cites policy, gives as-of time
```

## Common misconceptions

- **"Million-token windows mean RAG is dead."** Small, stable sets fit in the prompt; large, changing or restricted ones still need retrieval.
- **"We'll fine-tune the model on our policy manual."** Fine-tuning adds facts unreliably, cannot cite, and needs retraining at every change.
- **"Index the order exports so the bot can answer anything."** Copies go stale and leak; use live lookups and database queries.
- **"RAG is always current since it searches at question time."** The index is a snapshot from the last ingestion.

## Typical interview questions

<details>
<summary>When should an assistant use RAG instead of a database or an API?</summary>

Policy documents go through RAG, filters and aggregates through a database query, and one person's current state, such as an order status, through a live API call. Rules and math go in code.

</details>

<details>
<summary>How does long context differ from RAG, and when would you skip retrieval?</summary>

Long context sends every document each request, so cost and quality suffer with size. RAG sends a few chunks and scales, but can miss. For a small, stable corpus under about 200,000 tokens, I'd skip retrieval.

</details>

<details>
<summary>A client wants to fine-tune a model on their manual. How do you respond?</summary>

Fine-tuning shapes format and tone, not knowledge, and cannot cite the manual or stay current. I'd propose RAG with citations, keeping fine-tuning for behavior problems prompting cannot fix.

</details>

<details>
<summary>The assistant says a payment failed; billing says it succeeded. How do you debug it?</summary>

Check that turn's logged context: usually a chunk from an indexed export older than the billing update. Remove records from the index and answer status questions with a live, timestamped lookup.

</details>

## Learn more

- Video: [MCP vs. RAG: How AI Agents & LLMs Connect to Data](https://www.youtube.com/watch?v=X95MFcYH1_s) (IBM Technology, about 10 min)
- Article: [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) (Anthropic Engineering, about 20 min)

## Related

- [Retrieval-Augmented Generation (RAG)](./01-retrieval-augmented-generation.md)
- [SQL Basics: SELECT, INSERT, JOIN](../../m1/03-apis-data-integration/11-sql-basics.md)
- [Model Judgment vs Deterministic Code](../10-tool-calling-deterministic-logic/03-model-vs-code.md)
- [Tool Calling (Function Calling)](../10-tool-calling-deterministic-logic/01-tool-calling.md)
- [Read-Only Lookup Tools](../10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md)
