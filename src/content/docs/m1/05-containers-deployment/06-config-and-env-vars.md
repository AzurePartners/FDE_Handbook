---
title: Configuration
row: M1-L5.3
---
**In one sentence:** A cloud app reads its settings from the platform it runs on, not from a file on a developer's laptop, so the same image behaves correctly in every environment.

## What it is

A local `.env` file holds values like a database address or a timeout length while a developer works on their own machine. That file is not part of the deployed app. When the app moves to the cloud, those values must live somewhere the platform can read them. On Azure App Service this is called **application settings**: key-value pairs exposed to the app as environment variables at startup. If an app expects `API_TIMEOUT` and it only exists in the local `.env` file, the cloud version will not have it, and anything depending on it fails.

This follows a Twelve-Factor App principle, a widely referenced set of cloud software practices: store config in the environment, not in the code. The app reads configuration the same way locally and in the cloud, through environment variables. What changes is where the values come from: a local `.env` file, or the platform's application settings. The code itself should not change.

Some of these values are secrets, such as API keys and passwords. Handling those safely, including tools like Azure Key Vault, is covered on its own page.

## Why an FDE needs this

A common early deployment failure: the app works locally, gets deployed, and crashes, because a value quietly set in the local `.env` file was never added to the cloud platform's application settings. An FDE who understands this can diagnose it in minutes by comparing the two, instead of re-reading application code that was never the problem.

## Key concepts

### Environment variables and app settings

The app reads configuration through environment variables in every environment. Locally, a `.env` file (kept out of git) sets them. In the cloud, the platform's own settings screen or CLI sets them, and injects them into the running container at startup. Note that `os.environ` does not read `.env` by itself; see [Development Environment](../01-ai-assisted-development/03-dev-environment.md).

### Config vs. code

Config is anything that varies between deploys: database connections, feature flags, which outside services to call, timeout lengths. Code is everything else, and it should be identical across local, staging, and production. If a value has to change to move the app from one environment to another, it belongs in config, not hardcoded in the source.

## Common misconceptions

- **"Whatever is in my local .env file automatically works in the cloud."** The platform's own configuration has to be set separately; a `.env` file is kept out of git and should be kept out of the image too, so the cloud never sees it.
- **"Config belongs in the code so it's easier to find."** Hardcoded config forces a rebuild of the image every time a value changes between environments, and it risks committing a value that should not be public.
- **"An app setting and a secret should be handled the same way."** Ordinary config, like a timeout, is fine as a plain application setting. A secret needs its own handling, covered separately.

## Typical interview questions

<details>
<summary>An app needs an environment variable, works locally, and crashes right after deployment. What do you check first?</summary>

Whether it was actually set in the platform's configuration, such as Azure App Service's application settings. A local `.env` file does not carry over automatically.

</details>

<details>
<summary>Why keep configuration in environment variables instead of hardcoding it in the app?</summary>

The same code and image can then run in every environment; only the environment variables differ. Hardcoding a value forces a rebuild any time it needs to change, and risks committing something that should vary per environment.

</details>

<details>
<summary>What is the difference in where config comes from locally versus in the cloud?</summary>

Locally it usually comes from a `.env` file the developer keeps out of version control. In the cloud, it comes from the platform's own configuration, such as Azure App Service's application settings, which the platform injects as environment variables at startup.

</details>

## Learn more

- Article: [The Twelve-Factor App, part III: Config](https://12factor.net/config) (12factor.net).
- Article: [Configuring a Linux Python app on Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-language-python) (Microsoft Learn).

## Related

- [Secrets Management](../04-git-debugging-testing-security/09-secrets-management.md)
- [HTTPS, Domains and Certificates](./07-domains-and-certificates.md)
- [Deployment Environments](./04-environments.md)
- Goes deeper in Module 4: [Secret Management, Environment Variables & Rotation](../../m4/02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)
