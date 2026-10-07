---
title: Introduction
---
**In one sentence:** Module 6 walks through four real Azure Partners projects of rising complexity. Each one is documented with the same four-part delivery pack, so you can watch one FDE method applied at four levels of technical depth.

## What this module is

Modules 1 to 5 teach concepts one page at a time: RAG, tool calling, agent state, data provenance, discovery, scope. This module puts those concepts back together. Each lesson is one project that Azure Partners scoped or built, told through the documents the team wrote for it.

The industries are the setting, not the point. A tutoring assistant, a marketing studio, a provider list and a trading desk look unrelated. They share one question, the one an FDE asks every time: **what is the least machinery this problem genuinely needs, and what has to be true before anyone can trust the output?** The four answers get progressively heavier. Each step up is justified by something in the problem itself, not by a wish to look advanced.

## The complexity ladder

| Lesson | Case | What it adds over the previous case | Agents |
|---|---|---|---|
| 1 | Education tutor / customer support | Retrieval, citations, refusal and escalation. Nothing else. | None required |
| 2 | Content operations (Puffo Marketing Studio) | Separate roles, structured hand-offs, an independent reviewer, human editing | 4 |
| 3 | Healthcare provider research | Two human gates, a deterministic pipeline that owns every number, a challenger with a critic that cannot see the answer | 5 |
| 4 | Finance research / trading desk | Point-in-time data, evidence IDs, frozen rules, publishing checks, scoring against what really happened | 6 |

The [Cross-Case Comparison](../05-cross-case/01-comparison.md) page has the full side-by-side table.

## The delivery pack

Every lesson is organised around the same documents, in the order a real engagement produces them. Each one constrains the next.

| # | Document | Question it answers | Owner |
|---|---|---|---|
| 1 | PRD | What are we building, for whom, why, and what is deliberately left out? | Product manager |
| 2 | Technical Design | How is it built, and which component owns which decision? | Engineer |
| 3 | Delivery Plan | Who builds what, in what order, and when is each piece finished? | Engineers estimate the time; the PM cuts scope until it fits |
| 4 | Repository | The design made concrete as code | Architect; a deliverable, but not shown as a page |

The negotiation in step 3 is worth noticing. Engineers are the only people who can say how long something takes. The PM decides what the product can live without. A plan that fits the calendar comes from both doing their job, not from one side overruling the other.

The repositories stay private, so the handbook does not walk through code. Instead, every Technical Design page ends with a short section on how the current build relates to the design. Lesson 1 has no repository, so its Technical Design is followed by a [reference build on n8n](../01-education-rag/04-reference-build-n8n.md) that plays the same role.

## Reference designs, real documents

The Technical Design pages are written to one nine-part skeleton at the standard a production system should meet: principle, architecture and ownership, trust boundaries and gates, state and data, independent check, failure handling, evaluation, operations, and the current build. Reading the four in order shows exactly what each rung of the ladder adds.

The PRDs of Lessons 2 to 4 and the Delivery Plan of Lesson 4 are the projects' real documents, presented as reading guides. Lesson 1 has no project documents, so its PRD and Technical Design are teaching references written for the handbook and marked as such.

| Lesson | PRD | Technical Design | Delivery Plan |
|---|---|---|---|
| 1. Tutor / support RAG | Teaching reference | Reference design, plus a reference build on n8n | None |
| 2. Content operations | Project document | Reference design | None |
| 3. Provider research | Project document | Reference design | None |
| 4. Trading desk | Project document | Reference design, from the project's own | Project document |

## How to use this module

**If you are new ("see the map").** Read each lesson's **Case Overview**, then the [Cross-Case Comparison](../05-cross-case/01-comparison.md). That gives you the whole argument in about half an hour.

**If you are preparing for an interview ("run through everything").** Read Lesson 4 in full. It is the most complete pack and the one an interviewer will push hardest on. On every PRD page, try to state the product rules from memory before reading them, then answer the **Typical interview questions** out loud.

**If you are about to write your own documents.** Use the Lesson 4 PRD and Delivery Plan as the reference format for those documents, and any of the four Technical Design pages as the skeleton for a design.

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic). The "simplest solution first" principle behind every lesson here.
- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic)

## Related

- [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md)
- [Cross-Case Comparison](../05-cross-case/01-comparison.md)
- [Glossary](../06-glossary/01-glossary.md)
