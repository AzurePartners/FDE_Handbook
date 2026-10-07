---
title: Failure Attribution Report
row: M7-L4.2
---
**In one sentence:** A failure attribution report says, for each failing eval case, which part of the system caused it, so you fix the cause and not the symptom.

## What it is

After the baseline run, some cases fail. The tempting reaction is to rewrite the prompt. But a wrong answer can come from missing data, a bad prompt, unclear agent boundaries, a tool returning bad results, a broken handoff, a missing permission, a missing rule, or the model itself. Attribution is the step of deciding which one, using evidence from your run log and traces.

The method is explained in [Failure Attribution in Agent Systems](../../m3/18-agent-evaluation-debugging/03-failure-attribution.md) (M3) and [Error Analysis](../../m2/11-ai-evaluation/03-error-analysis.md) (M2). Hamel Husain's essay on evals argues that looking at real failures is the core habit.

## Why an FDE needs this

If the Course Support Assistant says a discontinued course is open for enrollment, a prompt tweak might hide it in testing while the real cause, a stale catalog file, stays in place. The client then meets the same bug in production. Attribution also tells the client who owns the fix: your team, the client's data owner, or the platform vendor.

## Key concepts

For each failure, read the logged intermediate outputs and ask at which step the first wrong thing appeared. Assign one primary cause. If you truly cannot decide, write "unclear" and note what evidence is missing. Choose from this list: data, prompt, agent boundary, tool, handoff, permission, rule, model.

### What you produce

A failure attribution table, one row per failing case:

| Case | What went wrong | First wrong step | Cause category | Evidence | Proposed fix | Owner |
|---|---|---|---|---|---|---|
| E-01 | Says discontinued Excel course is open | Retrieval returned old-catalog.pdf | Data | Run 014 retrieved source | Remove old file, add freshness date | Us and client |
| F-01 | Quotes another learner's grade | Retrieval returned a raw past ticket | Permission | Run log shows ticket in retrieved sources | Remove raw tickets from the learner-facing index | Us and support lead |
| F-02 | Invents a late-payment fee | Model answered with nothing retrieved | Rule | Empty retrieval, answer given anyway | Require a source to answer, else escalate | Us |

Add a summary count by category at the top, such as "Data 3, Permission 1, Rule 2".

### Pass bar

- Every failing case in the baseline run has a row.
- Each row cites run evidence, not opinion.
- The cause category is one from the list, and the fix targets that category.
- The report ranks which causes account for the most failures, so the next step knows where to start.

## Common misconceptions

- **"Every failure is a prompt problem."** Many are data, permission or rule problems that no wording change can fix.
- **"The model is to blame."** Model limits are real, but you should rule out data, tools and rules first because those are cheaper to fix.
- **"One failing case means one cause."** Several cases can share one cause. Grouping them shows where a single fix pays off.

## Typical interview questions

<details>
<summary>Which failure did you fix first and why?</summary>

The one with the largest group of cases under the same cause. Stale source files produced three failures, so fixing the data came before any prompt change.

</details>

<details>
<summary>How do you tell a data failure from a model failure?</summary>

I check what the model was given. If the right passage was never retrieved, it is data or retrieval. If the right passage was present and the model still answered wrongly, it points to the prompt or model.

</details>

<details>
<summary>What if the evidence is not clear enough to attribute?</summary>

I mark it unclear, add logging to the step I could not see, and rerun. Guessing a cause leads to a wasted fix.

</details>

## Learn more

- Article: [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) (Hamel Husain, about 20 minutes).

## Related

- [Evaluation Set and Baseline](./01-evaluation-set-and-baseline.md)
- [Targeted Hardening](./03-targeted-hardening.md)
- [Run Log and Failure Triage](../03-alpha-build/03-run-log-and-failure-triage.md)
- [Failure Attribution in Agent Systems](../../m3/18-agent-evaluation-debugging/03-failure-attribution.md) (M3)
