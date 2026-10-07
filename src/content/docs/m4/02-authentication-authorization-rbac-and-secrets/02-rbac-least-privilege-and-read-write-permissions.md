---
title: RBAC, Least Privilege & Read/Write Permissions
row: M4-L2.2
---
**In one sentence:** Role-Based Access Control grants permissions through roles, least privilege means giving each identity only the access it needs, and distinguishing read from write access is the most basic and important line, especially for what different agents and users can view versus execute.

## What it is

**RBAC** groups permissions into roles (viewer, editor, admin) assigned to users or service accounts. **Least privilege** (minimum access, shortest time, deny-by-default) is covered as a general principle in Module 1 ([Least Privilege](../../m1/04-git-debugging-testing-security/11-least-privilege.md)); here the focus is RBAC and the agent read/write split. The **read vs write** distinction is the first cut of least privilege: an agent that only needs to look things up should have read-only access and no ability to change or delete. For AI systems specifically, you decide what each agent or user can *view* (read) and what it can *execute* (write/act), and you keep those as narrow as the task allows.

## Why an FDE needs this

You'll define the permissions your integration and its agents hold. Over-granting, especially write/execute access an agent doesn't need, is the top security finding and the biggest blast-radius risk if the agent is manipulated or buggy. Designing read-only where possible and scoping writes tightly is what gets an integration approved and keeps a mistake from becoming a disaster.

## Key concepts

- **Role:** a named bundle of permissions assigned to identities.
- **Least privilege:** minimum access, shortest time, deny by default.
- **Read vs write/execute:** grant read-only unless the task genuinely needs to change or act.
- **Per-agent scoping:** different agents get different, minimal permission sets.
- **Scope down over time:** start narrow; widen only on a proven need.

## Common misconceptions

- **"Give broad access now, tighten later."** "Later" rarely comes; broad grants become permanent risk.
- **"An agent needs write access to be useful."** Many agents only need to read and recommend; writes should be separate and gated.
- **"Least privilege slows delivery."** It prevents the incident that would slow delivery far more.

## Typical interview questions

<details>
<summary>What is least privilege and how does it apply to an AI agent?</summary>

Give each identity only the access it needs, deny by default. For an agent, that means read-only access where it only needs to look things up, tightly scoped write/execute permissions only for the specific actions it must take, and separate, narrower roles per agent, so a bug or manipulation can't reach more than the task requires.

</details>

<details>
<summary>Why separate read from write access for an agent?</summary>

Because reading is low-risk and writing/executing is where real damage happens. An agent that only needs information should never be able to change or delete data. Separating them limits blast radius, an error or a prompt-injection can't cause writes the agent was never granted.

</details>

## Learn more

- Article: [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) (deny by default, RBAC vs. ABAC)
- Article: [OWASP LLM06: Excessive Agency](https://genai.owasp.org/llm-top-10/) (minimal tools & permissions per agent)

## Related

- [Module 1 → Least Privilege](../../m1/04-git-debugging-testing-security/11-least-privilege.md) (the general principle)
- [Authentication vs Authorization](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [Human-in-the-Loop Tied to Permissions](./04-human-in-the-loop-tied-to-permissions.md)
