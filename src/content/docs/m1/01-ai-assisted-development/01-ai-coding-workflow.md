---
title: AI Coding Workflow
row: M1-L1.1
---
**In one sentence:** The AI coding workflow is a repeating loop, state the requirement, break it into tasks, let the AI generate code, run it, check the result, and revise, with a human deciding what to build and whether the result is correct.

## What it is

"Coding with AI" can mean two things. The weak version: type a request, get code back, paste it in, hope. The version that works on the job is a loop run on purpose: requirement, task breakdown, generation, execution, validation, revision.

State a requirement in plain words. Break it into small tasks the AI can complete in one pass. The AI generates code. You execute it, meaning run it, not just read it. Validate the result against the requirement. If it does not match, revise, by telling the AI what is wrong or fixing it yourself, and go around again.

A useful analogy is briefing a fast, literal contractor who builds exactly what you describe and never asks what you meant. You inspect before signing off. That inspection step is the one people skip, and the one that matters most.

## Why an FDE needs this

Picture an engineer who asks an AI tool to clean up a client's spreadsheet export, runs it once, sees no errors, and ships it. The script quietly drops rows where a date field was formatted differently than expected. Nobody notices until a client asks why last quarter's numbers do not match. An FDE works inside a customer's systems, often with no QA team catching mistakes first.

Using AI also affects what you learn. In a January 2026 Anthropic study of 52 mostly junior engineers learning a new Python library, the AI group scored 50% on a follow-up quiz versus 67% for those coding by hand; full delegation scored lowest and asking conceptual questions highest ([AI assistance and coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)).

## Key concepts

### The six steps

| Step | What happens |
|---|---|
| Requirement | State what you want, plainly |
| Task breakdown | Split it into pieces the AI can do in one pass |
| Generation | The AI writes or edits code |
| Execution | Run it |
| Validation | Compare the real result to the requirement |
| Revision | Say what is wrong, or fix it, then repeat |

### Give the AI a check it can run

The most useful habit in this loop is handing the AI something it can check itself, instead of "make it work." Compare:

```
Weak:   Add error handling to the export script.
Better: Add error handling for a missing date field, then run
        pytest tests/test_export.py -k missing_date
        and show me the output.
```

The second version gives you a concrete way to know the change worked. Skipping validation moves the mistake's cost to whoever finds it later, usually the client.

## Common misconceptions

- **"If the AI's code runs without errors, it's correct."** Running cleanly only rules out crashes. It can still drop rows or return wrong answers.
- **"Writing a good prompt is the hard part."** Task breakdown and validation take more skill. A vague prompt with careful checking beats a perfect prompt nobody verifies.
- **"Skipping the loop saves time."** It trades a little time now for more debugging later, in front of a client instead of before them.

## Typical interview questions

<details>
<summary>What are the six steps of the AI coding loop, and which is skipped most often?</summary>

Requirement, task breakdown, generation, execution, validation, revision. Validation is skipped most, people run the code once and assume it is correct.

</details>

<details>
<summary>What does "give the AI a check it can run" mean?</summary>

Ask for something verifiable, a test or expected output, so you both have a way to confirm the change worked.

</details>

<details>
<summary>What did the Anthropic January 2026 study find, and what should an FDE do because of it?</summary>

The AI group scored 50% on a quiz versus 67% by hand, and full delegation did worst. Keep asking "why" and verify by running code.

</details>

<details>
<summary>How would you break down "add a search history feature" for an AI?</summary>

Store each search with a timestamp, add an endpoint that returns recent searches, add a way to display them, then test that a saved search comes back. Each piece is small enough to generate, run, and check on its own.

</details>

## Learn more

- Article: [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows) (Anthropic docs, 30 min)
- Article: [AI assistance and coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) (Anthropic research)

## Related

- [AI Coding Tools](./02-tool-forms.md)
- [AI Code Review](./06-verify-dont-trust.md)
- [Context Management](./05-context-management.md)
- [Git Mental Model](../04-git-debugging-testing-security/01-git-mental-model.md)
- [Test Case Types](../04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
