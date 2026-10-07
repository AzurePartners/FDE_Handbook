---
title: FDE and Adjacent Roles
row: M8-L4.1
---
**In one sentence:** Forward Deployed Engineer, Applied AI Engineer, Solutions Engineer, AI Consultant, and their neighbors are told apart not by whether they write code but by three questions from Module 0 — does the code reach production, do field lessons feed a product the company owns, and is the role measured on outcomes — and knowing which answers you want decides where you apply and how you tell your story.

## What it is

Module 0 defines the FDE by what it is accountable for ([Four FDE Responsibilities, M0-L1.3](../../m0/01-what-is-an-fde/03-four-fde-responsibilities.md)) and gives three tests for placing any role ([Role Tests, M0-L2.2](../../m0/02-fde-vs-adjacent-roles/02-role-tests.md)). This page applies those to the job search. An FDE sits post-sale, builds on their own company's product inside customer environments, ships code that is held to production standards, carries what they learn back into the product, and is measured on outcomes such as adoption and the customer's metric. Every adjacent role gives a different answer to at least one of the three tests. Solutions and sales engineers sit pre-sale and write demo or proof-of-concept code, measured on technical wins. Solutions architects design and hand off. Applied AI Engineers (the title Anthropic and many AI startups use) answer the three tests the same way an FDE does, with more weight on evals and model quality. Technology consultants and systems integrators do design, build, and run production systems end to end, often with outcome-based contracts; what differs is that they work across many vendors' platforms and their reuse goes into the firm's methods rather than a product ([FDE vs Consultant and Systems Integrator, M0-L2.5](../../m0/02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)). Implementation and professional-services engineers configure a fixed product. Core software engineers build the product itself for all customers.

## Why an FDE needs this

Job descriptions conflate these titles constantly, and the recruiter screen opens with "why FDE and not SWE?" A candidate who cannot place the role cannot answer that. The distinction also shapes preparation: Palantir-style FDE loops test data engineering, ontology modeling, and decomposition; AI-lab loops test RAG, evals, agents, and customer conversation; solutions-engineering loops test demos and objection handling. Applying to the wrong square wastes months. And a dismissive answer about neighboring roles ("consultants just advise") signals to an interviewer that you do not know the market you are entering.

## Key concepts

### The comparison

| Role | Lifecycle position | Code reaches production? | Lessons feed a product the company owns? | Measured on | Accounts at once (a signal, not the definition) |
|---|---|---|---|---|---|
| Forward Deployed Engineer | Post-sale, embedded | Yes, held to production standards | Yes | Outcomes: adoption, the customer's metric, expansion | One to a handful; multi-customer variants running ten accounts exist (see M0-L2.1) |
| Applied AI Engineer | Post-sale, embedded or near-product | Yes | Yes | Outcomes, with an eval and quality bar | Few |
| Solutions Engineer / Sales Engineer | Pre-sale | Demo and PoC code | Indirectly, as feedback to product | Technical wins, deals closed | Many |
| Solutions Architect | Late pre-sale, early post-sale | Sometimes; reference designs | Sometimes | Design accepted and handed over | Several |
| Technology consultant / Systems integrator | Full lifecycle, often operates the result | Yes, often end to end | No; reuse goes into the firm's methods and accelerators | By contract: time, fixed scope, or outcomes | Several per team |
| Implementation / Professional services | Post-sale | Configuration, some code | Rarely | Configured product live | Several |
| Software Engineer (core) | Product | Yes, in the product | It is the product | Feature shipped for all customers | Not applicable |

### Account count is a signal, not the test

Module 0 describes an FDE who looks after ten customers at once, on call for all of them ([FDE Title Variation, M0-L2.1](../../m0/02-fde-vs-adjacent-roles/01-fde-title-variation.md)). A large account count tells you the four responsibilities are spread thinly, and that the role leans toward Production; it does not tell you whether it is FDE work. Read the count alongside the three tests.

### Reading a job posting

Use the six questions from M0-L2.1: where does the code end up running and who maintains it; what are you measured on; how many customers at once; is there a product the work builds on and feeds back into; who decides what to build; how much time is customer-facing. Then look for flavor: evals, RAG, and agents (AI-lab) versus pipelines, data modeling, and platform configuration (Palantir/Databricks).

### Answering "why FDE, not SWE?"

Connect to something you have already chosen to do: a time you worked directly with the users of what you built, owned an outcome rather than a ticket, or fixed a problem inside someone else's system. "I like talking to people" and "consulting but technical" are the answers that fail.

### Company families, as of 2026

Frontier AI labs (OpenAI, Anthropic, Cohere, Scale), enterprise data platforms (Palantir, Databricks, Snowflake), vertical AI startups (ElevenLabs, Sierra, Harvey, Decagon), and established companies adding FDE teams (Salesforce, Adobe, Ramp, Rippling, Big Four consultancies). Each family weights the loop differently.

## Common misconceptions

- **"Consultants just advise; FDEs build."** Technology consultants and systems integrators design, build, integrate, and run production systems, and many are paid on outcomes. What separates the FDE is the product: they deliver on top of their own company's product and what they learn goes back into it, so the next customer costs less to serve. See M0-L2.5.
- **"If they write production code, they are an FDE."** Outsourced teams and integrators do too. Look at where the lessons go and what the role is measured on (M0-L2.2).
- **"An FDE with ten accounts is really a solutions engineer."** Account count changes how thinly the responsibilities are spread, not whether the three tests are met. A solutions engineer is pre-sale and measured on deals, whatever the count.
- **"Applied AI Engineer is a research role."** At most companies it is the FDE role under another name, with more eval rigor.

## Typical interview questions

<details>
<summary>Why FDE and not a regular software engineering role?</summary>

Name a specific experience where you worked inside a customer's constraints, owned the outcome, and preferred it. Then say what you would miss in a core SWE role (the direct feedback loop, the messy real data) and what you would miss in a sales-side role (the ownership after the deal).

</details>

<details>
<summary>How is this different from a consultant?</summary>

Not by whether they write code; good technology consultants ship production systems. The difference is the product relationship: an FDE builds on their own company's product and feeds what they learn back into it, so the company's cost per customer falls over time, and the role is measured on outcomes rather than utilization. Say which of those you want and why.

</details>

<details>
<summary>How is this different from a solutions architect?</summary>

An architect designs and hands off across several accounts; an FDE builds inside the customer's environment, ships to production, is accountable when it breaks, and is measured on whether the customer's metric moved. Say which you want and why, with evidence from your own work.

</details>

<details>
<summary>What do you think an FDE actually does day to day?</summary>

Discovery conversations with stakeholders, production code (integrations, pipelines, RAG or agent components, internal tools), design under enterprise constraints (identity, network, compliance, legacy data), incident response, and feeding patterns back to the product team. Mention the travel or onsite reality for the company you are talking to, and how many accounts the posting implies.

</details>

## Learn more

- Handbook: [Role Tests (M0-L2.2)](../../m0/02-fde-vs-adjacent-roles/02-role-tests.md) — the three questions this page is built on
- Handbook: [FDE Title Variation (M0-L2.1)](../../m0/02-fde-vs-adjacent-roles/01-fde-title-variation.md) — reading a posting by responsibility; the six questions
- Handbook: [FDE vs Consultant and Systems Integrator (M0-L2.5)](../../m0/02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)
- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer; partially paywalled)
- Article: [Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir) — one capability for many customers vs. many capabilities for one customer
- Article: [Forward Deployed Engineer vs Applied AI Engineer (2026)](https://fde.academy/blog/forward-deployed-engineer-vs-applied-ai-engineer) (FDE Academy)
- Video: [Software 3.0](https://www.youtube.com/watch?v=LCEmiRjPEtQ) (Andrej Karpathy, YC AI Startup School) — vocabulary for describing AI-native roles

## Related

- [Background-Based Narratives](./02-background-based-narratives.md)
- [Skill-Gap Learning Plan](./04-skill-gap-learning-plan.md)
- [Introduction](../00-introduction/01-introduction.md)
