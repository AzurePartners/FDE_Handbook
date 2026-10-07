---
title: "Case Overview: Content Operations"
row: M6-L2.1
rows:
  - M6-L2.1
  - M6-L2.2
  - M6-L2.3
---
**In one sentence:** In [Puffo](https://chat.puffo.ai) Marketing Studio, a marketer asks for a poster, landing page or slide deck in plain language, four agents with separate jobs and separate models turn it into a reviewed HTML asset built from locked templates, and the marketer edits it in a local browser editor and exports a PNG, with no model call for a small edit.

## The business scenario

Azure Partners' marketing team produces a steady stream of marketing material for its courses: social-media posters, landing pages, decks for information sessions. Swap the courses for any product or service and the workflow is the same. The facts behind them already live in a Git repository: every course's dates, price, early-bird terms and CTA, shared faculty and policy files, reusable copy blocks, compliance rules and reference posters.

Three frictions remained. Marketers should not need Claude Code, Git, Markdown or HTML. A one-word change should not cost another agent request. And converting finished HTML into PowerPoint damaged the design. The studio keeps the repository as the source of truth, puts a Puffo space in front of it, and makes HTML the only editable master.

## Why this needs more than RAG

The output is a produced artifact that passes through stages that should not be done by the same worker: understanding the request, writing copy from the canonical facts, checking facts and compliance, and building the visual. The key reason for separate agents is the review stage. **A writer should never approve its own work.** The value of multiple agents here comes from that independence, not from their number.

There is no RAG and no vector database. The knowledge is small and curated, with one file per fact, so agents read files directly. A fact that is in no file is never guessed; it is marked `[NEEDS CONFIRMATION]` and escalated.

## The team

Four agents run in their own Puffo space, all on the Claude Code harness.

| Agent | Model | Owns | Never does |
|---|---|---|---|
| Marketing Lead | Sonnet, high effort | Intake in one message, the Job ID and brief, routing, the job state machine, the operator's only inbox, the approvals log | Writes copy, designs, or rules on compliance |
| Campaign Copywriter | Sonnet, extra-high effort | `content.json`: channel-native copy keyed by region, facts resolved through `_meta/` | Guesses a fact or approves its own work |
| Fact & Compliance Reviewer | Opus, extra-high effort | `review.md`, ending `PASS` or `BLOCKED`, with every fact compared against its file | Reviews a summary instead of the files |
| Visual Designer | Sonnet, extra-high effort | `material.html`, its `template.json`, layout audit, PNG export | Edits the copy, or produces PPTX or PDF |

The reviewer is the one agent on the stronger model, deliberately: its job is to be harder to convince than the agent that produced the work.

## Rooms and messages

| Where | Who | For |
|---|---|---|
| `#requests` | Marketers and the Lead | Requests, with each job in its own thread |
| `#studio-floor` | The four agents | Hand-offs between agents, hidden from people |
| DM to the operator | The Lead only | Two messages per job (started, ready) plus escalations |

The Lead messages the operator only when a decision is needed: a fact missing from every file, the same asset blocked twice, a request to override a hard compliance block, the editor down or an export failing twice, a usage limit, a new template or brand deviation, a non-marketing request, or a job idle for 24 hours. Each message is four lines at most, with one question and lettered options. Every decision is written to an append-only approvals log with the date, job, question, answer and who gave it.

## How a job runs

```text
intake → briefed → copy-draft → review ──PASS──► design → ready → editing → complete → archived
                        ▲          │
                        └─BLOCKED──┘   (twice at most; the third is the operator's call)
```

Two interlocks protect the flow. **No PASS, no link:** design cannot start until `review.md` ends in `PASS`. **No service, no promise:** a job is ready only when the editor answers its health check and the asset exists on disk; links come from a script that verifies them, never typed by hand. Before advancing, the Lead checks the file that proves each stage, because an agent saying "done" is a claim.

## Three ways to build the asset

| Mode | When | How |
|---|---|---|
| Template | A template fits the spec | `new_job.py` fills a proven template from `content.json`, inlines the CSS and writes the AI initial snapshot |
| Bespoke | No template fits | The designer writes HTML and CSS that follow the template contract: every editable element marked, budgets declared in `template.json` |
| Deck | Any 16:9 deck | The deck skill writes a deck plan; `new_deck.py` composes it from a catalogue of 20 slide archetypes |

A layout audit then loads the real document in headless Chrome and measures overflow, collisions, line counts and budgets. An asset that fails is not ready, however good it looks.

## Skills

Six custom skills live in the repository: company context, the target buyer's decision psychology, poster formats for each social channel, product decks, time-limited and capacity-limited conversion copy, and the forbidden-phrases compliance list. Generic marketing skills (copywriting, ad creative, landing pages and others) come from an installed third-party skill library. A routing table in the rule book maps each kind of request to the skill that handles it.

Compliance has two tiers. Tier 1 covers genuinely deceptive claims, such as guaranteed outcomes or fake scarcity, and is blocked everywhere. Tier 2 covers rules that only certain platforms or markets impose, such as a ban on absolute superlatives, and is blocked only on the channels where they apply. The publishing channel, not the company's location, decides which tier applies, which is why the Lead never guesses the channel.

## Built up in layers

The studio follows the build order the syllabus describes, and each layer maps to something concrete in the repository:

| Layer | In the repository |
|---|---|
| 1. A profile per agent | One brief per role in `agents/`, synced into each agent's Puffo profile |
| 2. Skills | Six custom skills plus a third-party marketing skill library |
| 3. Structured hand-offs | A Job ID, `brief.md`, `content.json` keyed by region, `review.md` with a verdict on its own line |
| 4. Deterministic checks | A fact-file checker that fails when a critical field is still `[TBD]`, the layout audit, and an end-to-end self-test of the editor service |
| 5. Integration | The local editor and PNG export. Publishing connectors are deliberately out of scope; people publish by hand |

## The editor

A local FastAPI service serves each job on localhost and the local network behind an unguessable per-job token. Text is editable the moment the page opens; layout, tags, CSS and scripts are unreachable. Overflowing text shrinks within the template's limits and then stops and names the cut. Images and QR codes go only into declared placeholders, after a preview, and a non-square QR is refused. Autosave runs within a second, one session holds the write lock at a time, and a stale lock lapses after 45 seconds. PNG export renders the same HTML in headless Chrome, so the export matches the preview.

## What to notice

- **Determinism where it matters.** Templates, budgets, assembly, layout audit and export are code. Models write copy, judge facts and compliance, and choose layouts.
- **Verify, then advance.** Every state change is checked against a file on disk, not against an agent's message.
- **Missing images never block production.** Placeholders let the asset be built; the ready message names which ones are still empty so nobody publishes a blank QR box.
- **The operator's attention is a budget.** Short messages, one ask each, and a log that lets an outside reviewer reconstruct every decision in minutes.

## Common misconceptions

- **"Four agents because four is more capable than one."** The split exists so creation and review are done by different workers with different inputs and a different model.
- **"The reviewer can check the brief."** It must check the actual asset. Errors are introduced during writing and design, after the brief.
- **"The designer hand-writes each poster."** It fills or composes from templates whenever it can, because proven templates carry correct budgets. Bespoke HTML is the exception.

## Typical interview questions

<details>
<summary>Why is the reviewer the only agent on the stronger model?</summary>

Because its job is adversarial: it must catch what the copywriter missed and resist being talked into a pass. Spending on the model that guards the gate buys more quality than spending on the ones producing drafts, which are checked anyway.

</details>

<details>
<summary>Why does the Lead ask for all missing information in one message?</summary>

Because every round trip costs the marketer attention and delays the job. The Lead knows the seven fields a job needs, fills defaults it is allowed to assume, and asks for the rest together. Asking one question at a time turns a short intake into a long conversation.

</details>

<details>
<summary>What stops a marketer from receiving a link to an asset that does not exist?</summary>

The second interlock. The link comes from a script that checks the editor's health endpoint and the files on disk before printing it, and the Lead posts only what the script prints.

</details>

## Learn more

- Article: [Building effective agents, prompt chaining and evaluator-optimizer](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic)
- Docs: [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) and [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (Claude docs)
- Docs: [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) (Claude docs), for typed hand-offs
- Docs: [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) (LangChain), for human approval before publishing
- Guide: [Google developer documentation style guide](https://developers.google.com/style) (Google), an example of a brand and style knowledge source

## Related

- [PRD: Marketing Studio](./02-prd.md)
- [Technical Design: Marketing Studio](./03-technical-design.md)
- [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md), the rung below

*Syllabus rows: M6-L2.1, M6-L2.2, M6-L2.3*
