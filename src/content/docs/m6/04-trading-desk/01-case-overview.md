---
title: "Case Overview: Trading Desk"
row: M6-L4.1
rows:
  - M6-L4.1
  - M6-L4.3
  - M6-L4.4
---
**In one sentence:** The Trade Recommendation Desk is a team of six AI agents in a [Puffo](https://chat.puffo.ai) space that reviews a fixed pool of 10 US stocks each week, where a backend strategy engine creates every call from two market signals and the agents review, challenge and explain it, with no real money anywhere.

## The business scenario

A portfolio manager wants research help: a weekly view on a set of stocks, and answers to questions about any one of them at any time. AI tools can produce buy and sell opinions quickly. The problem is that nobody can check them. The PRD lists the usual failures:

- numbers with no source, or from the wrong period;
- backtests that use information that did not exist at the time;
- rules tuned on past data until they look good, which then fail on new data;
- results that ignore trading costs or the market's own move;
- calls that are never checked against what happened next.

The desk's answer is that **these failures are prevented by system controls, not by prompt instructions.**

This is an internal Azure Partners internship project. It uses no real money, places no real orders and has no external users. Every call is hypothetical and is not investment advice.

## Why this is the most complex archetype

Every earlier case had one hard property. This one has all of them at once:

| Property | Why it is hard here |
|---|---|
| Numbers | Every call rests on prices and reported figures. An agent that types a number can mistype or invent it. |
| Time | A figure that is correct today may not have existed on the date of the decision. Using it is lookahead bias. |
| Overfitting | With enough rule variants, one will look good on past data by chance. |
| Dissent | A useful desk needs a voice that argues against the call without being led by the others. |
| Evaluation | The output is a prediction, so it can and must be scored against what actually happened. |

## The team

| Agent | Job |
|---|---|
| Desk Lead | The only agent in the main channel. Starts each run, sends work to the specialists, posts the results. |
| Technical | Reviews the trend and price evidence. |
| Volume | Checks whether trading volume supports the price move. |
| News | Reviews news and filings published before the cutoff. |
| Fundamentals | Reviews reported results, the earnings surprise and company guidance. |
| Risk | Argues the other side, without seeing the other agents' conclusions first. |

Each specialist shares a private channel with the Desk Lead and no one else.

## How a call is made

1. The strategy engine gives each stock a starting view: BUY, SELL or NO TRADE.
2. The Desk Lead sends the work to the five specialists.
3. The four signal agents each return a view with evidence.
4. The Risk agent returns its own assessment.
5. The rules engine combines everything into the final call and conviction.
6. The publishing service checks the call and publishes it or blocks it with a reason.
7. The paper portfolio takes the new calls at the next market close.
8. Each call is scored after its review date.

**Agents can lower conviction or turn a call into NO TRADE. They can never raise it.** The rules create calls; the agents interpret and challenge them.

## The syllabus focus, mapped to the design

| Syllabus focus | Where it lives in the design |
|---|---|
| Point-in-time data | Immutable snapshots read through a view that returns only rows available at the run's cutoff |
| Source evidence | Every value has an evidence ID linking it to its filing or vendor record, period and time |
| Dissent | An isolated Risk agent whose first assessment is stored with a hash and cannot be edited |
| Confidence | A conviction table driven by engine strength and agent support, lowered by risk rules |
| Data freshness | Each run has a cutoff; publishing blocks any evidence from after it |
| Tool cost | At most 10 tool calls per agent wake; one run costs 11 agent wake-ups |
| Memory | Run state stored by the backend's run manager, so no agent has to remember it |
| Traceable conclusions | A frontend source drawer that opens the origin of any published number |

## Research, not trading

The syllabus asks for a clear line between decision support and automated trading. The desk draws it in code: no brokerage connection, no order path, and a repository scan that fails the build if order code appears. Filings come from SEC EDGAR, which is free and public; daily prices come from one licensed vendor.

## Common misconceptions

- **"The agents decide what to buy."** The strategy engine creates the starting view and the rules engine sets the final call. Agents can only make it more cautious.
- **"More agents means better calls."** The four signal agents exist to challenge the engine from different angles, and a BUY or SELL needs at least three of them not to oppose it. The count serves a rule.
- **"A good backtest proves the strategy."** Only the holdout, run once on frozen rules, and the forward paper trading give evidence on data the rules were not tuned on.

## Typical interview questions

<details>
<summary>Why can agents lower a call but never raise it?</summary>

Raising a call means acting on something the tested rules did not produce, which reintroduces untested judgement into the part of the system that was validated. Lowering is always safe: the worst case is a missed opportunity, not an unvalidated position. The asymmetry lets agents add caution without undermining the backtest.

</details>

<details>
<summary>What is the difference between this desk and an automated trading system?</summary>

The desk publishes research calls and follows them in a simulated portfolio. There is no brokerage connection or order path in the code, and a repository scan fails the build if one appears. Live trading is described in the PRD as a separate, regulated project.

</details>

## Learn more

- Paper: [TradingAgents: Multi-Agents LLM Financial Trading Framework](https://arxiv.org/abs/2412.20138) (arXiv, about 45 min)
- Code: [TradingAgents](https://github.com/TauricResearch/TradingAgents) (TauricResearch, research only)
- Docs: [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) (SEC)
- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic)

## Related

- [Adding Complexity Layer by Layer](./02-progressive-build.md)
- [PRD: Trading Desk](./03-prd.md)
- [Case Overview: Provider Research](../03-provider-research/01-case-overview.md), the rung below

*Syllabus rows: M6-L4.1, M6-L4.3, M6-L4.4*
