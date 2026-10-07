---
title: Agent State and Memory Types
row: M3-L4.1
---
**In one sentence:** An agent works from five kinds of information (this call's context, the conversation, the task's progress, facts about the user and knowledge kept across tasks), each with its own lifetime, owner and store.

## What it is

Ask what an agent "remembers" and you hear five things mixed together. The model keeps nothing between calls ([Message Roles](../../m2/07-llm-application-foundations/04-message-roles.md)), so memory means stores your code loads into each call and writes back.

Picture an analyst's desk: papers open now (short-term context), the client email thread (conversation state), this week's checklist (task state), a card reading "euros, no tobacco" (user memory) and the firm's archive (long-term memory). Clearing the desk nightly loses nothing; the rest is filed.

Precisely, the kinds differ in lifetime, owner (the component that writes it and answers for errors) and store (where it lives, under which key).

## Why an FDE needs this

An asset manager's research agent had one vague idea of "memory." In one week, a new chat ignored an analyst's confirmed "no tobacco" rule, which lived only in her old thread; a colleague redid last quarter's bank analysis, which sat in another analyst's chat; and one person's "figures in EUR" reached everyone's reports through a shared notes file.

The FDE sorted every item into the five kinds, gave each an owner, store and key (thread, task, user, team), and had code load only what each call needed. No fix touched the prompt. (Illustrative scenario.)

## Key concepts

### The five kinds at a glance

| Kind | Lives for | Owner (writes it) | Store (key) | Finance agent example |
|---|---|---|---|---|
| Short-term context | One call | Context builder | None (rebuilt) | Question, two filing excerpts |
| Conversation state | One thread | Chat service | Messages (thread ID) | Today's chat about Bank X |
| Task state | One job | Orchestrator, per step | Task record (task ID) | "Screen 40 banks: 23 done" |
| User memory | Until changed | Memory service, on confirmation | Profile (user ID) | "EUR only; no tobacco (confirmed March 2)" |
| Long-term memory | Months, reviewed | Memory service or curator | Searchable notes (team ID) | Q2 bank analysis, reused in Q3 |

### The model sees only what the app loads

Nothing reaches the model unless code loads it, each store by its own key:

```python
def run_step(user, thread_id, task_id, question):
    prefs = profiles.get(user.id)                        # user memory
    notes = team_notes.search(question, team=user.team)  # long-term memory
    task = tasks.get(task_id)                            # task state
    history = threads.get(thread_id)                     # conversation state
    turn = f"Preferences: {prefs}\nNotes: {notes}\nTask: {task}\n\n{question}"
    reply = client.messages.create(                      # short-term context:
        model=os.environ["LLM_MODEL"], max_tokens=1024,  # this call only
        system=PROFILE, messages=history + [{"role": "user", "content": turn}])
    threads.append(thread_id, question, reply.content)   # the turn, not the extras
    return reply
```

Writes are code's job too: with Anthropic's memory tool, "Claude requests file operations, and your application executes them." What to allow is a [write policy](./06-memory-write-policies.md) question.

### Same lines, different names

Frameworks rename these. Google's ADK scopes state keys by prefix: `temp:` lasts one invocation, no prefix one session, `user:` all of a user's sessions, `app:` all users. LangGraph's "short-term memory" is checkpointed per-thread state: conversation and task state in this page's terms, not short-term context. LangChain's docs, citing the CoALA paper, split long-term memory into semantic (facts), episodic (experiences) and procedural (instructions).

## Common misconceptions

- **"Memory is one feature you switch on."** It is five stores with different lifetimes and owners; one shared bucket leaks across users and tasks.
- **"The chat history is the agent's memory."** It is one thread's conversation state. A new thread starts empty, and progress buried in chat text is hard to resume.
- **"The agent decides what it remembers."** The model can propose a write; code executes it, picks the store and decides what is loaded next time.
- **"Long-term memory is just our knowledge base."** Both can be searchable, but the business curates the knowledge base; memory comes from the agent's own work and needs its own review.

## Typical interview questions

<details>
<summary>What kinds of state and memory does an agent carry?</summary>

Short-term context (this call), conversation state (the thread), task state (one job's progress), user memory (one person's facts and preferences) and long-term memory (knowledge reused across tasks). They differ in lifetime, owner and store.

</details>

<details>
<summary>How is conversation state different from task state?</summary>

Conversation state is one thread's ordered turns, keyed by thread ID. Task state is structured progress on one job, keyed by task ID and updated by code after each step. One chat can start several tasks, and a task can outlive its chat.

</details>

<details>
<summary>How would you design state and memory for a content agent serving several editors?</summary>

Each editor's chat is a thread. Each article is a task record: brief, outline, draft location, review status. Tone rules an editor confirms are user memory; past research notes and review lessons are team long-term memory, dated and sourced.

</details>

<details>
<summary>A sponsor wants the agent to "remember everything we ever discussed." How do you respond?</summary>

I ask which kinds they need: usually confirmed preferences and prior analyses, not every message. Keeping everything costs tokens, resurfaces stale facts and adds privacy duties, so I propose named stores with owners that users can inspect and correct.

</details>

## Learn more

- Reference: [Conversational Context: Session, State, and Memory](https://adk.dev/sessions/) (Google ADK, about 5 min)
- Reference: [Memory overview](https://docs.langchain.com/oss/python/concepts/memory) (LangChain, about 12 min)

## Related

- [Message Roles, System Prompts and Conversation History](../../m2/07-llm-application-foundations/04-message-roles.md)
- [Context vs Durable Persistence](./02-context-vs-durable-persistence.md)
- [Conversation Threads and Sessions](./03-conversation-state.md)
- [Task State (Plans, Progress, Artifacts)](./04-task-state.md)
- [Long-Term and User Memory](./05-long-term-and-user-memory.md)
