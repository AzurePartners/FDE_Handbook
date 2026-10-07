---
title: Cross-Case Comparison
---
**In one sentence:** Set side by side, the four cases show that technical depth is earned by the problem: each step up the ladder is triggered by a specific property of the work, and the same few ideas (grounding, independent review, human gates, code-owned numbers) recur at increasing strength.

## The four cases side by side

| | 1. Tutor / support | 2. Content operations | 3. Provider research | 4. Trading desk |
|---|---|---|---|---|
| System complexity | <span class="lvl lvl-1">Low</span> | <span class="lvl lvl-2">Medium</span> | <span class="lvl lvl-3">Medium-high</span> | <span class="lvl lvl-4">High</span> |
| Output | A cited answer | An editable HTML asset and PNG | A dataset with splits and a workbook, a README on sources, selection rule, limits and compliance, and a BuildManifest | Published calls, a recommendation card, a paper portfolio, scored outcomes |
| Core pattern | Retrieve and answer | Staged pipeline with a review loop | Agents define and attack; code builds | Agents interpret and dissent over a deterministic backend |
| Agents | None required | 4 | 5 | 6 |
| Who owns facts and numbers | Source documents, via citations | Canonical fact files in the repository | The deterministic pipeline; agents calculate nothing | The backend; agents cite evidence IDs |
| Independent check | Grounding and refusal | Fact & Compliance Reviewer on the stronger model reads the real asset | Challenger: seven lenses, 2-of-3 verifiers, a critic that cannot see the answer | Risk agent that cannot see other signals; hash-stored text |
| Human gate | Escalation to a person | Operator escalations; marketer edits, marks complete and publishes manually | GATE R before the large download; GATE D before delivery | PM starts the review; mentor approves thresholds and the rule freeze |
| Time and freshness | Superseded documents retired | Canonical facts kept current in one place | Source versions and hashes; manifest diff against the previous run | Point-in-time snapshots; cutoff per run; first-reported values |
| Must never happen | An invented answer | An unconfirmed fact reaching the marketer | Contacting a provider; DIRECT fields reaching the marketing view | A real order; lookahead; an agent-typed number |
| How success is judged | Eval set accuracy, citations, refusals | Acceptance tests; reviewer blocks planted errors | Nine assertions pass; two clean QA rounds; sign-off at GATE D | Holdout and forward results after costs; calls scored |

## What triggers each step up

| Step | The property of the problem that forces it |
|---|---|
| RAG → pipeline | The output is a produced artifact, and whoever creates it should not approve it |
| Pipeline → agent-planned build | The output is data whose correctness must be defended to a third party, so numbers move into code |
| Build → decision desk | The output is a judgement about the future, made from numbers that change over time, so it must be point-in-time and scored |

If none of these properties is present, stay on the lower rung. That is the lesson the syllabus states for Lesson 1: do not force a multi-agent architecture just to appear more advanced.

## Ideas that recur

**Grounding becomes ownership.** Lesson 1 asks the model to cite its source. Lesson 2 puts facts in canonical files the reviewer checks. Lesson 3 forbids the agents from calculating. Lesson 4 forbids them from typing a number at all. Each step removes a place where the model could be wrong.

**Review becomes isolation.** Lesson 2's reviewer is independent of the writer. Lesson 3's ontology critic re-derives the code set without seeing the answer. Lesson 4's Risk agent cannot see the other signals and cannot have its words edited.

**The human gate moves earlier.** In Lesson 2 the human signs off the finished asset. In Lesson 3 the human approves sources and the code set at GATE R, before the expensive download. In Lesson 4 the thresholds and the rule freeze are approved before the results they judge.

**What is absent is designed.** Lesson 2 produces no PPTX. Lesson 3 has no way to contact anyone. Lesson 4 has no order path, checked by a repository scan. Leaving a capability out entirely is safer than switching it off.

## Choosing the archetype for a new problem

Ask these questions in order and stop at the first "yes":

1. Does the answer already exist in documents, and does the system only read? **Start with Lesson 1.**
2. Is the output an artifact that passes through distinct stages and needs independent review? **Start with Lesson 2.**
3. Is the output data that a third party will challenge, where every count must be reproducible? **Start with Lesson 3.**
4. Is the output a decision based on changing numbers, which can later be scored against what happened? **Start with Lesson 4.**

Most client requests land on rung 1 or 2. Many are pitched as rung 4.

## Typical interview questions

<details>
<summary>What single principle connects all four cases?</summary>

Put each responsibility where it can be checked. Facts go where they can be cited, numbers go where they can be reproduced, dissent goes where it cannot be led, and decisions go where they can be scored. The number of agents follows from that, not the other way round.

</details>

<details>
<summary>A client describes a problem and asks for "a team of agents like the trading desk". How do you decide?</summary>

Walk the four questions above with them. If the output is a cited answer from existing documents, a trading-desk architecture adds cost and failure points with no benefit. Match the machinery to the property of the problem, and explain which property would justify the next step up.

</details>

## Related

- [Introduction](../00-introduction/01-introduction.md)
- [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md)
- [Case Overview: Trading Desk](../04-trading-desk/01-case-overview.md)
