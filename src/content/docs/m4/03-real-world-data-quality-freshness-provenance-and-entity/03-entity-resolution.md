---
title: Entity Resolution
row: M4-L3.3
---
**In one sentence:** Entity resolution is figuring out when records in different systems refer to the same real-world thing, the same person, company, or product, and aligning their IDs, using matching rules and merge policies, so data can be joined reliably across systems.

## What it is

The same customer might be "Acme Corp" in the CRM, "ACME CORPORATION" in billing, and "acme-inc" in the support tool, with different IDs in each. **Entity resolution** is deciding these are the same entity and linking them. It combines **matching** (comparing fields, name, email, domain, address, exactly or fuzzily, to judge whether two records are the same) with **merge policies** (when matched, which fields win, and whether to merge or just cross-reference). It's foundational to any integration that joins data across systems.

## Why an FDE needs this

Enterprise data is siloed, and almost any useful AI feature needs data joined across systems, which requires knowing which records refer to the same entity. Get it wrong and you either miss connections (treating one customer as several) or wrongly merge distinct entities (a serious data-integrity error). An FDE has to recognize when a task needs entity resolution and apply at least basic matching and a sane merge policy, with human confirmation for uncertain matches.

## Key concepts

- **Identifier alignment:** map differing IDs for the same entity across systems.
- **Matching:** exact keys where available (email, tax ID); fuzzy matching (name/address similarity) where not.
- **Merge policy:** on a match, which source's fields take precedence; merge vs cross-reference.
- **Confidence & human review:** uncertain matches get flagged, not auto-merged.
- **Avoid false merges:** wrongly combining two real entities is worse than missing a match.

## Common misconceptions

- **"Names match, so it's the same entity."** Names are unreliable; use stable keys where possible and treat fuzzy matches as probabilistic.
- **"Auto-merge everything that looks similar."** False merges corrupt data; low-confidence matches need human confirmation.
- **"IDs are consistent across systems."** They rarely are; that's exactly why entity resolution is needed.

## Typical interview questions

<details>
<summary>What is entity resolution and why is it needed?</summary>

It's determining when records in different systems refer to the same real-world entity, person, company, product, and aligning their identifiers so data can be joined. It's needed because enterprise data is siloed with inconsistent IDs, and almost any cross-system feature has to know which records are the same entity before it can combine them.

</details>

<details>
<summary>How do you avoid wrongly merging two different entities?</summary>

Prefer matching on stable unique keys (email, tax ID) over names; treat fuzzy matches as probabilistic with a confidence score; auto-merge only high-confidence matches; and route uncertain ones to human confirmation. A missed match is recoverable, but a false merge corrupts data and is harder to undo.

</details>

## Learn more

- Article: [Entity Resolution](https://dev.to/michaelnocito/entity-resolution-one-real-thing-many-messy-names-1oo2) (DEV; 5-step match/merge walkthrough)
- Docs: [Splink](https://moj-analytical-services.github.io/splink/) (open-source record linkage; probabilistic matching, blocking)

## Related

- [Dirty Data](./01-dirty-data-missing-duplicate-stale-and-conflicting.md)
- [Worked Example: Provider-Directory Data Quality](./04-worked-example-provider-directory-data-quality.md)
