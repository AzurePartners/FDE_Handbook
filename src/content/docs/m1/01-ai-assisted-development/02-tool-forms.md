---
title: AI Coding Tools
row: M1-L1.2
---
**In one sentence:** AI coding tools come in different forms, autocomplete that suggests the next line as you type, and agentic tools that read a codebase, plan a change, edit multiple files, and run commands on their own, and the form you are using changes how much you should trust the output unsupervised.

## What it is

There are two kinds of "AI in your editor." The first is autocomplete: as you type, it suggests the next line or two, and you accept or ignore it. It never opens a terminal, runs a test, or touches a file you are not looking at.

The second kind is agentic: you give it a task in plain language, and it reads relevant files across the project, plans changes, edits several files, runs commands, and reports back. It behaves less like smarter autocomplete and more like a junior engineer you hand a ticket to, fast but still needing their work checked.

Claude Code and Codex are agentic tools that started in the terminal (CLI) and now also run as IDE extensions, desktop apps, and web agents. Cursor is a full IDE with autocomplete plus an agent mode. All three follow read, plan, edit, run.

## Why an FDE needs this

A client's team may already have a preferred AI tool, and an FDE needs to be productive with whichever is available. An agentic tool can make sweeping, multi-file changes in one go that need a full review, closer to reviewing a colleague's pull request than glancing at one suggested line.

## Key concepts

### Comparing the three tools

| Tool | Surfaces | Free option (as of October 2026) |
|---|---|---|
| Claude Code | CLI, IDE extension (VS Code, JetBrains), desktop app, web | None, paid plan from Pro at $20/month |
| Codex | CLI, IDE extension, desktop app, web (in ChatGPT) | ChatGPT Free, with usage caps |
| Cursor | Desktop IDE, CLI, web agents | Hobby tier is free |

### Plan mode

Plan mode is a step where the AI proposes what it intends to do, and roughly how, before making any changes. You approve or redirect the plan, and only then does editing start, catching a misunderstanding before ten files change instead of after.

### Permissions

Agentic tools ask before risky actions: running a shell command, deleting a file, a network call. You can approve once, or configure which kinds are auto-allowed. This is where a human can stop a wrong command before it runs.

### Context files, in brief

Each agentic tool reads a project file at the start of a session, `CLAUDE.md`, `AGENTS.md`, or Cursor's rules in `.cursor/rules`. See [Context Management](./05-context-management.md).

## Common misconceptions

- **"Autocomplete and agentic AI are the same thing."** Autocomplete suggests as you type. An agentic tool acts, editing several files and running commands, on one instruction.
- **"Claude Code has a free tier like ChatGPT does."** It needs a paid plan, from Pro at $20 a month, or pay-as-you-go API credits. Prices change; check vendor pages.
- **"An IDE agent and a CLI agent work fundamentally differently."** Both follow the same read, plan, edit, run loop. Only where you type and where the terminal lives differs.

## Typical interview questions

<details>
<summary>What is the difference between agentic AI and autocomplete?</summary>

Autocomplete suggests the next line as you type. Agentic AI takes a task description, reads across the project, plans and edits multiple files, and can run commands, then reports what it did.

</details>

<details>
<summary>Explain plan mode in one or two sentences.</summary>

The AI proposes what it intends to change, and roughly how, before editing anything, so you can approve or redirect it before files are touched.

</details>

<details>
<summary>Which of Claude Code, Codex, or Cursor has a free option a beginner could start with today?</summary>

Codex is free on ChatGPT with usage caps, and Cursor's Hobby tier is free. Claude Code has no free tier.

</details>

<details>
<summary>A client only has Cursor installed. How does that change your workflow compared to using Claude Code?</summary>

Not much, both follow read, plan, edit, run. You rely on Cursor's rules file instead of `CLAUDE.md`, and its agent panel instead of a terminal.

</details>

## Learn more

- Article: [Claude Code best practices](https://code.claude.com/docs/en/best-practices) (Anthropic docs, 45 min)
- Course: [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy)

## Related

- [AI Coding Workflow](./01-ai-coding-workflow.md)
- [Context Management](./05-context-management.md)
- [Development Environment](./03-dev-environment.md)
