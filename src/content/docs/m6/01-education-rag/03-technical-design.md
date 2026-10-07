---
title: "Technical Design: Course Support Assistant"
row: M6-L1.2
rows:
  - M6-L1.2
  - M6-L1.3
---
**In one sentence:** A reference design for a grounded support assistant: a versioned knowledge base that owns the facts, retrieval that produces evidence, a model that only restates and cites, and policy code that decides when to answer, refuse or escalate.

> **Teaching reference.** This design was written for the handbook to the same nine-part skeleton as the other three lessons. It satisfies the [reference PRD](./02-prd.md); items beyond the first version are marked. A build of this design on n8n follows on the [next page](./04-reference-build-n8n.md).

## 1. Design principle

**The knowledge base is the only source of truth; the model restates it and cites it.** Retrieval decides what evidence exists, code decides the route, the model decides the wording. Nothing the model says is shown unless code can trace it to a retrieved passage.

## 2. Architecture and ownership

```text
Documents (owner, version, effective date)
   │  ingest: parse → chunk by structure → add context header → strip PII
   ▼
Knowledge base version N ──► Index (keyword + embedding)
                                  │  retrieve top-k → rerank
                                  ▼
Question ──► Router (policy code) ──► Answer service (model, citations required)
                │                          │
                ├─ escalate ──► Ticket      └─ Citation verifier (code) ──► Reply + sources
                └─ not covered ──► Route to a person
```

| Component | Owns | Built with (first version) |
|---|---|---|
| Ingestion | Turning documents into passages with metadata; PII removal | Parsers per document type; chunking by heading; a one-line context header per chunk |
| Knowledge base | Versions, effective dates, supersession | A document store with a version per publish |
| Index | Finding candidate passages | Keyword index plus embeddings; a reranker is a later addition |
| Router | The route: answer, not covered, escalate | Configuration: escalation topics, score threshold |
| Answer service | Wording, in the user's language, with citations | A model prompted to answer only from the passages and to return a structured object |
| Citation verifier | Rejecting any citation not in the retrieved set | Code |
| Escalation adapter | Creating a ticket with context | The support system's API |
| Answer log | Traceability: question, KB version, passage IDs, route, latency, cost | Append-only store |

## 3. Trust boundaries and gates

- **Model output is untrusted until verified.** The answer service returns `{answer, citations[], route}`; the verifier checks that every citation ID is in the retrieved set and that the cited text overlaps the answer. A failure blocks the reply and returns a "not covered" message.
- **Routing is configuration, not prompt.** The escalation topic list and the retrieval score threshold live in config, so a prompt injection in a question cannot change them.
- **Knowledge publishing is a human gate.** A document owner publishes a version; ingestion runs against a staging index, the evaluation set runs, and only then does the version go live.
- **User input never reaches a system of record.** The first version has no write tools; escalation passes text to a ticket, nothing else.

## 4. State and data

- Each document has `owner`, `version`, `effective_from` and `superseded_by`. Retrieval filters to the current version, so a retired passage cannot be found.
- Each answer is logged with the knowledge base version and passage IDs, so any answer can be reproduced or audited later.
- Conversation state is the transcript only, retained for the period the PRD states, then deleted.
- Embeddings are cached per passage hash, so re-indexing only recomputes what changed.

## 5. Independent check

- A grounding checker separate from the answer prompt scores a sample of answers for support by their cited passages.
- Low-confidence answers and all escalations enter a human review queue; corrections become new evaluation cases and, where warranted, new knowledge base entries.
- The checker never rewrites answers; it reports.

## 6. Failure handling and idempotency

| Failure | Behaviour |
|---|---|
| No passage clears the threshold | "Not covered" reply with a route to a person |
| Model timeout or error | One retry, then a "not covered" reply; never a silent blank |
| Citation verification fails | Reply blocked; logged as a grounding failure |
| Ticket creation retried | Idempotency key per conversation, so one escalation creates one ticket |
| Index rebuild fails | Previous version stays live; the new version is never partially published |

## 7. Evaluation and testing

- **Evaluation set:** real past questions, including out-of-scope questions, questions about retired policies, and escalation topics. Owned by the knowledge owner and grown from review-queue corrections.
- **Metrics:** retrieval recall at k, answer correctness, citation precision, refusal accuracy, escalation precision. Thresholds come from the PRD and are fixed before tuning.
- **When it runs:** on every change to prompts, chunking, index settings or the knowledge base. A regression below threshold blocks the change.
- **Guard tests:** a retired document must not be cited; planted personal data in a ticket export must not reach the index; a citation outside the retrieved set must be blocked; an escalation topic must never be answered.

## 8. Operations

- Model and ticket-system credentials are held server-side with least privilege; the assistant can create tickets and nothing else.
- Cost: cached embeddings, capped context size, a cheaper model for routing if a model is used there at all.
- Observability: per-answer traces; dashboards for "not covered" rate, escalation rate, negative feedback, latency and cost; an alert when the "not covered" rate rises, which usually means the knowledge base fell behind.
- Knowledge hygiene: a report of documents past their review date, sent to their owners.

**Beyond the first version:** a reranker; hybrid retrieval tuning; read tools for a user's own status; write tools with confirmation and audit, as described in the [extension](./06-extension.md).

## Typical interview questions

<details>
<summary>Why verify citations in code when the model was told to cite only retrieved passages?</summary>

Because an instruction is not a guarantee. The verifier turns "the model should only cite retrieved passages" into a property the system enforces, and it makes grounding failures visible in logs instead of in a user's screenshot.

</details>

<details>
<summary>What is the smallest version of this design that still respects every product rule?</summary>

One document store with versions, one keyword index, a fixed threshold, a model call with structured output, the citation verifier and the ticket adapter. Reranking, embeddings and the grounding checker improve quality but are not needed for the rules to hold.

</details>

## Related

- [PRD: Course Support Assistant](./02-prd.md)
- [Case Overview: Tutor / Support RAG](./01-case-overview.md)
- [Reference Build: Support RAG on n8n](./04-reference-build-n8n.md), this design built with one tool
- [Technical Design: Marketing Studio](../02-content-operations/03-technical-design.md), the next rung

*Syllabus rows: M6-L1.2, M6-L1.3*
