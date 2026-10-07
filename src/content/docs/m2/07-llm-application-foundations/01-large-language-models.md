---
title: Large Language Models (LLMs) and Next-Token Prediction
row: M2-L1.1
---
**In one sentence:** A large language model (LLM) is a program trained on huge amounts of text to predict the next small chunk of text, so it writes answers piece by piece from learned patterns instead of looking facts up.

## What it is

Your phone keyboard suggests the next word from what you typed; an LLM does the same at enormous scale. It scores every possible next token (a chunk of text, about 3.5 English characters for Claude), one is picked and appended, and the loop repeats. The pick is usually sampled, not always the top score, so the same prompt can return different wording.

Pretraining on vast text sets the model's weights, the learned values inside (almost always) a transformer network. Post-training (fine-tuning on chosen examples plus reinforcement learning from human feedback) turns that predictor into an instruction-following assistant.

Training happens once, before release. Inference runs that frozen model on each request; nothing users type changes the weights. Its knowledge stops at a cutoff date, and there is no built-in lookup or fact-checking: current or private data reaches the model only through the request or a tool.

## Why an FDE needs this

An insurance broker's assistant looked great in a consumer chat app, then broke when called through the API. Asked whether a policy was in force, it guessed: chat apps quietly add today's date through their own system prompt, but a raw API call has none. Asked about the broker's new "Fleet Plus" product, launched after the cutoff and never public, it fluently described older, similar products. A manager switched to the top tier with deep thinking: slower replies, a bigger bill, the same wrong answers.

The missing piece was data, not intelligence. The FDE put today's date and relevant policy text in every request (later automated with [retrieval](../09-rag-knowledge-bases/01-retrieval-augmented-generation.md) and [tools](../10-tool-calling-deterministic-logic/01-tool-calling.md)) and kept deep thinking for multi-step work.

## Key concepts

### Knowledge cutoff

Anthropic lists two dates per model: a reliable knowledge cutoff and a broader training data cutoff. Claude Haiku 4.5, still current in September 2026, has a February 2025 reliable knowledge cutoff. Read cutoffs from the provider's model page; models misreport their own.

### Model families and tiers

Providers ship families in size tiers that trade capability against speed and price. As of September 2026, Anthropic's lineup runs from Claude Fable 5.1 (most capable) through Opus 5.5 (its recommended starting point) and Sonnet 5.5 to Haiku 4.5 (fastest). Google's Gemini has Pro, Flash and Flash-Lite; OpenAI ships each GPT generation in several sizes; Microsoft Foundry serves Azure OpenAI and Claude models. Lineups change monthly, so read the model ID from configuration and pick tiers by testing your own prompts.

### Reasoning models

A reasoning model works the problem on scratch paper before answering. You pay for the paper: thinking tokens are billed as output even when hidden or summarized, at every major provider. They also delay the first visible word. Anthropic returns only a thinking summary, or nothing. On Claude Opus 5.5 and Fable 5.1 thinking is always on; an effort setting steers how much.

Chain-of-thought prompting (2022) instead asks an ordinary model to "think step by step," which puts the reasoning in the visible reply for your code to separate. Reasoning models, popularized by OpenAI's o1 in September 2024, are trained with reinforcement learning to reason first.

## Common misconceptions

- **"The model looks the answer up, like a search engine."** It predicts from learned patterns; current or private data arrives only via the request or a tool.
- **"It learns from our users' conversations."** Calling a model never retrains it. Behavior changes only with a new model version or deliberate fine-tuning.
- **"It's just fancy autocomplete, so it can't plan."** Prediction is the interface, not the ceiling: Anthropic's March 2025 interpretability research found Claude picking a rhyme first, then writing the line toward it.
- **"The thinking text shows how the model decided."** In an April 2025 Anthropic study, Claude 3.7 Sonnet mentioned a hint it had used only 25% of the time. It is a signal, not an audit log.

## Typical interview questions

<details>
<summary>What is an LLM, and what is next-token prediction?</summary>

A model trained on vast text to predict the next token from everything before it, appending one token at a time in a loop. It generates plausible text instead of looking anything up.

</details>

<details>
<summary>How do training and inference differ, and why does it matter?</summary>

Training sets the weights once, before release; inference runs that frozen model per request. So it never learns the client's policies from use, and current or private data must come in the request or through a tool.

</details>

<details>
<summary>A client's assistant confidently misdescribed last quarter's new product. Why?</summary>

It postdates the knowledge cutoff, so the model wrote a plausible description from similar products. I would supply current product documentation in each request or through a lookup tool, and add test cases for recent products.

</details>

<details>
<summary>A reasoning model doubled the bill without longer answers. Why?</summary>

Hidden thinking tokens are billed as output. I would confirm that in the usage data, then lower the effort or route simple requests to a faster tier, checking quality on real cases.

</details>

## Learn more

- Video: [Large Language Models explained briefly](https://www.youtube.com/watch?v=LPZh9BOjkQs) (3Blue1Brown, about 8 min)
- Reference: [Models overview](https://platform.claude.com/docs/en/models/overview) (Anthropic docs, about 10 min)
- Reference: [Thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) (Anthropic docs, about 20 min)

## Related

- [Tokens and Context Windows](./02-tokens-and-context-windows.md)
- [LLM APIs (Requests, Responses, Streaming, SDKs)](./03-llm-apis.md)
- [Generation Settings (Temperature, Top-p, Max Tokens, Reasoning Effort)](./05-generation-settings.md)
- [Hallucinations and Other Model Output Failures](./06-hallucinations-and-output-failures.md)
- [Tool Forms: CLI, IDE and Agent](../../m1/01-ai-assisted-development/02-tool-forms.md)
