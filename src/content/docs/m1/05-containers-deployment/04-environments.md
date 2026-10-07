---
title: Deployment Environments
row: M1-L5.2
---
**In one sentence:** An environment is a separate copy of an app used for one stage of work, such as building it, testing it, or serving real users, and mixing them up is a common cause of "it worked yesterday" bugs.

## What it is

Most teams run their app in at least three places. **Local** is a developer's own machine, for writing and trying out code. **Staging** is a copy that looks like the real thing, used to test changes before anyone outside the team sees them. **Production** is the live version real users depend on.

Having more than one environment catches problems before they reach users: local lets a developer break things freely, staging shows whether a change works outside their machine, and production is where mistakes have real cost.

The idea behind this is **dev/prod parity**: the closer an environment matches production, the fewer surprises show up when code reaches it. The Twelve-Factor App, a set of cloud software practices, names this directly: keep the stages as similar as possible. Containers help: if local, staging, and production all run the same image, the code and runtime are identical everywhere; only configuration should differ.

## Why an FDE needs this

Client conversations often start with "it worked in the demo" or "it worked in staging, but the customer says it's broken." An FDE who understands environments asks what actually differs between the two, instead of guessing at the code. The answer is often a missing environment variable or an unpinned dependency version.

## Key concepts

### The three environments

| Environment | Purpose | Who sees it | Typical data |
|---|---|---|---|
| Local | Write and try out code | The developer | Fake or sample data |
| Staging | Test a change before it goes live | The team, sometimes the client | A copy of real data, or realistic samples |
| Production | Serve real users or client systems | End users, the client | Real, live data |

Some teams add more stages, such as a preview environment per pull request. The names vary; each stage sits closer to production than the last.

### What should differ, and what should not

The code and runtime should be identical across environments, ideally the same container image. What changes is configuration: database connections, API keys, and which outside services to call. Environment variables let one image behave correctly in each environment without editing code. A gap staging never needed, a different OS or library version, is where bugs go unnoticed until they are expensive to catch.

## Common misconceptions

- **"Staging is optional if the team tests carefully by hand."** Manual testing on a developer's machine still misses environment-specific problems, such as missing configuration.
- **"If it works locally, it will work in production."** Local machines often have extra tools or cached files that quietly hide a bug a clean environment would surface.
- **"Different environments should run different code."** They should run the same code and image. Only configuration differs, not logic.

## Typical interview questions

<details>
<summary>What is dev/prod parity, and why does it matter?</summary>

Keeping development, staging, and production as similar as possible, in tools, data shape, and configuration approach. The closer they match, the fewer bugs only show up after code reaches production.

</details>

<details>
<summary>Give an example of a bug that would only show up in staging or production, not locally.</summary>

A missing environment variable a developer had set locally out of habit, but never added elsewhere. The app runs fine locally and fails the moment it reaches an environment where that variable was never set.

</details>

<details>
<summary>Why not just test changes directly in production?</summary>

Mistakes in production affect real users immediately, and some, like corrupting live data, are hard to undo. Staging catches problems while the cost of being wrong is still low.

</details>

<details>
<summary>A client says a feature works in their test environment but fails for customers. What do you check first?</summary>

What actually differs between the two environments: configuration, environment variables, the dataset, and any outside service the app depends on, rather than assuming the code is wrong.

</details>

## Learn more

- Article: [The Twelve-Factor App](https://12factor.net/) (12factor.net, reference).
- Article: [Docker Get Started](https://docs.docker.com/get-started/) (Docker, 2 to 3 hours).

## Related

- [Images, Containers, Registries](./01-images-containers-registries.md)
- [Configuration](./06-config-and-env-vars.md)
- [Integration Failure Diagnosis](../03-apis-data-integration/07-diagnosing-integration-failures.md)
