---
title: "Technical Design: Trading Desk"
row: M6-L4.4
rows:
  - M6-L4.2
  - M6-L4.4
---
**In one sentence:** A reference design for multi-agent decision support over changing numbers: a deterministic backend that computes and stores every value, agents that interpret and dissent through role-scoped tools, point-in-time data with a cutoff per run, rules frozen before a one-time holdout, publishing checks on every call, and outcomes scored against what really happened.

> **Teaching reference.** This design follows the handbook's nine-part skeleton and is drawn from the Sprint 1 Technical Design Document of the Trade Recommendation Desk, which already meets the reference standard. Section 8 adds what a production deployment would need; section 9 summarises the current build.

## 1. Design principle

**The backend decides and the agents interpret.** Every price, signal, rule output and portfolio value is computed and stored by the backend. Agents choose what to look at and what to say, and refer to numbers only by evidence ID.

## 2. Architecture and ownership

```text
PM ⇄ main channel ⇄ Desk Lead ⇄ private channel per specialist ⇄ Technical · Volume · News · Fundamentals · Risk
                        │                                                │
                   tool adapter (per-role tools)  ◄────────────────────────┘
                        ▼
                   API (local only, one key per role)   ◄── Frontend (card + source drawer)
                        ▼
   run manager · rules engine · publishing (9 checks) · strategy + backtest · paper portfolio + outcomes
                        ▼
   evidence store + append-only ledgers   ·   immutable data snapshots   ◄── ingest (filings, prices)
```

| Component | Owns |
|---|---|
| Ingest and snapshots | Each data load written once with hashes and availability times |
| Evidence store | Every value shown or cited: source, period, availability, validation status |
| Strategy engine and backtest | The two signals, the starting view, variants, periods, costs, benchmarks |
| Rules engine | The final call and conviction from the starting view, agent signals and risk rules |
| Publishing service | Assembling calls from evidence IDs and running the nine checks |
| Run manager | Run state and what the Desk Lead posts next |
| Tool adapter and API | Role-scoped tools; one key per role; the only path into the backend |
| Agents | Reviewing, challenging and explaining, never computing |
| Frontend | The card and the source drawer, reading only from the API |

## 3. Trust boundaries and gates

- **Agents cannot type numbers into a call.** Calls are assembled from evidence IDs; a number in agent text fails publishing check 1.
- **Time is enforced by the read path.** Every read goes through a point-in-time view at the run's cutoff; evidence after the cutoff fails check 4.
- **Rules are frozen before the holdout,** and the holdout command refuses a second run or changed rules.
- **Human gates sit where they cannot be moved:** the success bar approved before validation results exist; the freeze reviewed before the holdout; a person starts each weekly cycle.
- **No order path exists,** and a repository scan fails the build if one appears.

## 4. State and data

- **Run state** moves through commissioned, collecting, assembled, published, or ends blocked or failed; the run manager stores it so no agent has to remember it, and repeated wakes change nothing.
- **First-reported values only;** restatements never replace an earlier date's value; periods are identified by their length, never by a label.
- **Append-only records** for signals, risk assessments, rule outputs, calls and publish attempts; a changed call is a new linked record.
- **Variant log and holdout ledger** make every test and the single holdout run auditable.

## 5. Independent check

- Four signal agents review the engine's starting view from different evidence; a BUY or SELL needs three not to oppose it.
- The Risk agent is isolated: its brief never contains another agent's signal, no tool returns one to it, and its first assessment is stored with a hash.
- Risk rules and agent objections can only lower a call, never raise it.
- The Risk agent is itself evaluated on planted counter-evidence and clean cases, so its catch rate and false-alarm rate are known.

## 6. Failure handling and idempotency

| Failure | Behaviour |
|---|---|
| A specialist misses its deadline | Counts as opposing the call |
| The Risk agent misses its deadline | The run fails |
| A number in agent text | Sent back once; a second failure fails the run |
| Any other publishing check fails | The run fails with the reason posted |
| A new question during an active run | Refused, with the active run's status |
| A stale or repeated wake | Idempotent tools and stored state mean nothing changes |

## 7. Evaluation and testing

- Unit tests for signal maths, period handling, the reaction-day rule, the rules engine, each publishing check, costs and scoring.
- A golden dataset with known answers, including a restatement, a split, an after-close release and a stock that must never enter.
- A simulator that plays all six agents through the real API with no quota use.
- Ten guard tests that attack the product rules on purpose.
- Backtest with design, validation and one-time holdout periods; forward paper trading; every call scored after its review date.

## 8. Operations

The Sprint 1 design runs on one machine with a person starting each cycle. A production deployment adds:

- **Scheduling** for the weekly cycle, with the same "nothing runs on a stale snapshot" guarantee.
- **A rules-only baseline portfolio,** so the agents' contribution over the rules is measured rather than assumed.
- **Secrets and roles** managed outside the repository; per-role keys rotated; the API behind authentication if it ever leaves the machine.
- **Monitoring:** overdue agents, blocked runs, snapshot freshness, quota use, and a manifest of model and prompt versions per run so results can be attributed.
- **Backups** of the evidence store and snapshots, restorable to any run.

## 9. The current build

The Sprint 1 build implements sections 1 to 7 as described: the six-agent roster with per-role tools, the evidence store and point-in-time snapshots, the strategy engine with its 18 logged variants, the rules engine and nine publishing checks, the run manager, the simulator and guard tests, and the weekly cycle with paper trading and outcome scoring. Section 8 lists what it deliberately leaves to later phases.

## Typical interview questions

<details>
<summary>How does the design stop an agent from citing a number that did not exist at the cutoff?</summary>

Agents only receive values through tools that read the point-in-time view at the run's cutoff, every value carries an availability time, and the publishing check blocks any evidence after the cutoff. A guard test adds post-cutoff rows and requires the results not to change.

</details>

<details>
<summary>Why does one run cost the same number of agent wake-ups whether it covers one stock or ten?</summary>

Each specialist's input tool returns every stock in the run at once and each specialist submits once, so the count depends on the number of roles and hand-offs, not on the number of stocks. That keeps usage predictable under a shared quota.

</details>

## Related

- [PRD: Trading Desk](./03-prd.md)
- [Delivery Plan: Trading Desk](./05-delivery-plan.md)
- [Adding Complexity Layer by Layer](./02-progressive-build.md)

*Syllabus rows: M6-L4.2, M6-L4.4*
