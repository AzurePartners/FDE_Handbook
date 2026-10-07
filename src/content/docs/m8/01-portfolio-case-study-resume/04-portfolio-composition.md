---
title: Portfolio Composition
row: M8-L1.4
---
**In one sentence:** An FDE portfolio is one in-depth capstone written as a full case study plus three smaller case artifacts, each proving a different capability, all labeled by maturity and all linked to something a reviewer can open.

## What it is

The composition rule is "one deep, three narrow." The capstone is your Module 7 practicum (or equivalent): the full nine-section case study with architecture, ADRs, eval set, failure log, and handoff package. The three smaller artifacts are one-page write-ups, each anchored on a single capability the capstone does not fully show. The portfolio lives somewhere a recruiter can reach without logging in: a GitHub README, a simple site, or a Notion page linked from the resume header.

## Why an FDE needs this

FDE interviewers evaluate a T-shaped profile: breadth across systems, AI, integration, production, and discovery, plus depth in one area. One project cannot show all of that, and ten projects will not get read. The capstone proves depth and end-to-end ownership; the three artifacts fill the breadth gaps. A portfolio structured this way also prepares your interview stories in advance: the capstone feeds the project deep dive, and each artifact is a ready-made answer to "tell me about a time you…"

## Key concepts

### Choosing the three artifacts

Pick artifacts that cover capabilities the capstone leaves thin. Common choices:

| Artifact type | What it proves | Example from the curriculum |
|---|---|---|
| Evaluation harness | You measure rather than hope | A 40-case eval set with a rubric, a baseline run, and a regression it caught (Module 2, Lesson 5) |
| Integration or connector | You can work inside someone else's systems | A read-only lookup tool against a real API with auth, pagination, and error returns (Module 2, Lesson 4; Module 4, Lesson 1) |
| Discovery or scoping document | You can find the real problem | A stakeholder map plus a one-page PRD with non-goals from a Module 5 exercise |
| Failure investigation | You debug systems, not just prompts | A trace-based failure attribution with the fix and the regression test (Module 3, Lesson 6) |
| Data-quality pipeline | You handle real data | Deduplication and freshness gates on a public dataset (Module 6, Lesson 3) |

### The one-page artifact template

Problem in two sentences, what you built in one paragraph, one diagram or table, the eval or check that proves it, one failure, one link. Maturity label in the title.

### Where it lives

Resume header links to the portfolio index; each resume bullet references a specific artifact. Every artifact links to code or a document. Anything that cannot be opened is a claim, not evidence.

### Maintenance

Retire artifacts that no longer represent your best work. A stale portfolio with a 2024 chatbot as the lead project sends the wrong signal in a 2026 search.

## Common misconceptions

- **"A GitHub profile with many repos is a portfolio."** Unwritten repos are not readable evidence. Three documented artifacts beat thirty undocumented ones.
- **"The capstone must be the most impressive project I have."** It must be the one you can defend in the most depth. A modest, fully documented project outperforms an ambitious one you cannot explain.
- **"Interactive demos replace write-ups."** A demo shows the happy path; a write-up shows judgment. Use both, but the write-up is what interviewers read.

## Typical interview questions

<details>
<summary>Which of your projects should I look at first?</summary>

Name the capstone and say why in one sentence ("it is the one where I ran discovery, built the eval set, and handled the pilot failures myself"). Then point to one artifact relevant to the role you are interviewing for.

</details>

<details>
<summary>I read your eval harness write-up. Why that metric?</summary>

Explain what the customer or user actually needed the system to get right, why the metric measures that, and what it fails to measure. Then mention the baseline and how the harness is re-run after changes.

</details>

<details>
<summary>What is missing from your portfolio?</summary>

Name a capability honestly (for example, "nothing here shows production observability; my pilot had logs but no alerting") and connect it to your learning plan. See [Skill-Gap Learning Plan](../04-role-matching-narrative-job-search/04-skill-gap-learning-plan.md).

</details>

## Learn more

- Article: [How do you become a Forward Deployed Engineer? (2026)](https://dev.to/manduks/how-do-you-become-a-forward-deployed-engineer-2026-2l8p) (DEV) — the three portfolio artifacts hiring teams look for
- Article: [AI & ML Engineer Portfolio: The Complete 2026 Guide](https://linkfolio.cv/blog/ai-ml-engineer-portfolio-guide-2026) (Linkfolio) — the five projects that stand out, and how to present them
- Article: [How to Build an AI Portfolio That Gets You Hired](https://ai-tldr.dev/learn/building-ai-apps/ai-career-path/build-ai-portfolio/) (ai-tldr) — README contents, the no-answer eval case

## Related

- [Case Study Structure](./01-case-study-structure.md)
- [Maturity Labeling](./03-maturity-labeling.md)
- [Skill-Gap Learning Plan](../04-role-matching-narrative-job-search/04-skill-gap-learning-plan.md)
