---
title: Integration Boundaries
row: M1-L3.3
---
**In one sentence:** Not every system exchanges data through a REST API; a lot of real integration work moves data through file drops, direct database reads, or prebuilt SaaS connectors, each with its own format, owner, and failure points.

## What it is

Plenty of client systems predate REST APIs or move data in bulk. Common boundaries: a file dropped for another system, a file uploaded through an API, a direct database read, and a SaaS connector. Each fails differently.

## Why an FDE needs this

Clients often say "just get the data out of the old system" and mean a nightly CSV export in a folder, not an API. A billing platform might only offer a read replica. An FDE who only knows REST calls is stuck when a client's system has none.

## Key concepts

### File drops: SFTP, CSV exports, shared folders

One system writes a file, usually CSV, on a schedule to a folder, often reached over SFTP (file transfer over SSH), and another reads it later. Nobody calls anybody; the file is the interface.

- **Owned by:** the exporting team, who controls the schedule and format.
- **Fails when:** a file arrives late or not at all, columns get renamed without warning, or it is read mid-write.
- **Check:** did the file land as a complete write, do the headers still match, and what happens if it just does not show up.

### Reading a database directly

Some systems only expose their data through read access to the database, or a read replica: a live copy kept in sync, used so outside queries do not slow down or lock production.

- **Owned by:** the source team, who can change a column or table without telling every consumer.
- **Fails when:** the replica lags behind the primary, a schema change breaks an old query, or a slow query locks shared resources.
- **Check:** whether you are reading a replica or live production, how far the replica may lag, and where the schema is documented.

### SaaS connectors

Many tools, Salesforce, HubSpot, QuickBooks, ship with prebuilt connectors, their own or through Zapier, that move data without you writing the underlying API calls.

- **Owned by:** the vendor, who can change its behavior at any time.
- **Fails when:** the connector's rate limit is hit, a field mapping is wrong, or it silently drops an unmappable record.
- **Check:** where the connector's own logs live, rarely in your application's.

### File uploads through an API

Some APIs take a file instead of JSON. The client sends it as `multipart/form-data`, a request body split into parts: the file bytes plus ordinary form fields.

```bash
curl -X POST https://api.example.com/v1/invoices/upload \n  -H "Authorization: Bearer $API_KEY" \n  -F "file=@invoice.pdf;type=application/pdf" \n  -F "customer_id=c_123"
```

- **Owned by:** whoever runs the receiving API, which sets the size and type limits.
- **Fails when:** a file is too large (413), has a disallowed type (415), or a slow parse makes the request time out.
- **Check:** when you receive uploads, reject files over a size cap and check the real type, not just the extension. Store the file in object storage (such as Amazon S3), save only its key in the database, and parse it in a background worker so the upload returns quickly.

## Common misconceptions

- **"No REST API means no way to integrate."** File drops, database reads, and SaaS connectors are standard, often more common at established clients.
- **"A database read replica is the same as production."** A replica can lag the primary by seconds or minutes and is read-only.
- **"A SaaS connector 'just works' once configured."** Connectors have their own quotas, failure modes, and logs. Treat one as another system to monitor.

## Typical interview questions

<details>
<summary>A client says their old billing system has no API. What are your options for getting its data?</summary>

Ask whether it can export a scheduled file, CSV over SFTP is common, whether you can get read access to its database or a replica, or whether a SaaS connector already supports it.

</details>

<details>
<summary>A SaaS connector silently stops moving new records for one specific field. Where do you look first?</summary>

The connector's own logs and its field mapping, since it runs outside your code. A field it cannot map often gets dropped instead of raising an error.

</details>

## Learn more

- Reference: [System Design 101](https://github.com/ByteByteGoHq/system-design-101) (ByteByteGo, GitHub)

## Related

- [Relational Model](./09-relational-model.md)
- [CSV and Tables](./08-csv-and-tables.md)
- [Webhook vs. Polling](./05-webhook-vs-polling.md)
- [Schema and Data Contracts](./10-schema-and-data-contracts.md)
