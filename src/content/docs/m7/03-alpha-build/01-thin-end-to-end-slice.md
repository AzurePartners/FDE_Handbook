---
title: Thin End-to-End Slice
row: M7-L3.1
---
**In one sentence:** A thin end-to-end slice is one narrow question that travels the whole system, from user input to final answer, before you build anything else.

## What it is

Alpha build starts after the MVP is frozen. The temptation is to build layer by layer: finish ingestion, then retrieval, then the prompt, then the interface. A slice goes the other way. You pick one narrow scenario and make every layer handle it, even crudely.

For the Course Support Assistant, the slice is: a learner types "What is the refund window for the Data Analysis Bootcamp?", the system retrieves the refund policy paragraph, the model answers with a citation, and the answer shows on screen. Hard-coded values, a single document and an ugly interface are all fine.

This is the Shape Up idea of getting one piece done: finished work you can run beats many half-built parts. The demo-first reasoning is in [Demo-Driven Development](../../m5/06-demo-feedback-and-change-management/01-demo-driven-development.md) (M5).

## Why an FDE needs this

At a client, an unrunnable system hides every integration problem until late. A team that builds ingestion for two weeks may then find the policy PDFs are scanned images and the parser returns nothing. A slice surfaces that on day two, while changing course is still cheap. It also gives the client something real to react to.

## Key concepts

Choose the slice by three rules. It must touch every component in your architecture map. It must be a case the client truly cares about, so a normal question and not an exotic one. It must be small enough to finish in a few days. If you chose a workflow or agent design, the reasoning for it is in [Workflows vs Agents](../../m3/15-agent-architectures/01-workflows-vs-agents.md) (M3). How a slice fits the maturity ladder is in [Demo to MVP to Pilot to Production](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md) (M4).

### What you produce

Copy this slice card into your repo:

| Field | Example |
|---|---|
| Slice question | "What is the refund window for the Data Analysis Bootcamp?" |
| Input | Text typed in the chat box |
| Components touched | Policy loader, retriever, prompt, model call, answer view |
| Stubbed on purpose | Login, other courses, escalation, styling |
| Expected output | Correct refund window plus the policy section it came from |
| Date it first ran end to end | (fill in) |

### Pass bar

- The slice runs from input to final output with no manual step in between.
- The output matches the expected output on the card.
- Every stubbed item is written down, so nobody mistakes a stub for a finished feature.
- Nothing outside the frozen MVP was added.

## Common misconceptions

- **"A slice is a prototype I will throw away."** The slice is the first thread of the real system. Later work thickens it. Throwaway code is a separate mistake.
- **"I should finish the data pipeline first because everything depends on it."** Perfect data work with no running path hides the real problems. Load one document and prove the path.
- **"Thin means low quality."** Thin means narrow in scope. The one path should still be correct and traceable.

## Typical interview questions

<details>
<summary>Why did you build one slice before the full feature set?</summary>

Because it exposes integration risk early. I found the parser problem on day two instead of week three, and I had a runnable path to show the client. Breadth came after the path worked.

</details>

<details>
<summary>How did you pick which slice to build first?</summary>

I chose the most common question the client cares about that touches every component. For the Course Support Assistant that was a normal refund-policy question, not an edge case.

</details>

<details>
<summary>What did you deliberately stub, and how did you track it?</summary>

I stubbed login, other courses and escalation. They sat in the "stubbed on purpose" row of the slice card so they were visible debts, not hidden gaps.

</details>

## Learn more

- Book chapter: [Get One Piece Done](https://basecamp.com/shapeup/3.2-chapter-11) (Shape Up, Basecamp, free online).

## Related

- [Reproducible Setup](./02-reproducible-setup.md)
- [MVP Freeze and Change Control](../02-architecture-mvp-freeze/04-mvp-freeze-and-change-control.md)
- [Solution Architecture Map](../02-architecture-mvp-freeze/02-solution-architecture-map.md)
- [Workflows vs Agents](../../m3/15-agent-architectures/01-workflows-vs-agents.md) (M3)
