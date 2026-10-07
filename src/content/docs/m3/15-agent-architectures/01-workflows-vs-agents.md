---
title: Workflows vs Agents
row: M3-L3.1
---
**In one sentence:** In a workflow, code fixes which steps run and in what order, and a model fills in individual steps; in an agent, the model decides the next step itself, including which tool to use and when it is done.

## What it is

In a **workflow**, your code decides what happens next: the steps and their order are fixed in advance, and a model works inside some of them. In an **agent**, the model decides: in a [loop](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md), it reads the goal and results so far, picks the next action or tool (a function your code runs for it) and says when it is done.

A workflow is a recipe: fixed steps, with judgment inside a step ("season to taste"). An agent is a chef told "make dinner from what is in the fridge."

In Anthropic's terms, workflows orchestrate models and tools "through predefined code paths," while in agents, the model directs its own process and tool use. Beware: OpenAI's agent guide uses "workflow" for the business process itself.

## Why an FDE needs this

A regional insurer's marketing team runs Content Operations as a fixed chain of model calls: Research, Plan, Draft, Review. Research summarizes three preset searches, so on new topics, such as a regulation change, drafts cite thin or outdated sources. A vendor proposes one autonomous agent holding every tool, including `publish_post`.

The FDE changes one step. Research becomes an agent loop: the model picks queries and searches until each question in the brief has a current source, within a step cap. Plan and Draft stay single calls, code checks disclaimers and banned phrases, an editor approves, and only code publishes. Drafts now cite current sources; compliance keeps its approval trail. (Illustrative scenario.)

## Key concepts

### The trade-offs

| | Workflow | Agent |
|---|---|---|
| Predictability | Same path every run | Path varies between runs |
| Testing | Each step alone, plus the path | Whole tasks, several runs each |
| Cost and latency | Set by the path, easy to budget | Grow with each step the model takes |

Anthropic's summary: workflows "offer predictability and consistency for well-defined tasks, whereas agents are the better option when flexibility and model-driven decision-making are needed at scale."

### A workflow with one agentic step

Most business processes start as workflows: they already exist as known sequences with sign-offs and audit trails, and code keeps those intact and each step testable. When one step's path cannot be scripted, such as research, only that step becomes a capped agent loop. The 12-Factor Agents guide observes that many products billed as AI agents are "mostly deterministic code, with LLM steps sprinkled in at just the right points."

### Content Operations: what stays deterministic

| Step | Who decides | Why |
|---|---|---|
| Research | Agent loop, step cap | The next search depends on what was found |
| Plan, Draft | One model call each | Judgment inside the step, not about the order |
| Review | Code checks, then a model | Disclaimers and banned claims are rules; tone is judgment |
| Approve | A named editor | Someone accountable signs off |
| Publish | Code, after approval | Public and hard to undo |

Approvals, calculations (a quoted premium comes from the rates system), publishing and anything a written rule governs stay in code; [Model Judgment vs Deterministic Code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md) covers single operations.

## Common misconceptions

- **"A system is either a workflow or an agent."** Many systems mix them: code fixes the order, and only steps that cannot be scripted run as agent loops.
- **"Workflows are rigid, so they cannot handle messy inputs."** Only the paths are fixed: a model inside a step reads messy text, and [routing](./02-workflow-patterns.md) sends different inputs down different paths.
- **"Writing the process into the agent's prompt works like a workflow."** A rule such as "always get review first" holds usually, not always. Required steps belong in code.
- **"We use an agent SDK, so we are building an agent."** OpenAI's Agents SDK, LangGraph and Google's ADK all run code-orchestrated workflows too.

## Typical interview questions

<details>
<summary>How do you tell whether a system is a workflow or an agent?</summary>

Ask who decides the next step. If every possible path is written in code, it is a workflow, however many model calls it makes. If the model picks each next action at run time, it is an agent.

</details>

<details>
<summary>What is a workflow with one agentic step?</summary>

Code fixes the order, and only the step whose path depends on what it finds, such as research, runs as a capped agent loop. Approvals and publishing stay predictable.

</details>

<details>
<summary>In a Content Operations flow (Research, Plan, Draft, Review, publish), which steps stay deterministic?</summary>

The order itself, Review's rule checks (disclaimers, banned claims, links), the editor's approval, publishing, and any quoted figure, which comes from a system of record. Research is the best candidate for an agentic step.

</details>

<details>
<summary>A content agent sometimes skips review before publishing, and its costs vary widely. What do you change?</summary>

I move the process from the prompt into code: publishing runs only after review and approval pass, and the model works only inside steps needing judgment. Then I compare quality and cost per article on the same briefs.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Reference: [Agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/) (OpenAI Agents SDK docs, about 5 min)

## Related

- [AI Agents](../13-agent-profiles/01-ai-agents.md)
- [Workflow Patterns (Chaining, Routing, Parallelization)](./02-workflow-patterns.md)
- [Single-Agent Systems](./03-single-agent-systems.md)
- [Choosing an Agent Architecture](./05-choosing-an-agent-architecture.md)
- [Model Judgment vs Deterministic Code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)
