---
title: AI Evaluation (Evals)
row: M2-L5.1
---
**In one sentence:** An eval is a repeatable test of an AI feature: realistic inputs with expected outcomes written down in advance, graded automatically where possible, giving a score you can compare after every change.

## What it is

A demo shows an AI feature working once, on questions its builders picked, judged by eye: a vibe check, not evidence. An eval measures how often the feature does what everyone agreed, across many realistic cases, with "good" written down before anyone looks at outputs.

A demo is a test drive on the salesperson's route. An eval is the driving exam: a fixed route with hard parts, a written checklist, and the same scoring for everyone.

Anthropic defines an eval as "a test for an AI system: give an AI an input, then apply grading logic to its output to measure success." Here, that means testing your application, not a public benchmark like MMLU.

## Why an FDE needs this

Picture an FDE at an online retailer whose support assistant aced eight hand-picked demo questions and launched. A teammate later made the prompt "friendlier", rechecking only those eight, while the provider updated the model behind the app. Two weeks later, screenshots showed refunds promised outside the 30-day window. Nobody knew what caused it, or when.

With evals, the FDE agrees expected outcomes first (cite current policy, escalate out-of-policy refunds), turns 40 real tickets into cases (illustrative numbers) and reruns them before every change. Failing escalation cases would have caught the regression before it shipped.

## Key concepts

### Parts of an eval

Each case pairs an input with an expected outcome. A grader scores the system's output, and results roll up into pass rates per category.

```python
import os
cases = [
    {"input": "Can I return shoes after 45 days?", "expect": "escalate"},
    {"input": "How long is the return window?", "expect": "answer"},
]
passed = 0
for case in cases:
    reply = support_assistant(case["input"], model=os.environ["LLM_MODEL"])  # your app
    passed += reply["action"] == case["expect"]                              # code grader
print(f"{passed} of {len(cases)} passed")
```

Graders are code checks (fast and repeatable, but brittle to rewordings), a model applying a rubric (flexible, but calibrated against people first) or human reviewers (the gold standard, but slow and costly). Choosing among them is covered in LLM-as-Judge.

### Evals vs unit tests

A unit test asserts one exact result from deterministic code, such as status code 400. A model phrases correct answers many ways and varies between runs, so exact match fits only labels or valid JSON. Most checks grade behavior (cited a source, escalated, called the right tool), like marking essays with a rubric instead of an answer key. Results are rates, not all green.

### Offline evals and live traffic

Offline evals run a fixed set before a change ships, with no user impact, but cover only cases you anticipated, so a set unlike real usage "can create false confidence" (Anthropic). Sampling live conversations finds new inputs, and each new failure becomes an offline case.

### The eval-driven loop

1. Agree measurable criteria: not "safe outputs" but, in Anthropic's example, under 0.1% of 10,000 outputs flagged for toxicity.
2. Build 20 to 50 cases from real failures ("a great start", says Anthropic).
3. Run them and read the failures, not just the score.
4. Change one thing, rerun and compare.

Anthropic calls this eval-driven development; teams with evals can adopt a new model in days, not weeks. Small sets give rough evidence, so tiny score changes may be noise (see Regression Testing).

## Common misconceptions

- **"The demo went well, so the feature works."** A demo is a few hand-picked inputs run once. An eval runs representative cases against outcomes written in advance.
- **"Evals are unit tests with the exact answer stored."** Outputs vary, so most cases grade behavior and report pass rates.
- **"It tops public benchmarks, so it will work for our client."** Only cases from the client's real questions, documents and rules show that.

## Typical interview questions

<details>
<summary>What is an eval, and what are its parts?</summary>

A repeatable test of an AI feature: cases pairing an input with an expected outcome, the system's output, a grader (code, a rubric-guided model or a person) and a score across cases, usually pass rates per category.

</details>

<details>
<summary>How is an eval different from an ordinary unit test?</summary>

A unit test asserts one exact result from deterministic code. Model outputs vary in wording and between runs, so an eval grades behavior, like escalating or citing a source, and reports rates across many cases.

</details>

<details>
<summary>A client saw a great demo and wants to launch next week. What do you do?</summary>

Agree written expected behaviors, build 20 to 50 cases from real tickets, including edge and failure cases, and show pass rates per category with the actual failures before agreeing a launch threshold.

</details>

<details>
<summary>A teammate says a prompt change makes answers "feel better". How do you decide whether to ship it?</summary>

Run both prompts on the same eval set and compare case by case, checking that critical cases like escalations still pass. Read changed outputs to confirm the grader is right. If the set is small or the gap tiny, add cases first.

</details>

## Learn more

- Reference: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) (Anthropic docs, about 30 min)
- Article: [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic Engineering, about 30 min)

## Related

- [Three Kinds of Test Case: Happy, Edge, Failure](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [Chat Behavior vs System Reliability](../07-llm-application-foundations/07-chat-vs-system-reliability.md)
- [Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)](./02-evaluation-sets.md)
- [Core Evaluation Metrics (Accuracy, Completeness, Format Compliance, Refusals, Latency, Cost)](./04-core-metrics.md)
- [Regression Testing for Prompts, Models, Tools and Data](./08-regression-testing.md)
