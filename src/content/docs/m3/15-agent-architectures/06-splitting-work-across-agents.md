---
title: Splitting Work Across Agents
row: M3-L3.6
---
**In one sentence:** Splitting work across agents means giving a responsibility its own agent only when it needs an isolated context, different tools or permissions, independent review or parallel runs; otherwise it stays a skill or a function.

## What it is

A separate agent has its own profile (job definition), context window (the text the model sees on each call), tools and loop; the line between two agents is a boundary.

Think of a newsroom. The reporter who outlines a story also writes it, since a second writer would need everything the first had in mind. The fact-checker is separate on purpose, so the reporter's assumptions cannot blind the check.

Precisely: draw a boundary where a subtask's needs differ from the rest of the work, not around every box in a process diagram. Each boundary adds a handoff, model calls and a place to lose information, so every split must earn its place.

## Why an FDE needs this

A travel company's content system chained seven agents: Research, Outline, Draft, SEO, Fact-check, Format and Publish. Drafts ignored the Outline agent's chosen angle, the SEO agent rewrote fact-checked sentences, and the Format agent, a model doing a template's job, changed a hotel price. Nobody could say which agent caused an error.

The FDE tested each boundary against the four reasons below. Research stayed separate: it searches in parallel, returns a sourced brief and cannot publish. Fact-check became a read-only Reviewer. Outline, Draft and SEO merged into one Writer with a skill each; Format and Publish became code behind an editor's approval. On the same eval set, three agents beat seven on errors, cost and speed. (Illustrative scenario.)

## Key concepts

### Four reasons to split

| Reason | Test | Example |
|---|---|---|
| Isolated context | Reads far more than it returns | 40 pages in, one-page brief out |
| Different tools or permissions | Needs access others must not have | Browses the web, cannot publish |
| [Independent review](./08-review-and-critic-patterns.md) | The author's reasoning would bias the check | Sees only the draft and sources |
| Parallel runs | Pieces run at once without talking | Five competitor profiles |

Claude Code's docs agree: delegate work that produces verbose output you will not need, needs specific tool restrictions or permissions, or is self-contained and can return a summary.

### Reasons not to split

- **Shared decisions.** When a step makes choices the next must honor (angle, audience, structure), a summary drops the reasoning. Anthropic calls domains where agents must share context or depend heavily on each other "not a good fit for multi-agent systems today."
- **Tiny steps.** A one-call step does not repay a boundary's [contract](./07-handoffs-and-agent-contracts.md), extra calls and waiting.
- **New failures.** Every boundary is another place a payload arrives incomplete or misread; the MAST study names inter-agent misalignment as one of three multi-agent failure categories.

### Agent, skill or function

Making every step an agent is the classic over-design. For each step:

```text
1. One rule-defined right answer?        -> function in code
2. Needs its own context, tools or
   permissions, independent review
   or parallel runs?                     -> separate agent
3. Anything else                         -> skill in the agent
                                            that holds the context
```

LangChain's docs show both sides: one request costs four model calls through a subagent (an agent called by another agent) and three through a [skill](../14-agent-skills/01-agent-skills.md), but a three-language comparison took about 9,000 tokens with subagents against 15,000 with skills, because isolation kept each context small.

### Merging agents back

A split is a hypothesis. Warning signs: downstream agents re-derive what upstream knew, payloads grow toward the whole history, errors cluster at boundaries. Merge the roles as skills in one agent, rerun the [eval set](../../m2/11-ai-evaluation/02-evaluation-sets.md) and keep the winner.

## Common misconceptions

- **"Each role on the team should be its own agent."** People specialize because of limited hours and training; an agent loads another skill in seconds.
- **"Smaller agents make the system easier to debug."** Failures move to the boundaries, and you must first find which agent failed.
- **"Merging agents back means the design failed."** It means the evaluation did its job.

## Typical interview questions

<details>
<summary>When does a responsibility deserve its own agent?</summary>

When it needs an isolated context, tools or permissions others must not have, independent review, or parallel runs. Otherwise it stays a skill or function: each boundary adds calls, latency and a lossy handoff.

</details>

<details>
<summary>What is the difference between splitting by process step and splitting by need?</summary>

Splitting by step gives every flowchart box an agent, so every arrow becomes a handoff. Splitting by need draws boundaries only where context, permissions, independence or parallelism differ; most steps become skills or functions.

</details>

<details>
<summary>Design the agents for Content Operations: Research, Plan, Draft, Review.</summary>

A Research agent that searches in parallel and returns a sourced brief; one Writer that plans and drafts, since the plan drives the draft; a read-only Reviewer. Publishing stays code behind approval.

</details>

<details>
<summary>A six-agent pipeline is slow and hard to debug. What do you do?</summary>

Use traces to find where errors enter, test each boundary against the four reasons, merge agents that fail it, move rules into code, and compare both versions on one eval set.

</details>

## Learn more

- Reference: [Create custom subagents](https://code.claude.com/docs/en/sub-agents) (Claude Code Docs, "Choose between subagents and main conversation" section, about 5 min)
- Docs: [Multi-agent](https://docs.langchain.com/oss/python/langchain/multi-agent) (LangChain docs, about 10 min)
- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic, about 20 min)

## Related

- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Skill Decomposition](../14-agent-skills/03-skill-decomposition.md)
- [Agent Responsibilities and Prohibited Actions](../13-agent-profiles/04-responsibilities-and-prohibited-actions.md)
- [Handoffs and Agent Contracts](./07-handoffs-and-agent-contracts.md)
- [Choosing an Agent Architecture](./05-choosing-an-agent-architecture.md)
