---
title: "Technical Design: Marketing Studio"
row: M6-L2.2
rows:
  - M6-L2.2
  - M6-L2.3
---
**In one sentence:** A reference design for a multi-agent content studio: facts in owned files, copy and design as typed hand-offs, HTML built from templates as the only master, an independent reviewer whose approval is bound to the exact artifact, and interlocks that code enforces rather than agents remember.

> **Teaching reference.** This design follows the handbook's nine-part skeleton and satisfies the [Marketing Studio PRD](./02-prd.md). Section 9 describes how the current build relates to it.

## 1. Design principle

**Files own the facts, templates own the layout, code owns the gates; models write, judge and choose.** An agent may propose anything. Nothing reaches a marketer until code has checked the file that proves each step.

## 2. Architecture and ownership

```text
Marketer ──#requests──► Lead ──#studio-floor──► Copywriter → Reviewer → Designer
                          │                                           │
              DM (escalations)                              job command: advance
                          ▼                                           ▼
                      Operator                              outputs/<job-id>/ (job store)
                                                                      │
Marketer ◄── verified link ◄── link issuer ◄── Editor service ◄── Assembler + Audit
                                                     │
                                            headless browser → PNG (export gate)
```

| Component | Owns |
|---|---|
| Fact files (`_meta/`) | Every course and campaign fact, one owner and one location per fact, with a change log |
| Skills | How each kind of copy is written and checked |
| Agent briefs | Each agent's job, boundaries and write scope |
| Job command | The state machine: transitions, preconditions, events |
| Assembler | Turning a template and `content.json` into `material.html`; deck composition from an archetype catalogue |
| Audit | Real-browser measurement of overflow, collisions and budgets |
| Editor service | Locks, autosave, uploads, export; the marketer's only surface |
| Link issuer | Printing a link only for a job that is approved, built, audited and served |
| Approvals log | Every operator decision, append-only |

## 3. Trust boundaries and gates

- **Interlocks are code.** The link issuer refuses unless the review record says `PASS`, its hashes match the current `content.json` and the text of `material.html`, the audit passed, and the editor answers its health check. The block counter lives in the job state; a third block escalates automatically.
- **Approval is bound to the artifact.** The reviewer writes `{verdict, content_hash, html_text_hash, channel, reviewer, time}`. Any later change to either file voids the verdict and returns the job to review.
- **An export gate re-checks after human edits.** Before a PNG is produced, code runs the hard-block lexicon over the current text and diffs fact-bearing regions (price, date, CTA) against the reviewed values; a change flags the job for re-review instead of exporting.
- **Least privilege per agent.** Writes go through narrow tools: the copywriter can write `content.json` and notes, the reviewer only the review record, the designer only asset files, the Lead only the brief, status and approvals log. No agent bypasses permission checks or has full file-system access.
- **The operator gate.** Missing facts, repeated blocks, hard-block overrides, service failures and scope changes go to the operator in one short message with lettered options; the decision is logged.

## 4. State and data

- **Job state** moves forward only: intake, briefed, copy-draft, review, design, ready, editing, complete, archived, with `BLOCKED` returning to copy-draft. The job command checks the file that proves each transition before writing it, and appends an event.
- **One master.** `material.html` is the only editable file; `state.json` holds lock, status, revision and token and never a copy of content. Snapshots exist at the AI draft and at human completion only.
- **Facts change in one place.** A fact edit updates its file and the change log, which names the outputs it makes stale.
- **Job folders are not committed;** shipped assets are promoted to an examples library.

## 5. Independent check

- The reviewer runs on a stronger model than the producers, reads the files rather than any summary, and compares every fact character by character with its source file.
- A deterministic lexicon pass runs before the reviewer, so hard-block phrases never depend on model judgement.
- The reviewer never edits; it lists required corrections and a verdict, and the copywriter fixes.
- The reviewer's inputs exclude the copywriter's rationale, so it judges the asset, not the argument for it.

## 6. Failure handling and idempotency

| Failure | Behaviour |
|---|---|
| Fact in no file | Field marked `[NEEDS CONFIRMATION]`; operator asked once; answer recorded in the brief and followed by a file edit |
| Editor down | No link issued; the Lead reports the service state with recovery steps |
| Export fails | HTML draft kept; retry; second failure escalates |
| Stale lock | Lapses after a timeout; the waiting session becomes editable |
| Repeated wake or duplicate request | Job ID is minted once; transitions are idempotent |
| Usage limit or expired login | Work stops with an actionable message; no false success |

## 7. Evaluation and testing

- **Template audit** in a real browser on every template change and every built asset.
- **Editor self-test** against the live service: tokens, locks, saves, uploads, export fidelity.
- **Reviewer evaluation:** planted wrong prices, dates and forbidden phrases, plus clean cases, to measure catch rate and false-alarm rate per tier.
- **Acceptance tests** map one to one to the PRD's twelve criteria, including a corrupted fact that must be blocked and a second session that must be read-only.

## 8. Operations

- **Isolation by configuration:** each roster in its own space; a readiness check verifies every agent's space and channel membership and that each runtime profile matches its brief by hash.
- **Cost:** producers on a mid-tier model, the reviewer on the strongest; a cap on turns per wake and on blocks per job.
- **Observability:** the event log per job, the approvals log, and a daily summary of jobs by state.
- **Rule consistency:** every file an agent reads is treated as prompt; a check fails when any of them contradicts an architecture decision.

## 9. The current build

The current build has the four agents on [Puffo](https://chat.puffo.ai), the template library and assembler, the real-browser audit, the local editor with its self-test, and the append-only approvals log. Its interlocks and state machine are written in the agents' briefs rather than in a job command, approvals are not yet bound to content hashes, there is no export gate after human edits, and agents run with broad file permissions. Sections 3 to 5 describe the design those gaps close.

## Typical interview questions

<details>
<summary>Where should the "no PASS, no link" rule live, and why?</summary>

In the link issuer, as a check that runs every time a link is requested. A rule in an agent's brief holds only while the model follows it; a check in code holds every time. Bind it to hashes of the reviewed files so that "PASS" means "PASS for this exact asset".

</details>

<details>
<summary>A marketer edits a price in the editor after the review. What happens?</summary>

The export gate diffs the fact-bearing regions against the reviewed values, finds the change, and refuses the export until the reviewer has looked again. The marketer sees which region changed and why it needs review.

</details>

## Related

- [PRD: Marketing Studio](./02-prd.md)
- [Case Overview: Content Operations](./01-case-overview.md)
- [Technical Design: Provider Research](../03-provider-research/03-technical-design.md), the next rung

*Syllabus rows: M6-L2.2, M6-L2.3*
