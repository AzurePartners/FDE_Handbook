---
title: Conversation Threads and Sessions
row: M3-L4.3
---
**In one sentence:** A conversation thread, often called a session, is the stored, ordered record of one conversation, with its own ID and owner, that your app loads and extends every turn so the chat can resume later.

## What it is

The model keeps nothing between calls, so a chat that "remembers" is an app reloading a stored record ([Message Roles](../../m2/07-llm-application-foundations/04-message-roles.md)). That record is a thread; Google's ADK calls a `Session` "a single conversation thread between a user and your agent."

Think of a support ticket: a number, a customer and every message in order, ready for the next shift.

Precisely, a thread has an ID, an owner (a user within a tenant: the client organization), ordered items and metadata like last-active time. LangGraph says thread; the agent SDKs from Google, OpenAI, Anthropic and Microsoft say session.

## Why an FDE needs this

A wealth manager's research assistant kept history only as an OpenAI `previous_response_id` chain, its latest ID in the browser and shared links. Advisors lost older chats when stored responses expired, compliance wanted transcripts the firm never held, and one advisor opened a colleague's client discussion from a pasted link: the backend fetched any ID it was given.

The FDE moved history into the firm's Postgres: a `threads` row per chat (owner, tenant, last active) and a `thread_items` row per message, tool call, result or summary. Every load filters by the signed-in advisor, and compliance reads the firm's tables. (Illustrative scenario.)

## Key concepts

### What a thread keeps

Every item, numbered in order: user and assistant messages, each tool call with its result (the API rejects an unanswered call; see [The Tool-Call Loop](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)), and summaries noting which items they replace. It leaves out per-call extras like retrieved passages, plus [task progress](./04-task-state.md) and [user memory](./05-long-term-and-user-memory.md), which have their own stores.

### Who stores the history

| Option | Stored in | You send | Watch for |
|---|---|---|---|
| App-managed | Your database | A view you build | You own schema, trimming, retention |
| Framework session | Store you choose (ADK `DatabaseSessionService`, LangGraph checkpointer) | Session ID | In-memory or local stores stay on one host |
| Provider conversation | OpenAI Conversations API; Claude Managed Agents sessions (beta) | Its ID, new input | Deleting an OpenAI conversation keeps its items |
| Response chain | OpenAI `previous_response_id`; Gemini `previous_interaction_id` | Last ID, new input | Responses expire: OpenAI 30 days; Gemini 55 days paid, 1 day free |

Providers check your API key, not your users; owner checks stay yours. Keep one source of truth: OpenAI's Agents SDK will not layer its session on server-side continuation.

### Trimming without losing the record

The record keeps every item for scrollback and audits; the view you send is the latest summary plus recent turns ([Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md) covers what to keep). Keep Anthropic's `compaction` summary block exactly as returned, `signature` included. Some tools overwrite the record: OpenAI's `OpenAIResponsesCompactionSession` "clears and rewrites the session history." Retention is a [separate question](./07-memory-pollution-staleness-privacy.md).

### Resuming the right user's thread

Load by thread ID and signed-in user ([Per-User Access and Action Gates](../../m2/12-safety-guardrails-hitl/05-action-gates.md)); OpenAI's Agents SDK docs warn that a session ID "does not authenticate a user." Recheck the owner on what came back; in March 2023 a Redis client bug showed some ChatGPT users another user's chat titles. Then give any tool call a crash left unanswered an "interrupted" result.

```python
def resume(thread_id, user, text):
    thread = threads.get(thread_id, owner=user.id, tenant=user.tenant)
    if thread is None or (thread.owner, thread.tenant) != (user.id, user.tenant):
        raise NotFound()
    fixes = interrupted_results(thread.items)
    turn = {"role": "user", "content": fixes + [{"type": "text", "text": text}]}
    reply = client.messages.create(
        model=os.environ["LLM_MODEL"], max_tokens=1024, system=SYSTEM_PROMPT,
        messages=summary_and_recent(thread.items) + [turn])   # the view
    thread.append(turn, reply.content)            # the record
    return reply
```

## Common misconceptions

- **"We can keep the chat in the user's web session."** A web session belongs to one login and browser and expires; a thread needs its own ID and durable storage.
- **"If the provider stores the conversation, we are covered."** Stored responses can expire, the provider cannot tell your users apart, and audits need an export.
- **"Summarizing old turns means deleting them."** A summary changes what the model sees; the stored record can stay complete.

## Typical interview questions

<details>
<summary>What is a conversation thread, and what does it store?</summary>

The stored record of one conversation: ID, owner, ordered items (messages, tool calls with results, summaries) and metadata. The app reloads it every turn, since the model keeps nothing.

</details>

<details>
<summary>How does app-managed history differ from provider-stored conversation state?</summary>

App-managed: I store items and build each view, controlling retention and access. Provider-stored: I send an ID and the provider prepends history; less code, but its retention rules apply, and owner checks stay mine.

</details>

<details>
<summary>How would you store threads for 300 analysts in two subsidiaries?</summary>

A `threads` table (ID, owner, tenant, title, last active) indexed by owner, and `thread_items` (thread ID, sequence, type, call ID, content). Every query filters by owner and tenant; each subsidiary sets retention.

</details>

<details>
<summary>After a deploy, reopened chats fail with a 400 error. What do you check?</summary>

The thread's tail: a worker killed mid-tool left a call without a result, which the API rejects. I add "interrupted" results on load and save each call with its result atomically.

</details>

## Learn more

- Reference: [Session: Tracking individual conversations](https://adk.dev/sessions/session/) (Google ADK, about 10 min)
- Reference: [Work with sessions](https://code.claude.com/docs/en/agent-sdk/sessions) (Claude Agent SDK, about 12 min)

## Related

- [Message Roles, System Prompts and Conversation History](../../m2/07-llm-application-foundations/04-message-roles.md)
- [Agent State and Memory Types](./01-state-and-memory-types.md)
- [Task State (Plans, Progress, Artifacts)](./04-task-state.md)
- [Context Engineering](../../m2/08-prompting-context-structured-output/04-context-engineering.md)
- [SQL Basics: SELECT, INSERT, JOIN](../../m1/03-apis-data-integration/11-sql-basics.md)
