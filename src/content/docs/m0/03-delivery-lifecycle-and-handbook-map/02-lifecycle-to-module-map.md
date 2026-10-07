---
title: Lifecycle-to-Module Map
row: M0-L3.2
---
**In one sentence:** Each stage of the FDE lifecycle draws on a specific part of this handbook, so the 44 lessons after Module 0 form a capability map rather than a list of topics.

## What it is

| Stage | Where the capability is built | What you learn there |
|---|---|---|
| Qualify, Discover | Module 5, Lessons 2–3 | Discovery interviews, stakeholder maps, as-is / to-be workflows |
| Define | Module 5, Lessons 4–5 | Scope, PRD and SOW, acceptance criteria, choosing the simplest architecture |
| Build | Modules 1–3 | Software systems (M1), AI application engineering (M2), agent engineering (M3) |
| Build, with the customer | Module 5, Lesson 6 | Demos, feedback and change requests |
| Integrate | Module 4, Lessons 1–3 | APIs and MCP connectors, authentication and permissions, real-world data |
| Evaluate | Module 2, Lesson 5; Module 3, Lesson 6 | Evaluating AI applications; evaluating, tracing and debugging agents |
| Deploy | Module 4, Lessons 4–5 | Reliability, cost and scale; deployment, CI/CD and observability |
| Adopt, Handoff, Productize | Module 5, Lesson 7 | Pilots, business value, handoff and productization |

Three modules cover the whole loop rather than one stage:

- **Module 6** applies the lifecycle to four use-case archetypes of increasing complexity (a support RAG application, a content workflow, provider research and outreach, a multi-agent research desk).
- **Module 7** is the practicum: you run the full lifecycle yourself, from Discovery to Handoff.
- **Module 8** turns that work into evidence for FDE interviews.

## Why an FDE needs this

It answers the question every new reader has: "why do I need to learn this?" When a lesson in Module 4 feels like pure infrastructure, the map shows which stage of a customer engagement it serves. It also helps you plan: if your weakest responsibility is Adoption, you know which lesson to prioritize.

## Key concepts

### Modules 1–4 are the Production responsibility

Four of the eight content modules serve Production. That reflects reality: in enterprise AI, making something run safely in a real environment is where most of the engineering effort goes.

### Module 5 is where the FDE-specific skills live

Discovery, scoping, change management, adoption and productization are what separate an FDE from a strong engineer. Module 5 covers both ends of the lifecycle.

### Evaluation appears twice on purpose

Evaluating a single AI application (Module 2) and evaluating a multi-step agent (Module 3) need different methods. Both feed the Evaluate stage.

## Common misconceptions

- **"The modules should be read strictly in order."** They are ordered for a beginner. Experienced readers can jump to the stage they need; see [Handbook Reading Paths](./03-handbook-reading-paths.md).
- **"Module 5 is the soft-skills module."** It contains concrete artifacts (stakeholder maps, PRDs, acceptance criteria, pilot metrics) that are graded as strictly as code.

## Typical interview questions

<details>
<summary>Which part of FDE work are you least prepared for, and how are you closing the gap?</summary>

Name a stage, not a vague skill ("Integrate: I haven't worked with enterprise identity and permissions"). Then name the concrete step you are taking and the artifact you will be able to show.

</details>

## Learn more

- No external resource needed. Use the Module Overview for hours per module, and the Introduction of each module for its lesson list.

## Related

- [FDE Delivery Lifecycle](./01-fde-delivery-lifecycle.md)
- [Handbook Reading Paths](./03-handbook-reading-paths.md)
- [Four FDE Responsibilities](../01-what-is-an-fde/03-four-fde-responsibilities.md)
