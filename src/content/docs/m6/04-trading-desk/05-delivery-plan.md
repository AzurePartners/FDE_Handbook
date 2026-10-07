---
title: "Delivery Plan: Trading Desk"
row: M6-L4.2
---
**In one sentence:** The Trade Recommendation Desk Delivery Plan fits the build into eight weeks for two engineers by breaking it into 35 tasks with checkable finish conditions, estimating 71 days of work against 80 available, and fixing the milestones that must happen in order.

> **Source document:** *Trade Recommendation Desk, Delivery Plan*, Azure Partners, Sprint 1 final version. This page is a reading guide. It is the reference delivery plan for this module.

## The shape of the plan

| Element | What the plan says |
|---|---|
| Capacity | Two engineers, eight weeks, 40 hours a week: 80 working days |
| Work | 35 tasks in eight areas, estimated at 71 days |
| Slack | 9 days, a little over 10 percent |
| Largest tasks | Filings client (B1), run manager (D4) and publishing service (D6), four days each; every other task three days or fewer |
| Definition of done | A task is finished when its "finished when" column is true, not when the code is written |

## Eight areas

| Area | Days | Engineer A | Engineer B |
|---|---|---|---|
| A. Setup | 5 | 1 | 4 |
| B. Data | 11 | 9 | 2 |
| C. Strategy and backtest | 14 | 14 | 0 |
| D. Agents and run pipeline | 18 | 0 | 18 |
| E. Forward trading and tracking | 5 | 5 | 0 |
| F. Frontend | 5 | 0 | 5 |
| G. Testing | 9 | 4.5 | 4.5 |
| H. Wrap-up | 4 | 2.5 | 1.5 |
| **Total** | **71** | **36** | **35** |

Engineer A owns data, strategy and forward trading. Engineer B owns agents, the backend API and the frontend, and the machine that runs [Puffo](https://chat.puffo.ai). Testing and wrap-up are shared, and Week 1 is worked together.

## "Finished when" conditions

The task table's last column is the plan's most useful habit. Compare two ways of writing the same task:

| Weak | As written in the plan |
|---|---|
| Build the holdout lock | No result exists without a log row, and the holdout refuses a second run |
| Set up Puffo | The daemon runs, two agents exchange messages, and one agent calls a test tool |
| Run manager | Runs move through their states, the Desk Lead is told what to post next, and a repeated wake changes nothing |

Each condition is something another person can check without asking the owner.

## Milestones, in order

| When | Milestone | Why it sits here |
|---|---|---|
| End of Week 1 | Puffo runs two agents; vendor, stocks, dates and costs recorded | The riskiest unknowns (platform, data licence, pool rule) are settled first |
| End of Week 3 | A mentor approves the success thresholds | Before any validation result exists, so the bar cannot move |
| End of Week 5 | A mentor checks the rule freeze; rules are tagged | Before the holdout, so it runs on frozen rules |
| Week 6 | The holdout runs once; forward paper trading starts | Only after the freeze |
| Weeks 6–8 | Three weekly cycles | Forward evidence on unseen data |
| Week 8 | Results report, demo and handoff | |

The order is not a convenience. Moving the threshold approval after validation, or the holdout before the freeze, would break product rule 5.

## Working rules

- **One machine.** Only Engineer B's machine runs Puffo. Engineer A uses the simulator and sample data.
- **Live slots.** Two one-hour slots a day are booked for live agent runs, because all six agents share one account and one quota.
- **Weekly cycle.** Every Monday from Week 6, Engineer A runs `desk week` before the US market opens; the PM starts the review; calls are published before the close.
- **Review each other.** By Week 8, no area has only one person who understands it.

## Where the PM cut time

The engineers' estimates are only half of a plan; the other half is what the PM removes so the estimates fit. This plan does not list its cuts itself, but the PRD's out-of-scope and later-phase lists show where scope was drawn: scheduled jobs, the rules-only comparison portfolio, automatic usage tracking, options and other asset classes, transcripts and analyst estimates. When you write a delivery plan, record the cuts in the plan too, so nobody assumes they are coming.

## Common misconceptions

- **"Slack is wasted time."** Nine days of slack on 71 of work is what absorbs the four-day tasks running long. A plan with none has already slipped.
- **"Parallel owners mean parallel risk."** The split keeps each engineer on one side of the evidence-ID boundary (data and strategy versus agents and publishing), so they meet at a defined interface.

## Typical interview questions

<details>
<summary>The client wants to add options analysis in Week 4. What does this plan let you say?</summary>

That the plan has 9 days of slack, the options work would need data, tools, a specialist and tests, and none of it is in the validated rules. Adding it now risks the Week 5 freeze and the Week 6 holdout, which are fixed by the product rules. Offer it as a later phase, or ask which existing task the client would drop to make room.

</details>

<details>
<summary>Why is the success threshold approved in Week 3 rather than at the end?</summary>

Because it must be set before validation results are seen. If it were set after, it could be chosen to match whatever the strategy achieved, and the result would prove nothing.

</details>

## Related

- [Technical Design: Trading Desk](./04-technical-design.md)
- [PRD: Trading Desk](./03-prd.md)

*Syllabus row: M6-L4.2*
