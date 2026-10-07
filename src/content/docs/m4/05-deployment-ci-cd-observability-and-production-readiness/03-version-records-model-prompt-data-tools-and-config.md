---
title: "Version Records: Model, Prompt, Data, Tools & Config"
row: M4-L5.3
---
**In one sentence:** Recording the versions of everything that shapes behavior, model, prompt, data, tools, and configuration, is what lets you reproduce the exact state the system was in during an incident, and change any one of them deliberately rather than silently.

## What it is

An AI system's behavior is determined by more than its code: the **model** version, the **prompt**, the **data** it read, the **tools** it had, and its **configuration**. If any of these can change without a record, you lose the ability to answer "what was running when this went wrong?" **Version records** capture the specific version of each, so a given output can be tied to the exact state that produced it, and so changes (a prompt edit, a model upgrade) are tracked like code changes rather than silent shifts.

## Why an FDE needs this

AI features regress in subtle ways, a prompt tweak, a provider model update, a change in the underlying data. Without version records you can't tell what changed, can't reproduce the failing state, and can't cleanly roll back. Recording model/prompt/data/tool/config versions is what turns "quality dropped and we don't know why" into "we changed the prompt at 2pm; here's the diff; rolling back."

## Key concepts

- **Pin & record the model version:** not "latest"; know exactly which model ran.
- **Version the prompt:** in source control, with history and diff.
- **Record the data/tool/config state:** which data snapshot, which tools, which settings.
- **Reproducibility:** tie each output to the versioned state that produced it.
- **Deliberate change:** every change to these is tracked, reviewed, and reversible.

## Common misconceptions

- **"Only code needs versioning."** Prompt, model, data, tools, and config all shape behavior and must be versioned too.
- **"Use the latest model automatically."** Floating versions shift behavior silently; pin and upgrade deliberately.
- **"We'll remember what changed."** Under incident pressure you won't; the record is what makes reproduction possible.

## Typical interview questions

<details>
<summary>Why version the model, prompt, and data, not just the code?</summary>

Because all of them determine the system's behavior. If a prompt edit, a model upgrade, or a data change can happen without a record, you can't reproduce the state that caused an incident or tell what changed. Versioning all of them makes behavior reproducible and every change deliberate and reversible.

</details>

<details>
<summary>Quality dropped overnight and your code didn't change. How do version records help?</summary>

They let me check what else changed: was the model version pinned or did the provider update it, did the prompt or config change, did the underlying data shift? With versioned records I can compare the current state to yesterday's, localize the change, and roll that piece back, instead of guessing.

</details>

## Learn more

- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen; versioning, observability, guardrails)
- Article: [A postmortem of three recent issues](https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues) (Anthropic; why reproducing state matters)

## Related

- [Logs, Metrics, Traces, Health Checks & Alerts](./02-logs-metrics-traces-health-checks-and-alerts.md)
- [Freshness Gates, Provenance & Lineage](../03-real-world-data-quality-freshness-provenance-and-entity/02-freshness-gates-provenance-and-data-lineage.md)
