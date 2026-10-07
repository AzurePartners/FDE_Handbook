---
title: Trajectory Evaluation
row: M3-L6.5
---
**In one sentence:** Trajectory evaluation grades the steps an agent took in a run (tools called, arguments, order, handoffs), not just where it ended, so lucky passes and rule breaks along the way get caught.

## What it is

An agent reaches a result through steps: lookups, tool calls, handoffs, record changes. The ordered steps of one run form its **trajectory**. [Agent evaluation](./01-agent-evaluation.md) grades where a run ended; trajectory evaluation grades the path.

A math teacher who asks you to show your work does the same: a right answer from a wrong method loses marks, while a different valid method earns full marks.

Precisely, it is read from the run's [trace](./02-agent-traces.md) and graded against a reference path, by policy rules in code, or by rubric items.

## Why an FDE needs this

A property manager's maintenance agent checked leases and booked contractors, and its outcome eval passed 45 of 50 tasks. Yet in 9 passes it skipped `get_lease` and assumed the landlord pays, true of every test lease by chance. In 3 it booked jobs over $500 before the manager approved, an order the end state cannot show. A first fix, exact matching against one recorded path, failed a third of good runs, so people ignored it.

The FDE kept the outcome check, gated large bookings in code and added three path checks: lease before booking, approval before large bookings, no tool outside the agent's list. (Illustrative scenario.)

## Key concepts

### Matching a reference path

A reference (golden) path lists the expected steps; tools compare runs with it three ways:

| Mode | Passes when | Example |
|---|---|---|
| Exact | Same calls, arguments and order, nothing extra | A regulated script |
| In order | Listed calls in that order, extras allowed | `get_lease` before `book_contractor` |
| Any order | Every listed call, extras allowed | Independent lookups |

Google's ADK, Microsoft Foundry and LangChain's AgentEvals ship such modes. Handoffs count as steps; match arguments only where they matter, like an account ID.

### When a strict match is too rigid

Most tasks have several correct paths. The τ-bench customer-service benchmark stores one reference path per task, "not the only correct one", and scores airline and retail tasks (τ²-bench adds telecom) on final database state and required replies. Keep exact matching for flows where order is the requirement, or as an alarm on known-good paths.

### Step-level policy checks

Some rules govern the path itself, drawn from the agent's [prohibited actions](../13-agent-profiles/04-responsibilities-and-prohibited-actions.md): no write before approval, no tool outside its role or on a forbidden list.

```python
def policy_violations(steps, allowed, needs_approval):
    problems, approved = [], set()
    for s in steps:
        if s["type"] == "approval" and s["decision"] == "approve":
            approved.add(s["call_id"])
        elif s["type"] == "tool":  # an executed call
            if s["tool"] not in allowed:
                problems.append(f"{s['id']}: outside role")
            if needs_approval(s) and s["id"] not in approved:
                problems.append(f"{s['id']}: before approval")
    return problems  # any entry fails the run
```

An eval check measures; an [action gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md) prevents: keep both.

### Judging trajectories with rubrics

Some qualities need judgment, like whether a handoff carried what the next agent needed. Write yes or no rubric items for people or an [LLM judge](../../m2/11-ai-evaluation/07-llm-as-judge.md), with or without a reference path. Calibrate first: in AgentRewardBench (2025), none of 12 LLM judges did best on every benchmark of expert-reviewed web-agent trajectories.

### Combining path and outcome

Grade the outcome first; any policy violation fails the run. Match scores and rubric results are diagnostics for [agent-level metrics](./04-agent-level-metrics.md). An outcome pass with a path failure is lucky or unsafe; an outcome failure with a clean path often points to data, tools or the grader; if both fail, find the first wrong step ([failure attribution](./03-failure-attribution.md)).

## Common misconceptions

- **"If the outcome passes, the steps don't matter."** The run may be right by luck or have broken a rule the end state never records.
- **"An exact match with a golden path is the most rigorous test."** It fails valid runs on other routes, so people learn to ignore it.
- **"Evals show the agent stays in its role, so we can skip the gate."** Evals sample cases; production brings new inputs and injected instructions.

## Typical interview questions

<details>
<summary>What is trajectory evaluation, and what does it catch?</summary>

Grading a run's steps, not just its end state. It catches lucky passes, like a skipped lookup that happened to be right, and hidden rule breaks, like writing before approval.

</details>

<details>
<summary>What is the difference between exact, in-order and any-order matching?</summary>

Exact needs the same calls, arguments and order, nothing extra. In-order needs the listed calls in sequence, extras allowed; any-order needs them all, in any order. I use in-order for real dependencies.

</details>

<details>
<summary>Which trajectory checks would you write for a refund agent?</summary>

Identity verified and policy fetched before `issue_refund`, no refund over the limit without prior approval, no tool outside its list, and a judge item: does the amount quoted match the tool result?

</details>

<details>
<summary>After a model upgrade, path checks fail but outcomes hold. What now?</summary>

I read failing traces. Valid new paths, like batched lookups, mean the checks are too strict: keep only required steps and real dependencies. Skipped verification is a real regression.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic, about 30 min)
- Reference: [How to evaluate your agent with trajectory evaluations](https://docs.langchain.com/langsmith/trajectory-evals) (LangChain docs, about 15 min)
- Reference: [Evaluation Criteria](https://adk.dev/evaluate/criteria/) (Google ADK docs, about 20 min)

## Related

- [Agent Evaluation (Tasks, Environments, Outcomes)](./01-agent-evaluation.md)
- [LLM-as-Judge](../../m2/11-ai-evaluation/07-llm-as-judge.md)
- [Agent Traces (Steps, Tool Calls, Handoffs, State Changes)](./02-agent-traces.md)
- [Agent-Level Metrics (Task Completion, Handoffs, Tool Use, Loops, Cost, Latency)](./04-agent-level-metrics.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
