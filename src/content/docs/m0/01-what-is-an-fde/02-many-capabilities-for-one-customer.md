---
title: Many Capabilities for One Customer
row: M0-L1.2
---
**In one sentence:** A product engineer builds one capability for many customers, while an FDE delivers many capabilities for one customer and helps turn what worked there into product for the next customer.

## What it is

Palantir's engineering blog describes its two engineering tracks this way: "Dev" engineers build a capability that many customers will use, and "Delta" engineers (Palantir's forward deployed engineers) deliver many capabilities to a single customer. The two tracks work on the same product from opposite directions. The product team goes breadth-first across the customer base; the FDE goes depth-first inside one customer.

In a single week, an FDE might write a connector to the customer's ticketing system, clean a messy data export, fix a prompt that fails on the customer's document format, build a small dashboard for a manager and run a training session. Each piece is small. Together they are what makes the product work for that customer.

## Why an FDE needs this

It explains two things that confuse newcomers. First, why FDE work looks scattered compared with a product engineer's: the unit of work is an outcome for one customer, not a feature. Second, why it is still engineering and not services: the FDE is also how the product learns what customers actually need.

## Key concepts

### The two directions

| | Product engineer | FDE |
|---|---|---|
| Unit of work | A feature for all users | An outcome for one customer |
| Success looks like | Adoption across the customer base | This customer's metric moves |
| What gets reused | The product | The product, plus what the FDE learned in the field |
| Main risk | Building something nobody needs | Building something only one customer can use |

### The decision in the middle

Every time an FDE builds something, there is a question to ask: is this specific to this customer, or would the next customer need it too? Customer-specific parts stay with the deployment. General parts go back to the product team as a feature request, a reusable component, a template or an evaluation set. This handbook calls that stage **Productize** (see [FDE Delivery Lifecycle](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)). Without it, the FDE team is a services business inside a software company.

### Why AI amplifies the pattern

McGrew's argument on Y Combinator's Lightcone podcast is that for AI agents there is often no incumbent product to copy, so much of the product discovery has to happen inside customers. The FDE is where that discovery happens.

## Common misconceptions

- **"Many capabilities means building everything from scratch."** An FDE builds on the product and writes custom code only where the product falls short. Rebuilding what the product already does is a red flag.
- **"Customer-specific work is waste."** It is how a team finds out what generalizes. It becomes waste only when nothing ever flows back.
- **"Product engineers and FDEs compete."** They depend on each other: the FDE brings evidence from the field, the product team turns it into something every customer gets.

## Typical interview questions

<details>
<summary>You built something for one customer. How do you decide whether it should go into the product?</summary>

Ask whether at least two or three other customers have the same need, whether it can be built without customer-specific assumptions (their field names, their workflow quirks), and whether the product team can maintain it. Bring the evidence (which customers, how often, what it saved) to the product team rather than just the code.

</details>

<details>
<summary>What goes wrong in an FDE team that never feeds work back into the product?</summary>

Every new customer costs as much as the last one, the custom code base grows without owners, and the company's margins look like a consulting firm's. The FDEs also burn out repeating the same work.

</details>

## Learn more

- Article: [Dev versus Delta: Demystifying Engineering Roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir blog, about 10 min) — the original "one capability for many customers vs. many capabilities for one customer" framing
- Video: [The FDE Playbook for AI Startups with Bob McGrew](https://www.youtube.com/watch?v=Zyw-YA0k3xo) (Y Combinator) — chapter 03:19, "How Palantir Invented It," about 5 minutes

## Related

- [Four FDE Responsibilities](./03-four-fde-responsibilities.md)
- [FDE vs Software Engineer and AI Engineer](../02-fde-vs-adjacent-roles/03-fde-vs-software-and-ai-engineer.md)
- [FDE vs Consultant and Systems Integrator](../02-fde-vs-adjacent-roles/05-fde-vs-consultant-and-systems-integrator.md)
