---
title: The Architecture Decision Tree
row: M5-L5.1
---
**In one sentence:** Start with the simplest architecture that could work and escalate only when needed, rules/scripts → web app → RAG → tool calling → workflow → single agent → multi-agent, because each step up adds capability but also cost, latency, and failure surface.

## What it is

There's a rough ladder of solution complexity for AI-assisted problems:

1. **Rules/scripts:** deterministic logic; no model needed.
2. **Web app:** a UI over some logic/data.
3. **RAG:** retrieval-augmented generation, answer from a knowledge base.
4. **Tool calling:** the model calls functions to act/fetch.
5. **Workflow:** a fixed sequence of model + code steps.
6. **Single agent:** the model plans and loops with tools.
7. **Multi-agent:** multiple coordinating agents.

The **decision tree** means: pick the lowest rung that solves the problem, and only climb when the problem genuinely requires it. Each rung up buys capability at the cost of complexity, latency, cost, and more ways to fail.

## Why an FDE needs this

The industry hype pulls toward multi-agent systems for everything, but most problems are solved far down the ladder, often by rules, a web app, or simple tool calling. Over-building is a top FDE failure: a multi-agent system where a script would do is slower, costlier, harder to debug, and less reliable. Knowing the ladder lets you justify the simplest sufficient architecture and resist unnecessary complexity, which is what makes solutions robust and maintainable.

## Key concepts

- **Climb only when needed:** each rung adds cost, latency, and failure surface.
- **Most problems sit low:** rules, web app, RAG, or tool calling solve a lot.
- **Agents are powerful and expensive:** reserve single/multi-agent for genuinely open-ended, multi-step problems.
- **Justify the choice:** be able to say why this rung and not a lower one.
- **Simplicity is reliability:** fewer moving parts, fewer failure modes.

## Common misconceptions

- **"Use agents; they're the state of the art."** Agents add complexity and failure modes; most problems are solved lower on the ladder.
- **"More sophisticated architecture is better."** Better is the simplest that meets the requirements; sophistication is a cost.
- **"Start at the top and simplify later."** Start simple and climb only when the problem forces it; over-building is hard to walk back.

## Typical interview questions

<details>
<summary>How do you choose an architecture for an AI problem?</summary>

I start at the bottom of the ladder, rules/scripts, web app, RAG, tool calling, workflow, single agent, multi-agent, and pick the lowest rung that actually solves the problem, climbing only when it genuinely requires it. Each step up adds capability but also cost, latency, and failure surface, so the goal is the simplest architecture that works, and I can justify why not a lower rung.

</details>

<details>
<summary>When is a multi-agent system actually warranted?</summary>

When the problem is genuinely open-ended and multi-step in a way that a single agent, workflow, or tool-calling setup can't handle, and the added complexity, latency, cost, coordination, and failure modes, is justified by the capability gained. For most problems something lower on the ladder is more reliable and maintainable.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (complexity ladder: single call → workflow → agent)
- Repo: [System Design Primer](https://github.com/donnemartin/system-design-primer) (classic web/data building blocks)

## Related

- [Allocating Steps: Automation, AI, Code or Human](../03-as-is-to-be-workflow-mapping-and-requirement-decomposition/02-allocating-steps-automation-ai-deterministic-code-or-human.md)
- [Build vs Buy vs Configure](./02-build-vs-buy-vs-configure.md)
