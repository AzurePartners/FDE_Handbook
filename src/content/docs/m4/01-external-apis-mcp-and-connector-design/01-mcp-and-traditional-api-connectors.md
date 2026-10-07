---
title: MCP and Traditional API Connectors
row: M4-L1.1
---
**In one sentence:** The Model Context Protocol (MCP) standardizes how a model discovers and calls tools, but it does not replace the real work of authentication, networking, and failure handling that any connection to an external system still requires.

## What it is

**MCP** is an open standard for connecting an AI application to external systems. A **server** exposes three kinds of capability — **tools** (actions the model can invoke), **resources** (data the app can read), and **prompts** (reusable workflows) — and any MCP-aware **host/client** connects to it the same way, over **stdio** or **Streamable HTTP**. The client negotiates capabilities when it connects and discovers what is available at runtime (for tools, via a `tools/list` call). Tool use is *model-controlled*, and the spec says a human should stay in the loop able to deny a call. What MCP does *not* do is make the underlying system reliable or secure: behind an MCP tool there is still a real API that needs credentials, can time out, can rate-limit you, and can return errors. MCP standardizes the *interface*; the hard parts of integration remain.

## Why an FDE needs this

MCP is increasingly how AI features plug into tools, and it's easy to assume "there's an MCP for that" means the integration is done. It isn't, an MCP tool wrapping a flaky API is still flaky. An FDE has to see through the standard interface to the real system underneath and handle its auth, limits, and failures, exactly as with a raw API.

## Key concepts

- **Three primitives:** tools (model-invoked actions), resources (readable data), and prompts (workflows) — MCP is not tools-only.
- **Host / client / server:** the AI app (host) runs a client that connects to a server; capabilities are negotiated at connect time and discovered at runtime.
- **Transports:** stdio (local) or Streamable HTTP (remote).
- **MCP standardizes the interface**, not the network or the auth behind it: a real API still sits behind every tool, with its own credentials, rate limits, timeouts, and errors.
- **Failure handling is still yours:** retries, fallbacks, and validation don't come free with the protocol.

## Common misconceptions

- **"MCP replaces API integration work."** It standardizes the interface; auth, networking, and failure handling are unchanged.
- **"If it's an MCP tool, it's reliable."** Reliability comes from the system behind it and the handling you add, not the protocol.
- **"MCP handles authentication."** You still supply and secure real credentials to the underlying service.

## Typical interview questions

<details>
<summary>What does MCP standardize, and what does it not?</summary>

It standardizes how a server exposes tools, resources, and prompts, and how any client discovers and calls them (tools are listed via \`tools/list\` and invoked via \`tools/call\`), so any MCP client can use any MCP server without bespoke wiring. It does not replace authentication, networking, rate-limit handling, or failure handling for the real system behind the tool, those remain the integrator's responsibility.

</details>

<details>
<summary>Why is "there's an MCP for that" not the same as "the integration is done"?</summary>

Because the MCP tool wraps a real API that still needs credentials, respects rate limits, can time out, and returns errors. The protocol gives you a clean interface; you still have to handle auth and failure modes for the system underneath.

</details>

## Learn more

- Docs: [What is MCP?](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro) (official intro)
- Docs: [MCP architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) (data vs. transport layer, capability discovery)
- Article: [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) (Anthropic; tool-context cost at scale)
- Course: [MCP: Build Rich-Context AI Apps](https://www.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic) (DeepLearning.AI, free to audit)

## Related

- [Tool Registries, Schemas & Capability Discovery](./02-tool-registries-schemas-and-capability-discovery.md)
- [API Versions, Rate Limits & Fallback Sources](./03-api-versions-rate-limits-and-fallback-sources.md)
