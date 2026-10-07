---
title: FDE vs Customer Success Manager
row: M0-L2.7
---
**In one sentence:** A customer success manager keeps an already working product adopted and renewed, mostly without code; an FDE builds the customer-specific part that has to work first and shares responsibility for getting it adopted.

## What it is

Customer success managers (CSMs) own the relationship after the sale: onboarding, regular check-ins, usage reviews, renewal and expansion. They make sure customers get value from a product that already works for them. Some companies have more technical variants, such as technical account managers, who handle configuration questions and escalations, but deep custom building is not usually part of the job.

The FDE's work sits earlier and deeper. When the product does not yet work for this customer, because it needs integration, data work, custom logic or evaluation against the customer's own cases, the FDE builds that part and stays accountable until it is in use. The two roles overlap in the Adoption stage, and a handoff from FDE to CSM after a successful rollout is common.

## Why an FDE needs this

Adoption is the responsibility most engineers underestimate. Understanding how CSMs work shows you what "in use" really requires (training, champions, usage tracking, regular reviews) and helps you plan a clean handoff instead of staying on a finished deployment forever.

## Key concepts

| | Customer success manager | FDE |
|---|---|---|
| Starts when | The product is sold and works | The product does not yet work for this customer |
| Main work | Onboarding, usage reviews, renewals, escalations | Building, integrating and evaluating the customer-specific part |
| Code | Little or none | Production code |
| Measured on | Retention, renewal, expansion, satisfaction | The customer's outcome and adoption of what was built |
| Overlap | Adoption | Adoption |

### A clean handoff

A good FDE-to-CSM handoff includes what was built and why, who the customer's champions and skeptics are, which metrics show the system is healthy, the known limitations and what to escalate to engineering. Without it, the CSM inherits a system they cannot explain.

## Common misconceptions

- **"Adoption is the CSM's job, not the FDE's."** The FDE built the thing; if users don't trust it, the fix is often in the system, not the relationship.
- **"CSMs are not technical."** Many are quite technical. The difference is the work they own, not their ability.
- **"Once a CSM takes over, the FDE is done forever."** Escalations about the custom part often come back, which is why handoff documentation matters.

## Typical interview questions

<details>
<summary>The system has been live for a month but usage is low. The CSM says users don't trust it. What do you do?</summary>

Talk to a few users to find out exactly where trust breaks (wrong answers on certain cases, no way to check sources, an extra step in their workflow). Look at failure cases in the logs, fix what is in the system, and agree with the CSM on a small adoption plan: a champion, a short training, a usage metric reviewed weekly.

</details>

<details>
<summary>What do you hand over to customer success when a deployment is finished?</summary>

What was built and why, the customer's key people, health metrics, known limitations, a runbook for common problems and a clear line on what should come back to engineering.

</details>

## Learn more

- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer) — how FDE responsibilities differ from post-sales roles
- There is no strong English article comparing FDE and customer success directly; use [Role Tests](./02-role-tests.md) to place any specific CSM role

## Related

- [FDE vs Solutions Architect and Sales Engineer](./04-fde-vs-solutions-architect-and-sales-engineer.md)
- [Four FDE Responsibilities](../01-what-is-an-fde/03-four-fde-responsibilities.md)
- [FDE Delivery Lifecycle](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
