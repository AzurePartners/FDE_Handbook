---
title: The FDE Role vs Adjacent Roles
row: M5-L1.1
---
**In one sentence:** A Forward Deployed Engineer builds and ships working software inside a single customer's systems to solve their specific problem, distinct from SWEs, AI Engineers, Solutions Engineers, pre-sales, implementation, consulting, and outsourcing, each of which owns only part of what an FDE does.

## What it is

The FDE role blends engineering, product, and consulting, deployed "forward" to the customer. It's clearest by contrast:

- **SWE (product engineer):** builds reusable software for many customers; usually shielded from individual customers.
- **AI Engineer:** builds the AI/model components; narrower than the full delivery role.
- **Solutions Engineer / pre-sales:** demonstrates and scopes during the sale; typically doesn't build and own delivery.
- **Implementation/consulting:** configures or advises; consulting often stops at recommendations, not shipped software.
- **Outsourcing:** builds to a fixed spec handed down; doesn't own discovering the real problem.

The FDE spans all of it: discover the real problem, scope it, build and ship it in the customer's environment, and own the outcome.

## Why an FDE needs this

Knowing the boundaries keeps you from drifting into a neighbor's failure mode, becoming a pure builder who never validates the problem, or a pure advisor who produces decks but no working system. It also helps you collaborate: pull in product engineering for reusable parts, partner with solutions/pre-sales on scoping, while keeping your own mandate clear.

## Key concepts

| Role | Owns | Gap vs FDE |
| --- | --- | --- |
| SWE | Reusable product | Little customer contact / discovery |
| AI Engineer | Model components | Not full delivery |
| Solutions/pre-sales | Sale-time demo & scope | Doesn't build/own delivery |
| Consulting | Advice | Often no shipped software |
| Outsourcing | Build to fixed spec | Doesn't discover the real problem |
| **FDE** | Discover → build → ship → outcome | (spans all) |

## Common misconceptions

- **"FDE is a consultant who can code."** They ship production software, not just recommendations.
- **"FDE is an SWE on-site."** They own discovery and customer communication, not only implementation.
- **"FDE is outsourced dev."** Outsourcing builds a given spec; an FDE finds what should be built.

## Typical interview questions

<details>
<summary>How is an FDE different from a Solutions Engineer and from a consultant?</summary>

A Solutions Engineer scopes and demos during the sale but usually doesn't build and own delivery. A consultant advises and often stops at recommendations. An FDE spans the whole arc, discovers the real problem, scopes it, and builds and ships working software in the customer's environment, owning the outcome, not just insight or a demo.

</details>

<details>
<summary>What failure modes does understanding these boundaries help you avoid?</summary>

Drifting into pure-builder mode (shipping software without validating it solves the real problem) or pure-advisor mode (producing scoping and decks but no running system). The FDE has to hold both: deep problem understanding and delivered, working software.

</details>

## Learn more

- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (Pragmatic Engineer; partially paywalled)
- Article: [Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir; one capability for many customers vs. many for one)
- Video: [Software 3.0 — Andrej Karpathy](https://www.youtube.com/watch?v=LCEmiRjPEtQ) (YC AI Startup School 2025; partial-autonomy framing)

## Related

- [The End-to-End Delivery Lifecycle](./02-the-end-to-end-delivery-lifecycle.md)
- [Outcome Ownership vs Time-and-Materials](./03-outcome-ownership-vs-time-and-materials.md)
