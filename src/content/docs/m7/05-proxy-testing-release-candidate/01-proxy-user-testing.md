---
title: Proxy User Testing
row: M7-L5.1
---
**In one sentence:** Proxy user testing means asking real users, or people who closely resemble them, to complete realistic tasks on your system while you watch and take notes.

## What it is

You have built the Course Support Assistant and tested it against your own evaluation set. Now someone who did not build it uses it. If a real target user is not available, a qualified proxy stands in: someone who does the same job or asks the same questions, such as a coordinator at another training provider, or a student from a different course.

You give each person a task, not a tutorial. "A student asks when the refund window closes. Find the answer using the assistant." Then you stay quiet and observe. You are looking for four things: did they finish, where were they confused, which outputs were low quality, and where did they hesitate or give up.

How to design a pilot and what blocks adoption are covered in [Designing a Pilot](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md) and [User-Adoption Friction](../../m5/07-pilot-value-handoff-and-productization/03-user-adoption-friction.md) (M5). This page is what you run and hand in.

## Why an FDE needs this

Your own eval set reflects your assumptions. Real users phrase questions differently, skip instructions, and use the tool in an order you never imagined. A coordinator may paste a whole email thread into the box. A student may type "refund??". None of that shows up in a test set you wrote yourself.


## Key concepts

### What you produce

A task sheet, run with at least three people (for the running example: two course coordinators and one student), and an observation log.

| Task ID | Persona | Task (one sentence) | Success looks like | Time limit |
|---|---|---|---|---|
| T1 | Student | Find the refund window for a paid course | Correct answer with a cited policy page | 3 min |
| T2 | Coordinator | Find the late-submission rule for Module 2 | Correct rule, source shown | 3 min |
| T3 | Student | Ask something the documents do not cover | Assistant says it does not know and points to a person | 3 min |
| T4 | Coordinator | Ask about a deadline that changed last week | Current deadline, not the old one | 5 min |

Per session, log: participant, task ID, completed (yes, partial, no), time taken, where they hesitated, exact quote of any confusion, and the output quality note.

### Pass bar

A reviewer should be able to open your log and confirm:

- At least three sessions, with at least one per persona type.
- Every task has a written success condition set before the session.
- Raw observations are recorded separately from your interpretation.
- At least one session surfaced a problem you did not expect, and it is in the log.
- Participants were not coached during tasks.

## Common misconceptions

- **"Three users is too few to learn anything."** For finding usability problems, a handful of sessions reveals most of the repeated ones. You are looking for patterns in behavior, not statistics.
- **"If they completed the task, there was no problem."** A user who finishes after three wrong attempts still hit friction. Record time, retries, and hesitation.
- **"A proxy is as good as the real user."** A proxy is a stand-in. State who they were and what differs, so the reviewer can judge how far to trust the result.

## Typical interview questions

<details>
<summary>Your real users are not available before the demo. How do you test?</summary>

Recruit qualified proxies who do the same job or ask the same questions, and write down how they differ from the real users. Use the same task sheet for everyone. In the report, label findings as proxy-based so the client knows what still needs confirmation in a pilot.

</details>

<details>
<summary>A participant gets stuck. Do you help?</summary>

Not during the task. Note where and how long they were stuck, then help after the time limit so the session continues. The stuck moment is the data.

</details>

<details>
<summary>What did you learn that your evaluation set missed?</summary>

Give one concrete case, such as a student typing a short, vague question that retrieval handled badly. Say what category it falls into and which change or eval case it produced.

</details>

## Learn more

- Article: [Usability Testing 101](https://www.nngroup.com/articles/usability-testing-101/) (Nielsen Norman Group).
- Article: [GenAI Pilot Implementation with Real Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/) (Agility at Scale).

## Related

- [Feedback Triage](./02-feedback-triage.md)
- [Evaluation Set and Baseline](../04-evaluation-hardening/01-evaluation-set-and-baseline.md)
- [Designing a Pilot](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md)
- [User-Adoption Friction](../../m5/07-pilot-value-handoff-and-productization/03-user-adoption-friction.md)
