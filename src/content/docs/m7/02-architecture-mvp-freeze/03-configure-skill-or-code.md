---
title: Configure, Skill or Code
row: M7-L2.3
---
**In one sentence:** For each capability in your MVP, you decide whether to get it by platform configuration, a reusable Skill, custom code, or by deliberately deferring it.

## What it is

Every capability on your architecture map needs a build method. The cheapest method that meets the acceptance criteria wins.

- Configure: set it up in a platform without writing logic. This program's agent platform (Puffo/Pavlov) is used for fast configuration of Spaces, conversational entry points and agent collaboration.
- Skill: write reusable instructions, optionally with a script, that an agent loads when needed.
- Code: write and test your own program, for steps that must be exact.
- Defer: leave it out of this delivery and list it as a non-goal or future phase.

For the Course Support Assistant, the chat entry point may be configured, the "answer in our support tone with citations" behavior may be a Skill, the refund-window date calculation may be code (eligibility for a named student still goes to a person), and multi-language answers may be deferred.

## Why an FDE needs this

Writing code for something a platform already provides burns your time. Putting a precise calculation into a prompt makes it unreliable. Choosing wrong is how a two-week project becomes four.

## Key concepts

The concept pages are [Build vs Buy vs Configure](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/02-build-vs-buy-vs-configure.md) (M5), [Agent Skills](../../m3/14-agent-skills/01-agent-skills.md) and [Instruction-Only vs Code-Backed Skills](../../m3/14-agent-skills/05-instruction-only-vs-code-backed-skills.md) (M3), and [Cost Model: Tokens, Model Choice & When to Use Code](../../m4/04-reliability-cost-latency-and-scale/02-cost-model-tokens-model-choice-and-when-to-use-code.md) (M4).

### What you produce

A capability decision table, one row per capability:

| Capability | Method | Reason | Owner | Test |
|---|---|---|---|---|
| Chat entry point | Configure | Platform provides it, no logic needed | me | Student can open and ask |
| Support tone and citation format | Skill | Reusable instructions, no exact math | me | Sample answers cite source |
| Refund-window date calculation | Code | Must be exact and testable | me | Unit cases pass |
| Multi-language answers | Defer | Not in acceptance criteria | none | Listed as non-goal |

### Decision questions, in order

1. Is it in the acceptance criteria? If not, defer.
2. Does the platform already offer it? Then configure.
3. Is it judgment or style, where wording can vary? Then Skill.
4. Must the result be exact, repeatable or auditable? Then code.

### Pass bar

- Every capability on the architecture map has exactly one method.
- Each "code" row says why configuration or a Skill is not enough.
- Each "defer" row appears in the non-goals.
- Platform features are confirmed in the platform, not assumed.
- The table fits your appetite: total code rows can plausibly be built in time.

## Common misconceptions

- **"Code is the serious option."** Code is the most expensive to build and maintain. Use it where exactness demands it.
- **"A Skill can do anything a program can."** A Skill guides model behavior. Calculations that must be right every time belong in code.
- **"Deferring is failing."** Deferring with a recorded reason is scope control.

## Typical interview questions

<details>
<summary>How did you decide what to code and what to configure?</summary>

I asked, in order: is it in the acceptance criteria, does the platform offer it, is it judgment or exact, and I coded only the exact parts. The refund-window calculation was code because a wrong date has a real cost; decisions about a named student's refund stayed with a person.

</details>

<details>
<summary>What did you defer and why?</summary>

Multi-language answers. Nothing in the acceptance criteria needed them and the document set was English only, so I recorded it as a non-goal.

</details>

<details>
<summary>When is a Skill the wrong choice?</summary>

When the output must be exact or auditable, such as eligibility rules or totals. A Skill relies on the model following instructions, which varies. I move that step into tested code.

</details>

## Learn more

- Book chapter: [Risks and Rabbit Holes](https://basecamp.com/shapeup/1.4-chapter-05) (Shape Up, Basecamp, free online), on declaring work out of bounds.

## Related

- [Solution Architecture Map](./02-solution-architecture-map.md)
- [MVP Freeze and Change Control](./04-mvp-freeze-and-change-control.md)
- [Build vs Buy vs Configure](../../m5/05-solution-architecture-choose-the-simplest-architecture-that/02-build-vs-buy-vs-configure.md) (M5)
- [Agent Skills](../../m3/14-agent-skills/01-agent-skills.md) (M3)
