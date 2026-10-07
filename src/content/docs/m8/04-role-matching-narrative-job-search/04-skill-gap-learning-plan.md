---
title: Skill-Gap Learning Plan
row: M8-L4.4
---
**In one sentence:** A skill-gap plan rates yourself on the eight FDE capability dimensions at one of four proficiency levels — Know, Use, Build, Design — compares that against the roles you are targeting, and turns the difference into a short, dated list of things to build, not things to read.

## What it is

The curriculum's capability model (M5-L1.4) has eight dimensions: Systems, AI, Agents, Integration, Production, Discovery, Communication, Domain. The rubric has four levels. **Know**: you can explain it and recognize it in someone else's system. **Use**: you can operate an existing implementation and configure it. **Build**: you can implement it yourself from a spec, with tests. **Design**: you can choose it over alternatives for a given customer, justify the trade-offs, and specify it for others to build. The plan is a table with your current level, the target role's expected level, and one artifact per gap.

## Why an FDE needs this

FDE roles weight the dimensions differently: a Palantir-style role expects Build on Integration and Systems and Use on AI; an AI-lab role expects Build on AI and Agents and Design on Discovery; a vertical AI startup expects Design on Domain. Knowing your levels tells you which square to apply to (see [FDE and Adjacent Roles](./01-fde-and-adjacent-roles.md)) and what to say when an interviewer asks "what's missing?" It also keeps preparation honest: reading about observability moves you from nothing to Know; only instrumenting a real system moves you to Build.

## Key concepts

### The self-assessment table

| Dimension | What "Build" looks like | What "Design" looks like |
|---|---|---|
| Systems | You have deployed and debugged a service with a database, queue, and external API | You choose between compute, storage, and messaging options for a customer's constraints |
| AI | You have implemented RAG or structured output with an eval set | You choose RAG vs long context vs fine-tuning for a case and defend it |
| Agents | You have built a tool-calling loop with validation and a stop condition | You decide workflow vs single agent vs multi-agent from evidence |
| Integration | You have connected to a real API with auth, pagination, retries, and error returns | You specify a connector contract others can implement |
| Production | You have added logs, traces, metrics, and one alert to a system you ran | You define what "production" requires for a customer and sequence it |
| Discovery | You have run interviews and produced a stakeholder map and PRD | You reconcile conflicting stakeholders and set non-goals a customer accepts |
| Communication | You have demoed to non-technical users and written weekly status updates | You deliver bad news and negotiate trade-offs with executives |
| Domain | You can model one industry's workflow and data | You can spot which parts of a problem are domain-specific and which are generic |

### Gap to artifact

Every gap becomes one buildable thing with a date: "Production: Use → Build. Add OpenTelemetry traces and one alert to the capstone by October 20; write it up as artifact #3." Reading lists are inputs to artifacts, not plans on their own.

### Sequencing

Close the gap that most often fails candidates in your target loop first. For AI-lab loops, that is usually Discovery/Communication (the case and simulation rounds); for Palantir-style loops, it is Integration/Systems depth.

### Revisit after every interview

Each rejection or difficult round is a data point. Update the table the same day, before memory fades.

## Common misconceptions

- **"I need Design on everything."** No role requires it. Most FDE roles need Build on three or four dimensions and Know or Use on the rest, with Design on one.
- **"Certifications close gaps."** They move you to Know. Interviewers test Build and Design with your own artifacts.
- **"The plan is a one-time exercise."** It is the running document of your job search; the portfolio and the plan should always agree.

## Typical interview questions

<details>
<summary>What is the biggest gap between you and this role?</summary>

Name a dimension and a level honestly ("I am at Use on production observability; I have read dashboards but only instrumented one small service"), what you have done about it, and what you would want in the first 90 days. Specific beats humble.

</details>

<details>
<summary>How would you spend your first 30/60/90 days?</summary>

Days 1–30: learn the product and the customer's environment, shadow calls, ship one small win. Days 31–60: own one deployment end to end and build one reusable integration. Days 61–90: drive an improvement across customers and propose a process or tool that increases the team's throughput. Tie one item to your named gap.

</details>

<details>
<summary>How do you keep your skills current in a field that changes monthly?</summary>

Describe a loop, not a list: a small eval or connector you rebuild when a model or tool changes, a set of sources you read, and a note file of what changed your mind. Mention one concrete thing you changed in the last quarter because of new evidence.

</details>

## Learn more

- Course rubric: the eight-dimension self-assessment and the Know / Use / Build / Design levels (Module 5, Lesson 1) — no external resource needed
- Article: [Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde) (Aced) — the 6-week plan and the self-audit in week one
- Article: [Forward Deployed Engineer Interview Guide 2026](https://www.sundeepteki.org/advice/the-definitive-guide-to-forward-deployed-engineer-interviews-in-2026) (Sundeep Teki) — how role emphasis differs by company
- Reference: [Behavioral interviews](https://www.techinterviewhandbook.org/behavioral-interview/) (Tech Interview Handbook) — answering "what is your weakness?" with evidence

## Related

- [FDE and Adjacent Roles](./01-fde-and-adjacent-roles.md)
- [Portfolio Composition](../01-portfolio-case-study-resume/04-portfolio-composition.md)
- [Background-Based Narratives](./02-background-based-narratives.md)
