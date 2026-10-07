---
title: Evidence-Based Resume Bullets
row: M8-L1.2
---
**In one sentence:** A resume bullet earns its place when it states scope, data, interfaces, evaluation, and outcome — five concrete facts a reviewer could check — instead of a verb attached to a buzzword such as "Built an AI agent."

## What it is

An evidence-based bullet is one or two lines that describe a piece of work by what it touched and what it changed. The five elements are: **scope** (what was in and out), **data** (what the system read, how much, how messy), **interfaces** (what it connected to: APIs, databases, MCP tools, a CRM), **evaluation** (how you measured it), and **outcome** (what changed, with the strength of that evidence stated). Not every bullet needs all five, but a bullet with none of them is noise.

## Why an FDE needs this

FDE resumes are read by people who have shipped inside customer environments and can tell in seconds whether a bullet describes real work. "Built an AI agent" could mean a weekend prompt or a year-long deployment. "Built a support assistant over 1,200 policy documents, integrated with the ticketing API, with a 40-case eval set that caught a retrieval regression before pilot" tells the reader exactly what you did and invites follow-up questions you can answer. The resume also sets up the hiring-manager screen: every bullet is a potential deep-dive, so each one should point at a story you can tell for five minutes.

## Key concepts

### Before and after

| Weak | Why it fails | Rewritten |
|---|---|---|
| Built an AI agent for customer support | No scope, no data, no eval, no result | Built a support assistant over 1,200 policy PDFs (RAG + 3 read-only ticket tools); 40-case eval set, groundedness 92% vs 61% baseline; piloted with 6 agents for 3 weeks |
| Used LLMs to automate research | Which step? Which source? Measured how? | Automated provider-list enrichment from the NPI Registry API; deduplicated 9,400 rows to 6,100 with a documented match policy; human review kept for specialty validation |
| Improved model accuracy | Which metric, which baseline, what changed | Cut wrong-refusal rate from 18% to 4% on a 120-case eval by separating policy lookup (deterministic) from answer drafting (model) |

### Two metrics per bullet where possible

One technical metric (eval score, latency, cost per task) and one business or workflow metric (hours saved, cases handled, tickets deflected). If you only have the technical one, say so rather than inventing the business one.

### Ownership language

Write "I" for what you did and "we" for what the team did, and keep them distinct. Hiring managers screen for people who can name their own contribution; "we built" on every line hides it.

### Scope honesty

If it was a side project, a class project, or a pilot with three users, say so in the bullet. Overclaiming on a small project breaks trust faster than a modest, accurate bullet ever could. See [Maturity Labeling](./03-maturity-labeling.md).

## Common misconceptions

- **"Numbers make any bullet strong."** A number without a baseline or a source ("improved accuracy by 40%") raises more questions than it answers. State what was measured, against what, on how many cases.
- **"Tools are the content."** A list of frameworks is a keyword match, not evidence. Name the stack once, precisely, and spend the rest of the line on what it did.
- **"Every bullet needs a business outcome."** Sometimes the honest outcome is "eval set built, pilot pending." Say that. Fabricated impact is the fastest way to fail the deep dive.

## Typical interview questions

<details>
<summary>Your resume says you improved accuracy from 61% to 92%. What was the eval set?</summary>

Give the size, how cases were selected (real tickets, synthetic edge cases, adversarial), who labeled them, and what "correct" meant. Then name what the set did not cover. If you cannot answer this, the bullet should not be on the resume.

</details>

<details>
<summary>What part of this was yours?</summary>

Name the components you designed and wrote, the decisions you made, and the parts a teammate owned. Interviewers respect a clear boundary more than an inflated one.

</details>

<details>
<summary>This bullet says "integrated with the CRM." Which API, what auth, what broke?</summary>

Have the specifics ready: the endpoint family, the auth mechanism (API key, OAuth, service account), the rate limit you hit, the failure you handled (timeouts, pagination, stale data). Interfaces are where FDE work gets hard, and interviewers know it.

</details>

## Learn more

- Reference: [Resume guide](https://www.techinterviewhandbook.org/resume/) (Tech Interview Handbook) — action + result, quantify impact, one page
- Article: [Forward Deployed Engineer Resume: Examples & Skills](https://www.tryexponent.com/blog/forward-deployed-engineer-resume) (Aced) — the bullet structure FDE managers respond to
- Article: [AI Engineer Resume Examples: LLM, RAG, Agents](https://resumeoptimizerpro.com/blog/ai-engineer-resume-examples) — before/after bullets that pair a tool with a measured outcome
- Article: [AI Engineer Resume Examples (annotated)](https://www.rejectless.app/ai-engineer-resume-examples) — scope honesty for side projects and entry-level resumes

## Related

- [Case Study Structure](./01-case-study-structure.md)
- [Maturity Labeling](./03-maturity-labeling.md)
- [Background-Based Narratives](../04-role-matching-narrative-job-search/02-background-based-narratives.md)
