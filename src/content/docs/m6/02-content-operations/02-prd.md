---
title: "PRD: Marketing Studio"
row: M6-L2.3
rows:
  - M6-L2.1
  - M6-L2.3
---
**In one sentence:** The [Puffo](https://chat.puffo.ai) Marketing Studio MVP PRD (draft for engineering review, 27 August 2026) defines a single-client, local-first system where four agents produce HTML marketing assets that non-technical marketers edit and export without touching code.

> **Source document:** *Puffo Marketing Studio MVP Product Requirements Document*, Azure Partners. This page is a reading guide: what the PRD decides and what to notice. Read the original for the full requirements.

## What the PRD decides

| Section | Decision |
|---|---|
| Summary | One client, one Puffo Space, local-first. The editor runs on the client's computer via localhost or the local network. No SaaS, cloud database or public access. |
| Problem | Three frictions: marketers should not need developer tools; small edits should not need a model call; HTML to PPTX conversion degrades the design. |
| Goals | Multiple marketers, four agents, three asset types (Poster, Landing Page, Slides Deck), in-browser editing, HTML as the only editable master, autosave, manual publishing. |
| Non-goals | No PPTX, no PDF, no automatic publishing, no public access, no multi-tenant SaaS, no real-time co-editing, no free-form layout, no presenter notes, no approval role model, no RAG, no full version tree. |
| Users | Marketer (request, edit, export, mark complete) and developer/administrator (install, maintain, resolve failures). Access is limited by the local network plus an unguessable job URL. |
| Agents | Marketing Lead, Campaign Copywriter, Fact & Compliance Reviewer, Visual Designer. |
| Editor | Standalone browser tab, text editable on open, layout locked, font shrink within template limits then a warning, image and QR placeholders, a six-button toolbar, debounced autosave, single-editor lock with heartbeat. |
| Data model | One folder per job: `brief.md`, `material.html`, `review.md`, `state.json`, snapshots of the AI draft and the approved version, exports. |
| Acceptance | Twelve checks, including: the Reviewer blocks an incorrect course fact; a second session is read-only; the Poster PNG matches the browser preview; no PPTX or PDF is produced and nothing is published automatically. |

## Measurable success

The success metrics are numbers a tester can check: text edits render in under 200 ms locally; autosave completes within one second of the last edit and shows `Saving…`, `Saved` or `Save failed`; the PNG export matches the preview in typography, colour and layout; and the Reviewer blocks any asset with an unconfirmed fact or a hard compliance violation before it reaches the marketer.

## What to notice

**The non-goals list is longer than the goals list.** That is a sign of a disciplined MVP. Each non-goal is something a stakeholder would plausibly ask for, written down so nobody builds it by accident.

**One master format ends a whole class of bugs.** The decision that HTML is the only editable master (ADR-002) means the preview and the export come from the same file. There is no second copy to drift. Dropping PPTX removes a feature and also removes the conversion step that caused the visual defects.

**Architecture decisions are recorded in the PRD because they shape scope.** The five ADRs (standalone browser editor, HTML as sole master, local-first, locked layout, single editor) each come with a one-line rationale. They are product choices with technical consequences, so they are settled before engineering starts.

**The PRD says which decisions it is not making.** Section 16 lists engineering choices that do not block approval: the frontend stack, the HTML-to-PNG renderer, lock persistence, SVG upload policy, how Puffo opens local links, and how agent profiles sync into Puffo. This tells engineers exactly where their freedom begins.

**Failure states are requirements, not afterthoughts.** Section 12 covers a missing fact, an expired Claude login, the editor service being offline, autosave failure, unsupported uploads, export failure, missing fonts and stale locks. The recurring rule is never to report success that did not happen.

**The existing repository is kept, not replaced.** Course facts and compliance policies stay where they are. The PRD adds `agents/`, `puffo/`, `editor/` and `templates/` beside them and forbids duplicating the facts.

## Common misconceptions

- **"Local-first means unfinished."** It is a deliberate phase boundary (ADR-003). The generation and editing experience is validated before security, identity and hosting are added.
- **"Locking the layout is a limitation users will hate."** Locked layout protects brand consistency and removes most of the editor's complexity, while still covering the edits marketers make most often (ADR-004).
- **"A single-editor lock is primitive."** For local use by a small team, real-time collaboration and conflict merging would cost far more than they return (ADR-005).

## Typical interview questions

<details>
<summary>A stakeholder asks for PPTX export "just as an option". How would you use this PRD to answer?</summary>

Point to the problem statement and ADR-002. PPTX conversion was one of the three problems the product exists to solve, because it degraded the design. Adding it as an option brings back a second master format and the drift between them. If the need is real, it belongs in a later phase with its own fidelity requirement.

</details>

<details>
<summary>Why does the save model create snapshots only at the AI draft and at final approval?</summary>

Because a version per keystroke creates noise nobody will read and fills Git with meaningless commits. The two snapshots that matter are what the AI produced and what the human approved. The current draft is saved in place, and undo history only needs to last for the browser session.

</details>

<details>
<summary>Which section of this PRD would you show the engineers first, and why?</summary>

The non-goals and Section 16 together. The non-goals tell them what not to build. Section 16 tells them which technical decisions are theirs to make. With those two, the rest of the requirements read as constraints within a clear space.

</details>

## Related

- [Case Overview: Content Operations](./01-case-overview.md)
- [Technical Design: Marketing Studio](./03-technical-design.md)

*Syllabus rows: M6-L2.1, M6-L2.3*
