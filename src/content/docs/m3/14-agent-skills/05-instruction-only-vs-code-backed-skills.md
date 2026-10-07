---
title: Instruction-Only vs Code-Backed Skills
row: M3-L2.5
---
**In one sentence:** An instruction-only skill is Markdown guidance the model follows with its own judgment; a code-backed skill also bundles scripts the agent runs for steps that must repeat exactly, such as parsing or calculating.

## What it is

Many skills are pure text: steps, a rubric, an example. The model applies judgment, which suits research, writing and review. Steps with one right answer, like totaling an invoice, are different: when the model does them itself, it can slip. A code-backed skill hands them to a script.

An accountant works the same way: judgment on which expenses a client can claim, tax software for the arithmetic.

Precisely: in the open Agent Skills format, scripts sit in a skill's `scripts/` folder. The agent runs them with its shell or code execution tool, and only their output enters context. Anthropic's authoring guide calls the choice degrees of freedom: text when "multiple approaches are valid", specific scripts when "consistency is critical".

## Why an FDE needs this

Picture a freight company's agent whose instruction-only skill audits carrier invoices: read the PDF, total the charges, check contracted rates, draft a dispute note. In the pilot, one invoice gave different totals across runs, lines deep in long PDFs were missed, and, lacking the rate card, the model sometimes took the invoiced price as the contract price. Whole PDFs in context made each audit slow and costly.

The FDE kept judgment in Markdown: which differences to dispute, and the note's wording. A bundled `scripts/extract_invoice.py` now prints line items and totals as JSON. The rate check became an app tool reading the client's rate card, since skills on the Claude API run in a sandbox without network access.

## Key concepts

### Where each step lives

For the general rule, see [Model Judgment vs Deterministic Code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md). Inside one skill:

| Step | Where | Why |
|---|---|---|
| Judge relevance, draft, review against a rubric | Instructions (rubric as a reference file) | Judgment calls |
| Parse or convert files, compute totals, validate formats | Bundled script | Exact; files stay out of context |
| Look up live data, change a record | App tool | Needs network, credentials, approval |

A script travels with the skill; an app tool ([Tool Schemas and Tool Design](../../m2/10-tool-calling-deterministic-logic/05-tool-design.md)) runs in your application, which holds credentials and can validate arguments, require approval and log calls. Steps can name both:

```text
1. Run: python scripts/extract_invoice.py invoice.pdf
   Use its JSON line items and totals exactly.
2. Send those lines to the compare_to_contract tool.
3. Decide which differences are worth disputing; draft the note.
```

### Signs a skill should gain code

- The same mechanical error recurs in traces or evals, like a wrong total.
- The agent rewrites the same helper code every run, which the Agent Skills guide calls a signal to "write a tested script once".
- The work is token-heavy. Anthropic: "sorting a list via token generation is far more expensive than simply running a sorting algorithm."

### What a script needs to run

- **An environment.** On the Claude API, skills run in the code execution tool's container: no internet, only pre-installed libraries such as pandas. In Claude Code, scripts run on the user's machine with its network access; on claude.ai, network access depends on settings.
- **Declared dependencies,** in `SKILL.md` or the format's optional `compatibility` field.
- **No interactive prompts.** A script waiting for input "will hang indefinitely". Take flags, print JSON, explain errors.

## Common misconceptions

- **"A long script bloats the prompt."** An executed script never enters context; only its output does.
- **"A skill with a script is deterministic."** Only the script's step is. The agent still chooses whether to run it and how to use the output, so check the result ([Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md)).
- **"Skill scripts can call any API."** Not on the Claude API, which gives skills no network access. Client systems belong behind app tools.
- **"Code is more reliable, so script everything."** Keyword rules for tone do worse than a rubric; script only fragile, exact steps.

## Typical interview questions

<details>
<summary>What is a code-backed skill?</summary>

A skill that also bundles scripts the agent runs for steps with one right answer, like parsing or computing, while its instructions keep the judgment calls.

</details>

<details>
<summary>How does a script bundled in a skill differ from a tool your app exposes?</summary>

The script ships with the skill and suits self-contained file work without secrets or side effects. Live systems, credentials and writes go in an app tool, where your code validates, requires approval and logs.

</details>

<details>
<summary>How would you split a Content Creation research skill into text, scripts and tools?</summary>

Judging credibility and summarizing stay as text. Search and page fetches need the network, so they are tools. PDF conversion, removing duplicate sources and validating the notes file are scripts.

</details>

<details>
<summary>An agent writes a new CSV parser each run and misreads columns. What do you change?</summary>

I bundle one tested parser, have the skill run it and quote its output, confirm the target surface has its libraries, and add the failing files as eval cases.

</details>

## Learn more

- Article: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (Anthropic Engineering, about 8 min)
- Reference: [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) (Anthropic Claude Docs, about 12 min)
- Reference: [Using scripts in skills](https://agentskills.io/skill-creation/using-scripts) (Agent Skills, about 10 min)

## Related

- [Model Judgment vs Deterministic Code](../../m2/10-tool-calling-deterministic-logic/03-model-vs-code.md)
- [SKILL.md Files and Progressive Disclosure](./02-skill-md-and-progressive-disclosure.md)
- [Skill Inputs, Outputs and Checks](./04-skill-inputs-outputs-and-checks.md)
- [Tool Calling (Function Calling)](../../m2/10-tool-calling-deterministic-logic/01-tool-calling.md)
- [Dev Environment: Terminal, Project Layout, Dependencies, Env Vars](../../m1/01-ai-assisted-development/03-dev-environment.md)
