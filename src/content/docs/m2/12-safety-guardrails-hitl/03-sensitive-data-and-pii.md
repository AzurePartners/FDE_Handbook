---
title: Sensitive Data and PII Protection
row: M2-L6.3
---
**In one sentence:** Sensitive data protection means keeping personal information and confidential business data out of every place an AI feature does not need it, from the prompt and provider to logs, traces and replies.

## What it is

PII (personally identifiable information) identifies a person, directly (name, government ID, email, phone number) or in combination (ZIP code plus birth date). Health and biometric data get extra protection under laws such as GDPR, and US health records under HIPAA. Confidential data need not be personal: source code, pricing, legal advice.

A prompt is like briefing an outside temp: give them the claim number and status, not the customer's diagnosis "just in case."

Every channel the data touches can leak it. OWASP's 2026 Top 10 for LLM Applications (LLM02, Sensitive Information Disclosure) treats tool-call arguments, reasoning traces, retrieved chunks, logs and embeddings as outputs needing the same redaction rules as the answer.

## Why an FDE needs this

An insurer's claims assistant answers "what is my claim status?" Its prototype puts the whole customer record, bank details and diagnoses included, into every prompt. The tracing tool stores full prompts where 40 engineers can read them, and the "redacted" sample PDFs have black boxes drawn over text still in the file. Nobody has read the provider contract. The demo passes anyway. (Illustrative scenario.)

Often only the FDE sees the whole data path, from database to provider to logs.

## Key concepts

### Minimize first

Data the model never receives cannot leak. Build each prompt from an allow-list of fields per task (claim status, dates, amounts), and minimize output too (only a card's last four digits). A system-prompt line saying "never reveal personal data" is not a control.

### Detect in layers

Pattern and checksum detectors catch well-formed card numbers and emails. Named entity recognition (NER), a model that tags names and places in free text, catches what patterns miss. Open-source Presidio (originally from Microsoft) combines both; Azure, Google Cloud and AWS offer managed equivalents. No detector finds everything, so measure recall (the share of real PII caught) on the client's own text.

### Redact, mask or pseudonymize

| Technique | Example | Reversible? |
|---|---|---|
| Redact | `555-0142` becomes `<PHONE_NUMBER>` | No |
| Mask | Card shown as `**** 4242` | No |
| Pseudonymize | `Jane Doe` becomes `[PERSON_1]` | Yes, via a mapping on your server |

Pseudonymization is a coat-check ticket: the model sees only `[PERSON_1]`, and your server swaps the name back for entitled users.

Pseudonymized data is still personal data under GDPR. A well-known 2000 study estimated that ZIP code, gender and birth date single out about 87% of Americans, so leave "is this anonymous?" to the client's privacy team.

### Leak paths beyond the answer

- **Logs and traces.** Many tracing tools capture full prompts by default, though OpenTelemetry's GenAI conventions recommend opt-in capture. Mask before logging; keep full content in a restricted, short-retention store.
- **Copies and shared links.** Eval sets, fine-tuning data and vector stores built from production chats, and share links (OWASP cites over 4,500 shared conversations indexed by Google in 2025).
- **Fake redaction.** A box drawn over PDF text leaves the text the model reads. Remove the text and verify.

### Provider retention checklist

"Not used for training" is not "not stored." Major commercial APIs do not train on API data by default, but may keep abuse-monitoring logs, stateful feature data (stored responses, files) and flagged content (Anthropic: up to two years, even under zero data retention). Terms change, so check current docs and the signed contract: training use, retention, zero data retention eligibility, processing region, and for health data a Business Associate Agreement (BAA) covering the features used.

## Common misconceptions

- **"We use the enterprise API, so we don't need to redact."** Providers may still keep some data, and your own logs are usually the bigger leak.
- **"A good regex catches all personal data."** It misses names in free text and encoded text. Add entity recognition.
- **"Hashing names or swapping them for IDs makes data anonymous."** That is pseudonymization, reversible with the mapping or by brute force.

## Typical interview questions

<details>
<summary>What counts as sensitive data in an AI application?</summary>

Personal data that identifies someone directly or in combination, special categories such as health, and confidential business data such as source code. I classify it before deciding what the model sees.

</details>

<details>
<summary>What is the difference between redaction, masking and pseudonymization?</summary>

Redaction removes a value or swaps in a type label. Masking hides part of it, such as all but four digits. Pseudonymization swaps in a consistent token that a server-side mapping can reverse.

</details>

<details>
<summary>Design the data flow for a support assistant whose tickets contain names and card numbers.</summary>

Allow-list prompt fields and never send card numbers. Replace names with placeholders, restored only for entitled users. Mask logs, check outputs, and confirm provider terms with the client.

</details>

<details>
<summary>Your traces have stored customer phone numbers for three months. What do you do?</summary>

Add a masking hook and confirm new traces are clean. Tell the client's privacy owner at once, since this may trigger their incident process, and purge under their direction. Seeded fake PII in tests catches regressions.

</details>

## Learn more

- Reference: [LLM02:2026 Sensitive Information Disclosure](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM02_SensitiveInformationDisclosure.md) (OWASP GenAI Security Project, about 20 min)
- Reference: [Presidio: Data Protection and De-identification SDK](https://github.com/data-privacy-stack/presidio) (Presidio project, GitHub, about 10 min)
- Reference: [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) (Anthropic, about 15 min)

## Related

- [Regular Expressions (Regex) and Checksums](../10-tool-calling-deterministic-logic/04-regular-expressions.md)
- [Input and Output Guardrails](./01-input-and-output-guardrails.md)
- [Programmatic LLM Interfaces (Inputs, Outputs, Errors, Retries, Logs)](../07-llm-application-foundations/08-programmatic-llm-interfaces.md)
- [Secrets Management: Env, .gitignore, Rotation](../../m1/04-git-debugging-testing-security/09-secrets-management.md)
