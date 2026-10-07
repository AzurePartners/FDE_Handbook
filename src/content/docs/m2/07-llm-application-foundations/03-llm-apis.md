---
title: LLM APIs (Requests, Responses, Streaming, SDKs)
row: M2-L1.3
---
**In one sentence:** An LLM API is the web interface your code uses to send a model ID, instructions and messages to a hosted model and get back its reply, token usage and the reason it stopped, all at once or streamed.

## What it is

Chat apps are for people; software calls the API, sending an HTTPS request and reading JSON back. Official SDKs (software development kits: libraries for Python, TypeScript and more) build requests, retry temporary failures and raise typed errors.

Think of an order slip. It names the dish (model ID), the biggest portion allowed (`max_tokens`), standing instructions (system prompt) and the conversation so far (`messages`). Back come the plate, a receipt (token usage) and a note on why the order ended. A waiter who only checks for a plate misses a half portion.

Precisely: Anthropic's Messages API is `POST /v1/messages` with required `model`, `max_tokens` and `messages`, plus optional `system`, `stream` and others. A message's `content` is a string or an array of typed blocks, so images and PDFs travel as `image` and `document` blocks. OpenAI's Responses API (which stores results unless you set `store: false`) and Google's `google-genai` SDK use the same shape.

## Why an FDE needs this

An insurer's script saves model-written summaries of adjuster notes into its claims system. It hard-codes the model ID and reads only `response.content[0].text`. Some summaries stop mid-sentence with nothing logged, a batch crashed on 529 `overloaded_error` responses, and the model retires in 60 days.

An FDE who knows the API finds every truncated summary returned HTTP 200 with `stop_reason: "max_tokens"`, then fixes the code: branch on the stop reason, let the SDK retry, log request IDs and usage, and move the model ID into configuration.

## Key concepts

### One call, read properly

```python
import os, anthropic

client = anthropic.Anthropic()
msg = client.messages.create(
    model=os.environ["LLM_MODEL"],
    max_tokens=1024,
    system="Summarize claim notes.",
    messages=[{"role": "user", "content": notes}],
)
if msg.stop_reason != "end_turn":
    raise RuntimeError(f"{msg.stop_reason} {msg._request_id}")
text = "".join(b.text for b in msg.content if b.type == "text")
```

A thinking or tool block can come first, so read `content` blocks by type; `msg.usage` holds token counts.

### Stop reasons are not errors

A stop reason is part of a successful 200 response. Current Anthropic values include:

| `stop_reason` | Meaning and action |
|---|---|
| `end_turn` | Finished; use the reply |
| `max_tokens` | Hit your ceiling; truncated |
| `stop_sequence` | Hit a stop sequence you set |
| `tool_use` | Wants your code to run a tool |
| `pause_turn` | Server tool loop paused; send it back |
| `refusal` | Declined; discard partial output |
| `model_context_window_exceeded` | Filled the context window; truncated |

OpenAI reports `finish_reason` (`stop`, `length`, `content_filter`, `tool_calls`); Gemini uses `STOP`, `MAX_TOKENS`, `SAFETY` and more. New values appear, so add a default branch.

Errors are 4xx or 5xx responses. Overload (529 `overloaded_error` on Anthropic, 503 on OpenAI and Gemini) usually clears on retry, which the Anthropic and OpenAI Python SDKs do twice by default.

### Streaming

With `stream: true` the API sends server-sent events (SSE) as text is written: `message_start`, `content_block_delta` text chunks, then `message_delta` (stop reason, cumulative usage) and `message_stop`.

```python
with client.messages.stream(model=os.environ["LLM_MODEL"],
                            max_tokens=16000, messages=messages) as stream:
    for chunk in stream.text_stream:
        show(chunk)
    final = stream.get_final_message()  # stop_reason, usage
```

Same tokens, same bill, similar total time: streaming shows words sooner and keeps long requests alive past idle timeouts. But errors can arrive after the 200, and dropped streams are not retried automatically.

### Snapshots, aliases and retirement

A snapshot is a fixed model version; an alias is a pointer the provider moves. Since Claude 4.6, dateless IDs such as `claude-sonnet-4-6` are pinned snapshots, while Gemini `-latest` and undated OpenAI aliases float. Pinned is not permanent: Anthropic gives at least 60 days' notice, then calls fail (`claude-opus-4-1-20250805` retired August 5, 2026).

## Common misconceptions

- **"HTTP 200 means the answer is complete."** Truncated replies and refusals are 200s too.
- **"The answer is `response.content[0].text`."** The first content block may be thinking or a tool call.
- **"A dateless Claude ID always means the newest model."** Since Claude 4.6 those IDs are pinned snapshots; only some aliases float.
- **"Streaming makes the model faster and cheaper."** Same tokens, same bill; the first words just arrive sooner.

## Typical interview questions

<details>
<summary>What goes into an LLM API request, and what comes back?</summary>

A model ID from configuration, an output token ceiling, an optional system prompt and messages with text, image or document blocks. Back come content blocks, usage and a stop reason.

</details>

<details>
<summary>What is the difference between a stop reason and an error?</summary>

An error is a failed request, such as 400 or 529. A stop reason comes with a successful 200 and says why generation ended. Truncation is a 200, so status-only checks ship incomplete answers.

</details>

<details>
<summary>A report generator times out on long documents. How does streaming help?</summary>

Events keep the connection alive past idle timeouts. I use the SDK stream helper, take stop reason and usage from the final message, and handle mid-stream errors.

</details>

<details>
<summary>A script reads only `response.content[0].text`. Why is that fragile?</summary>

The response is a list of content blocks, and the first is not always text: with thinking or tool use it can be a thinking or `tool_use` block. I collect the text blocks and check the stop reason before using the answer.

</details>

## Learn more

- Practice: [Get started with Claude](https://platform.claude.com/docs/en/get-started) (Anthropic, about 15 min)
- Reference: [Stop reasons and fallback](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons) (Anthropic, about 10 min)
- Reference: [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming) (Anthropic, about 15 min)

## Related

- [Tokens and Context Windows](./02-tokens-and-context-windows.md)
- [Message Roles, System Prompts and Conversation History](./04-message-roles.md)
- [Generation Settings (Temperature, Top-p, Max Tokens, Reasoning Effort)](./05-generation-settings.md)
- [Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md)
