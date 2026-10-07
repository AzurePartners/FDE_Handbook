---
title: Context Engineering
row: M2-L2.4
---
**In one sentence:** Context engineering is deciding what information the model receives on each call, from which source and at what moment, so it gets the smallest set of facts that is still enough for the task.

## What it is

A model knows only what is in the request. Prompt engineering words the instructions. Context engineering chooses everything else that goes in (facts, documents, history, tool results, tool definitions) and when each piece arrives.

It is like briefing a temp consultant before a client call: not the whole file room, but a standing brief, the current account sheet and a list of where to look things up.

Anthropic's September 2025 engineering post calls it "the natural progression of prompt engineering." Its goal: "the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome."

## Why an FDE needs this

An insurer's claims assistant passed its demo but fails in production. Each request carries the 300-page policy manual (old editions included), every past message, raw claims JSON and a system prompt that opens with a timestamp. Replies are slow and costly, one quotes a retired deductible, and forty turns in it mails a letter to an address the customer had corrected.

The FDE logs the fully assembled context for failing requests, writes a context plan with one row and budget per source, and re-runs the evals to confirm the fix.

## Key concepts

### Standing, per-request or on demand

Standing instructions (scope, refusal rules, tool definitions) are identical on every call. Per-request facts are injected by your code, such as today's date and the customer's account summary. Retrieval on demand fetches material through search or a lookup tool only when needed: slower than loading up front, but it keeps context small and current.

### Minimum sufficient context

Everything shares one budget, including tool definitions and the reply. Anthropic's docs warn that as token count grows, "accuracy and recall degrade," so a large window is no excuse. Remove duplicates and prune superseded or irrelevant passages. But "sufficient" matters: Google Research found in 2025 that models given too little evidence often answer wrongly instead of abstaining. Never put secrets, or records the current user may not see, into context.

### Labeling and ordering

Label each item with a source ID and effective date so every fact is traceable. Models use the start and end of a long context best ("Lost in the Middle," Liu et al., 2024), and providers differ: Anthropic puts long documents above the question; OpenAI's GPT-4.1 guide puts instructions before and after. Test ordering with evals. Put stable content first: provider prompt caching reuses only an exactly matching prefix, so a timestamp at the top makes every call a cache miss.

The insurer's plan, with example token budgets:

```text
Instructions, tools              standing          3,000
Pinned case facts                never trimmed       300
Older turns, summarized          per conversation    500
Last 8 turns, verbatim           per conversation  3,000
Date, account summary            per request         500
Top 4 current policy sections    on demand         4,000
Question                         per request         200
```

### Long conversations

Trimming keeps the last N turns: predictable and fast, but early constraints can vanish, and cuts must fall on turn boundaries so a tool call keeps its result. Summarization compresses older turns but can drop details, and a wrong fact in a summary keeps steering later turns (OpenAI's cookbook calls this context poisoning). Pin confirmed facts outside the summary and log summaries. Compaction is provider-run summarization (Anthropic and OpenAI offer it server-side), so still check what survives.

## Common misconceptions

- **"Context engineering is a new name for prompt engineering."** Prompt engineering words the instructions; context engineering decides what else goes in, and when.
- **"Our window is huge, so include everything."** Accuracy degrades as context grows, and every token adds cost and latency.
- **"A wrong answer needs more context."** Often the fix is removing a superseded document or conflicting instruction. Read the logged context first.
- **"Summaries save tokens without losing anything."** They drop details and can lock in errors, so pin critical facts.

## Typical interview questions

<details>
<summary>What is context engineering, and how does it differ from prompt engineering?</summary>

Prompt engineering writes the instructions. Context engineering decides what else the model sees on each call, and when: the smallest high-signal set that is still sufficient.

</details>

<details>
<summary>How do standing instructions, per-request facts and retrieval on demand differ?</summary>

Standing instructions, like refusal rules, are identical on every call and go first. The app injects per-request facts, like the account summary. Retrieval fetches policy sections only when needed.

</details>

<details>
<summary>How would you design context for a claims assistant with a 300-page manual?</summary>

I list each source with origin, timing, position and budget. Stable instructions first, then pinned facts and history, then the account summary and a few current, labeled sections, then the question. I log the assembled context and run evals to catch over-trimming.

</details>

<details>
<summary>Forty turns in, the assistant ignores a corrected address. How do you debug it?</summary>

I check the logged prompt: trimming may have dropped the correction, or a summary lost it. I pin confirmed facts in a never-trimmed block, keep recent turns verbatim, summarize older ones and add a long-conversation eval case.

</details>

## Learn more

- Article: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic, about 20 min)
- Video: [Context Engineering vs. Prompt Engineering: Smarter AI with RAG & Agents](https://www.youtube.com/watch?v=vD0E3EUb8-8) (IBM Technology, about 10 min)
- Practice: [Context Engineering: Short-Term Memory Management with Sessions](https://developers.openai.com/cookbook/examples/agents_sdk/session_memory) (OpenAI Cookbook, about 30 min)

## Related

- [Tokens and Context Windows](../07-llm-application-foundations/02-tokens-and-context-windows.md)
- [Message Roles, System Prompts and Conversation History](../07-llm-application-foundations/04-message-roles.md)
- [Reusable Prompt Templates](./03-reusable-prompt-templates.md)
- [Context Pollution and Context Rot](./05-context-pollution.md)
- [Retrieval-Augmented Generation (RAG)](../09-rag-knowledge-bases/01-retrieval-augmented-generation.md)
