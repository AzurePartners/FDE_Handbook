---
title: "Requirement Types: Functional, Non-Functional & Constraints"
row: M5-L4.3
---
**In one sentence:** Requirements come in three kinds, functional (what it must do), non-functional (how well: speed, reliability, security), and constraints (fixed limits like data access, security, timeline), and classifying each and placing it in the PRD/SOW prevents shipping a feature that works but can't be deployed.

## What it is

**Functional requirements** describe behavior ("must answer billing questions," "must escalate refunds over $100"). **Non-functional requirements (NFRs)** describe qualities ("responds under 3s at p95," "99.9% uptime," "data encrypted"). **Constraints** are non-negotiable limits ("must run in the customer's region," "must pass security review," "must integrate with system X," "live in 6 weeks"). Each type is captured and placed appropriately: functional and NFRs in the PRD (and acceptance criteria), constraints often in both PRD and SOW. Teams reliably capture functional requirements and under-capture NFRs and constraints, then discover too late that a working feature is too slow, insecure, or non-compliant to ship.

## Why an FDE needs this

The features are the obvious part; the NFRs and constraints decide whether the feature can actually be deployed in the customer's environment. A correct-but-30-second, or correct-but-sends-PHI-to-a-non-compliant-endpoint feature has met its functional requirements and still failed. Capturing all three types during scoping, and writing NFRs as testable, is what keeps you from a late, expensive surprise.

## Key concepts

| Type | Question | Examples | Where |
| --- | --- | --- | --- |
| Functional | What must it do? | Answer Qs; escalate big refunds | PRD, acceptance |
| Non-functional | How well? | <3s p95, 99.9%, encrypted | PRD, acceptance |
| Constraints | Within what limits? | Region, security review, timeline, integrate with X | PRD + SOW |

- **NFRs must be testable:** "fast" isn't a requirement; "under 3s at p95" is.
- **Constraints shape the design space:** capture them before designing.

## Common misconceptions

- **"Requirements = the feature list."** That's only the functional part; NFRs and constraints decide deployability.
- **"NFRs are vague nice-to-haves."** They're testable, hard requirements (latency, security, scale) that can block launch.
- **"Constraints emerge as you go."** The important ones (region, compliance, timeline) belong in scoping; late discovery forces redesign.

## Typical interview questions

<details>
<summary>What are the three requirement types, and which get missed?</summary>

Functional (what it must do), non-functional (how well, latency, reliability, security, scale), and constraints (fixed limits like region, compliance, integration, timeline). Teams reliably capture functional requirements and under-capture NFRs and constraints, then find late that a working feature is too slow, insecure, or non-compliant to deploy.

</details>

<details>
<summary>Turn "it should be fast and secure" into real requirements.</summary>

Make them testable NFRs: "responds under 3 seconds at the 95th percentile under expected load" and "all data encrypted in transit and at rest, no PII sent to the model provider, passes the customer's security review." Vague qualities can't be verified or accepted against; concrete NFRs can.

</details>

## Learn more

- Article: [Product requirements](https://www.atlassian.com/agile/product-management/requirements) (Atlassian; where each requirement type lives in the doc)
- Docs: [Define success criteria](https://platform.claude.com/docs/en/test-and-evaluate/define-success) (turning non-functional needs into measurable criteria)

## Related

- [PRD vs SOW](./02-prd-vs-sow.md)
- [Working Inside Customer Environments](../01-the-fde-role-and-end-to-end-delivery-lifecycle/05-working-inside-customer-environments.md)
