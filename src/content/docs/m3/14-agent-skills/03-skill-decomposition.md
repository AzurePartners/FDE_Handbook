---
title: Skill Decomposition
row: M3-L2.3
---
**In one sentence:** Skill decomposition is breaking an agent's growing all-in-one prompt into separate skills, each owning one step with an input and output you can name and test, while the profile keeps rules that apply everywhere.

## What it is

Teams append every new task and fix to one system prompt until it becomes a "super prompt," where every rule applies to every task. Decomposition cuts it along the steps of the real process into skills the agent loads when needed.

Wire a house as one circuit and one faulty kettle darkens every room; with a circuit per room, the fault stays put, easy to find and test.

Precisely, each skill owns one step whose input and output you can name and check, and the [profile](../13-agent-profiles/02-agent-profiles.md) keeps identity and rules for every step. The Decomposed Prompting paper (Khot et al., ICLR 2023) names the payoff: each sub-task prompt can be improved, split further or replaced by code on its own.

## Why an FDE needs this

A cloud security vendor's content agent runs on a 6,000-word system prompt grown over eight months. A line added to tighten drafts ("be concise") made research drop its source links. Legal's "never name competitors" rule, meant for published copy, stopped research from naming them in internal notes. When an article is bad, nobody can say which step failed.

With the content lead, the FDE maps five steps with named inputs and outputs, one skill each. The competitor ban stays in the profile, scoped to published copy and checked by the review skill. A drafting fix now touches only drafting. (Illustrative scenario.)

## Key concepts

### Warning signs of a super prompt

The prompt only grows, because nobody knows what a deletion breaks. Rules for one task fire in another. A fix for one task breaks another. OpenAI's agent guide adds a fourth sign: "many conditional statements (multiple if-then-else branches)."

### Cutting along inputs and outputs

Cut where work changes hands: each skill takes a named input and returns an output a colleague could check. Start from the client's written procedures, not the old prompt's sections. The Content Creation flow:

```text
profile    role, audience, prohibited claims, escalation (every step)

research   brief                  -> source notes, one link per claim
outline    brief + notes          -> outline, sources per section
draft      outline + notes        -> draft
review     draft + brief + rubric -> issue list
revise     draft + issue list     -> revised draft, change log
```

The profile keeps what holds on every step; skills hold procedures. Claude Code's docs agree: when a section of its always-loaded `CLAUDE.md` file "has grown into a procedure rather than a fact," make it a skill. Steps with one right answer, such as word counts, go to [code](./05-instruction-only-vs-code-backed-skills.md).

### Choosing granularity

| | Too coarse | Too fine |
|---|---|---|
| Example | One `write-article` skill, research to revision | `write-headline`, `write-intro`, `add-links` |
| Symptom | Rules still collide; failures hard to locate | Outputs nobody checks alone; more handoffs |
| Fix | Split where an intermediate output appears | Merge steps that always run together |

A right-sized skill has an output worth checking alone and a description that overlaps no other skill's, since agents choose skills by [description](./02-skill-md-and-progressive-disclosure.md).

### Testing each skill alone first

Save real upstream outputs, such as research notes for the outline skill, as fixed inputs, and make each skill pass alone before chaining. Then test the flow, since [errors compound](../../m2/07-llm-application-foundations/07-chat-vs-system-reliability.md). When it fails, rerun each step on its logged input to find the first that broke.

## Common misconceptions

- **"Decomposing an agent means giving each step its own agent."** A skill is instructions the same agent loads into its context. A separate agent adds handoffs and needs a reason, such as different permissions.
- **"One skill per rule type (tone, SEO, legal) is a clean split."** Rules are not steps: a tone skill has no input or output of its own and is needed everywhere, so it belongs in the profile or one shared file.
- **"If the end-to-end flow passes, every skill works."** A later step can mask an earlier mistake, and a failing flow cannot say which step broke.

## Typical interview questions

<details>
<summary>What is skill decomposition, and what tells you an agent needs it?</summary>

Splitting a growing prompt into skills, one per step with a named input and output, while the profile keeps rules for every step. Signs: the prompt only grows, rules collide, and fixing one task breaks another.

</details>

<details>
<summary>What belongs in the profile versus in a skill?</summary>

The profile holds identity and rules for every task: role, audience, prohibited actions, escalation. A skill holds one procedure, loaded only when its task comes up.

</details>

<details>
<summary>How would you decompose a marketing team's content agent?</summary>

With the content lead, I map research, outline, draft, review and revise, each with a named output such as sourced notes. Audience and banned claims stay in the profile, word counts go to code, and each skill passes on saved inputs before I test the flow.

</details>

<details>
<summary>A client's team proposes 30 micro-skills, one per paragraph type. How do you respond?</summary>

Paragraph types always run together inside one draft and nobody checks them alone, so I fold them into the drafting skill. I split only where an output is reviewed separately and descriptions do not overlap.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 20 min)

## Related

- [Agent Skills](./01-agent-skills.md)
- [Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md)
- [Skill Composition and Versioning](./06-skill-composition-and-versioning.md)
- [Splitting Work Across Agents](../15-agent-architectures/06-splitting-work-across-agents.md)
- [Reusable Prompt Templates](../../m2/08-prompting-context-structured-output/03-reusable-prompt-templates.md)
