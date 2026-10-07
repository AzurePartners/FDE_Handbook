---
title: Chunking
row: M2-L3.3
---
**In one sentence:** Chunking is splitting each document into smaller, self-contained pieces called chunks, which are embedded and searched separately so retrieval can hand the model only the passages that answer a question.

## What it is

A RAG assistant searches chunks, not whole documents: a section or one FAQ answer, indexed separately. Chunking decides where the cuts fall, once at ingestion, between parsing and embedding.

Think of turning a manual into index cards. Cut in the wrong place and one card says "Returns within 30 days" while the next says "except clearance items." A good card holds one complete idea, with its section written at the top.

Chunking exists because models have input limits (Azure OpenAI's `text-embedding-3-small` takes at most 8,191 tokens) and because one vector for a many-topic page represents none of them well. Size is the trade-off: small chunks embed sharply but lose context, such as what "it" means, while large chunks blur the embedding and pull irrelevant text into the prompt.

## Why an FDE needs this

A retailer's support assistant answers from its returns policy, FAQ and warranty terms, cut into 500-character pieces. Asked about returning a clearance jacket, it says yes, within 30 days. The FDE reads the retrieved chunks. One ends "Customers may return items within 30 days." The exception, "This does not apply to clearance items," opens the next chunk, which ranked too low to be retrieved. The warranty table was also split, leaving rows like `Gold | 24 | Yes` with no headers.

The fix: split on headings, one chunk per FAQ pair, tables whole, a context header on every chunk, then re-index and recheck 40 real questions from the ticket log.

## Key concepts

### Splitting strategies

| Strategy | Where it cuts |
|---|---|
| Fixed-size | Every N tokens or characters |
| Recursive | Paragraphs, then lines, then words, only while a piece is too big |
| Structure-aware | Headings, numbered clauses, question and answer pairs |
| Semantic | Where embedding similarity drops, or where an LLM decides |

Start structure-aware, with a recursive fallback for long sections. A Vectara study (Findings of NAACL 2025) found semantic chunking's gains inconsistent for its extra compute.

```python
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter)

by_heading = MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "doc"), ("##", "section")])
fallback = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)

sections = by_heading.split_text(policy_markdown)  # headings go to metadata
chunks = fallback.split_documents(sections)
for c in chunks:  # context header
    c.page_content = " > ".join(c.metadata.values()) + "\n" + c.page_content
```

Here `chunk_size` counts characters, not tokens: 1,500 is roughly 375 tokens of English.

### Size and overlap

Overlap repeats a little text across each cut so a sentence at the edge survives whole, at the cost of more chunks. Starting points differ by tool (as of September 2026):

| Tool | Default or recommended start |
|---|---|
| OpenAI file search, `auto` | 800 tokens, 400 overlap |
| Azure AI Search guidance | 512 tokens, 25% overlap |
| LlamaIndex `SentenceSplitter` | 1,024 tokens, 200 overlap |

Parent-child retrieval eases the trade-off: search small chunks, then hand the model their parent section.

### Keep complete ideas together

Keep a rule with its exceptions, and each FAQ question with its answer. Keep a table whole if it fits; otherwise split it by rows and repeat the header row in each piece.

### Context headers

The chunk "The company's revenue grew by 3% over the previous quarter" names no company or quarter. Prepend a chunk-specific header, such as `Returns Policy > Clearance items`, and embed it with the text. In Anthropic's Contextual Retrieval (2024), LLM-written context per chunk cut retrieval failures by 35%; generic document summaries gave "very limited gains." A header is embedded text, while metadata sits beside the chunk for filtering.

### Testing chunk choices

Microsoft calls chunking "a semipermanent choice": changing it means re-indexing everything. Before production, take 20 to 50 real questions, note each one's answer passage, and check it comes back in the top results.

## Common misconceptions

- **"Smaller chunks are always more precise."** They lose what "it" or "the plan" means, so they get retrieved but cannot answer.
- **"The right chunk size is 512 tokens."** Vendor starting points range from 512 to 1,024 tokens. Test sizes on your own questions.
- **"More overlap fixes boundary problems."** Overlap protects sentences near a cut, not a rule three paragraphs from its exception, and it adds near-duplicate chunks.

## Typical interview questions

<details>
<summary>What is chunking, and why does RAG need it?</summary>

Splitting documents into pieces that are embedded and indexed separately. Models have input limits, one vector for a multi-topic document matches no question well, and focused passages keep prompts cheap and relevant.

</details>

<details>
<summary>What is the difference between fixed-size, recursive and structure-aware chunking?</summary>

Fixed-size cuts every N tokens, ignoring sentences. Recursive tries paragraph, then line, then word breaks. Structure-aware splits on the document's own units, such as headings or FAQ pairs, so each chunk holds one idea.

</details>

<details>
<summary>How would you chunk a 200-page HR manual full of tables and "except when" clauses?</summary>

Split on headings so rules keep their exceptions, with a recursive fallback for long sections. Keep tables whole or repeat header rows, prepend a path like "Leave > Parental leave", and test on 30 to 50 real questions.

</details>

<details>
<summary>A teammate wants to switch to LLM-based chunking. How do you decide?</summary>

Compare both on real questions with known answer passages. Semantic chunking often fails to justify its cost, and switching means re-indexing everything.

</details>

## Learn more

- Practice: [5 Levels Of Text Splitting](https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb) (Greg Kamradt, GitHub notebook, about 45 min)
- Article: [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) (Anthropic Engineering, about 20 min)
- Reference: [Chunk large documents for RAG and vector search in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents) (Microsoft Learn, about 12 min)

## Related

- [Knowledge Base Preparation (Source Selection, Parsing, Cleaning)](./02-knowledge-base-preparation.md)
- [Embeddings and Vector Search](./04-embeddings-and-vector-search.md)
- [Metadata, Filtering and Freshness](./05-metadata-filtering-and-freshness.md)
- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](../11-ai-evaluation/05-rag-evaluation.md)
