---
title: Schema and Data Contracts
row: M1-L3.2
---
**In one sentence:** A schema is the structure two systems agree to use for a piece of data, and that agreement is a contract, even when nobody wrote it down.

## What it is

When two systems exchange data, they implicitly agree on a shape: which fields exist, what each means, what type it is, what unit it is measured in, and what happens when a value is missing. That agreement is a contract. Two systems can both have a field called "customer" and mean different things, one the person who pays the bill, the other the person who uses the product. Neither is wrong; they simply never agreed on a definition.

A contract becomes visible the moment it breaks. If a weather API silently changes its temperature field from Celsius to Fahrenheit, every downstream calculation that assumed Celsius is now wrong, and nothing throws an error, because 29.4 is a valid number either way. The bug shows up as a wrong answer, not a crash, far harder to catch.

## Why an FDE needs this

Most integration bugs an FDE deals with are not crashes, they are quiet mismatches: a field renamed between versions, a currency assumed but never confirmed, a null treated as zero. Writing down the contract explicitly turns an invisible assumption into something both sides can check.

## Key concepts

### Field mapping

Field mapping is the explicit list of "this field on system A becomes this field on system B," for example combining Open-Meteo and Frankfurter into one internal `Briefing` record:

| Source field | Source system | Target field | Notes |
|---|---|---|---|
| `current_weather.temperature` | Open-Meteo | `temperature_c` | Celsius, confirmed in docs |
| `rates.JPY` | Frankfurter | `exchange_rate` | Relative to `base` currency |

Writing this table before writing code is what turns a guess into a contract.

### Types and units

A field's type has to match on both sides: the string `"19.99"` is not the number `19.99` to most programs. Numbers without units are a trap: temperature could be Celsius or Fahrenheit, currency dollars or cents. Always confirm the unit from documentation or a known test value, never the field name alone.

### Nulls

A missing value can mean several things: it does not exist (no middle name), it was not collected yet (an older record predating the field), or fetching it failed. Treating every null as zero hides real problems.

### Versioning

APIs and schemas change over time: fields get added, renamed, or removed. A contract needs a way to handle that without breaking silently: a version number in the URL, `/v1/customers` versus `/v2/customers`, or a changelog the provider publishes.

## Common misconceptions

- **"If the field names match, the data means the same thing."** Two systems can both call a field "status" and mean entirely different sets of values. Confirm the actual meaning and allowed values, not just the name.
- **"Numbers do not need documentation, they are self-explanatory."** A number without a stated unit is ambiguous by definition. 100 could be dollars, cents, or a percentage.
- **"A null and a zero are close enough."** Treating a missing value as zero can silently corrupt calculations, for example averaging in zeros for values that were never actually reported.

## Typical interview questions

<details>
<summary>What does it mean to say data is a contract between systems?</summary>

Both systems have to agree on the shape, type, unit, and meaning of every field exchanged. If one side changes its assumptions without telling the other, the integration produces wrong results, often without any error being raised.

</details>

<details>
<summary>Two systems both have a field called "customer" but mean different things by it. How would you handle this?</summary>

Write out a field mapping table that defines what each field means and how it translates into the target schema, then confirm it with someone who owns each system.

</details>

<details>
<summary>An upstream API adds a new required field in its next version. How should your integration handle that?</summary>

Stay pinned to the current version until your code sends the new field, then migrate deliberately; a new required request field is a breaking change. New response fields are different: ignore unknown fields so additive changes never break parsing.

</details>

## Learn more

- Article: [APIs for Beginners](https://www.freecodecamp.org/news/apis-for-beginners/) (freeCodeCamp, sections on response shapes)
- Reference: [System Design 101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo)

## Related

- [Relational Model](./09-relational-model.md)
- [REST Conventions](./01-rest-conventions.md)
- [Data Normalization](./12-data-normalization.md)
- Goes deeper in Module 4: [Data Contracts & Schema Evolution](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/05-data-contracts-and-schema-evolution.md)
