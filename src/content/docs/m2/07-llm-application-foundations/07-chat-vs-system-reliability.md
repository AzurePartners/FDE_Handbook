---
title: Chat Behavior vs System Reliability
row: M2-L1.7
---
**In one sentence:** A good chat answer shows a model can do a task, not that it will do it correctly every time, unattended and at volume, inside software that trusts whatever comes back.

## What it is

In chat, you are part of the system. You explain the task, read every reply and rephrase when one looks off. The app helps too: Anthropic says Claude's apps "use a system prompt to provide up-to-date information, such as the current date," and that these prompts "do not apply to the Claude API."

A home cook tastes as they go; a restaurant serves 500 plates a night that nobody tastes before the customer. Chat is the home kitchen.

Chat shows capability: the model can succeed. A system needs reliability: it succeeds on every call, unwatched, as output flows into other code. Anthropic's evals guide contrasts `pass@k` (at least one success in k tries) with `pass^k` (all k succeed). A chat demo is `pass@k`, since the person retries until it looks right.

## Why an FDE needs this

A telecom's support lead pastes 30 tickets into a chat app: "label each as billing, outage, account or other." All 30 look right, so she asks you to "just hook it up" to a helpdesk taking about 6,000 tickets a day (illustrative numbers and rates). In chat, she had rephrased twice and skipped two Spanish tickets.

Wired to the API, the logs show zero errors. Yet 2% of replies invent labels ("Billing/Refund") that fall into a default queue, and 1% of urgent outages come back as a valid but wrong "other," so nobody is paged: 60 misrouted customers a day. A retried ticket gets a different label, so the audit log and queue disagree.

## Key concepts

### What chat quietly supplied

An API call gets only what your code sends, so the application must supply history (Message Roles), instructions and the label list (Prompt Structure), lookup tools (Tool Calling), and output checks with a fallback (Programmatic LLM Interfaces).

### Silent failures look like success

Most model failures arrive as normal responses: a wrong but valid label, a refusal, or a reply cut off at the token limit (stop reason `max_tokens`) all pass as answers unless code checks.

```python
label = next(b.text for b in resp.content if b.type == "text").strip()  # "Billing/Refund"
queue = QUEUES.get(label, "general")  # wrong queue, no error raised
```

OWASP's GenAI LLM Top 10 2026 (August 2026) covers this under LLM07:2026 Misinformation, "a system-level failure" in which incorrect output "is trusted and acted upon."

### Volume turns rare into daily

At 6,000 calls a day, a 1% failure rate means about 1,800 bad outcomes a month, though it rarely shows in a handful of chat tries. Chains compound: four 95% steps give about 81% end to end (`0.95^4`), a rule of thumb that assumes independent errors. Anthropic's agent guidance warns of "compounding errors" and recommends checks between steps.

### Variation breaks what retries assume

The same input can return a different answer (mechanism in Generation Settings), so a retry is no longer a repeat, audit logs cannot be reproduced, and tests turn flaky. Temperature is no fix: Anthropic says results are "not fully deterministic" even at 0.0, and Claude Opus 4.7 and later, Sonnet 5 and later, and Fable models reject any temperature other than 1.0.

## Common misconceptions

- **"If it works in ChatGPT or Claude.ai, the API will behave the same."** Chat apps may add a system prompt, memory and tools, and you read every reply. The API gets only what you send.
- **"It passed 20 test prompts, so it's reliable."** At a true 1% failure rate, 20 prompts all pass about 82% of the time (`0.99^20`). Zero failures in 20 only shows, at 95% confidence, a rate under about 15%.
- **"A newer model will fix reliability."** It raises capability but cannot supply missing context. Laban et al. (ICLR 2026) found a 39% average drop when tasks spanned several chat turns, mostly from "a significant increase in unreliability."

## Typical interview questions

<details>
<summary>Why doesn't good chat behavior mean an LLM feature is reliable?</summary>

In chat, a person supplies context and checks every reply, and the app adds a prompt and tools. In a system, output flows unattended into other code at volume, so rare failures become daily incidents that look valid.

</details>

<details>
<summary>What is the difference between a model being able to do a task and doing it reliably?</summary>

Able means at least one success in k tries (`pass@k`), as a chat demo shows. Reliable means all k succeed (`pass^k`): at 75% per try, three in a row pass only about 42% of the time.

</details>

<details>
<summary>A client wants ticket triage that worked in chat connected to their helpdesk. What do you do first?</summary>

List what chat silently supplied (instructions, labels, context, a human checker) and make the application supply each, with output checks and a human fallback queue. Then measure error rates on real tickets and agree an acceptable rate with the client.

</details>

<details>
<summary>An extraction job logs zero errors, but finance reports mismatched invoice totals. What is likely happening?</summary>

Silent errors: logs record exceptions, not wrong but valid values or truncated replies. Check stored stop reasons, compare a sample with source documents, and add checks such as line items summing to the total.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, non-determinism section, about 5 min)
- Reference: [LLM07:2026 Misinformation](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM07_Misinformation.md) (OWASP GenAI Security Project, about 8 min)

## Related

- [Generation Settings (Temperature, Top-p, Max Tokens, Reasoning Effort)](./05-generation-settings.md)
- [Hallucinations and Other Model Output Failures](./06-hallucinations-and-output-failures.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](./08-programmatic-llm-interfaces.md)
- [AI Evaluation (Evals)](../11-ai-evaluation/01-ai-evaluation.md)
- [Documenting Known Limitations](../12-safety-guardrails-hitl/09-known-limitations.md)
