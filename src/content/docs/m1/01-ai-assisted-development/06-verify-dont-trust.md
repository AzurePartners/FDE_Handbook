---
title: AI Code Review
row: M1-L1.4
---
**In one sentence:** Reviewing AI-generated code means asking the AI to explain what it wrote, list the risks, and write tests, then confirming each answer yourself by running the code, instead of trusting the explanation.

## What it is

An AI tool can tell you what it just wrote, list what could go wrong, and generate tests for it, all on request. That is a useful starting point and not, on its own, a review. A review is complete only when a human has confirmed those answers against something real: running the tests, checking an edge case, reading the diff.

Think of it as a report from a new hire who works extremely fast. Asking them to explain their work and flag risks is a good first step. Taking their self-assessment as the final word is not. Fluency is not evidence of correctness. Running the code is.

## Why an FDE needs this

Recall the engineer whose AI-written script quietly dropped rows from a client's data export. Nothing crashed, so nothing looked wrong from outside. If reviewed, someone would have asked the AI to explain its filtering logic, checked that against real rows, and written a test with a row that should have survived but did not. Code that fails after it ships reflects on the FDE, not the tool. Catching problems before they ship is cheaper than catching them after.

## Key concepts

### Three things to ask the AI for

1. **Explain it.** Ask the AI to describe what the code does and why, then check that against the actual code.
2. **List the risks.** Ask what could go wrong, bad input, a failed outside call, an unhandled case. A starting checklist, not a guarantee.
3. **Write tests.** Ask for tests covering a normal case, an unusual input, and a failure case, then run them and read the output.

None of these steps is complete until you have done something with the answer, run the tests, or traced the risky line yourself.

### A short checklist for AI-written code

Adapted from OWASP's guidance on secure coding with AI:

- No hardcoded secrets, keys, or passwords in the diff.
- Input from a user or outside service is checked, not assumed well formed.
- Dependencies the AI added are ones you recognize or looked up.
- The code does not have more access than the task requires.

## Common misconceptions

- **"If the AI says the code is safe, it is safe."** The AI can be wrong with the same fluent confidence it has when right. An unverified claim of safety is not safety.
- **"Generating tests is optional once the code already runs."** Tests catch what a single manual run misses, an edge case not tried by hand.
- **"A clear explanation from the AI proves the code does what it says."** Only running the code proves that. An explanation is a claim, not evidence.

## Typical interview questions

<details>
<summary>Name three things you would ask an AI to do when reviewing code it just wrote.</summary>

Explain what the code does, list the risks, and write tests for a normal case, an unusual input, and a failure case. Then confirm each answer by running the code yourself.

</details>

<details>
<summary>What's on the OWASP-derived checklist for AI-written code?</summary>

No hardcoded secrets, input is checked, dependencies the AI added are ones you recognize, and the code has no more access than the task requires.

</details>

<details>
<summary>An AI wrote a fluent, confident explanation of a risky function. Is that enough to approve it?</summary>

No. Fluency is not evidence of correctness, the AI can be confidently wrong the same way it is confidently right. Only running the code or a test confirms it.

</details>

<details>
<summary>Give an example of a risk you would want an AI to check for in a script that touches client data.</summary>

Whether the script silently drops rows that do not match an expected format, a failure that produces no error and is easy to miss without a specific test.

</details>

## Learn more

- Article: [OWASP Secure Coding with AI Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (about 30 min)
- Article: [Secure Vibe Coding Guide](https://cloudsecurityalliance.org/blog/2025/04/09/secure-vibe-coding-guide) (Cloud Security Alliance, about 45 min)

## Related

- [AI Coding Workflow](./01-ai-coding-workflow.md)
- [Context Management](./05-context-management.md)
- [Test Case Types](../04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [Dependency Risk](../04-git-debugging-testing-security/12-dependency-risk.md)
