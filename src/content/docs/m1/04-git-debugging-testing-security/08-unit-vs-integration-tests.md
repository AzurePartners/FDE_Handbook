---
title: Unit vs. Integration Tests
row: M1-L4.3
---
**In one sentence:** A unit test checks one small piece of code on its own, and an integration test checks that real pieces, like your code and a real database, actually work together.

## What it is

Not every test should check the same amount. A unit test checks one small piece of code, usually a single function, on its own, with everything it depends on faked or removed. An integration test checks that two or more real pieces work together, for example that your code actually stores a row in the database the way it expects. A third size, end-to-end (E2E), checks the whole system the way a real user would.

Think of testing a car. A unit test is turning the ignition key alone on a workbench and checking it sends the right signal. An integration test is starting the actual engine with the battery connected. An end-to-end test is driving the car around the block.

These sizes trade speed and confidence against cost. Unit tests are fast and cheap, but cannot catch problems that only show up when real pieces interact, like a mismatched field name against a real API. Integration and end-to-end tests catch those problems, but are slower to run and costlier to maintain. A rule of thumb, the test pyramid, is many unit tests, fewer integration tests, and a handful of end-to-end tests.

## Why an FDE needs this

At a client, you rarely have time to manually click through an app after every change. A few unit tests catch broken logic in seconds. A handful of integration tests catch problems where your code and a real dependency, like a database or an API, disagree about the shape of data. That gap between "my logic is correct" and "my logic works against the real dependency" is where an AI tool's confident-looking code tends to fail first.

## Key concepts

### Mocks

A mock is a fake stand-in for something a piece of code depends on, used in unit tests so you can test your logic without calling a real database or outside API. Mocking an exchange-rate API, for example, lets you test how your code handles a rate of `108.5` or a missing rate, without a real network call.

```python
# unit test with a mock: no real network call happens
def test_converts_currency_with_mocked_rate(mocker):
    mocker.patch("app.services.fetch_exchange_rate", return_value=108.5)
    result = convert_price(100, "USD", "JPY")
    assert result == 10850
```

```python
# integration test: hits the real, running database
def test_saves_order_to_database(db_session):
    save_order(db_session, item="widget", total=10850)
    row = db_session.query(Order).filter_by(item="widget").first()
    assert row is not None
```

The first test never touches the network; it only checks the math. The `mocker` fixture comes from the pytest-mock plugin (`pip install pytest-mock`), not from pytest itself. The second uses a real test database to confirm the save works at the storage layer.

## Common misconceptions

- **"More end-to-end tests always means more confidence."** They give high confidence per test, but are slow and can fail for unrelated reasons, like a flaky network call, which erodes trust in the suite over time.
- **"A mock makes a test less trustworthy."** A mock makes a unit test faster by removing an unrelated dependency, like a live API. The trade-off is that mocks alone cannot prove the real integration works, which integration tests are for.
- **"If the unit tests pass, the feature works."** Passing unit tests only prove the pieces work in isolation. A missing integration test can hide a field name mismatch that never shows up until production.

## Typical interview questions

<details>
<summary>What is the difference between a unit test and an integration test?</summary>

A unit test checks one small piece of code, usually a single function, on its own, with dependencies mocked out. An integration test checks that real components, like your code and a real database, work correctly together.

</details>

<details>
<summary>Why does the test pyramid recommend more unit tests than end-to-end tests?</summary>

Unit tests are fast, cheap, and pinpoint failures precisely, while end-to-end tests are slow and can fail for reasons unrelated to the change, like network flakiness. A pyramid shape keeps the suite fast and reliable while still covering system behavior.

</details>

<details>
<summary>What is a mock, and when would you use one?</summary>

A fake stand-in for a real dependency, like an outside API or database, used so a test can check your code's logic without a real network call or write. Use one in a unit test to isolate the logic from something slow or unreliable.

</details>

## Learn more

- Article: [Martin Fowler, The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) (martinfowler.com)

## Related

- [Test Case Types](./07-three-kinds-of-test-case.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
