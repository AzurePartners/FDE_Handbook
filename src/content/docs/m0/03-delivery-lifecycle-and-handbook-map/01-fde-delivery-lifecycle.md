---
title: FDE Delivery Lifecycle
row: M0-L3.1
---
**In one sentence:** An FDE engagement moves through ten stages (Qualify → Discover → Define → Build → Integrate → Evaluate → Deploy → Adopt → Handoff → Productize), which group into the four responsibilities: Discovery, Production, Adoption and Feedback.

## What it is

The lifecycle is the four responsibilities from Lesson 1 broken into the stages you actually work through on a customer engagement.

| Stage | Key question | Typical output | Responsibility |
|---|---|---|---|
| **Qualify** | Is this worth doing, and can we do it? | Go / no-go, a sponsor, known constraints | Discovery |
| **Discover** | What is the real problem, and how does the work happen today? | Stakeholder map, as-is workflow, baseline | Discovery |
| **Define** | What exactly will we build, and how will we know it worked? | Scope, PRD or SOW, acceptance criteria, architecture hypothesis | Discovery |
| **Build** | Can we make the narrowest useful path work? | A running end-to-end slice, regular demos | Production |
| **Integrate** | Does it work with the customer's real data, systems and permissions? | Connectors, access, data contracts | Production |
| **Evaluate** | Does it work reliably enough to trust? | Eval set, failure report, fixes | Production |
| **Deploy** | Does it run in production and can we see what it is doing? | Deployment, monitoring, runbook | Production |
| **Adopt** | Do real users use it, and does the metric move? | Pilot results, training, workflow change | Adoption |
| **Handoff** | Can someone other than the FDE run it? | Operating guide, ownership of each failure mode | Adoption |
| **Productize** | What goes back into the product? | Reusable assets, product feedback | Feedback |

## Why an FDE needs this

It is the outline of every engagement you will run and the structure behind every later module. It also gives you a shared vocabulary with customers and colleagues ("we are still in Integrate; security review is the blocker").

## Key concepts

### It is not a waterfall

Build, Integrate and Evaluate loop many times. Good FDEs show a narrow working path early and often (demo-driven development) instead of building everything for one big reveal. Adoption problems often send you back to Define, because what users actually do reveals a different problem.

### Each stage has an exit question

Moving on before a stage's question is answered is the most common cause of late failure: building before the problem is defined, deploying before evaluation, declaring success before adoption.

### Production is four stages, not one

Beginners often think of "build" as the whole engineering job. In enterprise AI, Integrate, Evaluate and Deploy are where most of the time goes: data access, permissions, quality proof and operability.

## Common misconceptions

- **"Deploy is the finish line."** Three stages come after it, and they decide whether the project created value.
- **"Each stage needs a formal sign-off."** Small engagements move through several stages in a week. The stages are questions to answer, not paperwork.
- **"Qualify is a sales step."** Saying no to a bad use case is one of the most valuable things an FDE does.

## Typical interview questions

<details>
<summary>Walk me through how you would run a twelve-week engagement with a new customer.</summary>

Spend the first one to two weeks on Qualify and Discover (stakeholders, current workflow, baseline, data access requests started on day one). Define a narrow scope with acceptance criteria. Build and demo a thin end-to-end path within the first month, then loop Integrate and Evaluate. Deploy to a pilot group, measure adoption against the baseline, prepare the handoff and list what should go back to the product.

</details>

<details>
<summary>Which stage do projects most often get stuck in, and why?</summary>

Usually Integrate: data access, permissions and security review take far longer than building. Starting those requests during Discovery is the standard mitigation.

</details>

## Learn more

- Article: [A Day in the Life of a Palantir Forward Deployed Software Engineer](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1) (Palantir blog, about 10 min) — several of these stages in one working week
- Video: [The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo) (Y Combinator) — chapter 41:14, "Building with Demo-Driven Development," about 4 minutes

## Related

- [Lifecycle-to-Module Map](./02-lifecycle-to-module-map.md)
- [Four FDE Responsibilities](../01-what-is-an-fde/03-four-fde-responsibilities.md)
- [Many Capabilities for One Customer](../01-what-is-an-fde/02-many-capabilities-for-one-customer.md)
