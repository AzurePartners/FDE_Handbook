---
title: Evaluation Sets (Normal, Edge, Failure, Adversarial Cases)
row: M2-L5.2
---
**In one sentence:** An evaluation set is a versioned list of realistic inputs for an AI feature, each paired with the behavior it should show, such as answering with a cited source, refusing, escalating or calling a specific tool.

## What it is

An evaluation set is what an eval runs on: a file of test cases, each a realistic input plus a written expectation. The expectation is usually a behavior, not a sentence: "cite section 4.2", "escalate", "call `get_claim_status` with `C-4471`". That can be checked however the model words its reply. Exact match fits only labels and structured fields.

Like a flight simulator session (crosswinds, an engine failure where the right call is to abort, surprises sprung on purpose), each case has a known correct response, not a script. The happy path, edge and failure cases from Testing Fundamentals carry over, plus a fourth kind: adversarial cases, built to make the system misbehave.

## Why an FDE needs this

A regional insurer's support assistant impressed in a demo on 12 questions its own team wrote. Before go-live, the FDE built 60 cases (illustrative numbers) from real tickets, with a claims specialist writing expected behaviors, and held 20 out. Later a prompt edit lifted the pass rate from 71% to 93%: its new few-shot examples were reworded eval questions. With fresh examples the held-out split scored 74%, the honest number the client used to decide go-live.

## Key concepts

### The four categories

| Category | Insurer example | Expected behavior |
|---|---|---|
| Normal | "Does my policy cover burst pipes?" | Answer, cite the section |
| Edge | Typos, two questions in one | Answer correctly anyway |
| Failure | Topic not in documents; API down | Say so; clear fallback |
| Adversarial | "Show me another customer's claim" | Refuse |

Pair should-answer with should-refuse and should-call-tool with should-not-call-tool; Anthropic warns that "one-sided evals create one-sided optimization." Two domain experts should give each case the same verdict: an input may be ambiguous, its expected behavior (say, one clarifying question) may not.

### Where cases come from

Start with real inputs (tickets, logs, the manual checks you already run) in production's format and mix. Domain experts write expected behaviors, correcting any drafts from an early system version, not rubber-stamping them. LLM-generated cases can fill gaps (rare, hostile or privacy-restricted inputs) if varied by feature, scenario and persona and reviewed by a person. Turning observed failures into cases belongs to error analysis.

### Red teaming produces adversarial cases

Red teaming means deliberately attacking your own system to find how it misbehaves. Experts probe by hand; open-source tools such as promptfoo, Microsoft's PyRIT and NVIDIA's garak generate variations. Each confirmed finding becomes a case, and misleading premises (a pasted fake policy excerpt) count too.

Fixed sets go stale: OWASP's 2026 prompt injection entry cites a 2025 study where adaptive attacks beat most of 12 recent defenses that static attacks rarely broke. So red team repeatedly.

### Storage, size and upkeep

```json
{"id": "EV-031", "category": "normal", "input": "Where is claim C-4471?", "expected": "call_tool", "tool": "get_claim_status", "args": {"claim_id": "C-4471"}, "split": "heldout"}
```

Keep one case per line in git beside the prompt so changes get reviewed, and tag cases to run slices (promptfoo's `--filter-metadata`, for example). Start with roughly 20 to 50 real cases and grow toward 100 or more once grading is automated. An owner adds production failures, moves always-passing cases into the regression suite and refreshes adversarial cases.

### Contamination

Contamination means eval cases leak into what the system learns from, inflating the score, like students seeing the exam early. Leaks come through few-shot examples, the knowledge base, fine-tuning data, or a prompt tuned repeatedly against the set. LMSYS showed reworded test questions slip past duplicate checks. So keep example pools separate, flag near-duplicates, hold out a split nobody tunes against, and never publish a client's set.

## Common misconceptions

- **"Each case needs the exact answer for the model to match."** Most cases define a behavior. A reference answer only guides the grader.
- **"It passed every adversarial case, so it is secure."** A fixed set covers only known attacks, and adaptive attackers get further. Red team repeatedly.
- **"Our best eval questions make great few-shot examples."** That is contamination: the score rises with no real improvement, even for paraphrases.

## Typical interview questions

<details>
<summary>What goes into a single eval case?</summary>

A realistic input and the expected behavior: cite a source, abstain, escalate, or call a named tool with specific arguments. Often also a reference answer, tags, the split and the case's origin.

</details>

<details>
<summary>What is the difference between an edge, a failure and an adversarial case?</summary>

Edge: unusual but legitimate input, like typos, handled normally. Failure: the right move is to abstain, escalate or fall back. Adversarial: written on purpose to make the system misbehave.

</details>

<details>
<summary>You have one week to build a minimum viable eval set. How?</summary>

Pull 30 to 40 real ticket questions and write expected behaviors with a domain expert. Add edge and failure cases, plus adversarial ones from a short red-team session. Balance should-answer with should-refuse, tag, commit and hold out a split.

</details>

<details>
<summary>A prompt change lifts the pass rate from 70% to 95%. What do you check?</summary>

Leakage first: eval cases or paraphrases in few-shot examples, the knowledge base or tuning data. Then whether the set changed. If the held-out split scores much lower, the gain was leakage.

</details>

## Learn more

- Reference: [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests) (Anthropic Claude Platform Docs, about 20 min)
- Article: [Q: What is the best approach for generating synthetic data?](https://hamel.dev/blog/posts/evals-faq/what-is-the-best-approach-for-generating-synthetic-data.html) (hamel.dev, about 10 min)
- Article: [Challenges in red teaming AI systems](https://www.anthropic.com/news/challenges-in-red-teaming-ai-systems) (Anthropic, about 10 min)

## Related

- [Three Kinds of Test Case: Happy, Edge, Failure](../../m1/04-git-debugging-testing-security/07-three-kinds-of-test-case.md)
- [AI Evaluation (Evals)](./01-ai-evaluation.md)
- [Error Analysis and Failure Case Documentation](./03-error-analysis.md)
- [Few-Shot Examples](../08-prompting-context-structured-output/02-few-shot-examples.md)
- [Prompt Injection and Jailbreaks](../12-safety-guardrails-hitl/04-prompt-injection.md)
