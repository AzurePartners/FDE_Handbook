---
title: LLM-as-Judge
row: M2-L5.7
---
**In one sentence:** LLM-as-judge means using a second language model with a written rubric to grade another model's outputs at scale, and trusting its verdicts only after measuring how often they agree with human experts.

## What it is

Code can check some qualities of an AI answer, such as valid JSON. Others need judgment, like whether every figure is backed by the policy text. An LLM judge is a second model call that reads the input, the output and sometimes the sources or a reference answer, applies a rubric (written pass and fail rules), and returns a verdict with a reason.

Think of a new call-center quality reviewer who works alone only once their scores match the QA lead's, and is still audited weekly. The judge is the reviewer; the client's domain expert is the lead.

## Why an FDE needs this

An insurer's claims assistant was graded by one prompt: "Rate this answer's quality from 1 to 10." It averaged 8.6, so the client planned a rollout. Then the claims supervisor read 60 transcripts and found 11 wrong, such as quoting last year's deductible. The judge had scored most of them 8 or higher: they were long and confident, and it never saw the plan documents.

The FDE replaced it with code checks and three binary judges (one per failure found, each given the plan text), measured against 100 supervisor labels and spot-checked weekly.

## Key concepts

### Choosing the grader

| Check | Grader |
|---|---|
| Format, exact values, tool arguments, latency, cost | Code |
| Defining "good", specialist or high-stakes correctness, new failure types | Human expert |
| Judgment calls at volume (relevance, support by a passage, tone) | Calibrated LLM judge |

Try code first. Humans set the standard and keep auditing samples, so models are never the only graders.

### Designing a judge

- **Binary with a reason.** Pass or Fail plus a short critique, not a 1 to 10 score: raters disagree on what separates a 6 from a 7. Anthropic's docs allow 1 to 5 scales, so this is a recommendation, not a rule.
- **One judge per quality.** A holistic verdict cannot be acted on. Anthropic suggests an "isolated LLM-as-judge" per dimension.
- **Critique first, with a way out.** Reasoning before the verdict makes it inspectable and often helps. Allow "Unknown" for missing information.
- **Only the context it needs**, such as the retrieved passages and the answer.

```json
{"critique": "Quotes a $500 deductible; the 2026 plan says $750.",
 "result": "Fail"}
```

**Pairwise comparison** picks the better of two answers, or a tie. Run each pair in both orders to cancel position bias.

### Known biases

Studies document **position bias** (favoring an answer for its order), **verbosity bias** (favoring longer answers) and **self-preference** (favoring text in the judge's own style). A 2025 study found a lone ":" could trigger false passes, and graded text can try to instruct the judge. Test judges with bad but plausible outputs.

### Calibration

Start from a domain expert's Pass or Fail labels (see Human Evaluation). Put a few in the prompt, tune on a development set, then measure once on held-out labels. Report two error rates:

- **False pass:** approving an output the expert failed (too lenient).
- **False fail:** rejecting an output the expert passed (too strict).

Raw agreement misleads: if 95% of outputs are good, an always-Pass judge agrees 95% of the time and catches nothing. One common starting point (Shankar and Husain) is about 100 balanced labels and at least 90% agreement on both passes and fails. Pin the judge's model version, and re-check after any prompt or model change.

## Common misconceptions

- **"A 1 to 10 score carries more information."** The extra digits are mostly noise. Capture severity with another binary judge ("dangerously wrong").
- **"The judge must be a different, bigger model."** For narrow binary checks the same model often works if agreement is good. Mix model families when comparing systems, where self-preference matters.
- **"Once calibrated, the judge can run alone."** Calibration expires when the prompt, model or traffic changes, so experts keep spot-checking.

## Typical interview questions

<details>
<summary>What is LLM-as-judge, and when would you use it over a code check?</summary>

A second model grades outputs against a rubric and returns a verdict with a reason. I use it only where code cannot decide, like whether a passage supports a claim.

</details>

<details>
<summary>What is the difference between pointwise and pairwise judging?</summary>

Pointwise grades one answer against the rubric, trackable over time. Pairwise picks the better of two or a tie for A/B decisions, run in both orders.

</details>

<details>
<summary>How would you grade an HR assistant that must answer only from the handbook?</summary>

Code checks format and that cited IDs were retrieved. One binary judge per failure mode, such as "unsupported claim", sees the question, passages and answer, is calibrated on an HR expert's labels and is audited weekly.

</details>

<details>
<summary>Your judge passes 95% of answers, but reviewers keep finding bad ones. What next?</summary>

Treat the judge as the suspect: have the expert blind-label a random sample, compute the false-pass rate, read the disagreements, fix the rubric or context and re-measure.

</details>

## Learn more

- Video: [LLM as a Judge: Scaling AI Evaluation Strategies](https://www.youtube.com/watch?v=trfUBIDeI1Y) (IBM Technology, about 10 min)
- Article: [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/) (hamel.dev, about 35 min)
- Reference: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) (Anthropic docs, about 30 min)

## Related

- [Human Evaluation](./06-human-evaluation.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](./04-core-metrics.md)
- [RAG Evaluation (Retrieval Quality, Groundedness, Source Support)](./05-rag-evaluation.md)
- [Regression Testing for Prompts, Models, Tools and Data](./08-regression-testing.md)
