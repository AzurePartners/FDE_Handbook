---
title: Reproduce, Narrow, Minimize
row: M1-L4.2
---
**In one sentence:** Reproduce, narrow, and minimize is a repeatable method for tracking a bug down to its cause, instead of guessing at a fix.

## What it is

Once a log line or a stack trace points at roughly where something broke, you still need a method for finding out why. That method has a fixed order:

1. **Reproduce it.** Get the bug to happen again, on demand. A bug you cannot trigger on purpose is one you cannot confirm you fixed.
2. **Narrow the scope.** Is it every input or just one? Bypass code until you find the smallest piece that still shows the problem.
3. **Minimize the input.** Trim the request to the smallest example that still triggers the bug, for example one specific input instead of a full form.
4. **Check your assumptions.** Print or log the actual values at each step instead of assuming what they are.
5. **Fix, then confirm.** Run the code again, or a test, to confirm the fix works, not just that it looks right.

Each step removes a variable. Reproducing turns a report into something you can study repeatedly. Narrowing tells you which part of the system is responsible. Minimizing strips away everything unrelated so the actual cause is visible.

## Why an FDE needs this

A client reporting "it's broken" rarely hands you a precise case. Reproducing the failure first, before touching any code, keeps you from "fixing" something that was never actually the problem. Narrowing and minimizing matter even more once an AI tool is involved: a smaller, specific example gives it a better chance at a correct diagnosis, and gives you a fast way to confirm the answer yourself.

## Key concepts

### Handing a bug to an AI tool well

- Paste the full error and stack trace, not a paraphrase.
- Include the smallest code snippet that reproduces the problem, not the whole file.
- State what you expected and what actually happened.
- Let the AI propose a cause, but confirm it yourself by running the code.
- If its fix deletes a check or a test instead of addressing the cause, treat that as a warning sign.

### An intermittent bug is still worth reproducing

A bug that only happens sometimes is often the hardest to reproduce and the most important to. Intermittent failures usually point to something real: a race condition, a value that is only sometimes missing, or an edge case a demo never hits. Narrowing which conditions make it happen every time turns "sometimes" into a repeatable case.

## Common misconceptions

- **"A bug that only happens sometimes isn't worth reproducing reliably."** Intermittent bugs are often the most important to reproduce, since they usually point to a race condition or an edge case in real data.
- **"If the AI says it found the cause, that's the cause."** An AI can misread a stack trace like a person can. Confirm the explanation by running the code before trusting the fix.
- **"Fixing the symptom counts as fixing the bug."** Catching and ignoring an exception is not the same as fixing what caused it. The underlying issue is still there.

## Typical interview questions

<details>
<summary>What is the first thing you do when you hit a bug you don't understand?</summary>

Reproduce it reliably. If you cannot make the bug happen again on demand, you cannot confirm whether any fix actually worked.

</details>

<details>
<summary>What does it mean to "narrow the scope" of a bug?</summary>

Reducing the problem to the smallest set of conditions that still trigger it, for example finding a bug only happens for one specific input. This points directly at what is different about the failing case.

</details>

<details>
<summary>Why is it risky to accept an AI's bug fix without running the code yourself?</summary>

An AI can sound confident while being wrong, and it sometimes "fixes" a bug by removing the validation that was failing rather than addressing the cause. Running the code, or the relevant test, is the only way to confirm the fix works.

</details>

## Learn more

- Article: [Julia Evans, A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/) (jvns.ca, about 15 min)
- Article: [Claude Code best practices](https://code.claude.com/docs/en/best-practices) (code.claude.com, about 45 min)

## Related

- [Logs and Stack Traces](./05-logs-and-stack-traces.md)
- [Test Case Types](./07-three-kinds-of-test-case.md)
