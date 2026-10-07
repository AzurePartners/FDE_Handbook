---
title: Relational Model
row: M1-L3.2
---
**In one sentence:** A relational database stores data in linked tables, so related facts are not duplicated everywhere they are needed.

## What it is

A relational database organizes data into tables, similar to spreadsheets, where each table holds one kind of thing: customers, orders, products. Each table has a defined set of columns, its schema, and each row is one record. What makes it "relational" is that tables link to each other through shared identifiers, so a database can answer "which customer placed this order" without storing the customer's full details inside every order row.

Think of a filing cabinet with one drawer per topic: a "Customers" drawer holds one folder per customer, an "Orders" drawer holds one folder per order, and each order folder has a small note pointing back to which customer it belongs to, instead of a full copy of that customer's details. That pointer is a foreign key. Nearly every business system an FDE touches sits on top of a relational database.

## Why an FDE needs this

Understanding schemas matters when connecting a new system to an existing one, since it has to store data in a shape that matches, or is deliberately mapped to, what already exists. A client asking "why does this record show up twice" is often a modeling question: a bug, or two legitimately different rows sharing a key by coincidence. Reading a schema quickly is a routine task, and a prerequisite for the SQL Basics page.

## Key concepts

### Tables and schemas

A schema is the structure of a table: its columns and types. A `customers` table might have this schema:

```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT
);
```

### Primary keys

A primary key is the column, or combination of columns, that uniquely identifies each row in a table, usually an auto-incrementing ID.

### Foreign keys

A foreign key is a column in one table that points to the primary key of another, creating the link:

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER,
    total REAL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

Here, `orders.customer_id` refers back to `customers.id`. This lets you ask "show me this customer's orders" without duplicating the name and email into every order row, which would risk the copies drifting out of sync if an email changes and only some rows get updated.

### Why not just one big table

A natural first instinct is to put customer and order details in one table. If the email changes, every past order row needs updating too, or the data disagrees with itself. Splitting into linked tables, one fact stored once, is the idea the relational model is built around, the same idea behind normalization, covered on the Data Normalization page.

## Common misconceptions

- **"A foreign key and a primary key are the same idea."** A primary key uniquely identifies a row within its own table. A foreign key refers to a primary key in a different table, linking records together.
- **"A relational database is just a bigger spreadsheet."** A spreadsheet has no enforced link between tabs. A relational database can enforce that a foreign key value actually exists in the table it points to, once a foreign key constraint is declared (SQLite also needs `PRAGMA foreign_keys = ON`).
- **"NULL means zero or an empty string."** It means unknown or missing; see [SQL Basics](./11-sql-basics.md) for how to query it.

## Typical interview questions

<details>
<summary>What is the difference between a primary key and a foreign key?</summary>

A primary key uniquely identifies each row within its own table. A foreign key stores another table's primary key value, linking the two tables.

</details>

<details>
<summary>Why store customer details in a separate table instead of repeating them on every order row?</summary>

Repeating customer details on every order wastes space and risks copies drifting out of sync if an email changes and only some rows get updated. Storing it once and linking with a foreign key keeps one source of truth.

</details>

<details>
<summary>A new system needs to connect to a client's existing database. What do you look at first?</summary>

The existing schema: what tables exist and how foreign keys link them. The new data has to either match that shape or be explicitly mapped onto it.

</details>

## Learn more

- Interactive: [SQLBolt, lessons 1 to 6](https://sqlbolt.com/)

## Related

- [SQL Basics](./11-sql-basics.md)
- [Data Normalization](./12-data-normalization.md)
- [Schema and Data Contracts](./10-schema-and-data-contracts.md)
