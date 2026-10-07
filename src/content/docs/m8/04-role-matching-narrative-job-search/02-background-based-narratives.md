---
title: Background-Based Narratives
row: M8-L4.2
---
**In one sentence:** Your interview narrative is a bridge from what you have already done to FDE work — Domain Expert → FDE, Backend → FDE, AI Engineer → FDE, Startup Generalist → FDE — and the strongest bridge is "I have already done this work informally; here is the evidence."

## What it is

A narrative is the two-minute story that opens the recruiter screen and frames every later round: where you come from, what you carried over, what you deliberately built to close the gap, and why FDE is the next step rather than a detour. Each background has a natural strength and a predictable doubt, and the narrative addresses the doubt before the interviewer raises it. The curriculum's practicum and case artifacts are the evidence that makes the bridge credible.

## Why an FDE needs this

Nobody arrives with the full FDE profile, and hiring teams know it. The most reliable paths into the role are early-stage startup engineers, hands-on solutions architects who write code, data engineers with production deployments, backend engineers who worked directly with customers, and increasingly domain experts who learned to build. What interviewers screen for is whether you understand which parts of the job you have not done and have concrete evidence you can do them. A narrative that hides the gap fails at the first deep-dive; one that names it and shows the work passes.

## Key concepts

### The four common bridges

| Background | Carried over | Predictable doubt | Evidence that closes it |
|---|---|---|---|
| Domain expert (finance, healthcare, ops) → FDE | Discovery instinct, stakeholder fluency, knows the real workflow | Can you build and debug production systems? | A capstone with your own code, an integration with real auth, a debugging story, an eval set you built |
| Backend / data engineer → FDE | Production code, integrations, reliability | Can you run discovery and sit with a skeptical VP? | Stakeholder map and PRD from a real or simulated engagement, a demo you ran for non-technical users, a "said no" story |
| AI / ML engineer → FDE | Evals, RAG, agents, model judgment | Can you ship inside someone else's messy systems and own the outcome? | A pilot with real users, an auth/permissions integration, a handoff package, a maturity-labeled portfolio |
| Startup generalist → FDE | End-to-end ownership, speed, talked to users | Do you have depth anywhere, and can you work under enterprise constraints? | One deep artifact (eval harness or connector), a compliance-aware design, ADRs showing deliberate trade-offs |

### The narrative template

Origin (one sentence) → what you kept doing that looks like FDE work (two sentences, with one concrete example) → the gap you identified and what you built to close it (two sentences, pointing at a portfolio artifact) → why this role at this company (one sentence, specific).

### Ownership, made explicit

Whatever the background, the narrative must contain at least one moment where you owned an outcome, not a task: a system others relied on, a decision you made and defended, a failure you fixed.

### Tailoring by company family

The same narrative leads with production reliability for a Palantir-style loop and with evals and customer conversation for an AI-lab loop. Change the emphasis, not the facts.

## Common misconceptions

- **"I should present myself as already an FDE."** Interviewers respect a clear bridge more than a costume. Name the gap and the evidence.
- **"Domain experts cannot get FDE roles."** Domain knowledge plus a real build is one of the strongest profiles for vertical AI companies; the doubt is engineering depth, and the capstone answers it.
- **"AI engineers have the easiest path."** They have the most common gap: no customer-facing delivery. Prepare that answer explicitly.

## Typical interview questions

<details>
<summary>Walk me through your background.</summary>

Two minutes, template above. End with the specific reason for this company. Time it; most candidates run four minutes and lose the room.

</details>

<details>
<summary>You have never had a customer-facing title. Why should I believe you can do this part?</summary>

Give the informal evidence: users you supported directly, a demo you ran for a non-technical audience, a requirement you pushed back on with a stakeholder, the stakeholder map and interview notes from your capstone. Then say what you know you have not done (for example, delivering a slip to an executive) and how you practiced it.

</details>

<details>
<summary>You come from a domain background. What happens when the integration breaks at 2 a.m.?</summary>

Tell the debugging story from your capstone: the failure, how you reproduced it, the log or trace that located it, the fix, the test. Then acknowledge that you would want a senior engineer paired with you for the first incident and say what you would learn from it.

</details>

## Learn more

- Article: [Who Wants to be a Delta?](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035) (Palantir) — a backend engineer's move into forward-deployed work
- Article: [Dev versus Delta](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87) (Palantir)
- Article: [Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde) (Aced) — the four backgrounds that break in most reliably, and the "bridge story"
- Reference: [Behavioral interviews](https://www.techinterviewhandbook.org/behavioral-interview/) (Tech Interview Handbook) — structuring the two-minute introduction

## Related

- [FDE and Adjacent Roles](./01-fde-and-adjacent-roles.md)
- [STAR and Project Deep Dives](./03-star-and-project-deep-dives.md)
- [Evidence-Based Resume Bullets](../01-portfolio-case-study-resume/02-evidence-based-resume-bullets.md)
