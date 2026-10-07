---
title: Release Candidate
row: M7-L5.4
---
**In one sentence:** A release candidate is the version you believe is ready to hand over, frozen and labeled, with its evidence, open issues, and next steps written down.

## What it is

After proxy testing, triage, and regression reruns, you stop changing things and name one build: `rc1`. From this point only blocking fixes go in, and each one creates `rc2`. The release candidate is what you demo and hand off.

The Course Support Assistant rc1 is a specific combination: a prompt version, a document set as of a date, a model and settings, and a configuration. Recording these is covered in [Version Records](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md) and the build, test, deploy, rollback cycle in [Build, Test, Deploy & Rollback](../../m4/05-deployment-ci-cd-observability-and-production-readiness/01-build-test-deploy-and-rollback-ci-cd-basics.md) (M4). Where this sits on the demo, MVP, pilot ladder is in [Demo to Production Maturity Ladder](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md) (M4).

Label it by that ladder. A practicum tested only with proxy users is below MVP, or MVP at most. Call it a Pilot only if real users ran it in their real workflow and you have the Pilot evidence: success criteria, observability, a security review, support and a go/no-go plan. Interviewers probe this, as [Maturity Labeling](../../m8/01-portfolio-case-study-resume/03-maturity-labeling.md) (M8) explains.

## Why an FDE needs this

Without a frozen candidate, the system the client sees on Tuesday differs from the one you tested on Monday, and nobody can say why an answer changed. A named version also lets you roll back.

## Key concepts

### What you produce

A one-page release candidate record.

```
RC: course-support-assistant rc1   Date: <date>
Versions: prompt v7 | docs snapshot <date> | model <name> | config <hash>
Evidence: eval rerun table, 3 proxy sessions, run log link
Feedback log: 14 items; 6 fixed, 3 limitations, 3 next phase, 2 dislikes
Remaining limitations: (listed, each with workaround)
Next-phase plan: (prioritized, with owner and rough size)
Rollback: how to return to the previous version
```

### Pass bar

- A stranger can tell exactly which versions make up rc1.
- Every item in the feedback log has a final status.
- Limitations are written in user terms ("cannot answer questions about fees by country"), not internal terms.
- The next-phase plan names what is not in rc1 and why.
- Nothing changed after the freeze without a new rc number.

### How to cut it

Run these steps in order. Finish the feedback log, rerun the critical cases, write the limitations list, record versions, tag the build, and only then book the demo. If a step fails, the tag waits. Tell the client coordinators which version they are testing so a report always names its build.

## Common misconceptions

- **"A release candidate is a finished product."** It is a version that passed your bar and may still have documented limits.
- **"Small tweaks after freeze are harmless."** Unversioned tweaks break traceability. Cut rc2 and rerun the critical cases.
- **"A next-phase plan is a wish list."** It is a prioritized list tied to real feedback and known limitations.
- **"The limitations list can be trimmed if it looks bad."** A build with hidden critical failures is not a release candidate. A complete list builds trust.

## Typical interview questions

<details>
<summary>What must be true before you call something a release candidate?</summary>

The critical evals pass on a recorded baseline, feedback has final statuses, versions are recorded, limitations are written, and changes are frozen.

</details>

<details>
<summary>A last-minute bug appears after the freeze. What do you do?</summary>

Judge severity. If it blocks the main workflow or is a safety issue, fix it, cut rc2, and rerun the critical cases. Otherwise log it as a known limitation.

</details>

<details>
<summary>What would you do differently if you restarted?</summary>

Name a concrete change, such as freezing document snapshots earlier so answers stopped shifting between tests.

</details>

## Learn more

- Book chapter: [Release Engineering](https://sre.google/sre-book/release-engineering/) (Google SRE Book), on versioned, reproducible releases.

## Related

- [Regression Rerun](./03-regression-rerun.md)
- [Client Demo Narrative](../06-demo-handoff-postmortem/01-client-demo-narrative.md)
- [Version Records](../../m4/05-deployment-ci-cd-observability-and-production-readiness/03-version-records-model-prompt-data-tools-and-config.md)
- [Build, Test, Deploy & Rollback](../../m4/05-deployment-ci-cd-observability-and-production-readiness/01-build-test-deploy-and-rollback-ci-cd-basics.md)
- [Demo to Production Maturity Ladder](../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md) (M4)
- [Maturity Labeling](../../m8/01-portfolio-case-study-resume/03-maturity-labeling.md) (M8)
