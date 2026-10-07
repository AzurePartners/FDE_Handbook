---
title: CSV and Tables
row: M1-L3.2
---
**In one sentence:** CSV is a flat, plain-text way to store rows of data with no enforced types, while a database table enforces a schema.

## What it is

CSV (Comma-Separated Values) is a plain text format built for spreadsheets and bulk file transfers. A database table is rows and columns with strict types, built for querying large amounts of data reliably. Neither is better in general; each fits a different job.

A weather reading exported for Excel might look like this:

```csv
time,temperature,windspeed
2026-09-28T14:00,29.4,11.2
```

Stored for repeated queries over months, the same data would live in a table with columns for `time`, `temperature`, and `windspeed`, each with a defined type.

## Why an FDE needs this

Client systems rarely agree on a format: a CRM exports CSV, a reporting tool expects a table. Getting the move between them wrong silently corrupts data, a lost date, a number stored as text, the kind of bug a client finds weeks later, not one that raises an error.

## Key concepts

### CSV: flat and untyped

Every row has the same columns, with no way to nest one record inside another. Everything is text until parsed, so dates, decimals, and commas inside a value are ambiguous.

### Table: schema first

Every column has a declared type, and the database rejects data that does not fit. The tradeoff: a schema is needed before data can go in.

### Parsing a CSV safely

Real exports carry traps: a byte order mark (BOM, an invisible marker Excel adds at the start of UTF-8 files), a semicolon delimiter, and quoted values that contain the delimiter. Name each one and cast types yourself:

```python
import csv
from datetime import datetime
from decimal import Decimal

# export.csv:  customer;amount;signed_up
#              "Khan; Amina";1234.50;2026-03-04
with open("export.csv", encoding="utf-8-sig", newline="") as f:  # utf-8-sig strips a BOM
    for row in csv.DictReader(f, delimiter=";"):                 # quotes handled by csv
        name = row["customer"]                                    # "Khan; Amina"
        amount = Decimal(row["amount"])                           # text to exact decimal
        signed_up = datetime.strptime(row["signed_up"], "%Y-%m-%d").date()
```

Splitting lines on commas by hand breaks on the first quoted value.

## Common misconceptions

- **"A table is just a bigger spreadsheet."** A table enforces a schema; a spreadsheet cell silently accepts anything.
- **"Any tool reads any CSV the same way."** Locale settings alone can break it: some regions use a semicolon as the separator and a comma as the decimal point.

## Typical interview questions

<details>
<summary>Why does a database table need a schema before you can insert data, when CSV does not?</summary>

Reliable, repeated queries need each column's type known in advance. CSV pushes that validation problem to whatever reads the file later.

</details>

<details>
<summary>A client sends you a CSV export where a date column shows values like "03/04/2026". What is the risk?</summary>

Ambiguity between day-first and month-first formats. This could mean March 4th or April 3rd depending on the exporting system's locale, and it needs to be confirmed with the client, not assumed.

</details>

## Learn more

- Reference: [csv, CSV File Reading and Writing](https://docs.python.org/3/library/csv.html) (Python docs)
- Reference: [RFC 4180, Common Format for CSV Files](https://www.rfc-editor.org/rfc/rfc4180) (IETF)

## Related

- [JSON](../02-how-web-apps-run/07-json.md)
- [Relational Model](./09-relational-model.md)
- [Integration Boundaries](./06-integration-boundaries.md)
