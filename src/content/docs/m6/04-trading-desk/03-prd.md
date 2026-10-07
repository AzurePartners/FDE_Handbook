---
title: "PRD: Trading Desk"
row: M6-L4.3
rows:
  - M6-L4.1
  - M6-L4.3
  - M6-L4.4
---
**In one sentence:** The Trade Recommendation Desk PRD (FDE Internship Program, September 2026) defines what the six-agent desk must do, under eight product rules that are never broken, and how the team will know it is finished.

> **Source document:** *Trade Recommendation Desk, Product Requirements Document*, Azure Partners, Sprint 1 final version. This page is a reading guide. It is the reference PRD for this module: if you write your own, start from its structure.

## Structure of the document

| Section | What it settles |
|---|---|
| 1. Overview | A six-agent Puffo team; a weekly BUY / SELL / NO TRADE call for 10 stocks; calls from a backend strategy engine; a paper portfolio; every call scored. Internal, no money, not advice, no payments from covered companies. |
| 2. The problem | The five ways AI trading opinions fail, and the commitment to prevent them with system controls. |
| 3. Users | Portfolio manager (played by a mentor), two engineer interns, mentor reviewers. |
| 4. Product rules | Eight rules that apply everywhere. |
| 5. Scope | In and out, both explicit. |
| 6–7. Agents and flow | Six roles; two kinds of run; the eight-step path from starting view to scored call. |
| 8. Requirements | Data, strategy and backtest, recommendations, paper trading, outcome tracking, publishing checks, frontend. |
| 9. Platform facts | Puffo behaviours that shape the product. |
| 10. Success measures | Always-true properties, strategy results, agent and forward results, intern learning. |
| 11. Acceptance criteria | 25 numbered checks. |
| 12–13. Later phases, glossary | What is deferred, and every term defined. |

## The eight product rules

1. The backend owns every number. Agents refer to numbers by evidence ID and never type them.
2. Every published number links to its source, period and time.
3. Every run uses only data that existed at its cutoff time.
4. Rules create the calls. Agents may lower conviction or change a call to NO TRADE, but never raise it.
5. The rules are frozen before the holdout test, and the holdout runs only once.
6. Every result includes trading costs and a benchmark.
7. NO TRADE is a valid answer.
8. There is no real trading and no real money.

Each rule answers one failure from Section 2. Rules 1 and 2 answer unsourced numbers; rule 3 answers lookahead; rule 5 answers overfitting; rule 6 answers ignored costs and market moves; the paper portfolio and outcome tracking answer "never checked".

## Requirements worth reading closely

**Data (8.1).** The stock pool is chosen by a written rule applied before the design period, never by looking at later performance. The first reported value of every figure is used, and later restatements never replace it for earlier dates. Earnings released after the close count from the next trading day. Periods are stored with start and end dates, never as a label like "Q1".

**Recommendations (8.3).** Each call carries a conviction, horizon, reference price, invalidation level, review date, supporting and opposing evidence with sources, every agent's view, the Risk assessment in its own words, data-quality flags and disclosures. A changed call creates a new linked record; the old one never changes.

**Publishing checks (8.6).** Nine conditions block a call, from a number in agent-written text to a record that does not match its format. Each block is posted in the main channel with its reason.

**Paper trading and outcomes (8.4–8.5).** One simulated portfolio follows published calls from Week 6. Every call is scored after its review date: return against SPY, whether the invalidation level was hit, whether it was right, and for NO TRADE, what the stock did anyway.

## What to notice

**The scope list names what was cut.** Scheduled jobs, a rules-only comparison portfolio, automatic cost tracking, options, crypto, non-US stocks, transcripts and analyst estimates are all out. The rules-only comparison is an honest omission: without it, this phase cannot measure what the agents add over the rules. The PRD lists it under later phases rather than pretending.

**Platform facts appear in a product document.** Section 9 states that agents act only when a message arrives, wake on every message in their channels, get 10 tool calls per wake and share one machine and quota. These are not implementation details: they decide that a person starts the weekly cycle and that each specialist needs its own channel.

**Success is layered.** "Always true" properties are proven by tests. Strategy success has a minimum (the report shows clearly whether the strategy beat its benchmarks after costs on untuned data) and a "good" bar, and the exact bar is set before validation results are seen. The internship measures ask whether each intern can trace a number to its filing.

**Negative results are acceptable outcomes.** The minimum strategy measure is a clear answer, not a win. A desk that shows honestly that its rules did not beat the benchmark has met its requirement.

## Common misconceptions

- **"NO TRADE means the desk failed to decide."** Rule 7 makes it a valid answer, and every NO TRADE must trace to a rule, a risk check or a data condition.
- **"The acceptance criteria are a test plan."** They are the definition of done. The test plan in the Technical Design shows how each is proven.
- **"The frontend can read the agents' messages."** It reads only from the backend, so it cannot display anything the publishing checks did not approve.

## Typical interview questions

<details>
<summary>Why is the stock pool chosen by a written rule applied before the design period?</summary>

Picking stocks after seeing how they performed builds survivorship and hindsight into the result. A rule applied at an earlier date, and recorded before any backtest runs, means the pool could have been chosen at that time with the information available then.

</details>

<details>
<summary>What does "the exact bar is set before validation results are seen" protect against?</summary>

Moving the goalposts. If the success threshold is chosen after seeing results, it can be set to whatever the strategy happened to achieve. Setting it first, and having a mentor approve it at the end of Week 3, makes the result a real test.

</details>

<details>
<summary>Which acceptance criterion would you test first, and why?</summary>

Criterion 17: a corrupted value blocks publication with the reason shown. It proves the core promise, that no wrong number reaches a reader, and exercises the evidence store, assembly and publishing checks end to end.

</details>

## Related

- [Case Overview: Trading Desk](./01-case-overview.md)
- [Technical Design: Trading Desk](./04-technical-design.md)
- [PRD: Provider Research](../03-provider-research/02-prd.md), which shares the "code owns every number" rule

*Syllabus rows: M6-L4.1, M6-L4.3, M6-L4.4*
