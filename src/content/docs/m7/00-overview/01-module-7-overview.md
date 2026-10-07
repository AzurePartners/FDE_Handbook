---
title: "Module 7: FDE End-to-End Practicum"
---
**In one sentence:** In the practicum you take one customer-style project from discovery to handoff, producing the same evidence a real Forward Deployed Engineer would hand a client.

## What it is

Modules 1 to 6 teach the parts; Module 7 applies them to one project. You pick an approved use case, run discovery, freeze an MVP, build it, test it with real or proxy users, and defend it to stakeholders.

The module is not tied to a fixed number of weeks: plan on 52 to 78 hours in total. Each stage ends with a gate, a deliverable a reviewer checks before you move on.

Each page gives **What you produce** and a **Pass bar**, and links to the concept pages in earlier modules.

## Why an FDE needs this

Interviewers for FDE roles rarely ask "can you build an agent?" They ask "tell me about something you delivered": what the customer needed, what you cut, what broke, and what you handed over. The practicum leaves you with that story and the documents to back it up, which become your portfolio: see [Case Study Structure](../../m8/01-portfolio-case-study-resume/01-case-study-structure.md) and [Portfolio Composition](../../m8/01-portfolio-case-study-resume/04-portfolio-composition.md) (M8).

## Key concepts

### What you produce

One gate deliverable per stage:

| Stage | Gate deliverable | Estimated time |
|---|---|---|
| 1. Practicum kickoff | Approved Problem Brief and Discovery Pack, plus a go / no-go decision | 6 to 10 hours |
| 2. Architecture and MVP freeze | Mini PRD, architecture map with at least two ADRs, frozen MVP scope | 10 to 14 hours |
| 3. Alpha build | One end-to-end path that someone else can run from your instructions | 12 to 18 hours |
| 4. Evaluation and hardening | Beta with evaluation results, failure report, prioritized fixes | 10 to 14 hours |
| 5. Proxy user testing | Release Candidate with a feedback log and next-phase plan | 8 to 12 hours |
| 6. Demo, defense and handoff | Client demo, handoff package, individual postmortem | 6 to 10 hours |

The stages map onto the [FDE Delivery Lifecycle](../../m0/03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md) (M0): stage 1 is Qualify and Discover, 2 is Define, 3 is Build and Integrate, 4 is Evaluate, 5 is Deploy and Adopt with proxy users, and 6 is Handoff. The postmortem's reusable assets feed Productize.

### How gates work

A program reviewer (a mentor, teacher or AI engineer) checks each gate; this is the "reviewer" on every page. Submit the gate deliverable through the program's submission channel. A failed gate is resubmitted after you fix what the reviewer names. The module is pass/fail per gate: you pass when all six gates are signed off, in order.

### Choosing a project

Most learners adapt an M6 archetype; an original project in an approved domain is allowed if the reviewer approves its Problem Brief. Approved domains are Finance, Healthcare, Content, Education, or another the reviewer approves. Each archetype has a PRD and technical design to compare against:

- [Tutor / Support RAG](../../m6/01-education-rag/01-case-overview.md)
- [Content Operations](../../m6/02-content-operations/01-case-overview.md)
- [Provider Research](../../m6/03-provider-research/01-case-overview.md)
- [Trading Desk](../../m6/04-trading-desk/01-case-overview.md)

The [Cross-Case Comparison](../../m6/05-cross-case/01-comparison.md) compares their difficulty. This module's examples follow the Course Support Assistant, built from Tutor / Support RAG.

## Common misconceptions

- **"The practicum is about building the most impressive agent."** A narrow system with honest evaluation and a clean handoff beats an ambitious one that only works in the demo.
- **"I can skip discovery because I already know what to build."** Reviewers check the Discovery Pack first; a project without a validated problem does not pass stage 1.
- **"Finishing every feature is the goal."** The gates check a frozen scope and a clear list of what you deferred.

## Typical interview questions

<details>
<summary>Walk me through a project you delivered end to end.</summary>

Use the demo narrative order: problem, original workflow, solution, working system, evaluation, limitations, value. Mention one cut and one failure you found and fixed.

</details>

<details>
<summary>How did you decide your project was worth building?</summary>

Point to the validation step: evidence the problem is real, a check that the data and permissions were available, an estimate of value, and a go / no-go decision made before writing code.

</details>

## Learn more

- Book: Shape Up (Basecamp, free online): [Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03), [Get One Piece Done](https://basecamp.com/shapeup/3.2-chapter-11), [Decide When to Stop](https://basecamp.com/shapeup/3.5-chapter-14).

## Related

- [Project Selection](../01-practicum-kickoff/01-project-selection.md)
- [Client Demo Narrative](../06-demo-handoff-postmortem/01-client-demo-narrative.md)
- [FDE Delivery Lifecycle](../../m0/03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md) (M0)
- [Case Study Structure](../../m8/01-portfolio-case-study-resume/01-case-study-structure.md) (M8)
- [Portfolio Composition](../../m8/01-portfolio-case-study-resume/04-portfolio-composition.md) (M8)
