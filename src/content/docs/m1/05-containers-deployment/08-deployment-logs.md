---
title: Deployment Logs
row: M1-L5.4
---
**In one sentence:** Deploying means getting an app running on a server the world can reach, and reading logs is how you find out why a deployment failed.

## What it is

Deployment takes code from a developer's machine and puts it somewhere reachable. For a small Python web app on Azure App Service, it can be a single command:

```
az webapp up --name my-app --resource-group my-rg --runtime "PYTHON:3.12"
```

This creates or updates the web app, uploads the code, and starts it. When it works, the platform hands back a live URL. When it does not, read the **logs**, the running record of what the app or platform printed while starting up. Streaming logs on Azure (on Linux, first turn on container logging with `az webapp log config --docker-container-logging filesystem`):

```
az webapp log tail --name my-app --resource-group my-rg
```

Logs are the most useful tool for finding why a deployment failed. A deployment that "succeeded" can still fail the moment the app tries to run, and that failure almost always shows up in the logs first.

## Why an FDE needs this

Deployment failures are routine, and most are not mysterious once the logs are read carefully. Re-deploying without reading the logs often repeats the failure. Finding the specific error and fixing its cause looks calm and capable in front of a client.

## Key concepts

### Common deployment failures

| Failure | Symptom | How to diagnose from the logs |
|---|---|---|
| Wrong port | App runs locally, but the platform shows "Application Error" | The app listens on a port the platform does not route to. Some platforms pass the port in an environment variable, such as `PORT`, for the app to read; on Azure App Service with a custom container, you set the `WEBSITES_PORT` app setting to the port the container listens on. |
| Missing environment variable | App crashes on startup, or one feature fails when used | A traceback names the specific setting that was never found |
| Missing dependency | App crashes on startup with an import error | The logs name a package the code tried to import that was never installed |
| Crash on startup | App never reaches a working state | A stack trace right at the beginning, before any request, points to configuration or setup, not user input |

### Reading logs with a plan

Read the log stream top down and find the first error, not the last; later errors are often its consequences. Then read that error's stack trace bottom up, as in [Logs and Stack Traces](../04-git-debugging-testing-security/05-logs-and-stack-traces.md). Separate "deployment accepted" from "app running": the first only means the code uploaded.

## Common misconceptions

- **"If the deployment command finishes without an error, the app works."** It only means the platform accepted and tried to start the code. It can still crash the moment it runs.
- **"Logs only matter after something is broken."** Watching logs while a deployment happens often catches the exact moment something goes wrong.
- **"A stack trace always means the code has a bug."** A startup stack trace is frequently caused by missing configuration, not application logic.
- **"Restarting the app is a reasonable first fix for any deployment failure."** A restart will not fix a missing environment variable; it just reproduces the failure.

## Typical interview questions

<details>
<summary>A deployment "succeeds" but the app shows an error page. What does that tell you, and what do you check next?</summary>

The platform accepted and tried to start the code, but the app is failing at runtime, a separate problem from deployment. Check the app's logs to find the actual error.

</details>

<details>
<summary>How would you tell a missing environment variable apart from a missing dependency, just from the logs?</summary>

A missing environment variable shows a traceback naming the setting the code expected but never found. A missing dependency shows an import error naming a package that was never installed.

</details>

<details>
<summary>A stack trace shows up the moment the app starts, before it has handled any request. What does that suggest?</summary>

A startup crash almost always points to a configuration or setup problem, such as a missing environment variable, rather than a bug in the application logic, since no user input has been processed yet.

</details>

## Learn more

- Article: [Quickstart: Deploy a Python (Django, Flask, or FastAPI) web app to Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python) (Microsoft Learn).
- Article: [Configure a Linux Python app for Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-python) (Microsoft Learn).

## Related

- [Compute Options](./05-compute-options.md)
- [Configuration](./06-config-and-env-vars.md)
- [Logs and Stack Traces](../04-git-debugging-testing-security/05-logs-and-stack-traces.md)
- Goes deeper in Module 4: [Logs, Metrics, Traces, Health Checks & Alerts](../../m4/05-deployment-ci-cd-observability-and-production-readiness/02-logs-metrics-traces-health-checks-and-alerts.md)
