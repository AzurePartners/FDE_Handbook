---
title: Practical Coding and Debugging Round
row: M8-L2.1
---
**In one sentence:** FDE coding rounds test whether you can read unfamiliar code, find and fix a bug, integrate an API with proper error handling, and explain every decision — including the ones you made with an AI coding tool — not whether you can recall algorithm patterns.

## What it is

The FDE coding round comes in three shapes. A **live practical problem** in a shared editor: parse a messy file, implement a rate limiter or retry-with-backoff, build a small CLI, write the loop around a tool-calling model. A **re-engineering or debugging round**: you are dropped into a codebase you have never seen, given a failing behavior, and asked to find and fix it. A **take-home** of three to eight hours: build a small end-to-end system against a customer brief, then defend it live. Palantir's re-engineering and learning rounds, Anthropic's rate-limiter and streaming problems, and OpenAI's take-home walkthrough are the well-known instances.

## Why an FDE needs this

On day one at a customer you are handed someone else's code, someone else's API, and a bug report. The interview reproduces that. Interviewers score how you clarify edge cases before writing, whether you narrate continuously, whether you catch your own bugs, and whether your code handles the failure paths (timeouts, malformed input, rate limits) that dominate real integration work. Silence is read as being stuck; narrated trade-offs ("I will handle the malformed row case after the main path works") are read as pragmatism.

## Key concepts

### The debugging loop, spoken out loud

Julia Evans's manifesto is the right script: understand before fixing, reproduce, check assumptions, narrow scope, minimize the input. In an interview, say each step as you do it: "I am going to reproduce with the smallest input that fails, then binary-search the pipeline."

### Reading an unfamiliar codebase in ten minutes

Entry point → configuration → the request or job path → where data is written → tests. Say what you are looking for and what you found. The learning round at Palantir explicitly grades how you ask questions; the interviewer is a resource, so use them.

### Error handling is the content, not the polish

For any integration task, the interviewer is waiting to see: timeout, retry with backoff and a cap, idempotency where a retry could duplicate a side effect, a distinct error for 401 vs 404 vs 429, and a log line per call. Write the happy path first, then say which failure paths you will add and in what order.

### AI-assisted coding, explained

Whether tools are allowed varies by company and stage. Anthropic and Palantir prohibit AI assistance in live rounds unless told otherwise; some take-homes permit it and ask you to document usage. Two rules regardless: know the policy for your stage, and be able to explain any line the tool wrote. "Claude generated this and I verified it with this test" is an acceptable sentence; "I am not sure why it does that" is not. Module 1 Lesson 1 (verify, don't trust) is the standard you will be held to.

### Practice set

Rate limiter (per-user and global), messy CSV/JSON parser with edge cases, exponential backoff with jitter for a flaky API, streaming consumer with backpressure, a minimal RAG pipeline over a folder of documents, and a SQL query with window functions over messy joins.

## Common misconceptions

- **"I should grind algorithm problems."** FDE coding rounds are, by most accounts, easier algorithmically than big-tech loops and harder on realism. Prepare for messy inputs and failure paths, not for tree traversals.
- **"Finishing matters most."** A partial solution with clear structure, tests, and narrated next steps usually scores above a complete solution written in silence.
- **"Using an AI tool in the take-home is fine if the output is good."** Only if the policy allows it, and only if you can defend every decision as your own. Reviewers ask.

## Typical interview questions

<details>
<summary>This service intermittently returns stale data. Where do you start?</summary>

Reproduce first: find the smallest request that returns stale data and a request that does not. Then check the obvious sources of staleness in order — a cache with a TTL, a read replica lagging behind writes, a background job that updates on a schedule, a client-side cache. Add a log line with the data's timestamp at each hop to see where freshness is lost. Fix the cause, then add a test that would have caught it.

</details>

<details>
<summary>Implement a retry for this API call.</summary>

Ask what errors are retryable (5xx and 429, not 4xx), whether the call is idempotent (if not, add an idempotency key), and what the cap is. Then implement exponential backoff with jitter, a maximum attempt count, and a log per attempt. Say what happens after the cap: surface a named error to the caller, not a silent failure.

</details>

<details>
<summary>Walk me through what this function does and what is wrong with it.</summary>

Read it top to bottom aloud: inputs, the transformation, outputs, side effects. Then name the defect class — an off-by-one, an unhandled empty case, a swallowed exception, a shared mutable default. Propose the minimal fix and the test that pins it.

</details>

## Learn more

- Article: [A debugging manifesto](https://jvns.ca/blog/2022/12/08/a-debugging-manifesto/) (Julia Evans) — re-read the day before any debugging round
- Article: [Forward Deployed Engineer Interview: The Definitive 2026 Guide](https://www.tryexponent.com/blog/forward-deployed-engineer-interview-the-definitive-2026-guide-fde) (Aced) — coding round patterns and what interviewers look for
- Article: [Palantir Forward Deployed Engineer Interview Guide](https://www.tryexponent.com/guides/palantir-forward-deployed-engineer-interview) (Aced) — the re-engineering and learning rounds
- Reference: [Anthropic candidate guidance on AI usage](https://www.anthropic.com/careers) — what is and is not allowed by stage
- Reference: [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) — the verification habits interviewers expect you to describe

## Related

- [End-to-End AI System Design](./02-end-to-end-ai-system-design.md)
- [Technical Debt and Architecture Change Stories](./04-technical-debt-and-architecture-change-stories.md)
