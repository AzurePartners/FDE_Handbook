---
title: Bounded Execution (Budgets, Step Limits, Trigger Control)
row: M3-L5.4
---
**In one sentence:** Bounded execution means code caps what any agent task can consume (steps, tokens, dollars and time), stops tasks that loop or stall, and decides which events may start a model call.

## What it is

A persistent agent runs unattended, started by events such as emails. Every step is a paid model call, and a confused agent retries until something outside it says stop.

Think of a contractor on a not-to-exceed quote: at the cap, work stops and you hear what is done and what remains.

Precisely, it is control in code, not the prompt, at three levels: per-task limits and loop detectors checked between steps; trigger control over which events start runs; and quotas, a kill switch and alerts across all tasks. A [tool loop's](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md) round cap is the innermost layer.

## Why an FDE needs this

A freight broker's agent answered carrier emails, one run per email, limited only by a per-run turn cap. One holiday weekend, a carrier's helpdesk acknowledged each agent email with a new ticket, and the agent replied to every acknowledgement: 900 emails, each run within its cap. The weekend cost a month's normal spend, unnoticed.

The FDE put filters before the model, skipping the agent's own mail, bots and messages whose `Auto-Submitted` header (RFC 3834's marker for machine-sent mail) is not `no`, gave each thread a budget across runs and a no-progress check, and added an hourly spend alert. (Illustrative scenario.)

## Key concepts

### Per-task limits and stopping

Cap steps (model calls), tokens (subagents included), cost (including paid tools) and wall-clock time while running; a paused task's wait has its own [deadline](./07-durable-human-approval.md). Framework caps cover a run or session: Google ADK's `max_llm_calls` counts per run (default 500), while the Claude Agent SDK's `max_turns` and `max_budget_usd` default to no limit and its turn count restarts with each message. Retries and new messages can restart such counts, so keep usage in the [task record](../16-agent-state-memory/04-task-state.md).

Check before each step, never mid-tool-call. At a limit, save the task as `stopped_at_limit`, send partial work and the reason to a person or review queue ([escalation](../13-agent-profiles/05-agent-inputs-outputs-escalation.md)), and mark it final so the queue never retries it. Warn first so the agent can wrap up (LangGraph's `RemainingSteps` lets a graph route to a fallback; Anthropic's beta task budgets show the model a countdown, "a soft hint, not a hard cap"), but stop hard in code.

### Loops and stalls

Two detectors fire before any limit. **Repetition:** the same tool and arguments, or the same error. Google's Gemini CLI flags five identical calls in a row; 12-Factor Agents suggests about three tries at a failing tool, then escalation. **No progress:** calls differ but the task record gains nothing, like Anthropic's early research agents "scouring the web endlessly for nonexistent sources."

```python
LIMITS = {"steps": 40, "tokens": 500_000, "usd": 4.0, "seconds": 1800}

def stop_reason(task):
    for name, cap in LIMITS.items():
        if task.usage[name] >= cap:
            return f"{name} limit"
    last = task.call_hashes[-3:]        # hash(tool, args)
    if len(last) == 3 and len(set(last)) == 1:
        return "repeated call"
    if task.steps_since_progress >= 5:
        return "no progress"
    return None
```

### Trigger control

Event wiring often starts a run per event (ADK's Pub/Sub trigger creates a session per message), so put cheap code first: **filter** out the agent's own messages, bots, auto-replies and duplicates; **debounce**, waiting until a conversation is quiet for a minute, then running once on everything new; **batch** low-urgency events into scheduled runs; and allow **one active run per conversation**, which new messages join ([enforcing that](./06-concurrency-and-stale-state.md)).

### Quotas, kill switch and alerts

A per-tenant quota caps each customer account's daily tokens or dollars ([endpoint quotas](../../m2/07-llm-application-foundations/09-adding-an-llm-endpoint.md)). A kill switch is a flag workers check before every step; flipped, tasks pause with state saved. Alert when a tenant nears its quota and when limit stops or hourly spend jump (dashboards are Module 4).

## Common misconceptions

- **"`max_tokens` caps what a task costs."** It caps one call; a task can make hundreds.
- **"Telling the agent 'use at most ten searches' is a limit."** The model can ignore or miscount it; a limit is code refusing the next step.
- **"Many calls to one tool mean a loop."** A batch calls one tool with many arguments; flag identical calls or no progress.

## Typical interview questions

<details>
<summary>What is bounded execution?</summary>

Code-enforced caps on each task's steps, tokens, dollars and time, plus loop and stall detection, trigger control, per-tenant quotas, a kill switch and alerts.

</details>

<details>
<summary>How does a per-task budget differ from a tool loop's round cap?</summary>

The round cap bounds one loop in one run. A per-task budget spans every run, retry and resume, so its counters live in the task record.

</details>

<details>
<summary>How would you control triggers for an agent in a busy Slack channel?</summary>

In code: drop bot posts, its own posts and emoji-only replies; debounce each thread for a minute; allow one active run per thread; set a daily token quota.

</details>

<details>
<summary>A task cost $400 overnight without hitting its 30-step limit. Why?</summary>

Retries or new messages likely restarted the count, or steps carried huge contexts. I would check per-run traces, keep counters in the task record and add token and dollar caps.

</details>

## Learn more

- Article: [Compact Errors into Context Window](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-09-compact-errors.md) (HumanLayer, 12-Factor Agents, about 3 min)
- Reference: [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop) (Claude Agent SDK documentation, about 20 min)

## Related

- [The Tool-Call Loop and Tool Traces](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [Agent Task Queues and Workers](./03-agent-task-queues-and-workers.md)
- [Rate Limits](../../m1/03-apis-data-integration/04-rate-limits.md)
- [Agent-Level Metrics (Task Completion, Handoffs, Tool Use, Loops, Cost, Latency)](../18-agent-evaluation-debugging/04-agent-level-metrics.md)
- [Adding an LLM Endpoint to an Existing Service](../../m2/07-llm-application-foundations/09-adding-an-llm-endpoint.md)
