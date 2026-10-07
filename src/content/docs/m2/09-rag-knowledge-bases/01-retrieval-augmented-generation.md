---
title: Retrieval-Augmented Generation (RAG)
row: M2-L3.1
---
**In one sentence:** Retrieval-augmented generation (RAG) is a pattern where, for each question, the application searches an index of your documents, places the most relevant passages in the prompt, and has the model answer from them with sources.

## What it is

A language model knows only its training data, which stops at a cutoff date and never included your client's private documents. Asked about anything newer or private, it guesses plausibly. RAG changes the input, not the model: look up the relevant pages, then hand them over with the question.

RAG turns a closed-book exam into an open-book one. Its limit is the lesson: hand over the wrong pages, or leave the right one out of the binder, and the student still answers confidently and wrongly.

RAG has two paths. Offline, ingestion cleans documents, splits them into chunks and embeds each one (turns it into numbers capturing its meaning) into an index. Per question, the app retrieves the best-matching chunks into the prompt and the model answers citing them. Updating the index changes the next answer. The term dates from Lewis et al. (NeurIPS 2020).

## Why an FDE needs this

An online-education client's student assistant answers from a handbook, FAQs and about 300 policy PDFs, logging retrieved chunk IDs per request. A student is told late work loses 5% per day, but this term's policy says 10%. The client wants to "fix the prompt" or "use a smarter model." The FDE reads the logged chunks instead: all came from last year's handbook, and the new policy PDF was a scan with no text layer, never indexed.

The fix is in ingestion: run OCR (text recognition) on the scan, retire the old version, re-index, and add the question to the eval set. No prompt could have fixed it.

## Key concepts

### The pipeline and a minimal build

```text
OFFLINE (re-run whenever sources change)
documents -> clean text -> chunks -> embeddings -> index + metadata

PER QUESTION
question -> top-k chunks -> prompt with chunk IDs -> cited answer -> log
```

"Top-k" means the k highest-scoring chunks. In code:

```python
# embed(), index and log() are placeholders
hits = index.search(embed(question), k=5)
context = "\n".join(f'<chunk id="{h.id}">{h.text}</chunk>' for h in hits)
resp = client.messages.create(  # Anthropic Python SDK
    model=os.environ["LLM_MODEL"], max_tokens=1024,
    system="Answer only from the chunks and cite their ids.",
    messages=[{"role": "user", "content": f"{context}\n\nQuestion: {question}"}],
)
answer = "".join(b.text for b in resp.content if b.type == "text")
log(question, [h.id for h in hits], answer)
```

Every major provider sells managed RAG (OpenAI `file_search`, Gemini API File Search, Amazon Bedrock Knowledge Bases, Azure AI Search) that FDEs often configure instead of hand-building.

### Wrong answer? Read the retrieved chunks first

When one answer is wrong, read the chunks retrieved for that request before touching the prompt or model.

| The log shows | Layer | Fix |
|---|---|---|
| Right content not in the index | Ingestion | Add or re-parse the source |
| Indexed but not retrieved | Retrieval | Chunking, embeddings, search settings |
| Retrieved, answer still wrong | Generation | Instructions, grounding, model |

Barnett et al. (CAIN 2024) place three of seven RAG failure points before the model writes a word: missing content, missed top-ranked documents, and content dropped during context assembly.

## Common misconceptions

- **"RAG means the model is trained on our documents."** Nothing inside the model changes. Relevant pieces are pasted into the prompt per question. Changing the weights is fine-tuning.
- **"Once we add RAG, the assistant stops hallucinating."** It reduces hallucination but does not eliminate it. A Stanford audit found 2024 legal RAG tools hallucinating 17% to 33% of the time.
- **"RAG is basically a vector database."** The index is one part. Answers depend as much on what was ingested and how it was chunked.

## Typical interview questions

<details>
<summary>What is RAG, and why use it instead of the model's own knowledge?</summary>

For each question, RAG retrieves relevant passages from an index into the prompt, and the model answers from them with sources. Model knowledge stops at a training cutoff and excludes private documents; retrieval adds current, private facts without retraining.

</details>

<details>
<summary>What is the difference between the ingestion path and the query path?</summary>

Ingestion runs ahead of time and whenever sources change: clean, chunk, embed, index. The query path runs per question: retrieve top chunks, build the prompt, generate a cited answer. Ingestion mistakes surface later as retrieval misses.

</details>

<details>
<summary>A client wants an assistant over 2,000 help articles. What do you build first?</summary>

Extract text keeping headings, chunk by section, index with source and date. Per question, retrieve a few chunks, have the model answer only from them with citations, and log chunk IDs. Test retrieval and answers separately on real questions before adding reranking.

</details>

<details>
<summary>Your RAG assistant gave a confident, wrong answer. How do you debug it?</summary>

Read that request's retrieved chunks before touching the prompt. Not indexed means fix ingestion; not retrieved means fix retrieval; retrieved but misused means fix generation. Then add the question to the eval set.

</details>

## Learn more

- Video: [What is Retrieval-Augmented Generation (RAG)?](https://www.youtube.com/watch?v=T-D1OfcDW1M) (IBM Technology, about 7 min)
- Practice: [Retrieval Augmented Generation with Claude](https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide) (Anthropic Claude Cookbook, about 90 min)
- Article: [Seven Failure Points When Engineering a Retrieval Augmented Generation System](https://arxiv.org/abs/2401.05856) (Barnett et al., CAIN 2024, about 30 min)

## Related

- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Context Engineering](../08-prompting-context-structured-output/04-context-engineering.md)
- [Chunking](./03-chunking.md)
- [Embeddings and Vector Search](./04-embeddings-and-vector-search.md)
- [Grounding and Citations](./07-grounding-and-citations.md)
