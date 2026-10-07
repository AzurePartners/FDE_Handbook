---
title: SKILL.md Files and Progressive Disclosure
row: M3-L2.2
---
**In one sentence:** A SKILL.md file is the Markdown file that packages one skill: a short header says what the skill does and when to use it, and progressive disclosure means the agent reads the rest only when needed.

## What it is

A skill (see [Agent Skills](./01-agent-skills.md)) is a folder whose one required file is `SKILL.md`. It opens with a header called frontmatter, written in YAML (plain `key: value` lines) between two `---` lines, then gives Markdown instructions: steps, examples and checks. Reference files, templates and scripts can sit alongside.

Anthropic likens a skill to a well-organized manual: you read the table of contents first, then open a chapter or the appendix only when needed.

Precisely, progressive disclosure loads a skill in three levels: its name and description always, the body when a request matches, and bundled files only when the body points to them. OpenAI's Codex documents the same order.

## Why an FDE needs this

A manufacturer's legal team gives its contract agent an NDA review skill. Lawyers soon see generic markups that ignore the company playbook, and costs rise. Traces (step-by-step run records) show why: the description read "Legal document helper," but lawyers typed "mark up this confidentiality agreement," so the skill rarely loaded. When it did, its 1,700-line `SKILL.md`, holding the whole playbook and six countries' rules, added about 20,000 tokens. (Illustrative scenario.)

The FDE rewrites the description in the lawyers' words, moves the playbook and one file per country into `references/`, and adds trigger tests to the evaluation set.

## Key concepts

### Anatomy of the file

```markdown
---
name: reviewing-ndas
description: Reviews NDAs against the company playbook and flags clauses to change. Use when asked to review or mark up an NDA or confidentiality agreement.
---
# Reviewing NDAs
1. Run scripts/extract_clauses.py to list the NDA's clauses.
2. Compare each clause with references/playbook.md.
3. For country rules, read only references/law-<country>.md.
Output: a table of changes (clause, playbook rule, new wording), as in references/example-review.md.
Before returning, check every change cites a playbook rule.
```

The Agent Skills open standard requires `name` (up to 64 lowercase letters, digits and hyphens, matching the folder) and `description` (up to 1,024 characters).

### The description is the trigger

Agents pick skills by matching requests against descriptions, so each must say what the skill does and when to use it, in the third person and the users' words. Overlapping descriptions cause wrong picks. Broken YAML hides a skill too: an unquoted colon (`Use when: ...`) breaks the header, leaving Claude Code no description to match.

### What loads when

| Level | Loaded | Budget |
|---|---|---|
| 1. `name` and `description` | Always, at startup | About 100 tokens per skill |
| 2. `SKILL.md` body | When a request matches | Under 5,000 tokens and 500 lines |
| 3. References, templates, scripts | When the body points there | Nothing until opened; scripts return only output |

Installed skills cost little per call (see [Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md)), though with too many, Anthropic warns, the agent may miss the right one. Link reference files directly from `SKILL.md`; nested links may be read only partly.

### Where skills live

- **Project folder:** Claude Code reads `.claude/skills/<name>/SKILL.md`, shared through Git.
- **API upload:** Anthropic's Skills API stores a zipped folder for the workspace.
- **App settings:** each claude.ai user uploads a zip.

Surfaces keep separate copies, so Git stays the source of truth.

### Third-party skills are installed software

A skill's scripts and instructions run with the agent's access, so Anthropic advises trusted sources and auditing every file and any URL it fetches. In February 2026, researchers reported 341 malicious, data-stealing skills on ClawHub, the OpenClaw assistant's marketplace. Pin the version you reviewed (see [Skill Composition and Versioning](./06-skill-composition-and-versioning.md)).

## Common misconceptions

- **"The agent reads every skill in full at startup."** Only names and descriptions; the rest loads when needed.
- **"Loading on demand means SKILL.md length does not matter."** A loaded body stays in context, competing with the task. Move detail into reference files.
- **"A skill is only text, so it is safe to install."** Its instructions can direct the agent to run code or send data out. Audit it like software.

## Typical interview questions

<details>
<summary>What is progressive disclosure in Agent Skills?</summary>

Loading a skill in stages: names and descriptions always, about 100 tokens each; the body when a request matches; bundled files only when the body calls for them.

</details>

<details>
<summary>How do a skill's description and its body differ?</summary>

The description is the trigger: always loaded, it says what the skill does and when to use it. The body is the procedure, read only after the skill triggers.

</details>

<details>
<summary>How would you restructure a 2,000-line SKILL.md covering five countries?</summary>

Steps, output format and checks stay in the body, under 500 lines. The playbook and each country's rules become reference files linked from `SKILL.md`, so the agent reads only what it needs.

</details>

<details>
<summary>A skill never triggers on its own. How do you debug it?</summary>

I check that the frontmatter parses, since broken YAML leaves no description to match. Then I compare the description with real requests in traces, rewrite it in the users' words, and add should-trigger and should-not-trigger test prompts.

</details>

## Learn more

- Article: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (Anthropic, about 8 min)
- Reference: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (Anthropic Claude Docs, about 25 min)
- Reference: [Specification](https://agentskills.io/specification) (Agent Skills, about 5 min)

## Related

- [Agent Skills](./01-agent-skills.md)
- [Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md)
- [Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [Prompt Injection and Jailbreaks](../../m2/12-safety-guardrails-hitl/04-prompt-injection.md)
- [Instruction-Only vs Code-Backed Skills](./05-instruction-only-vs-code-backed-skills.md)
