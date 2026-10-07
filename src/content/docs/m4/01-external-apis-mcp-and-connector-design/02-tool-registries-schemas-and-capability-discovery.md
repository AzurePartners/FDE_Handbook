---
title: Tool Registries, Schemas & Capability Discovery
row: M4-L1.2
---
**In one sentence:** A tool registry lists the tools available to an agent, each described by a schema (its inputs, outputs, and purpose), and capability discovery is how a client learns at runtime what a server can do, so third-party and commercial tools can plug into the same slot.

## What it is

For a model to use a tool, it needs a machine-readable description: the tool's name, a human-readable title and description, a JSON-Schema `inputSchema` (and optional `outputSchema`), this is the **schema**. A **registry** is the collection of tools the agent can choose from. In MCP terms, a **server** offers tools (and resources and prompts) and a **client** consumes them; the client negotiates **capabilities** when it connects, then **discovers** the current tools by calling `tools/list` (which can change and notify via `listChanged`). Because everything is described by schema, a first-party tool, a third-party MCP, or a commercial one can occupy the same "slot" as long as it matches the contract.

## Why an FDE needs this

You'll wire agents to tools and sometimes expose your own. Good schemas are what let the model call a tool correctly and what let you swap one provider for another without rewriting the agent. Understanding server/client roles and discovery tells you where to look when a tool "isn't showing up" (discovery/registration) versus "is called wrong" (schema mismatch).

## Key concepts

- **Schema:** the tool's declared inputs, outputs, and description; the contract the model calls against.
- **Registry:** the set of tools available to the agent.
- **Server vs client:** server offers tools/data; client (the model host) discovers and calls them.
- **Capability discovery:** runtime negotiation of what's available, enabling hot-swapping providers.
- **Slot interchangeability:** any tool matching the schema can fill the same role.

## Common misconceptions

- **"The model just knows how to call a tool."** It relies entirely on the schema/description; a vague schema causes wrong calls.
- **"Tools are hard-coded into the agent."** With discovery, the client learns available tools at runtime.
- **"Only the vendor's own tool fits."** Any server matching the schema/interface can occupy the slot.

## Typical interview questions

<details>
<summary>What role does a tool schema play?</summary>

It's the machine-readable contract, name, purpose, input parameters and types, outputs, that the model calls against. A clear schema is what lets the model invoke the tool correctly and lets you substitute one implementation for another.

</details>

<details>
<summary>What is capability discovery and why is it useful?</summary>

It's the runtime step where a client, after negotiating capabilities on connect, calls \`tools/list\` to get the server's current tools and their schemas (and can be notified when that set changes), rather than tools being hard-coded. It lets you add or swap tools and providers without rewiring the agent, as long as they match the interface.

</details>

## Learn more

- Docs: [Understanding MCP servers](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts) (tools / resources / prompts)
- Spec: [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25) (schemas, capability negotiation)
- Course: [DeepLearning.AI MCP course](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic) (tools/resources/prompts + MCP Inspector)

## Related

- [MCP and Traditional API Connectors](./01-mcp-and-traditional-api-connectors.md)
- [Designing a Minimal Connector Contract](./04-designing-a-minimal-connector-contract.md)
