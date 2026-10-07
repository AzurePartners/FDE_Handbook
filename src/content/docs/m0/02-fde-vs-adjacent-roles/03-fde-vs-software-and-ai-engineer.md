---
title: FDE vs Software Engineer and AI Engineer
row: M0-L2.3
---
**In one sentence:** A software or AI engineer builds and improves the company's own product for many users; an FDE starts from one customer's problem, builds what that customer needs on top of the product, and owns whether it works there.

## What it is

Software engineers (SWEs) and AI engineers work on the product itself. Their starting point is the roadmap; their users are mostly people they will never meet; their environment is the company's own stack. An AI engineer specializes in the model-facing parts: prompts, retrieval, tool calling, evaluation, fine-tuning.

An FDE uses many of the same skills, which is why Modules 1–4 of this handbook look like a software and AI engineering curriculum. What changes is the context: the starting point is one customer's problem, the users are specific people in one organization, and the environment is someone else's systems, data, security rules and legacy code.

## Why an FDE needs this

"Why FDE and not software engineering?" is one of the most common interview questions, and many candidates answer it badly ("I like talking to people"). A clear comparison lets you answer in terms of responsibility and environment.

## Key concepts

| | Software / AI engineer | FDE |
|---|---|---|
| Starting point | Product roadmap | One customer's problem |
| Users | Many, mostly anonymous | Named people in one organization |
| Environment | The company's own stack, which the team controls | The customer's systems, permissions and legacy, which nobody on the team controls |
| Success | Feature quality and adoption across the user base | This customer's outcome |
| Where the code lives | The main product repository | Product contributions plus customer-specific integrations |
| Typical feedback loop | Metrics and user research at scale | Direct conversations, daily |

### Shared skills, different weighting

Both roles need to read and write production code, design systems and evaluate AI behavior. The FDE additionally needs to work inside constraints they cannot change (a customer's identity provider, a database they can only read, a security review with a six-week queue) and to run discovery and adoption, which product engineers rarely own.

### Movement in both directions

Engineers move from SWE to FDE for closer contact with customer impact and faster feedback, and from FDE to SWE or product roles for deeper ownership of a single system. Both moves are common; neither is a demotion.

## Common misconceptions

- **"FDE code is throwaway."** FDE code runs in production at the customer and is held to the same standards; customer-specific is not the same as low quality.
- **"Strong SWE skills are enough to be a good FDE."** They are necessary, not sufficient. Most FDE failures are discovery or adoption failures, not coding failures.
- **"FDE is a step down from SWE."** It is a different trade-off: less depth in one system, more breadth and more direct accountability for outcomes.

## Typical interview questions

<details>
<summary>Why FDE and not a product engineering role?</summary>

Talk about what you want to be accountable for: a working outcome for a real customer, including the parts outside the code. Mention the environment you want to work in (other people's systems, real constraints) and one example where you already did this kind of work.

</details>

<details>
<summary>What is harder about writing code in a customer's environment than in your own company's?</summary>

You don't control the environment: access takes time, data is messier than expected, security rules limit what you can deploy, and you may have to integrate with systems nobody fully understands. You also have to leave the code in a state someone else can run.

</details>

## Learn more

- Article: [Dev versus Delta: Demystifying Engineering Roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir blog, Dev section) — product engineering as Palantir defines it
- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer) — how FDE work differs from product engineering day to day

## Related

- [Many Capabilities for One Customer](../01-what-is-an-fde/02-many-capabilities-for-one-customer.md)
- [Role Tests](./02-role-tests.md)
- [Lifecycle-to-Module Map](../03-delivery-lifecycle-and-handbook-map/02-lifecycle-to-module-map.md)
