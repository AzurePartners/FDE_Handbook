---
title: Structured Output and JSON Schema
row: M2-L2.6
---
**In one sentence:** Structured output means the model returns data in a shape your code defined in advance, usually a JSON Schema of fields, types and allowed values, so software can use the reply directly.

## What it is

A model writes text, but code needs named fields with known types. Structured output defines the reply's shape in advance, usually in JSON Schema, "a vocabulary that you can use to annotate and validate JSON documents."

Think of a paper form. Asking for JSON in the prompt is a blank page; a schema is the printed form with labeled boxes; strict mode is a pen that cannot write outside them. A wrong date still fits the date box, so your code checks.

Precisely, strict mode (schema-constrained decoding) compiles your schema into a grammar that blocks any token breaking it: shape is guaranteed, truth is not.

## Why an FDE needs this

A logistics client wants supplier invoices turned into accounts-payable records. The demo prompt asking for JSON works, then the nightly batch crashes: replies arrive in code fences, after "Here is the extracted data:", with `dueDate`, or with a `notes` key the ERP rejects.

The FDE switches to strict mode with a schema. Parse errors stop, then quieter failures appear: a 40-page invoice hits the token limit mid-JSON, and a euro invoice passes as `USD`. Only layered checks in code keep bad records out of the ERP.

## Key concepts

### The schema is the contract

Five keywords do most of the work: `type`, `properties`, `required`, `enum` (allowed values) and `additionalProperties`. Two defaults surprise people: properties are optional unless listed in `required`, and extra keys are allowed unless `additionalProperties` is `false`.

```json
{
  "type": "object",
  "properties": {
    "vendor_id": {"type": "string"},
    "currency": {"type": "string", "enum": ["USD", "EUR", "GBP"]},
    "due_date": {"type": "string", "format": "date"}
  },
  "required": ["vendor_id", "currency", "due_date"],
  "additionalProperties": false
}
```

Pydantic (Python) or Zod (TypeScript) generates such a schema from one model that also validates replies.

### Three ways to ask for JSON

| Method | Guarantees |
|---|---|
| Prompt instructions | Nothing; replies drift |
| JSON mode (OpenAI `json_object`) | Valid JSON, any fields |
| Strict mode (Anthropic `output_config.format`, OpenAI `text.format` with `strict: true`, Gemini `response_json_schema`) | Your schema's shape |

OpenAI calls JSON mode the older method; prefilling `{` fails on Claude 4.6 and later. Strict tools get the same guarantee for arguments.

### What strict mode does not guarantee

- **Refusals:** may not match the schema (Anthropic `stop_reason: "refusal"`, OpenAI's `refusal` field).
- **Truncation:** `max_tokens` can cut JSON off; a stream cannot be validated until it ends.
- **Enum casing:** Anthropic notes values may differ in capitalization.
- **Truth:** OpenAI and Google say valid shape is not correct content.

Schema subsets differ. Anthropic rejects recursion and keywords like `minimum` and `minLength` (its SDKs strip those and check afterward). OpenAI strict mode requires every field in `required`. Gemini accepts `minimum`. Anthropic caches compiled schemas apart from messages, so keep personal data out of enum values.

### Validating in layers

The order: stop reason, parse, schema, business rules.

```python
class Invoice(BaseModel):
    model_config = ConfigDict(extra="forbid")   # additionalProperties: false
    vendor_id: str
    currency: Literal["USD", "EUR", "GBP"]      # enum
    total: float = Field(ge=0)                  # SDK strips; Pydantic checks
    due_date: date

fmt = {"type": "json_schema", "schema": anthropic.transform_schema(Invoice)}
resp = client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=4000,
                              messages=msgs, output_config={"format": fmt})
if resp.stop_reason in ("refusal", "max_tokens"):         # 0: do not parse
    raise OutputRejected(resp.stop_reason)
text = next(b.text for b in resp.content if b.type == "text")  # skip thinking
inv = Invoice.model_validate_json(text)                  # 1, 2: parse, schema
if inv.vendor_id not in erp_vendor_ids:                  # 3: business rule
    raise OutputRejected("unknown vendor")
```

Pydantic names each failure (`json_invalid`, `literal_error`, `extra_forbidden`); Zod's `safeParse` is the TypeScript equivalent. Rejections go to the repair and fallback wrapper.

## Common misconceptions

- **"If I say 'respond only in JSON', my code can always parse it."** Prompt-only formatting drifts into fences, preambles and renamed fields.
- **"JSON mode and structured outputs are the same thing."** JSON mode guarantees valid syntax, not which fields appear.
- **"With strict mode on, I can delete my validation code."** Refusals and truncation break the shape, and valid shapes can hold wrong currencies.
- **"Any JSON Schema works with any provider."** Each supports a subset, so enforce stripped keywords in your own validator.

## Typical interview questions

<details>
<summary>What is structured output, and why does a business system need it?</summary>

The model returns data in a predefined shape, usually a JSON Schema, instead of prose. Downstream code needs predictable fields, so the schema becomes the contract.

</details>

<details>
<summary>How do prompt instructions, JSON mode and strict mode differ?</summary>

A prompt instruction can be broken. JSON mode guarantees valid JSON, not which fields. Strict mode blocks tokens that violate the schema: the shape holds, but values can be wrong.

</details>

<details>
<summary>Design the output contract for invoice extraction into a client's ERP.</summary>

A Pydantic model generates the schema: fields required, currency as an enum, no extra keys. I check the stop reason, parse, validate, then apply rules like "vendor exists" and "lines sum to total," sending failures to human review.

</details>

<details>
<summary>Strict mode is on, yet parse failures and enum rejections appear. How do you debug?</summary>

I check the logged stop reason: `max_tokens` means truncated JSON; `refusal` needs its own branch. I confirm no stream is parsed early and normalize enum case (Anthropic documents capitalization drift).

</details>

## Learn more

- Reference: [Creating your first schema](https://json-schema.org/learn/getting-started-step-by-step) (JSON Schema, about 20 min)
- Reference: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) (Anthropic, about 20 min)
- Reference: [Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs) (OpenAI, about 20 min)

## Related

- [JSON](../../m1/02-how-web-apps-run/07-json.md)
- [Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Tool Schemas and Tool Design](../10-tool-calling-deterministic-logic/05-tool-design.md)
