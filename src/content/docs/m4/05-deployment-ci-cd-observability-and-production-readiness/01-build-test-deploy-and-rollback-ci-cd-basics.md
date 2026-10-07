---
title: "Build, Test, Deploy & Rollback: CI/CD Basics"
row: M4-L5.1
---
**In one sentence:** CI/CD is the automated flow that takes code from commit to production, build, test, deploy, and roll back if something's wrong, and an FDE needs to understand the flow and use it, not hand-build complex pipelines.

## What it is

**Continuous Integration (CI)** automatically builds and tests code on every change, catching breakage early. **Continuous Delivery/Deployment (CD)** automatically moves passing code toward or into production. The core release flow is: **build** (compile/package), **test** (run automated checks), **deploy** (push to an environment), and **rollback** (revert to the previous version fast if the new one misbehaves). You don't need to build elaborate pipelines from scratch, most platforms provide CI/CD, but you must understand the flow so you can ship safely and, critically, roll back when needed.

## Why an FDE needs this

Deploying into a customer's environment means shipping changes without breaking what works. A working CI/CD flow with automated tests catches regressions before they reach users, and a fast rollback is your safety net when something slips through. An FDE who understands this ships confidently and recovers quickly; one who deploys by hand with no rollback plan turns a small bug into an outage.

## Key concepts

- **CI:** auto build + test on every change; catch breakage early.
- **CD:** automated path to/through production for passing changes.
- **Environments:** dev → staging → production; test before prod.
- **Rollback:** fast revert to the last good version; plan it before you need it.
- **Use platform CI/CD:** configure, don't hand-build; the goal is safe, repeatable releases.

```
commit -> [build] -> [test] -> [deploy to staging] -> [deploy to prod]
                                   \-- fails? --> rollback to last good
```

## Common misconceptions

- **"CI/CD means building complex pipelines."** You mostly configure existing platform pipelines; understanding the flow matters more than infra.
- **"If tests pass, no rollback needed."** Tests miss things; a fast rollback is the essential safety net.
- **"Deploy straight to prod."** Stage and test first; prod is not where you discover breakage.

## Typical interview questions

<details>
<summary>Walk through a basic release flow.</summary>

On each change, CI builds and runs automated tests. If they pass, CD deploys to staging for verification, then to production. If the new version misbehaves in production, you roll back to the last known-good version immediately. The emphasis is repeatable, tested releases with a fast rollback path, not hand-built pipelines.

</details>

<details>
<summary>Why is rollback capability so important?</summary>

Because tests never catch everything, and in a customer's production environment a bad deploy causes real impact. A fast, rehearsed rollback turns "we shipped a bug" into a brief blip instead of a prolonged outage, and it's the safety net that lets you ship confidently.

</details>

## Learn more

- Article: [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) (Martin Fowler; build/test on every change)
- Docs: [Azure App Service — Python quickstart](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python) (hands-on deploy)

## Related

- [Logs, Metrics, Traces, Health Checks & Alerts](./02-logs-metrics-traces-health-checks-and-alerts.md)
- [Version Records & Reproducing Incident State](./03-version-records-model-prompt-data-tools-and-config.md)
