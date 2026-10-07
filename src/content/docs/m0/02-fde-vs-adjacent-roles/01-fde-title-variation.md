---
title: FDE Title Variation
row: M0-L2.1
---
**In one sentence:** There is no universally accepted industry boundary for the FDE role; companies use the same title for model-optimization engineers, multi-customer delivery engineers and on-site prototypers, so judge a role by what it is accountable for, not by its name.

## What it is

Look at three people who all have "Forward Deployed Engineer" on their business card:

- One works at a model-infrastructure company and spends most of the week optimizing how customers' models run: latency, throughput, cost.
- One looks after ten customers at the same time, splits the week between meetings and building, and is on call for production incidents.
- One sits in a customer's office, collects requirements, uses AI coding tools to build a clickable prototype the same day, and hands the confirmed design to a backend team to build properly.

Same title, three different jobs. The reverse is also true: plenty of people do full FDE work under titles like solutions engineer, delivery engineer, applied AI engineer, deployment strategist or technical account manager.

This is not a naming mistake. The role grew up inside specific companies and spread to others, each of which adapted it to its own product and business model.

## Why an FDE needs this

You will read many job descriptions. If you expect every "FDE" posting to match one definition, you will either think this handbook is wrong or apply to roles that don't fit you. Reading by responsibility lets you compare postings fairly and ask the right questions in interviews.

## Key concepts

### Read a job description for responsibilities

Ask six questions of any posting:

1. Where does the code you write end up running, and who maintains it afterward?
2. What are you measured on: utilization, deals closed, customer outcomes, adoption?
3. How many customers do you serve at once?
4. Is there a product your work builds on and feeds back into?
5. Who decides what to build: you, an analyst, a sales team, the customer?
6. How much time is on site or customer-facing?

### Common variants

| Variant | Weighted toward | Signals in the posting |
|---|---|---|
| Platform or infrastructure FDE | Production | "optimize inference," "SDK," "performance," "integration" |
| Multi-customer delivery FDE | All four responsibilities, thinly | "own N accounts," "on-call," "end-to-end delivery" |
| On-site prototyper | Discovery | "gather requirements," "rapid prototyping," "hand off to engineering" |
| Echo-style strategist | Discovery and Adoption | "domain expertise," "executive stakeholders," "change management" |

## Common misconceptions

- **"The title tells you the job."** It tells you the company's vocabulary. The responsibilities tell you the job.
- **"An 'FDE' title is more senior than 'solutions engineer.'"** Not reliably. Compare scope, accountability and pay, not the label.
- **"If the posting doesn't say FDE, it isn't FDE work."** Many full FDE roles use older titles.

## Typical interview questions

<details>
<summary>What do you think an FDE does at our company?</summary>

Show that you read the posting by responsibility: summarize what it seems to own (for example, "production integrations for a handful of enterprise accounts, with input into the roadmap"), then ask one question that tests your reading, such as who maintains the code after a deployment ends.

</details>

<details>
<summary>What would you ask the hiring manager to understand this role?</summary>

Ask about the last deployment: is that code still running and who owns it; did anything built there end up in the product; what metric was the FDE judged on. The answers reveal the real role faster than the job description does.

</details>

## Learn more

- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer, about 10 min for the sections on how companies define the role) — how the role differs across Palantir, OpenAI and AI startups
- Practice: open three current FDE job postings from different companies and, for each, write one line on what it is accountable for (about 20 min)

## Related

- [Role Tests](./02-role-tests.md)
- [Four FDE Responsibilities](../01-what-is-an-fde/03-four-fde-responsibilities.md)
- [Echo and Delta Roles](../01-what-is-an-fde/04-echo-and-delta-roles.md)
