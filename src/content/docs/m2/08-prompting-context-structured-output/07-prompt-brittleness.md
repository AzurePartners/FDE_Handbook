---
title: Prompt Brittleness and Portability
row: M2-L2.7
---
**In one sentence:** A brittle prompt works where it was written but fails when the wording, model, inputs or context change; a portable prompt keeps behaving the same across those changes, and only testing shows which you have.

## What it is

Every prompt is tested in one setting: one model, one phrasing, one arrangement of context and a few inputs its author picked. A prompt is brittle when a change to that setting, one nobody expected to matter, makes results worse. A portable prompt keeps working across models, providers and real inputs.

A recipe that says "bake for 20 minutes" burns in a hotter oven; "bake until golden" works in any oven because it states the goal. A portable prompt likewise states the goal, each rule's reason and what a correct answer looks like.

Brittleness is systematic: output shifts because the setting changed. That differs from run-to-run variation caused by sampling and from a one-off hallucination.

## Why an FDE needs this

A logistics client's tool flags urgent customer emails. Its prompt was tuned on a dozen hand-picked English emails and one model snapshot (a fixed, dated model version), and the demo was flawless. Within a month the snapshot is due for retirement, Spanish emails from the Mexico office arrive, and an integration starts passing whole reply threads.

On the replacement model, "CRITICAL: ALWAYS mark urgent if the customer mentions a delay" catches delays quoted in old replies, flooding the urgent queue. Emails about a "retraso" (Spanish for delay) are missed. The newest message now sits at the bottom of each thread, where the prompt assumed it came first. Prefill (pre-writing the reply's opening `{`) now returns a 400 error. Every failure traces to an unwritten assumption, and the FDE must work out which change caused which.

## Key concepts

### What triggers brittleness

| Trigger | Example |
|---|---|
| Wording or format | A rephrased rule, new separators, reordered examples |
| New model or provider | Literal reading, stale tricks, new defaults |
| Unfamiliar inputs | Long threads, other languages, typos, hostile users |
| Added or reordered context | Instructions moved below the documents |
| Unstated assumptions | "Exclude irrelevant details," with "irrelevant" undefined |

Studies on 2021 to 2024 models found meaning-preserving format changes swinging accuracy by tens of points; larger models are more robust (ProSA, 2024) but not immune. Deliberate attacks are covered under prompt injection.

### Why new models break old prompts

- **Literal reading.** Newer models infer less. OpenAI's GPT-4.1 guide (2025) warned that "implicit rules are no longer being as strongly inferred."
- **Overcorrection.** Claude Opus 4.5 and 4.6 may "overtrigger" on "CRITICAL: You MUST use this tool when..." (Anthropic).
- **Stale tricks.** Asking a reasoning model "to reason more may actually hurt the performance" (OpenAI).
- **Request changes.** Claude models from 4.6 on reject prefill; OpenAI's default reasoning effort fell from medium (GPT-5) to none (GPT-5.1).

### Habits that transfer

Write for "a brilliant but new employee who lacks context on your norms" (Anthropic): define terms, scope each rule, give its reason and cover off-topic input. Use platform features (structured output, effort settings) instead of tricks, and keep provider settings in configuration.

```text
Before: CRITICAL: ALWAYS mark urgent if the customer mentions a delay.
After:  Mark urgent only if a delivery due within 48 hours is at risk,
        because urgent emails page the on-call team. Judge only the newest
        message, in English or Spanish; ignore quoted history.
```

### Why "it works on my examples" is not evidence

Those examples share their author's assumptions and ran in one setting. Five passes out of five still allow a failure rate near 45%. Evidence is a varied evaluation set run in every setting the prompt will face.

## Common misconceptions

- **"A newer, smarter model will handle my prompt fine."** Newer models read more literally and change defaults. Re-run your evaluation set first.
- **"If the meaning is the same, wording can't matter."** Studies found large swings from formatting alone, and vendors still call recent models prompt-sensitive.
- **"Portability just means the prompt text works elsewhere."** Prefill, sampling settings, tool options and token counts differ by model, so the whole request must port.

## Typical interview questions

<details>
<summary>What is prompt brittleness?</summary>

A prompt is brittle when a change nobody expected to matter, such as new wording, a new model, unfamiliar inputs or reordered context, makes results worse.

</details>

<details>
<summary>How is brittleness different from run-to-run variation?</summary>

Run-to-run variation comes from sampling: the identical call returns different outputs. Brittleness is systematic: the output shifts because wording, model or inputs changed, found by varying them on purpose.

</details>

<details>
<summary>The model snapshot retires in 60 days. How do you move the prompt?</summary>

I switch only the model, keep the prompt identical and run the evaluation set to isolate the model's effect. I check request changes such as removed prefill, then fix regressions one change at a time.

</details>

<details>
<summary>A one-word change fixed three failing examples. Do you ship?</summary>

Not yet. Three examples chosen by the fix's author prove little, and a one-word flip is itself a sign of brittleness. I would find the ambiguous instruction behind it and run the evaluation set before and after.

</details>

## Learn more

- Article: [Best practices for prompt engineering for 2026](https://claude.com/blog/best-practices-for-prompt-engineering) (Claude by Anthropic, about 15 min)
- Reference: [Prompting best practices: Migration considerations](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#migration-considerations) (Anthropic, about 10 min)
- Reference: [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) (OpenAI, about 20 min)

## Related

- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Few-Shot Examples](./02-few-shot-examples.md)
- [Prompt Versioning and Experimentation](./08-prompt-versioning.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../11-ai-evaluation/02-evaluation-sets.md)
- [Regression Testing for Prompts, Models, Tools and Data](../11-ai-evaluation/08-regression-testing.md)
