---
title: Separating Customer-Specific Logic from Reusable Assets
row: M5-L7.7
---
**In one sentence:** After delivery, separate what's specific to this customer from what's reusable, prompts, skills, eval sets, connectors, and templates, so the reusable pieces become assets that make the next engagement cheaper and faster.

## What it is

An FDE engagement produces a mix of the **customer-specific** (their data, their exact workflow, their integrations) and the **reusable** (patterns and components that transfer). The discipline is to identify and extract the reusable assets: **prompts** that worked, **skills** or capabilities you built, **eval sets** that test a common problem, **connectors** to common systems, and **templates** (scoping docs, runbooks, architectures). Pulled out and generalized, these become a library that accelerates future engagements, the opposite of starting from scratch each time. It requires deliberately drawing the line between "this only makes sense for Customer A" and "this helps anyone with this problem."

## Why an FDE needs this

FDE work risks being pure one-off delivery, valuable to one customer, nothing carried forward. Extracting reusable assets is what compounds: the second deployment of a similar solution is far cheaper because you reuse the prompts, connectors, and templates from the first. It also feeds the product team (next page). An FDE who harvests reusable assets makes themselves and the org faster over time; one who doesn't rebuilds the same things repeatedly.

## Key concepts

- **Draw the line:** customer-specific vs reusable, deliberately, per component.
- **Reusable asset types:** prompts, skills, eval sets, connectors, templates.
- **Generalize on extraction:** strip the customer specifics so it transfers.
- **Build a library:** accumulated assets accelerate future engagements.
- **Compounding value:** the second similar deployment is cheaper because of the first.

## Common misconceptions

- **"Everything we built is customer-specific."** Much of it, prompts, connectors, eval patterns, templates, generalizes with a little extraction.
- **"Reuse means copy-pasting the last project."** It means extracting and generalizing assets, not cloning customer-specific work.
- **"Harvesting assets is overhead."** It's what makes future engagements cheaper and is a core part of productization.

## Typical interview questions

<details>
<summary>How do you make your engagement work benefit the next one?</summary>

By separating customer-specific logic from reusable assets and extracting the reusable ones, prompts, skills, eval sets, connectors, and templates, generalized so they transfer. That builds a library which makes the next similar deployment far cheaper and faster, instead of rebuilding the same things from scratch each time.

</details>

<details>
<summary>What kinds of things are usually reusable across engagements?</summary>

Prompts that solved a common sub-problem, skills or capabilities you built, eval sets for a recurring task, connectors to common systems (CRMs, warehouses), and templates like scoping docs, runbooks, and reference architectures. The customer's data, exact workflow, and bespoke integrations stay specific; the patterns around them generalize.

</details>

## Learn more

- Docs: [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) (package reusable know-how as skills)
- Article: [Demystifying evals](https://anthropic.com/engineering/demystifying-evals-for-ai-agents) (eval sets as reusable assets)

## Related

- [The Handoff Package](./05-the-handoff-package.md)
- [Feeding Learnings Back to Product](./08-feeding-learnings-back-to-product.md)
