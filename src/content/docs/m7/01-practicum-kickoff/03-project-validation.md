---
title: Project Validation
row: M7-L1.3
---
**In one sentence:** Project validation is a written check that your project is real, solvable, valuable and deliverable within your time and data limits, done before you commit to building.

## What it is

After discovery you hold a lot of evidence. Validation turns it into four yes or no questions, each with proof attached.

1. Real: does a user hit this problem often enough that someone notices?
2. Solvable: can current LLM techniques plausibly handle it, given the data you have?
3. Valuable: does fixing it save time, money or errors that someone cares about?
4. Deliverable: can you finish a useful MVP with your time, data and permissions?

The fourth question uses the idea of an appetite from [Shape Up](https://basecamp.com/shapeup/1.2-chapter-03): you decide how much time the problem deserves, then shape the solution to fit, instead of estimating an open-ended build. For a Course Support Assistant, an appetite might be "two weeks of build for a bounded set of FAQ and policy questions."

## Why an FDE needs this

Customers love ideas and rarely check them. An FDE who skips validation promises a "support agent that handles everything" and then learns that half of tickets need account lookups no one can connect. Validation is cheaper than discovering that in week four.

## Key concepts

How to design pilots and measure improvement is covered in [Designing a Pilot](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md) and [Baseline, Success Metrics, North Star & Attribution](../../m5/07-pilot-value-handoff-and-productization/02-baseline-success-metrics-north-star-and-attribution.md) (M5). Choosing an approach is in [The Architecture Decision Tree](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md) (M5).

### What you produce

A one-page Validation Note:

| Check | Evidence | Verdict |
|---|---|---|
| Real | Count from past tickets: how many ask the 20 most common questions | yes, no, unsure |
| Solvable | Answers exist in the documents; quick manual test of 10 questions | yes, no, unsure |
| Valuable | Agent time per ticket today (measured or stated, with source) | yes, no, unsure |
| Deliverable | Appetite, data access status, permissions | yes, no, unsure |

Plus two lines: the appetite (time you will spend) and the baseline you will measure against later.

### Pass bar

- Every verdict cites evidence you can show, not a feeling.
- Any figure is labeled as measured, estimated by the customer, or assumed.
- You ran at least one quick manual test, such as pasting 10 real questions with the policy text into a model to see if answers are plausible.
- A baseline exists, even a rough one, so later improvement can be measured.
- "Unsure" verdicts have a named way to resolve them, which feeds the next step.

### Example manual test

Take 10 real student questions, supply the refund policy, ask the model to answer only from the text, and mark each answer right, wrong or missing. If 3 of 10 fail because the policy is ambiguous, that is a data problem, found for free.

## Common misconceptions

- **"Validation means building a prototype."** A prototype is one tool. Often a manual test with a model and ten real questions is enough to learn what you need.
- **"A yes on four questions means go."** Four yes answers still need a decision. The [Go / No-Go Decision](./04-go-no-go-decision.md) weighs them together.
- **"Unsure means fail."** Unsure with a named test is honest and common. Unsure with no test is the real failure.

## Typical interview questions

<details>
<summary>How did you validate your project before building?</summary>

I wrote a Validation Note covering real, solvable, valuable and deliverable. For the Course Support Assistant I counted how many past tickets matched the top 20 questions, then ran ten of them through a model with the policy text to test solvability. I recorded agent time per ticket as the baseline.

</details>

<details>
<summary>What is an appetite and why set one?</summary>

An appetite is the amount of time a problem deserves, set before designing. It forces you to shape a solution that fits the time, instead of an estimate that grows to fit the solution.

</details>

<details>
<summary>What if your evidence is weak?</summary>

I would label figures as assumed, design the cheapest test that would firm them up, and carry it as an explicit risk into the go or no-go call.

</details>

## Learn more

- Book chapter: [Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03) (Shape Up, Basecamp, free online), on setting the appetite.

## Related

- [Discovery Pack](./02-discovery-pack.md)
- [Go / No-Go Decision](./04-go-no-go-decision.md)
- [Designing a Pilot](../../m5/07-pilot-value-handoff-and-productization/01-designing-a-pilot.md) (M5)
- [The Architecture Decision Tree](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/01-the-architecture-decision-tree.md) (M5)
