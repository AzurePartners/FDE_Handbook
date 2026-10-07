---
title: PII/PHI Handling & Compliance Basics (SOC 2, GDPR, HIPAA)
row: M4-L3.6
---
**In one sentence:** Personal and health data must be minimized, protected, and kept within legal limits on what may be stored, logged, or sent to a model API, and an FDE needs baseline awareness of SOC 2, GDPR, and HIPAA to work safely on Healthcare and Finance engagements.

## What it is

**PII** is data identifying a person; **PHI** is health data (a stricter subset); financial data is similarly sensitive. Handling it responsibly means **minimization** (move only what's needed), **masking/tokenization** where full values aren't required, **encryption** in transit and at rest, tight access control, and being deliberate about where it goes, especially not leaking it into logs or sending it to a model API whose terms allow training or retention. The frameworks differ in kind: **SOC 2** is a *voluntary* AICPA audit/attestation of your security controls (not a law, but a common enterprise ask), **GDPR** (EU personal-data rights and duties: lawful basis, deletion, and rules for *transferring* data out of the EU via adequacy decisions or Standard Contractual Clauses — note GDPR does **not** require data to physically stay in the EU), **HIPAA** (US health data; requires safeguards and a signed Business Associate Agreement with anyone touching PHI, including the model provider).

## Why an FDE needs this

In healthcare and finance, compliance is the gate: a hospital won't deploy a feature touching PHI without HIPAA safeguards and a BAA; an EU customer expects GDPR compliance; security review often starts with "send us your SOC 2." Sending regulated data to a non-compliant endpoint, or logging it, is an incident, not a bug. Baseline awareness lets you design something that can actually ship in these domains.

## Key concepts

- **Minimize:** send only the fields the task needs; don't move whole records "just in case."
- **Mask/tokenize & encrypt:** reduce identifiability; protect in transit and at rest.
- **Don't leak to logs or prompts:** strip PII/PHI before logging or sending to a model.
- **Model-provider terms:** confirm no training/retention (or use a compliant tier) before sending regulated data; get a BAA for PHI.
- **SOC 2 / GDPR / HIPAA:** know which apply and their core requirements (voluntary controls attestation / data-subject rights + transfer rules / PHI safeguards + BAA).

## Common misconceptions

- **"Sending data to an LLM is like any API call."** It may leave your trust boundary; check terms and minimize/mask first; PHI needs a BAA.
- **"Compliance is legal's problem."** Many requirements are engineering controls, access, encryption, logging, retention, that you build.
- **"A compliant provider makes us compliant."** Compliance is shared; your app must implement its share and hold the right agreements (BAA/DPA).

## Typical interview questions

<details>
<summary>A hospital wants your AI feature to process patient data. What compliance concerns arise?</summary>

It's PHI under HIPAA, so it needs safeguards, access control, encryption, audit logging, minimization, and a signed Business Associate Agreement with every subprocessor that touches it, including the model provider, which must offer a HIPAA-eligible service. I'd confirm a BAA is in place before any PHI is sent.

</details>

<details>
<summary>What's the minimum you check before sending customer data to a model API?</summary>

That I'm sending the least data needed (minimized, masked where possible), that no PII/PHI is going where it shouldn't, and what the provider does with it per their data terms, whether they train on or retain inputs, preferring a no-training/zero-retention or enterprise tier for anything sensitive, with a BAA/DPA where required.

</details>

## Learn more

- Article: [OWASP LLM02: Sensitive Information Disclosure](https://genai.owasp.org/llm-top-10/) (what not to store, log, or send to a model)
- Note: for a Healthcare/Finance engagement, confirm the applicable framework (SOC 2 / GDPR / HIPAA) and its core duties before touching data.

## Related

- [Secret Management & Rotation](../02-authentication-authorization-rbac-and-secrets/03-secret-management-environment-variables-and-rotation.md)
- [Freshness Gates, Provenance & Lineage](./02-freshness-gates-provenance-and-data-lineage.md)
