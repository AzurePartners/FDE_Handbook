---
title: Tool Calling (Function Calling)
row: M2-L4.1
---
**In one sentence:** Tool calling (also called function calling) lets a model ask your application to run a named operation with structured arguments, such as an order lookup, while your code decides whether to run it and does the work.

## What it is

A model only produces text: it cannot check live orders or issue refunds. With tool calling, your app sends it a list of tools, each with a name, description and input schema (its arguments). When a request needs one, the model replies with a structured call (tool name plus JSON arguments) instead of prose. In Microsoft's words: "Your application executes the functions and returns the results to the model, so you remain in control of the actions taken."

Think of a travel agent filling in an airline's booking form: the airline's system, not the agent, decides whether a ticket is issued.

## Why an FDE needs this

A retailer's support bot answers "Where is my order?" from a pasted FAQ and sometimes invents a status. Refunds rely on a regex scraping `ACTION: REFUND 40.00` from replies. IT wants all 70-plus gateway tools added, `delete_customer` included.

The FDE exposes four support tools: order status, return policy, refund request and new ticket. The model proposes; code checks order ownership and refund policy before anything runs. Anthropic's rule of thumb: "if you're writing a regex to extract a decision from model output, that decision should have been a tool call."

## Key concepts

### A proposed call

A proposed call in Anthropic's format:

```json
{"type": "tool_use",
 "id": "toolu_01A09q90qw90lq917835lq9",
 "name": "get_order_status",
 "input": {"order_id": "58213"}}
```

Nothing has run yet. Your code checks and runs it, then returns the result with the same ID.

### Tool choice

The tool-choice setting says whether the model may, must or must not call a tool.

| Idea | Anthropic | OpenAI | Gemini |
|---|---|---|---|
| Model decides (default with tools) | `auto` | `auto` | `AUTO` |
| No tools | `none` | `none` | `NONE` |
| Must call some tool | `any` | `required` | `ANY` |
| Must call a named tool | `tool` | named function | `ANY`, one name allowed |

Forcing is not universal: some newer Anthropic models reject `any` and `tool` with a 400 error. Alternatives: `auto` with a sharp description, structured output, or code calling the function itself.

### How many tools

Every definition costs input tokens on every call, and look-alike tools cause wrong picks. Anthropic reports tool selection degrading beyond about 30 to 50 tools and suggests tool search (loading definitions on demand) from about 10 tools. Expose only what the role needs; a tool never exposed cannot be misused.

### Who runs the tool

- **App-run tools:** you run the code and return the result, so you control credentials, logging and checks. Even Anthropic's provider-defined bash tool runs in your app.
- **Provider-hosted tools:** web search or code execution run on the provider's servers.
- **MCP:** the Model Context Protocol, an open protocol for plugging tool servers into apps (Module 4).

### Tools vs structured output

Anthropic's split: structured outputs control "what Claude says", while strict tool use governs "how Claude calls your functions". Use structured output when nothing needs to run, like ticket triage, and tools for missing data or actions.

Retrieval can be a tool too: the model calls `search_docs(query)` when it judges a search useful. That is flexible but adds round trips, and the model may skip a needed search.

## Common misconceptions

- **"The model runs my function."** It returns a request. Even SDK helpers that call functions "automatically" run them in your process.
- **"If the tool is listed, the model will use it."** On `auto` it can answer from memory, which is how invented statuses happen.
- **"Strict mode makes the call correct and safe."** Schema-enforced arguments guarantee shape, not that the order exists or that the user may act.
- **"I'll define a fake tool to get JSON back."** That trick predates structured output and fails where forced tool choice is rejected.

## Typical interview questions

<details>
<summary>What is tool calling, and who executes the tool?</summary>

The model returns a structured request: a tool name and arguments. My code decides whether to run it, runs it and returns the result. Only hosted tools run elsewhere, on the provider's servers.

</details>

<details>
<summary>How does tool calling differ from structured output?</summary>

Structured output fixes the final answer's shape when nothing needs to run, like a ticket label. Tool calling fetches data or acts before the answer. They combine: strict tool arguments plus a structured reply.

</details>

<details>
<summary>A client wants all 80 gateway tools connected. What do you expose?</summary>

Only what the role's tasks need, preferring read-only tools and merging overlaps. Tools it must never use, like customer deletion, stay hidden. Large catalogs get tool search, with eval prompts checking tool selection.

</details>

<details>
<summary>The assistant states order statuses without calling the lookup. How do you fix it?</summary>

The trace confirms no call happened; usually it is `auto` with a vague description. I sharpen it and add eval cases. If every order question needs live data, code calls the lookup directly.

</details>

## Learn more

- Video: [What is Tool Calling? Connecting LLMs to Your Data](https://www.youtube.com/watch?v=h8gMhXYAv1k) (IBM Technology, YouTube, about 9 min)
- Reference: [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) (Anthropic Claude Docs, about 12 min)
- Reference: [Function calling](https://developers.openai.com/api/docs/guides/function-calling) (OpenAI API documentation, about 30 min)

## Related

- [LLM APIs (Requests, Responses, Streaming, SDKs)](../07-llm-application-foundations/03-llm-apis.md)
- [The Tool-Call Loop and Tool Traces](./02-tool-call-loop.md)
- [Tool Schemas and Tool Design](./05-tool-design.md)
- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [RAG vs Alternatives (Long Context, Fine-Tuning, Databases, APIs)](../09-rag-knowledge-bases/09-rag-vs-alternatives.md)
