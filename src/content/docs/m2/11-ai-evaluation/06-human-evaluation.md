---
title: Human Evaluation
row: M2-L5.6
---
**In one sentence:** Human evaluation means people, ideally domain experts, grading a sample of AI outputs against a written guideline, pass or fail with a reason for each, to define what good means and produce labels the team can trust.

## What it is

Code can check some qualities of an AI answer, such as valid JSON. Others need judgment: would a specialist sign this answer off? Human evaluation is people grading outputs for those qualities in a planned way.

Think of exam marking. Teachers mark scripts against a mark scheme, a second examiner re-marks a sample, and a chief examiner settles disagreements and clarifies the scheme.

Precisely, reviewers grade a planned sample against a written guideline, then check agreement and resolve disagreements. The result is ground truth, trusted labels that eval cases and automated graders are measured against. Anthropic's docs call human grading high quality but "slow and expensive", so spend it where nothing cheaper can be trusted.

## Why an FDE needs this

A bank hires an FDE to launch an assistant that drafts replies about fees and card disputes. The FDE and two analysts label 150 drafts on whether each "looks right": 93% pass. Then the bank's disputes compliance lead reviews 50 and fails 9. Some promise refunds that depend on an investigation; others quote another account type's fee. Neither failure is visible to non-experts; launch slips and trust drops.

The fix is a process: the compliance lead owns what "pass" means, a second expert double-labels an overlap, and adjudicated labels become ground truth. (Numbers are illustrative.)

## Key concepts

### When human judgment is required

Spend expert time on five jobs: defining "good" at the start, grading specialist correctness, reviewing high-stakes work (Anthropic says legal, finance and healthcare require human experts), producing labels to calibrate an LLM judge, and reading fresh samples for new failure types.

### Who labels

General reviewers catch formatting and tone problems but miss domain failures. Hamel Husain and Shreya Shankar suggest most teams name one domain expert as the final voice on what passes. Show reviewers the full trace (input, retrieved context, tool calls, output) on a readable page, not raw JSON.

### The labeling guideline

Write each criterion as a binary check with pass, fail and borderline examples. Reviewers record Pass or Fail, a one-line reason for every fail, or "can't tell" rather than guess. Avoid 1 to 5 scales: raters disagree about a 3 versus a 4. People refine criteria by grading real outputs (criteria drift, per Shankar and colleagues), so version the guideline.

### Agreement between raters

A second expert independently labels an overlap set. Percent agreement misleads when most outputs pass, since both raters say pass by chance. Cohen's kappa (`sklearn.metrics.cohen_kappa_score`) removes chance agreement:

```text
100 answers; each reviewer passes 95 and fails 5
They agree on 92 passes and 2 fails:  p_o = 0.94
Chance agreement:  p_e = 0.95 x 0.95 + 0.05 x 0.05 = 0.905
kappa = (p_o - p_e) / (1 - p_e) = 0.37
```

Fleiss' kappa covers more than two raters; Krippendorff's alpha also handles missing labels. Landis and Koch's 1977 bands call 0.61 to 0.80 "substantial", but the bar depends on the stakes. Low agreement usually signals an ambiguous criterion: adjudicate, rewrite it and relabel a fresh overlap.

### Sampling and ground truth

Label a random sample to find unknown problems, plus targeted cases (thumbs-down, disputes, outliers) reported separately, since they overstate failure rates. Adjudicated labels and corrected outputs become eval cases and a judge's calibration set. LangSmith and Langfuse annotation queues and Microsoft Foundry's human evaluation (preview) support this. Follow the client's data-access rules and keep a weekly sample after launch.

## Common misconceptions

- **"Anyone on the team can label outputs."** General reviewers miss domain failures. The guideline and gold labels must come from a domain expert.
- **"If a human labeled it, it's ground truth."** Raters tire, drift and favor confident, fluent answers. Labels become ground truth only after a guideline, an agreement check and adjudication.
- **"User thumbs-down data is our human evaluation."** It is sparse, self-selected and rarely says why. Use it to choose what to sample.

## Typical interview questions

<details>
<summary>What is human evaluation, and when is it worth the cost?</summary>

Experts grade sampled outputs against a written guideline, pass or fail with a reason. Since it is slow and expensive, I reserve it for defining "good", specialist or high-stakes correctness, gold labels for a judge, and new failure types.

</details>

<details>
<summary>What is the difference between percent agreement and Cohen's kappa?</summary>

Percent agreement counts matching labels. Kappa subtracts the agreement expected by chance, so 94% agreement can mean a kappa near 0.37 if raters rarely agree on failures.

</details>

<details>
<summary>How would you design human evaluation for a hospital assistant that drafts patient portal replies?</summary>

A clinician lead writes binary criteria, such as "urgent symptoms escalated", with borderline examples, and labels random traffic plus every urgent case. A second clinician double-labels an overlap for kappa, and adjudicated labels become ground truth. Reviewers follow patient-data rules.

</details>

<details>
<summary>Your two expert reviewers keep disagreeing. What do you do?</summary>

Treat it as a guideline problem: read the disagreements together, rewrite or split the ambiguous criterion, and relabel a fresh overlap. If experts still disagree, the client must set the policy before it becomes a metric.

</details>

## Learn more

- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, about 30 min)
- Article: [An LLM-as-Judge Won't Save The Product, Fixing Your Process Will](https://eugeneyan.com/writing/eval-process/) (eugeneyan.com, about 15 min)

## Related

- [LLM-as-Judge](./07-llm-as-judge.md)
- [Error Analysis and Failure Case Documentation](./03-error-analysis.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](./02-evaluation-sets.md)
- [Human-in-the-Loop Approval](../12-safety-guardrails-hitl/06-human-in-the-loop-approval.md)
