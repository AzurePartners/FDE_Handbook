---
title: Handoffs and Agent Contracts
row: M3-L3.7
---
**In one sentence:** A handoff passes work from one agent to another; an agent contract is the agreed, checkable format for that exchange: the task, required inputs, structured result, and a status with errors.

## What it is

In a multi-agent system, work crosses between agents: Research passes findings to Draft, a triage agent passes a customer to billing. Each crossing is a handoff; the agreed format of what crosses is the agent contract.

Think of a nurse's shift change: no replay of twelve hours, just a short structured report (what was done, what is pending) and a pointer to the chart.

Precisely, a handoff transfers control or calls another agent as a tool; code checks the contract at the boundary. Handing a conversation to a person is [escalation](../../m2/12-safety-guardrails-hitl/08-escalation-and-human-takeover.md).

## Why an FDE needs this

A software company's Research agent hands briefs to a Draft agent. After a prompt tweak, Research listed sources in Markdown, not the `sources` field. Nothing errored: Draft's code saw no sources, and for three weeks Draft wrote from memory, citing a retired pricing tier. Draft also got Research's full transcript, so a vetoed angle kept resurfacing.

The FDE wrote a versioned `research_brief` contract that code checks before Draft starts, returning unsourced briefs to Research. Draft now gets the brief, decisions and a folder link, and a contract test runs on prompt changes. (Illustrative scenario.)

## Key concepts

### Two handoff styles

| | Transfer of control | Agent as a tool |
|---|---|---|
| Who answers the user | The receiver (typical for triage) | The caller, after checking the result |
| Receiver sees | Usually the whole conversation | Usually only what the caller sends |
| Examples | OpenAI Agents SDK handoffs, Google ADK `transfer_to_agent` | OpenAI `Agent.as_tool()`, ADK `AgentTool`, Claude Code subagents |

### The four parts of a contract

- **Task:** objective, boundaries and decisions already made (audience, vetoed angles), or agents contradict each other ([Multi-Agent Systems](./04-multi-agent-systems.md)).
- **Required inputs:** IDs and links, not pasted copies.
- **Structured intermediate output:** a named artifact with a fixed shape ([schema mechanics](../../m2/08-prompting-context-structured-output/06-structured-output.md)).
- **Status and errors,** so a failure never reads like a result.

```json
{
  "contract": "research_brief/v2",
  "task_id": "T-2291",
  "status": "done",
  "claims": [{"text": "SSO is in every plan", "source_url": "https://vendor.example/changelog"}],
  "decisions": ["Audience: IT managers", "No pricing comparison"],
  "errors": [],
  "workspace": "content-ops/T-2291/"
}
```

Each agent's output is declared in its [profile](../13-agent-profiles/05-agent-inputs-outputs-escalation.md); the contract is the shared agreement, versioned like a [data contract](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md). Across vendors, the Agent2Agent (A2A) protocol, a Linux Foundation project contributed by Google, standardizes the exchange: Agent Cards list capabilities, and tasks carry states such as input required or failed.

### Validating at the boundary

Code, not the receiving model, checks each payload before the next agent acts: schema, then business rules (matching task ID, `done` status, a source per claim). Microsoft's orchestration guide says to "validate agent output before you pass it to the next agent"; on failure, return it to the sender once with the error, ask a person, or halt.

Treat payloads as data, not instructions: text injected into a page Research read can ride along, so OWASP says to "validate and sanitize inter-agent communications." Framework guardrails may not run at every handoff: OpenAI's SDK runs input guardrails only for the first agent.

### What context travels

Defaults differ: OpenAI's SDK shows a transferred agent "the entire previous conversation history" unless an input filter trims it; nested agent calls usually start empty. Decide per boundary: usually the task, decisions and references (record IDs, a [landing pad](../16-agent-state-memory/08-persistence-patterns.md) folder); Anthropic suggests subagents "pass lightweight references back to the coordinator." Forwarded history also reaches the receiver's model provider; [filter](../../m2/08-prompting-context-structured-output/04-context-engineering.md) what it may not see.

## Common misconceptions

- **"A handoff means forwarding the chat history."** Transcripts bloat context, revive vetoed ideas and expose data. Send the task, decisions and references.
- **"If the payload fits the schema, the handoff worked."** Shape is not truth: a valid brief can still cite a dead link.
- **"Messages from our own agents are safe."** An agent that read a poisoned page can pass injected text along; treat payloads as untrusted data.

## Typical interview questions

<details>
<summary>What is an agent contract, and what does it contain?</summary>

The agreed, versioned format for work passing between agents: task and decisions, required inputs, structured output, and a status with machine-readable errors, validated by code at the boundary.

</details>

<details>
<summary>How does transferring control differ from calling an agent as a tool?</summary>

A transfer makes the specialist the active agent, answering the user and often seeing the whole history. A call keeps the caller in charge, sending only what it chooses and checking the result.

</details>

<details>
<summary>Design a handoff from a triage agent to a billing agent.</summary>

A transfer, since billing should own the conversation, with a validated payload (account ID, disputed charge, reason) and only relevant turns. Billing re-reads the account itself; a cap stops agents bouncing the customer.

</details>

<details>
<summary>Review passes a draft asserting two claims Research flagged as unverified. Where do you look?</summary>

The Draft-to-Review handoff in the trace: Draft's contract probably lacks per-claim status, so the flag vanished. I carry per-claim status through every contract, reject drafts using unverified claims, and add an eval case.

</details>

## Learn more

- Article: [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) (Anthropic, about 20 min)
- Reference: [AI agent orchestration patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns) (Microsoft Learn, about 30 min)
- Reference: [Handoffs](https://openai.github.io/openai-agents-python/handoffs/) (OpenAI Agents SDK, about 10 min)

## Related

- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Structured Output and JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [Agent Inputs, Outputs and Escalation Conditions](../13-agent-profiles/05-agent-inputs-outputs-escalation.md)
- [Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Agent Traces (Steps, Tool Calls, Handoffs, State Changes)](../18-agent-evaluation-debugging/02-agent-traces.md)
