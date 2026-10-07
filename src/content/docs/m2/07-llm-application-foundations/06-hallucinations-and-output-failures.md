---
title: Hallucinations and Other Model Output Failures
row: M2-L1.6
---
**In one sentence:** A model reply can fail in four distinct ways (hallucination, format drift, instruction conflict and missing context), each with its own cause and its own fix in a different part of the system.

## What it is

Clients often file several problems under "the AI made something up." A model writes plausible next words from training patterns, with no lookup or fact-check, so a reply can be wrong in content or shape, obey the wrong instruction, or rest on facts it never received.

A hallucination is fluent, specific output not supported by reality or the supplied sources. Picture a test-taker who never leaves a blank: if a wrong answer and "I don't know" both score zero, guessing wins. OpenAI researchers (Kalai et al., 2025) argue that training and evaluation reward models the same way.

## Why an FDE needs this

An FDE piloting a furniture retailer's support assistant hears "the AI is making things up." The logs show four defects: a tracking number invented with no order-lookup tool; a 30-day return window quoted because the 14-day upholstery exception was never retrieved; a 3-day refund promised from a pasted email despite a system prompt banning refund dates; and 1 in 150 replies wrapped in markdown fences, which the ticket tagger silently dropped.

Each needs a different fix, and for money or policy a prompt line never suffices: a Canadian tribunal held Air Canada liable in 2024 for a refund rule its chatbot got wrong.

## Key concepts

### The four failure modes

| Failure | Symptom | Root cause | Fixed in |
|---|---|---|---|
| Hallucination | Confident, invented policy, ID, date or citation | Plausible guessing, no lookup | Trusted facts in context, code checks |
| Format drift | Preamble, fences around JSON, renamed fields, `Refund Request` for `refund_request` | Format requested only in prose; truncation; refusals | Schema-constrained output plus a validator |
| Instruction conflict | Follows the user or a document over the system prompt | Contradictory instructions; role priority is trained, not enforced | Explicit precedence, hard rules in code |
| Missing context | Generic or outdated answer, invented default | Fact never reached the prompt (retrieval miss, no tool, trimmed history) | Context, retrieval and tools, plus a "not found" path |

The rows are a diagnostic lens, not a standard taxonomy, and missing context often becomes hallucination. Deliberate overrides are prompt injection.

### Closed-book vs grounded

Closed-book means the model answers from memory and gets a world fact wrong; supply the fact. Grounded means it had source documents yet contradicted, embellished or miscited them. Grounding reduces hallucination without removing it: a 2024 Stanford study found retrieval-based legal tools hallucinated on 17% to 33% of queries, and Google researchers (ICLR 2025) found strong models often answer wrongly, not abstain, when retrieved context falls short.

### Fabricated IDs, dates and citations

Rare, arbitrary specifics are riskiest: there is no pattern to learn. Anthropic's interpretability research (2025) found Claude has a default "can't answer" circuit that familiarity switches off, so a familiar-seeming unknown name can get invented facts. A fake order ID is like a counterfeit banknote: right format, no ledger record. A regex passes it; only a system-of-record lookup catches it. Citations fail the same way: in Mata v. Avianca (2023), lawyers were fined $5,000 after filing a brief citing six cases ChatGPT had invented.

### Confident tone carries no signal

Fluent, assertive style is learned from text, not evidence of checking. NIST's definition itself says "confidently stated but erroneous or false content," and studies find models overconfident when rating their own answers.

## Common misconceptions

- **"The newest models have fixed hallucination."** No provider claims zero, and in 2025 OpenAI's o3 and o4-mini hallucinated more than o1 on its PersonQA benchmark.
- **"I can just ask the model if it is sure."** The same process that made the error answers that question. Verify against a source, in code.
- **"Temperature 0 stops hallucinations."** It improves consistency, not correctness: in a 2025 study, 43% of invented package names recurred in all ten runs.
- **"Structured output stops fabrication."** A schema constrains shape, not truth: valid JSON can carry an invented order ID.

## Typical interview questions

<details>
<summary>What is a hallucination, and why do LLMs produce them?</summary>

It is fluent, specific output unsupported by reality or the supplied sources. The model predicts plausible text without a lookup, and right-or-wrong scoring rewards guessing over "I don't know."

</details>

<details>
<summary>How does a closed-book hallucination differ from a grounded one?</summary>

Closed-book, it misremembers a world fact, so you supply the fact. Grounded, it contradicts or miscites the documents given, so you require citations and check them in code.

</details>

<details>
<summary>An assistant gives a tracking number for a nonexistent order. How do you fix it?</summary>

No lookup call in the trace means missing context became fabrication. Add a read-only lookup tool, a "not found" reply and a code check that every ID in the reply came from the tool.

</details>

<details>
<summary>Is telling the model not to make things up enough?</summary>

It is worth adding, since allowing "I don't know" helps, but it is only a nudge. For prices, policies and IDs, supply trusted facts, verify in code and route weak cases to a person.

</details>

## Learn more

- Video: [Deep Dive into LLMs like ChatGPT (hallucinations chapter at 1:20:32)](https://www.youtube.com/watch?v=7xTGNNLPyMI) (Andrej Karpathy, YouTube, about 21 min)
- Reference: [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) (Anthropic, about 8 min)

## Related

- [Large Language Models (LLMs) and Next-Token Prediction](./01-large-language-models.md)
- [Chat Behavior vs System Reliability](./07-chat-vs-system-reliability.md)
- [Context Engineering](../08-prompting-context-structured-output/04-context-engineering.md)
- [Structured Output and JSON Schema](../08-prompting-context-structured-output/06-structured-output.md)
- [Grounding and Citations](../09-rag-knowledge-bases/07-grounding-and-citations.md)
