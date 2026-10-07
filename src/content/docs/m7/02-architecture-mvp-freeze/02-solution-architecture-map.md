---
title: Solution Architecture Map
row: M7-L2.2
---
**In one sentence:** The solution architecture map is a one-page picture of your system's components, data flow, tools, memory and human checkpoints, drawn so another person can review it before you build.

## What it is

The map answers: what parts exist, what passes between them, what each part is allowed to do, and where a person must approve. It is drawn after the mini PRD, because the PRD says what the system must do and the map says how.

For the Course Support Assistant, a minimal map has five parts: a chat entry point, a retrieval step over course documents, an answering model, a confidence check, and a handoff to a human agent. The full reference design is in [Technical Design: Course Support Assistant](../../m6/01-education-rag/03-technical-design.md) (M6). Yours should be simpler, and tied to your customer.

## Why an FDE needs this

Teams that start building without a map argue about structure mid-build, and reviewers cannot judge safety. A map makes hidden decisions visible, such as "who can issue a refund", before code exists.

## Key concepts

The reasoning behind each choice is taught elsewhere: [Choosing an Agent Architecture](../../m3/15-agent-architectures/05-choosing-an-agent-architecture.md) and [Agent State and Memory Types](../../m3/16-agent-state-memory/01-state-and-memory-types.md) (M3), [MCP and Traditional API Connectors](../../m4/01-external-apis-mcp-and-connector-design/01-mcp-and-traditional-api-connectors.md) and [Human-in-the-Loop Tied to Permissions](../../m4/02-authentication-authorization-rbac-and-secrets/04-human-in-the-loop-tied-to-permissions.md) (M4), and [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md) (M2).

### What you produce

One diagram plus a short table:

```
Student -> Chat entry -> Retriever -> Answer step -> Confidence check
                            |                            |
                      Course docs (read only)     low: hand off to agent
                                                  high: reply with source
```

| Part | Decision to record |
|---|---|
| Components or agents | One agent or several? Why the simplest option is enough |
| Data flow | What goes in and out of each step |
| Tools and MCP plan | Which systems it can call, read or write, and who approves |
| Memory and state | What persists per conversation, what is never stored |
| Human checkpoints | Which outputs a person must approve or can override |
| Deployment approach | Where it runs, who restarts it, how it is accessed |

### Pass bar

- Every arrow in the diagram has a labeled payload.
- Each tool is marked read or write, and write actions name a human approver.
- Memory is stated explicitly, including what you will not keep.
- At least one human checkpoint maps to a risk in the register.
- A reviewer who did not attend your planning can trace one question end to end.
- You can justify why you did not choose a more complex design.
- At least two ADRs record the choices on the map.

## Common misconceptions

- **"More agents means a better system."** Each extra agent adds handoffs and failures. Start with one and split only when a clear boundary forces it.
- **"The map is final once drawn."** It is frozen at architecture review, then changed only through [MVP Freeze and Change Control](./04-mvp-freeze-and-change-control.md).
- **"Human review is a weakness."** A well-placed checkpoint is how a system is allowed to touch real customers.

## Typical interview questions

<details>
<summary>Walk me through your architecture.</summary>

A student question enters a chat entry point, a retriever pulls passages from approved course documents, the model answers only from those passages with a cited source, and a confidence check routes weak answers to a human agent. Documents are read only, and nothing is stored beyond the conversation.

</details>

<details>
<summary>Why did you choose a single agent?</summary>

The workflow was one linear task with one set of tools. A second agent would add a handoff without a clear boundary, so I deferred it.

</details>

<details>
<summary>Where do humans stay in the loop?</summary>

On low-confidence answers and any request outside the document set. This maps to the risk that the assistant invents an answer.

</details>

## Learn more

- Article: [Architecture Decision Records](https://adr.github.io/) (ADR GitHub organization, for recording each choice on the map).

## Related

- [Mini PRD and Risk Register](./01-mini-prd-and-risk-register.md)
- [Configure, Skill or Code](./03-configure-skill-or-code.md)
- [Choosing an Agent Architecture](../../m3/15-agent-architectures/05-choosing-an-agent-architecture.md) (M3)
- [Technical Design: Course Support Assistant](../../m6/01-education-rag/03-technical-design.md) (M6)
