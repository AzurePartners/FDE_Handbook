---
title: Agent Inputs, Outputs and Escalation Conditions
row: M3-L1.5
---
**In one sentence:** An agent's inputs, outputs and escalation conditions are the part of its profile that says what it needs to start, what it must hand back with a status, and when to stop and pass the decision on.

## What it is

A hospital lab works this way: it rejects an incompletely labeled sample with a reason, reports results as final or preliminary, and phones the ward when a value crosses a critical limit.

An agent's [profile](./02-agent-profiles.md) declares the same interface. **Inputs** are named fields, each required or optional, with a source and a rule for when it is missing. The **output** is one named deliverable with a fixed structure and a **status** saying whether it is finished. **Escalation conditions** are observable triggers, each with a receiver: the person, queue or agent that decides next.

## Why an FDE needs this

A software vendor's sales team has an agent answer customers' security questionnaires. For a bank, the agent assumed the bank had the Enterprise plan, agreed to an uptime commitment only legal may approve, invented answers the policy library lacked and skipped a tab the parser could not read. The bank's lawyers later cited the answers as commitments. (Illustrative scenario.)

The FDE declared required inputs including the plan, a `questionnaire_response` with a source per answer and a status, and five escalation triggers with receivers. The next response came back `partial`: 212 sourced answers and two open questions, each routed with a reason.

## Key concepts

### Inputs: declared, sourced, checked first

The agent requires the file and customer (from the requester) and the plan (from the CRM); if the CRM has none, it returns `needs_input` naming the field. The optional due date defaults to five business days, recorded as an assumption. OpenAI's agent guide calls for "an alternative step if a required piece of info is missing." Check required fields in code before any model call.

### The output: a named deliverable with a status

```json
{
  "deliverable": "questionnaire_response",
  "status": "partial",
  "answers_file": "bank_v1.xlsx",
  "answered": 212,
  "open": [
    {"id": "4.7", "reason": "weak_evidence", "sent_to": "security_team"},
    {"id": "9.2", "reason": "missing_authority", "sent_to": "legal"}
  ],
  "assumptions": ["due_date: 2026-10-06 (default)"]
}
```

Code routes on the status: `done` to the next step, `needs_input` to the requester, `escalated` to the receiver, `partial` to a reviewer. [Structured output](../../m2/08-prompting-context-structured-output/06-structured-output.md) enforces the shape; agent SDKs accept a final-output schema (Claude Agent SDK `output_format`, OpenAI Agents SDK `output_type`, Google ADK `output_schema`).

### Escalation conditions as observable triggers

"Escalate when unsure" cannot be tested; "no approved answer found" can.

| Condition | Observable trigger | Receiver |
|---|---|---|
| Missing authority | Question on the legal-terms list | Legal queue |
| Weak evidence | No approved library answer | Security team queue |
| Conflicting sources | Two approved answers disagree | Policy owner |
| Repeated tool failure | Parser fails 3 times on one tab | Platform queue |
| Budget used up | Step or cost limit reached | Requester, as `partial` |

Evidence checks are covered in [Knowledge Gaps](../../m2/09-rag-knowledge-bases/08-knowledge-gaps.md) and limits in [Bounded Execution](../17-persistent-agents/04-bounded-execution.md). Route to roles or queues, not people, with one specific question, the evidence and work so far. Handing a live chat to staff is different (see Related).

### Partial work instead of a guess

Models lean toward answering; a 2025 OpenAI paper argues training and evaluation reward guessing over admitting uncertainty. Requiring every field adds pressure: the only way to fill a box is to invent. Anthropic's Agent SDK docs advise making fields optional when "the task might not have all the information." Add open items with reasons, so even a run stopped by a limit returns its work.

## Common misconceptions

- **"The agent can work out missing inputs from context."** A silent guess, like assuming the Enterprise plan, gives a confident wrong answer. Declare per input: look up, default, ask or stop.
- **"Telling the agent to escalate when unsure is enough."** Its sense of being unsure cannot be tested, and the line names no receiver.
- **"A partial or escalated run is a failed run."** Stopping where evidence or authority ends is correct. The failure is a finished-looking guess.

## Typical interview questions

<details>
<summary>What goes into an agent's inputs, outputs and escalation conditions?</summary>

Inputs: named fields, required or optional, each with a source and a missing-value rule. Output: one named, structured deliverable with a status. Escalation: observable triggers, each with a receiver.

</details>

<details>
<summary>What is the difference between `needs_input` and `escalated`?</summary>

`needs_input` means the requester can unblock the task with a missing or ambiguous input. `escalated` means someone else must decide: missing authority, conflicting sources or failing tools. Different receivers, different statuses.

</details>

<details>
<summary>Define the interface for an insurer's agent that prepares claim files.</summary>

Inputs: claim ID, policy number (looked up if missing), loss date (else `needs_input`). Output: a `claim_file` whose coverage findings cite policy clauses, plus a status. Fraud indicators go to investigations, unclear coverage to an adjuster.

</details>

<details>
<summary>Outputs look complete, but reviewers keep finding invented answers. What do you check?</summary>

Whether the schema forces guessing (every field required, no `partial` status), whether inputs are checked before the run, and whether tool failures escalate or let the model answer from memory.

</details>

## Learn more

- Reference: [Contact humans with tool calls](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-07-contact-humans-with-tools.md) (HumanLayer 12-Factor Agents, about 5 min)
- Reference: [Get structured output from agents](https://code.claude.com/docs/en/agent-sdk/structured-outputs) (Claude Agent SDK docs, about 10 min)

## Related

- [Agent Profiles (Profile.md)](./02-agent-profiles.md)
- [Structured Output and JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [Escalation Paths and Human Takeover](../../m2/12-safety-guardrails-hitl/08-escalation-and-human-takeover.md)
- [Handoffs and Agent Contracts](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
- [Agent Success Criteria and Definition of Done](./06-agent-success-criteria.md)
