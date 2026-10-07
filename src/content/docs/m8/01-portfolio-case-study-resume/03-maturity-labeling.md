---
title: Maturity Labeling
row: M8-L1.3
---
**In one sentence:** Every project you present carries one of four labels — Demo, MVP, Pilot, or Production — and presenting work at a higher label than it earned is the single fastest way to lose an interviewer's trust.

## What it is

The maturity ladder is defined in [Module 4, Lesson 5 (M4-L5.4)](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md); this page only applies it to how you label your own work. In that definition, a **Demo** shows the idea works once, on a happy path, with minimal engineering. An **MVP** is the smallest version that delivers real value to real users, with basic reliability and error handling. A **Pilot** is a limited real-world rollout with real users and success criteria, which needs observability, a security review, support, and a go/no-go plan. **Production** is the full rollout and needs the whole package: reliability, scaling, monitoring, incident response, governance, and maintenance. The label is determined by evidence, not by how polished the UI looks.

## Why an FDE needs this

FDEs live at the boundary between these stages: the job is largely about moving a customer from Demo to Pilot to Production and knowing what each step requires. An interviewer who hears "we deployed it to production" will ask about scale, incident response, and who owns it now. If the honest answer is "it was a demo," the rest of the interview is about credibility rather than skill. Conversely, a candidate who says "this reached pilot with six users for three weeks against written success criteria; it is not production because there is no on-call rotation and no governance owner" has just demonstrated the exact judgment the role requires.

## Key concepts

### The ladder and its evidence

| Label | Minimum evidence (per M4-L5.4) | What the next rung adds, so still missing here |
|---|---|---|
| Demo | Ran once on prepared inputs; a recording or live walkthrough | Real users getting real value, error handling, anyone else able to run it |
| MVP | Real users get real value on the core path; basic reliability and error handling; another person can run it from instructions | Observability, security review, support, written success criteria and a go/no-go plan |
| Pilot | Limited real rollout: real users, real workflow, defined duration, success criteria, observability, security review, support, go/no-go decision at the end | Scale, monitoring at full-rollout volume, incident response and on-call, governance, a maintenance owner |
| Production | Full rollout with the whole package: reliability, scaling, monitoring, incident response, governance, maintenance | Nothing by definition; but be ready to name what is still fragile |

### Label in the title, not the footnote

Put the label where the reader sees it first: "Support assistant (Pilot, 6 users, 3 weeks)". Hiding it in a later paragraph reads as an attempt to let the reader assume more.

### "Production-grade" is not a label

"Production-grade code" describes code quality, not what the system has been through. Use it only if you can also say where it ran and for whom.

### Downgrading is allowed

If something was called "production" internally but had no monitoring and one user, label it Pilot or MVP in your portfolio. You are describing evidence, not repeating the company's wording. The same applies upward: if your "pilot" had real users but no security review, no observability and no success criteria, it was an MVP with users, and the honest label is MVP.

## Common misconceptions

- **"A deployed URL means production."** A public URL is hosting, not production. Production is about full rollout, who depends on it, and what happens when it breaks.
- **"Labeling honestly makes the project look small."** It makes you look reliable, which is the trait the loop is screening for. A well-run pilot is an excellent FDE story.
- **"Only the capstone needs a label."** Every artifact, including the three smaller ones, carries a label. Consistency across the portfolio is itself a signal.

## Typical interview questions

<details>
<summary>Was this in production?</summary>

Answer with the label and its evidence: "It reached pilot. After the customer's security review, six agents used it on live tickets for three weeks against written success criteria, with traces and a dashboard we watched daily. It did not go to production because the full-rollout package was not there: no on-call rotation, no incident process, and no governance owner on the customer side." Then, if useful, say what production would have required.

</details>

<details>
<summary>What would it take to move this from pilot to production?</summary>

Name the gaps the Production rung adds: scaling for the full user base, monitoring and alerting at that volume, an incident-response process and on-call rotation, governance (who approves changes, who audits), a maintenance owner on the customer side, and a runbook. Order them by risk. This is a question about the FDE lifecycle, not about the project.

</details>

<details>
<summary>What broke during the pilot?</summary>

Have at least one concrete incident and what you changed. "Nothing broke" for a pilot is not credible.

</details>

## Learn more

- Handbook: [Demo → MVP → Pilot → Production Maturity Ladder (M4-L5.4)](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md) — the definition this page applies
- Article: [Generative AI Pilot Metrics](https://agility-at-scale.com/ai/generative/pilot-implementation-with-real-metrics/) (Agility at Scale) — go/no-go gates between stages, vanity vs. production KPIs
- Article: [Building a Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) (Chip Huyen) — what gets added at each stage of maturity
- Chapter: [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) (Google SRE) — what monitoring at production scale means

## Related

- [Evidence-Based Resume Bullets](./02-evidence-based-resume-bullets.md)
- [Portfolio Composition](./04-portfolio-composition.md)
- [MVP-First Design Evolution](../02-coding-debugging-system-design/03-mvp-first-design-evolution.md)
