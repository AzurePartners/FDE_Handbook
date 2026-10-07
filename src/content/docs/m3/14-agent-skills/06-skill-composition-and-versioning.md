---
title: Skill Composition and Versioning
row: M3-L2.6
---
**In one sentence:** Skill composition runs several skills as one flow, each output feeding the next; skill versioning gives every change a permanent ID, so production runs a tested version and can roll back.

## What it is

Once an agent is split into skills (see [Skill Decomposition](./03-skill-decomposition.md)), two jobs remain. Composition runs them as one flow, each consuming the previous output: research, outline, draft, review, revise. Versioning lets one skill change without silently changing every flow using it.

Think of a car factory that logs which part revision went into each car, so a bad revision can be traced and the previous one restored.

Precisely: a version is an immutable, ID-tagged snapshot of the whole skill folder (instructions, scripts, reference files); pinning means production names exact versions. Each skill's declared output ([Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md)) is a [contract](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md) for the next.

## Why an FDE needs this

A retailer's marketing flow and support flow share a `summarize-sources` skill. A marketer rewrites it for punchier summaries, tests three product blurbs and uploads it. Both flows load each skill's newest version, so it goes live everywhere. A week later support leads find answers promising "a two-year warranty" where the policy says "two years, batteries excluded," and nobody knows which answers used which version. Meanwhile, legal's ban on promising delivery dates sits in four skills, worded three ways. (Illustrative scenario.)

The FDE moves the skills into the client's Git repository with versions, changelogs and owners, pins exact versions per flow and logs them per run. Legal's rule moves to the profile, punchy summaries become their own marketing skill, and any skill change now runs both flows' evals.

## Key concepts

### Who decides the order

Code can fix the order (prompt chaining, see [Workflow Patterns](../15-agent-architectures/02-workflow-patterns.md)): predictable and testable. Or the agent loads skills whose descriptions match the task: Anthropic's October 2025 launch said skills "stack together" and Claude "coordinates their use." A broadly described new skill can then steal tasks from others, so test the whole set.

### Keeping the super prompt from growing back

- **One job per skill.** New requirements go to the skill owning that job, or a new one, never into several "to be safe."
- **Shared rules live once,** in the [agent profile](../13-agent-profiles/02-agent-profiles.md) or one shared file.
- **Watch size and count.** Anthropic suggests a `SKILL.md` body under 500 lines and warns that unused skills hurt performance.

### Version numbers and pins

Treat a skill's inputs and output format as its public API under Semantic Versioning: MAJOR for incompatible changes, MINOR for backward-compatible additions, PATCH for fixes. The Agent Skills standard has no version field; teams use free-form `metadata` (the spec's example: `version: "1.0"`) or Git tags.

```text
# flows/support-answers.yaml: pins change only by pull request
find: find-policy-clauses@2.3.1
summarize: summarize-sources@1.4.0   # 1.5.0 dropped exclusions in support evals
reply: draft-reply@3.0.2
```

Anthropic's Skills API gives each upload a version ID; its docs advise pinning in production, since with `latest` or no `version`, "a version uploaded by anyone in the workspace immediately changes what your production agents run." OpenAI's Skills API also keeps immutable numbered versions and a movable default. Log each run's versions and keep changelogs as in [Prompt Versioning](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md).

### Owners and dependent flows

Anthropic's enterprise guide suggests registering each skill's purpose, owner, version, dependencies and evaluation status, and says authors should not review their own skills. A `CODEOWNERS` file makes GitHub request the owner's review on pull requests touching that skill. Keep a used-by list: changing `summarize-sources` re-runs every dependent flow's evals, the pin moves only when all pass, and the old version stays for rollback (see [Regression Testing](../../m2/11-ai-evaluation/08-regression-testing.md)).

## Common misconceptions

- **"Once the super prompt is split into skills, it stays split."** Without an owner per job and one home for shared rules, requirements land in several skills and the prompt regrows in pieces.
- **"Using `latest` keeps production up to date."** It ships every upload to production untested. Pin production; use `latest` in development.
- **"A skill that passes its own tests is safe to release."** Every flow using it depends on its output; re-run them all.
- **"A skill version is just the `SKILL.md` text."** Scripts and reference files change behavior too, so version the whole folder.

## Typical interview questions

<details>
<summary>What is skill composition, and who decides the order?</summary>

Running skills as one flow, each output feeding the next. Code can fix the order, predictable and testable, or the agent picks skills by description, flexible but needing the whole set tested.

</details>

<details>
<summary>What is the difference between pinning a skill version and using latest?</summary>

A pin names an exact, immutable version, so behavior changes only when someone moves it after evals pass. `latest` follows every upload, so any edit reaches production untested.

</details>

<details>
<summary>How do you let a team improve shared skills without breaking production?</summary>

Skills live in Git with semantic versions, changelogs and code owners; flows pin exact versions. A change runs every dependent flow's evals; pins move only on a pass, and old versions stay for rollback.

</details>

<details>
<summary>After a review skill update, drafts stop getting revised. Where do you look?</summary>

The handoff: the trace shows which review version ran and its raw output. If the format changed, revise cannot read it, so I pin the last good version, then fix the format or update both together.

</details>

## Learn more

- Reference: [Semantic Versioning 2.0.0](https://semver.org/) (semver.org, about 10 min)
- Reference: [Skills for enterprise](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/enterprise) (Anthropic Claude Docs, about 10 min)

## Related

- [Skill Decomposition](./03-skill-decomposition.md)
- [Prompt Versioning and Experimentation](../../m2/08-prompting-context-structured-output/08-prompt-versioning.md)
- [Regression Testing for Prompts, Models, Tools and Data](../../m2/11-ai-evaluation/08-regression-testing.md)
- [Workflow Patterns (Chaining, Routing, Parallelization)](../15-agent-architectures/02-workflow-patterns.md)
- [Agent Skills](./01-agent-skills.md)
