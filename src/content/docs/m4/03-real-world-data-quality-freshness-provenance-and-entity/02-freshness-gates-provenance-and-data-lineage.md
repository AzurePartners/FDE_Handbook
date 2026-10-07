---
title: Freshness Gates, Provenance & Data Lineage
row: M4-L3.2
---
**In one sentence:** Freshness gates reject or flag data that's too old to trust, provenance records where each value came from, and lineage traces how data moved and transformed, so every conclusion the system produces can be traced back to a trustworthy source.

## What it is

**Freshness** is how current a piece of data is; a **freshness gate** is a rule that treats data older than some threshold as suspect, refuse to act on it, warn, or refresh it. **Provenance** is the record of where a value originated (which system, which record, when). **Lineage** is the broader trace of how data flowed and was transformed from source to output. Together they answer "can I trust this number, and where did it come from?" and let you show the customer the source behind any conclusion.

## Why an FDE needs this

In a business, acting on stale or unsourced data causes real errors, and "the AI said so" is not an acceptable justification. Freshness gates prevent acting on outdated values; provenance and lineage let you and the customer audit and trust outputs, and debug when something's wrong by tracing it to its source. In regulated settings, being able to show data lineage is often required, not optional.

## Key concepts

- **Freshness gate:** threshold on data age; too old → refuse, warn, or refresh.
- **Timestamps:** capture when data was produced and last updated.
- **Provenance:** the source of each value (system, record, time).
- **Lineage:** the full path and transformations from source to output.
- **Traceability:** every conclusion links back to its sources.

## Common misconceptions

- **"If we have the data, it's current."** Data has an age; without a freshness check you may act on months-old values.
- **"Provenance is bureaucratic overhead."** It's what lets you trust, audit, and debug outputs, and is often a compliance requirement.
- **"Lineage only matters for analytics."** For AI outputs, tracing a conclusion to its source is what makes it defensible.

## Typical interview questions

<details>
<summary>What is a freshness gate and when would you use one?</summary>

A rule that treats data older than a set threshold as untrustworthy, refusing to act, warning, or triggering a refresh. Use it wherever acting on stale data is harmful, for example not making a recommendation off a status that hasn't been updated in months, so the system fails safe instead of acting on outdated values.

</details>

<details>
<summary>Why do provenance and lineage matter for an AI feature?</summary>

Because a conclusion a business will act on needs to be trustworthy and auditable. Provenance records where each value came from and lineage traces how it flowed and transformed, so you can show the customer the source behind an output, debug errors by tracing them back, and meet compliance requirements for traceability.

</details>

## Learn more

- Article: [Understanding data lineage](https://www.datadoghq.com/blog/data-lineage/) (Datadog; lineage, provenance)
- Docs: [dbt sources & source freshness](https://docs.getdbt.com/docs/build/sources) (a concrete freshness-gate pattern)

## Related

- [Dirty Data](./01-dirty-data-missing-duplicate-stale-and-conflicting.md)
- [Version Records & Reproducing Incident State](../05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)
