---
title: Least Privilege
row: M1-L4.4
---
**In one sentence:** Least privilege means giving every piece of code, database user, and API key only the access it needs to do its job, nothing more.

## What it is

Every credential, a database login, an API key, a cloud service role, carries a set of permissions: what it can read, change, or delete. Least privilege means choosing the narrowest set of permissions that still lets the system do its job, instead of a broad set granted "just in case it's useful later".

A service that only reads exchange rates should not hold a key that can also delete records. If that key leaks, an attacker can only do what it was permitted to do. The contrast is one broad credential shared across a system: convenient, but a leak anywhere compromises everything.

## Why an FDE needs this

AI coding tools tend to grant broad access because it is simpler during development, for example a database user with full read and write access for a component that only reads. At a client, that shortcut turns one leaked key into full access to real customer data. Check what access a new credential actually needs before it ships.

## Key concepts

- **Deny by default:** start with no access and add only what the job requires.
- **Scope:** limit access to the specific tables, buckets, or endpoints used, not everything.
- **Read vs. write:** a component that only reads gets a read-only credential.
- **Time-bound access:** temporary credentials or access that expires beat permanent keys.
- **Agent permissions:** an AI coding agent holds access too. Claude Code, for example, takes allow and deny rules in its settings, such as denying `Read(./.env)`.

## Common misconceptions

- **"Broader access now saves a request for more access later."** It also makes every leak of that credential worse. Narrow access is not harder to set up, just more deliberate.
- **"Least privilege only applies to human user accounts."** It applies equally to service accounts, API keys, code, and AI agents.

## Typical interview questions

<details>
<summary>What does "least privilege" mean, and give an example.</summary>

Giving a piece of code, user, or key only the access it needs, nothing broader. A service that only looks up exchange rates should use a database credential that can read, not one that can also write or delete.

</details>

<details>
<summary>An AI tool sets up a database user with full admin rights for a component that only reads data. What do you do?</summary>

Replace it with a read-only credential scoped to the tables the component actually needs. Otherwise one leaked key can do far more damage than the component ever needed.

</details>

## Learn more

- Article: [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (OWASP, about 30 min)

## Related

- [Secrets Management](./09-secrets-management.md)
- [Input Validation](./10-input-validation.md)
- Goes deeper in Module 4: [RBAC, Least Privilege & Read/Write Permissions](../../m4/02-authentication-authorization-rbac-and-secrets/02-rbac-least-privilege-and-read-write-permissions.md)
