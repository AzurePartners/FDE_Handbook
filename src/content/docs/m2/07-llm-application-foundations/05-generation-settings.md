---
title: Generation Settings (Temperature, Top-p, Max Tokens, Reasoning Effort)
row: M2-L1.5
---
**In one sentence:** Generation settings are the per-request dials that shape a model's reply: how random its word choices are, how long it may run, where it stops, and how much it thinks first.

## What it is

A model picks each next token (a small chunk of text) by a weighted draw, like a raffle where likely words hold more tickets, so the same question can come back worded differently. **Temperature** sets how lopsided the tickets are: low values favor the top choice, high values give long shots a chance. **Top-p** (nucleus sampling) keeps only the smallest set of candidates whose probabilities add up to p, such as 0.9.

**Max output tokens** caps what one call may generate. **Reasoning effort** is soft guidance on how much hidden thinking a reasoning model does; older APIs used a fixed **thinking budget** in tokens.

Even temperature 0 is not fully deterministic: how a busy server batches your request with others changes tiny rounding, so near-tied tokens can flip. Seeds (OpenAI Chat Completions beta, Gemini) are best effort; Anthropic has none.

## Why an FDE needs this

A furniture retailer's email triage used `temperature=0`, `top_k=1` and `max_tokens=150`. After a model upgrade, every call returned HTTP 400: the new model rejects non-default sampling. Deleting those fields stopped the errors, but 3 percent of tickets became "uncategorized". Thinking, always on for this model, used all 150 tokens on long emails, leaving `stop_reason: "max_tokens"` and no text.

The FDE set effort to low, raised the cap and treated any stop other than `end_turn` as a failure. An email flipping between `damaged_item` and `billing` really contained both issues: that needs a precedence rule, not temperature 0.

## Key concepts

### Sampling controls and model support

Low temperature makes the likeliest answer more consistent, not more correct. Ranges differ (Anthropic 0 to 1, OpenAI 0 to 2), and OpenAI advises changing temperature or top-p, not both. **Top-k** keeps only the k likeliest tokens.

Support is per model; check the docs. As of September 2026, Anthropic has deprecated all three: Claude Opus 4.7 and later, Sonnet 5 and later, and Fable and Mythos models return HTTP 400 on non-default values; Sonnet 4.6 and Haiku 4.5 accept them without thinking. Microsoft lists them as unsupported on OpenAI reasoning models; GPT-6 models accept them only at reasoning effort none, which not every GPT-6 model offers. Google advises keeping Gemini 3 at 1.0 to avoid looping.

### Max output tokens

The cap is a ceiling, not a length target. On reasoning models it covers thinking plus the answer (thinking is billed as output even when hidden). Hitting it still returns HTTP 200:

| API | Cap field | Truncation signal |
|---|---|---|
| Anthropic | `max_tokens` | `stop_reason: "max_tokens"` |
| OpenAI Responses | `max_output_tokens` | `status: "incomplete"` |
| OpenAI Chat Completions | `max_completion_tokens` | `finish_reason: "length"` |

Leave headroom: Anthropic suggests 64k at `xhigh` or `max` effort; Microsoft, at least 25,000 while learning a workload.

### Reasoning effort

Effort sets how hard a reasoning model works, not an exact token count. Names and defaults vary (Anthropic `low` to `max`; OpenAI adds `none` and `minimal`; Gemini's `thinking_level` runs `minimal` to `high`), so set it explicitly. Anthropic rejects the older `budget_tokens` from Claude 4.7 on.

Picture an exam: effort is how much rough work you encourage, max tokens is the pages handed out, and rough work shares those pages.

```python
msg = client.messages.create(
    model=os.environ["LLM_MODEL"],
    max_tokens=4096,                  # thinking plus the JSON
    output_config={"effort": "low"},  # no temperature (rejected)
    messages=[{"role": "user", "content": email}],
)
if msg.stop_reason != "end_turn":
    flag_for_review(msg.stop_reason, msg.usage)
```

### Stop sequences

A stop sequence ends generation at a chosen string (Anthropic: `stop_reason: "stop_sequence"`). For output shape, prefer structured output.

## Common misconceptions

- **"Temperature 0 makes the model deterministic."** Server batching and rounding can still flip near-ties.
- **"Lower temperature means fewer hallucinations."** It buys consistency, not correctness; accuracy comes from context and validation.
- **"`max_tokens` sets the answer length."** It is a ceiling that cuts the reply off, even mid-JSON.
- **"Maximum effort always gives the best result."** It costs tokens and time, and can overthink simple tasks.

## Typical interview questions

<details>
<summary>What do temperature and top-p actually do?</summary>

The model assigns next-token probabilities and samples one. Temperature reshapes them: low concentrates on top choices, high spreads to unlikely ones. Top-p samples only from the smallest set adding up to p.

</details>

<details>
<summary>How do max output tokens and reasoning effort differ?</summary>

Max output tokens is a hard ceiling on everything generated, thinking included; hitting it truncates. Effort is soft guidance on how much to think. After a max-tokens stop, I raise the cap if the reasoning was needed, or lower effort.

</details>

<details>
<summary>A stakeholder wants temperature 0 because answers vary. What do you say?</summary>

Temperature 0 is not guaranteed identical, and many current models reject it. Consistency is not correctness: variation usually signals ambiguous input or vague instructions. I would tighten instructions, add validation and measure agreement across repeated eval runs.

</details>

<details>
<summary>After a model upgrade, some replies are empty with HTTP 200. Why?</summary>

Thinking likely used up the output cap. I would confirm via stop reason and usage, raise the cap or lower effort, and treat any incomplete stop as a failure.

</details>

## Learn more

- Article: [How to generate text: using different decoding methods for language generation with Transformers](https://huggingface.co/blog/how-to-generate) (Hugging Face, about 15 min)
- Reference: [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) (Anthropic docs, about 13 min)
- Reference: [Steering thinking](https://platform.claude.com/docs/en/build-with-claude/thinking-steering-and-cost) (Anthropic docs, about 9 min)

## Related

- [Large Language Models (LLMs) and Next-Token Prediction](./01-large-language-models.md)
- [LLM APIs (Requests, Responses, Streaming, SDKs)](./03-llm-apis.md)
- [Hallucinations and Other Model Output Failures](./06-hallucinations-and-output-failures.md)
- [Chat Behavior vs System Reliability](./07-chat-vs-system-reliability.md)
- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
