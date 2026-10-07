---
title: Few-Shot Examples
row: M2-L2.2
---
**In one sentence:** Few-shot examples are sample inputs paired with the exact outputs you want, placed in the prompt so the model copies their format, labels and tone without retraining.

## What it is

Instructions tell a model what you want; examples show it. A few-shot example is a worked pair: an input and the exact output you want back. Zero-shot means instructions only, one-shot means one example, and few-shot means several, terms popularized by the 2020 GPT-3 paper.

Think of training a new hire with three filled-in forms instead of a style manual. They copy the layout, wording and category names, including quirks you never meant to teach.

This is called in-context learning: the model picks up the pattern from the prompt alone. Its weights (its learned numbers) do not change and nothing is remembered, so examples travel with every request and cost tokens each time. Fine-tuning changes the weights instead; consider it only when the examples you need no longer fit or cost too much.

## Why an FDE needs this

A regional utility routes customer emails to five queues, from `billing` to `out_of_scope`, and agents see a one-line summary. In the pilot, the instructions-only prompt fails about one reply in ten: the ticketing system rejects "Billing Inquiry" and "Other," and an electrician request lands in `complaint`.

Adding anonymized examples creates new problems. Three of the first five are billing, so the model over-predicts `billing`. Every outage example mentions Elm Street, so outage summaries do too. Then a teammate pastes two emails from the client's evaluation set (the cases that score the app) into the prompt "so the model gets them right." Each is something examples teach by accident.

## Key concepts

### What examples teach

Examples teach the allowed answers and their spelling, the output's shape and length, the tone, and what inputs look like. The label set and format shown matter a great deal (Min and colleagues, 2022), and larger models follow the labels shown, even wrong ones (Wei and colleagues, 2023).

Current models follow instructions well, so examples mostly calibrate format, labels, tone and edge handling. They make valid labels likely, not certain; an `enum` (a list of allowed values) in the output schema enforces them. Keep rules written too: OpenAI's GPT-4.1 guide says behavior shown in examples should also be "cited in your rules."

### Choosing examples

Anthropic asks for examples that mirror the real use case and vary enough to avoid unintended patterns, and suggests 3 to 5 as a starting point.

| Include | Why |
|---|---|
| About one example per label | Avoids over-predicting the majority label |
| One ambiguous or messy input | Shows your tie-break rule |
| One case answered `out_of_scope` | Shows that declining is allowed |
| Varied names, lengths and styles | Only the intended pattern is shared |
| Synthetic or anonymized text | Examples are sent, and often logged, on every call |

### Placing examples

Give examples their own tags and put the live input in a separate labeled block after them. Sending them as earlier user and assistant message pairs also works.

```text
<examples>
<example><email>My bill doubled this month and nothing changed.</email><label>billing</label></example>
<example><email>no power on our street since 6am, 3 houses dark</email><label>outage</label></example>
<example><email>Can you recommend an electrician for my kitchen?</email><label>out_of_scope</label></example>
</examples>
<email>{{customer_email}}</email>
```

### Pitfalls

**Surface copying.** OpenAI warns that models can reuse sample phrases "verbatim." Vary everything except what you want copied.

**Label imbalance and order.** Studies on older models (Zhao and colleagues, 2021; Lu and colleagues, 2022) found a pull toward frequent or last-shown labels, and shifts from order alone. Balance, shuffle and test.

**Eval cases as examples.** Never copy evaluation cases into the prompt. Keep separate pools.

## Common misconceptions

- **"More examples always make the model better."** Gains flatten after a handful while cost rises. OpenAI says reasoning models benefit less; DeepSeek found few-shot degraded R1. Start zero-shot and add examples for observed failures.
- **"Only the format of an example matters."** The model also copies names, phrasing and label proportions.
- **"Good examples are all clean, typical cases."** With only happy paths, the model rarely picks the edge or decline behavior.

## Typical interview questions

<details>
<summary>What is few-shot prompting, and how does it differ from zero-shot and one-shot?</summary>

It puts several worked input and output pairs into the prompt so the model infers the pattern. Zero-shot gives only instructions; one-shot gives one example. Nothing is learned permanently, so examples are resent every call.

</details>

<details>
<summary>What is the difference between an instruction and an example?</summary>

An instruction states the rule and its reason; an example shows a correct output, but not why, so the model may generalize the wrong feature. I write every rule and use examples to calibrate format and tone.

</details>

<details>
<summary>You are building a six-label ticket classifier. How do you choose the examples?</summary>

Anonymized, realistic tickets covering every label evenly, varied in length and tone, including one ambiguous and one decline case, with labels spelled exactly as the system expects. The schema still enforces the label list.

</details>

<details>
<summary>After you added examples, summaries began mentioning "Maria" and billing was over-predicted. Why?</summary>

The examples taught both: "Maria" appeared in several, and billing was the majority label. I would vary names, balance labels, shuffle the order and re-run the evaluation set.

</details>

## Learn more

- Reference: [Prompting best practices: Use examples effectively](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#use-examples-effectively) (Anthropic docs, about 5 min)
- Article: [Few-Shot Prompting](https://www.promptingguide.ai/techniques/fewshot) (Prompt Engineering Guide, about 8 min)

## Related

- [Prompt Structure](./01-prompt-structure.md)
- [Reusable Prompt Templates](./03-reusable-prompt-templates.md)
- [Structured Output and JSON Schema](./06-structured-output.md)
- [Prompt Brittleness and Portability](./07-prompt-brittleness.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../11-ai-evaluation/02-evaluation-sets.md)
