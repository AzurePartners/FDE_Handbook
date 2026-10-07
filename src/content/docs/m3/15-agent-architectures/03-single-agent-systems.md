---
title: Single-Agent Systems
row: M3-L3.3
---
**In one sentence:** A single-agent system is one AI agent, with its profile, skills and tools, working in one loop where it picks each next step until the task is done, it needs a person, or a limit stops it.

## What it is

Picture one analyst handling a client question from start to finish, with a job description, a binder of procedures opened only when needed, and system logins. Nobody passes the file between desks.

A single-agent system works the same way. One [agent](../13-agent-profiles/01-ai-agents.md) owns the goal, the plan and the answer. Its [profile](../13-agent-profiles/02-agent-profiles.md) defines the job, [skills](../14-agent-skills/01-agent-skills.md) package procedures, and tools let code fetch data or act. Each round, the model reviews what it has gathered and chooses: call a tool, load a skill, ask the user or finish.

"Single" means one agent in charge, not one model call.

## Why an FDE needs this

A wealth manager's research agent answers analysts' open-ended questions, such as which holdings a new tariff affects. It had 38 tools, three described only as "Searches documents," and a 9,000-word prompt of if-then rules per report type. Traces (step-by-step run records) showed wrong search tools, a client's exclusion list forgotten in long runs, and one query repeated 30 times. The team planned five agents.

The FDE kept one agent: 12 distinct tools, a skill per report type, a subagent that condenses 300-page filings, and code that stores the exclusion list, checks requests, caps rounds and holds client memos for approval. The eval set (fixed test cases) passed. (Illustrative scenario.)

## Key concepts

### When one agent is the right design

First, as Anthropic puts it, "it's difficult or impossible to predict the required number of steps"; listable steps belong in a [workflow](./01-workflows-vs-agents.md). Second, the work is tightly coupled and fits in one context (everything the model sees on a call): each step builds on earlier findings, as in one analysis or document. Claude Code's docs advise staying with the main agent when "multiple phases share significant context, such as planning, implementation, and testing." One agent also means one trace to audit.

### How it scales, and how it fails

Limits show up in traces, not as errors:

| Failure | What traces show | Try first |
|---|---|---|
| Tool confusion | A plausible but wrong tool | Merge look-alikes, sharpen [descriptions](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md) |
| Rule collisions | Rules for one case break another | Move procedures into [skills](../14-agent-skills/03-skill-decomposition.md) |
| Drifting off task | A constraint dropped in long runs | Restate it from stored [task state](../16-agent-state-memory/04-task-state.md) |
| Runaway loops | The same call, no progress | A [round cap](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md), then [budgets](../17-persistent-agents/04-bounded-execution.md) |

Overlap matters more than count. OpenAI's guide reports that some agents "successfully manage more than 15 well-defined, distinct tools while others struggle with fewer than 10 overlapping tools" (catalog size: [Tool Calling](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)). Skills stretch further than prompt text: until needed, only each skill's name and description (about 100 tokens in Anthropic's format) stays loaded. Drift grows with context, well before the window fills ([context rot](../../m2/08-prompting-context-structured-output/05-context-pollution.md)).

### Extending it before adding agents

A subagent is a helper called like a tool: it gets a fresh context and its own tools, does one self-contained job and returns only its final result. OpenAI's Agents SDK offers `Agent.as_tool()` for when "a specialist should help with a bounded subtask but should not take over the user-facing conversation," and Claude Code subagents work the same way. Keep every write with the main agent. Steps that never vary, such as validation or publishing, stay in code around the agent.

## Common misconceptions

- **"Complex tasks need several agents."** OpenAI's guide says to "maximize a single agent's capabilities first." Split for an isolated context, different permissions or parallel breadth, not difficulty alone.
- **"Wrong tool picks mean too many tools."** Similar tools confuse an agent more than many distinct ones; merge look-alikes first.
- **"One agent means one giant prompt."** A short profile plus skills loaded on demand keeps each call focused.
- **"A looping agent needs a smarter model."** Loops often come from [tool errors](../../m2/10-tool-calling-deterministic-logic/07-tool-results-and-error-returns.md) the agent cannot act on, or no clear [definition of done](../13-agent-profiles/06-agent-success-criteria.md).

## Typical interview questions

<details>
<summary>What is a single-agent system, and when is it the right design?</summary>

One agent with a profile, skills and tools runs one loop and owns the answer. It fits open-ended tasks whose steps cannot be listed in advance but whose work fits in one context.

</details>

<details>
<summary>How does giving an agent a skill differ from giving it a subagent?</summary>

A skill loads instructions into the agent's own context, keeping its full history. A subagent works in a fresh context with its own tools and returns only a summary, suiting bulky, self-contained reading.

</details>

<details>
<summary>An agent comparing several 50-page contracts gets worse after the third. What do you change?</summary>

I keep one agent and add a subagent that reads one contract per call and returns a structured summary with clause references. The main agent compares the summaries and writes the answer.

</details>

<details>
<summary>Your agent forgets a client's exclusion list in long runs. How do you debug it?</summary>

I find the trace step where the constraint stops being followed and check its context size, then store the constraint in task state, offload bulky reading and add long-run eval cases.

</details>

## Learn more

- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 20 min)
- Article: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic Engineering, about 15 min)

## Related

- [AI Agents](../13-agent-profiles/01-ai-agents.md)
- [Workflows vs Agents](./01-workflows-vs-agents.md)
- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Tool Calling (Function Calling)](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)
- [Agent Skills](../14-agent-skills/01-agent-skills.md)
