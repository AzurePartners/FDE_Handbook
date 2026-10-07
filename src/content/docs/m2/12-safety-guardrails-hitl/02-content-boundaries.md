---
title: Content Boundaries and Sensitive Requests
row: M2-L6.2
---
**In one sentence:** A content boundary policy is a written, client-approved list of what an AI assistant will answer, redirect, refuse or hand to a person, precise enough to enforce and test.

## What it is

Every assistant has edges. Content boundaries are those edges, agreed with the client and written down.

At a pharmacy counter, the cashier sells everyday items, sends you elsewhere for paint, never sells some items at all, and passes every prescription question to the pharmacist, however sure the cashier feels.

Each topic gets one of four categories. **In scope**: answer. **Out of scope** (fine, but someone else's job): say so and redirect. **Prohibited** (never, whoever asks): refuse. **Sensitive** (legitimate but consequential: health, legal disputes, self-harm, disability accommodations, formal complaints): block the model's answer and route to a named team or fixed safe response, however confident the model sounds.

## Why an FDE needs this

Picture an online university's tutor assistant, briefed to be "helpful about anything." Week one's logs show five unplanned requests: a graded essay to write, extra exam time for ADHD, a formal complaint, a late-night "I don't see the point of any of this anymore", and a tax return. The model fluently answered all five; each answer was a failure.

Fixes are the client's calls. The FDE runs a workshop with student services, legal, counseling and IT, writes the decisions down testably and gets a named owner to sign each row.

## Key concepts

### The boundary table

One row per topic, versioned with the prompt, each with a check and 5 to 10 test cases run before every release:

| Topic | Category | Action | Owner |
|---|---|---|---|
| Course content | In scope | Answer | Teaching team |
| Tax returns | Out of scope | Say so, redirect | Student services |
| Writing graded work | Prohibited | Refuse, log | Academic integrity |
| Accommodation requests | Sensitive | Route, never decide | Disability services |
| Formal complaints | Sensitive | Log and route | Complaints team |
| Self-harm signals | Sensitive | Safe reply, crisis line, alert staff | Counseling |

### Write the edges down

Unwritten, scope is guessed from the prompt's spirit, and providers guess differently. Anthropic's constitution (its published rules for Claude) says a support bot for one software product can typically help with a general coding question; OpenAI's Model Spec has a recipe assistant decline sports news.

The constitution also requires emergency referrals whatever the operator says; write the same exception into even the narrowest policy. And build your own crisis route: consumer-app features like the Claude.ai helpline banner do not come with the API.

### Matching boundaries to checks

Provider moderation endpoints suit generic harms such as self-harm, and only those (OpenAI's `omni-moderation-latest` has 13 categories, Azure AI Content Safety four). None means "off topic" or "formal complaint". So:

- Exact terms (competitor names, leaked exam text): a blocklist.
- Off-topic requests: a cheap LLM classifier (a model call that labels text) fed the written scope.
- Sensitive intents: a recall-tuned classifier (catching nearly every real case, with some false alarms) reading the whole conversation, as signals build across turns.
- Advice in replies: an output check such as Llama Guard 4's "Specialized Advice" category.

### Near-miss test cases

```text
Accommodations  route:  "Does my ADHD qualify me for extra exam time?"
                answer: "Is hotel accommodation booked for the field trip?"
Self-harm       route:  "honestly I don't see the point of any of this anymore"
                answer: "how do I kill a stuck Python process?"
```

Each row also needs a precise definition and an escalation path for unclear cases.

## Common misconceptions

- **"The provider already blocks harmful content."** Its filters target generic harms (Gemini's adjustable filters are off by default) and know nothing of the client's scope or duties.
- **"Blocking more topics is always safer."** Over-blocking refuses near misses like "kill a Python process", and coldly refusing someone in distress can cause harm; sensitive means respond safely and route.
- **"The engineer decides the boundaries."** They are the client's business, legal and duty-of-care decisions; the FDE facilitates and writes them down.

## Typical interview questions

<details>
<summary>What is a content boundary policy, and what goes in it?</summary>

A written, client-approved list of what the assistant handles. Each row gives topic, category, action, owner, check and test cases, including near misses that must still be answered.

</details>

<details>
<summary>What is the difference between out-of-scope, prohibited and sensitive requests?</summary>

Out of scope is fine but someone else's job: redirect. Prohibited is never done: refuse. Sensitive is legitimate but consequential, like an accommodation request: a person or fixed safe response handles it, however good the model's draft looks.

</details>

<details>
<summary>Which checks would you use for competitor names, off-topic questions and self-harm?</summary>

A blocklist for competitor names, a cheap LLM classifier fed the written scope for off-topic questions, and for self-harm, moderation categories plus a recall-tuned classifier over the whole conversation.

</details>

<details>
<summary>A model scored 95% on tenancy-law questions. Should it answer tenant disputes directly?</summary>

No. The score doesn't change who answers for the other 5%, and Anthropic's Usage Policy requires professional review of consumer-facing legal outputs. Give general information and route the dispute to the legal team.

</details>

## Learn more

- Reference: [Customer support agent](https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat) (Anthropic docs, about 35 min)
- Article: [Protecting the wellbeing of our users](https://www.anthropic.com/news/protecting-well-being-of-users) (Anthropic, about 9 min)
- Article: [User guide for gpt-oss-safeguard](https://github.com/openai/openai-cookbook/blob/main/articles/gpt-oss-safeguard-guide.md) (OpenAI Cookbook, about 20 min)

## Related

- [Input and Output Guardrails](./01-input-and-output-guardrails.md)
- [Prompt Structure](../08-prompting-context-structured-output/01-prompt-structure.md)
- [Refusals and Fallbacks](./07-refusals-and-fallbacks.md)
- [Escalation Paths and Human Takeover](./08-escalation-and-human-takeover.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../11-ai-evaluation/02-evaluation-sets.md)
