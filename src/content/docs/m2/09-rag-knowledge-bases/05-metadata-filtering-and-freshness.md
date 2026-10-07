---
title: Metadata, Filtering and Freshness
row: M2-L3.5
---
**In one sentence:** Metadata is the labels stored with each chunk, such as version, status and audience; filters use them to decide which chunks may be retrieved at all, and freshness keeps the index matching the current documents.

## What it is

Vector search ranks chunks by meaning alone, so last year's refund policy looks as relevant as this year's. Metadata is structured labels stored with each chunk's embedding: `source`, `section`, `version`, `effective_from`, `status` (current, superseded, draft), `audience` and `access_level`.

Think of a library catalog card marked "withdrawn" or "reference only": the librarian checks it before handing you a book, instead of handing over every edition.

A **filter** is a hard yes-or-no rule inside the retrieval query (`status = current`), so ineligible chunks never become candidates. **Freshness** keeps the index in step with the sources: re-indexing on change, retiring superseded versions and removing deleted documents.

## Why an FDE needs this

A client's support assistant searches its help center, refund policies and an internal escalation playbook. On July 1 the refund window drops from 30 to 14 days. Support uploads the new policy but leaves the old file, and no field marks which is current. The old "30 days" chunk matches customers' wording and often ranks first, so finance gets disputes. Credit requests also surface the playbook's internal limits.

A prompt line saying "use only current, customer-facing documents" changes nothing: the model cannot tell the chunks apart and has already seen the internal text. The FDE fixes the pipeline instead.

## Key concepts

### Labels on every chunk

Labels must sit on each chunk, not only the parent document; Azure AI Search warns that otherwise "chunk-level references aren't filtered." Managed stores support this: OpenAI file search `attributes` (up to 16 per file), Gemini API File Search `custom_metadata`. OpenAI's attributes are per file, so split mixed-sensitivity content into separate files.

### Pre-filtering vs post-filtering

Pre-filtering narrows candidates before or during the nearest-neighbor search, giving the best k eligible chunks. Post-filtering drops ineligible results afterward, which can silently leave fewer than k, or none. pgvector's docs show it: with HNSW defaults, a filter matching 10% of rows returns about 4 rows (0.8.0 added iterative scans for this). Azure AI Search recommends `preFilter`.

### Access filters belong in the query

Once a chunk reaches the model, it can leak. OWASP's 2026 LLM Top 10 says "post-generation filtering cannot undo a chunk already supplied to the model" and, under LLM09:2026 Vector and Embedding Weaknesses, to enforce tenant scoping inside the index query. Take the filter value from the logged-in session on the server, never the prompt. Give sensitive clients their own namespace or index. Index permissions are a synced copy, only as current as the last sync.

### Freshness: retire, don't hope

Uploading a new version rarely replaces the old one. Azure's docs say indexer change detection is a given but "deletion detection isn't." A version with fewer chunks leaves orphans unless you delete by `doc_id`:

```python
def reindex(doc):                       # on every upload
    index.delete(where={"doc_id": doc.id})
    index.add([label(c, doc) for c in chunk(doc)])

hits = index.search(query, k=8, where={
    "status": "current", "effective_from": {"lte": today},
    "audience": {"in": session.audiences}})  # from login
```

A nightly job removes chunks whose source is gone. A recency boost is not retirement: Azure calls its preview freshness feature "a ranking bias, not a hard filter." Pass `last_updated` through so users see "Policy last updated 1 July 2026." Like any cache, an index goes stale unless every change updates it.

## Common misconceptions

- **"Telling the model to use the newest document handles old versions."** It sees only what retrieval returns, which may lack the new version, and chunks rarely carry dates. Filter on `status` and `effective_from` instead.
- **"Retrieve everything and let the model skip what this user can't see."** A chunk in context can leak. Filter inside the query.
- **"Uploading the new version replaces the old one."** Usually not. Delete old chunks by `doc_id` or mark them superseded.

## Typical interview questions

<details>
<summary>What is chunk metadata, and what does filtering do that similarity cannot?</summary>

Labels stored with every chunk, such as version, status and audience. Similarity ranks by meaning, so two policy versions look equally relevant. A filter applies hard rules, like "status is current," so ineligible chunks never become candidates.

</details>

<details>
<summary>How do pre-filtering and post-filtering differ?</summary>

Pre-filtering restricts candidates during the search, returning the best k eligible chunks. Post-filtering drops results afterward and can leave too few or none. Never use post-filtering as access control.

</details>

<details>
<summary>One assistant serves 40 client companies from a shared index. How do you keep their documents apart?</summary>

Tag every chunk with a tenant id and filter on it inside the query, using the value from the authenticated server session. Sensitive clients get their own namespace or index. I add cross-tenant tests and hide raw similarity scores.

</details>

<details>
<summary>The refund policy changed, but the assistant still quotes the old terms. How do you debug it?</summary>

Inspect the retrieved chunks and their metadata. Check the new version was indexed, old chunks were removed or superseded, and the query filters on `status = current`. Then delete by `doc_id` on update and add a regression case.

</details>

## Learn more

- Article: [RAG is more than just embedding search](https://jxnl.co/writing/2023/09/17/rag-is-more-than-embeddings/) (Jason Liu, about 12 min)
- Reference: [Add a filter to a vector query in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/vector-search-filters) (Microsoft Learn, about 15 min)
- Reference: [LLM09:2026 Vector and Embedding Weaknesses](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM09_VectorAndEmbeddingWeaknesses.md) (OWASP GenAI Security Project, about 15 min)

## Related

- [Knowledge Base Preparation (Source Selection, Parsing, Cleaning)](./02-knowledge-base-preparation.md)
- [Embeddings and Vector Search](./04-embeddings-and-vector-search.md)
- [Hybrid Search, Reranking and Query Rewriting](./06-hybrid-search-and-reranking.md)
- [Caching](../../m1/06-reliability-scale/08-caching.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../12-safety-guardrails-hitl/05-action-gates.md)
