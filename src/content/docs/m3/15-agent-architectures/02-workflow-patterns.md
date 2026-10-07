---
title: Workflow Patterns (Chaining, Routing, Parallelization)
row: M3-L3.2
---
**In one sentence:** Workflow patterns are fixed ways to connect model calls in ordinary code: chaining runs steps in order with checks between them, routing sends each input down one specialized path, and parallelization runs calls at once and merges the results.

## What it is

Many business tasks have steps you can list in advance. A workflow pattern wires them together: the model does the language work in each step; code decides what runs next.

Think of an emergency room: triage routes each patient, tests run in parallel, and surgery waits until results pass a check, like a gate in a chain.

Code fixes the path, so these are [workflows, not agents](./01-workflows-vs-agents.md). When a model picks the subtasks at run time (orchestrator-workers), see [Multi-Agent Systems](./04-multi-agent-systems.md); for critique loops, [Review and Critic Patterns](./08-review-and-critic-patterns.md).

## Why an FDE needs this

A manufacturer's procurement team reviewed incoming contracts (NDAs, supplier agreements, leases) with one long prompt that did everything. Each fix for NDAs broke supplier agreements, and when a summary quoted a liability cap the contract lacked, nobody could tell which part had failed.

The FDE rebuilt it as a workflow. A router labels each contract NDA, supplier, lease or other, and "other" goes to a paralegal. An extraction step returns exact quotes, and a code gate confirms each one exists in the contract. Each type's checks then run in parallel, merged by code. Prompts now change independently, and failures stop at a named step. (Illustrative scenario.)

## Key concepts

### Chaining with gates

Each call does one step and hands its output to the next. A gate is a code check between steps: does the output parse, are required sections present, do named products exist in the catalog? If not, retry once with the error, escalate to a person, or stop; never pass it on.

### Routing

A first call classifies the input; code sends it down a path with its own prompt, tools or model. Anthropic's reason: without routing, "optimizing for one kind of input can hurt performance on other inputs." Return one label from a fixed list ([structured output](../../m2/08-prompting-context-structured-output/06-structured-output.md)) with a fallback such as `other`, and test the router alone on labeled examples. If a form field already gives the category, route in code.

### Parallelization: sectioning and voting

Sectioning runs independent parts at once, merged in code: the contract checks, or a [guardrail](../../m2/12-safety-guardrails-hitl/01-input-and-output-guardrails.md) screening input beside the main answer. Voting runs one task several times with a threshold, such as flagging a payment if any of three checks does. Votes must be able to disagree, so Anthropic's examples vary the prompts. Self-consistency research (Wang et al., ICLR 2023) found majority votes over sampled reasoning paths improved accuracy.

### Trade-offs

| Pattern | Calls | Wait | Buys |
|---|---|---|---|
| Chain, 3 steps | 3 | Sum of steps | Easier steps, checks between |
| Router plus path | 2 | One extra call | Specialized prompts, cheaper models |
| Sectioning, 3 parts | 3 | Slowest part | Focus per part, speed |
| Voting, 3 votes | 3 | Slowest vote | Confidence, tunable threshold |

Parallel branches still share [rate limits](../../m1/03-apis-data-integration/04-rate-limits.md). Keep a pattern only if evals show it "demonstrably improves outcomes" (Anthropic).

### Plain code first

Anthropic advises starting "by using LLM APIs directly: many patterns can be implemented in a few lines of code."

```python
client = anthropic.AsyncAnthropic()

async def llm(prompt):
    r = await client.messages.create(model=os.environ["LLM_MODEL"], max_tokens=2000,
                                     messages=[{"role": "user", "content": prompt}])
    return "".join(b.text for b in r.content if b.type == "text")

async def review_contract(text):
    kind = (await llm(ROUTER + text)).strip()          # 1. route
    if kind not in CHECKS:
        return to_paralegal(text, kind)
    clauses = await llm(EXTRACT + text)                 # 2. chain
    missing = find_unquoted(clauses, text)              # 3. gate (plain code)
    if missing:
        return to_paralegal(text, missing)
    checks = [llm(p + clauses) for p in CHECKS[kind]]   # 4. sectioning
    return merge_into_table(await asyncio.gather(*checks))
```

LangGraph, Google ADK and Microsoft Agent Framework offer the same building blocks. Flows that must survive a crash or wait for a person need [Durable Execution](../17-persistent-agents/02-durable-execution.md).

## Common misconceptions

- **"One well-tuned prompt can handle every request type."** Fixes for one type often break another; routing keeps changes local.
- **"Running calls in parallel saves money."** It saves time; every branch spends tokens, and voting multiplies cost.
- **"These patterns need an agent framework."** Plain code does it; Anthropic warns that framework abstractions can hide the prompts and responses you debug.

## Typical interview questions

<details>
<summary>What are prompt chaining, routing and parallelization?</summary>

Fixed-path workflow patterns: sequential calls with code gates between them, a classifier choosing a specialized path per input, and simultaneous calls (independent parts or repeated attempts) merged in code.

</details>

<details>
<summary>How does sectioning differ from orchestrator-workers?</summary>

Sectioning's subtasks are fixed in code in advance; in orchestrator-workers a model decides them per input: more flexible, but harder to test and costlier.

</details>

<details>
<summary>Design a weekly flow: research, outline, draft, SEO title and social post.</summary>

Chain research, outline and draft, gating the outline on required sections and sourced claims. Then write the title and social post in parallel; an editor approves publishing.

</details>

<details>
<summary>A four-step chain takes 40 seconds. What do you do?</summary>

Check per-step latency in traces, parallelize independent steps, move rule steps into code, try smaller models where evals hold, and run it in the background if users can wait.

</details>

## Learn more

- Article: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic, about 15 min)
- Practice: [Basic workflows](https://platform.claude.com/cookbook/patterns-agents-basic-workflows) (Claude Cookbook, about 20 min)
- Reference: [Workflows and agents](https://docs.langchain.com/oss/python/langgraph/workflows-agents) (LangChain docs, about 25 min)

## Related

- [Workflows vs Agents](./01-workflows-vs-agents.md)
- [Review and Critic Patterns](./08-review-and-critic-patterns.md)
- [Multi-Agent Systems](./04-multi-agent-systems.md)
- [Sync vs. Async](../../m1/06-reliability-scale/01-sync-vs-async.md)
- [Skill Composition and Versioning](../14-agent-skills/06-skill-composition-and-versioning.md)
