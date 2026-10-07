---
title: "PRD: Course Support Assistant"
row: M6-L1.3
rows:
  - M6-L1.1
  - M6-L1.3
---
**In one sentence:** A reference PRD for a tutor / support assistant that answers student and customer questions from an education business's own documents, cites the passage behind every answer, refuses what the documents do not cover, and hands sensitive cases to a person.

> **Teaching reference.** This PRD was written for the handbook, in the format of the [Trading Desk PRD](../04-trading-desk/03-prd.md). It is not the document of a real project. Numbers are targets a real team would set with its client.

## 1. Overview

The Course Support Assistant answers questions from students, parents and prospective customers of an education business, in a chat interface. Every answer comes from the business's own knowledge base: course materials, the FAQ, enrolment and refund policies, and answers support staff have given before. The assistant takes no actions on any account.

Support staff keep ownership of the answers. The assistant changes who finds them first.

## 2. The problem

The answers exist, but they are hard to find. Students ask the same questions every week. Support staff paste replies from memory and from old documents, so answers vary between staff and drift from the current policy. New staff cannot tell which document is current. An AI assistant that answers from its own training instead of the documents would make this worse: fluent, confident and wrong.

The assistant prevents this with system controls, not with prompt instructions.

## 3. Users

| User | What they do |
|---|---|
| Student or customer | Asks a question and reads the answer and its sources |
| Support staff | Receive escalated questions with the conversation and the passages found |
| Knowledge owner | Maintains the documents, approves changes, retires outdated ones |
| Engineers | Build and run the assistant |

## 4. Product rules

These rules apply everywhere and are never broken.

1. Every answer cites the passages it came from, and every citation points to a passage that was retrieved for that answer.
2. The assistant never states a fact that is not in a retrieved passage.
3. A question the knowledge base does not cover gets a "not covered" reply and a route to a person.
4. Questions about a named person's account, grades, refunds or complaints always go to a person.
5. A superseded document is never retrievable.
6. The assistant takes no action on any system of record.
7. Personal data in historical tickets is removed before ingestion.

## 5. Scope

In scope: course materials, the FAQ, policies and cleaned historical Q&A for the current offerings; a chat interface; citations; refusal; escalation to a support inbox; a knowledge update path; an evaluation set and report.

Not in scope for the first version: actions on accounts, enrolment or payment; multi-agent orchestration; voice; languages other than the business's two working languages; personalisation from student records.

## 6. How it works

1. A person asks a question.
2. The assistant retrieves candidate passages from the current knowledge base version.
3. Policy code decides the route: escalate (rule 4), not covered (no passage clears the threshold), or answer.
4. The model writes an answer from the retrieved passages only, with citations.
5. Code verifies every citation against the retrieved set before the answer is shown.
6. Escalations create a support ticket with the question, the conversation and the passages found.
7. Every answer is logged with the knowledge base version and passage IDs.

## 7. Requirements

**Knowledge.** Each document has an owner, an effective date and a version. A new version supersedes the old one on publish. Historical tickets are cleaned of personal data before ingestion.

**Answers.** Plain language, in the user's language, with citations the user can open. Where the documents disagree, the assistant says so and cites both.

**Refusal and escalation.** The escalation topics are configuration, not prompt text. A "not covered" reply names where to get help.

**Freshness.** A policy change reaches the assistant within one working day of publication. An outdated document cannot be cited after it is retired.

**Privacy.** The assistant never asks for or stores account credentials. Conversations are retained for a stated period and then deleted.

## 8. Success measures

Always true: every citation resolves to a retrieved passage; no retired document is ever cited; every escalation topic routes to a person.

Measured on the evaluation set, with thresholds agreed with the client before tuning: answer correctness at or above 90 percent; citation precision at or above 95 percent; refusal accuracy on out-of-scope questions at or above 95 percent; escalation precision at or above 95 percent.

In operation: the share of support questions resolved without a person; median time to answer under five seconds; the rate of negative feedback per answer.

## 9. Acceptance criteria

1. A question answered by the current FAQ cites the current FAQ.
2. A question about a retired policy cites the current version and never the retired one.
3. An out-of-scope question produces a "not covered" reply and a route to a person.
4. A refund question about a named account creates a ticket with the conversation and passages attached.
5. An answer with a citation not in the retrieved set is blocked before display.
6. The evaluation set runs on every change and its results are stored.
7. Personal data planted in a test ticket export does not appear in the index.
8. A document published by its owner is answerable within one working day.

## 10. Later phases

Read tools for a user's own course status and orders; write tools such as ticket creation and class changes, each with confirmation and audit; a second language; personalisation from the student record.

## Related

- [Case Overview: Tutor / Support RAG](./01-case-overview.md)
- [Technical Design: Course Support Assistant](./03-technical-design.md)
- [Extension: From RAG to Support Agent](./06-extension.md)

*Syllabus rows: M6-L1.1, M6-L1.3*
