---
title: Prompt Versioning and Experimentation
row: M2-L2.8
---
**In one sentence:** Prompt versioning gives every prompt change a permanent version ID and a written reason, and experimentation means testing one change at a time while recording exactly what ran and what came out.

## What it is

A production prompt shapes every answer, so editing one sentence changes behavior like a code deploy. The 12-Factor Agents guide says to "own your prompts and treat them as first-class code."

Think of a recipe card with revision notes: "v7, less salt, diners found the soup too salty." Every dish traces to that day's card; if v7 is worse, the chef returns to v6.

It is two habits. Versioning: prompt files in Git, a version ID stamped into every call log (the record kept for each model call), and a changelog giving each change's reason. Experimentation: change one thing at a time and record the model, settings, prompt version, inputs, outputs and eval run (a scored test over fixed cases).

## Why an FDE needs this

An insurer's assistant routes emailed claims to queues, and three people edit its prompt in a provider dashboard. One Tuesday, general-queue misroutes jump. The logs say only "prompt: triage" and a model alias (a name the provider can repoint), so nobody knows which edit caused it.

The FDE moves the prompt into the client's repository as `prompts/claims_triage.md` (v15), pins the model ID in configuration and recovers earlier versions from edit history. Re-running each on the eval set shows the drop came with one added line: "If unsure, send to the general queue." The FDE reverts it as v16. When the COO asks what changed and why, the changelog answers.

## Key concepts

### Version IDs and the bundle

An ID can be a number in the file header (v16), the Git commit hash, or both: `claims-triage@v16+3f2a9c1`. Log this unchanging ID with every call (see Programmatic LLM Interfaces), never a movable label such as `production`.

Output also depends on few-shot examples, output schema, tool definitions, model and settings, so version them together or record each one.

### The changelog

Each entry states what changed, why (the failure, ticket or hypothesis), who, when, and the evidence. Without the reason, the next editor undoes fixes they don't understand.

```text
claims-triage v16  2026-09-14  J. Park (FDE)
Change: removed "If unsure, send to the general queue."
Why: general-queue misroutes rose after v15 (OPS-412)
Evidence: experiment EXP-031
```

### One change per experiment

If the prompt and model change together and the score moves, you cannot say which caused it, and a gain can hide a loss. For a model upgrade plus a prompt fix, run the unchanged prompt on the new model first, then the fix. This can miss interactions but is the right default for small eval sets. Each experiment names its baseline.

### The experiment record

| Field | What to write |
|---|---|
| ID, date, author | `EXP-031`, run date |
| Change and baseline | v15 to v16, with the hypothesis |
| Prompt version | `claims-triage@v16+3f2a9c1` |
| Model | Exact snapshot ID (a fixed model version) |
| Settings sent | Max tokens, effort; temperature only if accepted |
| Inputs and outputs | Eval set version; stored raw replies |
| Eval run | Link to scores (compared in Regression Testing) |
| Decision | Ship, reject or re-run |

Store outputs, since a re-run won't reproduce them: Anthropic notes temperature 0 "never guaranteed identical outputs," serving updates can slightly shift behavior under one model ID, and retired models stop answering. Customer data in records follows the client's data-handling rules.

Registries such as Langfuse, LangSmith and MLflow keep numbered versions with movable labels, useful when non-engineers edit often.

## Common misconceptions

- **"A prompt version is just the prompt text."** Examples, schema, tools, model and settings shape output too.
- **"Git history is enough; logs don't need a version ID."** Git shows what changed, not which version produced a bad answer.
- **"The `production` label tells me which prompt ran."** Labels move. Log the immutable ID.
- **"Recording the prompt and model lets me reproduce any output."** Outputs vary between runs and models retire. Store the outputs.

## Typical interview questions

<details>
<summary>What is prompt versioning, and why treat prompts like code?</summary>

Every change gets a permanent ID and a changelog reason, and the ID is logged with each call. A one-line edit changes every request like a deploy, so you must know what ran and roll back fast.

</details>

<details>
<summary>What is the difference between a prompt version and a "production" label?</summary>

A version like v7 never changes. A label is a movable pointer used to promote or roll back. I log the version, like logging a commit hash rather than a branch name.

</details>

<details>
<summary>A model upgrade and a prompt fix are both due. How do you test them?</summary>

Separately: the unchanged prompt on the new model first, then the fix, each against a named baseline, so every score change has one cause.

</details>

<details>
<summary>Would you keep a client's prompts in Git or a provider console?</summary>

Git by default, or a registry the team controls when non-engineers edit often. Not a console: in 2026 OpenAI deprecated dashboard prompt objects and Anthropic retired Workbench saved prompts.

</details>

## Learn more

- Article: [Factor 2: Own your prompts](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md) (HumanLayer, about 10 min)
- Article: [Prompt CI/CD: version, gate, and roll out prompts like code](https://langfuse.com/resources/engineering/prompt-cicd) (Langfuse, about 20 min)
- Practice: [Getting started](https://www.promptfoo.dev/docs/getting-started/) (promptfoo, about 30 min)

## Related

- [Git Mental Model: Working Tree, Staging, Commit](../../m1/04-git-debugging-testing-security/01-git-mental-model.md)
- [Pull Request Workflow](../../m1/04-git-debugging-testing-security/04-pull-request-workflow.md)
- [Reusable Prompt Templates](./03-reusable-prompt-templates.md)
- [Prompt Brittleness and Portability](./07-prompt-brittleness.md)
- [Regression Testing for Prompts, Models, Tools and Data](../11-ai-evaluation/08-regression-testing.md)
