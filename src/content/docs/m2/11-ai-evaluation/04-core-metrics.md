---
title: Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)
row: M2-L5.4
---
**In one sentence:** Core evaluation metrics are the separate numbers an eval run reports (accuracy, completeness, format compliance, refusal behavior, latency and cost), each held to its own threshold agreed with the client.

## What it is

A metric turns an eval run's per-case verdicts into one number with a target. No single number describes an AI feature: an answer can be right but slow, or look safe only because it refuses almost everything.

A vehicle inspection works the same way: brakes, lights and emissions each have a pass mark, and great brakes do not excuse failed headlights.

Anthropic's evaluation guidance asks for a measurable target per criterion, including latency and price. Agree one threshold per metric with the client and ship only when all pass. A weighted total may rank versions that pass every gate, but alone it lets a strong metric hide a failing one.

## Why an FDE needs this

A retailer's support assistant (numbers illustrative) looks up orders with a read-only `get_order` tool. On 300 eval cases, the FDE and client agree targets: 95% accuracy, 100% valid escalation JSON, at most 3% false refusals, p95 time to first token under 2 seconds, under $0.01 per request.

A prompt change adds "be very careful with personal account data." The blended score rises from 86 to 90, yet false refusals on order questions jump from 2% to 14%, failing the gate. A later model upgrade passes every quality gate but doubles cost: hidden thinking tokens bill as output.

## Key concepts

Code can check exact values, IDs, links, tool calls, schemas, refusal flags, timings and tokens. Paraphrased facts, free-text completeness and polite deflections need a calibrated LLM judge or a human.

### Accuracy and tool-call correctness

Accuracy asks whether the answer matches the reference; for labels and values, code normalizes (trim, lowercase) and compares.

Tool-call correctness is accuracy for actions: the right tool, required arguments present, no unexpected ones, and values matching after normalization or in an accepted list. Cases needing no tool must produce no call (the Berkeley Function Calling Leaderboard's "irrelevance" category). Report selection, arguments and false calls separately (multi-step paths are Module 3).

### Completeness and format compliance

Completeness asks whether the answer says everything required. Give each case a checklist, such as deadline, label link and refund method.

Format compliance is the share of outputs that parse and pass schema and text rules. Strict structured outputs can still break on refusals and `max_tokens` cutoffs, and valid JSON can hold wrong values, so check stop reasons.

### Refusal behavior: two rates

Under-refusal is answering what the assistant should decline, such as another customer's order. Over-refusal is declining what it should answer. Label each case should-refuse or should-answer and report the refusal rate on should-refuse cases (target near 100%) and the false-refusal rate on should-answer cases (target low). Refusing everything aces the first, which is why XSTest pairs 250 safe with 200 unsafe prompts.

API flags (Anthropic's `stop_reason: "refusal"`, OpenAI's `refusal` output item) catch only classifier or structured-output refusals. Prose refusals end normally, and pattern checks like promptfoo's `is-refusal` miss polite deflections.

### Latency and cost

Latency is right-skewed, so the mean hides the slow tail. Report p50 (typical) and p95 (the slow 1 in 20). For streamed chat add time to first token (TTFT), timed to the first visible text on thinking models; for JSON checked before use, total time. Disable eval-tool response caches; with 20 cases, p95 is roughly the slowest run.

Cost per request sums `usage` over every call, including tool-loop rounds and retries; report mean and p95. Anthropic's `input_tokens` excludes cached tokens (OpenAI's includes them), and `output_tokens` includes thinking:

```python
# Anthropic SDK; r: prices per million tokens (config)
def call_cost(u, r):
    return (u.input_tokens * r["in"] + u.output_tokens * r["out"]
            + (u.cache_read_input_tokens or 0) * r["cache_read"]
            + (u.cache_creation_input_tokens or 0) * r["cache_write"]) / 1e6
```

## Common misconceptions

- **"One overall score is enough to ship."** A blended score lets a strong metric hide a failing one.
- **"Refusing every harmful prompt means refusals are fine."** Refusing everything does that too. Check false refusals.
- **"Average response time shows how fast it is."** A few slow calls pull the mean up. Report p50 and p95.
- **"Cost follows the answer's length."** Input often dominates, hidden thinking bills as output, and requests can make several calls.

## Typical interview questions

<details>
<summary>What are over-refusal and under-refusal, and how do you measure them?</summary>

Under-refusal answers what it should decline; over-refusal declines what it should answer. I label cases should-refuse or should-answer and report both rates, since either alone can be gamed.

</details>

<details>
<summary>What is the difference between accuracy and completeness?</summary>

Accuracy is whether what it says is right; completeness is whether it says everything required. Stating the refund window correctly but omitting the partial-refund tier is accurate but incomplete.

</details>

<details>
<summary>A client wants one go or no-go score. What do you propose?</summary>

A written threshold per metric, including both refusal rates, p95 latency and cost. Release only when all pass; a weighted total can rank candidates that pass.

</details>

<details>
<summary>After a model upgrade, 0.8% of strict JSON replies fail parsing and cost doubles. Where do you look?</summary>

Stop reasons: failures likely ended in `refusal` or `max_tokens`. For cost, compare `usage` per call for default thinking, a new tokenizer or extra tool-loop calls.

</details>

## Learn more

- Reference: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) (Anthropic, about 30 min)
- Reference: [Assertions and Metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/) (promptfoo docs, about 25 min)
- Reference: [XSTest](https://github.com/paul-rottger/xstest) (GitHub, NAACL 2024, about 10 min)

## Related

- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](./05-rag-evaluation.md)
- [LLM-as-Judge](./07-llm-as-judge.md)
- [Tool Schemas and Tool Design](../10-tool-calling-deterministic-logic/05-tool-design.md)
- [Refusals and Fallbacks](../12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)
- [Tokens and Context Windows](../07-llm-application-foundations/02-tokens-and-context-windows.md)
