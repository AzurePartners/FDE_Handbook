---
title: Model Judgment vs Deterministic Code
row: M2-L4.3
---
**In one sentence:** In a reliable AI feature, the model handles fuzzy language work, like reading intent or pulling facts out of messy text, while ordinary code handles anything with one rule-defined right answer, such as money or dates.

## What it is

Every AI feature mixes two kinds of work. Fuzzy work has several acceptable answers: reading what a customer wants, pulling an order number out of a rambling email, summarizing. Rule work has one right answer: a refund amount, a deadline, a permission. That belongs in deterministic code, which gives the same output for the same input every time.

Think of a restaurant: the server turns "something light, no nuts, sauce on the side" into a clean ticket, and the register adds up the bill.

Tool calling formalizes this: "The model never executes anything on its own" (Anthropic). It proposes values; code verifies, computes and enforces rules; the model explains the result.

## Why an FDE needs this

Picture an internet provider's assistant handling outage credits. The pilot pasted the policy (a credit per outage day, capped at one month's fee) into the system prompt and let the model compute. All 30 test chats passed. In month one, finance found credits rounded differently from billing, outages across a month end miscounted, and pushy customers promised more than the cap. Legal recalled Moffatt v. Air Canada (2024), where a tribunal held the airline liable for its chatbot's wrong refund advice.

The FDE redraws the boundary: the model extracts the account and request and writes the reply. A `calculate_outage_credit(account_id)` tool reads outage records, takes today's date from the server clock, applies the cap and returns the amount, which the reply must quote.

## Key concepts

### Where the boundary sits

| Work | Owner | Why |
|---|---|---|
| Intent, tone, summaries | Model | Several answers can be fine |
| Facts in messy text | Model extracts, code checks | Values still need verifying |
| Calculations, money | Code | One right answer, to the cent |
| Dates, deadlines | Code | Month ends, time zones, server clock |
| Format checks | Code | A pattern or checksum decides |
| Critical business rules | Code | Prompt rules hold usually, not always |
| Permissions | Code | Authorize outside the model |

Quick test: if finance, legal or compliance could write the rule down, it goes in code.

### Why "usually right" fails for rules

- **Volume.** Illustrative math: 99% accuracy on 1,000 refunds a month is about 10 wrong.
- **Repeatability.** Anthropic's glossary: "Even with temperature set to 0, the results will not be fully deterministic."
- **Testing and audit.** Code can be unit tested and shows its formula; a wrong model total looks as confident as a right one.
- **Shape is not truth.** Strict tool use (schema-enforced arguments) guarantees fields and types, not correct values.

This is not "models can't do math": advanced models reached 2025 International Mathematical Olympiad gold standard. The case is determinism, auditability and accountability.

### The hybrid: model extracts, code computes

```text
Customer message  -> model extracts {account_ref, wants}
Extracted values  -> code validates, reads records, computes
Tool result       -> model explains it in plain words
Draft reply       -> code checks the amount equals the tool's
```

12-Factor Agents agrees: "The LLM decides what to do, but your code controls how it's done."

Code needs the right types too: in Python, `0.1 + 0.2` gives `0.30000000000000004`, so compute money in `Decimal` or integer cents using billing's rounding mode.

## Common misconceptions

- **"Models are great at math now, so the model can calculate the refund."** Capability is not the issue: a business calculation must repeat exactly, show its formula and pass tests.
- **"The prompt forbids exceeding the cap, so the cap is enforced."** Persistent users or injected text get around prompt rules. OWASP advises enforcing authorization in downstream systems, not the model.
- **"The code execution tool makes the model's math deterministic."** The sandbox is deterministic, but the model writes fresh code each time and may change the formula. Fixed rules belong in a tested tool.

## Typical interview questions

<details>
<summary>What does separating model judgment from deterministic execution mean?</summary>

The model does fuzzy language work: intent, extraction, summaries. Code does anything with one rule-defined answer (money, dates, formats, permissions) because it is repeatable, testable and auditable.

</details>

<details>
<summary>How does a model-computed refund differ from a refund tool?</summary>

A computed refund is generated text: usually right, never guaranteed. With a tool, the model extracts inputs, tested code applies the policy to the real order, and the model relays the result.

</details>

<details>
<summary>Design the boundary for an assistant that schedules payments from invoice emails.</summary>

The model extracts supplier, invoice number, amounts and due date. Code matches the purchase order, recomputes totals, sets the payment date and checks approval limits. Mismatches go to a person.

</details>

<details>
<summary>Reply totals are a few cents off billing. How do you fix it?</summary>

Check the trace for model arithmetic and the code for floats or a different rounding rule. Compute in `Decimal` with billing's rounding, have the reply quote the tool's value, and add output checks and tests.

</details>

## Learn more

- Article: [User Needs + Defining Success (People + AI Guidebook)](https://pair.withgoogle.com/guidebook-v2/chapters/user-needs/) (Google PAIR, about 25 min)
- Reference: [Factor 4: Tools are just structured outputs (12-Factor Agents)](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-04-tools-are-structured-outputs.md) (HumanLayer, GitHub, about 10 min)

## Related

- [Tool Calling (Function Calling)](./01-tool-calling.md)
- [Regular Expressions (Regex) and Checksums](./04-regular-expressions.md)
- [Unauthorized Requests, Per-User Access and Action Gates](../12-safety-guardrails-hitl/05-action-gates.md)
- [Hallucinations and Other Model Output Failures](../07-llm-application-foundations/06-hallucinations-and-output-failures.md)
- [Three Kinds of Test Case: Happy, Edge, Failure](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
