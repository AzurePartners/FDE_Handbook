---
title: Tokens and Context Windows
row: M2-L1.2
---
**In one sentence:** A token is the chunk of text a language model reads and writes, and the context window is the fixed number of tokens one request can hold, including the model's reply.

## What it is

A language model does not read words or letters. Its tokenizer (usually byte pair encoding) splits text into tokens: a common word, part of a rare word, a digit group or punctuation. Providers meter, price and limit everything in tokens.

Think of a fridge-magnet poetry kit. Common words like "refund" have their own magnet, but an order ID is spelled out of small fragments, and you pay per magnet. English prose averages about 4 characters, or 0.75 words, per token. Code, numbers, IDs and many non-English languages need more.

The context window is the model's working memory for one request, not its training data. It is one fixed token budget shared by the system prompt, history, documents, images, tool definitions, tool results and the reply, including any reasoning ("thinking") the model writes first.

## Why an FDE needs this

A logistics client wants an assistant that drafts support replies from tickets, pretty-printed JSON order history and customs PDFs. A pilot on short English tickets looks excellent, so finance budgets "words x 1.33" tokens. In production, tickets with a 40-page PDF fail with HTTP 400 "prompt is too long". The bill overshoots: Arabic and Hindi text, IDs and JSON cost more tokens than English, output costs more than input, and a model upgrade changed the tokenizer.

The fix is to measure, not guess: count tokens on real tickets per language, log usage per call, and check size before sending.

## Key concepts

### Different text, different token counts

Counts from one OpenAI tokenizer (`o200k_base`):

| Text | Tokens |
|---|---|
| A 59-character English support sentence | 10 |
| The same sentence in German, in Hindi | 20, 19 |
| `2026-09-29`, `ORD-2026-000481` | 6, 7 |
| A 36-character UUID | 18 to 36 |
| 20 order rows as CSV, compact JSON, pretty-printed JSON | 294, 460, 720 |

Counts do not transfer between models: Claude 4.7 and later produce about 30% more tokens than earlier Claude models for the same text. Recount after any model change.

### Input, output and the usage field

Input and output are priced separately per million tokens, and output costs more (as of September 2026, Claude Haiku 4.5 lists $1 input and $5 output). Thinking tokens bill as output. Images and PDFs count too: on Claude, a 1000x1000 image is 1,296 tokens, and a PDF page about 1,500 to 3,000 text tokens plus image tokens.

```python
# Anthropic Python SDK
req = dict(model=os.environ["LLM_MODEL"], messages=messages)

print(client.messages.count_tokens(**req).input_tokens)  # free estimate
resp = client.messages.create(max_tokens=1024, **req)
print(resp.usage.input_tokens, resp.usage.output_tokens)  # billed
```

The `usage` field is the source of truth; OpenAI and Gemini have similar endpoints.

### One budget, and overflow

The app resends the whole conversation every turn, so input keeps growing. Many flagship models offer about 1 million tokens (check each model's docs). That is a ceiling, not a target: accuracy degrades as context grows.

If the input alone exceeds the window, Anthropic returns 400 "prompt is too long" (a 413 is about bytes, not tokens). OpenAI's Responses API also returns a 400 unless you set `truncation: "auto"`, which silently drops the oldest items, instructions included.

## Common misconceptions

- **"A token is basically a word."** Tokens are subword pieces: a date can be 6 tokens and a UUID up to 36, so count rather than convert.
- **"The reply doesn't use the context window."** Input and output share one budget, so the reply, thinking included, must fit too.
- **"One tiktoken count works for any model."** `tiktoken` is OpenAI's tokenizer; each model family has its own. Count with the provider's endpoint for the exact model.
- **"If I send too much, the model reads the part that fits."** By default, the Anthropic and OpenAI APIs reject oversized input with a 400. Silent truncation is opt-in, or a chat-app behavior.

## Typical interview questions

<details>
<summary>What is a token, and why do providers price usage in tokens?</summary>

A token is the chunk of text the model processes, such as a word, word fragment or digit group. Compute scales with tokens, so providers meter input and output separately and cap requests in tokens.

</details>

<details>
<summary>What is the difference between a context window and a tokens-per-minute limit?</summary>

The window caps one request; exceeding it returns a 400 that no retry fixes. A tokens-per-minute limit caps throughput across requests and returns a 429 that waiting and retrying fixes.

</details>

<details>
<summary>A client wants answers over 300-page contract PDFs. How do you check fit and cost?</summary>

Count real samples with the provider's endpoint for the exact model; each PDF page costs thousands of tokens. Compare totals to the window, leaving reply room, and price input and output separately. If it barely fits or costs too much, use retrieval.

</details>

<details>
<summary>Long-time chat users get "prompt is too long" but new users never do. Why?</summary>

The app resends the full history every turn, so long conversations outgrew the window. Confirm by logging `usage.input_tokens` per turn, then add a pre-flight check that reserves reply room, a plan for trimming old turns, and a clear fallback.

</details>

## Learn more

- Interactive: [OpenAI Tokenizer](https://platform.openai.com/tokenizer) (OpenAI, about 10 min)
- Reference: [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) (Anthropic, about 12 min)
- Reference: [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting) (Anthropic, about 10 min)

## Related

- [LLM APIs (Requests, Responses, Streaming, SDKs)](./03-llm-apis.md)
- [Message Roles, System Prompts and Conversation History](./04-message-roles.md)
- [Context Engineering](../08-prompting-context-structured-output/04-context-engineering.md)
- [Context Pollution and Context Rot](../08-prompting-context-structured-output/05-context-pollution.md)
- [Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md)
