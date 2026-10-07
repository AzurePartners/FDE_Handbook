---
title: AI Agents
row: M3-L1.1
---
**In one sentence:** An AI agent is a system where a language model picks its own next step (which tool to call, what to do with the result, when to stop) in a loop toward a goal, inside limits set by code.

## What it is

A chatbot replies and waits. An agent gets a goal, like "find three recent, sourced statistics on remote work," and works out the steps: search, read, reject a 2019 figure, search again, stop when three check out.

Think of crossing town: direct a driver turn by turn (chatbot), take a bus route (workflow) or give a taxi driver the address (agent). The taxi driver picks the route; traffic rules and the meter still apply.

Precisely, Anthropic describes agents as "typically just LLMs using tools based on environmental feedback in a loop": the model reads each result and chooses the next action (mechanics: [The Tool-Call Loop](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)). Code around the loop sets the limits: tools, steps, spend and which actions wait for a person.

## Why an FDE needs this

A logistics firm's "IT support agent" was a chat assistant whose prompt began "You are an expert systems administrator." It had no tools, yet twice told employees "Done, your account is unlocked" when nothing had changed. IT's fix: connect it to the whole admin console.

The FDE showed it was a chatbot with a persona and rebuilt it as an agent: a short profile, read-only status lookups, an unlock tool that code restricts to the verified requester's own account, and a 10-step cap. Lookups and own-account unlocks run alone, logged; access grants wait for IT staff; anything else becomes a drafted ticket. (Illustrative scenario.)

## Key concepts

### Agent, chatbot or fixed workflow

| System | Who picks the next step | Example |
|---|---|---|
| Chatbot | The person, each turn | Headline ideas, requested one by one |
| Fixed workflow | Code, in a set order | Research, outline, draft, review, one call each |
| Agent | The model, within limits | Picks sources until three figures check out |

OpenAI's agent guide agrees: "simple chatbots, single-turn LLMs, or sentiment classifiers" are not agents. More in [Workflows vs Agents](../15-agent-architectures/01-workflows-vs-agents.md).

### More than a prompt

When you build an agent, add its parts roughly in this order:

- **[Profile](./02-agent-profiles.md):** the job, its limits, when to escalate.
- **[Knowledge](./03-profile-vs-knowledge.md):** facts from owned sources, not the profile.
- **[Skills](../14-agent-skills/01-agent-skills.md):** reusable procedures, like research or review.
- **[Code](../14-agent-skills/05-instruction-only-vs-code-backed-skills.md):** scripts and checks for exact, repeatable steps.
- **[Tools](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md):** what it can read or change.
- **[State and memory](../16-agent-state-memory/01-state-and-memory-types.md):** progress and what carries over.
- **[Multiple agents](../15-agent-architectures/04-multi-agent-systems.md):** last, only when one agent falls short; each adds cost and failure points.

### The autonomy spectrum

Autonomy is how far an agent goes before a person looks:

- **Suggest:** it proposes, a person acts (a research brief).
- **Act with approval:** it prepares the exact action and waits for a yes (publishing).
- **Act alone:** it acts and logs; people review samples (saving a draft).

Set it per action, start low and raise it as traces and evals earn trust. The Claude Agent SDK exposes this dial as permission modes, from `plan` (plans without editing) through `default` (asks for approval) to `bypassPermissions` (no prompts). See [Human-in-the-Loop Approval](../../m2/12-safety-guardrails-hitl/06-human-in-the-loop-approval.md).

### Agent SDKs

Agent SDKs and frameworks run the loop and add sessions, permissions or tracing: the Claude Agent SDK, OpenAI Agents SDK, Microsoft Agent Framework, Google's Agent Development Kit (ADK) and LangGraph (as of September 2026). Anthropic suggests starting "by using LLM APIs directly," since frameworks can "obscure the underlying prompts and responses."

## Common misconceptions

- **"An agent is a prompt with a good persona."** A persona changes tone, not capability; without tools, a loop and code limits, it is a chatbot.
- **"If it calls tools, it's an agent."** A fixed search-then-summarize pipeline is a workflow; an agent chooses its own next step.
- **"More autonomy makes a better agent."** Anthropic warns that autonomy means "higher costs, and the potential for compounding errors." Grant each action the least autonomy it needs.
- **"The model knows when it's done."** Models quit early or loop, so code caps steps and spend and checks the [definition of done](./06-agent-success-criteria.md).

## Typical interview questions

<details>
<summary>What is an AI agent?</summary>

A system where a model picks its next step (which tool, what a result means, when to stop) in a loop toward a goal, within tools, limits and approvals set by code.

</details>

<details>
<summary>How does an agent differ from a chatbot and from a fixed workflow?</summary>

In a chatbot, the user steers each turn; in a workflow, code fixes the steps; in an agent, the model orders them, trading predictability for flexibility.

</details>

<details>
<summary>How would you scope an agent that researches, writes and publishes blog posts?</summary>

A profile with duties and prohibitions, brand facts as knowledge, search and drafting tools, and code that caps steps and checks each cited source was retrieved; an editor approves publishing. First, I'd test whether a fixed workflow suffices.

</details>

<details>
<summary>How do you decide how much autonomy an agent gets?</summary>

Per action, by what a mistake costs and whether it can be undone: reads and drafts run alone, logged; publishing or payments wait for approval until traces and evals justify more.

</details>

## Learn more

- Course: [What is an Agent?](https://huggingface.co/learn/agents-course/unit1/what-are-agents) (Hugging Face, about 6 min)
- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Article: [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) (OpenAI, about 20 min)

## Related

- [The Tool-Call Loop and Tool Traces](../../m2/10-tool-calling-deterministic-logic/02-tool-call-loop.md)
- [Agent Profiles (Profile.md)](./02-agent-profiles.md)
- [Workflows vs Agents](../15-agent-architectures/01-workflows-vs-agents.md)
- [Agent State and Memory Types](../16-agent-state-memory/01-state-and-memory-types.md)
- [Tool Forms: CLI, IDE and Agent](../../m1/01-ai-assisted-development/02-tool-forms.md)
