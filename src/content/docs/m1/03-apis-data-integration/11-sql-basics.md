---
title: SQL Basics
row: M1-L3.2
---
**In one sentence:** SQL (Structured Query Language) is how you talk to a relational database: create tables, insert data, and ask questions about what is stored.

## What it is

SQL is the language nearly every relational database understands, from a local SQLite file to a large production PostgreSQL cluster. It reads close to English, `SELECT name FROM customers WHERE id = 42` means roughly what it looks like, but it has precise rules about what runs and in what order. Reading or writing a short SQL query is a routine task for an FDE, not a specialist skill, and it is often the fastest way to get a real, accurate answer instead of guessing from a dashboard that might be stale or wrong.

This page assumes the table structure covered on the Relational Model page: tables, primary keys, and foreign keys linking them together.

## Why an FDE needs this

Clients ask questions that only the database can answer accurately: "how many orders came in last month," "which customers have not been billed," "why does this record show up twice." An FDE who can write a short SQL query gets a real answer directly from the source of truth. This matters just as much when reviewing AI-generated SQL: a query that runs without error can still silently return the wrong rows, for example missing a join condition and multiplying every row instead of matching it correctly.

## Key concepts

### SELECT and WHERE, reading rows

```sql
SELECT name, email FROM customers WHERE id = 42;
```

`SELECT` chooses which columns to return, `FROM` chooses the table, and `WHERE` filters which rows qualify. Multiple conditions combine with `AND` and `OR`:

```sql
SELECT name FROM customers WHERE email IS NOT NULL AND id > 100;
```

### INSERT, adding a row

```sql
INSERT INTO customers (name, email) VALUES ('Amina Khan', 'amina@example.com');
```

Every column not listed gets its default value, or `NULL` if no default is set and the column allows it.

### UPDATE and DELETE

```sql
UPDATE customers SET email = 'new@example.com' WHERE id = 42;
DELETE FROM customers WHERE id = 42;
```

Both are as dangerous as they are useful: leaving off the `WHERE` clause updates or deletes every row in the table, not just one. Always run the equivalent `SELECT` with the same `WHERE` clause first to see exactly which rows would be affected.

### JOIN, combining related tables

```sql
SELECT customers.name, orders.total
FROM orders
JOIN customers ON orders.customer_id = customers.id
WHERE orders.total > 100;
```

This returns each customer's name next to their orders over 100, pulling from both tables in one query using the foreign key that links them. Most real queries against a normal schema need at least one join, since the relational model deliberately splits related data across tables instead of duplicating it.

### GROUP BY, summarizing rows

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

This returns one row per customer, with a count of how many orders each one has, instead of one row per order. `GROUP BY` is almost always paired with an aggregate function like `COUNT`, `SUM`, or `AVG`.

### ORDER BY and LIMIT

```sql
SELECT id, total FROM orders ORDER BY total DESC LIMIT 5;
```

`ORDER BY` sorts the result, `DESC` for highest first, `ASC` (the default) for lowest first. `LIMIT` caps how many rows come back, useful for "top 5" questions or just to avoid pulling millions of rows while exploring a table.

### Reading a query in the order the database processes it

A useful habit: read `SELECT ... FROM ... WHERE ... GROUP BY ... ORDER BY ...` in the order the database actually evaluates it, not the order it is written. Roughly: pick the table (`FROM`), combine with others (`JOIN`), filter rows (`WHERE`), group what is left (`GROUP BY`), then choose and sort columns to return (`SELECT`, `ORDER BY`).

## Common misconceptions

- **"JOIN is an advanced feature you can skip as a beginner."** JOIN is how relational databases avoid duplicating data everywhere. Most real queries against a normal schema need at least one join.
- **"SQL and a spreadsheet formula do the same thing."** A spreadsheet formula recalculates over cells you can see and edit directly. SQL queries a dataset that can hold millions of rows, enforces types on the way in, and runs repeatedly and reliably from other programs, not just people.
- **"NULL means zero or an empty string."** NULL means the value is unknown or missing, and it behaves differently in comparisons; `WHERE email = NULL` never matches anything, you need `WHERE email IS NULL`.
- **"An UPDATE or DELETE without WHERE just does nothing."** It runs against every row in the table. This is one of the most common ways to destroy real data by accident, and it is why testing the matching `SELECT` first matters.

## Typical interview questions

<details>
<summary>Write a query that returns the total number of orders per customer.</summary>

```sql
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id;
```

This groups the `orders` table by `customer_id` and counts how many rows fall into each group.

</details>

<details>
<summary>A query using JOIN returns fewer rows than expected. What would you check?</summary>

Whether the join condition matches the right columns, and whether some rows have a NULL or mismatched key value, which excludes them from a standard JOIN. Rows that exist in one table but not the other is often the actual cause.

</details>

<details>
<summary>What is the risk of running an UPDATE or DELETE statement without a WHERE clause?</summary>

It applies to every row in the table, not just the one intended. A safe habit is running the equivalent SELECT with the same WHERE clause first to confirm exactly which rows would be affected before changing or removing anything.

</details>

<details>
<summary>An AI tool generates a SQL query for you. What do you check before running it against a real database?</summary>

Whether it has a WHERE clause that matches only the intended rows, whether any JOIN uses the correct key columns, and, for anything that writes or deletes data, whether running the equivalent SELECT first shows the expected rows and nothing more.

</details>

## Learn more

- Interactive: [SQLBolt, lessons 1 to 6 and 13 to 16](https://sqlbolt.com/)

## Related

- [Relational Model](./09-relational-model.md)
- [Data Normalization](./12-data-normalization.md)
- [Web App Layers](../02-how-web-apps-run/10-frontend-backend-database-layers.md)
