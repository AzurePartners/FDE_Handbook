---
title: Alpha Pass Condition
row: M7-L3.4
---
**In one sentence:** The alpha passes when another person, using only your instructions, can run the system from input to final output.

## What it is

Alpha is the first version that works end to end on the happy path. The test is not whether you can make it work, since you built it. The test is whether someone else can, with no help from you.

For the Course Support Assistant: a colleague clones the repo, follows the README, asks "What is the refund window for the Data Analysis Bootcamp?" and gets a correct, cited answer. Handoff expectations are in [The Handoff Package](../../m5/07-pilot-value-handoff-and-productization/05-the-handoff-package.md) (M5).

## Why an FDE needs this

Clients will not call you whenever something breaks. If only the builder can run the system, there is no delivery, only a demonstration. This check also catches missing steps early, such as an unwritten permission request.

## Key concepts

### What you produce

An alpha sign-off checklist, completed by the second person:

| Check | Done by | Result |
|---|---|---|
| Setup followed from README only | Tester | Pass or fail |
| Happy-path question answered correctly | Tester | Pass or fail |
| Output shows its source | Tester | Pass or fail |
| Questions or confusions logged | Tester | List |
| Open blockers in run log | Builder | Count |

### Pass bar

- The tester reaches a correct final output without asking the builder questions.
- Every question the tester did ask becomes a README fix.
- The run log shows zero open blockers.
- Known gaps are listed, not hidden. Passing alpha does not mean the system is accurate on edge cases. That comes next in evaluation.

## Common misconceptions

- **"Alpha means the system is good."** Alpha means the path runs. Quality is measured in the evaluation step.
- **"I can test it myself since I know it best."** Your knowledge is exactly the bias. A fresh person finds missing steps.

## Typical interview questions

<details>
<summary>How did you know your alpha was done?</summary>

A colleague ran it from the README alone and reached a correct cited answer. Their questions went into the README, and the run log had no open blockers.

</details>

<details>
<summary>What did the second tester find that you had missed?</summary>

Name a real finding from your own run, for example an undocumented environment variable or a data folder that was never described. The point is that each finding became a documentation fix.

</details>

## Learn more

- Article: [Twelve-Factor App: Dependencies](https://12factor.net/dependencies) (short read), on letting a new developer set up from a clean machine.

## Related

- [Run Log and Failure Triage](./03-run-log-and-failure-triage.md)
- [Evaluation Set and Baseline](../04-evaluation-hardening/01-evaluation-set-and-baseline.md)
- [Reproducible Setup](./02-reproducible-setup.md)
- [The Handoff Package](../../m5/07-pilot-value-handoff-and-productization/05-the-handoff-package.md) (M5)
