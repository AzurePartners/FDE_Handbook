---
title: Adding Complexity Layer by Layer
row: M6-L4.2
---
**In one sentence:** Start from a single prompt that asks "should I buy this stock?", add only what each failure forces, and you arrive layer by layer at the Sprint 1 desk design, where every layer exists to remove one specific way the answer could be wrong.

## How to read this page

The syllabus describes a progression for complex agent systems: prompt only, then skills, data tools, a freshness gate, challenge and debate, memory and a workspace, and finally evaluation. This page walks that progression as a design exercise against the Sprint 1 Trade Recommendation Desk. For each layer it names the failure that makes the layer necessary, and the component in the current design that provides it.

The PRD lists the failures up front. AI buy-and-sell opinions tend to have numbers with no source or from the wrong period, backtests that use information that did not exist at the time, rules tuned on past data until they look good, results that ignore costs or the market's own move, and calls that are never checked against what happened next. Each layer below closes one or more of these.

## Layer 0: a prompt

Ask a capable model for a view on a stock and you get a fluent answer. It may be right. Nobody can tell, because its numbers come from memory, its time frame is unclear, and nothing records whether the call worked. Every failure in the PRD's list is still open. This is the baseline the rest of the design argues against.

## The layers

| Layer | What it adds in the Sprint 1 design | Failure it removes | Where to read more |
|---|---|---|---|
| 1. Roles and instructions | Six agents, each with one job and its own instruction file in `agents/<role>.md`. The Desk Lead is the only voice in the main channel; each specialist has a private channel with it. | One voice mixing every lens, with nobody accountable for any part | [Case Overview](./01-case-overview.md) |
| 2. Data tools | `desk-mcp` gives each agent only its role's tools; `desk-api` is the only way into the backend, with one key per role. Every number a tool returns carries an evidence ID. | Numbers recalled from memory or fetched ad hoc | [Technical Design](./04-technical-design.md) |
| 3. Numbers owned by the backend | The evidence store records every value's source, period and times. Calls are assembled from evidence IDs, and publishing check PUB-001 blocks any number typed in agent text. | An agent restating a real number wrongly | [Technical Design](./04-technical-design.md) |
| 4. Time gate | Immutable snapshots read through a point-in-time view; a cutoff per run; first-reported values only; after-close earnings counted from the next trading day; PUB-004 blocks evidence after the cutoff. | Lookahead, and restated figures leaking into the past | [Technical Design](./04-technical-design.md) |
| 5. Challenge | Four signal agents review the engine's starting view, and a BUY or SELL needs three of them not to oppose it. An isolated Risk agent argues the other side without seeing their conclusions, and its first text is stored with a hash. Risk rules can only lower a call. | A one-sided call, or dissent that simply echoes the others | [PRD](./03-prd.md) |
| 6. State outside the agents | The run manager stores each run's state and tells the Desk Lead what to post next. Signals, assessments, calls and publish attempts are append-only; a changed call is a new linked record. | Agents losing track across Puffo wakes, or history being rewritten | [Technical Design](./04-technical-design.md) |
| 7. Evaluation | Design, validation and a one-time holdout on frozen rules; every variant logged; costs and two benchmarks in every result; forward paper trading; every call scored after its review date; the Risk agent tested on planted and clean cases; ten guard tests. | Overfitting, and calls that are never checked | [PRD](./03-prd.md), [Technical Design](./04-technical-design.md) |

## What each layer costs

Complexity is not free, and the design is explicit about the price:

- **Roles** cost wake-ups and quota. The design keeps one run at 11 agent wake-ups however many stocks it covers, because each role's tool returns every stock in one call.
- **Tools** cost tool calls. [Puffo](https://chat.puffo.ai) allows 10 per wake, so every role is designed to finish in 8 or fewer.
- **Backend ownership** costs engineering time. The filings client, run manager and publishing service are the three largest tasks in the Delivery Plan, at four days each.
- **Evaluation** costs calendar time. The success bar must be approved before validation results exist, and the rules frozen before the holdout, which fixes the order of the milestones.

## What was not added

Just as important are the layers the problem did not justify for Sprint 1. The PRD leaves out scheduled jobs, options and other asset classes, transcripts and analyst estimates, and a rules-only comparison portfolio. Each could be added later. None was needed to make the published calls sourced, point-in-time and scored, which is what Sprint 1 set out to prove.

## The build order is not the layer order

The layers above go from the model outward. The Delivery Plan builds in almost the opposite direction. Apart from a Week 1 check that Puffo can run two agents and call a test tool, data, snapshots, the evidence store and the backend API come first (Weeks 1 to 3), the agents and tool adapter are brought up on top of them (Weeks 3 and 4), the rules engine and publishing service follow (Week 5), and evaluation runs last (the holdout in Week 6, forward cycles in Weeks 6 to 8). The agents are the visible part of the product, but they can only be trusted once the parts that own the numbers exist.

## Common misconceptions

- **"The agents are the complex part."** Most of the engineering sits beneath them: data, evidence, rules, publishing and tests. The agents' job is deliberately narrow.
- **"Each layer makes the answer smarter."** Most layers make the answer more checkable, not smarter. Layers 3, 4 and 7 add no new insight at all; they remove ways to be wrong.
- **"Add every layer from the start."** Each layer here is justified by a named failure. A problem without that failure does not need that layer, which is why Lessons 1 to 3 stop earlier.

## Typical interview questions

<details>
<summary>A client's prototype is a single prompt that gives stock views. What do you add first, and why?</summary>

Ask which failure hurts most. Usually it is unsourced numbers, so the first step is data tools that return values with an identifier, and a rule that published numbers come from the store rather than the model's text. Next comes the time gate, because a backtest with lookahead makes every later result meaningless.

</details>

<details>
<summary>Why does the plan build the backend before the agents?</summary>

Because the agents' output is only trustworthy if the numbers, the time rules and the publishing checks already exist. Building agents first produces a convincing demo on top of nothing that can be verified, and the backend then has to be retrofitted around their behaviour.

</details>

<details>
<summary>Which layers would you drop for a desk that only summarises daily news and makes no calls?</summary>

The rules engine, backtest, holdout and paper portfolio exist to create and score calls, so they would go. The time gate would stay in a lighter form, since summaries should still only use news published before the run. Source links would stay. Whether a Risk agent is needed depends on whether one-sided summaries are a real problem for the reader.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic), on adding complexity step by step
- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic)

## Related

- [Case Overview: Trading Desk](./01-case-overview.md)
- [PRD: Trading Desk](./03-prd.md)
- [Delivery Plan: Trading Desk](./05-delivery-plan.md)

*Syllabus row: M6-L4.2*
