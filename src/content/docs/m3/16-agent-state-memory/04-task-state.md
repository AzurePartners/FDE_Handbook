---
title: Task State (Plans, Progress, Artifacts)
row: M3-L4.4
---
**In one sentence:** Task state is the stored record of where one job stands (goal, plan, finished and pending steps, outputs, open decisions and budget used), kept outside the model and updated by code so work can resume after a pause or failure.

## What it is

A job like "extract key terms from 120 leases, then write a memo" takes hundreds of model calls, yet the model remembers nothing between them, so the job needs a record of where it stands.

Think of parcel tracking: depot scans, not the driver's memory, update the record, so another van can continue from the last scan.

Precisely, task state is a structured record keyed by a task ID: goal and [definition of done](../13-agent-profiles/06-agent-success-criteria.md), steps with statuses, artifact references, decisions, open questions and budget used. Code writes it after each step; each model call sees a view of it.

## Why an FDE needs this

A property investor's agent turned leases into abstracts (key-term summaries), tracking progress in its own messages. It reported all 120 leases done, but nine unreadable scans had no abstract, so the memo's rent totals were wrong. After a two-day wait for an answer, its session had expired, so the new run restarted at lease 1. Two concurrent deals shared one `progress.md`, mixing their counts.

The FDE gave each deal a task record and folder keyed by task ID, with a status and abstract path per lease. Code marks a lease done only when its abstract passes the schema check, and runs resume at the first pending lease. The corrected memo covered 111 abstracts and flagged 9 scans. (Illustrative scenario.)

## Key concepts

### What the record holds

```json
{
  "task_id": "deal-311",
  "goal": "Abstract every lease; memo totals match abstracts",
  "status": "waiting_for_input",
  "steps": [
    {"id": "lease-001", "status": "done", "artifact": "deal-311/lease-001.json"},
    {"id": "lease-047", "status": "failed", "error": "scan unreadable"},
    {"id": "lease-048", "status": "pending"}
  ],
  "decisions": [{"text": "Use 2024 amendment rent", "by": "client counsel", "on": "2026-09-14"}],
  "open_questions": [{"text": "Is the side letter in force?", "owner": "deal team"}],
  "budget_used": {"input_tokens": 1840000}
}
```

Store where artifacts are, not their contents, which live in the task's [workspace](./08-persistence-patterns.md). Date decisions so resumed runs do not reopen them, give open questions owners, and keep budget used so restarts cannot reset [limits](../17-persistent-agents/04-bounded-execution.md).

### Data written by code, not chat text

A chat line like "about 85 done" cannot be checked, and summaries rewrite it. Anthropic's long-running coding agents were told to edit their JSON feature list only by flipping `passes` fields, and JSON was chosen because "the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files." Better, code checks the evidence:

```python
def record_step(task_id, step_id, path):
    task = tasks.get(task_id)              # this task only
    step = task.step(step_id)
    problems = validate_abstract(path)     # exists, schema, key terms
    step.status = "failed" if problems else "done"
    step.artifact, step.problems = path, problems
    tasks.save(task)                       # before the next step
```

Use one update path: Google's ADK warns that state edits outside its event path will likely not be saved.

### Resuming from the record

Every start (new worker, reply after a pause, crash restart) runs one routine: load the record by task ID, [rebuild context](./02-context-vs-durable-persistence.md) from it, check whether an `in_progress` step already produced its artifact, then continue at the first pending step. Rerunning a step with side effects needs [deduplication](../17-persistent-agents/05-duplicate-execution.md).

### One record per task

Key everything by task ID: record, artifact folder, file names, trace tags. A shared "current task" variable or progress file mixes parallel jobs. LangGraph keys checkpoints by the `thread_id` you pass, so give each task its own. Two runs on one task at once need [locks or version checks](../17-persistent-agents/06-concurrency-and-stale-state.md).

## Common misconceptions

- **"The agent knows how far it got; it's all in the conversation."** A transcript records what the model said, not what happened, and summaries or new sessions lose it.
- **"The model's plan is the task state."** A plan in a reply lives in one context window. Store steps with statuses that code updates on evidence.
- **"Our framework checkpoints, so task state is handled."** It saves whatever state you defined; if that is only messages, you restore a transcript, not a plan.

## Typical interview questions

<details>
<summary>What is task state?</summary>

The record of one job's progress, keyed by task ID: done criteria, steps with statuses, artifact references, dated decisions, open questions with owners and budget used, updated by code after each step.

</details>

<details>
<summary>How does task state differ from a runtime checkpoint?</summary>

A checkpoint is the runtime's snapshot for resuming execution. Task state is the business record you design, readable by people and new workers; checkpointing only messages saves a transcript, not a plan.

</details>

<details>
<summary>Design task state for a Content Creation agent whose drafts wait days for an editor.</summary>

Per article: brief and done criteria, five steps (research, outline, draft, review, revise) with statuses, links to sources and drafts, dated editor decisions and a revision count. A `waiting_for_review` status pauses it; the editor's reply resumes it at revise.

</details>

<details>
<summary>An agent reports "all 40 filings processed," but six outputs are missing. What do you change?</summary>

"Done" came from the model, not evidence. Code should mark steps done only when outputs exist and pass checks, then reconcile steps with artifacts before reporting; an unreadable filing becomes a test.

</details>

## Learn more

- Article: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (Anthropic, about 10 min)
- Reference: [State: The Session's Scratchpad](https://adk.dev/sessions/state/) (Google ADK, about 15 min)

## Related

- [Agent State and Memory Types](./01-state-and-memory-types.md)
- [Persistence Patterns (Workspace, Landing Pad, Journal)](./08-persistence-patterns.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](../17-persistent-agents/02-durable-execution.md)
- [Conversation Threads and Sessions](./03-conversation-state.md)
- [Concurrency and Stale State in Agent Systems](../17-persistent-agents/06-concurrency-and-stale-state.md)
