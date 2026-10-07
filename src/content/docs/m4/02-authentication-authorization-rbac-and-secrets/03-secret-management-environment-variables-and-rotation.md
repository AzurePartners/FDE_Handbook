---
title: Secret Management, Environment Variables & Rotation
row: M4-L2.3
---
**In one sentence:** Secrets (API keys, passwords, tokens) must live outside code in a secure store, be injected at runtime via environment variables or a vault, never be written to logs, and be rotated on a schedule and immediately after any exposure.

## What it is

The fundamentals, keeping credentials out of source code, injecting them at runtime via **environment variables** or a vault, and **rotating** them on a schedule and immediately after any leak, are covered in Module 1 ([Secrets Management](../../m1/04-git-debugging-testing-security/09-secrets-management.md)). At enterprise scale the specifics that matter are a managed **secret store/vault** that encrypts and access-controls secrets, **per-service-account** credentials rather than shared keys, and rotation coordinated across many services. A recurring, easy-to-miss risk is **leaking secrets in logs**, printing a request or token while debugging spreads the secret to wherever logs are stored.

## Why an FDE needs this

Handling a customer's credentials, a secret committed to a repo or printed in a log is a reportable incident and a guaranteed security-review failure. Setting up proper secret handling from day one avoids the single most common enterprise security finding.

## Key concepts

- **Secret store/vault:** encrypted, access-controlled home for secrets.
- **Inject at runtime:** env vars or vault API; never hardcode.
- **Never log secrets:** redact before logging; logs are a top leak vector.
- **Rotation:** scheduled and post-exposure; the old secret dies.
- **History matters:** removing a secret from the latest commit doesn't remove it from git history, rotate it.

```python
# Wrong: API_KEY = "sk-live-abc123"     (in code, in git history forever)
import os
api_key = os.environ["API_KEY"]          # injected at runtime from a secret store
```

## Common misconceptions

- **"Deleting the secret from the latest commit fixes it."** It's still in history; the fix is rotation.
- **"Env vars are perfectly safe."** Better than code, but they leak via logs, error dumps, and child processes; handle carefully.
- **"Rotate only after a breach."** Scheduled rotation limits how long any single leak is useful.

## Typical interview questions

<details>
<summary>A teammate committed an API key. What do you do?</summary>

Rotate it immediately, it's in git history and anyone with repo access has seen it, so deleting the file isn't enough. Then move it to a secret store, inject at runtime, add it to .gitignore, and enable pre-commit secret scanning to prevent a repeat.

</details>

<details>
<summary>Why is logging a common way secrets leak?</summary>

Logs are often stored longer, in less-secured systems, and read by more people than the primary store, so printing a token or full request while debugging quietly spreads it. The fix is to redact secrets (and PII) before anything is logged.

</details>

## Learn more

- Article: [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) (rotation, vaults, no secrets in code)
- Article: [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) (never log tokens/keys/PII)

## Related

- [Module 1 → Secrets Management](../../m1/04-git-debugging-testing-security/09-secrets-management.md) (the fundamentals)
- [Authentication vs Authorization](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [PII/PHI Handling & Compliance Basics](../03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md)
