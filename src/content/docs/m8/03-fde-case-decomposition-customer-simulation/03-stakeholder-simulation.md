---
title: Stakeholder Simulation
row: M8-L3.3
---
**In one sentence:** The client-simulation round puts you across the table from a role-played skeptic, technical owner, or business owner, and scores whether you change how you explain, what you commit to, and how you push back for each one — without changing what is true.

## What it is

An interviewer plays a customer stakeholder, sometimes friendly and sometimes deliberately frustrated or non-technical, and gives you a task: present the version-one proposal, explain why the assistant cannot guarantee 100% accuracy, deliver a three-week slip to a CTO, or decline a feature that would break data governance. The three personas that recur are the **skeptic** ("we tried AI last year and it hallucinated"), the **technical owner** ("who gets credentials, what runs in my VPC, what is your rollback"), and the **business owner** ("what does this cost, when do I see value, what happens to my team"). Each needs a different first sentence.

## Why an FDE needs this

Most of an FDE's week is conversation, and the interviewer is deciding whether they can put you in a room with a customer unsupervised. The scored behaviors are: ask diagnostic questions before proposing, acknowledge what the stakeholder is right about before pushing back, offer options with explicit trade-offs, use ownership language ("I will have this by Friday," not "the team is looking into it"), and never promise what you cannot deliver. Candidates who treat this round as soft fail it at surprising rates.

## Key concepts

### One truth, three framings

| Persona | What they need first | What convinces them | What loses them |
|---|---|---|---|
| Skeptic | Acknowledgment of the previous failure and what is different now | Evidence: the eval set, the refusal path, the pilot with a stopping rule | Enthusiasm, jargon, promises of accuracy |
| Technical owner | Boundaries: what touches their systems, with what permissions | Trust boundaries drawn, least privilege, rollback, logs they can read | Vagueness about credentials and data flow |
| Business owner | The baseline, the number that moves, the cost and the date | Options with trade-offs, a go/no-go gate, honest evidence strength | Model metrics presented as business value |

### Acknowledge, diagnose, own

Acknowledge the concern in their words; diagnose with one or two questions; own the next step with a name and a date. This works for pushback, bad news, and objections alike.

### Delivering bad news

Early, with the cause, with options, with a path. "We are three weeks behind because the data feed we were promised is not available in the sandbox. Two options: we build against a sample export and accept a reconciliation step at cutover, or we hold the date and I escalate the feed with your data team this week. I recommend the first; I will confirm the sample by Thursday."

### Saying no without losing the relationship

Name what they are right about, state the principle you will not cross (governance, safety, a written non-goal), and offer the nearest thing you can do. "You are right that the reps need this data. I cannot send customer PII to the model provider under your policy; I can redact and match on a hashed ID, which gets you 90% of the value."

### Calibrated commitments

Say what you will do, by when, and what would make it slip. Overpromising in this round is scored as a trust failure, not as enthusiasm.

## Common misconceptions

- **"The technical persona wants more architecture."** They want boundaries and operability. Lead with permissions and rollback, not with components.
- **"The skeptic needs to be convinced."** The skeptic needs to be heard first. Arguing back before acknowledging their experience ends the conversation.
- **"Ownership language is bragging."** It is accountability. "I" for what you will do is what a customer needs to hear; "we are looking into it" is what they have heard from every vendor.

## Typical interview questions

<details>
<summary>The customer's VP says "I need this to be 100% accurate." What do you say?</summary>

Acknowledge why they need that (regulatory exposure, brand risk), then reframe from accuracy to risk: no system that reads free text is 100%, including the current human process; the design puts deterministic checks where errors are unacceptable, a refusal path where evidence is missing, and a human approval where an action is irreversible. Offer a measurable target on the eval set and a pilot that proves it before anyone relies on it.

</details>

<details>
<summary>The IT owner will not give you production credentials. How do you unblock?</summary>

Ask what they are protecting against; propose least privilege — a service account with read-only scope on the two tables you need, in their VPC, with their logging; offer to work from a masked export first; and name who on their side can approve. Do not argue for broad access.

</details>

<details>
<summary>The deployment slipped three weeks. Tell the CTO.</summary>

Cause, impact, options, recommendation, next checkpoint — in that order, in under a minute. Then stop talking and let them respond.

</details>

## Learn more

- Article: [Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde) (Aced) — client-simulation scenarios and strong patterns
- Article: [Forward Deployed Engineer (FDE) Interview Questions Guide](https://fde.academy/blog/forward-deployed-engineer-interview-questions) (FDE Academy) — the client-simulation round and the acknowledge/diagnose/own framing
- Reference: [Stakeholder analysis guide](https://www.atlassian.com/software/confluence/resources/guides/how-to/stakeholder-analysis) (Atlassian) — power × interest mapping, tailoring the message
- Reference: [Anthropic Forward Deployed Engineer Interview Guide](https://www.theforwarddeployed.io/interviews/anthropic) — how the customer-conversation simulation is described publicly

## Related

- [Live Scoping](./02-live-scoping.md)
- [Handling Unknowns](./04-handling-unknowns.md)
- [STAR and Project Deep Dives](../04-role-matching-narrative-job-search/03-star-and-project-deep-dives.md)
