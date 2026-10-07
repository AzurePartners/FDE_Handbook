---
title: "Transfer: The Same Pipeline for Other Targets"
row: M6-L3.4
---
**In one sentence:** The Provider Research method of an agreed definition, a deterministic build, an independent challenge and contact rules delivered with the rows works for any prospecting target, from doctors to schools to manufacturers.

## What transfers

Replace "urologist" with any group a business wants to reach and the same questions come back:

1. **What defines membership?** Find the official code or category if one exists, and match on it rather than on names.
2. **Which source is authoritative, and what is really in it?** Inspect it before downloading.
3. **What is a record, and what is the real-world thing?** One company has several sites; one person has several profiles.
4. **How current is it, and where did each field come from?**
5. **How may these people or organisations be contacted?**

The pipeline stays Search → Normalise → Validate → Enrich, with a human gate before the expensive step and code owning every number.

## What changes by target

| Target | Defining category | Example authoritative source | Record vs. entity trap | Confidence concern |
|---|---|---|---|---|
| Doctors (this case) | Provider taxonomy code | NPPES NPI Registry | One clinician under several codes; organisations mixed with people | Self-reported details go stale |
| Schools | School type and level | Government education statistics, such as NCES data in the US | Districts vs. schools vs. campuses | Annual release cycles |
| Manufacturers | Industry classification code, such as NAICS | Business registries, trade directories | One company, many plants and legal entities | Codes are self-selected and often too broad |
| Investors | Registration type | Regulatory filings, such as SEC adviser registrations | Funds vs. firms vs. individual partners | Filings lag real activity |
| Restaurants | Licence or permit type | Local licensing and inspection data | Brands vs. franchise locations | No single national source; varies by city |
| Influencers | None official | Platform data and self-descriptions | One person, several accounts | Metrics are platform-reported and change daily |

The last row matters most for discussion. When no official category exists, the definition document has to say so, and confidence drops. The method still works; the honest answer is just less certain.

## The downstream module: activation

Whatever the target, the buyer's next step is to use the list: segment it, rank it, decide what to say to whom. That work is a product of its own, not a role in the research system. It reads the delivered dataset and never writes back, its outputs have no "correct answer" to test against, and its risk is contact rules rather than definitional accuracy. Give it its own PRD and its own agent, and let it consume the dataset through two interfaces the research system keeps: the marketing view, from which restricted fields are structurally absent, and the compliance function, which returns a verdict per channel and cannot be bypassed. Suppression state (opt-outs, bounces, do-not-contact) belongs to the activation module too, keyed by the record identifier so a monthly rebuild never loses it.

## Discussion exercise

Pick one target from the table that you have not worked on. Write the first three lines of its definition document: what the dataset is, what it is not, and which source defines membership. Then list two stopping checks that would catch the most likely silent error.

## Common misconceptions

- **"Without an official registry, this method does not apply."** It applies with lower confidence, stated openly. The definition and the challenge matter more, not less.
- **"B2C targets follow the same contact rules as B2B."** Contact rules depend on the channel, the target and the stated use. Treat every new target's channel rules as unknown until checked, which in this method means blocked.

## Related

- [Case Overview: Provider Research](./01-case-overview.md)
- [Transfer: The Same Pipeline in Other Industries](../02-content-operations/06-transfer.md)

*Syllabus row: M6-L3.4*
