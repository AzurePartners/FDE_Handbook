---
title: Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)
row: M2-L1.8
---
**In one sentence:** A programmatic LLM interface turns a plain-language task, like "classify this email," into an ordinary function with checked inputs, one output shape, named errors, capped retries and a log record per call.

## What it is

A prototype model call is text in, text out, which other software cannot depend on. A programmatic interface wraps it in a normal function, such as `triage_request(req) -> TriageResult`, that callers treat like any other code.

Think of an intake clerk who returns a bad form with a note naming the wrong box, not "do better," moves it to a "needs a person" tray after two returns, and logs every form in a ledger.

Precisely, it has five parts: checked inputs, one output type, named errors, a repair loop (feed the validation error back, cap attempts, then return an explicit fallback) and a per-call log record.

## Why an FDE needs this

A property manager wants tenant repair emails triaged (urgency, trade, unit) into its work-order system. The prototype runs `json.loads` on the reply and inserts a row. In week one, a long forwarded thread hits the output limit and the cut-off JSON crashes the nightly batch. A catch-all handler sets urgency to "routine," so a real emergency waits. Nobody knows how often: the only log line is "processed 212 emails."

The FDE rebuilds it with named errors, two repairs and a `needs_review` fallback. Within a week, call records trace most fallbacks to one prompt version and truncated threads, something no blind retry reveals.

## Key concepts

### Inputs, output and named errors

Python ignores type hints at runtime, so validate input explicitly (a Pydantic model or `validate_call`). Return one type with a `status` field. Name each failure:

- `InputInvalid`: rejected before any tokens are spent.
- `ModelUnavailable`: connection, 429 or 5xx errors outlasting the SDK's own retries.
- `OutputTruncated`: stop reason `max_tokens`; raise the budget or shorten the input.
- `ModelRefused`: a refusal, sent as HTTP 200; route to another model or a person.

Catch typed SDK exceptions, not message strings. Truncation and refusals skip repair; Anthropic notes a refused request resent to the same model usually gets refused again.

### The repair loop

```python
MAX_REPAIRS = 2  # validation retries, not the SDK's max_retries

def triage_request(req: MaintenanceRequest) -> TriageResult:
    msgs = [{"role": "user", "content": render_prompt(req)}]
    for attempt in range(1 + MAX_REPAIRS):
        resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=800,
                                      messages=msgs, output_config=OUTPUT_CONFIG)
        check_stop_reason(resp)         # raises OutputTruncated or ModelRefused
        result, error = validate(resp)  # the Structured Output validator
        if result:
            return result
        msgs += [{"role": "assistant", "content": resp.content},  # unmodified
                 {"role": "user", "content": f"Failed validation: {error}. Fix it."}]
    return TriageResult(status="fallback", urgency="needs_review")
```

Self-correction works best with concrete external feedback (Kamoi et al., TACL 2024), such as a validator's message. Cap repairs at one to three, because retries multiply: the Anthropic and OpenAI Python SDKs retry transient errors twice by default (Google's `google-genai` only when configured), so three attempts can mean nine HTTP requests.

### The per-call log record

Refusals, truncation and failed validation arrive as HTTP 200s, invisible to error-rate monitoring. One record per call makes them countable:

```json
{"fn": "triage_request", "prompt_version": "triage-v7",
 "model_requested": "<LLM_MODEL>", "model_served": "<response.model>",
 "request_ids": ["req_01...", "req_01..."], "input_tokens": 3120, "output_tokens": 180,
 "latency_ms": 6400, "stop_reasons": ["end_turn", "end_turn"],
 "validation": ["trade_not_allowed", "pass"], "repairs": 1, "fallback": false}
```

Log the model served (aliases and fallbacks differ), each attempt's request ID, and end-to-end latency including retries; unknown values are null, not zero. OpenTelemetry's GenAI conventions (still in Development) offer standard names like `gen_ai.request.model` and advise against logging prompt text by default.

## Common misconceptions

- **"Strict mode means I can skip validation."** Anthropic guarantees the schema only "in most cases," and nothing checks that a unit number is real.
- **"If validation fails, resend the same prompt."** An identical request often fails identically; feed back the specific error.
- **"More retries mean more reliability."** Each repair resends the whole conversation, adding cost and latency; frequent repairs signal a prompt bug.
- **"A sensible default is a fine fallback."** One that looks real ("routine," 0) flows downstream as a model answer. Make it explicit and logged.

## Typical interview questions

<details>
<summary>What is a programmatic LLM interface?</summary>

An ordinary function wrapping the model call, like `classify_ticket(text) -> TicketLabel`, with checked inputs, one output type, named errors, a capped repair loop ending in a fallback, and a log record per call.

</details>

<details>
<summary>How does a transport retry differ from a repair retry?</summary>

A transport retry resends the same request after the call failed, such as a 429, usually inside the SDK. A repair retry follows a successful call with invalid output, sending back the reply plus the error.

</details>

<details>
<summary>Design an email classifier for a client's finance inbox.</summary>

Validated input (sender, subject, body); output with `status`, a closed category list and a vendor ID checked against the vendor master; the four named errors; two repairs, then `needs_review`, never "other"; one log record per call.

</details>

<details>
<summary>After a deploy, one call in ten returns the fallback. How do you investigate?</summary>

Group fallback records by prompt version, model served, stop reason and validation error, and compare with last week: mostly `max_tokens` means longer replies, one dominant rule a broken field, a new served model a moved alias.

</details>

## Learn more

- Article: [Factor 9: Compact Errors into Context Window](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-09-compact-errors.md) (HumanLayer, about 5 min)
- Reference: [Validation and Reasking](https://python.useinstructor.com/concepts/reask_validation/) (Instructor, about 15 min)
- Reference: [Python SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python) (Anthropic, about 15 min)

## Related

- [Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Retries and Backoff](../../m1/06-reliability-scale/03-retries-and-backoff.md)
- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Adding an LLM Endpoint to an Existing Service](./09-adding-an-llm-endpoint.md)
- [Logs and Stack Traces](../../m1/04-git-debugging-testing-security/05-logs-and-stack-traces.md)
