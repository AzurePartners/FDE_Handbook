---
title: RAG Evaluation (Retrieval Quality, Groundedness, Source Support)
row: M2-L5.5
---
**In one sentence:** RAG evaluation scores a retrieval-based assistant across a whole eval set in separate stages: whether search found the right sources, whether every claim is backed by them, and whether each citation supports its claim.

## What it is

A RAG assistant fails in one of two places: search misses the right passage, or the model misuses one it was given. One end-to-end score cannot say which, so Anthropic's and OpenAI's cookbooks and promptfoo measure the stages separately.

Picture an open-book exam graded three ways: right pages opened, every sentence found on them, each footnote pointing to the page that says it. An essay can pass all three and still be wrong if the binder is last year's edition.

Precisely: **retrieval quality** asks whether a gold source (a passage labeled as holding the answer) reached the top k chunks sent to the model. **Groundedness** (Ragas: faithfulness) asks whether the retrieved text supports every claim. **Source support** asks whether each citation backs its own claim.

## Why an FDE needs this

A mobile carrier's support assistant answers plan questions from about 1,200 documents, with citations. It averages 0.91 "faithfulness" on an open-source framework's defaults, yet compliance asks how anyone knows it is not making things up.

The FDE builds 200 questions from real chats, has a specialist label gold sections and reference answers, and logs retrieved chunk IDs. Illustrative results: most failures never retrieved the gold section, because semantic search missed plan codes like `UNL-55` (a retrieval fix, not a bigger model). A few merged two plans' prices. Several were grounded, cited and wrong, quoting last year's plans still indexed, which the 0.91 never flagged.

## Key concepts

### Retrieval quality

Label gold sources by document section, not raw chunk ID, which changes whenever chunking does.

| Metric | Averaged over questions |
|---|---|
| Hit rate@k | Was any gold source in the top k? |
| Recall@k | What share of all gold sources were in the top k? |
| MRR (mean reciprocal rank) | 1 / rank of the first gold source (1, 1/2, 1/3) |

State k, and measure at the k actually sent to the model. "Context recall" in Ragas and promptfoo is an LLM estimate from the reference answer, not recall@k.

### Groundedness

Split the answer into claims and check each against the retrieved text with an LLM judge or NLI model (a classifier testing whether a passage entails a claim). promptfoo scores "Paris, with 2.2 million residents, is France's capital" 0.5 against "Paris is the capital of France". For release, fail any answer with an unsupported claim, as Google DeepMind's FACTS Grounding benchmark does. It also disqualifies evasive answers, which ground easily.

### Source support

A citation can point to real text that does not back its sentence. Claude's citations API guarantees valid pointers into your documents, not support. At eval time, a judge or person rates each claim and citation pair: full, partial or no support.

### Attribution across the set

For each case, record two facts: was a gold source in the top k the model received, and did the answer pass? Count cases per cell.

| | Answer passed | Answer failed |
|---|---|---|
| Gold retrieved | Working | Generation failure |
| Gold missed | Red flag: answered from memory, or labels incomplete | Retrieval failure (ingestion gap if never indexed) |

Fix the biggest failure cell first. Grounded answers still fail when the source is outdated, the wrong plan or region was retrieved, or an exception was dropped.

## Common misconceptions

- **"If the answer is grounded, it is correct."** Grounded means consistent with what was retrieved. An outdated policy yields a grounded but wrong answer, so also check accuracy.
- **"A cited sentence is a supported sentence."** A citation proves the text exists. A 2023 study of generative search engines found only about three quarters of citations supported their sentence.
- **"Our recall is 95%, so retrieval is fine."** At which k? Recall at 20 can look great while the 5 chunks the model receives miss it.
- **"The framework says 0.9 faithfulness, so we can trust it."** It is a judge's estimate with lenient defaults (promptfoo passes at 0.5, Microsoft at 3 of 5). Calibrate the judge against human labels.

## Typical interview questions

<details>
<summary>What is groundedness, and how do you measure it?</summary>

Every claim in the answer is supported by the retrieved sources. I split answers into claims, check each with a calibrated judge or NLI model, and fail any answer with an unsupported claim.

</details>

<details>
<summary>What is the difference between groundedness, source support and accuracy?</summary>

Groundedness: each claim is backed by something retrieved. Source support: each claim's own citation backs it. Accuracy: the answer matches the reference. Grounded, well-cited answers still fail accuracy when the source is outdated.

</details>

<details>
<summary>Accuracy is 70% and the client wants a larger model. What do you do?</summary>

Attribute failures first. If most failed cases never had a gold source in the top k, a larger model cannot help: fix retrieval or ingestion. If the gold source was there, it is a generation problem. Then re-run the same set.

</details>

<details>
<summary>Groundedness is 96%, but support agents say many answers are wrong. Why?</summary>

Grounded only means faithful to what was retrieved. I would check the wrong answers' sources for superseded or wrong documents, add accuracy checks and fix index freshness.

</details>

## Learn more

- Article: [Q: How should I approach evaluating my RAG system? (AI Evals FAQ)](https://hamel.dev/blog/posts/evals-faq/how-should-i-approach-evaluating-my-rag-system.html) (hamel.dev, about 10 min)
- Practice: [Retrieval Augmented Generation with Claude](https://platform.claude.com/cookbook/capabilities-retrieval-augmented-generation-guide) (Anthropic Claude Cookbook, about 90 min)
- Article: [The FACTS Grounding Leaderboard](https://storage.googleapis.com/deepmind-media/FACTS/FACTS_grounding_paper.pdf) (Google DeepMind, about 40 min)

## Related

- [Grounding and Citations](../09-rag-knowledge-bases/07-grounding-and-citations.md)
- [Hybrid Search, Reranking and Query Rewriting](../09-rag-knowledge-bases/06-hybrid-search-and-reranking.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](./04-core-metrics.md)
- [LLM-as-Judge](./07-llm-as-judge.md)
- [Knowledge Gaps and Insufficient Evidence](../09-rag-knowledge-bases/08-knowledge-gaps.md)
