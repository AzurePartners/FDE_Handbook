# FDE Handbook on GitHub: system plan

Status: Phases 1–4 built on 7 Oct 2026 (see §5). Decisions are recorded in §3.

## 1. Goal

Run the FDE Handbook (Modules 0–8, EN/中文) from one GitHub repository so that:

1. Every change is tracked, reviewable and reversible (who changed what, when, why).
2. The combined handbook is always generated from the modules, never maintained as a separate copy.
3. Content can be edited two ways, both landing in the same files:
   - **Developers:** edit files locally or in GitHub, push, open a pull request.
   - **Non-developers:** edit text in a web dashboard, no Git knowledge needed.
4. Every merged change deploys automatically (Vercel), and every proposed change gets a preview link before it goes live.
5. The checks the review team ran by hand (Row IDs, template sections, internal links) run automatically on every change.
6. The site is private.

## 2. Starting point (audited 7 Oct 2026)

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
5. **The combined handbook is a copy of the modules**, so every fix has to be made twice. It had also fallen behind: its M4 and M5 are the old combined "Modules 4–5" text, and its M6 lacks the n8n reference-build page added on 2 Oct.

## 3. Decisions (7 Oct 2026)

| Question | Decision |
|---|---|
| Public or private | Private. A shared username and password for now; a proper sign-in method later |
| Hosting | Vercel, free (Hobby) plan |
| Dashboard | Pages CMS |
| M4 and M5 | Use the new standalone M4 and M5 artifacts (the ones linked from the Module Overview), not the old combined M4–5 |
| Review Log findings | Stay in the Google Sheet for now; no GitHub Issues |
| Syllabus | Generated from the repository (decided later on 7 Oct, replacing "stays in Google Sheets"); the Google Sheet becomes a read-only mirror; the 7 practice rows stay as syllabus-only rows |
| Module owners | None for now; any reviewer can approve any change |

## 4. Architecture as built

```text
 Developers ──PR──────────────►┌──────────────── GitHub: AzurePartners/FDE_Handbook ────────────────┐
                               │ src/content/docs/m0…m8/**.md        English pages (293)            │
 Dashboard (Pages CMS) ─save──►│ src/content/docs/zh/m0…m8/**.md     中文 pages (139)                │
   commits to `drafts`         │ src/data/modules.json               module + lesson labels, hours  │
                               └───────┬───────────────────────────┬────────────────────────────────┘
                                       │ every push                │ every push / PR
                                       ▼                           ▼
                        Vercel: Astro + Starlight build      GitHub Actions
                          ├─ main → live site                  ├─ CI: unit tests, content checks, build
                          ├─ any other branch → preview         └─ Drafts: keeps the "Publish dashboard
                          └─ middleware.js: username/password       edits" PR open; syncs main → drafts
```

- **Markdown files are the only source.** One file per page per language, at `src/content/docs/<module>/<lesson>/<page>.md`, with `zh/` mirroring the same paths. The website is generated from these files, so nothing is maintained twice. The site *is* the combined handbook: one sidebar holds all nine modules.
- **Links are file paths**, such as `../../m4/05-…/04-demo-mvp-pilot-production-maturity-ladder.md`. The build turns them into URLs, and `npm run check` fails on any link whose target file does not exist and on any `claude.ai/artifact` link. The stale-link problem in §2 cannot return.
- **Site:** Astro 7 + Starlight 0.42.
  - The sidebar is generated from `modules.json` (module → lesson → pages in file-name order).
  - The header has an English/中文 switch. A missing translation shows the English page with a notice.
  - Search is built in (Pagefind), and light and dark themes are supported.
  - The header of every page shows the module, lesson and Row ID.
  - The original artifacts' look is kept: IBM Plex, the teal accent, the "In one sentence" callout and the question cards.
- **Privacy:** `middleware.js` runs on Vercel before every request (pages, search index, assets) and asks for HTTP Basic Auth credentials set in the `SITE_USERNAME` / `SITE_PASSWORD` environment variables. If they are not set, the site stays closed rather than going public. The search engine `noindex` tag is set as well. Replacing this one file is all a real sign-in method needs.
- **Dashboard:** `.pages.yml` sets up Pages CMS.
  - Its English and 中文 groups have one collection per module, browsed as a lesson tree.
  - Each page has fields for the title, Row ID and Markdown body, and the body is edited as plain text, not rich text, so tables and question cards are never reformatted.
  - Module and lesson labels are editable too.
  - The config was validated against Pages CMS's own schema.
- **Drafts flow:** dashboard edits are saved to `drafts`, Vercel previews that branch, and a workflow keeps one "Publish dashboard edits" pull request open into `main`. Merging it publishes the edits. Every push to `main` is merged back into `drafts`.
- **Checks (`npm run check`, run in CI):**
  - Errors: a missing title, a malformed Row ID, a broken page link, an artifact link, a 中文 page with no English page, or a lesson folder missing from `modules.json`.
  - Warnings: a page missing a template section, or a 中文 page older than its English page.

## 5. Status

| Phase | Status |
|---|---|
| 1. Import | Done. 293 English and 139 中文 pages. All 2,380 internal links resolved to file paths, including the 228 that pointed at superseded artifacts. M4/M5 came from the new standalone artifacts (HTML converted to Markdown), M6 from its 2 Oct artifact, and the rest from the combined file (identical to the module artifacts apart from link format) |
| 2. Site | Done. Builds 589 pages; every internal link in the built site resolves |
| 3. Checks | Done. CI workflow, content checks, unit tests for the login |
| 4. Dashboard | Done in the repo; the Pages CMS app needs installing (README, One-time setup) |
| Login | Done in the repo; set `SITE_USERNAME` / `SITE_PASSWORD` in Vercel |
| Syllabus | Done. Generated from the pages + `modules.json` + `syllabus.json`; `/syllabus` page, CSV download, Sheet mirror workflow (needs the service account, README §4). Lesson titles, outcomes and hours were moved from the sheet; the first generated syllabus matched the sheet line for line except topic and resource text, which now come from the pages |

Re-running the import (`npm run import -- --combined … --module M4=…`) regenerates the module folders from artifacts, so do not run it once people are editing in the repo.

## 6. Next steps

1. **Connect Vercel** and set the two login variables (README, One-time setup). If Vercel's Hobby plan will not import an organization-owned repository, turn on the GitHub Actions deploy in `.github/workflows/vercel-deploy.yml`.
2. **Install Pages CMS** on the repository and invite the editors.
3. **Set up the syllabus Sheet mirror** (README §4).
4. **Protect `main`**: require a pull request and the CI check.
5. **Freeze the artifacts**: add a note to each published artifact pointing to the site, and change the Module Overview "Handbook Link" column to the site URLs.
6. Later, as needed:
   - a real sign-in method in place of the shared password;
   - a weekly external-link check (replaces the Resource Link Check tab);
   - a print/PDF view of the whole handbook;
   - moving the Review Log into GitHub Issues.
