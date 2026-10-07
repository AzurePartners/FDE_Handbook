---
title: Discovery Pack
row: M7-L1.2
---
**In one sentence:** The Discovery Pack is the bundle of five short documents that proves you understand the customer's problem, people, current workflow, knowledge gaps and dependencies before you design anything.

## What it is

Discovery is the listening phase. You talk to the people who live with the problem, map how work happens today, and write down what you still do not know. The Discovery Pack is what you hand to a reviewer to show that work was done.

For the Course Support Assistant, discovery means talking to a support lead, a course coordinator and a sample of students, then reading the existing FAQ, refund policy and a batch of past tickets. Interview technique itself is covered in [Discovery Interviews](../../m5/02-customer-discovery-and-stakeholder-interviews/01-discovery-interviews.md) and [Questioning Technique](../../m5/02-customer-discovery-and-stakeholder-interviews/02-questioning-technique-5-whys-facts-vs-opinions-vs-incentives.md) (M5). This page covers what you must produce.

## Why an FDE needs this

Teams that skip discovery build for the stated request, not the real problem. A support lead may ask for "a chatbot", while the real pain is that refund rules live in three conflicting documents. Without a pack, nobody notices until the demo, when the assistant confidently quotes the outdated one.

## Key concepts

### What you produce

Five items, each one page or less:

| Item | Contents | Concept page |
|---|---|---|
| Stakeholder map | Who decides, who uses, who is affected, who blocks | [Stakeholder Mapping](../../m5/02-customer-discovery-and-stakeholder-interviews/03-stakeholder-mapping.md) (M5) |
| Problem brief | The approved brief, updated with interview findings | [Project Selection](./01-project-selection.md) |
| As-is workflow | Actors, steps, inputs, outputs, decisions, handoffs | [Mapping a Workflow](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/01-mapping-a-workflow-actors-steps-inputs-outputs-decisions.md) (M5) |
| Domain knowledge gaps | Terms and rules you do not yet understand, with who can explain | none |
| Data and permission dependencies | What data, who owns it, access status, sensitivity | [PII/PHI Handling](../../m4/03-real-world-data-quality-freshness-provenance-and-entity/06-pii-phi-handling-and-compliance-basics-soc-2-gdpr-hipaa.md) (M4) |

A minimal knowledge gap row looks like this:

```
Gap: How are partial refunds calculated after week 2?
Why it matters: assistant must not guess a number
Who can answer: finance coordinator
Status: open, asked on day 3
```

A minimal dependency row:

```
Data: past support tickets (last 6 months)
Owner: support lead
Access: sample of 100 anonymized tickets received
Sensitivity: contains student names, must be removed
```

### Pass bar

A reviewer accepts the pack when:

- At least two real people, stakeholders or qualified proxies, were interviewed (the customer organization may be fictional), and the notes show facts separated from opinions.
- The as-is workflow can be followed by a stranger and shows where time is lost.
- Every open gap has a named person who can resolve it.
- Every data source has an owner and an access status, and sensitive fields are flagged.
- The pack contains no solution design. Design belongs to Architecture.

## Common misconceptions

- **"Discovery means one kickoff meeting."** One meeting gives you the sponsor's view. You also need the daily users, because they know where the process actually breaks.
- **"If I do not understand the domain, I should hide that."** The opposite. A visible gap list with owners is a strength. Hidden gaps become wrong answers in production.
- **"Data access can wait until build."** Missing or restricted data is the most common reason an Alpha stalls. Record status now.

## Typical interview questions

<details>
<summary>How did you validate that you understood the customer's problem?</summary>

I interviewed a support lead and two proxy students, then mapped the as-is workflow and checked it back with the lead. The map showed agents answering the same refund and schedule questions manually. Confirming that map with a stakeholder was my validation.

</details>

<details>
<summary>What domain gaps did you find and how did you close them?</summary>

I kept a gap table with an owner for each item. For example, I did not know how partial refunds work, so I asked the finance coordinator and recorded the answer with its source. Anything unanswered became an explicit limitation.

</details>

<details>
<summary>What would you do if the customer cannot share the data?</summary>

I would ask for a small anonymized or synthetic sample that preserves structure, and flag the dependency as a risk. If even that is blocked, I would raise it at the [Go / No-Go Decision](./04-go-no-go-decision.md) rather than build on guesses.

</details>

## Learn more

- Book chapter: [Principles of Shaping](https://basecamp.com/shapeup/1.1-chapter-02) (Shape Up, Basecamp, free online).

## Related

- [Project Selection](./01-project-selection.md)
- [Project Validation](./03-project-validation.md)
- [Stakeholder Mapping](../../m5/02-customer-discovery-and-stakeholder-interviews/03-stakeholder-mapping.md) (M5)
- [As-Is vs To-Be](../../m5/03-as-is-to-be-workflow-mapping-and-requirement-decomposition/04-as-is-vs-to-be-documenting-the-process-change.md) (M5)
