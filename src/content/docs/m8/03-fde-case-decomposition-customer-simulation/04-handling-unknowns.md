---
title: Handling Unknowns
row: M8-L3.4
---
**In one sentence:** When you do not know, the scored answer is "I don't know yet — here is how I would find out in a week": acknowledge the gap, name the cheapest experiment that closes it, and give a date, instead of inventing a confident answer on the spot.

## What it is

Every FDE round contains a question you cannot answer: the customer's data volume, whether an API supports the call you need, how a regulation applies, whether the model can handle a document type. Handling unknowns is a three-part reply — the gap stated plainly, a validation plan with a method and a duration, and what you will do in the meantime — delivered without apology and without bluffing. It is the interview form of Module 5's "clearly state which conclusions remain unverified."

## Why an FDE needs this

Customers make decisions on what you tell them. A confident wrong answer in a discovery meeting becomes a wrong architecture six weeks later. Interviewers therefore probe until they find the edge of your knowledge, and then watch what you do. Bluffing is detected immediately by anyone who has done the work; a validation plan is scored as the strongest possible answer because it is what the job requires every week.

## Key concepts

### The three-part reply

1. **The gap:** "I don't know whether their claims system exposes an API or only nightly exports."
2. **The plan:** "In week one I would get read access to one environment, pull the schema and a 100-row sample, and test one call. That tells us whether we integrate live or batch."
3. **Meanwhile:** "I would design the ingestion boundary so either path plugs in, and keep the decision open in the ADR until the sample is in hand."

### Cheapest experiment first

A sample export, a single API call, a 20-case eval on the document type, one interview with the actual user. The plan should be measured in days, not sprints.

### Distinguish the kinds of unknown

Facts you can look up (an API's rate limit), facts only the customer has (their volume), and things nobody knows until tested (whether the model handles their PDFs). Say which kind it is; the plan differs.

### Labeling in the moment

"Assumption," "verified," "unverified" are useful words in a whiteboard session. Mark each conclusion as you go so the interviewer can see you tracking evidence strength.

### Known limitations as a deliverable

In a project, the list of unknowns becomes the known-limitations section of the handoff package. In an interview, mentioning that you would write that section is itself a signal.

## Common misconceptions

- **"Admitting I don't know looks weak."** Bluffing looks weak the moment it is caught, which is usually the next question. A plan looks strong.
- **"I should hedge everything."** Hedging is not the same as scoping an unknown. Be confident about what you know, precise about what you do not, and specific about how you will find out.
- **"The validation plan can be 'do more research.'"** It must name a method, a sample, and a duration. "I'd look into it" is not a plan.

## Typical interview questions

<details>
<summary>Will the model handle the customer's scanned claim forms accurately enough?</summary>

"I don't know yet; scanned forms vary a lot by scanner and template. In the first week I'd pull 30 representative forms across their top three templates, run OCR plus extraction, and have a claims analyst label the fields. That gives a field-level accuracy number and tells us whether we need a layout-aware parser or a human check on specific fields. Until then I'd keep extraction behind a review step."

</details>

<details>
<summary>How much will this cost per month at their volume?</summary>

Give the formula, not a number: calls per task × tokens per call × price, plus retrieval and storage. State what you would need to fill it in (their monthly volume, average document length) and offer a bounded estimate from a comparable deployment, labeled as an estimate with its assumptions.

</details>

<details>
<summary>Does their data residency rule allow this?</summary>

Say what you know about the rule's typical shape, what specifically you would need to confirm (which jurisdiction, whether derived data counts, whether the provider's region option satisfies it), and who confirms it: their legal or compliance owner, in writing, before the design is frozen.

</details>

## Learn more

- Article: [Forward Deployed Engineer interview questions (2026): every round](https://dev.to/manduks/forward-deployed-engineer-interview-questions-2026-every-round-with-real-examples-4klc) (DEV) — how case-round graders treat unknowns
- Book: [Shape Up](https://basecamp.com/shapeup) (Basecamp) — mapping unknowns and rabbit holes before betting
- Book: [The Mom Test](https://www.momtestbook.com/) (Rob Fitzpatrick) — separating facts from fluff in what customers tell you
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic) — small evals as the fastest way to close "will the model handle this?"

## Related

- [Ambiguous Problem Clarification](./01-ambiguous-problem-clarification.md)
- [Stakeholder Simulation](./03-stakeholder-simulation.md)
- [Technical Debt and Architecture Change Stories](../02-coding-debugging-system-design/04-technical-debt-and-architecture-change-stories.md)
