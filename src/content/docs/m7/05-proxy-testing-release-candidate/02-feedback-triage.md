---
title: Feedback Triage
row: M7-L5.2
---
**In one sentence:** Feedback triage is sorting what testers told you into dislikes, real bugs, and missing requirements, so you fix the right things and skip the rest on purpose.

## What it is

After proxy testing you have a pile of comments. "The answers are too long." "It said the wrong deadline." "Can it also email the student?" These look alike but need different responses.

Three types matter. A **dislike** is a preference with no failure behind it. A **bug** is the system doing something that contradicts the agreed behavior, and you can reproduce it. A **requirement gap** is a need that was never in scope. Each type is handled differently: dislikes are logged and weighed, bugs are reproduced and fixed, gaps go through change control.

The full loop from feedback to change log is covered in [Close the Loop](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md) and request classification in [Classifying New Requests](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md) (M5). This page is the log you hand in.

## Why an FDE needs this

If you treat every comment as a bug, scope grows and the release slips. If you treat every comment as taste, you ship real defects. A coordinator saying "it gave me last term's deadline" sounds like an opinion but is a freshness bug. A student saying "it should book office hours" sounds like a bug but is a new feature.

Users also report solutions, not problems. Ask what they were trying to do. The Mom Test and the YC talk below teach this: ask about past behavior, not whether they would like an idea.

## Key concepts

### What you produce

A feedback log, one row per item.

| ID | Source | Raw quote | Type | Reproduced? | Evidence | Decision |
|---|---|---|---|---|---|---|
| FB-1 | S1, Coordinator A | "Gave me last term's deadline" | bug | yes, run 14 | trace link | fix now |
| FB-2 | S2, Student | "Answers feel long" | dislike | n/a | 3 of 3 mentioned | fix later |
| FB-3 | S3, Coordinator B | "Can it also grade assignments?" | requirement gap | n/a | not in PRD | out of scope |

Type is one of: dislike, bug, requirement gap. Decision is one of: fix now, fix later, accept as limitation, out of scope. Keep the raw quote untouched.

### Pass bar

- Every item has a type and a decision with a one-line reason.
- Every bug has a reproduction: input, expected output, actual output.
- Items you could not reproduce are marked so, not silently dropped.
- No requirement gap was quietly built; each went to a change decision.
- Fixes link to an evaluation case so they can be rerun later.

## Common misconceptions

- **"If a user complains, it is a bug."** A bug breaks agreed behavior. A complaint about tone or length may be a dislike, and a request for a new capability is a requirement gap.
- **"If I cannot reproduce it, ignore it."** Log it as unreproduced, ask for the exact input, and watch whether it recurs. Intermittent model behavior is common.
- **"Users know what they need."** They know their pain. Their proposed solution may be wrong, so ask what task failed.
- **"The most frequent comment is the top priority."** One data-integrity bug outranks five style comments. Keep raw quotes instead of merging them into a tidy theme, and promise no fix in the session before triage.

## Typical interview questions

<details>
<summary>How do you tell a bug from a requirement gap?</summary>

Check the agreed scope and acceptance criteria. If the system violates them, it is a bug. If the need was never written down, it is a gap and goes through change control, with time, cost, and risk stated.

</details>

<details>
<summary>Two testers contradict each other on answer length. What do you do?</summary>

Treat both as dislikes, record them, and check against the task goal. If answers are complete and correct, keep the default and consider a setting. Do not tune to one voice.

</details>

<details>
<summary>What would you do differently in how you collected feedback?</summary>

Name one real change, such as recording the exact input at the time of each complaint instead of recalling it afterward.

</details>

## Learn more

- Article: [The Mom Test](https://www.momtestbook.com/) (Rob Fitzpatrick, book site).
- Video: [How to Talk to Users](https://www.youtube.com/watch?v=MT4Ig2uqjTc) (Y Combinator).

## Related

- [Proxy User Testing](./01-proxy-user-testing.md)
- [Regression Rerun](./03-regression-rerun.md)
- [Close the Loop](../../m5/06-demo-feedback-and-change-management/04-close-the-loop-feedback-issue-priority-decision-change-log.md)
- [Classifying New Requests](../../m5/04-scope-prd-sow-acceptance-criteria-and-non-goals/05-classifying-new-requests-clarification-change-or-future.md)
