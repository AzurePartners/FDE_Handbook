---
title: Embeddings and Vector Search
row: M2-L3.4
---
**In one sentence:** An embedding is a list of numbers that places a piece of text by its meaning, and vector search finds the stored embeddings closest to a question's embedding.

## What it is

An embedding model turns text into a vector, a fixed-length list of numbers. Distance is what matters: texts with similar meaning land close together, so "how do I get my money back" sits near "refund policy" with no shared words.

Picture a map of meaning. Every chunk gets a pin, as does the question, and vector search finds the nearest pins. Each model draws its own map, so pins from two models cannot be compared.

Precisely: at ingestion you embed every chunk into a vector index. At query time you embed the question with the same model and return the k nearest vectors with their text. Anthropic has no embedding model; its docs recommend Voyage AI.

## Why an FDE needs this

An insurer's claims assistant searches 40,000 policy chunks in Postgres via the pgvector extension. Older-policy answers have quietly worsened. Months earlier, IT switched new documents and queries from `text-embedding-ada-002` to `text-embedding-3-small` without re-embedding old chunks. Both output 1,536 numbers, so nothing errored, but queries now met pins from another map.

The FDE reads the retrieved chunks, spots the mismatch, re-embeds everything into a new column, switches over in one step, and stores each vector's model name.

## Key concepts

### Similarity scores

Cosine similarity measures the angle between vectors, ignoring length; dot product reflects angle and length; Euclidean (L2) distance is the straight-line gap. For length-1 vectors, which Voyage and many providers return, dot product equals cosine (and is faster) and Euclidean ranks identically. Scores differ by engine: Azure AI Search reports cosine as 1 / (1 + cosine distance), from 0.333 to 1.00, so no threshold works everywhere.

### What the index stores

Each record holds an ID, the vector, the chunk text and metadata such as source. Filters run on metadata, never on the vector. In pgvector, `<=>` is cosine distance:

```sql
CREATE TABLE chunks (id bigserial PRIMARY KEY, body text,
  embed_model text, embedding vector(1024));
SELECT id, body FROM chunks ORDER BY embedding <=> $1 LIMIT 5;
```

### Exact vs approximate search

Exact k-nearest-neighbor (kNN) search compares the query with every vector: always correct, and fine for tens of thousands. Approximate nearest-neighbor (ANN) indexes trade a little recall (the share of true nearest neighbors found) for big speed gains. HNSW, the most widely used, is a layered graph: highway, main roads, local streets, with `hnsw.ef_search` setting how carefully it searches locally. pgvector warns that adding an approximate index changes results, and its `vector` indexes cap at 2,000 dimensions (3,072-dimension vectors need `halfvec` or shortening).

### Extension or dedicated database

Vector features in databases the customer already runs (Postgres with pgvector, Azure SQL, Cosmos DB) keep transactions, joins and backups together. Dedicated vector databases (Pinecone, Qdrant, Milvus) pay off mainly at large scale.

### One model per index

Use one model for documents and queries, or a family the vendor documents as sharing a space (Voyage says Voyage 4 does). Changing models means re-embedding everything; OWASP's Vector and Embedding Weaknesses entry (LLM09:2026) warns against mixing old and new vectors.

### Where semantic search fails

Codes and rare names carry little meaning. Anthropic's example: searching "Error code TS-999" finds general error-code content but misses the exact match. On the NevIR benchmark, most neural retrievers did no better than random on documents differing only by a negation. Keyword search covers these gaps.

## Common misconceptions

- **"If nothing relevant is indexed, vector search returns nothing."** It always returns the k closest vectors, relevant or not.
- **"We can use the new model for new documents only."** The two vector spaces are incompatible, and with equal dimensions nothing errors.
- **"A score of 0.8 means 80% relevant."** Score ranges depend on the model and engine; calibrate on your own data.
- **"Embeddings are just numbers, so they are safe to share."** OWASP cites Vec2Text recovering 92% of short 32-token inputs exactly. Guard vector stores like source documents.

## Typical interview questions

<details>
<summary>What is an embedding, and how does vector search use it?</summary>

A fixed-length vector a model produces for text, placed so similar meanings sit close. You embed and store chunks at ingestion, embed each question with the same model, and return the k nearest vectors with their text.

</details>

<details>
<summary>What is the difference between exact kNN and HNSW search?</summary>

Exact kNN checks every vector: always correct, but slower as data grows. HNSW walks a layered graph touching few vectors: much faster, but it can miss true neighbors. `ef_search` trades recall for latency.

</details>

<details>
<summary>A Postgres customer wants semantic search over 2 million articles. pgvector or a dedicated vector database?</summary>

Start with pgvector: vectors sit beside existing rows, backups and access control, and HNSW handles millions if memory allows. First check the 2,000-dimension index limit and filtered-query recall.

</details>

<details>
<summary>After an embedding model upgrade, older documents retrieve worse without errors. How do you debug it?</summary>

Read the retrieved chunks, then compare the model behind stored vectors with the one embedding queries. If they differ, re-embed into a new column, switch in one step, and record the model per vector.

</details>

## Learn more

- Video: [What is a Vector Database? Powering Semantic Search & AI Applications](https://www.youtube.com/watch?v=gl1r1XV0SLw) (IBM Technology, about 10 min)
- Reference: [Embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings) (Anthropic Claude Docs, about 15 min)
- Reference: [pgvector](https://github.com/pgvector/pgvector) (GitHub, about 20 min)

## Related

- [Retrieval-Augmented Generation (RAG)](./01-retrieval-augmented-generation.md)
- [Chunking](./03-chunking.md)
- [Metadata, Filtering and Freshness](./05-metadata-filtering-and-freshness.md)
- [Hybrid Search, Reranking and Query Rewriting](./06-hybrid-search-and-reranking.md)
- [SQL Basics: SELECT, INSERT, JOIN](../../m1/03-apis-data-integration/11-sql-basics.md)
