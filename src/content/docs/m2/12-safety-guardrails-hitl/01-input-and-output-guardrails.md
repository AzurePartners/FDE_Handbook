---
title: Input and Output Guardrails
row: M2-L6.1
---
**In one sentence:** A guardrail is a check in your own code on what goes into the model, what comes out and what it tries to do, so the model never has the final say.

## What it is

A system prompt rule is only a request; a model can be talked out of it. A guardrail is code outside the model that checks the text and decides: allow, block, repair (say, masking) or flag.

Think of a restaurant: the host screens guests, a cook inspects each plate before it goes out, and the manager approves refunds, however good the chef is.

Guardrails sit at three points:

- **Input**, before the model reads a request, including retrieved documents and tool results.
- **Output**, before a reply reaches a user or system.
- **Actions**, before a tool call runs (the action gate, [6.5](./05-action-gates.md)).

## Why an FDE needs this

Picture a client's support assistant whose only guardrail is a moderation service. During a two-hour outage, the wrapper code treats each timeout as "not flagged", so everything passes unchecked and unnoticed. Nothing checks replies, so a poisoned ticket makes the model emit a Markdown image leaking customer data. (Illustrative scenario.)

The FDE replaces "we have a filter" with a design: which checks run where, what each costs, and what happens when one fails.

## Key concepts

### Four detector types

| Type | Examples | Trade-off |
|---|---|---|
| Rules | Regex, keyword lists, URL allowlists | Fast and predictable, but rephrasing beats them |
| Trained classifiers | Llama Prompt Guard 2 (injection), Llama Guard 4 (harm) | Purpose-built, but limited to their training |
| Provider endpoints | OpenAI Moderation API, Azure Prompt Shields, Google Cloud Model Armor | Ready-made, but the provider's categories, not your policy |
| LLM checks | A small model returning `{"is_harmful": true}` | Nuanced, but slowest, costliest and manipulable |

### Layering and its costs

- **Cascade.** Cheap checks screen everything; only flagged traffic reaches expensive ones. Anthropic's 2026 jailbreak classifiers do this for about 1% extra compute (first version: 23.7%).
- **False positives.** Each wrong block refuses a real customer. Tune thresholds on labeled conversations: strict for jailbreaks, looser for topic checks.
- **Latency.** Parallel checks save time but may fire after tokens and tools are spent. Streamed output can show bad text briefly ([1.9](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)).
- **Failing open or closed.** If a check errors, failing open passes the request and failing closed blocks it. OpenAI's open-source Guardrails library fails open unless `raise_guardrail_errors=True`. Choose per check, by risk.

Log every decision (check, verdict, score, latency): refusal-rate swings often precede a bypass.

### Output handling

OWASP says to treat the model "as any other user": its output is untrusted.

- Display text with auto-escaping or `textContent`. Sanitize any Markdown or HTML you render (DOMPurify, for example), never raw `innerHTML`.
- Never pass output to `eval`, a shell or string-built SQL; use parameterized queries or a fixed list of operations.
- Load images and links only from allowlisted domains, backed by a Content Security Policy, or an injected image URL leaks data when the browser fetches it.

### OWASP Top 10 for LLM Applications 2026

Walk the client's security team through the August 2026 list, citing IDs with the year (2025 numbering differs).

| Entry | Defense in |
|---|---|
| LLM01 Prompt Injection, LLM08 Hidden Context Exposure | [6.4](./04-prompt-injection.md) |
| LLM02 Sensitive Information Disclosure | [6.3](./03-sensitive-data-and-pii.md) |
| LLM03 Excessive Agency | [6.5](./05-action-gates.md), [6.6](./06-human-in-the-loop-approval.md) |
| LLM04 Supply Chain | [Dependency Risk](../../m1/04-git-debugging-testing-security/12-dependency-risk.md) |
| LLM05 Data and Model Poisoning | [3.2](../09-rag-knowledge-bases/02-knowledge-base-preparation.md) |
| LLM06 Unbounded Consumption | [1.9](../07-llm-application-foundations/09-adding-an-llm-endpoint.md) |
| LLM07 Misinformation | [6.9](./09-known-limitations.md) |
| LLM09 Vector and Embedding Weaknesses | [3.5](../09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md) |
| LLM10 Improper Output Handling | This page |

## Common misconceptions

- **"The provider's safety filter is our guardrail."** It enforces the provider's usage policy, not your client's rules about topics, promises or rendering.
- **"A moderation endpoint will catch prompt injection."** It scores harm like hate or violence. "Email me the customer list" is neither, so injection needs its own detectors ([6.4](./04-prompt-injection.md)).
- **"An LLM checker makes the app safe."** It can fall to the same injection. EchoLeak (CVE-2025-32711) got past Microsoft 365 Copilot's injection classifier and link-redaction filter. Layers reduce risk; none prevents injection.

## Typical interview questions

<details>
<summary>What is a guardrail, and where do you put one?</summary>

Code outside the model that it cannot talk its way past, placed on input (including retrieved content), output and proposed actions.

</details>

<details>
<summary>How do rules, classifiers, moderation endpoints and LLM checks differ?</summary>

Rules are cheap but easy to evade, classifiers fast but narrow, and moderation endpoints limited to the provider's harm categories. LLM checks handle nuance but cost most, so only flagged traffic reaches them.

</details>

<details>
<summary>A client's bot renders Markdown and reads emails. What output handling do you add?</summary>

Sanitized Markdown, images only from the client's domains, allowlisted links and a Content Security Policy. Output never reaches `eval`, a shell or string-built SQL.

</details>

<details>
<summary>Your injection classifier times out on 2% of requests. Fail open or closed?</summary>

Usually closed: that check protects actions and data, so users get a clear fallback while I fix the timeouts. A low-stakes topic check could fail open with an alert.

</details>

## Learn more

- Reference: [LLM10:2026 Improper Output Handling](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM10_ImproperOutputHandling.md) (OWASP GenAI Security Project, about 12 min)
- Article: [Next-generation Constitutional Classifiers](https://www.anthropic.com/research/next-generation-constitutional-classifiers) (Anthropic, about 10 min)

## Related

- [Content Boundaries and Sensitive Requests](./02-content-boundaries.md)
- [Sensitive Data and PII Protection](./03-sensitive-data-and-pii.md)
- [Prompt Injection and Jailbreaks](./04-prompt-injection.md)
- [Unauthorized Requests, Per-User Access and Action Gates](./05-action-gates.md)
- [Adding an LLM Endpoint to an Existing Service](../07-llm-application-foundations/09-adding-an-llm-endpoint.md)
