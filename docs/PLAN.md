# FDE Handbook on GitHub: system plan

Status: proposal, 7 Oct 2026. Nothing below is built yet; section 9 lists the decisions needed before Phase 1 starts.

## 1. Goal

Run the FDE Handbook (Modules 0–8, EN/中文) from one GitHub repository so that:

1. Every change is tracked, reviewable and reversible (who changed what, when, why).
2. The combined handbook is always generated from the modules, never maintained as a separate copy.
3. Content can be edited two ways, both landing in the same files:
   - **Developers:** edit files locally or in GitHub, push, open a pull request.
   - **Non-developers:** edit text in a web dashboard, no Git knowledge needed.
4. Every merged change deploys automatically (Vercel), and every proposed change gets a preview link before it goes live.
5. The checks the review team ran by hand (syllabus row coverage, Row IDs, template sections, internal links, link rot) run automatically on every change.

## 2. What exists today (audited 7 Oct 2026)

| Module | Pages | Languages | How content is stored inside the artifact |
|---|---|---|---|
| M0 Start Here | 15 | EN + 中文 | JSON pages, Markdown, `{en:{…}, zh:{…}}` |
| M1 Foundations | 60 | EN + 中文 | JSON pages, Markdown, `md` / `md_zh` |
| M2 AI App Engineering | 51 | EN only | JSON pages, Markdown, `rowId` + `xrefs` |
| M3 Agent Engineering | 43 | EN only | JSON pages, Markdown, `rowId` + `xrefs` |
| M4 Enterprise Integration | 24 | EN only | JSON pages, **pre-rendered HTML** |
| M5 Discovery & Delivery | 36 | EN only | JSON pages, **pre-rendered HTML** |
| M6 Use-Case Archetypes | 22 | EN + 中文 | JSON pages, Markdown, `md` / `md_zh`, multi-row `rows` |
| M7 Practicum | 25 | EN + 中文 | JSON pages, Markdown, `md` / `md_zh` |
| M8 Career & Interviews | 17 | EN + 中文 | JSON pages, Markdown, `{en:{…}, zh:{…}}` |
| **Total** | **293** | | **4 different data formats** |

Plus two Google Sheets: **AP_FDE_Master_Curriculum** (Module Overview, Master Syllabus, Background Pathways, Design Notes, Resource Link Check, Retired Resources, Changelog) and **FDE Handbook Review Log** (Findings F001–F247, Module Verdicts, Decisions Needed, Row ID Maps).

### Good news

7 of 9 modules are already Markdown with a fixed page template (*In one sentence → What it is → Why an FDE needs this → Key concepts → Common misconceptions → Typical interview questions → Learn more → Related*). Pages already link to each other with relative paths such as `../02-fde-vs-adjacent-roles/02-role-tests.md`, which suggests they were written as a folder of `.md` files to begin with. Moving them to Git is mostly an extraction job, not a rewrite.

### Problems the new system must fix

1. **Links between modules break each time a module is republished.** They point at artifact URLs, and republishing a module as a copy creates a new URL. Today **228 cross-module links point at superseded artifacts**:
   - `WHZpWa7ijaT4c491Zue5BZ` (the old combined "Modules 4–5" handbook) is linked 182 times from M1, M7 and M8.
   - `JPQ8Sp3SEPNPHLzbERP2FC` (an older M6) is linked 28 times from M7.
   - `NMB1x1KCab8q5mpeKvnGVT` (an older M8) is linked 18 times from M7.

   The Review Log separately found 73 links in M2/M3 pointing at old M1 page ids.
2. **The modules use 4 different formats**, so no single script can check or rebuild them all.
3. **There is no history.** The Changelog tab is written by hand, and one row already reads `#ERROR!` (F003).
4. **The syllabus and the handbook drift apart.** Review findings F001, F004 and F005 are drift between the sheet and the pages, and only a scripted check found them.
5. **The combined handbook is a copy of the modules**, so every fix has to be made twice.

## 3. Target architecture

```text
                   ┌──────────────────────── GitHub repo (single source of truth) ─────────────────────────┐
 Developers ──PR──►│  content/en/m0…m8/**/*.md      content/zh/m0…m8/**/*.md      syllabus/*.csv          │
                   │  module.yml per module         scripts/ (import, check, export)  .github/workflows   │
 Dashboard ─commit►│                                                                                      │
 (Pages CMS)       └───────────────┬──────────────────────────────┬──────────────────────────────┬─────────┘
                                   │ every push / PR              │ every PR                     │ nightly / manual
                                   ▼                              ▼                              ▼
                        Vercel build (Astro + Starlight)   GitHub Actions: content checks   Sheets → syllabus/*.csv
                          ├─ PR / branch → Preview URL       (schema, rows, links,          (opens a PR if the
                          └─ main → Production site           sections, translations)        syllabus changed)
                                   │
                                   ├─ /en/…  /zh/…  per-module pages + search
                                   ├─ /handbook  combined view of all modules (generated)
                                   └─ optional: single-file HTML per module + combined, PDF
```

**Core rule: Markdown files in Git are the only thing anyone edits. HTML is always build output.** The website, the combined handbook, any single-file artifact export and any PDF are generated from the same files, so a fix made once appears everywhere.

### 3.1 Repository layout

```text
FDE_Handbook/
├─ content/
│  ├─ en/
│  │  ├─ m0/
│  │  │  ├─ module.yml                       # module title, lessons, order, hours (EN/ZH labels)
│  │  │  ├─ 00-introduction/01-introduction.md
│  │  │  ├─ 01-what-is-an-fde/01-forward-deployed-engineer.md
│  │  │  └─ …
│  │  ├─ m1/ … m8/
│  └─ zh/                                    # same tree; a missing file falls back to EN with a notice
├─ syllabus/
│  ├─ module-overview.csv                    # synced from the Master Curriculum sheet
│  ├─ master-syllabus.csv
│  └─ background-pathways.csv
├─ src/                                      # site code: Astro + Starlight theme, components
├─ scripts/
│  ├─ import-artifact.ts                     # artifact HTML (any of the 4 formats) → Markdown files
│  ├─ check-content.ts                       # syllabus/handbook validator (see §6)
│  ├─ sync-syllabus.ts                       # Google Sheets → syllabus/*.csv
│  ├─ export-artifact.ts                     # Markdown → single-file HTML (current viewer look)
│  └─ import-findings.ts                     # Review Log → GitHub Issues (one-off)
├─ .github/
│  ├─ workflows/ci.yml, links.yml, sync-syllabus.yml, publish-drafts.yml
│  ├─ ISSUE_TEMPLATE/finding.yml, decision.yml
│  ├─ pull_request_template.md
│  └─ CODEOWNERS                             # module owner reviews changes to their module
├─ .pages.yml                                # dashboard (Pages CMS) configuration
├─ CLAUDE.md                                 # authoring rules for AI-assisted edits
├─ CONTRIBUTING.md                           # how to edit, for both developers and dashboard users
└─ CHANGELOG.md                              # seeded from the Changelog tab, then generated per release
```

Folder and file names keep the existing page ids (`01-what-is-an-fde.01-forward-deployed-engineer` becomes `01-what-is-an-fde/01-forward-deployed-engineer.md`), so existing relative links keep working unchanged.

### 3.2 Page format

```markdown
---
title: Forward Deployed Engineer
row: M0-L1.1                 # join key to the Master Syllabus
rows: [M0-L1.1]              # optional, for pages that cover several rows (M6)
summary: An FDE is an engineer embedded with a specific customer who is accountable for …
---

**In one sentence:** An FDE is an engineer embedded with …

## What it is
…
## Related
- [Role Tests](../02-fde-vs-adjacent-roles/02-role-tests.md)
- [Maturity Ladder](../../m4/05-production-readiness/04-maturity-ladder.md)   ← cross-module link, plain relative path
```

- **Cross-module links are relative file paths**, never artifact URLs. The build turns them into site URLs and **fails the build if the target page does not exist**, so the stale-link problem cannot come back.
- Interview questions keep the existing `<details><summary>` HTML. It already works in Markdown, and the site styles it.
- The 中文 file has the same path under `content/zh/`. If it is missing, the site shows the EN page with a "not yet translated" banner (this covers M2–M5 today).

### 3.3 Website: Astro + Starlight on Vercel

| Need | How it is met |
|---|---|
| EN / 中文 toggle | Starlight's built-in i18n (`/en/…`, `/zh/…`), with automatic fallback to EN |
| Sidebar by module → lesson → page, with Row ID badges | Generated from each `module.yml` |
| Search across all 293 pages | Pagefind, built in, runs at build time with no server and no cost |
| Same look as the current handbook | IBM Plex fonts, the `#1D6A86` accent colour, the "In one sentence" callout and the `<details>` question cards, ported into Starlight's CSS |
| Combined handbook | A `/handbook` route that renders every module in order on one page, for reading through and for printing to PDF |
| "Last updated" on every page | Taken from Git history automatically |
| Content schema validation | Astro content collections (zod): a bad frontmatter field fails the build with the file name and line |

Why this stack: the content is already Markdown, Starlight is built for documentation sites, the output is static (fast and cheap to host), and Vercel builds Astro with no configuration. Next.js with Nextra or Fumadocs would also work. Starlight was chosen because its built-in i18n fallback and search are exactly what this handbook needs, so less custom code is required.

**Vercel setup:** import the GitHub repo, framework preset Astro, production branch `main`. Every pull request and every branch gets its own preview URL, and the Vercel bot comments that URL on the PR. Note: Vercel's free Hobby plan is for non-commercial personal use, so a company handbook should be on **Pro**. Check current pricing before committing.

## 4. The two editing paths

### 4.1 Developers: edit Markdown and push

```text
git switch -c fix/m2-temperature-claim
# edit content/en/m2/…/07-temperature.md (VS Code, Cursor, Claude Code, or "." on github.com for the web editor)
npm run check            # same checks CI runs, takes seconds
git commit -m "M2-L1.7: align temperature claim with M2-L1.5 (F0xx)"
git push → open PR → Vercel preview link → module owner reviews → merge → live in ~1 min
```

"Edit in HTML and push" becomes "edit the Markdown and push". The text is identical to what is inside today's HTML, without the 150 KB of surrounding viewer code. If someone still produces a revised module as an artifact (for example by asking Claude to rewrite a module), `npm run import -- <artifact-url-or-file>` converts it back into Markdown files, and `git diff` shows exactly what changed before anything is merged.

`CLAUDE.md` holds the authoring rules (template sections, tone, link conventions, Row ID rules). Claude Code sessions on this repo, including cloud sessions like this one, can then edit pages and open PRs directly, without regenerating whole artifacts.

### 4.2 Non-developers: the dashboard

**Recommendation: [Pages CMS](https://pagescms.org)**, a free hosted Git-based CMS.

- Setup is one file (`.pages.yml`) in the repo. There is no server to run and no login system to build: editors sign in with their GitHub account at app.pagescms.org.
- Editors see a list of modules and pages, open a page, edit the text in a Markdown editor (or the frontmatter fields as a form: title, Row ID), and click Save. Pages CMS turns each save into a normal Git commit under the editor's name.
- It also handles image uploads into the repo.

**Keeping dashboard edits safe:** dashboard users edit a `drafts` branch, not `main`.

```text
Dashboard save ─► commit on `drafts` ─► Vercel preview of drafts (stable URL, e.g. drafts.handbook…)
                                     └► GitHub Action keeps one "Publish drafts" PR open (drafts → main)
                                            CI checks + owner review ─► merge ─► production
```

Non-developers never touch Git, nothing reaches the live site without passing the checks and a review, and every dashboard edit still has history and can be reverted.

Alternatives considered (Phase 0 spike confirms the choice against real M0 content):

| Option | Pros | Cons |
|---|---|---|
| **Pages CMS** (recommended) | No infra, free, plain-text Markdown editing, works with any folder layout | Commits to a branch rather than opening a PR per edit (solved by the `drafts` flow above) |
| Decap CMS | Self-hosted `/admin` page, "editorial workflow" opens a PR per edit, side-by-side EN/中文 editing | Needs a small OAuth function on Vercel; nested folders combined with i18n is fiddly |
| TinaCMS | Visual, edit-on-the-page experience | Depends on Tina Cloud (paid above the free tier) and a content schema to maintain |
| Keystatic | Good Astro integration, branch/PR support | Requires server output on Vercel and a GitHub App to set up |

## 5. Governance in GitHub

| Today (Sheets) | In GitHub |
|---|---|
| Findings tab (F001–F247), Status / Owner / Notes | **GitHub Issues**, one per finding, labels `module:M2`, `severity:high`, `rubric:accuracy`; imported once by script, keeping the F-numbers in titles |
| Decisions Needed tab | Issues labelled `decision`; the PR that applies a decision links to it |
| Module Verdicts, fix tracking | **GitHub Project** board: Open → In progress → In review → Fixed, grouped by module |
| Changelog tab | `CHANGELOG.md` seeded from the tab; afterwards release notes are generated from merged PR titles and labels on each tagged release (`v2026.10.0`, …) |
| "Who checked this" | Branch protection on `main`: 1 approving review and green CI required; `CODEOWNERS` routes each module to its owner |
| Module Overview "Handbook Link" column | Updated to the site URLs (stable forever, unlike artifact links) |

A PR that fixes a finding says `Fixes #123`, and the issue closes automatically when it merges.

## 6. Automated checks (CI on every PR)

These turn the Review Log's scripted method into permanent checks:

| Check | Fails / warns | Source |
|---|---|---|
| Frontmatter schema (title, row format `M\d-L\d+\.\d+`) | Fail | Astro content collections |
| Internal and cross-module links resolve | Fail | `starlight-links-validator` |
| Every syllabus Row ID has a page; every page's Row ID exists in the syllabus | Fail (warn for modules marked "in rebuild") | `check-content.ts` + `syllabus/master-syllabus.csv` |
| Row IDs unique across pages (except declared multi-row pages) | Fail | `check-content.ts` |
| Template sections present, in order, in EN and 中文 | Warn | `check-content.ts` |
| Page title matches the start of syllabus column C (F004) | Warn | `check-content.ts` |
| 中文 page older than its EN page (EN edited after the translation) | Warn, listed in a PR comment | Git dates |
| No raw `claude.ai/artifact/` links in content | Fail | `check-content.ts` |
| External links alive | Weekly scheduled run; opens/updates one "Broken links" issue (replaces the Resource Link Check tab) | `lychee` |
| Markdown lint (heading levels, table formatting) | Warn | `markdownlint` |

## 7. Syllabus: keep it in Sheets for now, mirror it in Git

The Master Curriculum sheet is a planning tool the team already uses well, so it should not be forced into Git on day one.

- **Phase 5:** a GitHub Action (manual button + nightly) reads Module Overview, Master Syllabus and Background Pathways through the Sheets API (service account, read-only) and writes `syllabus/*.csv`. If anything changed it opens a PR, so syllabus edits also get a diff, a review and the cross-checks in §6.
- **Later, optional:** flip the direction (CSV in Git is the source; the sheet is regenerated for reading) once most edits happen in the repo.

## 8. Rollout plan

| Phase | What | Output | Size |
|---|---|---|---|
| **0. Decide + spike** | Answer §9; try Pages CMS on 3 M0 pages; agree the folder layout | Decisions recorded as issues | ½–1 day |
| **1. Import** | Write `import-artifact.ts` for all 4 formats (HTML→Markdown for M4/M5 via `turndown`); import all 293 pages; rewrite every artifact URL to a relative path using an artifact-id → module map (the 3 superseded ids above map to M4/M5, M6, M8; anchors map via Row IDs); report anything that cannot be mapped | `content/` populated, import report listing unmappable links | 1–2 days |
| **2. Site** | Astro + Starlight scaffold, theme port, `module.yml` sidebars, `/handbook` combined view, connect Vercel, custom domain | Live preview site; production on `main` | 1–2 days |
| **3. Checks** | `check-content.ts`, link validator, lychee schedule, PR template, branch protection, CODEOWNERS | Red/green CI on every PR | 1–2 days |
| **4. Dashboard** | `.pages.yml`, `drafts` branch + auto "Publish drafts" PR, `CONTRIBUTING.md` with screenshots for non-developers | Non-developers can edit | ½–1 day |
| **5. Sheets + history** | Syllabus sync Action; import Findings / Decisions as Issues + Project board; seed `CHANGELOG.md`; update Module Overview links | Review work moves to GitHub | 1 day |
| **6. Optional extras** | Single-file HTML export (keeps publishing to claude.ai possible), PDF of the combined handbook, a PR bot that drafts 中文 updates for changed EN pages, privacy-friendly analytics | As chosen | per item |

Sizes are working days of build effort, excluding review time. Phases 1–3 are the critical path. From the end of Phase 2 the team can stop editing artifacts, because every change goes through the repo.

**Cut-over rule:** once Phase 2 is live, the artifacts are frozen (each one gets a banner pointing to the site), and no one edits them again. This avoids two sources of truth.

## 9. Decisions needed before Phase 1

1. **Public or private site?** Public means Vercel Pro is enough. Private means Vercel's paid deployment protection, or Cloudflare Pages + Cloudflare Access (free for small teams). The current artifacts are public links.
2. **Dashboard:** Pages CMS (recommended) or one of the alternatives in §4.2.
3. **M4 and M5** are marked "being rebuilt" and are stored as HTML rather than Markdown. Import the current version now (converted to Markdown, then rebuild inside the repo), or wait for the rebuilt version?
4. **Review Log:** move Findings and Decisions to GitHub Issues (recommended), or keep them in the sheet?
5. **Syllabus:** keep editing in Sheets with a nightly sync (recommended), or move it into the repo now?
6. **Combined handbook:** please share the current combined version so the `/handbook` view and any export can match its structure (front matter, ordering, anything it has beyond the modules).
7. **Domain** for the site, and **who owns each module** (for `CODEOWNERS` and review routing).
