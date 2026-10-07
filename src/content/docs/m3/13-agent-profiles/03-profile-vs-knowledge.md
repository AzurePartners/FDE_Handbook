---
title: Separating Agent Knowledge from the Profile
row: M3-L1.3
---
**In one sentence:** Separating knowledge from the profile means an agent's profile defines how it behaves and where to look things up, while facts like prices and policies stay in owned sources it reads at run time.

## What it is

An [agent profile](./02-agent-profiles.md) is the agent's job description. Separating knowledge means keeping what the agent should know (price lists, refund rules, product specs) out of it, in sources someone owns and keeps current.

A new hire's role sheet says "quote from the current price list" but never lists the prices: they change every quarter, the job does not.

Precisely, the profile holds behavior: the job, operating rules and how to find and cite each kind of fact. Knowledge sources hold what business owners change on their own schedule (policies, product data, prices, procedures), reached at run time through retrieval, files, lookup tools or memory. If pricing or legal must approve a change to a sentence, it is knowledge. For system prompts, Anthropic advises "the minimal set of information that fully outlines your expected behavior."

## Why an FDE needs this

An HR software vendor's Research, Draft and Review agents write its blog. In the pilot, someone pasted plan prices, an uptime promise and an integration count into the Draft and Review profiles. After a price change, only the Draft profile was edited, so the Review agent "corrected" drafts back to the old price. Two posts went live with it; nobody knew who owned the number. (Illustrative scenario.)

The FDE deleted every number from both profiles. Prices now come from a read-only `get_plan_prices` lookup against the billing catalog, and product claims from an approved-claims document product marketing owns, with its ID and effective date. A register names each owner.

## Key concepts

### What breaks when facts live in the profile

- **Stale values:** the copy never updates, and nothing warns you when the source does.
- **No citation:** a number from the prompt cannot be checked; a retrieved passage or lookup result carries an ID and date ([Grounding and Citations](../../m2/09-rag-knowledge-bases/07-grounding-and-citations.md)).
- **Contradictions:** with 30 days in the profile and 14 in the policy, the model picks one or blends them.
- **Bloat:** every call carries every fact. Claude Code's docs suggest keeping each `CLAUDE.md` instruction file under 200 lines, since longer files "consume more context and reduce adherence."

### How the agent reaches knowledge at run time

The profile keeps pointers, not payloads. Anthropic describes agents that keep "lightweight identifiers (file paths, stored queries, web links, etc.)" and load the data "at runtime using tools." The routes are [retrieval](../../m2/09-rag-knowledge-bases/01-retrieval-augmented-generation.md), files read on demand (including [skill reference files](../14-agent-skills/02-skill-md-and-progressive-disclosure.md)), [lookup tools](../../m2/10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md) for live records and [memory](../16-agent-state-memory/05-long-term-and-user-memory.md) about a user. The Draft profile now reads:

```text
Prices: call get_plan_prices; state the as-of date.
Product claims: search approved_claims; cite the claim id.
No source for a number, or sources disagree: mark [NEEDS SOURCE], escalate.
```

### An owner and update cadence for each source

Keep a register beside the profile; an unowned source is not ready for an agent.

| Source | Reached through | Owner | Updates |
|---|---|---|---|
| Billing catalog | `get_plan_prices`, live | Pricing team | On each change |
| Approved claims | Retrieval, with effective date | Product marketing | Monthly, then [re-indexed](../../m2/09-rag-knowledge-bases/05-metadata-filtering-and-freshness.md) |

## Common misconceptions

- **"Facts in the prompt are fine if we remember to update them."** Someone forgets, copies in other agents drift, and each edit is a prompt release to re-test.
- **"Moving facts into a file the profile imports separates them."** Imports load with the profile; Claude Code's docs note imported files "still load and enter the context window at launch."
- **"Separating knowledge means facts never appear in the prompt."** They appear constantly, loaded from the owned source for this task, with an ID and date.
- **"Once facts leave the profile, the agent stays current."** A source is only as current as its owner keeps it; an unowned index goes stale too.

## Typical interview questions

<details>
<summary>Why is a role definition not a source of facts?</summary>

A role says how the agent works; facts change on other people's schedules. Typed into a profile, a fact has no owner, date or citation and goes stale silently. The profile should point to where it lives.

</details>

<details>
<summary>How does a profile rule differ from a policy in a knowledge source?</summary>

A profile rule, like "never publish without review," governs the agent and changes with its job. A business policy, like a refund window, belongs to finance or legal, so the agent retrieves and cites it.

</details>

<details>
<summary>A Finance client wants fund fees and client risk limits in its agent's profile. What do you propose?</summary>

Fees come from a fund-data lookup with an as-of date, and confirmed risk limits from each client's record or memory, never a shared profile. The profile says to cite fees, use only confirmed limits and ask when one is missing.

</details>

<details>
<summary>A Draft agent still quotes last quarter's price. How do you debug it?</summary>

Open the trace. No price lookup means the number came from a profile, skill, memory or training data, so I remove hard-coded prices. A lookup returning the old price means a stale source for its owner. Then I add an eval case that fails when a price appears without a lookup.

</details>

## Learn more

- Article: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic Engineering, about 15 min)
- Reference: [How Claude remembers your project](https://code.claude.com/docs/en/memory) (Claude Code Docs, about 25 min)

## Related

- [Agent Profiles (Profile.md)](./02-agent-profiles.md)
- [Retrieval-Augmented Generation (RAG)](../../m2/09-rag-knowledge-bases/01-retrieval-augmented-generation.md)
- [Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [Read-Only Lookup Tools](../../m2/10-tool-calling-deterministic-logic/08-read-only-lookup-tools.md)
- [Long-Term and User Memory](../16-agent-state-memory/05-long-term-and-user-memory.md)
