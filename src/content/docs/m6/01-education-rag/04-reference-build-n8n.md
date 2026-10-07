---
title: "Reference Build: Support RAG on n8n"
row: M6-L1.4
---
**In one sentence:** The [Technical Design](./03-technical-design.md) built as three n8n workflows (ingest, answer, evaluate), with every gate in a deterministic node, every citation checked in code, and a clear list of what n8n does not do for you.

> **Teaching reference.** This page was written for the handbook; it supplies the "current build" section Lesson 1 lacks by mapping the reference design onto n8n. Node names follow the n8n documentation and may change between versions.

## 1. The standard scenario

The education case is one instance of the most common AI request an FDE receives. Strip the industry away and the same shape appears everywhere:

| Dimension | What it usually looks like |
|---|---|
| Knowledge | FAQ, product docs, policies and terms, past tickets, an internal wiki. The answers exist; nobody can find them fast. |
| Askers | Customers, students, employees, field staff, resellers |
| Channel | Web chat widget, WeChat Work / Feishu / Slack / Teams, email, or a bot inside the existing ticketing system |
| Hand-off target | A support inbox or ticket queue that already exists |
| Typical industries | E-commerce after-sales, SaaS support, education, HR and IT help desks, public-service enquiries, insurance and banking FAQs |
| What the client asks for | "An AI that answers customer questions" |
| What they actually need | Retrieval, citations, refusal, escalation, and a knowledge update path |

The three conditions from the [Case Overview](./01-case-overview.md) decide whether this build fits: the answer already exists in writing, nothing is written back, and every answer can carry its own proof. All three hold: build this. One fails: read the [Extension](./06-extension.md) (tools) or Lesson 2 (separate roles) before adding machinery.

Why n8n is a reasonable default here: the channels, the ticketing systems and the vector stores all have ready-made nodes; the routing and verification steps are ordinary deterministic nodes, which is exactly where the design wants them; and the client's own team can read the workflow without reading code.

## 2. Three workflows

The design separates ingestion, answering and evaluation. Keep them as three workflows that share a database and a vector store, not one large canvas.

```text
INGEST    Trigger (folder / Drive change, or manual)
          → Parse document → Split by heading → Add context header
          → Strip PII (code) → Embed → Upsert to vector store with {doc_id, version, effective_from}
          → Run EVALUATE against staging → IF pass → Mark version live, retire superseded

ANSWER    Chat Trigger or Webhook (channel adapter in front)
          → Route (code: escalation topics from config table)
          → Retrieve top-k (vector store, filter: version = live) → optional rerank
          → LLM with structured output {answer, citations[], route}
          → Citation verifier (code) → Switch: answer / not covered / escalate
          → Reply · or · Create ticket (HTTP / helpdesk node)
          → Append answer log (DB)

EVALUATE  Evaluation Trigger (dataset in a Data Table or sheet)
          → Execute ANSWER as sub-workflow → Score (code or LLM judge)
          → Evaluation node: set metrics → Compare to thresholds → Alert / block
```

## 3. Component mapping

Each row is a component from section 2 of the Technical Design and where it lives in this build.

| Design component | n8n build | Notes |
|---|---|---|
| Ingestion | Default Data Loader, text splitter, a Code node for the context header and PII removal | Split by heading, not by character count; the context header is one line |
| Knowledge base | Postgres (or Supabase) table: `doc_id, owner, version, effective_from, superseded_by, live` | n8n has no document versioning; this table is yours to design |
| Index | Vector store node (PGVector, Qdrant, Pinecone) with metadata filter `live = true` | Keyword search can run in the same Postgres; hybrid is a later addition |
| Router | Code or Switch node reading an escalation-topics table and a score threshold | Configuration lives in a table, never in the prompt |
| Answer service | Basic LLM Chain + Structured Output Parser, prompt restricted to the retrieved passages | Return `{answer, citations[], route}`; the parser rejects malformed output |
| Citation verifier | Code node: every citation ID must be in the retrieved set and its text must overlap the answer | A failure routes to "not covered" and logs a grounding failure |
| Escalation adapter | Helpdesk node (Zendesk, Jira Service Management, Freshdesk) or HTTP Request | Use the conversation ID as the idempotency key |
| Answer log | Postgres insert: question, KB version, passage IDs, route, latency, cost | Append-only; this is what makes any answer auditable |
| Evaluation | Evaluation Trigger + Evaluation node; dataset in a Data Table or Google Sheet | Light evaluation writes outputs back; metric-based runs need a paid plan |

## 4. Gates, in nodes

The design's four trust boundaries map directly:

- **Model output untrusted until verified:** the Code node after the LLM is the only path to a reply. There is no edge from the LLM node to the channel.
- **Routing is configuration:** the Router reads a table; a question cannot change a table.
- **Publishing is a human gate:** the ingest workflow ends in a Wait node (approval link or form) before the version flips to live, and only after the evaluation run passed.
- **No write to any system of record:** the answer workflow has one outbound write, the ticket. A repository check that no other write node exists is cheap and worth adding.

## 5. What n8n does not do for you

Be as explicit with the client as the PRD is about scope.

- **Versioning and retirement** are a table you design and maintain; the vector store only filters on what you put there. Acceptance criterion 2 ("never the retired one") is proven by the filter plus a test, not by the tool.
- **Testing** of the verifier, the router and the PII step is harder on a canvas than in code. Write these three as small scripts or a tiny service that n8n calls, so they can have unit tests and live in Git with the exported workflow JSON.
- **Local files and commands** need a self-hosted instance. Cloud n8n cannot read a folder on the client's machine.
- **Licensing.** n8n's Sustainable Use License allows internal use; check it before reselling the workflow as a hosted service to several clients.
- **Observability** is per-execution by default. The dashboards the design asks for (not-covered rate, escalation rate, latency, cost) come from the answer log table, not from n8n.

## 6. Where this build stops

The moment the client asks "can it check my enrolment?", you have left this page. A read tool scoped to one user, then a write tool with confirmation and audit, is the [Extension](./06-extension.md). n8n can host those tools, but the questions that matter (identity before lookup, idempotency, approval limits) are design questions, and an agent platform with a conversational surface, such as the Puffo space Lessons 2 to 4 use, starts to pay for itself once the assistant holds a dialogue rather than answering one question.

## Common misconceptions

- **"The workflow is the design."** The canvas shows the data flow. The design is the ownership table, the gates and the tests. Two teams can draw the same canvas and ship very different systems.
- **"The vector store handles freshness."** It handles similarity. Freshness is the `live` flag, the retirement step and the test that asks last year's question.
- **"n8n's evaluation feature replaces an evaluation set."** It runs one. The set itself, grown from real questions and review-queue corrections, is still the knowledge owner's work.
- **"Low-code means the client can maintain it alone."** They can maintain the channels and the prompts. The verifier, the schema and the eval thresholds still need an engineer.

## Typical interview questions

<details>
<summary>Why put the citation verifier in a Code node instead of asking the model to self-check?</summary>

For the same reason the Technical Design gives: an instruction is not a guarantee. In n8n the point is structural. The LLM node has no edge to the reply node; the only way out is through the verifier. A prompt injection can change what the model says, not which node runs next.

</details>

<details>
<summary>The client's team already runs n8n for marketing automation. Does that settle the platform choice?</summary>

It settles the first version if the three conditions hold. Say what it buys (channels, ticketing, a canvas their team reads) and what it does not (versioning, unit tests, dashboards), and write both into the PRD's scope. Revisit when the first tool is requested.

</details>

<details>
<summary>How would you prove acceptance criterion 5 (a bad citation is blocked) in this build?</summary>

Add a dataset row whose expected route is "not covered", and a test prompt engineered to make the model cite a passage ID that was not retrieved. Run the evaluation; the verifier must route it to "not covered" and the answer log must show a grounding failure. Keep the row forever.

</details>

## Learn more

- Docs: [n8n Evaluations](https://docs.n8n.io/build/integrate-ai/test-and-improve-ai-workflows/understand-why-to-test/) (n8n)
- Docs: [Evaluation Trigger node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.evaluationtrigger/) (n8n)
- Article: [Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) (Anthropic)
- Article: [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) (Hamel Husain)

## Related

- [Technical Design: Course Support Assistant](./03-technical-design.md), the design this page builds
- [PRD: Course Support Assistant](./02-prd.md), the rules it must satisfy
- [Extension: From RAG to Support Agent](./06-extension.md), where this build stops
- [Cross-Case Comparison](../05-cross-case/01-comparison.md)

*Syllabus row: M6-L1.4*
