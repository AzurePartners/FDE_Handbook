---
title: Known Limitations and Fix List
row: M7-L4.4
---
**In one sentence:** Known limitations are the problems you did not fix, written down honestly, paired with a prioritized list of what to fix next.

## What it is

After hardening, some failures remain. You will not fix everything inside the practicum, and pretending otherwise misleads the client. This page's deliverable is a short document that says what the system cannot do reliably, who it affects, how to work around it, and what should be fixed first. How to write limitations well is covered in [Documenting Known Limitations](../../m2/12-safety-guardrails-hitl/09-known-limitations.md) (M2).

## Why an FDE needs this

A client who discovers an undisclosed limit loses trust in everything else you said. A client who read it in advance can plan around it. For the Course Support Assistant, saying "answers about older course versions may be incomplete" lets support staff double-check those cases.

## Key concepts

### What you produce

| ID | Limitation | Evidence | Impact | Workaround | Fix priority |
|---|---|---|---|---|---|
| L-1 | Cannot answer questions about courses discontinued before the catalog snapshot | Run 031, course missing from snapshot | Medium: learner may get no answer | Escalate to support staff | High |
| L-2 | Scanned PDF policies are not parsed | Run 010 | Low: two documents affected | Staff retype key sections | Medium |
| L-3 | Does not handle questions in languages other than English | Not tested | Unknown | State in the interface | Low |

Rank the fix list by impact and by effort. Include items you did not test, marked as untested.

### Pass bar

- Each limitation links to evidence, such as an eval case ID, or is marked untested.
- Each has a workaround a client user could actually follow.
- Fix priorities are ordered and justified in one phrase.
- No limitation is hidden in a footnote.

## Common misconceptions

- **"Listing limitations makes my work look weak."** It shows you understand the system. Hidden problems look worse when found.
- **"A limitation is just a bug I have not gotten to."** Some are by design, such as items placed outside the MVP. Mark which kind each one is.

## Typical interview questions

<details>
<summary>What did you ship with unresolved, and how did you communicate it?</summary>

Name your real remaining failures. I listed each with its evidence, workaround and priority, and reviewed the list with the client before release.

</details>

<details>
<summary>How did you decide what to fix first?</summary>

By user impact, then effort. A medium-impact gap that affects many learners outranks a low-impact edge case that is expensive to fix.

</details>

## Learn more

- Paper: [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) (Mitchell et al., arXiv), a format for stating where a model should not be used.

## Related

- [Targeted Hardening](./03-targeted-hardening.md)
- [Release Candidate](../05-proxy-testing-release-candidate/04-release-candidate.md)
- [Handoff Package Submission](../06-demo-handoff-postmortem/03-handoff-package-submission.md)
- [Documenting Known Limitations](../../m2/12-safety-guardrails-hitl/09-known-limitations.md) (M2)
