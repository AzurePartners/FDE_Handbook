---
title: Case Study Structure
row: M8-L1.1
---
**In one sentence:** A case study is a written account of one project in a fixed order — Problem → Discovery → Architecture → Trade-offs → Build → Eval → Failure → Outcome → Next Step — so a reader can follow your judgment, not just your output.

## What it is

A portfolio case study is a two-to-four page document (or a README section) that tells one project as a sequence of decisions. It is not a feature list and not a demo video. The nine-part order is the FDE delivery lifecycle from Module 5 compressed into a narrative: what the customer asked for, what you found out, what you chose to build and why, what you gave up, what you shipped, how you proved it works, where it broke, what changed for the customer, and what you would do next.

## Why an FDE needs this

Hiring managers pick one or two projects from your resume and spend the whole screen on them. They are checking whether you can name your own decisions, whether you measured anything, and whether you know where your system fails. A project written in this order answers those questions before they are asked. It is also the document a take-home reviewer wants alongside your code: the design trade-offs writeup is often weighted as heavily as the code itself.

## Key concepts

### The nine sections and what each one proves

| Section | One or two paragraphs on | What the reader learns about you |
|---|---|---|
| Problem | The business problem, the user, the baseline (how it works today), the constraint | You start from the customer, not the technology |
| Discovery | What you asked, whom you asked, what surprised you | You do not take the first request as the requirement |
| Architecture | The components, the data flow, where the model sits, what is deterministic code | You can draw the system and explain each box |
| Trade-offs | The two or three alternatives you rejected and why | You made choices, not defaults |
| Build | What you actually implemented, with scope stated honestly | Your scope claims match reality |
| Eval | The eval set, the metrics, the baseline, the numbers | You can answer "how do you know it works?" |
| Failure | Real failure cases and what you did about them | You know the system's limits |
| Outcome | What changed for the user or business, with evidence strength labeled | You separate model metrics from business value |
| Next step | What you would do with another month, and what you deliberately deferred | You think past the demo |

### Evidence, not adjectives

Each section should link to an artifact: a diagram, an ADR, an eval spreadsheet, a trace, a changelog entry, a before/after table. A case study with links can be verified; one without links is a claim.

### One page per section is too long; one sentence is too short

Aim for 150–300 words per section. The Eval and Failure sections usually deserve the most space because they are the rarest and most persuasive.

## Common misconceptions

- **"The case study should show the project succeeding."** Reviewers trust a project with a documented failure and a fix more than one with none. A case study with no Failure section reads as either unfinished or unexamined.
- **"Architecture is the important part."** Architecture without Discovery and Trade-offs is a diagram anyone could have drawn. The sections that show judgment are the ones around it.
- **"More projects are better."** One fully documented project beats five README stubs. See [Portfolio Composition](./04-portfolio-composition.md).

## Typical interview questions

<details>
<summary>Walk me through this project from the beginning.</summary>

Follow the nine-section order out loud, spending most of the time on Discovery, Trade-offs, and Eval. State the baseline before the solution ("today an analyst spends about two hours per report"), name one alternative you rejected, give one eval number with its baseline, and end with what you would do next.

</details>

<details>
<summary>How did you know it was working?</summary>

Describe the eval set (how many cases, how they were chosen, who labeled them), the metric, and the number compared with a baseline. Then name one thing the eval did not cover and how you found out about it.

</details>

<details>
<summary>What would you do differently?</summary>

Point to a specific section: a Discovery question you should have asked earlier, a trade-off you would now flip, an eval case you should have written first. A vague "spend more time on testing" is a weak answer; a concrete "I would have built the eval set before the retrieval layer, because the first version optimized for the wrong question type" is a strong one.

</details>

## Learn more

- Article: [How to Build an AI Portfolio That Gets You Hired](https://ai-tldr.dev/learn/building-ai-apps/ai-career-path/build-ai-portfolio/) (ai-tldr) — why a small eval set and an honest failure list are the highest-leverage artifacts
- Article: [AI & ML Engineer Portfolio: The Complete 2026 Guide](https://linkfolio.cv/blog/ai-ml-engineer-portfolio-guide-2026) (Linkfolio) — lead with the outcome and the system, show evals, link something live
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering) — what a credible Eval section rests on
- Reference: [Architecture Decision Records](https://adr.github.io/) — the artifact behind the Trade-offs section

## Related

- [Evidence-Based Resume Bullets](./02-evidence-based-resume-bullets.md)
- [Maturity Labeling](./03-maturity-labeling.md)
- [STAR and Project Deep Dives](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
