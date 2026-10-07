---
title: Agent Skills
row: M3-L2.1
---
**In one sentence:** An agent skill is a named, reusable package of steps, checks and optional scripts for one kind of task, such as comparing peers or writing a memo, that an agent loads only when a task calls for it.

## What it is

An [AI agent's](../13-agent-profiles/01-ai-agents.md) [profile](../13-agent-profiles/02-agent-profiles.md) says what job it does. A skill says how to do one recurring task in that job: steps, inputs, output, checks, and sometimes a script or reference file.

Think of airline checklists: pilots do not memorize every procedure; they pull out the right checklist when its situation arises, and one update reaches every crew.

Precisely: a skill is instructions plus optional files that an agent finds by a short description and loads into its own context only when needed.

## Why an FDE needs this

A wealth-management client runs a research agent and a memo agent, each with its own pasted copy of the house peer-comparison method in its system prompt. When the investment committee changed the peer rules, only the research prompt was updated, and memos began mixing tables built under both rules. A portfolio manager caught it two weeks later; no test covered a method that lived only inside whole-agent prompts.

The FDE moved the method into one `compare-peers` skill that both agents load, with the ratio math in a script, eight sample companies with expected tables, and a named owner. The next rule change took one edit and one test run. (Illustrative scenario.)

## Key concepts

### What a skill packages

Besides instructions, a skill can bundle scripts, such as ratio math, and reference files, such as a memo template. A finance research agent might carry:

```text
research-company    background from filings and news
extract-financials  filing figures into a fixed table
compare-peers       ratios against named peers
summarize-call      key points of an earnings call
write-memo          investment memo from the house template
review-memo         draft memo against the committee rubric
```

Until a request needs one, the agent sees only each skill's name and short description. Each skill's contract is in [Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md).

### Skills vs prompts, tools and subagents

| | What it is | In the agent's context | Best for |
|---|---|---|---|
| System prompt | The profile and standing rules | Always | Rules for every task |
| Skill | Know-how for one task | Its description, until needed | A repeatable task |
| Tool | A function your code runs | Its definition, usually every call | Data access and actions |
| Subagent | A separate agent with its own context and permissions | Only its result | Isolated, parallel or restricted work |

They combine: `compare-peers` tells the agent which [tool](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md) to call and what to do with the result.

### The Agent Skills format and open standard

Anthropic introduced Agent Skills on October 16, 2025: a folder holding a `SKILL.md` instructions file plus optional scripts and resources ([format and loading](./02-skill-md-and-progressive-disclosure.md)). On December 18, 2025, it published the format as an open standard at agentskills.io, which lists dozens of compatible products, including OpenAI's Codex, Google's Gemini CLI, GitHub Copilot and Cursor. Compatible is not identical: fields and runtimes differ (Anthropic's API gives skills no network access; Claude Code does), so test each skill wherever you deploy it.

### Maintainable, testable, reusable

Each procedure gets one home, one owner and its own tests, [versioned](./06-skill-composition-and-versioning.md) like code. Test two things separately: does the agent pick the skill when it should, and is the output right when it does? And one folder serves every agent that needs it.

## Common misconceptions

- **"A skill is just a saved prompt."** It loads only when needed, can bundle scripts and files, and several agents can share and test it.
- **"Once the agent has a skill, it will follow it."** The model chooses when to load it and how closely to follow it. Hard rules belong in code, such as an [action gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md).
- **"Skills only work with Claude."** The format is an open standard, supported with some differences by OpenAI, Google, GitHub and others.

## Typical interview questions

<details>
<summary>What is an agent skill?</summary>

A named, reusable capability for one kind of task that an agent loads only when a request needs it. It packages steps, inputs, output and checks, plus optional scripts and reference files.

</details>

<details>
<summary>How does a skill differ from a tool?</summary>

A tool is a function my code runs on the model's request, like `get_financials`. A skill is a procedure the model reads, like the house peer-comparison method, and it often says which tools to call.

</details>

<details>
<summary>A research agent needs market data, the house comparison method and an independent compliance check. What do you build?</summary>

A tool for the market-data API; a skill for the method, calling that tool and a ratio script; and a compliance subagent with its own context and read-only access, so it judges the memo independently.

</details>

<details>
<summary>A platform claims to support Agent Skills. What do you check?</summary>

Which frontmatter fields it honors, whether it runs bundled scripts and under what network limits, and who can install and use skills. Then I run each skill's test cases there rather than trusting the label.

</details>

## Learn more

- Article: [Skills explained: How Skills compares to prompts, Projects, MCP, and subagents](https://claude.com/blog/skills-explained) (Claude blog, about 12 min)
- Reference: [Agent Skills Overview](https://agentskills.io/home) (agentskills.io, about 3 min)
- Article: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (Anthropic Engineering, about 8 min)

## Related

- [AI Agents](../13-agent-profiles/01-ai-agents.md)
- [SKILL.md Files and Progressive Disclosure](./02-skill-md-and-progressive-disclosure.md)
- [Skill Decomposition](./03-skill-decomposition.md)
- [Instruction-Only vs Code-Backed Skills](./05-instruction-only-vs-code-backed-skills.md)
- [Tool Schemas and Tool Design](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md)
