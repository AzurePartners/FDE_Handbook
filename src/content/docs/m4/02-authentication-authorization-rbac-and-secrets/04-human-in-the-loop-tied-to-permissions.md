---
title: Human-in-the-Loop Tied to Permissions
row: M4-L2.4
---
**In one sentence:** High-risk actions should require explicit human approval enforced by the permission system, not by asking the model nicely in a prompt, because a prompt is not a security control and a probabilistic system must not be the final authority on consequential actions.

## What it is

**Human-in-the-loop (HITL)** here means gating certain actions behind a real approval step. The key design principle: tie HITL to **permissions**, not to prompt instructions. Telling the model "always ask before deleting" is a suggestion it can ignore, misunderstand, or be manipulated past. Enforcing "this action requires an approved human authorization token" in deterministic code is a control. So you classify actions by risk: low-risk, reversible ones the agent may do autonomously; high-risk or irreversible ones require an explicit approval that the *system* checks before executing.

## Why an FDE needs this

AI agents will occasionally produce wrong or manipulated outputs. If a consequential action (issuing a refund, deleting records, sending an external message) can be triggered by the model alone, one bad output causes real harm. Enforcing approval for high-risk actions in the permission layer, so the model can *request* but not *execute* them unilaterally, is what makes an agent safe to deploy against real systems.

## Key concepts

- **Prompt ≠ permission:** instructions in a prompt are not a security boundary.
- **Classify by risk/reversibility:** autonomous for cheap/reversible; approval-gated for costly/irreversible.
- **Enforce in code:** the system checks for a valid human approval before executing gated actions.
- **Model requests, human authorizes, code executes:** the model can propose the action; it can't perform it alone.
- **Audit the approval:** record who approved what (ties to observability/governance).

## Common misconceptions

- **"Telling the model to ask first is enough."** It can be ignored or bypassed; the gate must be enforced by code.
- **"HITL means a human checks everything."** It means a human checks the *high-risk* things; over-gating destroys the value.
- **"The agent needs to execute to be useful."** For risky actions, requesting and having a human authorize is the safe, still-useful design.

## Typical interview questions

<details>
<summary>Why not implement "ask before high-risk actions" purely in the prompt?</summary>

Because a prompt is a suggestion, not a control, the model can misunderstand it, drift, or be manipulated past it by prompt injection. High-risk actions must be gated in the permission system so the model can only request them and deterministic code requires a valid human approval before executing.

</details>

<details>
<summary>How do you decide which actions need a human gate?</summary>

By cost and reversibility. Cheap, reversible actions can be autonomous. Expensive or irreversible ones, money movement, deletions, external communications, require explicit human approval enforced by the system, with the approval recorded for audit.

</details>

## Learn more

- Docs: [LangGraph Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) (approval before high-risk tool calls)
- Article: [OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) (prompts are not a security boundary)

## Related

- [RBAC, Least Privilege & Read/Write Permissions](./02-rbac-least-privilege-and-read-write-permissions.md)
- [Guardrails & safety (Module 2/3)](../03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)
