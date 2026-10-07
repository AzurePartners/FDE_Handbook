---
title: Input Validation
row: M1-L4.4
---
**In one sentence:** Input validation is checking that data from a user, a form, or an outside service matches what your code expects before you use it.

## What it is

Never trust data from outside your own code, a form field, a URL parameter, a request body, or a response from another service, without checking it first. Validation means checking the type, length, format, and range of a value, and rejecting anything that does not match, instead of letting it fail somewhere less obvious, further into the system.

```python
def get_weather(city: str):
    if not city or len(city) > 100:
        raise ValueError("city must be a non-empty string of at most 100 characters")
```

The check here is deliberately simple: reject an empty city name and one absurdly long, before the value reaches a database query or an API call. A missing check does not make bad input go away, it just moves the failure somewhere harder to diagnose, often a raw stack trace a user was never meant to see.

## Why an FDE needs this

An AI coding tool optimizes for "this makes the feature work", with no sense of which inputs a client's real users will send. It has read plenty of code online that trusts a form field because the demo never tested otherwise. Left unreviewed, it reproduces that shortcut in a real system, where the first malformed request, not even a malicious one, causes a crash or a bad database write in production.

## Key concepts

### What to check

- **Type**: is it actually a number where expected, not a string that looks like one.
- **Length**: is a string within a reasonable bound, so one absurdly long value cannot cause problems downstream.
- **Format**: does an email contain an `@`, does a date match the expected pattern.
- **Range**: is a quantity between values that make sense, not a negative count.

### Fail clearly, not silently

Rejecting bad input should produce a clear error, like a 400 response naming what was wrong, not a generic crash or a silent guess at what the user "probably meant". A silent guess can produce a wrong result that looks correct, harder to catch than an obvious failure.

### Validate outside data too, not just forms

Data from an internal service or an outside API can be malformed too, for example a field that is sometimes missing. Validate anything not written as a trusted constant in your own code, not only what came from a public-facing form.

## Common misconceptions

- **"Input validation is only needed on public-facing forms."** Data from an internal service or an API response can be malformed too. Validate anything not written as a trusted constant in your own code.
- **"A type hint in Python enforces the type at runtime."** A type hint like `city: str` is a note for readers and tools, not a runtime check. Passing something else in still runs, until an explicit check catches it.
- **"AI-written code validates input by default."** An AI tool tends to write the version of a function that makes the happy-path demo work, and skips checks unless explicitly asked for.

## Typical interview questions

<details>
<summary>An AI tool writes a working endpoint with no input validation. What is the risk, and what do you do?</summary>

Without validation, the endpoint accepts malformed or malicious input and passes it further into the system, causing a crash or a bad database write. Add explicit checks on type, length, and format, reject failures with a clear error, and confirm with a test before merging.

</details>

<details>
<summary>Why validate data coming from another internal service, not just from users?</summary>

An internal service can still send malformed data, for example a field that is sometimes missing after an upstream change. Treating "internal" as automatically trustworthy misses the kind of integration bug that only shows up once two systems disagree about a data shape.

</details>

<details>
<summary>What makes a validation error message good versus bad?</summary>

A good message names what was wrong, for example "city must be at most 100 characters", so the caller can fix the request. A bad one is a generic crash or an unhelpful 500 that gives no clue what to change.

</details>

## Learn more

- Article: [OWASP Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (OWASP, about 30 min)

## Related

- [Test Case Types](./07-three-kinds-of-test-case.md)
- [Least Privilege](./11-least-privilege.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
