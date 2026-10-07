---
title: Refusals and Fallbacks
row: M2-L6.7
---
**In one sentence:** A refusal is the designed reply when a request is out of bounds, and a fallback is the designed reply when something breaks; both give a short reason and a next step.

## What it is

When an assistant does not answer, either it should not (a refusal: the request breaks boundaries agreed with the client) or it cannot (a fallback: the model is overloaded, a lookup is down or the output is unusable). Either way the user reads something, so design it.

Think of a pharmacist: "Not without a prescription, but your doctor can write one." One short reason, no lecture, a way forward.

Providers also use "fallback" for retrying a refused request on another model, but outages still reach your app. Here it means what the user is told and offered.

## Why an FDE needs this

A car insurer's claims-status bot fails three ways in week one. Out-of-scope rental-car questions get "I can't help with that," so customers rephrase, then phone in. When the claims lookup times out, the model invents "Your claim should be settled soon." A safety classifier cuts off an answer mid-stream; the screen keeps half a sentence plus the refusal, and the next message fails because the refused turn stays in history.

The error dashboard shows nothing: every response was HTTP 200. (Illustrative scenario.)

## Key concepts

### The response ladder

| Rung | Use when | Example |
|---|---|---|
| Answer | In scope and backed by data | "Approved on September 3." |
| Answer with a caveat | A named uncertainty should change what the user does | "Today's payments may not show yet." |
| Clarifying question | Ambiguous, and a wrong guess is costly | "Claim 4471 or 4478?" |
| Escalate | A person should take over (see Related) | "Passing you to a claims handler." |
| Refuse | Outside the agreed boundaries | Template below |

Pick the least restrictive rung that stays in bounds.

### Refusal wording

```text
Bad:  As an AI model, I am not permitted to give coverage
      advice. It is important to consult a professional.
Good: I can't answer coverage questions here. Your policy documents
      are at [link], or I can connect you with an agent.
```

OpenAI's Model Spec prefers a "Safe Complete" (say briefly why, then give the safe help that remains) and says refusals "should never be preachy". Anthropic's constitution has Claude always say what it cannot help with, even without saying why, so users can go elsewhere, and point to emergency services when a life is at risk. Keep reasons generic around fraud or security checks.

### Fallback messages

If the model stays overloaded after retries, a lookup is down or output fails repair, send a fixed message, never a model answer from memory: "I can't reach the claims system, so I can't give a status. Your claim number is saved. Try again soon or call [number]."

Follow GOV.UK's service-problem pattern: plain words (no "500"), what happened to the user's input, and another route. Serving cached answers in a degraded mode builds on [Caching](../../m1/06-reliability-scale/08-caching.md).

### Detecting and logging

Refusals arrive as flags on successful responses (Anthropic's `stop_reason` `"refusal"`, OpenAI's `refusal` field or `content_filter`, Gemini's `SAFETY`), as exceptions (an OpenAI Agents SDK guardrail tripwire) or as plain prose. Map each to a template:

```python
if msg.stop_reason == "refusal":     # HTTP 200, not an error
    log_event("refusal", msg._request_id, msg.stop_details.category)
    history.pop()                    # drop the refused turn
    return TEMPLATES["refusal"]      # replaces any partial text
```

Never parse Anthropic's unstable `explanation` text. Log refusals and fallbacks as their own events (for rates, see Related).

## Common misconceptions

- **"Refusing is always the safe choice when in doubt."** Dead ends make users rephrase, trick the bot or phone in; Anthropic's constitution says unhelpfulness is never trivially "safe".
- **"A good refusal explains the policy in detail."** One short reason and a next step; more reads as a lecture.
- **"If a lookup fails, let the model answer anyway."** It sounds just as confident and is often wrong.
- **"Error monitoring will catch refusals."** Most arrive as successful responses or ordinary prose.

## Typical interview questions

<details>
<summary>What is the difference between a refusal and a fallback?</summary>

A refusal declines an out-of-bounds request on purpose. A fallback covers failures: overloads, tool timeouts, invalid output. Both need a reason and a next step. I log them separately: refusals go to policy review, fallbacks to bug fixing.

</details>

<details>
<summary>When would you ask a clarifying question instead of answering with a caveat?</summary>

When the request is ambiguous and a wrong guess is costly. A caveat fits when I can answer and one uncertainty should change the user's action.

</details>

<details>
<summary>Vector search times out mid-conversation. What should the user see?</summary>

Never a model answer from memory. After retries fail, a fixed message: search is unavailable, try again shortly or use the service desk. Log a fallback event.

</details>

<details>
<summary>Chat shows half an answer plus "I can't help with that," then the next message fails. Why?</summary>

A classifier stopped the stream, the UI appended the refusal to the partial text, and the refused turn stayed in history. Replace the partial text with the template, drop the turn and log the refusal.

</details>

## Learn more

- Reference: [There is a problem with the service pages](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/) (GOV.UK Design System, about 5 min)
- Reference: [OpenAI Model Spec: be helpful when refusing](https://model-spec.openai.com/2026-08-18.html#refusal_style) (OpenAI, about 10 min)

## Related

- [Content Boundaries and Sensitive Requests](./02-content-boundaries.md)
- [Escalation Paths and Human Takeover](./08-escalation-and-human-takeover.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](../11-ai-evaluation/04-core-metrics.md)
