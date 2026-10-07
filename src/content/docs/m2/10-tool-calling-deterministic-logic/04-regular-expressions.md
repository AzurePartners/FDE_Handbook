---
title: Regular Expressions (Regex) and Checksums
row: M2-L4.4
---
**In one sentence:** A regular expression is a short pattern that describes the shape a value must have, and a checksum is a small calculation over its digits that catches typos, so code, not the model, decides whether an ID is well formed.

## What it is

A regular expression (regex) is a small pattern language for the allowed shape of text. `^ORD-[0-9]{8}$` reads: start of string (`^`), the literal `ORD-`, exactly eight (`{8}`) characters from 0 to 9 (`[0-9]`), end of string (`$`). Code gets the same yes or no every time, in under a microsecond.

A regex is a cookie cutter: it checks the outline, so a fake ID with the right outline passes too. So you add parsing, which turns text into a real value (a date library knows February 30 does not exist), and a checksum, a digit computed from the others that, like a receipt total, stops adding up when one digit is miscopied. OWASP calls shape checks syntactic validation; business sense is semantic validation, and existence needs a lookup.

## Why an FDE needs this

A retailer's support assistant has a `get_order` tool for IDs like `ORD-12345674`, whose last digit is a Luhn check digit. Version one trusted the prompt plus `re.search(r"\d{8}", text)`. A customer typed nine digits, the search took the first eight, and the assistant described a different real order. Another swapped two digits; the model called it fine, and "not found" became "your order does not exist." A value ending in a newline passed a `^...$` check.

The FDE moves the checks into tool code (normalize, full match, Luhn, then the existence checks in [4.6](./06-tool-argument-validation.md)). Bad values fail in microseconds with a specific error, and twenty should-pass and should-fail cases become unit tests.

## Key concepts

### Anchor the whole string

Python's `re.search` matches anywhere and `re.match` only at the start. Validate with `re.fullmatch`.

- `re.search(r"\d{5}", "123456")` succeeds, so six digits pass.
- Python's `$` also matches before a trailing newline, so `^\d{5}$` accepts `"12345\n"`. `fullmatch` does not.
- `^cat|dog$` matches "hotdog". Group it: `^(cat|dog)$`.
- In Python and .NET, `\d` matches any Unicode digit, such as Arabic-Indic `١٢٣٤٥`. Write `[0-9]` for ASCII.

OWASP recommends allowlists covering the whole input, no wildcards like `.`, and a length range like `{1,25}`.

### Keep patterns simple

Over-strict patterns reject real people, such as apostrophes in names or `+` in email addresses; for email, OWASP advises a light check, then a confirmation link. Over-clever ones are risky: nested quantifiers like `(a+)+$` can take exponential time on crafted input (ReDoS), so cap input length and never build a pattern from user or model text.

### Pattern, then parse, then checksum

`\d{4}-\d{2}-\d{2}` accepts `2026-02-30`; `date.fromisoformat` rejects it but also accepts forms like `20191204`, so full match first, then parse.

The Luhn check protects card numbers and IMEI phone IDs: from the rightmost digit leftward, double every second digit, subtract 9 from results above 9, and sum. Valid totals divide by 10.

```python
ORDER_ID = re.compile(r"ORD-[0-9]{8}")

def luhn_ok(digits: str) -> bool:
    total = 0
    for i, ch in enumerate(reversed(digits)):
        d = int(ch) * (2 if i % 2 else 1)
        total += d - 9 if d > 9 else d
    return total % 10 == 0

value = raw.strip().upper().replace(" ", "")
valid = bool(ORDER_ID.fullmatch(value)) and luhn_ok(value[4:])
```

Luhn catches every single-digit error and every neighbor swap except 09 and 90. About one random number in ten passes and anyone can compute the digit, so it stops typos, not fraud. For IBAN or ISBN, use a tested library such as `python-stdnum`.

### Never let the model check formats

A model reads tokens, not characters, and can answer differently each run; OWASP's LLM Top 10 2026 (LLM10, Improper Output Handling) says to treat it "as any other user." A schema `pattern` ([2.6](../08-prompting-context-structured-output/06-structured-output.md)) narrows shape only. AI may write a tested regex; the model must not judge values at run time.

## Common misconceptions

- **"If the pattern matches, the value is valid."** A search finds a piece anywhere, and even a full match proves shape, not existence.
- **"A regex for YYYY-MM-DD proves it is a real date."** It accepts `2026-13-01`. Match the shape, then parse.
- **"A number that passes Luhn is a real account."** Luhn only catches typos. Existence needs a lookup.

## Typical interview questions

<details>
<summary>What does `^ORD-[0-9]{8}$` accept?</summary>

Only `ORD-` plus exactly eight ASCII digits, nothing else. In Python use `re.fullmatch`, since `$` tolerates a trailing newline.

</details>

<details>
<summary>What is the difference between a format check, a checksum and a lookup?</summary>

A format check confirms shape, a checksum catches typos by testing that the digits agree, and a lookup confirms the record exists. Run them cheapest first.

</details>

<details>
<summary>Your validator accepted `ORD-123456789` and a value ending in a newline. Why?</summary>

`re.search` found eight digits inside nine, and Python's `$` matches before a trailing newline. Use `re.fullmatch` with `[0-9]` and add both inputs as regression tests.

</details>

<details>
<summary>A client suggests asking the model to confirm each ID is valid. How do you respond?</summary>

Decline and explain: the model varies between runs and costs money, while a regex plus checksum is deterministic and unit-testable. The model finds the value; code decides whether it is valid.

</details>

## Learn more

- Article: [Regular Expression HOWTO](https://docs.python.org/3/howto/regex.html) (Python Software Foundation, about 40 min)
- Reference: [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) (OWASP, about 20 min)
- Article: [Regular expression Denial of Service - ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) (OWASP, about 10 min)

## Related

- [Model Judgment vs Deterministic Code](./03-model-vs-code.md)
- [Tool Argument Validation](./06-tool-argument-validation.md)
- [Input Validation](../../m1/04-git-debugging-testing-security/10-input-validation.md)
- [Three Kinds of Test Case: Happy, Edge, Failure](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [Sensitive Data and PII Protection](../12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)
