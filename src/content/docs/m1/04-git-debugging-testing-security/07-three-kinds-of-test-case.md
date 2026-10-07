---
title: Test Case Types
row: M1-L4.3
---
**In one sentence:** A test is code that runs your program with a known input and checks the result, and thorough testing covers normal, unusual, and rejected input.

## What it is

Testing means writing code that checks other code. Instead of running your app by hand and eyeballing the result every time you make a change, you write a test once that does the same check automatically, every time. A passing test means the behavior still works; a failing one means something broke, and you find out in seconds instead of when a client reports it.

The testing mindset means thinking in three categories of input, not just the one that is easiest to imagine:

- **Happy path**: the normal, expected input, working correctly.
- **Edge cases**: unusual but valid input, at the boundaries of what the code expects.
- **Failure cases**: input or conditions that should be rejected, not input that should ever succeed.

Most people, and most AI tools left unprompted, write happy path tests only. A junior engineer's growth shows in whether they think about edge and failure cases too.

## Why an FDE needs this

A client's real data is messier than a demo. An accented name, an empty field, a value an outside API does not cover: these do not show up in a happy-path demo but do show up in production within the first week. Writing tests for them before they happen is the difference between looking prepared and looking caught off guard.

## Key concepts

### Example: a `/lookup?city=` endpoint

| Category | Example input | Expected behavior |
|---|---|---|
| Happy path | `city=Tokyo` | Returns weather and a 200 status |
| Edge case | `city=são paulo` (accented, lowercase) | Still finds the city |
| Failure case | `city=` (empty string) | Returns a 400 with a clear message, not a crash |
| Failure case | `city=Nowhereville` (does not exist) | Returns a 404, not a 500 |

### Write the failing test first

1. Write a test describing the behavior you want, using input you know currently fails.
2. Run it and watch it fail. This confirms the test checks something real.
3. Write or fix the code until the test passes.
4. Keep the test in the codebase, so the same bug cannot silently return.

This order matters with AI tools: a test written in advance proves a reported fix actually works, rather than trusting the AI's own claim.

### A short pytest example

```python
def test_missing_city_returns_400():
    response = client.get("/lookup?city=")
    assert response.status_code == 400

def test_unknown_city_returns_404():
    response = client.get("/lookup?city=Nowhereville")
    assert response.status_code == 404

def test_valid_city_returns_weather():
    response = client.get("/lookup?city=Tokyo")
    assert response.status_code == 200
    assert "weather" in response.json()
```

Each function starting with `test_` is one test. `pytest` runs every one and reports which passed, which failed, and the exact assertion that broke.

## Common misconceptions

- **"Testing the happy path is enough if the demo works."** A demo only proves the one input you tried. Edge and failure cases are what real client data hits.
- **"A failing test means the code is broken."** It can also mean the test itself is wrong, for example checking the wrong status code. Read the assertion before assuming the code is at fault.
- **"AI-written tests are automatically thorough."** An AI asked to "write tests" often produces happy-path tests only, unless asked for edge and failure cases too.

## Typical interview questions

<details>
<summary>What are the three categories of test case, and why do all three matter?</summary>

Happy path (normal input), edge cases (unusual but valid input), and failure cases (input that should be rejected). All three matter because real usage includes messy input a happy-path-only test never catches.

</details>

<details>
<summary>What does "write the failing test first" mean, and why do it?</summary>

Write a test describing the behavior you want before the fix is made, run it to confirm it fails, then write the code until it passes. This proves the test checks something real and gives a way to confirm the fix works.

</details>

<details>
<summary>Give an edge case and a failure case for a form that accepts an email address.</summary>

Edge case: an email with a plus sign or an uncommon domain, still accepted. Failure case: a string with no `@`, rejected with a clear error rather than accepted silently.

</details>

## Learn more

- Article: [Ranorex, positive testing vs negative testing](https://www.ranorex.com/blog/positive-testing-vs-negative-testing-key-differences/) (Ranorex)
- Article: [softwaretestinghelp, What is negative testing](https://www.softwaretestinghelp.com/what-is-negative-testing/) (Software Testing Help)

## Related

- [Reproduce, Narrow, Minimize](./06-reproduce-narrow-minimize.md)
- [Unit vs. Integration Tests](./08-unit-vs-integration-tests.md)
