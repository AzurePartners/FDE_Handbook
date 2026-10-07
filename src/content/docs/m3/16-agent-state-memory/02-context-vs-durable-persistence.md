---
title: Context vs Durable Persistence
row: M3-L4.2
---
**In one sentence:** Context is what the model sees in one call, rebuilt by your app each time; durable persistence is storage outside the process that still holds the task after a crash, redeploy or new session.

## What it is

The model keeps nothing between calls; each call sees only the context your app assembles ([Message Roles, System Prompts and Conversation History](../../m2/07-llm-application-foundations/04-message-roles.md)). Between calls, that text usually lives in one process's memory, which a crash or redeploy erases and a session on another server never sees.

Think of a video game: a power cut wipes unsaved play, but the save file survives, and a cloud save loads on any console.

Precisely: context is a temporary view for one call. Durable persistence writes state at defined points, such as after every step, to storage that outlives the process (a database, object storage or a persistent volume); code rebuilds each call's context from it.

## Why an FDE needs this

A media client's Content Operations agent (Research, Plan, Draft, Review) ran each weekly brief as one long conversation inside a worker process. When briefs outgrew the window, the team moved to a 1-million-token model, switched on compaction and called memory solved. Then a compaction summary dropped the editor's rule excluding vendor press releases, and a brief cited them. A routine deploy later restarted the worker mid-draft, and the agent began again at Research.

The FDE kept compaction but moved the plan, sources, finished sections and confirmed decisions into a Postgres task record saved after every step, and built each call's context from it. When she killed a worker mid-draft, a fresh one on another machine resumed at the next section.

## Key concepts

### A bigger window is not a memory

A long history costs more, since every call resends it, and lowers quality: Anthropic's compaction docs say "response quality degrades as a conversation grows" ([Context Pollution and Context Rot](../../m2/08-prompting-context-structured-output/05-context-pollution.md)). Fitting the window is not storing:

| Technique | What it does | Survives a restart? |
|---|---|---|
| Bigger context window | Fits more into one call | No: a window stores nothing |
| Compaction | Summarizes older turns | Only if you store the summary |
| Context editing | Clears old tool results | No: it trims only the request |
| Database record or memory files | Keeps state outside the process | Yes, for any worker |

Anthropic's docs call compaction a less ideal fit for tasks that "need to maintain exact state across many variables," and its long-running agent harness added a progress file plus git history because "compaction isn't sufficient."

### Externalize, then rebuild

Save after every step; rebuild context before every call:

```python
def run_task(task_id):
    task = store.load(task_id)          # durable record
    while task.next_step:
        messages = build_context(task)  # fresh for each call
        reply = client.messages.create(model=os.environ["LLM_MODEL"],
                                       max_tokens=4096, messages=messages)
        if reply.stop_reason != "end_turn":  # cut off or refused
            raise StepIncomplete(reply.stop_reason)
        text = "".join(b.text for b in reply.content if b.type == "text")
        task.complete(task.next_step, text)
        store.save(task)                # before the next step
```

A crash after `store.save` loses nothing; one before it repeats a step, so steps with side effects need [deduplication](../17-persistent-agents/05-duplicate-execution.md). What the record holds is [task state](./04-task-state.md). Anthropic's memory tool tells the model: "ASSUME INTERRUPTION: Your context window might be reset at any moment."

### The new-machine test

If this worker died now, could a fresh one on another machine, given only the task ID, continue from storage? It must find the plan, finished steps and their outputs, confirmed decisions and anything in flight, like a pending approval. Any answer "in the conversation" fails; [Recovery Testing (Failure Injection)](../17-persistent-agents/08-recovery-testing.md) runs it for real.

## Common misconceptions

- **"Our model has a 1 million token window, so the agent remembers everything."** The window holds one call and keeps nothing after a crash or new session.
- **"The agent framework takes care of persistence."** Only a durable backend does: Google ADK's in-memory session service loses "all conversation data" on restart, and OpenAI's `SQLiteSession` without a file path is "lost when process ends."
- **"We save every message, so the task can resume."** That keeps the transcript, not where the task stands; resuming means reloading a history that may not fit and guessing progress.

## Typical interview questions

<details>
<summary>What is the difference between an agent's context and its persisted state?</summary>

Context is what one model call sees, built by the app and gone with the process. Persisted state is saved to storage after each step, and each call's context is rebuilt from it.

</details>

<details>
<summary>How do compaction and context editing differ from durable persistence?</summary>

Both shrink what the model sees: compaction summarizes older turns, context editing clears stale tool results. Neither stores anything; only progress written to storage survives a crash.

</details>

<details>
<summary>A client says a 1M-token model means their agent needs no database. How do you respond?</summary>

A window holds one call: a redeploy or new session starts empty, and long contexts cost more and degrade. I would store progress and decisions in their database and demo a killed worker resuming.

</details>

<details>
<summary>After a deploy, an agent restarted a half-done report and dropped a confirmed constraint. How do you debug it?</summary>

I check where progress and the constraint lived: process memory does not survive a deploy, and a compacted chat can drop a constraint. I move both into a task record saved after each step and add a kill-and-resume test.

</details>

## Learn more

- Article: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (Anthropic, about 10 min)
- Reference: [Sessions](https://openai.github.io/openai-agents-python/sessions/) (OpenAI Agents SDK, about 15 min)

## Related

- [Agent State and Memory Types](./01-state-and-memory-types.md)
- [Context Pollution and Context Rot](../../m2/08-prompting-context-structured-output/05-context-pollution.md)
- [Volumes and Persistence](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](../17-persistent-agents/02-durable-execution.md)
- [Tokens and Context Windows](../../m2/07-llm-application-foundations/02-tokens-and-context-windows.md)
