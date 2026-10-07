---
title: Agent Profiles (Profile.md)
row: M3-L1.2
---
**In one sentence:** An agent profile is a short document that defines an agent as a job (role, objective, responsibilities, prohibited actions, inputs, outputs, escalation conditions and success criteria), written from the business process it serves, not a one-line persona.

## What it is

A persona such as "You are an expert researcher" tells a model who to sound like. A profile tells it the job: what it owns, must never do, receives and returns, when to ask a person, and what counts as done.

A new hire gets more from a role sheet (who assigns work, what needs sign-off) than from "you're a great writer"; a profile is that sheet for a model.

`Profile.md` is this handbook's name for the file; frameworks call it instructions or a system prompt. A prompt's role line ([Prompt Structure](../../m2/08-prompting-context-structured-output/01-prompt-structure.md)) scopes one request; a profile defines a job across steps and runs.

## Why an FDE needs this

A manufacturer's supplier onboarding agent was defined in one line: "You are an expert procurement specialist. Help onboard new suppliers." Within a month it had approved two suppliers, emailed one for bank details, and copied a tax ID from an email signature after verification failed. With no job defined, nobody questioned its write access.

The FDE rebuilt it from the procurement team's onboarding procedure: it prepares an onboarding pack, never approves suppliers or handles bank details, sends tax ID mismatches to compliance, and is done when every checklist item has evidence or a flagged gap. Write access was removed; the procurement lead owns the profile in the client's repository. (Illustrative scenario.)

## Key concepts

### From persona to job definition

Start from the business process, not an adjective. OpenAI's agent guide suggests writing instructions from "existing operating procedures, support scripts, or policy documents"; then confirm each line with the process owner. So "You are a meticulous editor" becomes "Check the draft against the review checklist; return pass or fail per item; never edit the draft." Each line should be checkable in an output or trace.

### A minimal profile

A Content Research agent as a Claude Code subagent file (`.claude/agents/content-research.md`): frontmatter configures the runtime; the body becomes the system prompt.

```text
---
name: content-research
description: Use when an approved brief needs sourced research.
tools: WebSearch, WebFetch, Read
---
Role: Researcher for the content team.
Objective: Give the Draft agent all it needs without more research.
Responsibilities: Find credible sources; extract claims with links; list gaps.
Prohibited: Writing copy; estimating figures; blocked-list sources.
Inputs: The approved brief (topic, audience, questions).
Output: Research brief (claims, sources, gaps), status done or needs_input.
Escalate: To the content lead when sources conflict or are missing.
Success: Every claim links to a supporting source; every question answered or flagged.
```

### Where a profile lives

A profile goes in Anthropic's `system` field, `instructions` in the OpenAI Agents SDK, `instruction` in Google's ADK, or a definition file like the one above. Coding agents also read repository files such as `AGENTS.md` ([AI Coding Tools](../../m1/01-ai-assisted-development/02-tool-forms.md)), which mostly hold project instructions, not one agent's job. The runtime enforces `tools` (if omitted, the subagent inherits every tool available to subagents), while the body only guides ([Prohibited Actions](./04-responsibilities-and-prohibited-actions.md)). Version profiles in Git ([Prompt Versioning](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md)).

### Comparing Research, Draft and Review

| | Research | Draft | Review |
|---|---|---|---|
| Owns | Sourced claims, gaps | Copy per brief, style guide | A verdict per checklist item |
| Never | Writes copy | Adds unresearched claims | Edits or publishes |

Each "never" is someone else's job. In Anthropic's research system, vague tasks like "research the semiconductor shortage" often left subagents misreading the task or duplicating searches.

## Common misconceptions

- **"More rules make a safer profile."** Anthropic warns that hardcoded "complex, brittle logic" creates fragility. Move facts to [knowledge sources](./03-profile-vs-knowledge.md) and procedures to [skills](../14-agent-skills/01-agent-skills.md).
- **"The `description` is just a label."** A parent agent reads it to decide when to delegate. Google's ADK docs prefer "Handles inquiries about current billing statements" to just "Billing agent."
- **"Engineers write the profile; the business reviews the demo."** Its boundaries are business decisions, so the process owner approves the profile and every change.

## Typical interview questions

<details>
<summary>What is an agent profile?</summary>

A versioned job definition for one agent: role, objective, responsibilities, prohibited actions, inputs, outputs, escalation conditions and success criteria. Its text becomes the system prompt; its limits are also set in the runtime.

</details>

<details>
<summary>How does a profile differ from a prompt's role line?</summary>

A role line sets scope and tone for one request; a profile defines a job across runs: what the agent hands off, must never do and escalates.

</details>

<details>
<summary>How would you define an agent that chases overdue invoices?</summary>

From the collections procedure and the credit controller: send approved reminders and log replies; never offer discounts or payment plans; escalate disputes; done when each overdue invoice has a logged next step. Then I test "can I pay half?"

</details>

<details>
<summary>A Review agent rewrites drafts instead of reviewing them. What do you fix?</summary>

I check the trace for edit calls and the profile for lines like "improve the draft." Then I make the output pass or fail per checklist item, prohibit edits, remove the edit tool, add an eval case.

</details>

## Learn more

- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 20 min)
- Reference: [Simple agents](https://adk.dev/agents/llm-agents/) (Google ADK docs, about 10 min)
- Reference: [Create custom subagents](https://code.claude.com/docs/en/sub-agents) (Claude Code docs, about 15 min for the file format)

## Related

- [AI Agents](./01-ai-agents.md)
- [Prompt Structure](../../m2/08-prompting-context-structured-output/01-prompt-structure.md)
- [Separating Agent Knowledge from the Profile](./03-profile-vs-knowledge.md)
- [Agent Responsibilities and Prohibited Actions](./04-responsibilities-and-prohibited-actions.md)
- [Agent Success Criteria and Definition of Done](./06-agent-success-criteria.md)
