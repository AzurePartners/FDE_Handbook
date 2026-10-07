---
title: Tool Results and Error Returns
row: M2-L4.7
---
**In one sentence:** A tool result is what your code sends back to the model after a tool runs or is rejected, and it must say clearly whether the tool succeeded, found nothing or failed, and what to do next.

## What it is

The model never sees your database or the exception your code caught. It sees only what your code returns, tied to the call's ID, and picks its next move from that.

Think of a warehouse picker's slip. "Picked 3 of 3 from bin A12" is a success. "Item 4471 not stocked, 0 on hand" is an honest empty answer. "Scanner offline, retry in 5 minutes" is an error with a next step. Tool results should be one of those three, never a blank slip or a debug printout.

## Why an FDE needs this

At a retailer, an FDE traces three assistant incidents to tool results. `get_order` returns the full 80-field ERP row, so the model repeats an internal "flagged for chargeback abuse" note to a customer. `get_orders` returns an empty string, and the model invents "your order is on its way". `cancel_order` swallows a payment-gateway timeout and returns `False`, so the model confirms a cancellation that never happened. A traceback with the database hostname reaches the chat. No prompt change fixes any of this.

## Key concepts

### Small results with IDs and sources

Return only the fields the next step needs, plus the stable ID a follow-up call would use and a source and as-of reference for tracing. Anthropic's docs warn that "bloated responses waste context and make it harder for Claude to extract what matters."

```json
{"order_id": "A-1042", "status": "shipped", "shipped_on": "2026-09-20",
 "source": "erp:orders/A-1042", "as_of": "2026-09-29T10:14Z"}
```

### Empty is not an error

Empty means the tool worked and the answer is "none", so send a normal result that echoes the query: `{"orders": [], "count": 0, "customer_id": "C-77"}`. An error means the tool could not answer. A blank string or bare `false` blurs the two, so the model may call an outage "nothing found" or guess.

### The error payload

Write errors as guidance: Anthropic advises saying "what went wrong and what Claude should try next." Include a flag, the problem, the fix and whether retrying helps.

```json
{"error": {"code": "ORDER_ALREADY_SHIPPED",
  "message": "Order A-1042 shipped on 2026-09-20 and cannot be cancelled.",
  "fix": "Offer a return with start_return(order_id).",
  "retryable": false}}
```

A timeout is retryable (after your code's own transport retries); a business-rule rejection is not. A failed write must say so ("Cancellation not confirmed; nothing was changed"). `retryable` is a team convention, not a provider field.

| Provider | Result sent as | Error signal |
|---|---|---|
| Anthropic | `tool_result` with `tool_use_id` | `is_error: true` |
| OpenAI Responses | `function_call_output` with `call_id` | None, so write it into `output` |
| Google Gemini | `FunctionResponse` with matching `id` | `error` key in `response` |

MCP (Module 4) uses `isError: true`.

### Size limits without leaks

Filter and paginate with sensible defaults. When you truncate, say so and explain how to narrow the query. For big artifacts, return a reference: Claude Code saves an MCP result over its default 25,000-token cap to a file and leaves the path.

Never send stack traces or raw exception text, which can expose hostnames, paths or keys (CWE-209, in OWASP Top 10:2025 A10). Send a short safe message and log the detail under the trace ID. Defaults vary: Microsoft.Extensions.AI sends only "Error: Function failed.", while some SDKs pass the exception message.

### Capping attempts

Claude often retries an invalid call two or three times, but that is not a guarantee. Enforce a cap in code, such as three consecutive tool errors (Microsoft's default), then fall back or hand over to a person. Treat results as data, never instructions.

## Common misconceptions

- **"Return the whole record; more data can only help."** Extra fields cost tokens, bury the answer and can expose internal notes.
- **"The stack trace helps the model debug."** It gives the model nothing to act on and can leak internals.
- **"The model will stop retrying on its own."** Without a cap in code, an agent can loop on one failing call and burn cost.

## Typical interview questions

<details>
<summary>What should a tool send back to the model after it runs?</summary>

A short, structured result tied to the call's ID: key values, stable record IDs and a source or as-of reference. If it failed, a flagged error instead.

</details>

<details>
<summary>What is the difference between an empty result and an error?</summary>

Empty means the tool worked and the answer is "none": a normal result that echoes the query. An error means it could not answer, so it is flagged (`is_error` on Claude, an error object on OpenAI and Gemini).

</details>

<details>
<summary>Your `cancel_order` tool hits a payment-gateway timeout. What do you return?</summary>

A flagged error: cancellation not confirmed, nothing changed, `retryable: true`. Never `False`, which the model reads as success. The attempt cap bounds further tries.

</details>

<details>
<summary>Your assistant leaked an internal fraud note and a stack trace. What went wrong?</summary>

The tools returned a full record and raw exception text. I would allow-list fields, map exceptions to safe messages, log full detail under the trace ID and check framework defaults.

</details>

## Learn more

- Reference: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) (Anthropic Claude Docs, about 15 min)
- Article: [Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Anthropic Engineering, about 25 min)

## Related

- [The Tool-Call Loop and Tool Traces](./02-tool-call-loop.md)
- [Tool Argument Validation](./06-tool-argument-validation.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Diagnosing Integration Failures: Auth, Network, Format, Logic](../../m1/03-apis-data-integration/07-diagnosing-integration-failures.md)
- [Prompt Injection and Jailbreaks](../12-safety-guardrails-hitl/04-prompt-injection.md)
