---
title: Review and Critic Patterns
row: M3-L3.8
---
**In one sentence:** A review or critic pattern adds a step that checks work against explicit criteria before it moves on, sends failures back for revision, and stops when the criteria pass or a limit is reached.

## What it is

A review step checks work before the next step uses it and sends specific failures back for another try.

Think of a building inspector: they test wiring against the electrical code instead of trusting the electrician, list each failure and return once or twice.

Precisely, this is the evaluator-optimizer loop: generate, critique against criteria, revise, repeat until the criteria pass or a cap is hit. The critic may be the same model (self-review), a separate call or Review agent, or code such as tests. Unlike an [LLM judge](../../m2/11-ai-evaluation/07-llm-as-judge.md) scoring an eval set offline, a critic checks every live item and steers its revision.

## Why an FDE needs this

A wealth manager's Content Operations flow (Research, Plan, Draft, Review) wrote weekly market commentary. Its Review agent was the drafting model told to "improve this until it is excellent." Drafts looped five or six times, multiplying cost, since some phrase could always be polished. Yet compliance still caught a year-to-date return contradicting the fund fact sheet, which the reviewer never saw.

The FDE moved figure and disclaimer checks into code reading the fact-sheet data, gave a separate critic a four-item pass or fail rubric and the research notes, capped revisions at two, and sent failures to an editor. (Illustrative scenario.)

## Key concepts

### The evaluator-optimizer loop

Anthropic's *Building effective agents* describes one LLM call generating while another "provides evaluation and feedback in a loop," useful when criteria are clear and refinement measurably helps. OpenAI's Agents SDK and LangGraph document it too:

```python
def produce(brief, facts, notes):
    draft = write(brief)
    for attempt in range(MAX_REVISIONS + 1):
        failures = code_checks(draft, facts)         # exact checks first
        if not failures:
            failures = critic(draft, notes, RUBRIC)
        if not failures:
            return {"status": "passed", "draft": draft}
        if attempt < MAX_REVISIONS:
            draft = revise(draft, failures)          # fix listed items only
    return {"status": "needs_editor", "draft": draft, "failures": failures}
```

The critic returns [structured output](../../m2/08-prompting-context-structured-output/06-structured-output.md): pass or fail per rubric item, with evidence and a fix. Stop when all criteria pass, not when the critic runs out of ideas, and cap the rounds: Google's ADK docs warn that its `LoopAgent` "does not inherently decide when to stop looping."

### Self-review vs a separate reviewer

Self-review is cheap and fine for polish. Self-Refine (Madaan et al., 2023) reported gains on seven tasks, but Huang et al. (ICLR 2024) found models struggled to fix their reasoning without external feedback, sometimes getting worse.

A separate reviewer gets its own profile, a fresh context with the sources instead of the drafting conversation, read-only tools (like Claude Code's sample code-reviewer subagent) and possibly another model.

### What makes a critic useful

A critic needs an explicit rubric of binary criteria from the agent's [success criteria](../13-agent-profiles/06-agent-success-criteria.md) and external signals: tests, validators, recalculated figures, the sources. CRITIC (Gou et al., ICLR 2024) improved self-correction with tool checks. Anthropic's Agent SDK guide ranks "clearly defined rules," with which ones failed and why, as the best feedback, and calls LLM judging on fuzzy rules "generally not a very robust method."

### When critics do not pay

Every round costs a critique and a rewrite. The MAST study of multi-agent failures (Cemri et al., 2025) found many verifiers checked only surface details, like whether code compiled: a generated chess game passed review, unchecked against chess rules. Seed known errors into [agent evals](../18-agent-evaluation-debugging/01-agent-evaluation.md) and drop a critic that catches nothing costly.

## Common misconceptions

- **"A model rereading its own draft will spot its errors."** Without new information, a self-check shares the draft's blind spots and can turn right answers wrong. Give the reviewer sources, tests or a rubric.
- **"More review rounds always improve the output."** Each round adds cost and latency, and a revision can break what had passed. Cap the loop.
- **"A Review agent makes the output safe to publish."** It catches only what its criteria and inputs let it see; exact facts belong in code, and costly actions still need [human approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md).

## Typical interview questions

<details>
<summary>What is the evaluator-optimizer pattern, and when does it fit?</summary>

One call generates, another critiques against explicit criteria, and the first revises until they pass or a cap is hit. It fits when criteria are clear and feedback measurably helps, as in translation.

</details>

<details>
<summary>How does self-review differ from a separate reviewer agent?</summary>

Self-review reuses the writer's model and often its context, sharing its blind spots. A separate reviewer brings its own instructions, a fresh context with the sources, read-only tools and possibly another model.

</details>

<details>
<summary>How would you design a client newsletter flow's Review step?</summary>

Code checks figures, the disclaimer and links first. Then a separate critic applies a short binary rubric against the research notes, with evidence and fixes. After two revisions, an editor gets the failed items.

</details>

<details>
<summary>Your critic doubled cost, but published errors did not fall. What now?</summary>

Compare its flags in traces with the errors that shipped. If it flags style but misses facts, give it the sources or move that check into code, then re-measure on seeded errors; if it still catches nothing, remove it.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Article: [Building agents with the Claude Agent SDK](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) (Anthropic, about 10 min)
- Practice: [Evaluator optimizer](https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer) (Claude Cookbook, about 15 min)

## Related

- [Workflow Patterns (Chaining, Routing, Parallelization)](./02-workflow-patterns.md)
- [LLM-as-Judge](../../m2/11-ai-evaluation/07-llm-as-judge.md)
- [Skill Inputs, Outputs and Checks](../14-agent-skills/04-skill-inputs-outputs-and-checks.md)
- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
