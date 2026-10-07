---
title: Regression Testing for Prompts, Models, Tools and Data
row: M2-L5.8
---
**In one sentence:** Regression testing means re-running the same evaluation set after any change to a prompt, model, tool or indexed data, and comparing each case with an approved baseline to confirm that what used to work still works.

## What it is

A regression is something that used to work and breaks after a change. A chef who changes one supplier re-tastes the whole menu, and the allergen-free dishes must pass every time.

Precisely: you compare a **candidate** run with a **baseline**, an approved earlier run with a verdict per case, using the same cases and grader version. Anthropic's 2026 evals guide says regression evals "should have a nearly 100% pass rate"; capability evals start low, and their cases graduate into the suite once they pass reliably.

## Why an FDE needs this

An insurer's claims assistant answers from its policy library. In one week the client wants shorter answers, the library is re-indexed, and the model snapshot nears retirement. Testing one change at a time on a 120-case suite, the FDE sees the "be brief" prompt lift the average from 88% to 90%. But two critical injury-claim cases fall from 3 of 3 passes to 0 of 3: the model dropped the sentence escalating injuries to a human.

That blocks the release until an explicit escalation rule fixes it. The separate data run catches new PDFs missing policy-number metadata.

## Key concepts

### Four kinds of change

| Change | What tends to break |
|---|---|
| Prompt | Format, dropped instructions |
| Model snapshot or settings | Defaults, cost, refusals, format |
| Tool code or definition | Tool choice, arguments |
| Indexed data | What gets retrieved |

Change one thing per run so each flip has a cause.

### Case-by-case comparison and critical cases

Averages hide broken cases, so diff case by case:

```text
Baseline v14 vs candidate (prompt v15), 120 cases x 3 runs
Average pass rate    88% -> 90%
Pass -> fail         2 (critical: injury escalation)
Fail -> pass         5 (tone)
Verdict              BLOCKED
```

Block the release if any **critical** case (a required refusal, escalation or exact tool argument) fails, or if any case that passed in the approved baseline fails. Missing results and grader errors count as failures. The newest run becomes the baseline only after review.

### Run-to-run variation and sample size

Identical inputs can give different outputs, even at temperature 0 (see [Generation Settings](../07-llm-application-foundations/05-generation-settings.md)). So run each case several times and record its pass rate; a case whose verdict changes with nothing changed is **flaky**. Requiring every run to pass is strict: a case with a 75% pass rate passes three straight runs only 42% of the time.

Small sets are noisy: on 50 cases one case is 2 points, and the 95% interval is roughly plus or minus 8 to 11 points. Run the unchanged baseline twice to learn your noise floor, and set tolerances above it. Paired flip counts, which Anthropic's error-bars research favors, beat averages: 12 pass-to-fail flips against 1 is a signal, 6 against 5 is noise. Turn off response caching so repeats are fresh.

### Model upgrades and scheduled runs

Before moving to a new snapshot (see [LLM APIs](../07-llm-application-foundations/03-llm-apis.md)), baseline the current one, then run the same suite and grader on the replacement, changing only the model. Check cost, latency and format too: Claude Opus 5.5 defaults to medium effort where Opus 5 used high.

Behavior also shifts without a commit: Azure deployments can auto-upgrade, and Anthropic notes infrastructure updates can slightly change behavior under one model ID. So run the full suite nightly, and let CI (continuous integration, a service that automatically checks every proposed change) run the critical cases on each pull request.

## Common misconceptions

- **"The average went up, so the change is safe."** An April 2025 GPT-4o update passed OpenAI's offline evals and A/B tests but was rolled back within days for sycophancy, which no eval tracked.
- **"We changed nothing, so nothing needs re-testing."** Snapshots retire, deployments auto-upgrade and data gets re-indexed. Run on a schedule too.
- **"We dropped 2 points on 50 cases, so the prompt is worse."** That is one case, inside the noise. Check which cases flipped and whether they repeat.

## Typical interview questions

<details>
<summary>What is regression testing for an LLM application, and what triggers it?</summary>

Re-running a fixed eval set after a change and comparing each case with an approved baseline. Any prompt, model, tool or data change triggers it, and so does a schedule, since snapshots retire.

</details>

<details>
<summary>What is the difference between a regression eval and a capability eval?</summary>

A capability eval targets what the system cannot yet do, so it starts low. A regression eval holds working behavior and should pass near 100%.

</details>

<details>
<summary>A prompt change lifts the average from 84% to 87% on 100 cases. Do you ship it?</summary>

Not on the average. Any failed critical case blocks it, and three points is three cases, so I count flips both ways, re-run, and compare with the baseline's own noise.

</details>

<details>
<summary>A case passes, then fails, with nothing changed. What do you do?</summary>

Run it several times and record a pass rate, with a tolerance such as 4 of 5 for non-critical cases. Then I read the outputs for an ambiguous prompt or grader, and rule out cached responses.

</details>

## Learn more

- Article: [A statistical approach to model evaluations](https://www.anthropic.com/research/statistical-approach-to-model-evals) (Anthropic, about 10 min)
- Article: [How evals drive the next chapter in AI for businesses](https://openai.com/index/evals-drive-next-chapter-of-ai/) (OpenAI, about 15 min)
- Reference: [Experiments in CI/CD](https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd) (Langfuse docs, about 20 min)

## Related

- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](./02-evaluation-sets.md)
- [Prompt Versioning and Experimentation](../08-prompting-context-structured-output/08-prompt-versioning.md)
- [Prompt Brittleness and Portability](../08-prompting-context-structured-output/07-prompt-brittleness.md)
- [Unit vs. Integration Tests](../../m1/04-git-debugging-testing-security/08-unit-vs-integration-tests.md)
- [Pull Request Workflow](../../m1/04-git-debugging-testing-security/04-pull-request-workflow.md)
