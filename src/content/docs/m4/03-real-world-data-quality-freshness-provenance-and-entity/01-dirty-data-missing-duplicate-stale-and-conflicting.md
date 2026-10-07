---
title: "Dirty Data: Missing, Duplicate, Stale & Conflicting"
row: M4-L3.1
---
**In one sentence:** Real customer data is missing values, duplicates, stale records, conflicting entries, and inconsistent formats, which is fundamentally different from the clean sample data a demo runs on, and assuming otherwise is how solutions break in production.

## What it is

Demo data is curated; production data is not. Real data has **missing** fields (nulls, blanks, "N/A"), **duplicates** (the same customer entered twice), **stale** records (a status that changed months ago but was never updated), **conflicting** values (two systems disagree), and **dirty** formatting (dates in five formats, names capitalized differently). None of this is exceptional, it's the normal state of enterprise data accumulated over years by many people and systems. A solution has to expect and handle it, not assume clean inputs.

## Why an FDE needs this

The classic failure: build and demo on clean sample data, then meet the customer's real data and watch the solution produce wrong or empty results. An AI feature is especially vulnerable, garbage in produces confident garbage out. An FDE profiles the real data early, designs for its messiness (validation, cleaning, defaults, flagging), and sets expectations that data quality work is part of the job, not a surprise.

## Key concepts

- **Missing:** nulls, blanks, placeholders; decide default vs skip vs flag.
- **Duplicate:** same entity multiple times; needs dedup (see entity resolution).
- **Stale:** outdated values; needs freshness checks.
- **Conflicting:** sources disagree; needs a resolution/precedence rule.
- **Dirty formatting:** inconsistent types/formats; needs normalization.
- **Profile early:** inspect real data before designing, not after.

## Common misconceptions

- **"The real data will look like the samples."** It's messier in every dimension; validate against real data early.
- **"The model will just handle bad data."** It will confidently produce wrong output from bad input; clean and validate first.
- **"Data cleaning is a one-time step."** It's ongoing; new bad data keeps arriving, so handling must be built in.

## Typical interview questions

<details>
<summary>How is real customer data different from demo data, and why does it matter?</summary>

Real data has missing, duplicate, stale, conflicting, and inconsistently formatted values accumulated over years; demo data is curated and clean. It matters because a solution built and shown on clean data produces wrong or empty results on real data, and an AI feature turns bad input into confident wrong output. So I profile real data early and build validation and cleaning in.

</details>

<details>
<summary>How do you handle conflicting values from two systems?</summary>

Define a resolution rule based on which is the system of record for that field, or which is fresher, or a business precedence, rather than picking arbitrarily. Where it can't be resolved automatically and the stakes are high, flag it for human confirmation instead of silently guessing.

</details>

## Learn more

- Article: [Entity Resolution: One Real Thing, Many Messy Names](https://dev.to/michaelnocito/entity-resolution-one-real-thing-many-messy-names-1oo2) (DEV; real messy data)
- Reference: [NPPES NPI Registry API](https://npiregistry.cms.hhs.gov/registry/help-api) (a real public dataset to practice on)

## Related

- [Freshness Gates, Provenance & Lineage](./02-freshness-gates-provenance-and-data-lineage.md)
- [Entity Resolution](./03-entity-resolution.md)
