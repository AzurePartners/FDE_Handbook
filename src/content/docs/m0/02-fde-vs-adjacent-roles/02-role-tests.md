---
title: Role Tests
row: M0-L2.2
---
**In one sentence:** Three questions separate an FDE from neighboring roles better than "do they write code": does the code reach production, do field lessons flow back into a product, and is the work paid for and measured by time or by outcome.

## What it is

"Do they write code?" is a poor way to tell roles apart. Solutions engineers write code. Technology consultants write a great deal of code. Outsourced teams write code all day. What differs is what happens to the code, to the knowledge and to the money.

| Test | Question to ask | FDE answer | Who it separates the FDE from |
|---|---|---|---|
| 1. Where does the code go? | Does what you build run in the customer's production environment? | Yes, and it is held to production standards | Pre-sales (demo code), customer success (little code) |
| 2. Where do the lessons go? | After the project, does what you learned end up in a product? | Yes, reusable parts go back into the company's product | Consulting, systems integration, outsourcing |
| 3. What is paid for and measured? | Is the work priced, and the person evaluated, on time spent or on outcomes? | Outcomes: adoption, the customer's metric, expansion | Staff augmentation, day-rate contracts |

## Why an FDE needs this

These tests let you place any role, including your own, without arguing about titles. They are also the honest answer to "isn't FDE just consulting with a new name?": sometimes it is, and the tests show when.

## Key concepts

### No single test is enough

A large consulting firm passes test 1 (it ships production systems) and can pass test 3 (outcome-based contracts exist). An outsourced team passes test 1. Test 2 is the most durable distinction, because it depends on something structural: whether there is a product, owned by the FDE's own company, that the work rides on and feeds. That relationship is what lets each next customer cost less.

### Four dimensions behind the tests

When comparing roles, look at:

- **Responsibility:** what the person is accountable for at the end.
- **Product relationship:** whether the work is built on the company's own product.
- **Reusable product leverage:** whether what is built makes the next deployment cheaper.
- **Ownership of the production outcome:** whether the person is on the hook if it fails in production.

### The same engineers, different contracts

Imagine one team building a stock-replenishment agent for a retailer. Billed by the day, with no obligation beyond hours, it is outsourcing. On a fixed scope with a clause that reusable components return to the vendor's product, it is close to FDE work. Paid on whether stock-outs actually fall, with reusable parts flowing back, it is the full FDE form. The engineers and the code could be identical; the contract and the flow of knowledge change the role.

### Use the tests for positioning, not grading

Most real jobs are mixed: mostly production code with some pre-sales, partial feedback, partly outcome-based goals. Use the tests to see where a role sits and which way you want to move.

## Common misconceptions

- **"If they write production code, they are an FDE."** Consultants and outsourcers do too. Look at tests 2 and 3.
- **"Outcome-based pricing is required."** Many FDEs are salaried and their company sells subscriptions. Test 3 asks whether the role is measured on outcomes, not whether the invoice is.
- **"Failing a test makes a role worse."** It makes it a different role.

## Typical interview questions

<details>
<summary>How is an FDE different from a consultant?</summary>

Not by whether they write code; good technology consultants ship production systems. The difference is the product: an FDE delivers on top of their own company's product and feeds what they learn back into it, so the company's cost per customer falls over time. A consulting firm's reuse goes into its methods and accelerators, and its revenue still scales with people.

</details>

<details>
<summary>What would you ask to find out whether this role is really FDE work?</summary>

Is the code from the last deployment still running, and who maintains it? Has anything built for a customer gone into the product? What metric is this role evaluated on?

</details>

## Learn more

- Article: [Dev versus Delta: Demystifying Engineering Roles at Palantir](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir blog, about 10 min) — how product engineering and deployed engineering relate inside one company

## Related

- [FDE vs Consultant and Systems Integrator](./05-fde-vs-consultant-and-systems-integrator.md)
- [FDE vs Implementation Engineer and Outsourcing](./06-fde-vs-implementation-and-outsourcing.md)
- [Many Capabilities for One Customer](../01-what-is-an-fde/02-many-capabilities-for-one-customer.md)
