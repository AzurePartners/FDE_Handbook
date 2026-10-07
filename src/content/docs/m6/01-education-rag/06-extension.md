---
title: "Extension: From RAG to Support Agent"
row: M6-L1.5
---
**In one sentence:** Giving the assistant tools such as course-status lookup, order lookup and ticket creation turns a read-only RAG system into a support agent, and every tool that changes something brings permissions, confirmation and audit with it.

## What changes when you add tools

A RAG assistant can only say what the documents say. Many real support questions need one person's live data: "Is my enrolment confirmed?", "Where is my refund?", "Can you move me to the Saturday class?" The documents cannot answer these. A tool can.

The step is small in code and large in consequence. Tools fall into two groups, and the second group is where the risk is:

| Tool type | Examples | New requirements |
|---|---|---|
| Read tools | Course status, order status, schedule lookup | Identify the user before looking anything up; return only that user's data |
| Write tools | Create a ticket, request a refund, change a class | Confirm with the user before acting; make repeated calls safe; log who asked for what |

A read tool that returns another student's record is a privacy incident. A write tool called twice because the model retried is a double refund. Both failures come from treating a tool like a document.

## Add tools one at a time

Start with the question that most often ends in a hand-off today, and give the assistant the single read tool that answers it. Measure how many hand-offs it removes. Add a write tool only when the read tools are reliable and a person has signed off on the confirmation step.

The escalation path stays. The support agent handles more cases than the RAG assistant, but it still hands off anything it is not allowed to decide.

## Designing a good tool

A tool is an interface for a model, so it needs the same care as an interface for a person:

- **A clear name and description** that say when to use it and when not to.
- **Few, well-typed inputs.** A tool that takes a student ID and a course code is harder to misuse than one that takes free text.
- **Useful errors.** "Student not found; ask the user to confirm their email" helps the model recover. A stack trace does not.
- **Small, relevant outputs.** Return what the answer needs, not the whole database row.

## Common misconceptions

- **"A tool is just another knowledge source."** Documents are the same for everyone. Tool results belong to one person and must be scoped to them.
- **"The model will only call the tool when appropriate."** Write tools need a confirmation step and safe retries enforced in code, not in the prompt.
- **"Once it has tools, it should become multi-agent."** Tools and agents are separate choices. One agent with a handful of well-designed tools is usually the right next step.

## Typical interview questions

<details>
<summary>The client wants the assistant to issue refunds directly. What do you put in place first?</summary>

User identification before any lookup, a confirmation step that shows the user exactly what will happen, an idempotency key so a retried call cannot refund twice, a limit above which a person must approve, and an audit log of every call. Then launch it for a small group and review the log.

</details>

<details>
<summary>How do you decide which tool to build first?</summary>

Look at the escalation log from the RAG version. The most frequent reason for hand-off that a single read-only lookup would resolve is the first tool. It gives the biggest reduction in human work for the least new risk.

</details>

## Learn more

- Docs: [Tool use overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) (Claude docs)
- Article: [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Anthropic)

## Related

- [Case Overview: Tutor / Support RAG](./01-case-overview.md)
- [Reference Build: Support RAG on n8n](./04-reference-build-n8n.md), where the first version stops
- [Case Overview: Content Operations](../02-content-operations/01-case-overview.md), the next rung

*Syllabus row: M6-L1.5*
