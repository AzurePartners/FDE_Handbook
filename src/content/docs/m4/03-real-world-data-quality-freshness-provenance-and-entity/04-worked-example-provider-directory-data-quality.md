---
title: "Worked Example: Provider-Directory Data Quality"
row: M4-L3.4
---
**In one sentence:** A healthcare provider directory, names, specialties, and contact details for doctors, shows every real-world data problem at once, and walking through cleaning it (deduplication, specialty validation, contact freshness, human confirmation) makes the abstract data-quality concepts concrete.

## What it is

A **provider directory** lists healthcare providers with their specialties and contact info. It's a canonical messy dataset: the same doctor appears in multiple systems (**duplicates**), specialties are entered inconsistently or wrongly (**validation**), phone numbers and addresses go **stale** as people move, and records **conflict** across sources. Cleaning it means: **deduplicate** providers via entity resolution, **validate** specialties against a controlled list, check **contact freshness** against a threshold, and route uncertain cases to **human confirmation**. It's a worked example that ties together Lesson 3's concepts on a realistic task.

## Why an FDE needs this

Healthcare and finance are core FDE domains, and a directory-cleaning task is a realistic first engagement. Seeing how the concepts combine, entity resolution for dedup, freshness gates for contacts, validation for specialties, HITL for uncertain merges, prepares you to handle real data cleanup rather than treating each concept in isolation. It also shows how much of "AI" work is actually careful data engineering.

## Key concepts

- **Deduplication:** entity-resolve providers appearing across systems into one record.
- **Specialty validation:** check against a controlled vocabulary; flag invalid/ambiguous entries.
- **Contact freshness:** apply a freshness gate to phone/address; refresh or flag stale ones.
- **Conflict resolution:** pick a source-of-truth per field when systems disagree.
- **Human confirmation:** low-confidence merges and unresolved conflicts go to a person.

```
Providers (3 systems) -> match on NPI/name+address -> dedup
  -> validate specialty vs taxonomy -> flag unknowns
  -> check contact age vs 12-mo gate -> flag stale
  -> conflicts / low-confidence -> human review queue
```

## Common misconceptions

- **"A directory is simple reference data."** It concentrates duplicates, staleness, conflicts, and validation problems all at once.
- **"Automate the whole cleanup."** Uncertain merges and conflicts need human confirmation, especially in healthcare where errors are costly.
- **"Validation means checking format."** It also means checking values against a controlled vocabulary and reality, not just shape.

## Typical interview questions

<details>
<summary>Walk through cleaning a provider directory.</summary>

Deduplicate providers across the source systems via entity resolution on stable keys (like an NPI) plus name/address matching; validate each specialty against a controlled taxonomy and flag unknowns; apply a freshness gate to contact details and flag or refresh stale ones; resolve field conflicts using a per-field source of truth; and send low-confidence merges and unresolved conflicts to a human review queue rather than guessing.

</details>

<details>
<summary>Where does human-in-the-loop belong in this task?</summary>

On the uncertain, high-stakes decisions, low-confidence entity matches and unresolved conflicts, where an automated wrong answer (merging two different doctors, or listing a wrong specialty) causes real harm. High-confidence, low-risk cleanup can be automated; the ambiguous cases get human confirmation.

</details>

## Learn more

- Reference: [NPPES NPI Registry API](https://npiregistry.cms.hhs.gov/registry/help-api) (dedupe by NPI, taxonomy, last-updated dates)
- Note: NPI data is self-reported directory data, not a credentialing verdict — keep a human-confirmation step.

## Related

- [Entity Resolution](./03-entity-resolution.md)
- [PII/PHI Handling & Compliance Basics](./06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)
