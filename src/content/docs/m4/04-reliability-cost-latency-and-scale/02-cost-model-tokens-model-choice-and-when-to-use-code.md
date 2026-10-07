---
title: "Cost Model: Tokens, Model Choice & When to Use Code"
row: M4-L4.2
---
**In one sentence:** AI features cost money per token, per model, per API call, per unit of storage and compute, so controlling cost means measuring token usage, right-sizing the model, caching, and using cheaper deterministic code wherever it can do the job.

## What it is

Model providers bill per **token** (input and output separately), and bigger models cost more per token. On top of that sit paid data sources, third-party API calls, storage, and compute. A feature that stuffs huge context into every call, uses a top-tier model for a trivial task, or calls the model where a few lines of code would do, can cost orders of magnitude more than necessary. The cost model is the set of levers: measure tokens, trim prompts/context, cap output, cache, right-size the model per task, and prefer deterministic code for anything that doesn't need a model.

## Why an FDE needs this

AI features have a variable cost that scales with usage, unlike most software; a demo costing cents can cost thousands at customer scale. An FDE often has to make the unit economics work and be able to estimate cost per request, that's what lets you promise a feature that's affordable in production, not just impressive in a demo.

## Key concepts

- **Token accounting:** input + output tokens per request is the core bill.
- **Model right-sizing:** small/cheap model for classification and simple tasks; large only where quality demands.
- **Use code over the model:** deterministic logic is far cheaper and exact, don't pay a model to add numbers.
- **Trim & cap:** send only needed context; cap output length.
- **Cache & batch:** reuse results; combine calls (ties to reliability page).
- **Budgets & alerts:** per-feature/customer caps and spend alerts.

## Common misconceptions

- **"Use the best model for everything."** Most tasks are met by a smaller, far cheaper model; reserve the big one for hard cases.
- **"More context improves quality."** Beyond what's relevant, it adds cost and can dilute the answer.
- **"Cost is fixed."** It scales with tokens and usage; without measurement and caps it grows silently.

## Typical interview questions

<details>
<summary>What drives the cost of an LLM feature and how do you control it?</summary>

Cost is per token (input and output) and scales with model size and volume, plus paid data, API calls, storage, and compute. I control it by trimming context and capping output, caching and batching, right-sizing the model per task, using deterministic code wherever it suffices, and setting per-customer budgets and spend alerts.

</details>

<details>
<summary>When should logic be code instead of a model call?</summary>

Whenever the task is deterministic and exact, calculations, lookups, formatting, rule enforcement. Code is cheaper, faster, and correct every time, while a model call costs tokens and can be wrong. Reserve the model for the fuzzy parts (language, judgment) it uniquely handles.

</details>

## Learn more

- Docs: [Optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence) (caching, batch, model choice)
- Docs: [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) (why agent-loop cost grows with turns)

## Related

- [Latency Budgets & Parallelization](./03-latency-budgets-and-parallelization.md)
- [Architecture: Simplest Thing That Works](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md)
