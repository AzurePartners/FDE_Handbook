---
title: FDE vs Solutions Architect and Sales Engineer
row: M0-L2.4
---
**In one sentence:** Pre-sales roles show that a solution can work in order to win the deal and usually step back once it closes; an FDE is accountable for making it work in production after the contract is signed.

## What it is

Sales engineers (SEs) and pre-sales solutions architects (SAs) are technical people on the sales side. They run demos, build proofs of concept, answer security questionnaires, draw reference architectures and convince the customer's technical team that the product can do the job. Their work is measured by whether deals close.

An FDE's work usually starts where theirs ends. After the contract is signed, someone has to turn the promise into a system that runs on the customer's real data, under the customer's real permissions, for real users. That is the FDE.

In practice the boundary overlaps. FDEs are often pulled into late-stage deals to build a technical proof of concept, and some SEs stay involved after signing. The test is still useful: is the code built to persuade, or built to run?

## Why an FDE needs this

The most dangerous gap in enterprise AI delivery sits between what was shown in the sales process and what can actually be delivered. FDEs inherit whatever was promised. Knowing how the pre-sales role works lets you get involved early enough to keep promises realistic.

## Key concepts

| | Sales engineer / pre-sales SA | FDE |
|---|---|---|
| Goal | Win the deal | Make it work after the deal |
| Code | Demo and proof-of-concept code, often on sample data | Production code on the customer's data |
| Time horizon | Weeks, until signature | Months, through rollout, adoption and handoff |
| Measured on | Win rate, pipeline, deal size | Customer outcome, adoption, renewal and expansion |
| When they step back | At signature, usually | At handoff, when someone else can run it |

### Demo success is not production readiness

A proof of concept on clean sample data answers "can this work at all?" It does not answer whether it works on messy real data, within the customer's security rules, at their volume, for users who didn't ask for it. Treating a successful PoC as a delivery plan is the most common way promises outrun reality.

### Work together early

The best teams bring the FDE into scoping before signature, so acceptance criteria and timelines reflect what the FDE has seen in similar customers.

## Common misconceptions

- **"An FDE is a sales engineer who codes more."** The difference is the time horizon and the accountability, not the amount of code.
- **"A successful PoC means the hard part is done."** The hard part (integration, permissions, evaluation, adoption) usually starts after it.
- **"FDEs shouldn't be involved in sales."** Many are, and that involvement is the best protection against overpromising.

## Typical interview questions

<details>
<summary>A salesperson promised the customer a capability the product doesn't have. What do you do?</summary>

Find out exactly what was promised and what the customer actually needs behind it. Propose the closest version you can deliver, with a timeline and its limits, and agree on it with both the sales lead and the customer before building. Then feed the gap to the product team as evidence.

</details>

<details>
<summary>The PoC went perfectly. Why might production still fail?</summary>

The PoC probably used clean data, broad permissions, a handful of friendly users and no load. Production brings dirty data, restricted access, security review, real volume and users who were not part of the decision.

</details>

## Learn more

- Article: [What are Forward Deployed Engineers?](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) (The Pragmatic Engineer, section comparing FDEs with solutions architects and professional services) — where the roles overlap and where they split

## Related

- [Role Tests](./02-role-tests.md)
- [FDE vs Customer Success Manager](./07-fde-vs-customer-success-manager.md)
- [FDE Delivery Lifecycle](../03-delivery-lifecycle-and-handbook-map/01-fde-delivery-lifecycle.md)
