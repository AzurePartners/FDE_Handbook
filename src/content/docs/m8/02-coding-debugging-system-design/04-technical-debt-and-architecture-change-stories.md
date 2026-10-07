---
title: Technical Debt and Architecture Change Stories
row: M8-L2.4
---
**In one sentence:** Every candidate should be able to explain one real technical-debt item and one real architecture change from their own project — what it was, why it was accepted or made, what it cost, and what it taught — because these two stories prove the project was real and that you were the one making decisions.

## What it is

A technical-debt story describes a shortcut you knowingly took (or inherited) and its consequences: the hardcoded mapping that broke when the customer added a region, the single-threaded ingestion that was fine for the pilot, the eval set that only covered English tickets. An architecture-change story describes a decision you reversed or upgraded after evidence: moving retrieval from pure vector search to hybrid after error analysis, splitting one agent into a workflow after traces showed it looping, adding an approval gate after a near-miss. Both should exist as ADRs or changelog entries in your capstone.

## Why an FDE needs this

Hiring managers and technical interviewers use these two questions to detect whether a project was yours and whether it met reality. Projects that never hit debt or never changed shape either did not run on real inputs or were not owned by the person telling the story. An FDE also has to explain debt to customers constantly ("this works for your current volume; here is when it will not"), so the ability to describe a shortcut without defensiveness is part of the job.

## Key concepts

### The debt story structure

1. What the shortcut was, in one sentence.
2. Why it was the right call at the time (appetite, risk, what you did not yet know).
3. What it cost later, concretely.
4. What you did about it, or what you would do and when.

### The architecture-change story structure

1. The original decision and its reasoning (ideally, the ADR).
2. The evidence that changed your mind (an eval number, a trace, a pilot failure, a customer constraint).
3. The new decision and what it traded away.
4. How you migrated without breaking the pilot.

### Make it an ADR

An Architecture Decision Record captures context, decision, and consequences at the time. A project with three ADRs and a changelog has interview stories written in advance. Write them during the project, not before the interview; the dates matter.

### Tone

Neither confessional nor defensive. Debt is a normal outcome of choosing an appetite; the skill is knowing what you accepted and when it comes due.

## Common misconceptions

- **"I should hide the debt."** Interviewers assume every real project has debt. A candidate with no debt story is assumed to have no real project.
- **"An architecture change means the first design was wrong."** It means the first design met evidence. The change is the proof of an eval loop working.
- **"Rewriting from scratch counts as an architecture change."** It counts as a warning sign unless you can name the evidence that justified it and what you kept.

## Typical interview questions

<details>
<summary>Tell me about a piece of technical debt in your project.</summary>

"The provider-matching step used a hand-written rule set for name normalization. It was right for the pilot: two states, 9,000 rows, and a person reviewing every merge. When the customer added five states, false merges rose from under 1% to about 4%. I replaced the rules with a probabilistic matcher and kept the human review for low-confidence pairs; the rule set is still there behind a feature flag for the original two states until the eval on the new matcher covers them."

</details>

<details>
<summary>What architecture decision did you change, and why?</summary>

Give the original decision, the evidence, the new decision, and the trade-off. "Pure vector retrieval missed policy questions that depend on exact clause numbers. Error analysis on 30 failures showed 19 were keyword misses. Moving to hybrid search with reciprocal-rank fusion took groundedness from 78% to 91% on the eval set; the cost is a second index to keep fresh."

</details>

<details>
<summary>What debt is still in the system today?</summary>

Name one, its trigger, and its plan. "Ingestion is single-process; it takes 40 minutes nightly. It becomes a problem at roughly five times the current document count. The plan is a queue with workers, and the trigger is the ingestion window exceeding two hours."

</details>

## Learn more

- Reference: [Architecture Decision Records](https://adr.github.io/) — templates for context, decision, consequences
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic) — the evidence that should drive an architecture change
- Article: [A postmortem of three recent issues](https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues) (Anthropic) — a public example of explaining what broke without defensiveness
- Chapter: [Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/) (Google SRE)

## Related

- [End-to-End AI System Design](./02-end-to-end-ai-system-design.md)
- [Case Study Structure](../01-portfolio-case-study-resume/01-case-study-structure.md)
- [STAR and Project Deep Dives](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
