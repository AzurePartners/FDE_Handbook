---
title: Memory Write Policies
row: M3-L4.6
---
**In one sentence:** A memory write policy is the set of rules, enforced by code, that decide what an agent may save to memory, on whose word, with what source and review date, and how new facts replace old ones.

## What it is

Agent memory holds notes later sessions trust, such as preferences, confirmed rules and finished analyses ([Long-Term and User Memory](./05-long-term-and-user-memory.md)). One wrong note can steer answers for months; a write policy decides what gets in.

A careful assistant's notebook reads "Ms. Chen: mornings only (she said so, March 3)", not "seemed tired, maybe cancel Fridays", and a changed preference replaces the old line.

Precisely, for each candidate write the policy settles: is the type allowed, who vouches for it, what source and review date it carries, what it replaces, and what triggers it. The model may propose; code decides.

## Why an FDE needs this

A publisher's Draft agent could save anything to team memory. Within a quarter, an editor's "skip the intro this time" was a standing rule, a guess that readers dislike lists was stored as fact, and two undated tone rules, "formal" and "conversational", were both active. Drafts flipped tones, and nobody knew who had set what. (Illustrative scenario.)

The FDE put the rules in the code that executes writes: allowed types, confirmation for standing rules, source, date and task ID on every entry, review dates and one active value per rule.

## Key concepts

### What to write and what to leave out

| Write | Leave out |
|---|---|
| Confirmed rules: "no first-person voice in client blogs" | Guesses: "readers seem to dislike lists" |
| Stable preferences: "UK spelling, short headings" | One-off requests: "skip the intro this time" |
| Dated decisions: "angle set to cost of churn, June 10" | Raw documents: link to the [knowledge base](../../m2/09-rag-knowledge-bases/02-knowledge-base-preparation.md) instead |
| Finished-work summaries, linked to the output | Secrets, account numbers, [sensitive personal data](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md) with no stated purpose |

OpenAI's personalization cookbook puts this test in its `save_memory_note` tool: notes must be "stated or clearly confirmed by the user (not inferred)", never instructions.

### Authority and provenance

Each write needs a voucher: the user agreeing to a restated rule ("Save 'UK spelling' as a standing rule?"), a system of record like a CRM, or a named owner for team rules. Text the agent merely read, such as a web page, never vouches for itself ([Memory Pollution, Staleness and Privacy Risks](./07-memory-pollution-staleness-privacy.md)). Treat each entry type as a [data contract](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md) with provenance fields (who said it, when, in which task) and a review date, so anyone can check it.

### Supersede, do not append

Key each fact by user, subject and attribute. A new value marks the old entry superseded, kept for audit but never loaded. Two active entries that disagree leave the model to pick or blend them; LangChain warns that some models tend to over-insert and others to over-update, so code enforces one active value per key.

### Code decides when a write happens

Hot-path writes happen mid-conversation, usually through a tool, so the user can confirm at once, but add latency; background writes run in a separate job, often after the session (LangChain's terms). Either way code executes it; with Anthropic's memory tool, "Claude requests file operations, and your application executes them." Claude "usually refuses" to store sensitive data, yet Anthropic advises validating in your handler:

```python
def handle_memory_write(p, user, task):
    if p["type"] not in ALLOWED or looks_sensitive(p["value"]):
        return reject(p)
    if p["type"] in NEEDS_CONFIRMATION and not user_confirmed(user, p):
        return ask_to_confirm(user, p)              # nothing stored yet
    entry = {**p, "status": "confirmed", "said_by": user.id, "task_id": task.id,
             "created": today(), "review_by": today() + REVIEW_AFTER[p["type"]]}
    memory.supersede(user.id, p["key"], by=entry)
    memory.save(entry)
```

## Common misconceptions

- **"The model knows what is worth remembering."** It stores too much or overwrites too eagerly, and text it read can fool it. Code checks every write.
- **"If the user said it, it is confirmed."** A passing remark is not a standing rule; confirmation means the user agreed to the rule as restated.
- **"Store everything now and filter later."** Stored guesses resurface in later calls, and every item is data you must protect and delete on request.

## Typical interview questions

<details>
<summary>What is a memory write policy?</summary>

Rules, enforced in code, for what an agent may store: allowed types, who must vouch for each, required provenance and review date, and how new values supersede old ones.

</details>

<details>
<summary>How do hot-path and background memory writes differ?</summary>

Hot-path writes happen during the conversation: usable at once and confirmable by the user, but slower. Background writes run later in a separate job: no added latency, but delayed. Code validates both.

</details>

<details>
<summary>A Finance agent remembers prior analysis, preferences and confirmed constraints. Which writes need confirmation?</summary>

Constraints and preferences need the analyst's explicit yes, stored with who, when, which task and a review date. Code writes analysis summaries when a task closes. Guesses, raw filings and account numbers are never stored.

</details>

<details>
<summary>Memory holds two active entries, "report in EUR" and "report in USD". What went wrong?</summary>

The write path appended instead of superseding. I key entries by user, subject and attribute, confirm the current value with the analyst, supersede the other, and test that a second write leaves one active value.

</details>

## Learn more

- Reference: [Memory overview](https://docs.langchain.com/oss/python/concepts/memory) (LangChain, about 12 min)
- Practice: [Context Engineering for Personalization: State Management with Long-Term Memory Notes](https://developers.openai.com/cookbook/examples/agents_sdk/context_personalization) (OpenAI Cookbook, about 35 min)

## Related

- [Long-Term and User Memory](./05-long-term-and-user-memory.md)
- [Memory Pollution, Staleness and Privacy Risks](./07-memory-pollution-staleness-privacy.md)
- [Sensitive Data and PII Protection](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)
- [Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)
- [Agent State and Memory Types](./01-state-and-memory-types.md)
