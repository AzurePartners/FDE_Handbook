---
title: Tool Schemas and Tool Design
row: M2-L4.5
---
**In one sentence:** A tool definition is the name, description and parameter schema a model reads to decide when and how to call your code, and good tool design makes those calls hard to get wrong and easy to test.

## What it is

A model never sees the code behind a tool, only its definition: a name, a plain-text description and a JSON Schema giving each input's name, type and meaning (see Related). Anthropic: "Claude never sees your implementation."

It is like a form filled in by a temp who never sees the back office: clear labels, checkboxes and "for refunds, use form B" decide whether it comes back right.

Every major provider sends these three parts to the model as prompt text, billed on every request. Tool design decides what each tool does and how it is described, so the model calls it correctly and you can verify it.

## Why an FDE needs this

Picture a parcel-delivery assistant that mirrors the client's REST API as `get_shipment(id)` and `update_shipment(id, data)`, described as "Gets a shipment" and "Updates a shipment." Traces show three failures. Customers give order numbers like `ORD-20931877`, but `id` expects an internal UUID. "Where is my parcel? Make sure it arrives Friday" can trigger `update_shipment`, since nothing says when not to. Free-form `data` even let the model set `status` to "delivered".

The FDE redesigns around customer tasks: a read-only `get_delivery_status(order_number)` and a separate `request_delivery_reschedule`. No tool sets a status. The model did not change; the definitions did.

## Key concepts

### Name and description

Use short snake_case verb_noun names; naming rules differ by provider. Anthropic calls detailed descriptions "by far the most important factor in tool performance." Say what the tool does, when to use it and when not to, what parameters mean, and its limits (precisely: Azure OpenAI caps descriptions at 1,024 characters). In Anthropic's format:

```json
{
  "name": "request_delivery_reschedule",
  "description": "Requests delivery of one parcel on a new date. Use only for date changes, not status questions (use get_delivery_status). The carrier must approve.",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_number": {"type": "string", "description": "ORD- plus 8 digits, e.g. ORD-20931877"},
      "new_date": {"type": "string", "description": "YYYY-MM-DD"},
      "reason": {"type": "string", "enum": ["not_home", "address_issue", "other"]}
    },
    "required": ["order_number", "new_date", "reason"]
  }
}
```

### Parameters that steer the model

- **Unambiguous names:** `order_number`, not `id`.
- **A format and an example** in each description.
- **Enums for fixed choices,** to "make invalid states unrepresentable" (OpenAI).
- **Flat, not nested:** OpenAI warns nested arguments get omitted or misused.
- **Nothing code already knows:** the session supplies the customer ID.

Anthropic calls this poka-yoke (mistake-proofing): once a tool required absolute file paths, "the model used this method flawlessly."

### Narrow tools, one side effect each

Anthropic calls tools "that merely wrap existing software functionality or API endpoints" a common error: `search_contacts` beats `list_contacts`. The opposite error is an open-ended `run_sql(query)`, which OWASP's LLM03:2026 Excessive Agency advises against: minimize what each tool can do.

Anthropic and OpenAI both suggest merging steps that belong together: combine steps, not side effects. Keep reads apart from writes, so each tool can be tested, labeled (an MCP `readOnlyHint`) and gated for approval (see Related).

### Verifiable in two layers

| Layer | Tests | How |
|---|---|---|
| Code | The function behind the tool | Unit tests, no model: real, unknown and malformed order numbers, past dates |
| Model | Tool choice and arguments | About 15 eval prompts, checked in traces |

Include near-misses, no-tool questions and a missing date that needs a clarifying question, and re-run after every description, schema or model change.

## Common misconceptions

- **"The model reads my code, so the definition can be short."** It sees only the definition; with SDK-generated schemas, that means your docstring and type hints.
- **"A strict schema means correct arguments."** Strict mode guarantees shape and types, not that the order exists. Tool code checks that.
- **"Leaving a capability out of the definition keeps us safe."** Microsoft warns against relying solely on that. Enforce limits with permissions.

## Typical interview questions

<details>
<summary>What goes into a tool definition, and which part matters most?</summary>

A name, a description and a parameter schema with each input's name, type, description and whether it is required. The model decides from these alone, so the description matters most, including when not to use the tool.

</details>

<details>
<summary>How does wrapping an API endpoint differ from designing a tool?</summary>

A wrapper copies the backend: internal IDs, free-form bodies, list-everything results. A designed tool fits one user task, takes inputs the model can know and has one side effect: `get_delivery_status(order_number)`, not `get_shipment(id)`.

</details>

<details>
<summary>Design a verifiable refund tool for a support assistant.</summary>

`request_refund(order_number, reason)` with a `reason` enum; the session supplies the customer ID and code computes the amount. The description limits it to explicit refund requests. I unit-test the function, then run eval prompts checking when the model calls it.

</details>

<details>
<summary>The model calls `search_help_articles` for order-status questions. How do you fix it?</summary>

The descriptions usually overlap, or the order tool never mentions delivery. I add when-not-to-use sentences pointing at each other, add those prompts to the eval set and re-run. Forcing the tool hides the problem.

</details>

## Learn more

- Course: [What are Tools? (Agents Course, Unit 1)](https://huggingface.co/learn/agents-course/unit1/tools) (Hugging Face, about 10 min)
- Article: [Writing effective tools for agents, with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Anthropic Engineering, about 25 min)
- Practice: [Tool evaluation](https://platform.claude.com/cookbook/tool-evaluation-tool-evaluation) (Anthropic Claude Cookbook, about 45 min)

## Related

- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Tool Calling (Function Calling)](./01-tool-calling.md)
- [Tool Argument Validation](./06-tool-argument-validation.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../11-ai-evaluation/02-evaluation-sets.md)
- [Human-in-the-Loop Approval](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
