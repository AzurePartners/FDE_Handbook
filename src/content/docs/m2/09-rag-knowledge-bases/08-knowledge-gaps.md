---
title: Knowledge Gaps and Insufficient Evidence
row: M2-L3.8
---
**In one sentence:** A knowledge gap is a question your sources cannot answer; handling it means detecting missing or conflicting evidence, saying "that is not in our material" instead of guessing, and logging the gap so someone fills it.

## What it is

Retrieval always returns something. Vector search returns the k nearest chunks (k is a number you set) even for nonsense; weak matches just score lower. So "chunks came back" never means "the answer is here."

Picture an open-book exam: a pile of open pages does not mean any page answers the question. The honest reply is "that is not in the book," not a guess stitched from nearby pages.

Evidence is insufficient when the retrieved chunks alone would not let a careful reader answer: the fact is missing, partial or contradicted, or the question is ambiguous. Google's "Sufficient Context" study (ICLR 2025) found that given related but incomplete context, strong models tended to answer rather than abstain.

## Why an FDE needs this

A Northwind Academy student asks the assistant whether they can pause a course and rejoin the October cohort. No pause policy exists, yet retrieval returns three healthy-scoring chunks: a payment FAQ (access pauses after a missed installment), the course page (next cohort 6 October) and the late-work policy (extensions up to 7 days). The model replies "Yes, pause for up to 7 days and rejoin on 6 October." The student stops attending; the registrar must unwind it. (Illustrative scenario.)

No prompt alone fixes this. The FDE adds a gate in code that detects the gap, flags it for escalation and logs it.

## Key concepts

### The answer-or-abstain gate

The relevance cut-off (see Related) decides which chunks enter the prompt; the confidence threshold decides whether to answer at all. It combines the top retrieval score with a sufficiency and conflict check, usually a separate LLM call returning JSON:

```python
v = judge_sufficiency(question, chunks)  # {"sufficient": false, "conflict": false}
if top_score(chunks) < cfg.score_floor or not v["sufficient"]:
    status = "insufficient_evidence"
elif v["conflict"]:
    status = "conflicting_sources"
else:
    status = "answer"
if status != "answer":
    log_gap(question, chunks, v, status, cfg.threshold_version)
```

A status field, not free text, lets code count and route non-answers. The user hears something like "our published policies don't cover pausing a course"; refusals and escalation own the rest. Still let the model say it doesn't know: Anthropic says this "can drastically reduce false information," though not to zero.

### Conflicting sources

The FAQ allows 7-day extensions; one course page says 5. If neither is an outdated version, don't silently pick one: return `conflicting_sources`, say the sources disagree, and flag both pages for their owners.

### Tuning the threshold

Scores are ranking signals, not probabilities. OpenAI file search's `score_threshold` runs 0 to 1, Azure AI Search's reranker 0 to 4, and Vertex AI RAG Engine uses distance or similarity; scores also shift with the query and model version. So no value like 0.7 is universal: too strict floods staff with needless handoffs, too loose gives confident wrong answers. Sweep it over a labeled set with unanswerable and conflicting questions, counting correct answers, wrong answers and needless handoffs. Pick the lowest cost using client-agreed weights (a wrong refund answer might equal ten handoffs); re-tune when the embedding model, reranker or corpus changes.

### The gap log

Log each non-answer with the question, chunk IDs, scores, failed check and threshold version. Review and sort it regularly: missing content (an owner writes it), retrieval miss where the answer existed (engineering fix), conflict (owners reconcile) or ambiguous question. At Northwind, the pause question kept recurring, so the registrar wrote a policy.

## Common misconceptions

- **"If retrieval returned chunks, the answer is in there."** Search always returns its top k, even for nonsense.
- **"A high similarity score means the chunks answer the question."** Similarity measures relatedness, not sufficiency.
- **"Telling the model to say 'I don't know' solves it."** It helps, but Microsoft's docs said the "limit responses to your data" setting of Azure OpenAI On Your Data (retiring 14 October 2026) "isn't a hard switch." Add checks in code.
- **"The strictest threshold is the safest."** It floods staff with answerable questions; weigh what each mistake costs.

## Typical interview questions

<details>
<summary>What is insufficient evidence, and why isn't a non-empty retrieval result enough?</summary>

The chunks alone don't let a careful reader answer: the fact is missing, partial or contradicted, or the question is ambiguous. Nearest-neighbor search always returns its top k, so I add a sufficiency check.

</details>

<details>
<summary>How does a relevance cut-off differ from a confidence threshold?</summary>

The cut-off filters which chunks enter the context. The threshold decides whether to answer at all, combining scores with sufficiency and conflict checks. Related chunks can pass the cut-off without containing the answer.

</details>

<details>
<summary>Two current documents give different answers. What should the assistant do?</summary>

Rule out an outdated version. If both are current, don't pick one: say the sources disagree, route to a person, and log both for their owners.

</details>

<details>
<summary>The client complains about handoffs, but the bot once gave a wrong refund answer. How do you set the threshold?</summary>

Sweep it over a labeled set including unanswerable questions, counting correct answers, wrong answers and needless handoffs. Weight those by client-agreed costs, stricter for refunds, and re-run when models or content change.

</details>

## Learn more

- Reference: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) (Anthropic, Claude Docs, about 8 min)
- Article: [Deeper insights into retrieval augmented generation: The role of sufficient context](https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/) (Google Research Blog, about 12 min)

## Related

- [Hybrid Search, Reranking and Query Rewriting](./06-hybrid-search-and-reranking.md)
- [Grounding and Citations](./07-grounding-and-citations.md)
- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](../11-ai-evaluation/05-rag-evaluation.md)
- [Refusals and Fallbacks](../12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)
- [Escalation Paths and Human Takeover](../12-safety-guardrails-hitl/08-escalation-and-human-takeover.md)
