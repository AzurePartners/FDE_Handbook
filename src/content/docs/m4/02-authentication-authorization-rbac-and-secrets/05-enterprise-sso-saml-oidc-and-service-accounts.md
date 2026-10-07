---
title: Enterprise SSO (SAML/OIDC) & Service Accounts
row: M4-L2.5
---
**In one sentence:** Enterprise single sign-on lets employees authenticate through the company's identity provider using SAML or OIDC, and service accounts are non-human identities for machines, an FDE's integration almost always authenticates as a service account, not as a person.

## What it is

**SSO** centralizes login at an **identity provider (IdP)** like Okta or Microsoft Entra ID; apps trust the IdP to authenticate users. **SAML** (older, XML-based) and **OIDC** (newer, JSON/JWT, built on OAuth) are the two protocols that make this work; you integrate with whichever the customer's IdP uses. Separately, a **service account** is a non-human identity with its own credentials and scoped permissions, used by backends, jobs, and integrations. The important distinction: when *your integration* calls a system with no user present, it authenticates as a service account (machine identity), not by impersonating a person.

## Why an FDE needs this

Customers require employee-facing apps to use their SSO rather than separate passwords, so you'll configure a SAML/OIDC trust with their IdP (exchange metadata, map attributes/groups, test the redirect). And your backend integrations need service accounts with least-privilege permissions, set up and secured like any credential. Getting these right is often a hard requirement for an enterprise deployment to be approved at all.

## Key concepts

- **IdP:** central authenticator (Okta, Entra ID); apps trust it.
- **SAML vs OIDC:** two SSO protocols; support whichever the customer's IdP uses.
- **Attribute/group mapping:** pass email and group membership so the app can authorize.
- **Service account:** machine identity for integrations/jobs; scoped, secret-stored, rotated.
- **Integration authenticates as a service, not a person:** don't reuse a human's login for automation.
- **SCIM (related):** provisioning/deprovisioning accounts, separate from login.

## Common misconceptions

- **"SSO is just a shared password."** Users authenticate at the IdP; apps never see a password.
- **"Automation can use my login."** Integrations should use a service account, so access is scoped, auditable, and survives the person leaving.
- **"SAML and OIDC are interchangeable drop-ins."** Same goal, different protocols/config; you implement whichever the IdP supports.

## Typical interview questions

<details>
<summary>Why does an FDE integration usually authenticate as a service account rather than as a person?</summary>

Because it runs unattended and shouldn't depend on a human's credentials, which are broader, tied to that person, and disappear when they leave. A service account gives the integration its own scoped, least-privilege, auditable identity that can be rotated and governed independently.

</details>

<details>
<summary>What's involved in integrating an app with a customer's SSO?</summary>

Establishing a trust with their identity provider using SAML or OIDC, whichever they use: exchanging metadata, configuring the redirect/callback, and mapping attributes like email and group membership so the app can authenticate users and authorize them by group. Then testing the login end to end.

</details>

## Learn more

- Video: [OAuth 2.0 & OpenID Connect in plain English](https://www.youtube.com/watch?v=996OiexHze0) (Nate Barbettini, Okta; the OIDC half applies here)
- Article: [Authorization vs Authentication](https://www.oauth.com/oauth2-servers/openid-connect/authorization-vs-authentication/) (oauth.com; service vs. user identity)

## Related

- [Authentication vs Authorization](./01-authentication-vs-authorization-keys-oauth-sessions-and.md)
- [Secret Management & Rotation](./03-secret-management-environment-variables-and-rotation.md)
