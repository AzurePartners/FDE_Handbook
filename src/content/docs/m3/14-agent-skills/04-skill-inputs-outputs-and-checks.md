---
title: Skill Inputs, Outputs and Checks
row: M3-L2.4
---
**In one sentence:** A skill's inputs, outputs and checks are its written contract: what it needs to start, the named result it returns in a fixed structure, and the tests that result must pass before anyone uses it.

## What it is

A skill (a reusable task an agent loads when needed) that says only "extract the key terms" cannot be tested: nobody knows what it needs, what it returns or what good looks like. Four written parts fix that: inputs, steps, an output (a named artifact, meaning the file or record it hands back) and checks it runs before returning.

A recipe card has the same parts: ingredients, method, a photo of the dish, and the head chef's check before serving.

The open Agent Skills format has no fields for these, so they are plain body sections, with long templates in `assets/` and check scripts in `scripts/`.

## Why an FDE needs this

A manufacturer's buyers review supplier contracts with an agent's extract, compare and memo skills. One contract auto-renews for three years at a higher price. The trace shows extract left the renewal field blank, since the clause sat in an amendment it never received, and compare read blank as "no auto-renewal." Each skill did what its text said. (Illustrative scenario.)

The FDE writes each skill's inputs, output and checks. Extract now requires every amendment and returns each clause type as found (value, page) or not found, never blank, which a script verifies. A failed check gets one retry, then goes to a buyer as `needs_review`. Each skill gets three example contracts, one with an amendment.

## Key concepts

### Inputs, steps and output

List each input with its form and source. If one is missing, return `needs_input` naming it rather than guessing. For a whole agent, see [Agent Inputs, Outputs and Escalation Conditions](../13-agent-profiles/05-agent-inputs-outputs-escalation.md).

Number the steps; for complex skills, Anthropic suggests a checklist the agent checks off so it skips no validation. Give the output a template or [schema](../../m2/08-prompting-context-structured-output/06-structured-output.md), a `status` (`done`, `needs_input`, `needs_review`) and a problem list. Templates beat prose: "agents pattern-match well against concrete structures" (Agent Skills guide). In the extract skill:

```text
Inputs: contract.pdf, all amendments, clause_types.json
  (amendment cited but missing: return needs_input)
Output: clauses.json with a status and, per clause type,
  found (value, page) or not_found
Checks before returning:
  1. Run python scripts/check_clauses.py clauses.json
  2. Reread each found value against its page.
  3. On failure, fix and rerun once, else needs_review.
```

### Mechanical and judgment checks

Checks cover completeness (required rows present and filled), sources (each value traced to a page), format (valid JSON, real dates) and business rules. Mechanical ones belong in a [script](./05-instruction-only-vs-code-backed-skills.md) that exits 0 on a pass and otherwise names the problem, so a retry knows what to fix. Judgment checks, like step 2, stay as instructions with a rubric. Check substance, not labels: a script that only finds a "Sources" heading passes an empty section.

### When a check fails

Skill guides say to fix and rerun until validation passes. In client systems, cap it: one retry with the check's message, then return the work as `needs_review` with the failed check, never `done`. A check failing twice usually has an upstream cause, like a missing document, that retries cannot fix. General repair loops are in [Programmatic LLM Interfaces](../../m2/07-llm-application-foundations/08-programmatic-llm-interfaces.md).

### Example cases for each skill

Keep a few cases beside each skill: a realistic request, input files, the expected output in words, and assertions (checkable statements such as "status is needs_input"). The Agent Skills guide keeps them in `evals/evals.json`, starting with 2 to 3; Anthropic's guide asks for at least three. Include a missing-input case, run each with and without the skill to see its effect, and feed each check a known-bad output. Workflow-level tests are in [Replayable Tests for Agent Workflows](../18-agent-evaluation-debugging/06-replayable-tests.md).

## Common misconceptions

- **"If the output matches the template, the skill worked."** Every field can be present and still wrong. Pair structure checks with content checks.
- **"Adding 'double-check your work' gives the skill a check."** The model grades itself with its own blind spots. Checks need an external yardstick: a script, the source, a rubric.
- **"Passing `skills-ref validate` means the skill is tested."** It checks only frontmatter and naming. Output quality needs example cases.

## Typical interview questions

<details>
<summary>What should a skill declare so it can be tested?</summary>

Inputs and the rule for missing ones, numbered steps, a named, fixed-structure output with a status, pre-return checks, and example cases.

</details>

<details>
<summary>How do a skill's checks differ from its evals?</summary>

A check runs inside every execution and decides whether this artifact goes on or gets flagged. An eval runs fixed cases offline to decide whether a version ships. Checks guard runs; evals guard changes.

</details>

<details>
<summary>Design the contract for a skill that compares vendor quotes.</summary>

Inputs: quote files, currency and required line items, else `needs_input`. Output: a table per vendor and line, each figure citing its page, plus status. A script recomputes totals; one retry, then `needs_review`. Cases: normal, mixed currencies, missing page.

</details>

<details>
<summary>A skill's checks always pass, yet reviewers find errors. Why?</summary>

The checks are weak or not running. Traces show whether the script ran and its verdict counted; known-bad outputs that pass expose label-only checks. Each finding becomes a check or case.

</details>

## Learn more

- Reference: [Evaluating skill output quality](https://agentskills.io/skill-creation/evaluating-skills) (Agent Skills, about 12 min)
- Reference: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (Anthropic Claude Docs, about 25 min)

## Related

- [SKILL.md Files and Progressive Disclosure](./02-skill-md-and-progressive-disclosure.md)
- [Structured Output and JSON Schema](../../m2/08-prompting-context-structured-output/06-structured-output.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](../../m2/11-ai-evaluation/02-evaluation-sets.md)
- [Review and Critic Patterns](../15-agent-architectures/08-review-and-critic-patterns.md)
- [Handoffs and Agent Contracts](../15-agent-architectures/07-handoffs-and-agent-contracts.md)
