---
title: Agent Evaluation (Tasks, Environments, Outcomes)
row: M3-L6.1
---
**In one sentence:** Agent evaluation runs an agent on whole, realistic tasks in a test copy of its systems, grades what changed there rather than what it said, and repeats each task because runs vary.

## What it is

An agent asks questions, calls tools and changes records over many steps. Judging it by its last message is like judging a plumber by a text saying "all fixed": you check the leak stopped, nothing else flooded, and the fix holds every time.

Anthropic's agent evals guide (January 2026) defines a **task** as one test with inputs and success criteria, a **trial** as one attempt, and the **outcome** as "the final state in the environment at the end of the trial." The **environment** is a sandbox: the agent's real tools wired to test systems seeded with known data. A booking agent may say "Your flight has been booked"; the outcome is whether a reservation exists.

## Why an FDE needs this

A travel management company's agent rebooked travelers on cancelled flights within policy. Its eval compared final messages with reference replies: 46 of 50 passed. In the pilot, travelers read "You're confirmed on the 18:40" with no ticket issued; one run cancelled a traveler's return flight.

The FDE rebuilt the eval around outcomes: each task seeds a fresh booking-system sandbox, a second model plays the traveler, and code checks the end state (one ticket within policy, return leg untouched, one notification). Across five runs per task, only 31 of 50 passed every time: the honest go-live number. (Illustrative scenario.)

## Key concepts

### What a final-answer check misses

| Hidden failure | Example | Caught by |
|---|---|---|
| Claimed, not done | "You're rebooked," no ticket | End-state check |
| Right by luck | Guessed the fare cap, no policy lookup | Repeated trials, step check |
| Harmful step | Opened another traveler's booking | Step check |
| Wasted cost | Right result after 40 tool calls | [Agent metrics](./04-agent-level-metrics.md) |

### Tasks, environments and repeated trials

Each task pairs a realistic request with end-state checks from the agent's [success criteria](../13-agent-profiles/06-agent-success-criteria.md):

```python
import os

def run_task(task, k=5):
    passes = 0
    for _ in range(k):
        env = Sandbox(seed=task["seed"])   # fresh copy of test data
        run_agent(env, task["request"], model=os.environ["LLM_MODEL"])
        state = env.snapshot()             # end state, not the reply
        passes += all(check(state) for check in task["checks"])
    return {"passed": passes, "pass@k": passes > 0, "pass^k": passes == k}
```

Each trial should start "from a clean environment": Anthropic saw Claude gain an unfair advantage from earlier trials' git history. A reference solution that passes every check proves the task is solvable.

`pass@k` (any of k trials passes) suits drafts a person picks from; `pass^k` (all k pass) suits customer-facing agents ([the math](../../m2/07-llm-application-foundations/07-chat-vs-system-reliability.md)). Sierra's customer-service benchmark τ-bench (2024) introduced `pass^k`; on its airline tasks, the top listed agent scored 46% at `pass^1` but 22.5% at `pass^4`.

### Simulated users for multi-turn tasks

Agents ask clarifying questions, so fixed scripts break. Conversational evals "often require a second LLM to simulate the user" (Anthropic), given a hidden goal and persona. τ-bench does this for retail and airline support, comparing "the database state at the end of a conversation" with a goal state. Google's ADK builds users from a `ConversationScenario` (starting prompt, plan, persona). Simulators err too; read transcripts (full run records) before blaming the agent.

### Outcomes first, then step checks

Anthropic calls checking for an exact tool sequence "too rigid": "grade what the agent produced, not the path it took." Graders can also reject better answers: Claude Opus 4.5 "failed" a τ2-bench flight task by finding a policy loophole that served the user better. Add step checks only where the end state is blind: must-never actions, approval before a write ([trajectory evaluation](./05-trajectory-evaluation.md)).

## Common misconceptions

- **"If the final answer is right, the agent worked."** It may have claimed an action it never took, got lucky or done harm.
- **"It passed once, so it can do the task."** One trial is a sample, and customers need every run to work.
- **"A task that always fails proves the agent is weak."** Anthropic calls 0% across 100 trials "most often a signal of a broken task."

## Typical interview questions

<details>
<summary>What is a task-based agent eval?</summary>

A realistic task run in a sandbox with the agent's tools and seeded data, graded on the end state (records changed, files produced) rather than the reply, over several trials.

</details>

<details>
<summary>What is the difference between pass@k and pass^k?</summary>

`pass@k` means at least one of k trials succeeded; `pass^k` means all did. Customer-facing agents need `pass^k`, since each customer gets one try.

</details>

<details>
<summary>How would you evaluate an agent that updates CRM records from call notes?</summary>

Twenty to fifty tasks from real notes, each with a seeded sandbox CRM and a reference solution. Code checks the right fields changed and nothing else, over five trials.

</details>

<details>
<summary>One task fails all 20 trials while similar tasks pass. What do you check?</summary>

The task first: does the spec state everything the grader checks, and does the reference solution pass? Then transcripts, to see who erred: agent or grader.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, about 30 min)
- Reference: [User Simulation](https://adk.dev/evaluate/user-sim/) (Google ADK docs, about 10 min)
- Paper: [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) (Yao et al., ICLR 2025, about 40 min)

## Related

- [AI Evaluation (Evals)](../../m2/11-ai-evaluation/01-ai-evaluation.md)
- [Trajectory Evaluation](./05-trajectory-evaluation.md)
- [Agent-Level Metrics (Task Completion, Handoffs, Tool Use, Loops, Cost, Latency)](./04-agent-level-metrics.md)
- [Agent Success Criteria and Definition of Done](../13-agent-profiles/06-agent-success-criteria.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../../m2/11-ai-evaluation/02-evaluation-sets.md)
