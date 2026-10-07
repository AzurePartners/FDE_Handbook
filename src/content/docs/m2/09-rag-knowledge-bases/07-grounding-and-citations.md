---
title: Grounding and Citations
row: M2-L3.7
---
**In one sentence:** Grounding means an answer may use only the sources supplied with the request, and citations tie each claim to the exact chunk it came from, so a person or a program can check it.

## What it is

Retrieval puts relevant chunks (passages cut from the client's documents) into the prompt, but the model can still add facts from training memory, guess at gaps or contradict the chunks. Grounding is the rule on top: use only the sources supplied in this request. A citation is the evidence trail, pointing each claim to the chunk, page or quote behind it.

Think of an expense report: every line item needs a receipt stapled to it, and a clerk checks that each receipt exists and matches the amount before anyone judges whether the expense was allowed. Grounding works the same way: instruct, cite, then check citations in code before anyone sees them.

## Why an FDE needs this

An insurer's claims assistant answers adjusters from about 300 policy PDFs, ending each answer with a source like "[Doc 12, p. 4]". But none of the 8 retrieved chunks was Doc 12: the model copied the format and invented the number. Another answer says claims are due within 90 days; the cited chunk says 60. Adjusters go back to searching PDFs by hand. (Illustrative scenario.)

The FDE adds stable chunk IDs, an exact quote per claim and a code check that catches both failures first. OWASP's Top 10 for LLM Applications 2026 lists weak grounding as a cause of Misinformation (LLM07:2026).

## Key concepts

### Instructing for grounding

Tag each chunk with a stable ID. OpenAI's prompting guidance found XML-style tags work well in long contexts and JSON poorly.

```text
<doc id="policy-HO3-2026#s4.2" page="4">Claims must be filed within 60 days...</doc>
Answer only from the documents. For each claim, give the doc id and a
short exact quote.
```

Strictness is a design choice (documents only, or basic general knowledge allowed). For long material, Anthropic suggests quote-then-answer: extract exact quotes first, then answer from them. Instructions reduce ungrounded claims but do not remove them.

### Prompt-based vs native citations

Prompt-based citations work with any model and with JSON output (a `chunk_id` and `quote` per claim), but both can be invented. Native features differ:

| Feature | Returns | Watch out for |
|---|---|---|
| Anthropic Citations | Exact `cited_text` plus character, page or block location | All documents or none; not with structured outputs |
| OpenAI `file_search` | `file_citation` with `file_id` and `filename` | Names a file, not a passage |
| Gemini grounding metadata | `grounding_supports` linking answer segments to chunks | Offsets in bytes, not characters |

Anthropic guarantees "valid pointers to the provided documents": the passage exists, not that it supports the claim.

### Checking citations in code

```python
import re, unicodedata

def norm(s):
    s = unicodedata.normalize("NFKC", s).replace("\u2019", "'")
    s = s.replace("\u201c", '"').replace("\u201d", '"')
    return re.sub(r"\s+", " ", s).strip().lower()

def check(claims, retrieved):  # retrieved = {chunk_id: text}
    fails = []
    for c in claims:
        if c["chunk_id"] not in retrieved:
            fails.append((c["chunk_id"], "not_retrieved"))
        elif norm(c["quote"]) not in norm(retrieved[c["chunk_id"]]):
            fails.append((c["chunk_id"], "quote_not_found"))
    return fails
```

Normalizing avoids false failures from spacing, case or curly quotes; fuzzy matching would let "90 days" pass for "60 days". Also flag uncited numbers, dates and amounts. On failure, regenerate once, then show the passages without an answer, and log it. A real quote attached to the wrong claim still passes; support is judged at eval time.

### Showing sources to users

Ding et al. (2025) found citations raised trust even when random, so make them checkable: give each claim a numbered marker that opens the exact passage, and list only cited sources.

## Common misconceptions

- **"We use RAG, so our answers are grounded."** Retrieval only supplies sources; the model can still add memory or contradict them.
- **"If an answer has a citation, the claim is supported."** The passage can be real yet not support the claim; a 2024 Stanford study called such answers "misgrounded."
- **"Provider citation features make my own checks unnecessary."** OpenAI's `file_citation` names only a file, and no native feature flags an uncited claim.
- **"Listing every retrieved document counts as citing sources."** It hides which statement came from where and includes unused chunks.

## Typical interview questions

<details>
<summary>What is grounding, and how is it different from retrieval?</summary>

Retrieval puts relevant chunks in the context. Grounding requires the answer to use only them, with each claim traceable to one. I instruct for it, require citations and check them in code.

</details>

<details>
<summary>What is the difference between prompt-based and native citations?</summary>

Prompt-based means asking for a chunk ID and quote per claim: it works with any model and with JSON, but both can be invented. Native features return exact cited text with valid pointers, though not proof of support.

</details>

<details>
<summary>A client wants JSON output and Claude's native Citations. What do you tell them?</summary>

They can't be combined; the API returns a 400 error. I'd put `chunk_id` and `quote` fields in the schema and verify them in code, or make two calls: a cited prose answer, then JSON extraction.

</details>

<details>
<summary>The assistant cites Section 4.2, but that section says something else. How do you debug it?</summary>

Pull the logged request. If the chunk wasn't retrieved or the quote isn't in it, the citation was fabricated and my check has a gap. If the quote is real but does not support the claim, I check retrieval and chunking, then add the case to the eval set.

</details>

## Learn more

- Reference: [Citations](https://platform.claude.com/docs/en/build-with-claude/citations) (Anthropic, Claude Docs, about 20 min)
- Practice: [Citations (Claude Cookbook)](https://platform.claude.com/cookbook/misc-using-citations) (Anthropic, Claude Cookbook, about 45 min)
- Interactive: [Learn about Gemini Notebook (formerly NotebookLM)](https://support.google.com/gemininotebook/answer/16164461?hl=en&co=GENIE.Platform%3DDesktop) (Google, Gemini Notebook Help, about 20 min)

## Related

- [Retrieval-Augmented Generation (RAG)](./01-retrieval-augmented-generation.md)
- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Knowledge Gaps and Insufficient Evidence](./08-knowledge-gaps.md)
- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](../11-ai-evaluation/05-rag-evaluation.md)
