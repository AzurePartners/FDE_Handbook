---
title: Dependency Risk
row: M1-L4.4
---
**In one sentence:** A dependency is code someone else wrote that your project relies on, and dependency risk is the chance that code has a known security problem you never reviewed yourself.

## What it is

Almost no project is written entirely from scratch. A Python project might import a dozen packages with `pip`, and a JavaScript project might pull in hundreds through `npm`, each one bringing its own code, and each one's own dependencies, into your project. Every package your code imports is code you did not write and, realistically, never fully read, and some published versions have known vulnerabilities, security problems already discovered and documented, but not yet fixed in the version you installed.

A dependency scanner checks your installed packages against a database of known vulnerabilities and reports which ones are affected and which version fixes the issue:

```
pip-audit          # checks installed Python packages for known vulnerabilities
npm audit           # checks a Node project's locked dependencies for known vulnerabilities
```

Both report the same shape of thing: an affected package, the vulnerability found, and the version that resolves it. Neither tool reviews the code itself; they compare version numbers against a list of known issues.

## Why an FDE needs this

An AI coding tool suggests a package the same way it suggests a function name, based on what appears often in code it has seen, with no awareness of whether that package's current version has a known issue. New vulnerabilities are also discovered in existing, previously clean packages on an ongoing basis, so a dependency that was safe when a project started can have a known issue by the time it deploys. Running a scanner close to deploy, not just once at setup, catches problems introduced since the project began.

## Key concepts

### When to run a scanner

Run one before a deploy, not only once during initial setup, since the vulnerability database it checks against changes over time even if your code and dependencies do not. Many teams also run one automatically on every pull request, so a newly introduced or newly vulnerable package is caught before it merges.

### Popularity is not a safety signal

A package with millions of downloads can still have a known vulnerability in a specific version. Scanners check version numbers against a database of disclosed issues, not how widely used or well-regarded a package is, because reputation says nothing about a specific version.

## Common misconceptions

- **"A package with millions of downloads is automatically safe."** Popularity is not a security guarantee. Known vulnerabilities show up in widely used packages regularly, which is why a scanner checks specific versions, not reputation.
- **"Running a scanner once at project setup is enough."** New vulnerabilities are discovered in existing packages on an ongoing basis. A dependency that was clean at setup can have a known issue by deploy time.
- **"An AI tool would not suggest a vulnerable package."** An AI suggests packages based on how often they appear in code it has seen, with no live check against a vulnerability database. That check is a separate step you still have to run.

## Typical interview questions

<details>
<summary>Why run pip-audit or npm audit before a deploy, not just once at setup?</summary>

New vulnerabilities are discovered in existing packages on an ongoing basis, so a dependency that was clean at setup can have a known issue by deploy time. Scanning close to deploy catches problems introduced since the project started.

</details>

<details>
<summary>What does a dependency scanner actually check, and what does it not check?</summary>

It checks installed package versions against a database of known, disclosed vulnerabilities and reports which are affected and which version fixes them. It does not read or review the package's actual code, so an unknown, undisclosed problem would not show up.

</details>

<details>
<summary>A scanner flags a vulnerable package your project depends on. What do you do?</summary>

Check whether a newer version fixes the issue and upgrade to it if the change is safe to make. If no fix exists yet, evaluate whether the vulnerable code path is actually reachable in your usage, and consider a temporary workaround or an alternative package.

</details>

## Learn more

- Article: [OWASP Secure Coding with AI](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html) (OWASP, about 30 min)

## Related

- [Least Privilege](./11-least-privilege.md)
- [Input Validation](./10-input-validation.md)
