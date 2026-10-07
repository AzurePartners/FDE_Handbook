---
title: Ambiguous Problem Clarification
row: M8-L3.1
---
**In one sentence:** When a customer says "use AI to improve sales / efficiency / research quality," the first ten minutes belong to six questions — objective, users, workflow, data, baseline, constraints — and the interviewer is scoring whether you ask them before you propose anything.

## What it is

The decomposition or open-ended case round opens with a deliberately vague prompt from a role-played customer: a city wants faster emergency response, a bank wants unified fraud detection across three acquired systems, a pharma company wants researchers to query internal compound data. There is no correct architecture. There is a correct first move: clarify the six dimensions out loud, label your assumptions, and only then decompose. Palantir calls this round "decomposition" and publishes guidance on open-ended questions; every AI lab and most startups now run a version of it, and it is the round with the lowest pass rate.

## Why an FDE needs this

This is the Discovery step of the FDE lifecycle compressed into an hour. Interviewers are checking the same thing a customer's executive would: do you take the first sentence as the requirement, or do you find the problem behind it? Candidates who jump to a technical proposal in the first minute are the single most common rejection in FDE loops. Candidates who clarify, name what is missing, and make assumptions visible are demonstrating the exact behavior that keeps a deployment from building the wrong thing.

## Key concepts

### The six questions

| Dimension | What to ask | Why it changes the design |
|---|---|---|
| Objective | What would make this a success in six months? Which number moves? | Optimizing response time vs. cost vs. coverage produces different systems |
| Users | Who touches the output daily? Who decides? Who is skeptical? | Determines interface, permissions, and adoption risk |
| Workflow | How does this work today, step by step? Where does time go? | Reveals where AI should intervene and where it should not |
| Data | What exists, in what shape, how fresh, who owns it, can it leave the network? | Data access is usually the highest-risk unknown |
| Baseline | What is the current number? How is it measured? | Without a baseline there is no outcome |
| Constraints | Compliance, identity, budget, timeline, what must not change | Constraints eliminate options faster than preferences do |

### Assumptions, labeled

When the interviewer will not answer (often deliberately), state an assumption and mark it: "I will assume the call data has timestamps and location; if not, that becomes workstream zero." Revisit assumptions when new information arrives.

### Facts, opinions, incentives

From Module 5: separate what the customer knows from what they believe and what they want to be true. "Sales are down because reps spend too long on research" is an opinion until you see the workflow.

### The curveball

Expect a new constraint midway ("the data owner just said no external APIs"). Treat it as the real test: restate the objective, adjust the assumptions, and say what changes and what does not.

### Timing

Ten minutes clarifying, five stating assumptions and the success metric, then decomposition. Longer than that and you are stalling; shorter and you are guessing.

## Common misconceptions

- **"Asking questions wastes time."** The round is scored on the questions. A candidate who asks nothing and designs a perfect system for the wrong problem fails.
- **"I should propose a technology early to show competence."** Naming RAG or an agent before you know the workflow signals that you fit problems to tools.
- **"If the interviewer does not know the answer, the question was bad."** The interviewer withholding an answer is a prompt to make and label an assumption.

## Typical interview questions

<details>
<summary>A logistics customer says "we want an AI agent to handle shipment rerouting." What do you ask first?</summary>

Objective: what does a bad rerouting cost today, and what number do they want to move — late deliveries, cost, manager time? Users: who reroutes now, and who signs off? Workflow: walk me through one reroute from the alert to the change in the system. Data: which systems hold shipments, weather, and capacity, how fresh, and can the agent write to them? Baseline: how many reroutes a week, how long each takes, error rate. Constraints: must a human approve every change; which regions have different rules.

</details>

<details>
<summary>The customer cannot tell you the baseline. What now?</summary>

Say so, then propose how to get one in the first two weeks: sample 50 recent cases, time them, categorize outcomes. Make the baseline measurement the first deliverable and label the success metric as provisional until it exists.

</details>

<details>
<summary>Halfway through, the interviewer says the data cannot leave the customer's network. What changes?</summary>

Restate the objective, then walk the design: hosted inference is out unless a private deployment exists; redaction and on-premises retrieval become required; the eval set must be built inside the network. Say what does not change: the workflow, the success metric, and the human approval gate.

</details>

## Learn more

- Article: [How to Answer Decomposition Interview Questions](https://www.tryexponent.com/blog/decomposition-interview) (Aced) — the round worked end to end
- Article: [Forward Deployed Engineer interview questions (2026): every round](https://dev.to/manduks/forward-deployed-engineer-interview-questions-2026-every-round-with-real-examples-4klc) (DEV) — the case study as the round that decides offers
- Book: [The Mom Test](https://www.momtestbook.com/) (Rob Fitzpatrick) — ask about past behavior, not opinions
- Play: [5 Whys](https://www.atlassian.com/team-playbook/plays/5-whys) (Atlassian)
- Video: [How to Talk to Users](https://www.youtube.com/watch?v=MT4Ig2uqjTc) (Y Combinator, 32 min) — the five core questions, no pitching
- Reference: [Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success) (Claude docs) — turning an objective into a measurable target

## Related

- [Live Scoping](./02-live-scoping.md)
- [Handling Unknowns](./04-handling-unknowns.md)
- [End-to-End AI System Design](../02-coding-debugging-system-design/02-end-to-end-ai-system-design.md)
