---
title: Documenting Known Limitations
row: M2-L6.9
---
**In one sentence:** Documenting known limitations means writing down, from evidence, what an AI assistant cannot do or cannot be trusted with, then telling users where it matters and the client in writing.

## What it is

Every AI assistant has gaps: out-of-scope topics, actions it has no tool for, lagging data, weaker languages, question types it often gets wrong, and unchecked claims. A known-limitations list writes them down.

Think of a medicine leaflet: what the drug treats, who should avoid it, how often each side effect happens. A limitations list gives an assistant the same specifics, not a vague "use with care."

Users get short notices in the product; the client gets the full register. Provider documents (model cards, system cards, Microsoft's Transparency Notes) cover only the base model. Your data, tools, scope and languages add limits only your evals and logs can measure.

## Why an FDE needs this

A training company's tutor assistant is about to launch. Marketing wants only a footer, "AI can make mistakes," because listing weaknesses "looks bad in demos." Error analysis of 300 pilot conversations found five gaps (table below).

The FDE cites Moffatt v. Air Canada (2024): a Canadian tribunal held the airline responsible for its chatbot's wrong bereavement-fare answer, even though the bot linked to the correct policy. Later, the register and a "policy last updated" date settle a refund dispute in an hour. (Illustrative scenario.)

## Key concepts

### What goes on the list

| Category | Example | What users see |
|---|---|---|
| Unsupported topics or actions | Cannot see grades or change enrollment | Welcome message says so, names who can help |
| Data lag | Refund policy re-indexed weekly | "Policy last updated September 21" |
| Languages | Spanish 81%, English 93% correct (hypothetical) | Spanish refund questions go to staff |
| Measured error rate | Prorated refund amounts sometimes wrong | Amounts come from Finance's calculator |
| Unverified conclusions | New statistics module unreviewed | "Not yet reviewed by an instructor" label |

### One register entry

```text
LIM-04      Prorated refund amounts can be wrong
Evidence    eval cases R-31 to R-44 ("wrong arithmetic")
Measured    9 of 14 correct (eval set v3, 2026-09-22)
Users told  inline: "Refund amounts are confirmed by Finance"
Workaround  finance calculator; staff queue
Owner       FDE lead; next review 2026-10-20
```

Numbers are illustrative. Evidence comes from evals and error analysis.

### Overreliance and OWASP Misinformation

Overreliance is users accepting incorrect AI output unchecked. OWASP's Top 10 for LLM Applications, 2026 edition (August 2026), calls it "a key factor" in Misinformation (LLM07:2026), where wrong output "is trusted and acted upon." Its mitigation "Distinguish verified facts from assumptions" is what an unverified label does. The aim is appropriate reliance: trusting correct answers, catching wrong ones.

### Telling users

Anthropic's Usage Policy requires consumer-facing chatbots to disclose they are AI "at a minimum at the beginning of each chat session"; laws such as the EU AI Act have similar rules, so confirm with the client's legal team. Then state what the assistant can do and how well (Microsoft's Human-AI Interaction guidelines).

Flag weak spots in place: Microsoft's Azure OpenAI guidance says to "mark numbers in generated outputs" if accuracy is lower with numbers. Kim et al. (FAccT 2024) found first-person uncertainty ("I'm not sure, but...") reduced overreliance, though not fully; general phrasing did less.

### Keeping it current

Update entries after each eval run or error analysis following a model, prompt, tool or data change, and monthly from escalation logs and feedback. A spike in transcript requests adds "cannot issue transcripts"; nightly re-indexing changes the data-lag notice the same day.

## Common misconceptions

- **"A footer saying 'AI can make mistakes' covers us."** It never says where mistakes happen, and linking the correct policy did not shield Air Canada.
- **"Listing limitations makes the product look weak."** People misjudge AI error rates both ways (Microsoft's guidelines); clear limits protect trust in what works.
- **"The assistant can tell users what it can't do."** Its self-description can be wrong and vary between runs; use fixed, reviewed text.

## Typical interview questions

<details>
<summary>What is a known-limitations document, and what goes in it?</summary>

An evidence-backed list of what the assistant cannot do or be trusted with: unsupported topics and actions, data lag, weaker languages, measured error rates and unverified conclusions, each with evidence, a date, a user notice and an owner.

</details>

<details>
<summary>How does a limitations list differ from refusal and fallback design?</summary>

Refusals and fallbacks handle the moment; the list records where and how often those moments arise, so people know in advance. One item often lives in both: "cannot compute refunds" on the list, a route to staff in the product.

</details>

<details>
<summary>Spanish refund answers score far below the 93% average. What do you do?</summary>

No single blended number. The register gets the per-language rate, eval set version, date and a mitigation such as routing to staff; the product gets a specific note there.

</details>

<details>
<summary>The client wants only a generic "AI may make mistakes" footer. What do you say?</summary>

It does not tell users what to check, and Air Canada was held responsible for its chatbot anyway. I offer short, specific user notices and keep the detailed register for the client.

</details>

## Learn more

- Reference: [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/) (Microsoft HAX Toolkit, about 20 min)
- Reference: [LLM07:2026 Misinformation](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM07_Misinformation.md) (OWASP GenAI Security Project, about 10 min)

## Related

- [Error Analysis and Failure Case Documentation](../11-ai-evaluation/03-error-analysis.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](../11-ai-evaluation/04-core-metrics.md)
- [Refusals and Fallbacks](./07-refusals-and-fallbacks.md)
- [Content Boundaries and Sensitive Requests](./02-content-boundaries.md)
- [Metadata, Filtering and Freshness](../09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md)
