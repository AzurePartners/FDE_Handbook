---
title: Replayable Tests for Agent Workflows
row: M3-L6.6
---
**In one sentence:** A replayable test turns one agent run into a scenario you can rerun: the same input, starting state and recorded tool responses, checked against the expected outcome and key steps, without touching live systems.

## What it is

When an agent run fails, the instinct is to rerun it. But the run depended on more than the request: what memory held, what tools returned, which prompt and model versions were live. By tomorrow it has all moved.

A replayable test freezes it, like a flight simulator scenario rebuilt from an incident: same weather, same failed engine, but the pilot still decides.

Precisely: a runner loads the stored state, runs the agent on the stored input, answers tool calls from the recording and checks the outcome and key steps. "Minimum" means the smallest slice that still reproduces the behavior. This differs from the crash-recovery [replay](../17-persistent-agents/02-durable-execution.md) of durable runtimes.

## Why an FDE needs this

A software company's support flow has three agents: Triage labels tickets, Research checks the status page, Reply drafts answers for staff. During a two-hour outage, 40 customers got replies saying "no known incidents." By morning every rerun answered correctly, so the bug was closed as "cannot reproduce." The next outage, it recurred.

From one complaint's trace ID, the FDE built a test: Triage's handoff as input, the account and region as initial state, the status tool's recorded outage response. Every replay failed: the status tool's code ignored an `incidents` list present only during outages. After the fix, the test passed 5 of 5 live-model runs and joined the suite. (Illustrative scenario.)

## Key concepts

### The minimum replayable test

```json
{
  "source_trace": "tr_5be07a",
  "input": {"from": "triage", "ticket": "Dashboard down since 9:40?"},
  "initial_state": {"account": "ACME-204", "region": "eu-west"},
  "tool_recording": "recordings/support-031.jsonl",
  "expect": {"outcome": "draft names the open incident",
             "steps": ["get_status before draft_reply"],
             "never": ["send_reply"]},
  "versions": {"model": "<exact model ID>",
               "profiles": {"research": "2.3.0", "reply": "1.8.2"},
               "skills": {"summarize-status": "1.4.1"}}
}
```

In a multi-agent flow, start at the failing agent, with the handoff it received as input. Reload the initial state before every run, so runs stay independent.

The trace ID and `versions` are the log evidence: record the exact model ID, not an alias that can move to a newer model version, and keep a redacted copy of the key [trace steps](./02-agent-traces.md), since tracing tools delete old traces.

### Recording and replaying tool responses

Record each tool call's name, arguments and result, in order. In replay, a wrapper serves them like a [mock](../../m1/04-git-debugging-testing-security/08-unit-vs-integration-tests.md) built from reality, under three rules:

- **Unrecorded calls fail the test.** The VCR.py library's `none` mode, for example, "guarantees that no new HTTP requests will be made."
- **Writes are captured, not sent,** for the test to check.
- **Recordings are scrubbed** of customer data before commit ([Sensitive Data and PII Protection](../../m2/12-safety-guardrails-hitl/03-sensitive-data-and-pii.md)).

Editing one recorded value and replaying can confirm a [failure attribution](./03-failure-attribution.md).

### Plumbing tests and behavior tests

| | Plumbing test | Behavior test |
|---|---|---|
| Model | Recorded outputs | Live, several runs |
| Checks | Your code: routing, parsing, handoffs, state | The agent's decisions |
| Result | Identical, free, fast | A pass rate, costs tokens |
| Run on | Every commit | Prompt, skill, tool or model changes; nightly |

LangSmith's pytest plugin, for one, can cache model calls to disk for plumbing tests; re-record them when prompts change. Outputs vary ([Generation Settings](../../m2/07-llm-application-foundations/05-generation-settings.md)), so compare behavior-test pass rates with a baseline ([Regression Testing](../../m2/11-ai-evaluation/08-regression-testing.md)).

## Common misconceptions

- **"If I rerun the same request, I can reproduce the failure."** Memory, tool data and versions have moved; the rerun tests a different situation.
- **"Recorded tool responses make the test deterministic."** They freeze the world, not the model; replaying model outputs too makes runs identical but tests only your code.
- **"If the replay tests pass, the live integrations work."** Recordings freeze yesterday's APIs; a changed real response goes unnoticed. Re-record on a schedule and review the diff.
- **"When a replay test fails, re-record it."** That makes today's behavior, bug included, the expected result. Read the trace first.

## Typical interview questions

<details>
<summary>What goes into a minimum replayable agent test?</summary>

The input, or the handoff the failing agent received; the initial state; recorded tool responses; the expected outcome; a few must or must-never steps; the trace ID and versions.

</details>

<details>
<summary>How does a plumbing test differ from a behavior test?</summary>

A plumbing test also replays model outputs: free, identical every run, checking my code. A behavior test runs the live model several times against recorded tools, passing on a threshold.

</details>

<details>
<summary>A Review agent approved a banned claim. How do you turn that into a test?</summary>

Input: Draft's handoff from the trace. State: the brand rules Review loaded. Tools: recorded results. Expected: a "revise" verdict naming the claim, no publish call. It must fail before the fix, then pass five of five.

</details>

<details>
<summary>After a model upgrade, a replay test hits an unrecorded tool call. Is that a regression?</summary>

Not necessarily: the new model took an unrecorded path, so I read the trace. A harmless extra lookup means extending the recording; a write before approval is a real regression that blocks the upgrade.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic, about 30 min)
- Reference: [Usage](https://vcrpy.readthedocs.io/en/latest/usage.html) (VCR.py documentation, about 5 min)
- Reference: [Why evaluate agents](https://adk.dev/evaluate/) (Google ADK docs, about 15 min)

## Related

- [Regression Testing for Prompts, Models, Tools and Data](../../m2/11-ai-evaluation/08-regression-testing.md)
- [Unit vs. Integration Tests](../../m1/04-git-debugging-testing-security/08-unit-vs-integration-tests.md)
- [Agent Traces (Steps, Tool Calls, Handoffs, State Changes)](./02-agent-traces.md)
- [Debugging Agents with Traces and Evals](./07-debugging-agents.md)
- [Recovery Testing (Failure Injection)](../17-persistent-agents/08-recovery-testing.md)
