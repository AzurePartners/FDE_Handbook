---
title: Reproducible Setup
row: M7-L3.2
---
**In one sentence:** A reproducible setup is a recorded recipe, covering profile, skills, code, tools, data and settings, that lets someone else rebuild your alpha from scratch and get the same behavior.

## What it is

Building the alpha means creating the parts the architecture map named: the agent profile, any skills, the code, the tool connections, the knowledge data, and a basic interface or workspace. Reproducibility means those parts are written down and versioned, not living in your head or in one browser tab.

For the Course Support Assistant, the parts are a profile file with the assistant's role and prohibited actions, a retrieval script, a policy folder, and a simple chat page. The profile format is covered in [Agent Profiles](../../m3/13-agent-profiles/02-agent-profiles.md) (M3), and skills in [Agent Skills](../../m3/14-agent-skills/01-agent-skills.md) (M3).

## Why an FDE needs this

Client work gets handed over, paused and restarted. If the alpha only works on your laptop with a key you pasted into a terminal last Tuesday, you cannot hand it off, rerun an evaluation, or tell whether a change helped. When a result looks different tomorrow, you need to know whether the code, prompt, data or model changed.

## Key concepts

Three habits make a setup reproducible. Keep secrets out of the repo and load them from environment variables, as described in [Secret Management](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md) (M4). Pin versions of the model name, prompt file, data snapshot and tool config. Write the commands down in order, then test them in a clean folder. The recording format is in [Version Records](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md) (M4).

```text
repo/
  profile.md            agent role, boundaries, escalation
  skills/               one folder per skill
  data/policies/        snapshot of source documents
  app/                  retrieval and model-call code
  .env.example          names of required variables, no values
  VERSIONS.md           model, prompt, data, tool config
  README.md             setup and run steps
```

### What you produce

- Repository (or workspace export) with the layout above.
- `.env.example` listing every variable the system needs.
- `VERSIONS.md` with a table:

| Item | Value |
|---|---|
| Model | (exact model name) |
| Prompt file and version | `profile.md`, v3 |
| Data snapshot | `data/policies`, date taken |
| Tool or MCP config | (file name) |

- A README with numbered steps from a clean machine to the first answer.

### Pass bar

- A fresh clone, following only the README, reaches the first working answer.
- No secret appears in the repo or in the README.
- `VERSIONS.md` matches what is actually running.
- Every manual step is written down, including account or permission requests.

## Common misconceptions

- **"If it runs for me, it is set up."** It must run for someone with a clean environment. Hidden local files and env variables are the usual cause of "works on my machine".
- **"Reproducible means containerized."** A container helps but is not required. Clear steps and pinned versions meet the bar for an alpha.
- **"Platform configuration needs no record."** Settings made in a UI vanish if nobody exports or screenshots them. Write them down too.

## Typical interview questions

<details>
<summary>How did you make your alpha reproducible?</summary>

I put the profile, skills, code and a data snapshot in one repo, listed required variables in `.env.example`, pinned versions in `VERSIONS.md`, and wrote a README. Then I tested it by following the README in a clean folder.

</details>

<details>
<summary>What do you do with API keys?</summary>

They live in environment variables, never in the repo. The repo carries only a template file with the variable names.

</details>

<details>
<summary>Someone says the answers changed overnight. How does your setup help?</summary>

I compare `VERSIONS.md` entries to see whether the model, prompt, data or tool config changed, then isolate the one that did.

</details>

## Learn more

- Article: [The Twelve-Factor App](https://12factor.net/) (Adam Wiggins, short online guide; see Dependencies and Config).

## Related

- [Thin End-to-End Slice](./01-thin-end-to-end-slice.md)
- [Alpha Pass Condition](./04-alpha-pass-condition.md)
- [Version Records](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md) (M4)
- [Secret Management](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md) (M4)
- [Agent Profiles](../../m3/13-agent-profiles/02-agent-profiles.md) (M3)
