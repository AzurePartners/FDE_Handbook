---
title: FDE
row: M0-L1.1
---
**In one sentence:** A Forward Deployed Engineer (FDE) is an engineer embedded with a specific customer who is accountable for a system running, being used and producing a measurable result inside that customer's real systems, permissions and workflows.

## What it is

"Forward deployed" is borrowed from military usage: positioned near the front line rather than at headquarters. In software it means the engineer works where the customer's problem actually lives (their data, their systems, their people) instead of building for an abstract user from the vendor's office. Many FDEs work remotely; "forward" describes how close they are to the customer's problem, not where their desk is.

Palantir made the role well known in the 2010s. Since around 2024, AI companies and AI-agent startups have adopted it widely, because AI products rarely work out of the box inside a large organization. Bob McGrew, an early Palantir executive and later OpenAI's Chief Research Officer, describes the model as "doing things that don't scale, at scale."

The key word in the definition is **accountable**. An FDE is judged on whether the system works for that customer, not on lines of code written, hours billed or documents delivered.

## Why an FDE needs this

The definition decides what you optimize for. An engineer who thinks the job is "write code at the customer" stops when the code is merged. An engineer who knows the job is "make it work for the customer" keeps going through data access, evaluation, rollout, training and handoff, which is where most enterprise AI projects actually stall. Interviewers test this directly with questions such as "why FDE and not software engineering?"

## Key concepts

### What "working for the customer" means

| Condition | The question to ask | Typical way it fails |
|---|---|---|
| Runs in the real environment | Does it run on real data, with real permissions, outside the demo? | Stuck at proof of concept because data access or security review never finishes |
| Used by real users | Are the intended people using it in their daily work? | Launched, then ignored |
| Produces a measurable result | Did a metric that matters move against a baseline? | Nobody measured the "before," so value cannot be shown |
| Can be maintained | Can the customer or the product team run it after the FDE leaves? | Knowledge lives in one person's head |

### Why AI made the role spread

The gap between a demo and a working enterprise system is widest for AI. Model output is probabilistic, the useful data sits in many disconnected systems, agents need permissions that someone has to grant, and quality has to be proven with evaluation rather than assumed. A vendor cannot close that gap from headquarters; someone has to do it inside each customer.

### What the job is not

It is not only on-site coding, not only pre-sales demos and not only advice. Lesson 2 draws each boundary in detail.

## Common misconceptions

- **"An FDE is a software engineer who travels."** Location is incidental. The defining feature is accountability for the customer's outcome.
- **"FDE is customer support that writes code."** FDEs usually own production systems and often hold senior-level responsibility for a whole deployment.
- **"An FDE must be a machine-learning expert."** Most of the work is integration, data, evaluation and change management. How much ML depth is needed varies by company.

## Typical interview questions

<details>
<summary>Why do you want to be an FDE rather than a software engineer?</summary>

Anchor the answer in accountability, not travel or variety: you want to own whether a system actually works for a real customer, including the messy parts (data access, adoption, handoff), and you want your field experience to shape the product. Give one example from your past where you followed something through past "code merged."

</details>

<details>
<summary>In one sentence, what is an FDE responsible for?</summary>

Making the company's product or AI system run, get used and produce a measurable result inside one customer's real environment, and bringing what was learned back to the product.

</details>

<details>
<summary>When is a customer deployment "done"?</summary>

When it runs on real data in production, the intended users rely on it, a metric agreed in advance has moved against a baseline, and someone other than you can operate it. Merging the code or passing a demo is not "done."

</details>

## Learn more

- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer, about 20 min, partially paywalled) — how Palantir, OpenAI and others define and staff the role
- Video: [The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo) (Y Combinator Lightcone) — watch from 02:19, "The Role of a Forward Deployed Engineer," about 10 minutes

## Related

- [Four FDE Responsibilities](./03-four-fde-responsibilities.md)
- [FDE Title Variation](../02-fde-vs-adjacent-roles/01-fde-title-variation.md)
- [FDE vs Software Engineer and AI Engineer](../02-fde-vs-adjacent-roles/03-fde-vs-software-and-ai-engineer.md)
