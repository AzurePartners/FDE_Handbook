---
title: Handoff Package Submission
row: M7-L6.3
---
**In one sentence:** The handoff package submission is the folder you give the client so their own people can run, restart, and understand the system without you.

## What it is

When you leave, the Course Support Assistant stays. A coordinator needs to know how to start it, what it can read, what to do when it is down, and what it cannot do. The package answers those questions in writing.

What a handoff package contains is covered in [The Handoff Package](../../m5/07-pilot-value-handoff-and-productization/05-the-handoff-package.md) (M5), and how to write limitations in [Documenting Known Limitations](../../m2/12-safety-guardrails-hitl/09-known-limitations.md) (M2). This page is the practicum submission checklist.

## Why an FDE needs this

If only you can run it, you have built a dependency, not a solution. A system with no restart procedure becomes the client's emergency the first time a document upload fails. The package also protects you: it shows what was delivered and what was out of scope.

## Key concepts

### What you produce

A folder with these items, each as a short file.

| Item | Contents | Done when |
|---|---|---|
| Operating guide | Daily use, inputs and outputs, how to update course documents, who to contact | A coordinator follows it unaided |
| Setup instructions | Environment, versions, steps to reinstall | A fresh machine reaches a working run |
| Permissions | Which accounts, keys, and data the system touches, read or write | No secret appears in the files |
| Fallback and restart | Common failures and fixes (runbook), what to do when the service is down | Each failure has a first action |
| Known limitations | User-language list with workarounds | Matches the release candidate |
| Run evidence | Eval table, proxy session notes, sample run log | Files open and match stated versions |
| Version record | Prompt, data snapshot, model, config | Matches rc label |

### Pass bar

- A reviewer who was not on the project performs the setup and one full run from the written instructions alone.
- Restart and fallback steps were tested once, with a note of the result.
- Permissions table lists every credential by name and purpose, with no values included.
- Limitations match the demo and the release candidate record, with no contradictions.
- Each file has an owner and date.

## Common misconceptions

- **"Code and a README are enough."** The client needs operating and recovery steps, including the data update process, which is the first thing that breaks.
- **"Limitations should stay out so the client feels confident."** Missing limitations cause surprises and blame. Documented limits are part of the contract.
- **"Handoff is the last day's task."** Write pieces as you build. Reproducing them at the end is slow and error-prone.
- **"I can write the guide from memory."** Write it while performing the steps, keep keys out of setup notes, and make the limitations match what you said in the demo.

## Typical interview questions

<details>
<summary>What goes in a handoff package?</summary>

Operating guide with inputs and outputs, setup instructions, permissions, a runbook of common failures, fallback and restart procedures, known limitations, run evidence, and version records. Each is written for the person who will run it, not the person who built it.

</details>

<details>
<summary>How do you know the handoff works?</summary>

Someone outside the build follows the package from a clean start to a successful run. Anything they get stuck on is a defect in the package.

</details>

<details>
<summary>What would you do differently in your handoff?</summary>

Pick a real gap, such as writing the document update steps earlier because they were the hardest to explain.

</details>

## Learn more

- Book chapter: [Being On-Call](https://sre.google/sre-book/being-on-call/) (Google SRE Book), on playbooks that let someone else respond to failures.

## Related

- [Alpha Pass Condition](../03-alpha-build/04-alpha-pass-condition.md)
- [Known Limitations and Fix List](../04-evaluation-hardening/04-known-limitations-and-fix-list.md)
- [Individual Postmortem](./04-individual-postmortem.md)
- [The Handoff Package](../../m5/07-pilot-value-handoff-and-productization/05-the-handoff-package.md)
