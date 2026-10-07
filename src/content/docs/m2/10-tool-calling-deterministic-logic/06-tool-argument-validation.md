---
title: Tool Argument Validation
row: M2-L4.6
---
**In one sentence:** Tool argument validation is the set of checks your tool code runs on every argument the model proposes, confirming the values make sense against real data and business rules, before anything is changed.

## What it is

Anthropic is blunt: "The model never executes anything on its own." It emits a request and your code runs it, so every proposed call is untrusted input. The OWASP GenAI LLM Top 10 2026 (LLM10) says to "treat the model as any other user, adopting a zero-trust approach."

A bank teller checks even a perfect withdrawal slip: does the account exist, and does the balance cover it? Cash leaves only after every check passes.

OWASP separates syntactic validation (structure and format) from semantic validation (values correct "in the specific business context"). A schema covers part of the first; tool code does the rest. The prompt and schema are like a web form's browser checks: helpful, but only the code check counts.

## Why an FDE needs this

A retailer's assistant gets `cancel_order` and `issue_refund`, and the prompt caps refunds at $200. Pilot traces show three bad calls: an order ID copied with one character changed, a $15,000 refund after a customer wrote "charged 15000" (meaning cents), and a cancel on a shipped order that the warehouse API accepted.

Strict mode was on, so every call matched the schema. The FDE leaves the prompt alone, finds the real rules (a finance PDF and two order-system rules), encodes them in each tool and adds each failure as a regression test.

## Key concepts

### Shape is not meaning

Strict mode (schema-enforced generation, [2.6](../08-prompting-context-structured-output/06-structured-output.md)) guarantees types, required fields and enums, not that an order exists or that $5,000 fits policy. Anthropic's strict subset cannot express `minimum` or `maxLength`, and its docs promise compliance "in most cases," so re-check shape, then meaning.

### The order of checks

Tool design ([4.5](./05-tool-design.md)) prevents some bad calls; validation catches the rest, cheapest first:

1. **Shape:** types and required fields (`"150"` is not a number).
2. **Normalize:** trim, lowercase enums, convert money to integer cents.
3. **Format:** pattern and checksum ([4.4](./04-regular-expressions.md)), catching a one-digit ID typo.
4. **Range:** the amount is within the cap (no $15,000 refund).
5. **Cross-field:** the refund fits the unrefunded balance.
6. **Existence:** the order really exists, not an invented ID.
7. **State:** the transition is allowed (shipped orders cannot be cancelled).

Whether this user may act is the action gate ([6.5](../12-safety-guardrails-hitl/05-action-gates.md)); approval is [6.6](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md).

### Every check before any side effect

Payments and emails cannot be undone, so every check passes before the first side effect, and a rejected call changes nothing (failing closed).

```python
CAP_CENTS = 20_000  # $200 policy cap

def issue_refund(order_id: str, amount_cents: int) -> dict:
    if not 0 < amount_cents <= CAP_CENTS:
        raise ToolRejected("amount_cents must be 1 to 20000")
    with db.transaction():
        order = db.lock_order(order_id)  # row lock
        if order is None:
            raise ToolRejected("Order not found")
        if order.status != "delivered":
            raise ToolRejected("Order not delivered")
        if amount_cents > order.paid_cents - order.refunded_cents:
            raise ToolRejected("Exceeds refundable balance")
        return payments.refund(order_id, amount_cents)  # first side effect
```

`ToolRejected` is your own exception, returned as an error result (`is_error: true` on Claude) so the model can fix the argument or ask the user. Wording belongs to [4.7](./07-tool-results-and-error-returns.md); log the outcome in the trace ([4.2](./02-tool-call-loop.md)).

### Check and write together

A record can change between check and write, say when two cancel calls race. Lock the row so other writers wait, as above, or write conditionally (`WHERE status = 'open'`) and treat zero rows changed as a rejection. An [idempotency key](../../m1/06-reliability-scale/05-idempotency.md) stops a retry from running twice.

## Common misconceptions

- **"Strict mode is on, so the arguments are validated."** It guarantees shape, not that the order exists or the amount fits policy.
- **"The prompt caps refunds, so the model won't ask for more."** A prompt rule is guidance, not a control. The cap must be an `if` in the tool.
- **"Our users are trusted, so validation is optional."** Most bad arguments are honest mistakes: a mistyped ID, cents read as dollars, the wrong year.
- **"We can roll back if a later check fails."** Payments and third-party calls often cannot be reversed.

## Typical interview questions

<details>
<summary>What is tool argument validation, and why not trust the model's arguments?</summary>

Deterministic checks in tool code on every proposed argument, before any side effect. Arguments can be well formed but wrong, or steered by injected text.

</details>

<details>
<summary>How does schema validation differ from argument validation?</summary>

Schema validation checks shape; strict mode enforces it during generation. Argument validation checks meaning against live data: only code with database access knows order A-1042 shipped yesterday.

</details>

<details>
<summary>Design the validation for `issue_refund(order_id, amount, reason)`.</summary>

Normalize the amount to integer cents and the reason to an enum. Check it is positive and within the cap, the order exists and is refundable, and the amount fits the unrefunded balance, all in one transaction with an idempotency key.

</details>

<details>
<summary>A booking tool accepted a past date, though the prompt says "future dates only." What went wrong?</summary>

The rule lived only in the prompt, and the model resolved "next Friday" to the wrong year. I would check the date against the server clock in code, return an error with today's date and add a regression case.

</details>

## Learn more

- Article: [Input Validation Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Input_Validation_Cheat_Sheet.md) (OWASP, about 20 min)
- Reference: [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) (Anthropic Claude Docs, about 15 min)

## Related

- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Regular Expressions (Regex) and Checksums](./04-regular-expressions.md)
- [Tool Schemas and Tool Design](./05-tool-design.md)
- [Tool Results and Error Returns](./07-tool-results-and-error-returns.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../12-safety-guardrails-hitl/05-action-gates.md)
