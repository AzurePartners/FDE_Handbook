---
title: Glossary
---
**In one sentence:** Short definitions of the terms used across Module 6, each linked to the page that explains it.

## A to D

- **Acceptance criteria:** A numbered list of checks that define when a product is done. See [PRD: Trading Desk](../04-trading-desk/03-prd.md).
- **ADR (architecture decision record):** A short record of one decision and its rationale. See [PRD: Marketing Studio](../02-content-operations/02-prd.md).
- **ATR (average true range):** The typical daily price range of a stock, used to set invalidation levels. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Backtest:** Running rules on past data to see how they would have done. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **BuildManifest (build record):** The record of one build: sources, record count, coverage and defects fixed, diffed against the previous run. See [Technical Design: Provider Research](../03-provider-research/03-technical-design.md).
- **Canonical fact:** The one authoritative location for a fact, such as a course price. See [Case Overview: Content Operations](../02-content-operations/01-case-overview.md).
- **Challenger:** The Provider Research role that attacks the built dataset: seven lenses, three verifiers per finding, and a critic that re-derives the code set without seeing the answer. See [Technical Design: Provider Research](../03-provider-research/03-technical-design.md).
- **Check mode:** A later rebuild that reports what changed since delivery without replacing the delivered list. See [PRD: Provider Research](../03-provider-research/02-prd.md).
- **Citation:** A link from an answer to the passage that supports it. See [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md).
- **Contact sheet:** A document stating, for each contact channel, whether it is allowed for the stated use and why. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Conviction:** How strongly the desk backs a call: Low, Medium or High. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Cutoff:** The moment a run's data stops. Nothing after it may be used. See [Case Overview: Trading Desk](../04-trading-desk/01-case-overview.md).
- **Definition document:** The plain-language explanation of who is in a dataset, who was left out and why. See [PRD: Provider Research](../03-provider-research/02-prd.md).
- **Delivery Plan:** The document listing tasks, estimates, owners and milestones. See [Delivery Plan: Trading Desk](../04-trading-desk/05-delivery-plan.md).
- **Deterministic:** Done by code, so the same input always gives the same output. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).

## E to M

- **Escalation:** Handing a question to a person because the assistant should not answer it. See [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md).
- **Evidence ID:** The label that links a number to its stored source. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Finished when:** A task's checkable completion condition. See [Delivery Plan: Trading Desk](../04-trading-desk/05-delivery-plan.md).
- **Fingerprint (hash):** A short code computed from a file; any change to the file changes it. See [PRD: Provider Research](../03-provider-research/02-prd.md).
- **Gate:** A stop point where nothing continues until a person approves. See [Cross-Case Comparison](../05-cross-case/01-comparison.md).
- **GATE R / GATE D:** Provider Research's two human gates: approval of sources and code set before the large download, and approval of the deliverable before delivery. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Grounding:** Keeping an answer inside its retrieved sources. See [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md).
- **Guard test:** A test that deliberately tries to break a product rule and checks that the system refuses. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Holdout:** A slice of past data kept aside and used once, after the rules are frozen. See [PRD: Trading Desk](../04-trading-desk/03-prd.md).
- **Idempotency:** The property that repeating an action has no extra effect. See [Extension: From RAG to Support Agent](../01-education-rag/06-extension.md).
- **Invalidation level:** The price at which a call is treated as wrong. See [PRD: Trading Desk](../04-trading-desk/03-prd.md).
- **Lookahead bias:** Using information in a past decision that did not exist at the time. See [Case Overview: Trading Desk](../04-trading-desk/01-case-overview.md).

## N to R

- **n8n:** A workflow-automation tool with ready-made nodes for channels, ticketing systems, vector stores and LLM calls, used in Lesson 1 as the reference build. See [Reference Build: Support RAG on n8n](../01-education-rag/04-reference-build-n8n.md).
- **Non-goal:** Something a PRD deliberately excludes. See [PRD: Marketing Studio](../02-content-operations/02-prd.md).
- **NPPES NPI Registry:** The US government's public registry of healthcare providers. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Paper trading:** Simulated trading with no real money. See [PRD: Trading Desk](../04-trading-desk/03-prd.md).
- **Point-in-time data:** Data as it was known at a given moment, excluding later revisions. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **PRD (product requirements document):** The document that says what is built, for whom, why, and what is out. See [Introduction](../00-introduction/01-introduction.md).
- **Provenance:** Where a value came from, when, and in what version. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Puffo:** The team-collaboration agent platform the Lesson 2 to 4 systems run on: agents live in spaces and channels and act when a message arrives. See [chat.puffo.ai](https://chat.puffo.ai) and the [puffo-agent daemon](https://github.com/puffo-ai/puffo-agent).
- **Publishing check:** A condition that blocks a call from being published. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **RAG (retrieval-augmented generation):** Answering by first retrieving relevant passages, then generating from them. See [Case Overview: Tutor / Support RAG](../01-education-rag/01-case-overview.md).
- **Reconcile:** Checking that the parts of a dataset add back to the total. See [PRD: Provider Research](../03-provider-research/02-prd.md).
- **Record vs. person:** One row in a list is not one real-world person. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Restatement:** A later correction of a reported figure. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Run manager:** The backend component that stores each run's state and tells the Desk Lead what to post next. See [Adding Complexity Layer by Layer](../04-trading-desk/02-progressive-build.md).

## S to Z

- **Snapshot:** A data load written once and never changed. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Stopping check:** A check that halts a build rather than warning. See [PRD: Provider Research](../03-provider-research/02-prd.md).
- **SUE (standardised unexpected earnings):** The earnings surprise measured against its own recent variability. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Taxonomy code:** The official code that says what kind of healthcare provider someone is. See [Case Overview: Provider Research](../03-provider-research/01-case-overview.md).
- **Technical Design (TDD):** The document that says how a product is built. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Variant log:** A record of every rule variant tested. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
- **Visual master:** The one editable file every export is produced from. See [PRD: Marketing Studio](../02-content-operations/02-prd.md).
- **Wake:** A [Puffo](https://chat.puffo.ai) agent's turn, triggered by a message in one of its channels. See [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md).
