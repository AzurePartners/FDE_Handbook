---
title: Build vs Buy vs Configure
row: M5-L5.2
---
**In one sentence:** For each part of a solution, decide whether to build it custom, buy an existing product, or configure an existing platform, and know when to use a platform like Puffo/Pavlov versus a codebase, an MCP, or custom services, so you spend build effort only where it creates unique value.

## What it is

Three options per component. **Build:** write it custom, right for the differentiated core specific to the customer's problem. **Buy:** use an existing product/service for commodity capabilities (auth, monitoring, a vector DB, the LLM itself). **Configure:** use and set up an existing platform rather than coding from scratch, e.g. building on **Puffo/Pavlov** (the persistent-agent platform) versus writing custom services, or wiring an **MCP** to an existing tool versus building a connector. The skill is deciding per component: concentrate custom build on the differentiating parts, and buy/configure the rest.

## Why an FDE needs this

Time is the scarce resource in an engagement, and building commodity infrastructure or re-implementing what a platform already does burns it for no customer value, plus creates permanent maintenance burden. Configuring Puffo/Pavlov for the agent layer and building only the customer-specific logic on top is usually far faster and more maintainable than a bespoke build. An FDE who reflexively builds everything delivers slowly; one who buys/configures the commodity parts delivers faster with less to maintain.

## Key concepts

- **Build:** the differentiated, customer-specific core.
- **Buy:** commodity capabilities specialists solve better (LLM, auth, monitoring, vector store).
- **Configure:** set up an existing platform (Puffo/Pavlov) or wire an MCP instead of coding from scratch.
- **Platform vs codebase:** use the platform for what it's built for; drop to custom code only where needed.
- **Total cost of ownership:** building means maintaining forever; weigh it.

## Common misconceptions

- **"Building ourselves gives more control."** It also creates permanent maintenance burden; build only where it's differentiating.
- **"Configuring a platform is less real engineering."** Using Puffo/Pavlov well and building the right custom layer on top is exactly the job, and faster.
- **"Buy/configure means we can't customize."** You combine configured platform + bought commodities + custom code for the differentiated core.

## Typical interview questions

<details>
<summary>How do you decide build vs buy vs configure?</summary>

Per component. I build the differentiated core specific to the customer's problem, buy commodity capabilities specialists do better (LLM, auth, monitoring, vector store), and configure existing platforms, like Puffo/Pavlov for the agent layer, or an MCP for a tool, rather than coding from scratch. The aim is to spend custom build effort only where it creates unique value and minimize what we maintain.

</details>

<details>
<summary>When would you use Puffo/Pavlov versus a custom codebase?</summary>

I'd configure Puffo/Pavlov for what it's built to do, persistent-agent lifecycle, state, orchestration, and build custom code only for the customer-specific logic on top that the platform doesn't cover. Dropping to a fully custom codebase makes sense only when the platform genuinely can't meet a real requirement, since custom means more to build and maintain.

</details>

## Learn more

- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen; which components to add when)
- Note: work a Build vs. Buy vs. Configure example — Puffo/Pavlov vs. custom code.

## Related

- [The Architecture Decision Tree](./01-the-architecture-decision-tree.md)
- [Architecture Hypothesis, Assumptions & Tech Debt](./03-architecture-hypothesis-assumptions-risks-and-tech-debt.md)
