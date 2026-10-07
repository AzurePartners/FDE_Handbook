---
title: Context Pollution and Context Rot
row: M2-L2.5
---
**In one sentence:** Context rot is the gradual drop in answer quality as a prompt grows longer; context pollution is the drop caused by irrelevant, stale or conflicting material in it. Neither produces an error.

## What it is

A model uses only its context, the text sent with each request, and more is not always better. Context rot is about quantity: as tokens pile up, the model gets worse at using any one fact, even a relevant one. Context pollution is about content: irrelevant, stale, duplicated or contradictory material pulls it toward a wrong answer. They compound, though a short prompt holding two versions of one policy is polluted too.

Picture a desk holding the contract you need, 300 other papers and last year's version of it. A bigger desk does not help; clearing it does.

Anthropic's docs say it plainly: "As token count grows, accuracy and recall degrade, a phenomenon known as context rot." Overflowing the window returns a 400 error; rot is silent, a normal-looking but less reliable reply that only logs and evals (repeatable quality tests) catch.

## Why an FDE needs this

A bank's lending assistant sends a 250-page credit manual, the applicant's file and the full chat on every request. It demos well, but late in long sessions answers go wrong, with no errors logged. At turn 18 an officer switched the fee schedule from 2025 to 2026; at turn 45 the assistant quoted the 2025 fee. It also answers personal loan questions from a near-identical commercial lending section.

The FDE pulls 40 flagged prompts from logs: input grew from about 12,000 to 190,000 tokens as the pass rate fell. Replaying failures with only the current section and latest requirement fixes most, saving weeks of rewording prompts or waiting for a bigger model.

## Key concepts

### The symptoms

| Symptom | What the logged prompt shows |
|---|---|
| Quality falls with length | Pass rate drops as input tokens or turns rise |
| Distractor | A similar but wrong passage |
| Lost in the middle | The needed fact is present but buried mid-context |
| Changed requirement | Both versions present; the reply uses or blends the old one |

### The published evidence

- **Position:** "Lost in the Middle" (Liu et al., TACL 2024) found 2023 models used facts at the start or end of the input far better than mid-input facts; newer models show weaker effects.
- **Distraction:** one irrelevant sentence sharply cut math accuracy in a 2023 Google DeepMind study, and all 18 models in Chroma's 2025 report degraded well before the window was full.
- **Effective length:** in NoLiMa (ICML 2025), 10 of 12 models claiming 128K tokens or more fell below half their short-input score at 32K.
- **Multi-turn:** Microsoft Research and Salesforce measured a 39% average drop across six tasks when requests arrived in pieces over several turns.

Newer models push the drop later (Anthropic reports 76% for Claude Opus 4.6 on an 8-needle, 1M-token test), but the onset still varies by model and task, so measure it.

### Diagnosing it from logged prompts

```text
1. Pull the exact assembled prompt for each failure, not the template.
2. Bucket pass rate by input tokens, and by turn number for chats.
3. Read the failures: is the fact present, and where? Is there a
   look-alike passage, an older rule or a contradiction?
4. Focused replay: rerun each case with only the needed context.
```

If focused passes and full fails, the context is the cause, not the model. The fixes belong to context engineering.

## Common misconceptions

- **"The window is 1 million tokens, so I can include every document."** Capacity is not usable attention, and effective length is often far shorter.
- **"The model ignores text it doesn't need."** Anthropic's docs state that "irrelevant content degrades model focus."
- **"Quality only drops near the context limit."** It is a gradient starting well before the window is full.
- **"Once the user corrects a requirement, the model uses the new one."** The old version stays in the history and competes with it.

## Typical interview questions

<details>
<summary>What is context rot, and how is it different from exceeding the context window?</summary>

Context rot is the gradual loss of accuracy as the prompt grows, long before the window is full. Exceeding the window is rejected with an error; rot returns a normal-looking, less reliable answer.

</details>

<details>
<summary>What is the difference between context pollution and context rot?</summary>

Rot is about quantity: more tokens make each fact harder to use. Pollution is about content: irrelevant, stale or contradictory material steers the model wrong, even in a short prompt.

</details>

<details>
<summary>A client wants all 400 policy documents in every request, citing a 1M window. How do you respond?</summary>

Capacity is not reliable use, and every call gets slower and costlier. I would run the eval set both ways, full corpus and focused context, and compare accuracy, cost and latency.

</details>

<details>
<summary>How would you prove from logs that the context, not the prompt or model, causes failures?</summary>

Bucket pass rate by input tokens using the exact assembled prompts, then replay each failure with only the needed context. Focused passing where full fails is the proof.

</details>

## Learn more

- Article: [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html) (dbreunig.com, about 10 min)
- Article: [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot) (Chroma Research, about 25 min)
- Article: [LLMs Get Lost In Multi-Turn Conversation](https://www.microsoft.com/en-us/research/publication/llms-get-lost-in-multi-turn-conversation/) (Microsoft Research, about 10 min)

## Related

- [Context Engineering](./04-context-engineering.md)
- [Tokens and Context Windows](../07-llm-application-foundations/02-tokens-and-context-windows.md)
- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Metadata, Filtering and Freshness](../09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md)
