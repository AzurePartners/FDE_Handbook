---
title: Race Conditions
row: M1-L6.3
---
**In one sentence:** A race condition happens when two things try to read and change the same data at almost the same time, and the order they happen to finish in changes the result.

## What it is

Concurrency means multiple operations happening around the same time, which is normal once an app has more than one user. It becomes a bug when two operations both read a piece of data, both decide a new value from what they read, and both write back, and one write quietly overwrites the other.

The classic example is two browser tabs. A user opens the same record in tab A and tab B. In tab A they change the status to "Approved." In tab B, without refreshing, they change the notes and hit save. If tab B saves the whole record based on what it loaded earlier, it can overwrite tab A's "Approved" change with the old status, even though tab B's user never touched that field. This is a lost update. A related problem, stale state, is a screen or cached value showing old data because nothing told it the data changed.

## Why an FDE needs this

Client systems almost always have multiple users touching shared data: two support agents on the same ticket, a human and an automated job editing the same row. A system built and tested by one person alone hides this bug until real usage starts, then it shows up as "my changes disappeared" complaints that are hard to reproduce. Knowing the standard fixes separates someone who can debug "this data looks wrong sometimes" from someone who just adds more logging.

## Key concepts

```
Tab A loads: {status: "Pending", notes: "call back Tuesday"}
Tab B loads: {status: "Pending", notes: "call back Tuesday"}
Tab A changes status to "Approved" and saves the whole record.
Tab B changes notes to "left voicemail" and saves, still holding
    the old status it loaded.
Result: status reverts to "Pending". Tab A's approval is lost.
```

**Unique constraints** stop two conflicting rows from existing at all, for example one insert per `(user_id, date)`. A second insert fails loudly instead of silently duplicating.

**Atomic updates** let the database do the math itself in one step, instead of read-then-write in the app:

```sql
-- Race-prone: read, then write
UPDATE accounts SET credits = 11 WHERE id = 5;  -- app computed 10 + 1

-- Atomic: the database does the increment
UPDATE accounts SET credits = credits + 1 WHERE id = 5;
```

**Optimistic locking with a version column** adds a `version` number to a row. An update must specify the version it read; if another update already changed it, the write is rejected so the app can reload and retry.

```sql
UPDATE records SET notes = 'left voicemail', version = version + 1
WHERE id = 42 AND version = 3;
-- if version is already 4, this affects 0 rows: reload and retry
```

**Locks** make a second operation wait until the first releases. Optimistic locking usually fits typical web editing better; real locks fit short, high-contention operations like inventory counts.

## Common misconceptions

- **"This only happens in complex distributed systems."** It happens in a plain single database the moment two people can edit the same row.
- **"Refreshing before saving fixes it."** It shrinks the window but does not close it; another user can still save in between.
- **"Locks are always the right fix."** Locks add waiting and can cause their own problems if held too long. Optimistic locking or atomic updates solve most web app cases without that cost.

## Typical interview questions

<details>
<summary>Explain the two-browser-tabs problem and why it happens.</summary>

Two tabs load the same record. Editing and saving in one tab changes it. If the other tab later saves the full record based on its older copy, it overwrites the first tab's change, including fields it never touched, since the second save has no way of knowing the data changed.

</details>

<details>
<summary>What is optimistic locking and how does a version column implement it?</summary>

It assumes conflicts are rare and checks for them only at save time instead of locking up front. A version number increments on every successful update. A save must include the version it read; if it no longer matches, the write is rejected and the app reloads and retries.

</details>

<details>
<summary>Why is "read, change in the app, write back" risky under concurrency?</summary>

Two operations can both read the same starting value before either writes back, so whichever writes last silently discards the other's change. An atomic update, where the database applies the change in one step, avoids this.

</details>

## Learn more

- Article: [Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) (PostgreSQL documentation).
- Article: [Preventing Race Conditions with Locks, Atomic Updates, and Idempotency](https://oatllo.com/preventing-race-conditions-web-app) (oatllo).
- Article: [Idempotency](https://algomaster.io/learn/system-design/idempotency) (AlgoMaster, about 15 min).

## Related

- [Idempotency](./05-idempotency.md)
- [Relational Model](../03-apis-data-integration/09-relational-model.md)
- [Caching](./08-caching.md)
