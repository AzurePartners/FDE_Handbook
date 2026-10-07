---
title: "PRD: Provider Research"
row: M6-L3.3
rows:
  - M6-L3.1
  - M6-L3.2
  - M6-L3.3
---
**In one sentence:** The Provider Research PRD (draft, 15 September 2026) defines a five-agent [Puffo](https://chat.puffo.ai) system that produces a defensible list of US urologists, with a definition document, a contact sheet and a build record, and with no ability to contact anyone.

> **Source document:** *Provider Research: What We Are Building*, Azure Partners. This page is a reading guide: what the PRD decides and what to notice. Read the original for the full requirements.

## What the PRD decides

| Section | Decision |
|---|---|
| What we build | A defensible provider list. Agents define and challenge; software builds; the build stops if its checks fail. Two uses: build a new list, or check an old one for changes. |
| Problem | Lists are sold as an answer with no reasoning: unexplained membership, undefendable counts, late compliance, unexplained refresh differences. |
| Users | Commercial lead (pays), compliance officer (can veto), analyst (runs the build), executive (asks whether it is complete). |
| Rules | Ship the reasoning; records are not people; code does the arithmetic; reproduce or it did not happen; something independent attacks the answer; banned fields are absent, not filtered; approve before spending; never contact anyone. |
| Scope | One specialty (urology), one country (US), one build. No segmentation, scoring or do-not-contact management. |
| Agents | Research Lead, Source Scout, Taxonomy Specialist, Challenger, Documentation Writer. |
| Stopping checks | Required fields, no duplicates, deactivated records removed and counted, splits reconcile, cross-checks agree, coverage minimum, enrichment range, no leftover template text. |
| Thresholds | Coverage: at least one record in all 50 states plus Washington DC, or a stated reason. Enrichment: a declared expected range, proposed at 55 to 85 percent for practice-group data, fixed after the first build. |
| Not building | Any contact capability, patient data, clinical judgement, non-US sources, scraped commercial sources, a hosted product, several builds or customers at once. |

## What to notice

**The PRD asks whether the product is worth building before saying how.** Section 5 separates what the team knows from what it is guessing, lists the conversations needed before committing (three current buyers, one compliance officer, one paying pilot), and names the biggest risk plainly: buyers might just want the most rows for the lowest price. This is discovery written into the requirements.

**The compliance officer is treated as the real customer.** "If this person will not approve our output, we have no product." The headline pilot measure follows from it: a compliance officer approves a delivered list for a real campaign without demanding outside verification.

**The Challenger is designed against false alarms.** It gets the request and the official code list but not the Taxonomy Specialist's reasoning, so it cannot simply agree. Every problem needs reproducible evidence, must survive a second independent look, and is dropped when uncertain. The PRD states that chasing false alarms is the expensive mistake here.

**Words are defined and then protected.** "Verified" means every stopping check passed, a full Challenger round found nothing, and the definition document is complete. The word is not allowed anywhere else for anything weaker.

**Safe defaults are the rule.** Any channel the team did not specifically check is "not allowed", never "probably fine". The contact sheet says it does not replace the buyer's own lawyer.

**Absence beats filtering.** Banned contact fields are never written into the marketing file, and a check after writing confirms they are absent. A filter can be switched off; a missing column cannot.

**Success is split in two.** "Must always be true" lists properties proven by tests (every stopping check stops the build when deliberately broken, byte-for-byte reproducibility). "We find out in the pilot" lists what only a real buyer can tell you (compliance approval, under two working days, under four hours of human time, 99 percent identity accuracy on a sample of 100 rows).

**Open questions are business questions.** Section 16 lists who buys, how it is priced, whether the contact sheet is advice or a contractual commitment, data ownership and retention. Technical choices are left to engineering in 16.1.

## Common misconceptions

- **"A challenger that finds more problems is better."** A challenger that raises unsupported problems wastes the team's time. Evidence and a second look are the filter.
- **"Check mode should just replace the old list."** It reports what changed and why, and never replaces a delivered dataset without approval.
- **"The contact sheet is legal advice."** It is guidance for the stated use, and says so.

## Typical interview questions

<details>
<summary>Why does the Challenger not see the Taxonomy Specialist's reasoning?</summary>

A reviewer who reads the reasoning first tends to accept its framing and agree with it. Giving the Challenger only the original request and the official code list forces it to form its own view, so any disagreement is real signal rather than an echo.

</details>

<details>
<summary>The PRD requires the expected record count before building. Why?</summary>

So that a wildly different result is noticed as a problem instead of being accepted as the answer. Without an expectation, any number the build produces looks plausible.

</details>

<details>
<summary>Which single result in the pilot would tell you the product has failed?</summary>

A compliance officer refusing to approve a delivered list for a real campaign without outside verification. The whole positioning rests on defensibility, and the compliance officer is the person who decides whether it is defensible.

</details>

## Related

- [Case Overview: Provider Research](./01-case-overview.md)
- [Technical Design: Provider Research](./03-technical-design.md)
- [PRD: Trading Desk](../04-trading-desk/03-prd.md), which applies the same "code owns every number" rule

*Syllabus rows: M6-L3.1, M6-L3.2, M6-L3.3*
