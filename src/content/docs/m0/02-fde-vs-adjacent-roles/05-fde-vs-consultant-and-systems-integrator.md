---
title: FDE vs Consultant and Systems Integrator
row: M0-L2.5
---
**In one sentence:** End-to-end consulting firms can also take a project from discovery through production, so the difference is not who writes code; an FDE delivers on top of their own company's product and feeds what they learn back into it, so each next customer costs less to serve.

## What it is

"Consulting" covers a wide range of work:

- **Strategy and management consulting** produces analysis, recommendations and roadmaps. Code is rare.
- **Technology consulting and systems integration** (the large firms such as Accenture, Deloitte, Capgemini, IBM Consulting and Thoughtworks, plus many smaller ones) designs, builds, integrates, tests, deploys and often operates production systems end to end, with large engineering teams and managed-service contracts.

So the common shorthand "consultants write slide decks, FDEs write code" is wrong for a large part of the industry. A technology consulting team can run discovery, design an architecture, write production code, integrate it with a dozen enterprise systems and carry it into production. Whatever separates an FDE from that work, it is not code.

## Why an FDE needs this

You will work next to consultants constantly: a customer's systems integrator often owns the surrounding systems, and many vendors deliver through consulting partners. You will also be asked in interviews how your role differs. A precise answer earns respect; a dismissive one ("consultants just advise") signals that you don't know the market.

## Key concepts

### What actually differs

| | Strategy consulting | Technology consulting / SI | FDE |
|---|---|---|---|
| Writes production code | Rarely | Yes | Yes |
| Owns the production outcome | No | Often, as defined by the contract | Yes |
| Builds on its own company's product | No | Usually not; works across many vendors' platforms | Yes |
| Where reusable lessons go | Frameworks and methods | The firm's methods, accelerators and delivery assets | The product itself |
| Revenue scales with | People | People (even under fixed-price or outcome deals) | Product usage |
| Typical end state | Recommendation delivered | Handed to the customer or run as a managed service | Handed to the customer, with general parts absorbed into the product |

### Product relationship is the anchor

Systems integrators do build reusable assets: accelerators, reference architectures, templates. The difference is where that reuse lives and how it pays off. In a consulting firm it improves the firm's delivery capability, and the business still grows by adding people. In an FDE's company it goes into a product every customer receives, so the people required per customer should fall over time. That is the "reusable product leverage" the [Role Tests](./02-role-tests.md) describe.

### When an FDE team turns into consulting

An FDE organization with no feedback into the product, with staff measured on utilization and every engagement built from scratch, is economically a consulting business inside a software company. McGrew discusses exactly this risk on Y Combinator's Lightcone podcast: the FDE model only works if the product team generalizes what the field builds.

### They often work together

Vendors frequently deliver through SI partners. A common pattern: the SI owns the customer's broader program and surrounding integrations; the vendor's FDE owns making the product work inside it and bringing lessons home.

## Common misconceptions

- **"Consultants only produce slide decks."** Strategy consultants mostly do; technology consultants and integrators build and run production systems.
- **"Any custom work for a customer is consulting."** Custom work is consulting-like only if nothing flows back to a product.
- **"FDE is just consulting with a new name."** For FDE teams without a product feedback loop, effectively yes. For those with one, the economics are different.

## Typical interview questions

<details>
<summary>An Accenture team could build the same system for this customer. Why would they need an FDE?</summary>

They could build it, and on some engagements they will. What the FDE adds is the product relationship: deep knowledge of the product's internals, the ability to change the product when the customer needs something general, and a path for this customer's lessons to make the next deployment cheaper. In practice the two often work side by side, with the SI owning the wider program.

</details>

<details>
<summary>How would you tell whether an FDE organization has drifted into consulting?</summary>

Look at whether anything built in the field reaches the product, whether the cost of a new deployment is falling over time, and whether FDEs are measured on utilization or on outcomes.

</details>

## Learn more

- Video: [The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo) (Y Combinator) — chapter 14:35, "Consulting or Real Software?", about 3 minutes
- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer) — FDE compared with professional services

## Related

- [Role Tests](./02-role-tests.md)
- [FDE vs Implementation Engineer and Outsourcing](./06-fde-vs-implementation-and-outsourcing.md)
- [Many Capabilities for One Customer](../01-what-is-an-fde/02-many-capabilities-for-one-customer.md)
