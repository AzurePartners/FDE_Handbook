---
title: Designing a Minimal Connector Contract
row: M4-L1.4
---
**In one sentence:** A connector contract is the small, explicit definition of how a tool or API is exposed to an agent, its inputs, outputs, error types, authentication, and rate limits, and designing it well is what makes an integration predictable, swappable, and safe.

## What it is

When you expose a tool or API to an agent (or consume one), you define a **contract**: the inputs it accepts (names, types, required/optional), the outputs it returns (shape and meaning), the **error types** it can raise (and how the caller should react), the **authentication** it requires, and its **rate limits**. "Minimal" means include exactly what a caller needs to use it correctly and safely, no more. A good contract is the seam that lets you change the implementation behind it without breaking callers, and lets the model call it reliably.

## Why an FDE needs this

Most integration pain comes from fuzzy boundaries: a tool whose errors are undocumented, whose auth is implicit, whose limits surprise you. Writing the contract explicitly forces those decisions and gives both the model and future maintainers something dependable to call. It's also what makes providers swappable (any implementation matching the contract fits) and what keeps vendor quirks out of business logic.

## Key concepts

- **Inputs:** names, types, required vs optional, validation rules.
- **Outputs:** shape, types, meaning; a predictable structure the caller can rely on.
- **Error types:** enumerated failure modes and the expected caller reaction (retryable vs fatal).
- **Auth:** what credential the connector needs and how it's supplied (ties to Lesson 2).
- **Rate limits:** declared limits so callers throttle correctly.

```
Connector: get_customer(customer_id: string)   # input
  -> { id, name, status, mrr }                  # output shape
  errors: NotFound (fatal) | RateLimited (retry) | Upstream5xx (retry)
  auth: service token (scope: crm.read)
  limits: 100 req/min
```

## Common misconceptions

- **"Just expose the raw API."** Raw APIs leak vendor quirks and undocumented errors; a contract shields callers.
- **"Errors don't need defining."** Undefined errors are where integrations silently break; enumerate them and the expected reaction.
- **"More surface is better."** Minimal contracts are easier to use correctly and to reimplement; expose only what's needed.

## Typical interview questions

<details>
<summary>What belongs in a connector contract?</summary>

Inputs (names, types, required/optional, validation), outputs (predictable shape and meaning), enumerated error types with the expected caller reaction (retryable vs fatal), the authentication it needs, and its rate limits. Kept minimal, exactly what a caller needs to use it correctly and safely.

</details>

<details>
<summary>Why define error types explicitly in a connector?</summary>

Because undefined errors are where integrations break silently, the caller can't tell a transient failure it should retry from a fatal one it should surface. Enumerating error types and the expected reaction makes the connector predictable and lets callers handle failure correctly.

</details>

## Learn more

- Docs: [Build an MCP server (getting started)](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro) (then follow "Develop with MCP")
- Article: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (evaluate the tool with the agent)
- Course: [DeepLearning.AI MCP course](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic) (build & deploy your own server)

## Related

- [Tool Registries, Schemas & Capability Discovery](./02-tool-registries-schemas-and-capability-discovery.md)
- [Data Contracts & Schema Evolution](../03-real-world-data-quality-freshness-provenance-and-entity/05-data-contracts-and-schema-evolution.md)
