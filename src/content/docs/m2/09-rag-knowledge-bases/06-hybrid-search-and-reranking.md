---
title: Hybrid Search, Reranking and Query Rewriting
row: M2-L3.6
---
**In one sentence:** Hybrid search runs keyword and meaning-based search together and merges the results, a reranker reorders the top candidates more carefully, and query rewriting fixes the question first, so the right chunks reach the model.

## What it is

Vector search finds chunks that mean the same as the question but blurs exact strings such as fault codes, part numbers and names. Keyword search catches them. Its standard ranker, BM25, favors chunks where the query's words appear often, the chunk is not unusually long and the word is rare across the index.

Think of a library: the book's index finds the exact string "TS-999", a librarian finds the overheating chapter when you say "it runs hot," and a reranker is the expert who reads what both pulled and hands you the best five.

Precisely: filter, run BM25 and vector search in parallel, fuse the ranked lists into about 50 candidates, rerank them, and send the model only the few that clear a relevance cut-off. Query rewriting, if used, comes first.

## Why an FDE needs this

An HVAC maker's field-service assistant searches 4,000 pages of manuals by vector alone. For "E-4012 on the RTU-450" it returns other codes' pages, because the embeddings treat E-4012 and E-4021 as near twins. Follow-ups like "what about the 2019 unit?" find nothing, and raising k from 5 to 25 makes answers slower, costlier and muddled.

The FDE adds BM25 (checking that the analyzer keeps "E-4012" as one token), fuses and reranks 50 candidates, passes the top 6 above a calibrated cut-off, and has a fast model rewrite follow-ups while still searching the original text. Each change stays only if recall improves on 60 real technician questions (illustrative numbers).

## Key concepts

### Reciprocal rank fusion (RRF)

BM25 scores have no upper limit while cosine scores sit in a narrow band, so adding them lets one retriever dominate. RRF uses positions instead: each chunk earns 1/(60 + rank) from every list it appears in, so a chunk ranked well in both wins. Azure AI Search and Elasticsearch use RRF; Weaviate normalizes and sums scores by default.

### Rerankers

An embedding model (a bi-encoder) encodes query and chunk separately, so chunk vectors are computed once. A cross-encoder reranker reads them together and scores the pair. It is usually more accurate but runs per pair at query time, so it only sees a shortlist. Options include hosted models (Cohere, Voyage), open-source cross-encoders or an LLM asked to pick the best candidates.

A reranker cannot rescue a chunk the first stage missed (Azure's semantic ranker sees only the top 50), and its input limit caps how much of each chunk it reads. In Anthropic's Contextual Retrieval study, reranking cut top-20 retrieval failures from 2.9% to 1.9% on top of contextual embeddings plus BM25.

### Choosing k and the cut-off

Keep three numbers apart: the candidate count fetched for fusion (Microsoft suggests starting at 30 to 50), the RRF constant (60) and the final k sent to the model. More chunks raise the chance of including the answer but add cost and distraction.

Search always returns k results, even weak ones, so drop chunks below a cut-off on reranker or similarity scores, never on tiny fused RRF scores. Scales differ (Azure's reranker runs 0 to 4) and shift by query, so calibrate on 30 to 50 queries paired with borderline documents, as Cohere suggests. If nothing passes, see Knowledge Gaps.

### Query rewriting

A model rewrites the question before search: resolving follow-ups from chat history, fixing typos, adding synonyms or splitting it into subqueries. Azure warns that rewrites can drop exact terms, so search the original too.

Every stage adds latency or cost, so keep one only if recall at k improves within the latency budget.

## Common misconceptions

- **"Vector search understands meaning, so keyword search is obsolete."** Embeddings blur exact codes and names, which BM25 matches. Run both.
- **"Hybrid search adds the two scores together."** Their scales differ, so RRF combines ranks, and score-based engines normalize first.
- **"The reranker searches the whole knowledge base more carefully."** It only reorders the candidates it receives, so first-stage recall sets the ceiling.
- **"A score of 0.5 is a sensible cut-off anywhere."** Scores are model-specific and query-dependent. Calibrate on borderline examples and recheck after model updates.

## Typical interview questions

<details>
<summary>What is hybrid search, and why use it?</summary>

It runs BM25 and vector search on one query and merges the lists, usually with reciprocal rank fusion. Vector search catches paraphrases and keyword search catches exact codes, so together they miss fewer relevant chunks.

</details>

<details>
<summary>What is the difference between a bi-encoder and a cross-encoder?</summary>

A bi-encoder embeds query and documents separately, so document vectors are precomputed. A cross-encoder reads each pair together: more accurate, but too slow for more than a shortlist.

</details>

<details>
<summary>Design retrieval for users who paste error codes, within a 3-second budget.</summary>

Filter, run BM25 (codes kept whole) and vector search in parallel, fuse into about 50 candidates, rerank, and pass chunks above a calibrated cut-off. Rewrite follow-ups with a fast model but also search the original. Drop stages that do not improve recall.

</details>

<details>
<summary>You added a reranker, but some answers did not improve. Why?</summary>

Check whether the right chunk was among the candidates; if not, fix first-stage recall. If it ranked low, check truncation or a follow-up needing rewriting. If it ranked high but was dropped, the cut-off or final k is too tight.

</details>

## Learn more

- Article: [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) (Anthropic Engineering, about 20 min)
- Reference: [Relevance scoring in hybrid search using Reciprocal Rank Fusion (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) (Microsoft Learn, about 10 min)
- Practice: [Retrieval Augmented Generation with Claude (cookbook)](https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide) (Anthropic Claude Cookbook, about 90 min)

## Related

- [Embeddings and Vector Search](./04-embeddings-and-vector-search.md)
- [Metadata, Filtering and Freshness](./05-metadata-filtering-and-freshness.md)
- [Knowledge Gaps and Insufficient Evidence](./08-knowledge-gaps.md)
- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](../11-ai-evaluation/05-rag-evaluation.md)
