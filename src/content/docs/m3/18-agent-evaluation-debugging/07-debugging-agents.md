---
title: Debugging Agents with Traces and Evals
row: M3-L6.7
---
**In one sentence:** Debugging an agent means reproducing a failure, finding the first wrong step in its trace, fixing the cause in its own layer (often not the prompt), and proving the fix with a new test and an eval run.

## What it is

When an agent fails, the tempting fix is another prompt line. Debugging with traces (step-by-step records of each run) and evals (automated tests over many tasks) replaces that guess with evidence.

A restaurant manager whose dish arrives cold does not reword the menu; they walk the line to the station where it cooled.

An agent's behavior comes from several layers, and the prompt is only one. The [trace](./02-agent-traces.md) shows which went wrong first; evals show whether a fix helped without breaking other cases.

## Why an FDE needs this

A software company's Content Operations agents (Research, Plan, Draft, Review) kept publishing last year's prices. For weeks the team patched Draft's prompt: "NEVER guess prices," "ALWAYS verify prices," a pasted price table. Each patch fixed one example; then Draft stopped quoting prices.

The FDE reran 12 failing tasks five times each, reading every trace. The first wrong step came before Draft: Research's `search_docs` returned an archived pricing page, which Review had no rule to catch. The FDE removed archived pages from the index, added code checking quoted prices against the pricing API, saved three runs as [replayable tests](./06-replayable-tests.md) and reverted Draft's prompt. Evals showed no pricing errors or new failures. (Illustrative scenario.)

## Key concepts

### The loop

```text
1 Reproduce  rerun the same input several times
2 Locate     find the first step whose input, output, tool call,
             handoff or state change is wrong
3 Attribute  name the layer that caused it
4 Fix        change one thing, in that layer
5 Test       turn the failing run into a replayable test
6 Re-run     the eval suite against the baseline
```

Agents are "non-deterministic between runs, even with identical prompts" (Anthropic), so measure a failure rate. LangGraph's time travel can rerun from a saved checkpoint, optionally with edited state, to test a fix at the failing step.

### Fixes by layer

Once [failure attribution](./03-failure-attribution.md) names the layer:

| Cause in | Fix it there | Prompt patch it replaces |
|---|---|---|
| Data | Source, index or filter | "Ignore old pages" |
| Tool description or schema | Name, description, constrained arguments | "Use the right tool" |
| Profile or skill instruction | That instruction, versioned | None: the prompt is the fix |
| Business rule | Enforce it in [code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md) | "Double-check the math" |
| Permission | The grant or action gate | "Never open payroll files" |
| Timeout or budget | Limits sized from successful runs | "Work faster" |
| Agent boundary | Handoff contract; merge or split agents | "Read the brief carefully" |

### Why prompt patches move failures around

One prompt serves every case, so a line added for one failure shifts others ([prompt brittleness](../../m2/08-prompting-context-structured-output/07-prompt-brittleness.md)). Patches pile up into clashing ALWAYS and NEVER rules, and no wording repairs a stale record, missing permission or short timeout: the model only works around it. Building a SWE-bench agent, Anthropic spent more time optimizing its tools than its prompt. Edit the prompt when the model had the right information and tools yet chose wrongly.

### When to stop debugging and redesign

Redesign when a failure type survives fixes at the right layer, each fix breaks another case, or traces show a structural cause (an overfull context, overlapping tools, lossy handoffs). OpenAI's agent guide suggests splitting when "prompts contain many conditional statements," but redesign can also mean fewer agents or a fixed workflow. Bring the evidence to [choosing an architecture](../15-agent-architectures/05-choosing-an-agent-architecture.md).

## Common misconceptions

- **"A failing eval means the agent is wrong."** Sometimes the task or grader is: Claude Opus 4.5 scored 42% on CORE-Bench until Anthropic found rigid grading and ambiguous tasks, then 95% after fixes and a looser scaffold.
- **"It passed after my fix, so it is fixed."** One pass of a 1-in-5 failure proves little; rerun it, then run the suite.
- **"A bigger model will fix it."** No model can use a record its tool never returned or a permission it lacks.

## Typical interview questions

<details>
<summary>How do you debug an agent that fails a task?</summary>

Reproduce it for a failure rate, find the trace's first wrong step and its layer, fix only that layer, keep the run as a test and re-run the evals.

</details>

<details>
<summary>How does debugging an agent differ from debugging code?</summary>

Same method, different evidence: runs vary, so I measure a failure rate; I read a trace of decisions, not a stack trace; and wrong output raises no error.

</details>

<details>
<summary>A trace shows the agent miscalculated a discount. Do you fix the prompt?</summary>

No. If its inputs were right, that arithmetic belongs in code: I move the discount into a tested tool, keep the run as a test and re-run the evals.

</details>

<details>
<summary>A prompt was rewritten ten times and the failure keeps moving. What now?</summary>

Freeze the prompt and locate each failure's first wrong step. Fix data, tool or handoff causes there; if the prompt is a pile of conditionals, I propose splitting the agent, tested on the evals.

</details>

## Learn more

- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic, about 20 min)
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic, about 30 min)

## Related

- [Reproduce, Narrow, Minimize](../../m1/04-git-debugging-testing-security/06-reproduce-narrow-minimize.md)
- [Failure Attribution in Agent Systems](./03-failure-attribution.md)
- [Replayable Tests for Agent Workflows](./06-replayable-tests.md)
- [Prompt Brittleness and Portability](../../m2/08-prompting-context-structured-output/07-prompt-brittleness.md)
- [Choosing an Agent Architecture](../15-agent-architectures/05-choosing-an-agent-architecture.md)
