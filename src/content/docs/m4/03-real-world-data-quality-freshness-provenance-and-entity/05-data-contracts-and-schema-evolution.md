---
title: Data Contracts & Schema Evolution
row: M4-L3.5
---
**In one sentence:** A data contract is an explicit, validated agreement on the field names, types, and meaning of data exchanged between systems, and schema evolution is changing that shape over time without silently breaking the systems that depend on it.

## What it is

The core idea of a **data contract**, an explicit, validated schema both sides agree on and check on ingest, is covered in Module 1 ([Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md)). This page focuses on the harder enterprise problem: **schema evolution** is the reality that shapes change: fields get added, renamed, retyped, removed. Backward-compatible changes (adding an optional field) break nothing; breaking changes (rename, remove, retype) require versioning and coordination. Validating incoming data against the contract turns a silent break into a loud, early error.

## Why an FDE needs this

Integrations rot quietly: a customer's team renames a field or changes a code's type, and your feature starts returning wrong or empty results with no error. Treating the interface as a validated contract catches that immediately and gives you the standing to ask the customer's team to coordinate changes rather than surprise you.

## Key concepts

- **Schema:** declared structure and types (JSON Schema, Avro, table DDL).
- **Validation on ingest:** reject or quarantine data that doesn't match; fail loud.
- **Backward-compatible vs breaking:** adding optional fields is safe; rename/remove/retype breaks consumers.
- **Versioning:** carry a schema version so consumers can adapt across changes.
- **Coordinate breaking changes:** migrate with a window, don't change under consumers.

```json
{"customer_id":"string (required)", "email":"string (required)",
 "status":"enum: active|churned (required)", "mrr":"number (optional)"}
```

## Common misconceptions

- **"If it parsed as JSON, it's valid."** Parsing checks syntax, not that fields exist, have the right type, or mean what you expect.
- **"Any schema change is fine."** Adding optional fields is safe; renaming/removing/retyping is breaking and needs versioning.
- **"Contracts are bureaucracy."** They convert silent, expensive data corruption into a cheap, immediate validation error.

## Typical interview questions

<details>
<summary>What is a data contract and why does it matter?</summary>

An explicit, validated agreement on the names, types, and meaning of exchanged data. It matters because integrations otherwise rely on unstated assumptions that break silently when the upstream changes; validating against the contract turns that into an early, clear failure and creates a basis to coordinate changes.

</details>

<details>
<summary>How do you evolve a schema without breaking consumers?</summary>

Prefer backward-compatible changes, add optional fields rather than renaming or removing. For breaking changes, version the schema, support old and new in parallel during a migration window, and coordinate the cutover with consumers instead of changing it under them.

</details>

## Learn more

- Spec: [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step) (declare field names/types to validate against)
- Docs: [dbt sources & source freshness](https://docs.getdbt.com/docs/build/sources) (adjacent freshness-gate pattern for upstream change)

## Related

- [Module 1 → Schema and Data Contracts](../../m1/03-apis-data-integration/10-schema-and-data-contracts.md) (the core idea)
- [Designing a Minimal Connector Contract](../01-external-apis-mcp-and-connector-design/04-designing-a-minimal-connector-contract.md)
- [Dirty Data](./01-dirty-data-missing-duplicate-stale-and-conflicting.md)
