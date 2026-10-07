---
title: Long-Term and User Memory
row: M3-L4.5
---
**In one sentence:** User memory is what an agent keeps about one person (preferences, confirmed constraints, decisions); long-term memory is what it keeps from past work (prior analyses, lessons); both live outside the model, scoped and loaded by your code.

## What it is

A new session starts blank: the model keeps nothing between calls. Memory lets an agent know today what you settled last month. **User memory** holds facts about one person: preferences, confirmed constraints and past decisions. **Long-term memory** holds what the agent learned from earlier work, often for a team: prior analyses and lessons.

A family doctor works this way: your chart lists allergies and standing instructions, while the practice's case notes help every doctor there.

Precisely, both outlive any one [thread](./03-conversation-state.md) or [task](./04-task-state.md). They are data your app stores and loads into later calls. Business-owned facts such as prices belong in [owned knowledge sources](../13-agent-profiles/03-profile-vs-knowledge.md), not memory.

## Why an FDE needs this

A content agency ran one Draft agent for six client brands, with memory kept per editor. When an editor moved from a bank's account to a sportswear brand's, her memory carried the bank's formal tone into sneaker copy. Her replacement on the bank started empty and reused a phrase its lawyers had already rejected. Nobody could see what the agent remembered, so nobody could fix it. (Illustrative scenario.)

The FDE split memory by scope: brand lessons, such as legal rejections, became long-term memory keyed by client and shared by the account team; working habits stayed in each editor's user memory. A Memory tab now shows every entry, with source and date, for editors to correct.

## Key concepts

### Storing and recalling memory

- **Profile records:** structured fields loaded into every call, such as a Finance analyst's `currency: CHF` and `exclude: defense (confirmed May 14)`. They are exact, so confirmed constraints belong here.
- **Searchable notes:** many small dated entries, such as a Q2 utilities review with its sources, recalled by keyword or [vector search](../../m2/09-rag-knowledge-bases/04-embeddings-and-vector-search.md). They scale, but a search can miss an entry.
- **Memory files through a tool:** the model reads and writes them. With Anthropic's memory tool, Claude requests commands like `view` or `str_replace` under `/memories`, and your handler maps that path onto storage "such as a per-user directory or keys in a database." What it may save is a [write policy](./06-memory-write-policies.md) question.

Recall runs up front or on demand: Google's ADK has `preload_memory`, which retrieves memory at the start of every turn, and `load_memory`, which the agent calls when it chooses. On demand saves tokens, but the agent may not look.

### Scoping by user, team and tenant

Every read and write carries a scope key (tenant, team, user) that code takes from the signed-in session, never from the model or the user's text. In a memory tool handler:

```python
from pathlib import Path

def resolve(session, path: str) -> Path:
    root = (Path("/srv/memory") / session.tenant_id / session.user_id).resolve()
    target = (root / path.removeprefix("/memories").lstrip("/")).resolve()
    if not target.is_relative_to(root):  # blocks "../" escapes
        raise PermissionError(path)
    return target
```

### Letting users see and correct memory

Show users every entry about them, with source and date, let their edits change the stored entry, and list the memories each answer used. Claude's apps offer a memory summary users can view and edit, and a separate memory per project. Privacy duties are in [Memory Pollution, Staleness and Privacy Risks](./07-memory-pollution-staleness-privacy.md).

## Common misconceptions

- **"Memory means the model learns from our chats."** Nothing retrains the model. Memory is data your app stores and reloads, so you can inspect, correct and delete it.
- **"Memory is just vector search over old chats."** That is one recall method, and a search can miss a confirmed constraint; constraints belong in a record loaded every time.
- **"Frameworks scope memory per user by default."** A Microsoft Agent Framework sample shares one memory folder across all sessions until you set per-user or per-tenant folders.
- **"Deleting the chat deletes what the agent remembered."** Memory is stored apart from threads; OpenAI's help center says ChatGPT's saved memories are kept separately from chat history.

## Typical interview questions

<details>
<summary>What are user memory and long-term memory in an agent?</summary>

User memory covers one person's preferences, confirmed constraints and decisions, loaded every call. Long-term memory holds lessons and prior analyses from past work, often shared by a team and searched when needed.

</details>

<details>
<summary>How is agent memory different from a RAG knowledge base?</summary>

A knowledge base holds facts the business owns and curates, like policies. Memory comes from the agent's interactions, so it needs per-user scoping and a way for people to check and correct it.

</details>

<details>
<summary>Design memory for a Finance agent that remembers prior analyses, preferences and confirmed constraints.</summary>

A per-user record holds preferences and confirmed constraints, each dated, loaded every call. Prior analyses become dated, sourced notes keyed by tenant and team, searched through a tool. Analysts review and correct entries on a memory page.

</details>

<details>
<summary>The agent "forgot" a prior analysis that is in memory. How do you debug it?</summary>

In the trace, no memory search means on-demand recall failed: I sharpen the tool description or preload a summary. A missed search points to the scope key (a note under its author's user key is invisible to colleagues) or ranking. Then I add an eval case.

</details>

## Learn more

- Article: [Bringing memory to Claude](https://claude.com/blog/memory) (Anthropic, about 5 min)
- Reference: [Memory: Long-term knowledge with MemoryService](https://adk.dev/sessions/memory/) (Google ADK, about 10 min)

## Related

- [Agent State and Memory Types](./01-state-and-memory-types.md)
- [Memory Write Policies](./06-memory-write-policies.md)
- [Memory Pollution, Staleness and Privacy Risks](./07-memory-pollution-staleness-privacy.md)
- [Separating Agent Knowledge from the Profile](../13-agent-profiles/03-profile-vs-knowledge.md)
- [Embeddings and Vector Search](../../m2/09-rag-knowledge-bases/04-embeddings-and-vector-search.md)
