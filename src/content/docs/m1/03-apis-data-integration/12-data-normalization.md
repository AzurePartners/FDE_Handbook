---
title: Data Normalization
row: M1-L3.4
---
**In one sentence:** Normalization means organizing a database so each fact is stored exactly once, and the term also has a second meaning: reshaping data from different sources into one consistent format.

## What it is

A poorly organized table repeats the same fact in many rows. Imagine a table holding orders, with the customer's name and email copied onto every row:

| order_id | customer_name | customer_email | product |
|---|---|---|---|
| 1 | Amina Khan | amina@example.com | Keyboard |
| 2 | Amina Khan | amina@exmaple.com | Mouse |

Row 2 has a typo in the email. Now the two rows disagree, and nothing says which is correct. This is an update anomaly: the same fact lives in two places and the copies drifted apart. Normalization fixes this by splitting the table so each fact lives in exactly one row, linked with foreign keys, the idea on the Relational Model page.

## Why an FDE needs this

Denormalized data is one of the most common reasons a client's reports do not add up: two counts of "the same thing" disagree because a fact was updated in one place and not another. An FDE reviewing a schema needs to recognize when duplication is a real problem versus a deliberate tradeoff.

## Key concepts

### The normal forms, in plain words

**First normal form (1NF):** each column holds one value, not a list, so `"Keyboard, Mouse"` in one cell should be separate rows.

**Second normal form (2NF):** every non-key column depends on the whole key, relevant when a key spans more than one column.

**Third normal form (3NF):** every non-key column depends only on the primary key. Above, `customer_email` is a fact about the customer, not the order: it depends on `order_id` only indirectly, through who the customer is (a transitive dependency), the clue it belongs in its own table, linked back with a `customer_id` foreign key. Now a typo needs one fix.

### When to denormalize on purpose

Normalization trades duplication for extra joins. Some systems keep a denormalized copy for speed, accepting the risk as a documented decision, not something discovered by accident.

## The other meaning

The word "normalize" also describes reshaping data from different sources into one format before using it together. Two APIs might return temperature under different field names, units, and types:

| | API A | API B |
|---|---|---|
| Field name | `temp` | `current_weather.temperature` |
| Unit | Fahrenheit | Celsius |
| Type | String `"84.2"` | Number `29.4` |

Normalizing means converting both into one shape before storing or comparing them, every temperature a float, in Celsius, under one field name. Skipping this means a later query silently compares Fahrenheit against Celsius.

### Worked example: two APIs into one table

This script calls Open-Meteo (weather) and Frankfurter (exchange rates), maps both into one record with fixed names, units, and types, then saves it with an INSERT. The primary key on date and city means a rerun replaces the row instead of duplicating it.

```python
import sqlite3, requests

weather = requests.get("https://api.open-meteo.com/v1/forecast",
    params={"latitude": 52.52, "longitude": 13.41, "current": "temperature_2m"},
    timeout=10).json()
fx = requests.get("https://api.frankfurter.dev/v1/latest",
    params={"base": "EUR", "symbols": "USD"}, timeout=10).json()

record = {                                   # one agreed shape
    "date": fx["date"],                      # "2026-10-05"
    "city": "Berlin",
    "temp_c": float(weather["current"]["temperature_2m"]),
    "eur_usd": float(fx["rates"]["USD"]),
}

db = sqlite3.connect("daily.db")
db.execute("CREATE TABLE IF NOT EXISTS daily "
           "(date TEXT, city TEXT, temp_c REAL, eur_usd REAL, PRIMARY KEY (date, city))")
db.execute("INSERT OR REPLACE INTO daily VALUES (:date, :city, :temp_c, :eur_usd)", record)
db.commit()
```

## Common misconceptions

- **"Normalization and normalizing data from two APIs are the same process."** They share a name and goal, but one is about table structure, the other about reconciling field names, types, and units across sources.
- **"A fully normalized schema is always the correct design."** Full normalization adds joins and can slow down read-heavy systems. Real systems often denormalize specific tables on purpose.
- **"Duplication in a database is always a bug."** Deliberate duplication for performance is valid. Accidental duplication with no plan to keep copies in sync is the problem.

## Typical interview questions

<details>
<summary>What is an update anomaly, and how does normalization prevent it?</summary>

An update anomaly happens when the same fact is stored in multiple rows and only some get updated, leaving the data contradicting itself. Normalization prevents it by storing each fact once and linking related data with foreign keys.

</details>

<details>
<summary>When would you deliberately denormalize a table?</summary>

For data read far more often than it changes, such as a dashboard table, as a documented tradeoff.

</details>

<details>
<summary>You are combining data from two APIs that both report temperature but under different field names and units. What has to happen before you can compare them?</summary>

Both fields need normalizing to one agreed shape, name, unit, and type, before storing or comparing them. Otherwise a later query risks silently comparing Fahrenheit to Celsius.

</details>

## Learn more

- Reference: [Database normalization](https://en.wikipedia.org/wiki/Database_normalization) (Wikipedia)

## Related

- [Relational Model](./09-relational-model.md)
- [Schema and Data Contracts](./10-schema-and-data-contracts.md)
- [SQL Basics](./11-sql-basics.md)
