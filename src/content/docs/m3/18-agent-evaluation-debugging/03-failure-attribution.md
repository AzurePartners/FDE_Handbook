---
title: Failure Attribution in Agent Systems
row: M3-L6.3
---
**In one sentence:** Failure attribution means finding the first step where an agent run went wrong and naming which part caused it: data, instructions, the model, a tool, a handoff, a business rule, a permission or a limit.

## What it is

An agent failure shows up at the end, in a wrong memo or bad approval, but usually starts earlier. A relay team that loses to a dropped baton on the second leg gains nothing from coaching its last runner.

Precisely: each step of a run builds on the last. Attribution names the decisive step, the earliest whose correction would have saved the run, and the component behind it. [Error analysis](../../m2/11-ai-evaluation/03-error-analysis.md) groups many failures into types; attribution works inside one run's [trace](./02-agent-traces.md).

## Why an FDE needs this

A wealth manager's Finance research agent, which remembers clients' confirmed constraints, recommended excluded stocks in 14 memos in a month. The team called it one bug and rewrote the profile three times ("ALWAYS apply client constraints"), to no effect.

The FDE attributed each memo from its trace. In 8, the constraint lookup's service account could not read a new table (permission). In 4, the run hit its 30-step limit before the constraint check (budget). In only 2 was the constraint in context and ignored (model). She took the access gap to the client's IT team, had runs that hit the limit return "partial" and logged every cause. (Illustrative scenario.)

## Key concepts

### Eight causes and their evidence

| Cause | Evidence in the trace |
|---|---|
| Data | A tool result contradicts the source, or is stale |
| Prompt or profile | The step literally follows a vague or conflicting instruction |
| Model | Correct inputs and clear instructions, wrong choice anyway |
| Tool | An error or malformed result despite valid arguments |
| Handoff | The receiver's input lacks or distorts the sender's output |
| Business rule | Code applied the rule as written; the rule is wrong |
| Permission | A 401 or 403, a gate denial, or data missing for some users |
| Timeout or budget | A timeout or step limit hit; partial work marked done |

### Where it surfaced vs where it started

Walk the trace forward. The first step with right inputs and a wrong output is where the failure started; later steps only carried it. Confirm by replaying from there with the corrected value ([Replayable Tests](./06-replayable-tests.md)).

```text
trace 7d21f0  memo, client K-88
step 2  tool   get_constraints  http 403, returned []   <- started
step 5  model  adds a tobacco stock  (right, given no constraints)
step 9  send   memo delivered                          <- surfaced
```

Step 5 looks like the model ignoring a rule, but its inputs held none. The cause is permission, and the tool returning `[]` instead of an [error](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md) contributed. Record both.

### What research says about automating it

MAST (Cemri et al., UC Berkeley, 2025), a useful checklist, sorts 14 failure modes from multi-agent traces into three groups: system design and specification, misalignment between agents (like withholding information) and task verification (like ending too early).

Automating attribution is harder: on the Who&When benchmark (ICML 2025), the best results were 53.5% for the responsible agent and 14.2% for the decisive step. Let a model shortlist suspects; a person confirms.

### Recording the attribution

Add it to the failure case record: trace ID, where it surfaced, decisive step and agent, cause, contributing causes, evidence, replay result, prompt and model versions, and fix owner. Fixes follow the [debugging loop](./07-debugging-agents.md).

## Common misconceptions

- **"Failures with the same symptom share a cause."** When Anthropic's research agents were "not finding obvious information," the cause could be bad queries, poor sources or tool failures.
- **"The first error in the trace is the cause."** Decisive errors are often silent, like a stale record; a later timeout may be just a symptom. Check each step's inputs, not its status.
- **"An LLM can read the trace and name the culprit."** On Who&When, the best step-level accuracy was 14.2%. Treat its answer as a lead.

## Typical interview questions

<details>
<summary>What is failure attribution in an agent system?</summary>

Finding the decisive step in one failed run and naming the component behind it. Error analysis groups many failures into types; attribution gives each case a confirmed cause.

</details>

<details>
<summary>What is the difference between where a failure surfaces and where it starts?</summary>

It surfaces where someone notices, like a client reading a bad memo. It starts at the earliest step with correct inputs and wrong output, confirmed by replay.

</details>

<details>
<summary>A Research, Draft and Review flow published a wrong figure. How do you attribute it?</summary>

Compare Research's tool result with the source (data), its output with Draft's input (handoff), and Draft's context with its text (model). Review's pass is where it surfaced, a contributing cause at most.

</details>

<details>
<summary>Engineers blame the model; you suspect the tool. How do you settle it?</summary>

Replay the step several times with a correct tool result: if the run succeeds, the tool or its data caused it; if the model still errs, the model did.

</details>

## Learn more

- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic, about 20 min)
- Article: [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657) (Cemri et al., about 40 min)
- Article: [Which Agent Causes Task Failures and When?](https://arxiv.org/abs/2505.00212) (Zhang et al., ICML 2025, about 40 min)

## Related

- [Error Analysis and Failure Case Documentation](../../m2/11-ai-evaluation/03-error-analysis.md)
- [Agent Traces (Steps, Tool Calls, Handoffs, State Changes)](./02-agent-traces.md)
- [Debugging Agents with Traces and Evals](./07-debugging-agents.md)
- [Multi-Agent Systems](../15-agent-architectures/04-multi-agent-systems.md)
- [Reproduce, Narrow, Minimize](../../m1/04-git-debugging-testing-security/06-reproduce-narrow-minimize.md)
