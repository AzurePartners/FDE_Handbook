---
title: Persistence Patterns (Workspace, Landing Pad, Journal)
row: M3-L4.8
---
**In one sentence:** Three storage patterns let agent work survive restarts: a workspace for one task's working files, a landing pad where finished outputs wait for the next step or a person, and a journal recording each step and decision.

## What it is

A long agent task produces working files, finished results for others, and a history of what it did; inside one process, all three vanish on a restart.

Think of a lab: a messy bench, an outbox tray for finished samples, and a notebook nobody erases, so a colleague can take over.

Precisely: a **workspace** is durable storage for one task's working files. A **landing pad** is an agreed place where checked outputs land with a manifest, a small file marking them complete. A **journal** is an append-only log (entries added, never edited) of steps, decisions and landings. These are this handbook's names; engineers say scratch directory, output folder or artifact store, and event or audit log.

## Why an FDE needs this

A bank's know-your-customer (KYC) agent checks each business client and writes a risk summary for a compliance analyst. Summaries went straight into the analysts' folder, and one was signed off mid-write, missing its ownership section. After a crash mid-batch, nothing showed what was finished, so a rerun produced second, different summaries. And an audit found months of passport scans in a scratch bucket nobody owned.

The FDE gave each review an expiring workspace, a landing pad whose manifest is written last, and a journal of steps, sources and decisions. After a test crash, the batch resumes where it stopped, and auditors can trace each rating. (Illustrative scenario.)

## Key concepts

### The three side by side

| | Workspace | Landing pad | Journal |
|---|---|---|---|
| Read by | This task, even after a restart | Next step, agent or person | Recovery code, auditors |
| Kept until | Task closes, plus a grace period | Picked up, then archived | Audit retention ends |

### How they work together

Order matters, because a crash can strike between any two lines:

```python
def land(task_id, src, pad):                  # pad: landing/analysts/K-2291/
    manifest = pad / "manifest.json"
    if not manifest.exists():                 # not landed yet
        shutil.copyfile(src, pad / src.name)  # 1. output
        tmp = pad / "manifest.tmp"
        tmp.write_text(json.dumps({"task": task_id, "file": src.name}))
        os.replace(tmp, manifest)             # 2. manifest last, atomically
    journal.append(task_id, {"type": "landed", "path": str(pad)})  # 3. journal
```

Readers act only on `manifest.json`, as in Microsoft's Claim Check pattern: publish a reference only after the write succeeds. The [task record](./04-task-state.md) says where the job stands; the journal is the history behind it. Durable execution engines keep a similar step history (Restate calls it a journal; see [Durable Execution](../17-persistent-agents/02-durable-execution.md)).

### Naming and cleanup rules

- **Scope and version.** Put the flow and task ID in every path (`work/kyc/K-2291/`) and version files (`summary-v2.md`). Reject model-chosen paths that resolve outside the workspace, as Anthropic's docs require for its memory tool.
- **Correct, never edit.** Fix a wrong journal entry by appending a correction, as event sourcing does.
- **Give every store an owner and an expiry.** Google ADK's docs note persisted artifacts "remain until explicitly deleted." Never delete what a paused task or [handoff](../15-agent-architectures/07-handoffs-and-agent-contracts.md) references, and log record IDs, not personal data, in the journal: Microsoft notes append-only stores conflict with the right to be forgotten.

### Recover, do not start over

Starting over after a restart pays again for finished steps, yields different text than people already read, repeats side effects and loses decisions: "restarts are expensive and frustrating for users," as Anthropic wrote about its multi-agent research system. Redo only the step in flight, and make side effects [safe to repeat](../17-persistent-agents/05-duplicate-execution.md).

## Common misconceptions

- **"If a task fails, just rerun it."** Only for short, cheap tasks that change nothing outside; otherwise resume from the journal at the step in flight.
- **"A file in the output folder is finished."** Files appear while still being written. Readers wait for the manifest, written last.
- **"Working files are scratch, so the container's disk will do."** A restart [wipes that disk](../../m1/05-containers-deployment/02-volumes-and-persistence.md), and the task starts over.

## Typical interview questions

<details>
<summary>What are the workspace, landing pad and journal patterns?</summary>

Per task: a durable workspace for working files, a landing pad where checked outputs await the next step or a person, and an append-only journal of steps and decisions, for recovery and audit.

</details>

<details>
<summary>How is a task journal different from a trace?</summary>

A [trace](../18-agent-evaluation-debugging/02-agent-traces.md) helps people debug and may be sampled or redacted. The journal belongs to the task: complete, append-only, kept for audit and read by code on restart.

</details>

<details>
<summary>Design persistence for a Content Creation flow: research, outline, draft, review, revise.</summary>

Each article gets a workspace for sources, outline and drafts. Draft lands checked drafts with a manifest; Review starts only from manifests. Every step, editor decision and landing is journaled, so restarts resume where they stopped.

</details>

<details>
<summary>After a restart, the Review agent reviewed a half-written draft. What went wrong?</summary>

Draft wrote into the folder Review watched, and Review treated a file's presence as completion. I would draft in the workspace, land only checked files with the manifest written last, and let Review act only on manifests.

</details>

## Learn more

- Article: [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) (Anthropic, about 10 min)
- Reference: [Claim Check pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/claim-check) (Microsoft Azure Architecture Center, about 10 min)
- Reference: [Artifacts](https://adk.dev/artifacts/) (Google ADK, about 15 min)

## Related

- [Task State (Plans, Progress, Artifacts)](./04-task-state.md)
- [Durable Execution (Checkpoints, Replay, Recovery)](../17-persistent-agents/02-durable-execution.md)
- [Context vs Durable Persistence](./02-context-vs-durable-persistence.md)
- [Volumes and Persistence](../../m1/05-containers-deployment/02-volumes-and-persistence.md)
- [Agent Traces (Steps, Tool Calls, Handoffs, State Changes)](../18-agent-evaluation-debugging/02-agent-traces.md)
