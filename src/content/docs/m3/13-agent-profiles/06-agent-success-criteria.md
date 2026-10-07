---
title: Agent Success Criteria and Definition of Done
row: M3-L1.6
---
**In one sentence:** Success criteria say in measurable terms, before you build, what good work from an agent looks like; the definition of done is the checklist each run must pass before the agent stops.

## What it is

An agent decides its own steps, including when to stop. Success criteria, the last field of an [agent profile](./02-agent-profiles.md), give it a target and answer "how will we know it works?" before building.

A builder's punch list is the model: "make the kitchen nice" cannot be checked; "cabinets hung, outlets working, inspection passed" can. Scrum teams call theirs a definition of done.

**Success criteria** are specific, measurable targets across many runs: outcome, quality bar, time and cost limits, and what must never happen. The **definition of done** is the part checkable on one run, before the agent stops.

## Why an FDE needs this

A publisher's Content Research agent had one criterion: "produce thorough, high-quality research." Some pilot briefs arrived after two searches, marked complete, half their claims unsourced; other runs spent 40 minutes rewriting a brief usable after ten. Editors rejected nearly half, each for different reasons.

The FDE and the managing editor rewrote it. A brief is done with five to eight claims, each citing a page the agent opened, plus a counterpoint; success is editors accepting 8 of 10 briefs without new research, each within 15 minutes. Code checks the list before the agent stops. (Illustrative scenario.)

## Key concepts

### From business goal to measurable criteria

Descript built evals for its video-editing agent around "don't break things, do what I asked, and do it well," per Anthropic's agent evals guide. Make each part checkable:

| Kind | Vague | Measurable |
|---|---|---|
| Outcome | "Good research" | 5 to 8 sourced claims answering the question |
| Quality bar | "High quality" | Editors accept 8 of 10 without new research |
| Time and cost | "Fast, cheap" | Under 15 minutes, agreed cost per brief |
| Must never | "Be careful" | Never cites a page it did not open |

Must-nevers are pass or fail on every run and need controls beyond the prompt ([prohibited actions](./04-responsibilities-and-prohibited-actions.md)).

### Agent-checkable vs evaluator-only criteria

Whatever the output and run log can prove (fields, sources actually opened, format, totals) belongs in the definition of done, confirmed by code, not the agent's word. Anthropic's long-running coding agents would "declare the job done" early; the fix: a feature list, every item starting as failing, marked passing only after testing.

```python
def unmet_checks(brief, opened_urls):
    claims = brief.get("claims", [])
    gaps = [f"claim {c['id']}: source not opened"
            for c in claims if c.get("source_url") not in opened_urls]
    if not 5 <= len(claims) <= 8:
        gaps.append(f"{len(claims)} claims, need 5 to 8")
    if not brief.get("counterpoint"):
        gaps.append("no counterpoint")
    return gaps  # empty: done; else send gaps back
```

A Claude Code `Stop` hook can run such checks and block the agent from finishing, with reasons.

Truth, source quality and usefulness need an evaluator, people or a calibrated [LLM judge](../../m2/11-ai-evaluation/07-llm-as-judge.md), across many runs. Later, [agent evaluation](../18-agent-evaluation-debugging/01-agent-evaluation.md) turns checklist items into code graders, the rest into rubric items, and each must-never into a test that tries to provoke it.

### Done means stop

Anthropic saw research agents "continuing when they already had sufficient results." Once every check passes, the agent returns rather than polishing; if one cannot pass, it returns partial work with a reason ([escalation conditions](./05-agent-inputs-outputs-escalation.md)). OpenAI's GPT-5 prompting guide suggests you "clearly state the stop conditions." A step limit ([bounded execution](../17-persistent-agents/04-bounded-execution.md)) is only a backstop.

## Common misconceptions

- **"'High quality' is a success criterion."** It is a wish; a criterion is checkable, like "every claim cites a page the agent opened."
- **"We'll know good output when we see it."** Then each reviewer judges differently, as the editors did. Agree criteria before building.
- **"The run ended, so the task is done."** Loops end when the model stops calling tools or hits a limit; neither proves the work is good.
- **"Passing the checklist means the work is good."** It proves structure and sourcing, not truth or usefulness, which evaluators measure across runs.

## Typical interview questions

<details>
<summary>How do success criteria differ from a definition of done?</summary>

Criteria are targets measured over many runs: outcome, quality, time and cost, must-nevers. The definition of done is the per-run subset code checks before the agent stops.

</details>

<details>
<summary>Which criteria can an agent check itself, and which need an evaluator?</summary>

Structure: required sections, valid format, claims tied to retrieved sources, reconciling totals. Truth, source quality and usefulness need people or a calibrated judge across many runs.

</details>

<details>
<summary>A sales team wants an agent that "finds good leads." How do you define success?</summary>

I ask what reps do with a lead, then set targets: reps accept most leads, time and cost limits per list, and must-nevers like never contacting prospects. Each lead matching the agreed customer profile, with a cited source, is the done check.

</details>

<details>
<summary>An agent sometimes stops after two searches, sometimes runs 40 minutes. What do you change?</summary>

Both point to a missing definition of done. I add code checks that return failures with reasons, stop once they pass, and return partial work with a reason when they cannot.

</details>

## Learn more

- Reference: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) (Anthropic docs, about 30 min)
- Article: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (Anthropic Engineering, about 10 min)

## Related

- [Agent Profiles (Profile.md)](./02-agent-profiles.md)
- [AI Evaluation (Evals)](../../m2/11-ai-evaluation/01-ai-evaluation.md)
- [Agent Evaluation (Tasks, Environments, Outcomes)](../18-agent-evaluation-debugging/01-agent-evaluation.md)
- [Agent-Level Metrics (Task Completion, Handoffs, Tool Use, Loops, Cost, Latency)](../18-agent-evaluation-debugging/04-agent-level-metrics.md)
- [Agent Inputs, Outputs and Escalation Conditions](./05-agent-inputs-outputs-escalation.md)
