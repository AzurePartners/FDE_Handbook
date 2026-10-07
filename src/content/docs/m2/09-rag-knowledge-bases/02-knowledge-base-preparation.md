---
title: Knowledge Base Preparation (Source Selection, Parsing, Cleaning)
row: M2-L3.2
---
**In one sentence:** Knowledge base preparation is choosing which documents an assistant may answer from, converting them into clean text that keeps headings and tables, and checking they cover what real users ask.

## What it is

A RAG assistant can only answer from its knowledge base, the documents it searches. Preparing it comes before chunking and embedding, so mistakes here get indexed and repeated with confidence.

Think of a librarian stocking a reference shelf: they shelve the official edition and refuse photocopies they cannot vouch for. Readers find only what is on the shelf.

It has four jobs. **Source selection** lists every source with an owner and picks one authoritative version. **Parsing** converts a file (PDF, web page, Word) into text plus structure: headings, paragraphs, tables. **Cleaning** removes what carries no meaning. **Coverage checking** confirms the documents answer real user questions.

## Why an FDE needs this

A college wants a student-support assistant built from a SharePoint export and its course website. The prototype quotes a deadline from `Academic_Policy_v4_DRAFT.docx`, not the published v3, because both were ingested. It misses the fee policy, a scanned PDF with no text layer. Every course-page chunk starts with the same navigation menu. A flattened tuition table pairs fees with the wrong enrollment status. An open-upload folder was indexed too, including a student's note claiming extensions are automatic.

None of this is a prompt problem. The FDE fixes it all before embedding: named owners (registrar, bursar, course leads), approved sources only, a layout-aware parser with OCR (optical character recognition, which reads page images), and spot-checks against the originals.

## Key concepts

### Source inventory and trusted ingestion

List each source with its owner, authoritative version and a decision: include, exclude or ask. Drafts, duplicates and outdated copies stay out.

Anything anyone can upload or edit is untrusted. OWASP lists Data and Model Poisoning (LLM05:2026) as a top risk and advises tracking where data comes from and keeping untrusted sources apart from trusted ones. In a research setting, PoisonedRAG (USENIX Security 2025) steered answers about 90% of the time with five planted texts per target question among millions. So uploads wait in quarantine until a named owner approves them.

### Parsing by source type

| Source | Problem | Approach |
|---|---|---|
| Digital PDF | Columns mixed, tables flattened | Layout-aware parser |
| Scanned PDF | No text layer | OCR or a vision model |
| Web page | Menus, banners, footers | Main-content extraction |
| Word file | Some model APIs reject `.docx` | Convert to Markdown or PDF |

Converters such as Docling (MIT license, runs locally) and Microsoft MarkItDown output Markdown that keeps headings and tables. Cloud layout services need the documents uploaded; confirm the client allows it. Claude accepts PDFs directly (page images plus extracted text), and vision models read scans well but can compress table layout, so spot-check numbers.

```text
Plain extraction: Part-time Full-time 1,250 2,400
Layout-aware:     | Part-time | 1,250 |
                  | Full-time | 2,400 |
```

### Cleaning: drop noise, keep structure

Remove navigation menus, repeated headers and footers, cookie banners, watermarks, broken hyphenation and garbled characters. Keep headings, tables, lists and image captions, because chunking and citations depend on them. Save parsed output to inspect it and re-chunk without re-parsing.

### Coverage against real questions

Gather real questions from tickets, FAQs and search logs alongside the documents. A subject matter expert maps each to the passage that answers it. Unmatched questions are content gaps, the first of seven RAG failure points in Barnett et al. (CAIN 2024). Send them to content owners, not the prompt.

## Common misconceptions

- **"Just load the whole shared drive. More documents means better answers."** Drafts and stale copies compete with the official version, causing conflicting answers.
- **"A PDF is text, so any PDF library gets the words out."** Scanned PDFs are page images that need OCR or a vision model.
- **"Cleaning means stripping everything down to plain text."** Chunking and citations need headings and tables; remove only noise.
- **"Poisoning is a training problem. Our knowledge base is just documents."** OWASP counts embedding data as a poisoning target; a few planted documents can steer answers.

## Typical interview questions

<details>
<summary>What does knowledge base preparation cover, and why does it come first?</summary>

Choosing approved, authoritative sources, parsing them into structured text, stripping boilerplate, and checking coverage against real questions. Everything downstream sees only this text.

</details>

<details>
<summary>What is the difference between parsing and cleaning?</summary>

Parsing turns a file format into text plus structure, with OCR for page images. Cleaning removes menus, repeated footers and other noise while keeping headings and tables.

</details>

<details>
<summary>A client hands over a 40 GB SharePoint export. What goes in?</summary>

Start from real tickets and have each area's owner name the authoritative documents. Exclude drafts, archives and open-upload folders. Parse a sample of each format and check it against the originals first.

</details>

<details>
<summary>The assistant quotes fees that do not match the official table. Where do you look first?</summary>

The retrieved chunk, then its parsed source. Usually a flattened table lost its labels, or a stale fee sheet was ingested. Fix the parser or remove the copy, then re-ingest.

</details>

## Learn more

- Article: [Develop a RAG Solution: Preparation Phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase) (Microsoft Azure Architecture Center, about 20 min)
- Practice: [Docling](https://github.com/docling-project/docling) (Docling Project, GitHub, about 15 min)
- Reference: [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) (OWASP GenAI Security Project, about 20 min)

## Related

- [CSV and Tables](../../m1/03-apis-data-integration/08-csv-and-tables.md)
- [Retrieval-Augmented Generation (RAG)](./01-retrieval-augmented-generation.md)
- [Chunking](./03-chunking.md)
- [Metadata, Filtering and Freshness](./05-metadata-filtering-and-freshness.md)
- [RAG vs Alternatives (Long Context, Fine-Tuning, Databases, APIs)](./09-rag-vs-alternatives.md)
