---
title: "Technical Design: Provider Research"
row: M6-L3.2
rows:
  - M6-L3.2
  - M6-L3.3
---
**In one sentence:** A reference design for agent-planned, code-built data products: models decide sources, codes and objections, a deterministic pipeline does every fetch, join and count under assertions that fail the build, two human gates bracket the expensive and the risky steps, and compliance is a function that cannot be bypassed.

> **Teaching reference.** This design follows the handbook's nine-part skeleton, is drawn largely from the methodology in the Provider Research repository, and satisfies the [Provider Research PRD](./02-prd.md). Section 9 describes how the current build relates to it.

## 1. Design principle

**Orchestrate deterministically; use models for judgment only.** Models are used where the right answer depends on reasoning: finding sources, resolving the code set, attacking the result, explaining it. Everything that moves or counts data is a script that can be asserted against.

## 2. Architecture and ownership

```text
Query ──► Research Lead ──► Tier 1: Source Scout ×n · Taxonomy Specialist (header check in code)
                                 │
                            GATE R (human): sources, code set, sizes, budget
                                 ▼
             Tier 2 fetch ─► Tier 3 filter → enrich → normalise (deterministic)
                                 ▼
             Tier 4 QA: deterministic checks → adversarial lenses → verifiers
                                 ▼
             Tier 5 package → documentation → output validator
                                 │
                            GATE D (human): deliverable
                                 ▼
             delivered ─► downstream modules read the marketing view through the compliance gate
```

The five roles and the judgment each owns:

| Role | Judgment |
|---|---|
| Research Lead | What happens next; when to stop for a person |
| Source Scout | Which sources are authoritative and what they really contain |
| Taxonomy Specialist | Which codes define the population |
| Challenger | What is wrong with the result |
| Documentation Writer | How to explain the result |

The components and what each owns:

| Component | Owns |
|---|---|
| Research Lead | The state machine, spawning, running scripts, stopping at gates; the only agent that talks to people |
| Source Scout and Taxonomy Specialist | Source manifests with real column lists; the code set with rationale |
| Pipeline | Downloads, streaming filter, joins, normalisation, packaging; every number |
| Assertions | Nine conditions that fail the build |
| Manifest | The identity of a run, diffed against the previous run |
| Challenger | Seven lenses, three verifiers per finding, a blind critic; findings with reproducers |
| Compliance gate | One function, one verdict per channel, no bypass |
| Marketing view | A projection of the dataset with restricted fields structurally absent; the interface for downstream modules |

## 3. Trust boundaries and gates

- **GATE R before anything large is downloaded:** a person approves sources, sizes, the code set with its rationale and the disk budget. A wrong source caught here costs a review; caught later it costs the run.
- **GATE D before delivery:** a person approves the deliverable. Approval is stored as data with a name and time.
- **Blind critic by construction:** the ontology critic is commissioned by the QA side, receives only the specialty and the vocabulary reference through an allowlist, and runs before the code set is published anywhere it could read.
- **Compliance is a function:** every channel decision calls it; unknown channels are blocked; there is no force flag. Restricted contact fields are absent from the marketing view rather than filtered.
- **No send path exists** anywhere in the system; building one is a separate decision that requires the gate first.

## 4. State and data

- **Run state** moves forward only: proposed, research, manifest-approved, fetching, filtering, qa, packaging, dataset-approved, delivered. Transitions are made by a command that checks preconditions and refuses to run a stage against a spec that changed since an earlier stage read it.
- **Typed contracts** between stages: source manifest, source schema, code set, filter result, enrich result with hit rate and declared minimum, QA finding with reproducer, build manifest.
- **Provenance:** every input has a version, size and hash; the build manifest records them; a rebuild from committed inputs is byte-identical.
- **What is committed:** the frozen spec, the approved sources, the manifest and every QA finding. Data files are reproducible and never committed.

## 5. Independent check

- Seven lenses ask different questions (schema, coverage, integrity, cross-source totals, ground-truth samples, status scrub, ontology re-derivation); identical checkers find less than diverse ones.
- Every finding carries a reproducer; each goes to three verifiers told to refute it and survives only with two confirmations; uncertain findings are dropped.
- The loop ends after two consecutive clean rounds, within a per-run budget of rounds and model calls.
- The panel fixes nothing; fixes are pipeline or spec changes the next run inherits.

## 6. Failure handling and idempotency

| Failure | Behaviour |
|---|---|
| An assertion fires | The build stops; the cause is fixed upstream; thresholds are never weakened to pass |
| A join matches nothing | Treated as a bug (declared minimum hit rate), not a result |
| A source changed shape | The manifest diff raises an alarm at a 20 percent relative drop in any hit rate |
| Download interrupted | Fetch resumes; a rerun does not re-download or re-extract what is complete |
| Spec amended mid-build | Later stages refuse until earlier stages are rerun |
| QA loop does not converge | Budget exhausted; the run stops and the findings go to the gate |

## 7. Evaluation and testing

- **Synthetic tests** build small registry files with known answers so every assertion and check can be exercised without downloads.
- **Deliberate breakage:** each assertion is broken one at a time to prove it stops the build.
- **Planted faults** in a dataset that the QA panel must find with reproducible evidence; a finding without evidence must be dropped.
- **Reproducibility:** rebuilding a committed run produces an identical file.
- **Manifest diffs** between runs of the same spec are reviewed as part of delivery.

## 8. Operations

- **Isolation by configuration:** one repository, one agent space and one session root per use case; a readiness check verifies space membership and that runtime profiles match their briefs.
- **Cost and quota:** fetch is the long pole and runs in the background; QA rounds and verifier fan-out have caps; a large-model tier is reserved for judgment roles.
- **Observability:** every stage writes its contract file; every QA round is kept, refuted findings included, as evidence the check ran; counts and hit rates are reported, never adjectives.
- **Generalising:** retargeting changes the specialty and code set only; non-US work changes the sources, not the architecture.

## 9. The current build

The current build implements most of this design under its own role names (Orchestrator, Source Discovery, Ontology, QA Panel, Documentation): the deterministic pipeline with its assertions and stage driver, the manifest diff, the seven-lens QA with the two-of-three verifier rule, the compliance function and the field-stripped marketing view, and three delivered datasets. It differs from the reference in three ways: it runs seven agents, adding a separate Schema Probe for the header check and a Marketing agent for segmentation, prioritisation and content briefs inside the same system; its run state machine lives in the orchestrator's brief rather than in a command; and isolation is enforced by rule rather than by a startup check. Sections 2, 4 and 8 describe the design that closes those gaps, and the marketing module's place as a downstream product is described in [Transfer](./06-transfer.md).

## Typical interview questions

<details>
<summary>Why put the code set behind an allowlist for the critic instead of telling it not to read the answer?</summary>

Because a denylist has to anticipate every channel the answer could leak through, and the one nobody listed is the one that leaks. An allowlist gives the critic exactly two inputs and nothing else, which removes the question of what it might have seen.

</details>

<details>
<summary>What does "the bug is upstream of the assertion" mean in practice?</summary>

That when a build fails, the fix is never to loosen the check. A failed hit-rate assertion means the source changed, the declaration is wrong or the download is truncated. The team finds which, fixes it, and reruns the stage.

</details>

## Related

- [PRD: Provider Research](./02-prd.md)
- [Case Overview: Provider Research](./01-case-overview.md)
- [Technical Design: Trading Desk](../04-trading-desk/04-technical-design.md), the next rung

*Syllabus rows: M6-L3.2, M6-L3.3*
