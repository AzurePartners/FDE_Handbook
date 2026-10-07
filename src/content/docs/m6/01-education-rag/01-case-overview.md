---
title: "Case Overview: Tutor / Support RAG"
row: M6-L1.1
rows:
  - M6-L1.1
  - M6-L1.2
  - M6-L1.3
---
**In one sentence:** A tutor or support assistant answers questions from course materials, FAQs, policies and past Q&A, cites the passage behind every answer, says so when the sources do not cover the question, and hands off to a person when it should.

## The business scenario

An education business already has the answers its students and customers need. They sit in course handouts, a FAQ page, a refund policy, an enrolment handbook and years of answered support tickets. The problem is that nobody can find them quickly. Students ask the same twenty questions every week. Support staff paste the same replies. New staff give different answers from old staff because they found different documents.

The job is to put a conversational front door on knowledge that already exists. The assistant does not decide anything, change any record or take any action. It finds the right passage and answers from it.

## Why this is the simplest archetype

This is the first rung of the ladder for a reason. Three features of the problem keep it simple:

- **The answer already exists in writing.** The system's job is retrieval, not reasoning over live data.
- **Nothing is written back.** The assistant only reads, so a wrong answer is embarrassing but reversible.
- **Every answer can carry its own proof.** A citation lets the reader check the source in seconds.

When all three hold, RAG alone is enough. Knowing when to stop is the lesson. Wrapping this in a multi-agent team would add hand-offs, latency and new ways to fail without making a single answer more correct.

## Minimum architecture

```text
Student / customer
      │  question
      ▼
UI / Puffo / n8n  ──► Retrieve passages ──► Answer with citations
                           ▲                     │
                           │                     ├─ covered?  → answer + sources
Knowledge base ◄── Ingest  │                     ├─ not covered → "I don't know" + route
(materials, FAQ, policy,   │                     └─ risky topic → escalate to a person
 past Q&A, with dates)     │
                      Update path (new FAQ replaces old)
```

| Component | Job | What goes wrong without it |
|---|---|---|
| Ingestion | Turn documents into searchable passages with their source, section and date | Tables and PDFs break into nonsense chunks |
| Retrieval | Find the few passages that actually answer the question | The model answers from the wrong passage, fluently |
| Grounded answer | Answer only from the retrieved passages and cite them | The model fills gaps from its own training |
| Unknown / refusal | Say "the materials don't cover this" when retrieval finds nothing good | The assistant guesses, and guesses sound confident |
| Escalation | Route refunds, complaints and anything personal to a person | The assistant improvises policy |
| Update path | Replace outdated passages when a policy changes | Last year's refund rule outranks this year's |

## Where it actually gets hard

The architecture fits on one screen. The work is in five places:

1. **Ingestion quality.** Slides, scanned PDFs and tables need care. A chunk that loses its heading loses its meaning. Anthropic's Contextual Retrieval approach adds a short description of where each chunk sits in its document before indexing it.
2. **Retrieval quality.** Most "hallucinations" in RAG systems are retrieval failures. The model faithfully summarised the wrong passage.
3. **Grounding.** The answer must stay inside the retrieved text. Citations make this checkable, both by the reader and by an automated eval.
4. **Unknown and refusal behaviour.** "I don't know, here is who can help" is a correct answer. It needs its own test cases.
5. **Knowledge freshness.** When the FAQ changes, the old version must stop being retrievable. Stale knowledge is the most common silent failure, because the answer looks exactly as confident as a correct one. Add a freshness check: every passage carries its source date, and superseded documents are removed, not merely outranked.

## Common misconceptions

- **"More agents would make it better."** Each extra agent adds a hand-off that can lose context. If one retrieval step and one answer step solve the problem, stop there.
- **"RAG removes hallucination."** It moves the risk. The model can still answer beyond its sources or from the wrong source. Citations and evals are what make the risk visible.
- **"A refusal is a failure."** For questions outside the knowledge base, refusing and routing to a person is the success case.
- **"Uploading documents once is enough."** Knowledge goes stale. The update path is part of the product, not an afterthought.

## Typical interview questions

<details>
<summary>A client wants a support assistant built as five cooperating agents. How do you respond?</summary>

Ask what each agent would own that a single retrieve-and-answer step cannot. If the answers already exist in documents and the assistant takes no actions, one grounded RAG step with citations, refusal and escalation is simpler, faster and easier to evaluate. Agents become worth it when there are separate responsibilities, such as actions on accounts or an independent review, not before.

</details>

<details>
<summary>Users report that the assistant gives the old refund policy. Where do you look first?</summary>

The knowledge base, not the prompt. Check whether the old policy document is still indexed and whether the new one was ingested with a later date. Then fix the update path so superseded documents are removed, and add a test case that asks the refund question and checks the cited source date.

</details>

<details>
<summary>How would you measure whether the assistant is good enough to launch?</summary>

Build an evaluation set from real past questions, including ones the materials do not cover. Measure answer correctness, citation correctness (does the cited passage actually support the answer), refusal on out-of-scope questions, and how often it escalates. Agree the launch thresholds with the client before tuning.

</details>

## Learn more

- Article: [Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) (Anthropic)
- Docs: [Citations](https://platform.claude.com/docs/en/build-with-claude/citations) (Claude docs)
- Docs: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) (Claude docs)
- Article: [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) (Hamel Husain)
- Code: [Claude Cookbook, customer support and RAG recipes](https://github.com/anthropics/anthropic-cookbook) (Anthropic)
- Course: [Generative AI for Beginners, RAG lesson](https://github.com/microsoft/generative-ai-for-beginners) (Microsoft)
- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic)

## Related

- [PRD: Course Support Assistant](./02-prd.md)
- [Reference Build: Support RAG on n8n](./04-reference-build-n8n.md)
- [Extension: From RAG to Support Agent](./06-extension.md)
- [Cross-Case Comparison](../05-cross-case/01-comparison.md)

*Syllabus rows: M6-L1.1, M6-L1.2, M6-L1.3*
