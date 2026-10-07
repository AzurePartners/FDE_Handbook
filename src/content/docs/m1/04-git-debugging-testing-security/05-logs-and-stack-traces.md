---
title: Logs and Stack Traces
row: M1-L4.2
---
**In one sentence:** Logs and stack traces are the evidence a program leaves behind, a log describes what it did and a stack trace shows where it crashed.

## What it is

A bug is any gap between what code should do and what it does. Debugging closes that gap with evidence, not guessing, and the main evidence is logs and stack traces.

A log is a line of text a program writes while it runs, describing what it did: "connected to database", "received request for city=Lahore". Logs are written on purpose, at points the developer chose, so they only show what someone thought to record.

A stack trace is what a program prints automatically when it crashes with an unhandled error. It lists every function running at the moment of the crash, from the first one called down to the one that failed. Reading a stack trace in the right direction is one of the most useful skills for anyone who touches code, whether they write it or review what an AI wrote.

## Why an FDE needs this

At a client, something will break, usually right before a demo, and "let me ask the AI" is not a good first move if you cannot tell whether the answer is correct. An FDE reads the error and forms a hypothesis before reaching for help. AI tools sometimes "fix" a bug by removing the check that was failing, hiding the real problem. Someone who can read the trace themselves catches that.

## Key concepts

### Reading a Python traceback, bottom up

```
Traceback (most recent call last):
  File "app/main.py", line 12, in <module>
    result = get_summary("Lahore")
  File "app/services.py", line 34, in get_summary
    rate = fetch_exchange_rate(city_currency)
  File "app/services.py", line 51, in fetch_exchange_rate
    return data["rates"][target]
KeyError: 'PKR'
```

Python prints "most recent call last", so the bottom is where the crash happened, and each line above is the chain of calls that led there. Read it bottom up:

1. The last line, `KeyError: 'PKR'`, is the actual error: the code looked up a key called `'PKR'` and it was not there.
2. The line above, `services.py, line 51`, shows where: `data["rates"][target]`.
3. Upward: `fetch_exchange_rate` was called by `get_summary`, called from `main.py, line 12`.

The fix starts at the bottom: either `'PKR'` should exist and something upstream sent the wrong code, or the code needs to handle a missing rate instead of assuming it is always there.

### What a good log line includes

A useful log line names what happened and the values involved, not just "error occurred". Compare `"failed"` to `"failed to fetch exchange rate for currency=PKR, status=404"`. The second tells you what failed and why, without reproducing the bug.

## Common misconceptions

- **"You should read a stack trace from the top down."** Read it bottom up. The bottom line is the actual error; the lines above show how execution got there.
- **"A stack trace and a log are the same thing."** A log is written deliberately at chosen points while a program runs normally. A stack trace is generated automatically only when an unhandled error crashes the program.
- **"More logging is always better."** Logging every value at every step buries the useful lines in noise. Log what would actually help diagnose a failure.

## Typical interview questions

<details>
<summary>How do you read a Python stack trace?</summary>

Start at the bottom. The last line names the error type and message, and the line above shows the exact file and line where the crash happened. Reading upward shows the sequence of calls that led there.

</details>

<details>
<summary>What is the difference between a log and a stack trace?</summary>

A log is a line of text a program writes on purpose while running, describing what it did. A stack trace is generated automatically when the program crashes, listing the chain of function calls that led to the failure.

</details>

<details>
<summary>You see `KeyError: 'PKR'` at the bottom of a trace. What does that tell you, and what would you check next?</summary>

Code looked up the key `'PKR'` in a dictionary that did not contain it. Check the line above the error to see which lookup failed, then trace upward to find where that key came from.

</details>

## Learn more

- Article: [Julia Evans, A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/) (jvns.ca, about 15 min)
- Article: [MIT Missing Semester, Debugging and Profiling](https://missing.csail.mit.edu/2026/debugging-profiling/) (missing.csail.mit.edu)

## Related

- [Reproduce, Narrow, Minimize](./06-reproduce-narrow-minimize.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
