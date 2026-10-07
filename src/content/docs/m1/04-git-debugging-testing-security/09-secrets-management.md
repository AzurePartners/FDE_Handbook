---
title: Secrets Management
row: M1-L4.4
---
**In one sentence:** A secret, an API key, a database password, a token, should never live in code or in a git repository, and should instead be stored and rotated through a system built for that purpose.

## What it is

A secret is any value that grants access and would cause harm if the wrong person saw it. Secrets management means keeping those values out of source code and version control, storing them somewhere designed to hold them safely.

The right default for a small project is an environment variable: a value set outside the codebase that the program reads at startup. Locally, this is a `.env` file never committed to git:

```
# .env (never committed)
DATABASE_URL=postgres://user:pass@localhost/app
WEATHER_API_KEY=abc123
```

```python
import os
db_url = os.environ["DATABASE_URL"]
```

`os.environ` does not read `.env` by itself; something must load it first (see [Development Environment](../01-ai-assisted-development/03-dev-environment.md)). The `.env` file must be listed in `.gitignore`, so git never tracks it. A `.env.example` file, with variable names but no real values, is committed instead, so newcomers know what to fill in.

For production systems, especially at a client, secrets move beyond `.env` into a dedicated secret store, such as Azure Key Vault, which stores secrets centrally, controls who can read them, and can log every access once diagnostic logging is turned on. The app requests a secret from the vault at startup, and the vault decides whether to hand it over.

## Why an FDE needs this

A leaked secret is a security incident, not a minor bug, and it is a common mistake AI tools make, since example code online often shows a key hardcoded for clarity. An FDE catches this before it ships: once a secret is committed it remains in the project's history even after a later commit deletes it, and a public repository exposes that history too.

## Key concepts

### Never in code, even config files

Secrets must never appear in source files, commit messages, or committed config files, including `docker-compose.yml`. The rule holds for private repos too, since those become public by accident.

### Rotation

Rotation means replacing a secret with a new value on a schedule, or right after a suspected leak, so any copy of the old value stops working. A secret store makes this easier: one place to update, instead of hunting through every config file that might hold a copy. If a key is ever committed, treat it as exposed and rotate it, since removing the line later does not remove it from history.

## Common misconceptions

- **"It is fine to commit a secret temporarily and remove it later."** A committed secret remains in git history, recoverable from any earlier commit. Rotate it immediately, not just delete the line.
- **"A private repository is safe enough for secrets."** Private repos get made public by accident, get forked, or get shared with contractors who do not need every secret in the history.
- **"An environment variable is just as good as a secret store for production."** `.env` suits a small project; production client data needs the access control and audit logging a secret store adds.

## Typical interview questions

<details>
<summary>Why should a secret never be committed to a git repository, even a private one?</summary>

Git tracks history, so a committed secret stays recoverable from earlier commits even after being deleted. Private repositories can become public, get forked, or be shared more broadly than intended, so any secret ever committed should be treated as compromised.

</details>

<details>
<summary>What is the difference between an environment variable and a secret store like Azure Key Vault?</summary>

An environment variable keeps a secret out of code, read from the OS or a `.env` file at startup. A secret store adds access control over which systems can read which secret, an audit log, and support for rotating a secret in one place.

</details>

<details>
<summary>You find an API key committed in a repo's history from six months ago. What do you do?</summary>

Rotate the key immediately: generate a new one and revoke the old, since deleting it from a later commit does not remove it from history. Check for signs the key was used, and confirm `.gitignore` covers its file.

</details>

## Learn more

- Article: [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (OWASP, about 30 min)
- Article: [The Twelve-Factor App, Config](https://12factor.net/config) (12factor.net)

## Related

- [Git Mental Model](./01-git-mental-model.md)
- [API Authentication](../03-apis-data-integration/02-auth.md)
- [Configuration](../05-containers-deployment/06-config-and-env-vars.md)
- Goes deeper in Module 4: [Secret Management, Environment Variables & Rotation](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)
