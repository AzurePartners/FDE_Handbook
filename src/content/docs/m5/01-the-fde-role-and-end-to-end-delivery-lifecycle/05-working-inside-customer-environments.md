---
title: Working Inside Customer Environments
row: M5-L1.5
---
**In one sentence:** FDE work happens in the customer's world, their systems, data access, permissions, and test environments, and the practical skill is obtaining access early and unblocking the typical obstacles (provisioning delays, security review, missing test data) before they stall the build.

## What it is

Unlike greenfield work in your own environment, FDE delivery runs inside the customer's: their infrastructure, their **data access** (which you must request and be granted), their **permissions** (least-privilege service accounts, security review), and their **test environments** (a safe place to build and try things without touching production). Getting set up is itself a workstream: access provisioning often takes days or weeks, security review gates what you can touch, and a usable test environment with realistic data may not exist yet. The skill is anticipating these blockers and clearing them early.

## Why an FDE needs this

"We'll get access when we need it" is how builds stall, credentials aren't ready, the review isn't done, there's no test environment, or the test data is unusable. Discovering this mid-build forces expensive waiting or redesign. An FDE requests access on day one, confirms a test environment exists, and treats setup obstacles as the first thing to unblock, not an afterthought.

## Key concepts

- **Data access:** request least-privilege access early; provisioning is often the long pole.
- **Permissions & security review:** know what must pass review and what you may touch.
- **Test environment:** a non-production place to build/try safely, with realistic (safe) data.
- **Typical blockers:** slow provisioning, missing test data, review backlogs, unclear ownership.
- **Unblock early:** identify the owner of each blocker and start the clock immediately.

## Common misconceptions

- **"Access is a quick ticket."** It often involves security review and approvals taking days to weeks; start day one.
- **"I'll build against production."** You need a safe test environment; building against prod risks real damage.
- **"The test data will be there."** Realistic, safe test data often has to be arranged; confirm it early.

## Typical interview questions

<details>
<summary>What do you set up first when starting in a customer's environment, and why?</summary>

Access and a test environment. I request least-privilege data access and credentials on day one because provisioning and security review are slow, and I confirm there's a non-production environment with realistic, safe data to build against. These are the most common things that stall a build, so I unblock them before they block me.

</details>

<details>
<summary>You're mid-build and realize you lack access to a needed data source. What went wrong?</summary>

Access should have been requested and confirmed during discovery/setup; assuming it was the gap. Now I'd request it immediately through the right owner and, in parallel, look for a sanctioned alternative (a warehouse copy, an existing integration) so I'm not fully blocked, while being transparent about the timeline impact.

</details>

## Learn more

- Article: [A Day in the Life of a Palantir FDSE](https://blog.palantir.com/a-day-in-the-life-of-a-forward-deployed-software-engineer-45ef2de257b1) (working inside enterprise environments)
- Article: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (the least-privilege access you'll request)

## Related

- [Enterprise SSO & Service Accounts](../../m4/02-authentication-authorization-rbac-and-secrets/05-enterprise-sso-saml-oidc-and-service-accounts.md)
- [Discovery Interviews](../02-customer-discovery-and-stakeholder-interviews/01-discovery-interviews.md)
