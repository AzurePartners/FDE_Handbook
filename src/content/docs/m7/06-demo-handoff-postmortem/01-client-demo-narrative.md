---
title: Client Demo Narrative
row: M7-L6.1
---
**In one sentence:** The client demo narrative is the fixed order in which you tell the story of your project: problem, old workflow, solution, live system, evidence, limits, and value.

## What it is

A demo is not a feature tour. It is a short argument that your system solves a business problem, backed by a live run and honest numbers. The order matters because each part answers the question the audience is already asking.

For the Course Support Assistant, the audience is the training provider's operations lead and two course coordinators. They do not care which retrieval method you used. They care whether students get correct answers and support agents spend fewer hours.

How to build toward a demo from day one is covered in [Demo-Driven Development](../../m5/06-demo-feedback-and-change-management/01-demo-driven-development.md) (M5), showing real failures in [Show Real Failures, Not Clean-Data Theater](../../m5/06-demo-feedback-and-change-management/02-show-real-failures-not-clean-data-theater.md), and value claims in [Measuring Value & ROI](../../m5/07-pilot-value-handoff-and-productization/04-measuring-value-and-roi.md). This page is the run-of-show you submit.

## Why an FDE needs this

Clients decide in the first minutes whether you understand their problem. If you open with architecture, you lose the room. If you hide limitations, the first wrong answer in the live run destroys trust. A fixed order protects you from both.

## Key concepts

### What you produce

A run-of-show with timing and the single message of each part.

| # | Part | Minutes | What you say or show |
|---|---|---|---|
| 1 | Business problem | 2 | Support agents answer the same policy questions in tickets every week. Students wait. |
| 2 | Original workflow | 2 | Ticket arrives, an agent searches shared folders, replies. Show the steps and where time goes. |
| 3 | Solution | 2 | One diagram: question, retrieval over course documents, cited answer, human fallback. |
| 4 | Working system | 6 | Live run on release candidate: a normal question, a changed deadline, an out-of-scope question. |
| 5 | Evaluation | 3 | Eval set size, rerun table, proxy test results, what failed. |
| 6 | Limitations | 2 | Written list, each with a workaround. |
| 7 | Business value | 2 | Baseline versus eval and proxy-test measures you actually have, plus next phase. |

Add a backup plan: recorded run, saved outputs, and a laptop that works offline.

### Pass bar

A reviewer watching the recording should see:

- All seven parts, in this order, within the time plan.
- The live run uses the release candidate, with a visible version label.
- At least one failure or refusal shown on purpose and explained.
- Every number on the evaluation and value slides traces to a file in your evidence folder.
- No claim of value without a baseline. Say "not measured yet" when true.
- A non-technical person could repeat the problem and the outcome afterward.

## Common misconceptions

- **"The demo should show everything the system can do."** Show the path that matters to the client. Extra features raise extra questions and dilute the story.
- **"Showing a failure makes me look bad."** A failure you found, explained, and contained shows judgment. A failure the client finds first looks like concealment.
- **"Business value means a big ROI number."** It means a defensible claim. A measured baseline and honest ranges beat a dramatic figure. Never present estimated savings as measured results.
- **"Lead with the tech stack to show depth."** Start with the business problem, include harder questions, not only the three easiest, and keep to the timing so limitations and value are not cut.

## Typical interview questions

<details>
<summary>Walk me through how you would structure a client demo.</summary>

Business problem, original workflow, solution, working system, evaluation, limitations, business value. Each part answers the next question the client has. The live system comes after they agree on the problem, and limits come before value so the value claim is credible.

</details>

<details>
<summary>Your live demo fails mid-run. What do you do?</summary>

Say what happened plainly, switch to the recorded run or saved outputs, and continue the story. Afterward, add the failure to the run log and the limitations list if it is real.

</details>

<details>
<summary>What would you do differently in this demo?</summary>

Pick one honest change, such as moving the failure example earlier so the evaluation section felt less defensive.

</details>

## Learn more

- Article: [GenAI Pilot Implementation with Real Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/) (Agility at Scale), on presenting measured results instead of impressions.

## Related

- [Release Candidate](../05-proxy-testing-release-candidate/04-release-candidate.md)
- [Stakeholder Pressure Test](./02-stakeholder-pressure-test.md)
- [Demo-Driven Development](../../m5/06-demo-feedback-and-change-management/01-demo-driven-development.md)
- [Show Real Failures, Not Clean-Data Theater](../../m5/06-demo-feedback-and-change-management/02-show-real-failures-not-clean-data-theater.md)
- [Case Study Structure](../../m8/01-portfolio-case-study-resume/01-case-study-structure.md) (M8)
- [Portfolio Composition](../../m8/01-portfolio-case-study-resume/04-portfolio-composition.md) (M8)
