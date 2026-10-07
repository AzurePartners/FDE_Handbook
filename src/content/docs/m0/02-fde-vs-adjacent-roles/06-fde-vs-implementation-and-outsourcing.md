---
title: FDE vs Implementation Engineer and Outsourcing
row: M0-L2.6
---
**In one sentence:** Implementation and outsourced teams deliver what the customer specified, and the know-how stays with the project or leaves with the person; whether an FDE team is just outsourcing under a new name depends on whether the reusable parts end up in a product.

## What it is

**Implementation engineers** configure and roll out an existing product to a specification: set up the modules, map the fields, migrate the data, train the users. Classic enterprise software rollouts work this way, and the work can be documented in a playbook and handed over completely.

**Outsourcing and staff augmentation** provide engineers who build what the customer specifies, usually billed by time. The code may well go into production. The knowledge usually stays in project documents or leaves when the people do.

The skeptic's question is fair: is an FDE just an outsourced engineer with a better title? The honest answer is "sometimes," and the way to tell is to look at what is left behind when the project ends.

## Why an FDE needs this

Customers, colleagues and interviewers will ask the "outsourcing rebranded" question. You also need to recognize when your own role is drifting that way, because the career and economics are very different.

## Key concepts

### What is left after the project

| What remains | What it is |
|---|---|
| Only a system for the customer | Outsourcing |
| Some lessons in a project report, not reused | Project delivery |
| Lessons turned into reusable skills, templates, connectors, eval sets or product features | FDE work |
| Those assets measurably lower the cost of the next customer | FDE work that scales |

### Specified work versus judgment work

Rule-based configuration can be written down completely and handed to the customer's team. AI systems often cannot: quality depends on data, models and edge cases that keep changing, so someone has to keep exercising judgment in the field. That ongoing judgment is a large part of why FDE roles exist for AI products.

### Signs of an FDE label on outsourcing work

- Implementation or onsite-developer roles renamed "FDE" with no change in responsibilities.
- Being able to "vibe code" with an AI tool presented as the whole qualification.
- FDE staff measured on billable utilization, with no path for anything to reach the product.

## Common misconceptions

- **"Writing production code at the customer's site makes it FDE work."** Outsourced teams do that too. The test is where the reusable parts go.
- **"Implementation work is lower-skill."** It is a different kind of work: well-specified, documentable and transferable. Much of it is hard.
- **"Every FDE engagement must produce product features."** Not every one will. The question is whether the system for feeding back exists and is used.

## Typical interview questions

<details>
<summary>Isn't an FDE just an outsourced engineer?</summary>

Only if nothing comes back. Explain the difference in what remains after the project: an outsourced team leaves a system; an FDE team also leaves the product better for the next customer. Give an example of something reusable you or your team extracted from one engagement.

</details>

<details>
<summary>Your FDE team keeps rebuilding the same integration for every customer. What would you change?</summary>

Pull the common parts into a maintained component with an owner on the product side, keep only customer-specific mapping in each deployment, and track how much time the next deployment saves. Make "what goes back to the product" a standing item in each project's postmortem.

</details>

## Learn more

- Article: [Dev versus Delta: Demystifying Engineering Roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir blog) — why deployed engineering at a product company is not the same as services

## Related

- [Role Tests](./02-role-tests.md)
- [FDE vs Consultant and Systems Integrator](./05-fde-vs-consultant-and-systems-integrator.md)
- [Four FDE Responsibilities](../01-what-is-an-fde/03-four-fde-responsibilities.md)
