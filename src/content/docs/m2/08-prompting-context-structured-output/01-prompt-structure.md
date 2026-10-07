---
title: Prompt Structure
row: M2-L2.1
---
**In one sentence:** Prompt structure is the checklist of parts a production prompt spells out (role, objective, context, constraints, examples, output format and refusal conditions) so the model does the same job the same way on every request.

## What it is

A chat prompt can be one line, because you are there to clarify. A product prompt runs unattended on thousands of unseen inputs, and code reads the answer, so it must work like a spec.

Think of a call-center agent's binder: purpose, facts, rules, sample calls, a form to fill in, and an escalation card for calls that fit nowhere. Without the card, the agent improvises a confident answer. So does a model.

Anthropic suggests treating the model as "a brilliant but new employee who lacks context on your norms and workflows." Providers name and order the parts differently; treat them as a checklist.

## Why an FDE needs this

A freight broker's email-triage pilot routes emails to five queues using the model's answer. The prompt is "You are an expert logistics assistant. Classify this email." The logs show one failure per missing part, from chatty replies the router cannot parse to a made-up freight rate.

The FDE rewrites it in seven parts, re-runs the logged emails on both versions, and still validates the label in code: a prompt guides, it does not enforce.

## Key concepts

### The seven parts

```text
SYSTEM PROMPT (every request)
Role: You route emails for a freight broker's operations inbox.
Objective: Pick exactly one queue so the right team replies in time.
Context: One line per queue. Damage, shortage or loss is Claims.
Constraints: Never reply to senders, because only licensed agents may.
Examples: Two labeled emails, one mixing damage and billing.
Output format: JSON with "queue" and a one-sentence "reason".
Refusal conditions: Off-topic, unreadable or asks for a price:
  return queue "human_review".
USER TURN: the email text.
```

| Missing part | Failure in the pilot |
|---|---|
| Role | Generic tone, drifting scope |
| Objective | Unrequested draft replies |
| Context | "Pallet arrived crushed" routed to Billing |
| Constraints | An invented "Urgent Billing" label |
| Examples | Inconsistent label spelling |
| Output format | Chatty replies the router rejects |
| Refusal conditions | A made-up freight rate |

### System prompt or user turn

Standing parts go in the system prompt, written once and versioned. This request's material (the email, retrieved documents, the question) goes in the user turn, long documents first and the question last; Anthropic's tests on multidocument inputs found gains of up to 30 percent. User or document text in the system prompt would gain operator priority.

### Writing rules as a spec

Give each rule its reason. In Anthropic's example, "never use ellipses" works less well than saying a text-to-speech engine will read the reply; the model generalizes from reasons.

Say what to do, calmly. Google warns that broad negatives like "do not infer" get over-applied; Anthropic and OpenAI say "CRITICAL: you MUST" now tends to make models over-apply rules. Remove contradictory rules.

Refusal conditions are the out: when to decline, ask or hand off, and what to return, such as "not_found if the documents lack the answer." They guide but enforce nothing; OWASP's LLM08:2026 says authorization checks "must not be delegated to the LLM, whether through the system prompt or another mechanism."

### Where reasoning goes

If code parses the reply, "explain, then answer" breaks it; Anthropic notes that with JSON requested only in the prompt, the model often reasons in prose first. Use built-in thinking (billed as output, often hidden, so not an audit log) or a reasoning field before the answer in the schema that code logs but never acts on.

## Common misconceptions

- **"'You are a world-class expert' makes the model more accurate."** A study of 162 personas on 2,410 factual questions found no accuracy gain. A role sets scope and tone; the rest does the work.
- **"Longer prompts are better."** Microsoft lists overly long system messages as a pitfall. Add a rule when testing shows a failure.
- **"The prompt says 'refuse salary questions', so the app is safe."** A prompt guarantees nothing. Anything that must never happen needs a check in code.

## Typical interview questions

<details>
<summary>What are the parts of a production prompt, and why list them separately?</summary>

Role, objective, context, constraints, examples, output format and refusal conditions. Listing them exposes gaps: no format breaks the parser, and no refusal condition yields confident out-of-scope answers.

</details>

<details>
<summary>What goes in the system prompt versus the user turn?</summary>

Standing parts go in the system prompt, written once and versioned. This request's documents and question go in the user turn.

</details>

<details>
<summary>Outline a prompt that drafts warranty-claim replies for agents to review.</summary>

A drafting role, the policy and claim record as per-request context, and "never promise a refund, because only agents approve them." Output fields draft, policy_clause and needs_human; injury, legal threats or uncovered products set needs_human. Then I test it on past claims.

</details>

<details>
<summary>A stakeholder wants to add "CRITICAL: NEVER DISCUSS PRICING". What do you do?</summary>

I replace it with a calm rule, a reason and an alternative: "Don't quote prices, because sales sets them weekly; link the pricing page." Shouting tends to cause over-triggering. I re-run nearby test cases and add a code check if leaks are costly.

</details>

## Learn more

- Reference: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) (Anthropic docs, about 30 min)
- Reference: [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) (OpenAI docs, about 20 min)

## Related

- [Message Roles, System Prompts and Conversation History](../07-llm-application-foundations/04-message-roles.md)
- [Few-Shot Examples](./02-few-shot-examples.md)
- [Reusable Prompt Templates](./03-reusable-prompt-templates.md)
- [Structured Output and JSON Schema](./06-structured-output.md)
- [Refusals and Fallbacks](../12-safety-guardrails-hitl/07-refusals-and-fallbacks.md)
