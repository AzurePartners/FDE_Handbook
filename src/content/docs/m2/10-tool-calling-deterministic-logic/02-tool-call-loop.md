---
title: The Tool-Call Loop and Tool Traces
row: M2-L4.2
---
**In one sentence:** The tool-call loop is the repeated round trip in which a model requests a tool, your code runs it and returns the result under the call's ID, and a trace records each step.

## What it is

A model never runs anything itself. Like a waiter who cannot cook, when it needs data it hands your code (the kitchen) a numbered ticket: a tool name, JSON arguments and a call ID. The model decides what to call; deterministic software executes the task.

A **round** is one model call plus the tool calls it requested. Rounds repeat, each resending the whole conversation plus new results, until the model answers or your code stops it. A **tool trace** records every round, so tool calls are never a black box.

## Why an FDE needs this

A retailer's support assistant runs `get_order` and `get_refund_status` through a tutorial loop handling only the first tool call. Two-order questions fail with a 400: one of two requested lookups went unanswered. Mistyped order numbers keep the model retrying, uncapped, running up tokens, and logs hold only final replies. The FDE rewrites the loop to answer every call, caps it at 6 rounds with a human-agent fallback, and traces every chat.

## Key concepts

### One round in code

```python
for rnd in range(1, MAX_ROUNDS + 1):
    resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=2048,
                                  tools=TOOLS, messages=messages)
    trace.model_step(rnd, resp)
    if resp.stop_reason != "tool_use":
        return resp                          # final answer or other stop
    messages.append({"role": "assistant", "content": resp.content})  # unchanged
    results = []
    for call in [b for b in resp.content if b.type == "tool_use"]:  # every call
        out, ok = run_tool(call, trace, rnd)  # validate, run, log
        results.append({"type": "tool_result", "tool_use_id": call.id,
                        "content": out, "is_error": not ok})
    messages.append({"role": "user", "content": results})  # one message
return fallback(trace)                       # cap hit: flag the trace
```

### Parallel calls

A model may request several calls in one response. "The API doesn't prescribe an execution order": run independent reads concurrently, dependent or side-effecting ones in order. Every call ID needs a result in the next message, or Anthropic returns a 400 ("tool_use ids were found without tool_result blocks immediately after"), so a skipped call gets an error result like "Not executed: the earlier update failed." Splitting results across messages, Anthropic warns, teaches the model to stop calling in parallel.

### A cap on rounds

A model stuck retrying burns money and time, since each round resends the growing history. A cap bounds that, doubling as a spend limit against OWASP's Unbounded Consumption risk (see [Adding an LLM Endpoint](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)). Defaults differ: Anthropic's SDK tool runner has none unless you set `max_iterations`, OpenAI's Agents SDK stops at 10 turns (model calls), Microsoft.Extensions.AI at 40 iterations. Set yours just above the longest legitimate path.

### Tool traces

One trace ID links every step of a user request. Model steps carry the usual per-call log record; tool steps add round, call ID, tool name, arguments, validation outcome, result or error, and duration. OpenTelemetry's emerging GenAI conventions call this an `execute_tool` span and make arguments and results opt-in as possibly sensitive; redact them per the client's policy.

A refund complaint's trace:

```text
trace 7f3c9a  user: "Any refund pending on A-1043?"
round 1  model  stop=tool_use  get_order(order_id="A-1034")
round 1  tool   get_order  validation=passed  result={status: delivered, refund: null}
round 2  model  stop=end_turn  "No refund is pending."
```

Check each step in order: right tool, arguments, validation, data, faithful answer? The first divergence is the failing step: round 1's arguments (A-1034 is the customer's older order). The FDE fixes the tool description and adds an eval case; deeper failure attribution is Module 3.

## Common misconceptions

- **"The model queries the database itself."** It only emits a request; your code decides whether to run it.
- **"Parallel calls mean the provider runs my tools at once."** The API only returns several requests; your code picks the order.
- **"The loop always ends on its own."** A model can retry a failing call indefinitely, each round resending the history.
- **"A right-looking final answer proves the tools worked."** A reply can claim what no tool did: "Your flight has been booked" with no reservation.

## Typical interview questions

<details>
<summary>What happens, message by message, when a model uses a tool?</summary>

I send the conversation and tools; the reply stops for tool use with ID-tagged calls. I validate and run each, append the reply unchanged plus one message of results matched by ID, and repeat until done or capped.

</details>

<details>
<summary>What is the difference between parallel tool calls and multiple rounds?</summary>

Parallel calls are independent requests answered together. A call needing an earlier result, like orders after finding the customer, waits a round, and each round costs a model call.

</details>

<details>
<summary>What do you log to debug a tool-using assistant later?</summary>

One trace per request, its ID visible to support. Each tool step records call ID, tool, arguments, validation outcome, result or error and duration, with personal data redacted.

</details>

<details>
<summary>How do you pick a round cap, and what happens at the cap?</summary>

Just above the longest legitimate path in traces, not a framework default. At the cap I stop, return a fallback or human handoff, and flag the trace.

</details>

## Learn more

- Course: [Understanding AI Agents through the Thought-Action-Observation Cycle](https://huggingface.co/learn/agents-course/unit1/agent-steps-and-structure) (Hugging Face, about 8 min)
- Reference: [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use) (Anthropic Claude Docs, about 15 min)
- Article: [LLM Observability & Application Tracing](https://langfuse.com/docs/observability/overview) (Langfuse, about 10 min)

## Related

- [Tool Calling (Function Calling)](./01-tool-calling.md)
- [Tool Results and Error Returns](./07-tool-results-and-error-returns.md)
- [Message Roles, System Prompts and Conversation History](../07-llm-application-foundations/04-message-roles.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Full Request Lifecycle](../../m1/02-how-web-apps-run/11-full-request-lifecycle.md)
