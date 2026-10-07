---
title: Context Management
row: M1-L1.2
---
**In one sentence:** Context management is deciding what goes into the AI's context window, the text it can actually see, because the AI has no memory of your project beyond what is in front of it.

## What it is

Context management is one of the basic collaboration patterns for AI coding tools such as Claude Code, Codex, and Cursor. A context window is the text an AI model can hold in one conversation (messages, files read, command output, its own replies), measured in tokens. The AI does not know your codebase the way a teammate of a year does. It knows only what was typed, pasted, or read into the current session, and can confidently answer about a file it never opened, and be wrong, or forget a decision from ten minutes ago once other text pushes it out of view.

Context files carry a few permanent facts across every new session without retyping them. Claude Code reads `CLAUDE.md` at the project root, Codex reads `AGENTS.md`, and Cursor reads its rules in `.cursor/rules` (and `AGENTS.md`), holding things like test commands and folder layout. They do not replace giving the AI the specific files a task needs.

## Why an FDE needs this

A client's codebase can be large, and an AI tool not pointed at the right files will guess, plausibly or not. An FDE who hands over a vague error message instead of the actual stack trace gets a vague, generic fix back. Giving the AI exactly the file and error it needs is the difference between a fix in one pass and three rounds of guessing in front of a client.

## Key concepts

### What to give the AI

Point it at the specific file or function involved, not the whole repository. Paste the actual error message, not a paraphrase. Narrow context beats large and vague.

### Long sessions degrade, then start fresh

As a session runs long, the window fills with old file contents and dead-end attempts. Relevant details get crowded out and answers start drifting, a normal limit, not a sign of a mistake. The fix is a new session, or compacting the current one and dropping the rest.

### Subagents keep context clean

Some tools support subagents: a separate AI session for one bounded task, such as searching the codebase, that reports back a short result instead of dumping its exploration into your main conversation.

### What never belongs in context

Never paste secrets, API keys, passwords, or real customer data into a prompt. A fix does not need a live secret, a placeholder works. Real customer data goes through approved tools, not a pasted row.

## Common misconceptions

- **"The AI remembers our earlier conversation forever."** It only knows what is in the current window, or what a context file restates at session start.
- **"More context is always better."** Past a point, extra irrelevant text crowds out what matters and degrades answers.
- **"CLAUDE.md and AGENTS.md replace pointing the AI at specific files."** They hold a few permanent facts. A task still needs the actual file attached.

## Typical interview questions

<details>
<summary>What is a context window, in plain terms?</summary>

The text an AI model can hold and reason over at once, measured in tokens: your messages, files it has read, its own replies. Nothing outside that window is visible to it.

</details>

<details>
<summary>A long AI session starts giving worse answers. What would you do?</summary>

Start fresh or compact the current session, then bring back only the files and facts that still matter, instead of adding to an already cluttered context.

</details>

<details>
<summary>What does a CLAUDE.md or AGENTS.md file do, and what doesn't it do?</summary>

A file the tool reads at the start of every session, holding a few permanent facts like test commands and conventions. It does not replace giving the AI the specific file a task needs.

</details>

<details>
<summary>Why would you use a subagent instead of doing a search directly in your main session?</summary>

A subagent runs a bounded task in its own context, returning a short result and keeping exploration noise out of the main window.

</details>

## Learn more

- Article: [Claude Code best practices](https://code.claude.com/docs/en/best-practices) (Anthropic docs, 45 min)
- Article: [Claude Code custom subagents](https://code.claude.com/docs/en/sub-agents) (Anthropic docs, read-only reviewer pattern)

## Related

- [AI Coding Tools](./02-tool-forms.md)
- [AI Code Review](./06-verify-dont-trust.md)
- [Secrets Management](../04-git-debugging-testing-security/09-secrets-management.md)
- Goes deeper in Module 2: [Tokens and Context Windows](../../m2/07-llm-application-foundations/02-tokens-and-context-windows.md)
- Goes deeper in Module 2: [Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- Goes deeper in Module 2: [Context Pollution and Context Rot](../../m2/08-prompting-context-structured-output/05-context-pollution.md)
