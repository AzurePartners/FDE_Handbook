---
title: "Case Overview: Provider Research"
row: M6-L3.1
rows:
  - M6-L3.1
  - M6-L3.2
  - M6-L3.3
---
**In one sentence:** The Provider Research Factory turns a population query such as "all urologists in the United States" into a verified dataset: five [Puffo](https://chat.puffo.ai) agents handle the judgment work, a deterministic Python pipeline does every fetch, filter, join and count, two human gates bracket the expensive and the risky steps, and nothing in the system can contact a provider.

## The business scenario

A company needs to reach a group of clinicians, to recruit them or to sell to them. It usually buys a provider list or builds one by hand, and both fail the same way: nobody can say why one doctor is in the list and another is not, whether the list is complete, how current it is, or which contact channels are legal to use.

The system answers those questions along with the rows. Its first build, on 5 August 2026, produced a national urologist dataset of 22,195 records from 9,671,888 registry records scanned. The same pipeline has since built cardiologist (73,394 records) and dentist (409,848 records) datasets. Retargeting means changing one input, the specialty and its code set; fetch, filter, enrich, QA and packaging stay the same.

## The governing principle

**Orchestrate deterministically; use models for judgment only.** Downloading, streaming, joining, normalising and packaging are done by scripts, because a script is faster and more reliable than an agent and a deterministic stage can be asserted against. Models are used only where judgment is needed: finding sources, deciding which codes define the specialty, attacking the finished dataset, writing the documentation, and marketing analysis. Putting a model in the file-streaming loop is treated as a design defect.

## The agent roster

Five roles cover the five judgments the pipeline needs. They run in their own Puffo space, separate from every other use case on the machine, on the Claude Code harness.

| Role | Judgment it owns | Tools |
|---|---|---|
| Research Lead | The only agent that talks to the human. Runs the state machine, spawns the others, runs the pipeline scripts, stops at both gates | Subagents, shell, writes only to the run folder |
| Source Scout | Which registries are authoritative, what each file really contains (its live download URL and real column list), and whether the download is worth it; 3 to 4 run in parallel, each with a different framing (regulatory, academic, commercial, open-data catalogue) | Web search, web fetch, header reads |
| Taxonomy Specialist | Which codes from the controlled vocabulary define the specialty, citing the vocabulary version; which adjacent codes are excluded by default | Web tools; shell for downloading the vocabulary only |
| Challenger | What is wrong with the built dataset: seven lenses, three verifiers per finding, and a blind critic that re-derives the code set | Read-only repo, verification-only shell, web tools |
| Documentation Writer | How to explain the result: sources, selection rule, limits and contact rules in plain language | Read-only repo |

Remove any one of them and the pipeline loses a judgment it cannot make for itself. Everything else (fetch, extract, filter, enrich, normalise, package, output validation) is a Python module, not an agent, and every tool list is scoped to the job: the role that finds sources cannot write data, and the one that writes documentation cannot run scripts.

Two things are deliberately not roles. Reading a file's header before download is code (one range request and a parse) followed by a Source Scout judgment about what the columns mean, with an assertion that blocks approval if a declared column is missing. Marketing analysis (segmentation, prioritisation, content briefs) is a downstream product that consumes the delivered dataset through the marketing view and the compliance gate; see [Transfer](./06-transfer.md).

## How a query runs

```text
proposed
  → research        Source Scout ×3–4 and Taxonomy Specialist (parallel); header check in code
  → GATE R          human approves sources, sizes, code set and disk budget
  → fetching        resumable parallel downloads, no barrier between sources
  → filtering       stream bulk file → BARRIER → enrich ×N → BARRIER → normalise
  → qa              deterministic checks, then 7 lenses; loop until 2 clean rounds
  → packaging       CSV splits, workbook, README, output validator
  → GATE D          human approves the deliverable
  → delivered       downstream modules consume the marketing view through the compliance gate
```

States only move forward. A failed assertion or a surviving QA finding sends the run back to the stage that owns the defect. Both gates are placed where they are cheap: a wrong source caught at GATE R costs a review, caught after the download it costs the whole run.

## Data and tools

No RAG and no vector database. The agents' knowledge is the repository itself: one brief per role and a methodology document that records the first build step by step.

| Source | Contributes |
|---|---|
| NPPES monthly full file (about 1 GB compressed, 11 GB extracted) and weekly increments | Names, taxonomy codes, licences, addresses, phone, fax; weekly files bring currency forward, newest row wins |
| NPPES Deactivated NPI Report | The scrub list |
| NUCC taxonomy code set | The vocabulary that defines the specialty |
| CMS Doctors and Clinicians | Group practice, group size, medical school, graduation year, telehealth |
| CMS Facility Affiliation plus Hospital General Information | Named hospital affiliations |
| Medicare Physician and Other Practitioners | Patient volume and rural/urban setting, used for prioritisation |

The registry's search API is used for spot checks only. The build itself streams the bulk file, because the national scan is the same size whatever the specialty.

## Three defects the design exists to prevent

The first build shipped correctly only because QA caught three real defects. Each now has a standing guard.

| Defect | What happened | Guard |
|---|---|---|
| Silent empty join | The facility file had no facility-name column; the loader found nothing and returned empty without raising, so every hospital affiliation would have shipped blank | Every declared column must exist; every join has a minimum hit rate |
| Substring match on domain terms | Filtering names for "urolog" also matched "neurology"; a validation query reported 28,841 urology NPIs by sweeping in neurology rows | Exact-match code sets only; name-substring filtering over a controlled vocabulary is a defect by definition |
| Single-source status flags | The monthly file's own flags missed one deactivated NPI that the separate deactivation report listed | Always cross-check the separate authoritative scrub list |

## Where the difficulty is

- **Records are not people.** One clinician can appear under several codes, organisations sit alongside individuals, and retired providers stay listed. About 54 percent of the urology NPIs do not bill Medicare.
- **The vocabulary decides the answer.** Choosing the code set is most of the judgment in the whole build. OB/GYN urogynecology, for example, is adjacent to urology and excluded by default.
- **Self-reported data goes stale.** Registry details refresh only when the provider updates them; the methodology expects 10 to 20 percent staleness.
- **Joins are partial by nature.** For urology, Doctors and Clinicians matched 46.4 percent of records and Medicare utilisation 41.2 percent. Each source declares its own minimum, and every run's manifest is compared with the previous run; a relative drop of 20 percent in any hit rate raises an alarm that the source changed shape.

## Compliance by construction

The compliance gate is code, not a prompt, because a model can be argued out of a prompt but not out of a blocked function call. `compliance/channel_rules.py` returns a verdict per channel: fax is blocked (unsolicited advertising faxes carry $500 to $1,500 in statutory damages each), SMS and autodialled calls are blocked, email is blocked unless the address has a recorded consent basis, any unknown channel is blocked, and DIRECT secure-messaging addresses are blocked. The marketing view is written without the DIRECT fields at all. The marketing modules only ever read that view. There is no send path in the repository; the roadmap deliberately builds analysis and the gate before any outbound channel.

This is provider research and lead generation from public professional registries. It uses no patient data and makes no clinical judgement.

## Common misconceptions

- **"Five agents means five workers building the dataset."** None of them builds it. They decide what the dataset should be, check it and explain it; the pipeline builds it.
- **"More QA passes are better."** Identical passes find less than diverse ones. The panel uses seven different lenses and stops after two consecutive clean rounds, not after a fixed count.
- **"A finding is a finding."** Only if it comes with a reproducer and survives at least two of three verifiers told to refute it. Uncertain findings default to refuted, because phantom defects cost rebuilds.
- **"Marketing belongs in the same system."** It reads the dataset and never writes back, so it is a separate product with its own PRD. What must stay in this system is the boundary: the marketing view with restricted fields absent, and the compliance function.

## Typical interview questions

<details>
<summary>Why are there no agents for fetching and filtering?</summary>

Because those steps need no judgment. A script streams an 11 GB file faster, cheaper and more reliably than a model, gives the same answer every time, and can be guarded by assertions. Agents are reserved for the four or five places where the right answer depends on reasoning.

</details>

<details>
<summary>What would reading the header before download have saved in the first build?</summary>

The silent empty join. Reading the facility file's header before downloading would have shown there was no facility-name column, at the cost of one range request, instead of discovering it after the build had produced blank affiliations.

</details>

<details>
<summary>Why is the ontology critic kept away from the ontology agent's answer?</summary>

A critic that reads the derivation first tends to agree with it. The critic is commissioned by the QA side, not by the deriver, and receives only the specialty and the vocabulary URL. Its independent code set is then diffed against the published one.

</details>

## Learn more

- Docs: [NPPES NPI Registry API](https://npiregistry.cms.hhs.gov/registry/help-api) (CMS)
- Article: [Entity resolution: one real thing, many messy names](https://dev.to/michaelnocito/entity-resolution-one-real-thing-many-messy-names-1oo2) (DEV)
- Docs: [dbt source freshness](https://docs.getdbt.com/docs/build/sources) (dbt Labs)
- Article: [Understanding data lineage](https://www.datadoghq.com/blog/data-lineage/) (Datadog)
- Docs: [LangGraph interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) (LangChain), for a human gate before an expensive or risky step

## Related

- [PRD: Provider Research](./02-prd.md)
- [Technical Design: Provider Research](./03-technical-design.md)
- [Case Overview: Content Operations](../02-content-operations/01-case-overview.md), the rung below

*Syllabus rows: M6-L3.1, M6-L3.2, M6-L3.3*
