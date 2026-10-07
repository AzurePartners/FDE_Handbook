---
title: Live Scoping
row: M8-L3.2
---
**In one sentence:** Live scoping is stating, in the room, what the first version will do, what it will not do, how it will be validated, and when you will stop — a verbal PRD with non-goals that turns a decomposed problem into a plan the customer can say yes or no to.

## What it is

After clarification and decomposition, the case round wants a proposal. Live scoping is the discipline of making that proposal small, bounded, and testable: a first version scoped to one user group and one workflow slice, an explicit list of non-goals, a validation plan with a number and a date, and a stopping rule that says what result would end or redirect the work. It is Shape Up's appetite and no-gos, plus Module 5's acceptance criteria, delivered out loud in five minutes.

## Why an FDE needs this

Scope creep is the way FDE projects die, and interviewers know that candidates who cannot say "not in version one" will not be able to say it to a VP. Scoping live also shows sequencing judgment: which workstream is highest risk, what to prove first, and how to get evidence before the customer has spent much money. A proposal with non-goals and a stopping rule is what a customer can actually decide on; a proposal without them is a wish.

## Key concepts

### The four parts, spoken

1. **Will do:** one user group, one workflow slice, one output, end to end. "Version one drafts the rerouting recommendation for the North-East region's 40 managers; a manager approves every change."
2. **Will not do:** the tempting adjacent things, named. "It will not write to SAP, cover other regions, or handle customs holds."
3. **Validation:** the metric, the baseline, the number, the sample, the date. "Over four weeks we compare recommendation acceptance rate and time-to-decision against the current 50-case baseline; success is acceptance above 60% with no incorrect reroute reaching a customer."
4. **Stop or continue:** "If acceptance is under 30% at two weeks, we stop and revisit the data quality assumption before building anything else."

### Sequencing by risk, not by value

The first thing built is the thing most likely to kill the project. Usually that is data access or an integration, not model quality. Say why.

### Requirement types

Functional (what it does), non-functional (latency, accuracy threshold, availability), and constraints (security, data access, timeline). Put each in the right place; constraints are not negotiable in the scope conversation.

### Classifying new requests during the round

When the interviewer adds a request, classify it out loud: a clarification (absorb it), a formal change (name the trade: something leaves scope or the date moves), or future-phase work (record it, do not build it).

## Common misconceptions

- **"A bigger first version impresses more."** A small first version with a real validation plan impresses more, because it shows you have shipped before.
- **"Non-goals are negative."** Non-goals are what make the proposal trustworthy. Executives remember what you said you would not do and notice when you keep to it.
- **"The stopping rule sounds like planning to fail."** It sounds like knowing what evidence would change your mind, which is the core FDE trait.

## Typical interview questions

<details>
<summary>What does version one do, exactly?</summary>

Give the will-do sentence with the user group, workflow slice, and output. Then the non-goals in one breath. Then the validation number and date.

</details>

<details>
<summary>The customer wants three more regions in version one. Do you agree?</summary>

Classify it as a formal change and name the trade: "We can add regions, but each adds a data owner and a rule set; either version one moves out by roughly three weeks per region, or we keep the date and the extra regions become phase two. Which matters more to you, the date or the coverage?" Do not agree unconditionally; do not refuse without options.

</details>

<details>
<summary>How would you know in two weeks whether to keep going?</summary>

Name the leading indicator (recommendation acceptance, data completeness, integration success rate), the threshold, and what you would do at each side of it. Stopping rules are checked early, not at the end.

</details>

## Learn more

- Book: [Shape Up](https://basecamp.com/shapeup) (Basecamp, free) — appetite, boundaries, no-gos, scope hammering
- Reference: [Product requirements guide](https://www.atlassian.com/agile/product-management/requirements) (Atlassian) — PRD structure incl. non-goals
- Reference: [Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success) (Claude docs) — measurable acceptance criteria for AI outputs
- Article: [Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/) (Agility at Scale) — go/no-go thresholds and baselines

## Related

- [Ambiguous Problem Clarification](./01-ambiguous-problem-clarification.md)
- [MVP-First Design Evolution](../02-coding-debugging-system-design/03-mvp-first-design-evolution.md)
- [Stakeholder Simulation](./03-stakeholder-simulation.md)
