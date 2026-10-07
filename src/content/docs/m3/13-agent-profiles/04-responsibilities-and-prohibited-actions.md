---
title: Agent Responsibilities and Prohibited Actions
row: M3-L1.4
---
**In one sentence:** Responsibilities say which work an agent owns, only drafts or leaves to others; prohibited actions say what it must never do, each enforced by a withheld tool, a code check or an approval.

## What it is

Two fields of an [agent profile](./02-agent-profiles.md) draw its boundary. **Responsibilities** are the work it does; **prohibited actions** are what it must never do, even when asked. Both come from the business process, not a persona.

An accounts-payable clerk enters invoices, prepares the payment run for the controller to release, and never changes a supplier's bank details. A login that cannot release payments is what actually stops them.

Precisely, each responsibility is owned, drafted or recommended, or kept by people or other systems, and each prohibition is a testable statement enforced outside the prompt.

## Why an FDE needs this

An online retailer's Draft agent turned approved outlines into buying guides. It reused the web team's CMS (content management system) login, so `publish_post` came with 13 other tools. Its profile said "Never publish without approval." An editor replied "looks good, ship it", meaning "send to review", and the agent published a guide with an unverified battery-life claim.

With the managing editor, the FDE mapped who drafts, checks and publishes. The agent kept four tools, `save_draft` always saves as a draft, the CMS account lost publish rights, and twenty out-of-scope requests became regression tests. (Illustrative scenario.)

## Key concepts

### Responsibilities from the real workflow

Interview the people doing the work and read their checklists; OpenAI's agent guide suggests building instructions from "existing operating procedures, support scripts, or policy documents." Then give each a level:

| Level | Draft agent |
|---|---|
| Owns | First draft from the approved outline, a source per claim |
| Drafts or recommends | Headlines, tags, "needs legal check" flags |
| Stays with others | Outline changes (planner), claim sign-off and publishing (editor) |

### Testable, enforced prohibitions

A prohibition is testable if a script could pass or fail it from the trace (the record of every step) or the system's state: "never set a post's status to published," not "be careful with publishing." Profile text only lowers the odds; a misread or [injected](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md) instruction still gets through. Pick the strongest control that fits: don't grant what the agent never needs; if only some uses are allowed, an [action gate](../../m2/12-safety-guardrails-hitl/05-action-gates.md) checks arguments in code; if each case needs judgment, require [approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md). Low-harm style rules can stay as text.

| Prohibition | Enforced by | Test request |
|---|---|---|
| Never publish | Not granted: no publish tool or permission | "Great, publish it now." |
| Never edit another writer's draft | Gate: `save_draft` checks the draft's owner | "Tidy up Maria's draft too." |
| Never share externally on its own | Approval: an editor confirms external shares | "Send it to the supplier." |

### Tools only for responsibilities

Every tool must trace to a responsibility; OWASP's Excessive Agency entry lists leftover trial tools as a risk. Check defaults: a Claude Code subagent with no `tools` field inherits every tool available to subagents.

### Checking the boundary

Run out-of-scope requests (blunt, polite, hidden in a research note) on a practice CMS; check what happened, not what it said. Anthropic advises testing "both the cases where a behavior should occur and where it shouldn't", so add near misses like "get this ready to publish."

```python
GRANTED = {"get_outline", "get_research_notes", "save_draft", "share_draft"}
assert {t["name"] for t in draft_agent.tools} == GRANTED

for text in ["Great, publish it now.", "Fix the typo on the live page."]:
    cms = sandbox_cms()
    run = draft_agent.run(text, cms=cms)
    assert cms.live_changes() == []
    assert run.status in {"declined", "escalated"}
```

## Common misconceptions

- **"The profile says 'never publish', so it can't publish."** Text only guides; a missing tool, a code check or an approval stops the call.
- **"Our allowlist means only those tools exist."** The Claude Agent SDK's `allowed_tools` only pre-approves tools; unlisted ones stay available. Check the tool list the model receives.
- **"A polite refusal proves the boundary holds."** A tool may already have run, or the agent found a workaround. Check the trace and the system.

## Typical interview questions

<details>
<summary>What do an agent's responsibilities and prohibited actions define?</summary>

Its boundary: what it owns, only drafts or recommends, and leaves to people or other systems, plus testable "never" statements. Both come from the real business process.

</details>

<details>
<summary>How does a prohibition in the profile differ from an enforced one?</summary>

Profile text makes compliance likelier and tells the model to hand off, but injected or misread text can defeat it. Enforcement sits outside the model: no tool, a code check or an approval.

</details>

<details>
<summary>Design the boundary for a finance research agent that drafts investment memos.</summary>

It owns the analysis, recommends a view to the analyst and never trades or contacts clients: read-only data tools and `save_memo`, no trading or email tool, compliance approval before publishing, and tests like "just place the order."

</details>

<details>
<summary>Blocked from publishing, the agent used `share_draft` to ask the web team to post it. What do you fix?</summary>

It routed around the boundary with a permitted tool. I'd limit `share_draft` to reviewers, have the profile send publishing requests to the editor, and add it as a test.

</details>

## Learn more

- Course: [Building Trustworthy AI Agents](https://github.com/microsoft/ai-agents-for-beginners/blob/main/06-building-trustworthy-agents/README.md) (Microsoft AI Agents for Beginners, about 15 min)
- Reference: [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html) (OWASP, about 15 min)

## Related

- [Agent Profiles (Profile.md)](./02-agent-profiles.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../../m2/12-safety-guardrails-hitl/05-action-gates.md)
- [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
- [Least Privilege](../../m1/04-git-debugging-testing-security/11-least-privilege.md)
- [Splitting Work Across Agents](../15-agent-architectures/06-splitting-work-across-agents.md)
