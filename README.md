# FDE Handbook

The Azure Partners Forward Deployed Engineer handbook (Modules 0–8, English and 中文), published as a password-protected website.

- **Content:** one Markdown file per page in [`src/content/docs/`](src/content/docs). The website is generated from these files, so they are the only thing anyone edits.
- **Site:** [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed on Vercel. Every push builds a preview; `main` is the live site.
- **Dashboard:** [Pages CMS](https://app.pagescms.org) for editing pages in the browser, configured in [`.pages.yml`](.pages.yml).
- **Syllabus:** generated from the pages on every publish: the site's **Syllabus** page, a CSV download, and a read-only copy in the Google Sheet.
- **Checks:** every pull request runs the content checks (`npm run check`), the unit tests and a full build.
- **Translation:** English and 中文 stay in sync automatically: an edit in either language is translated into the other on its branch (Claude API), and the checks fail while a pair is out of sync.

How to edit: see [CONTRIBUTING.md](CONTRIBUTING.md). Why it is built this way and what comes next: see [docs/PLAN.md](docs/PLAN.md).

## Layout

```text
src/content/docs/
├─ index.mdx                       home page (English)
├─ m0/ … m8/                       English pages: <module>/<lesson folder>/<page>.md
└─ zh/
   ├─ index.mdx                    home page (中文)
   └─ m0/ … m8/                    中文 pages, same paths
src/data/modules.json              modules and lessons: names, goals, learning outcomes, study time
src/data/translations.json         English/中文 sync record (written by scripts/translate.mjs)
src/data/syllabus.json             syllabus intro text and the practice rows that have no page
src/lib/syllabus.mjs               builds the syllabus from the pages + modules.json and syllabus.json
src/lib/translations.mjs           which English/中文 pairs are out of sync
src/pages/syllabus.astro, zh/syllabus.astro, syllabus.csv.ts   the Syllabus page (English, 中文) and its CSV download
src/components/, src/styles/       page header, syllabus layout and handbook look
src/plugins/remark-md-links.mjs    turns ../lesson/page.md links into site URLs
src/auth/basic-auth.js, middleware.js   username/password protection on Vercel
scripts/check-content.mjs          content checks (CI)
scripts/translate.mjs, translate-guide.md   carries an edit over to the other language (Translate workflow)
scripts/sync-syllabus-sheet.mjs    writes the syllabus into the Google Sheet (read-only copy)
scripts/import-artifacts.mjs       one-off import from the published artifacts
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321, live reload; no password locally
npm run check      # content checks (add -- --verbose for every warning)
npm run translate  # sync English and 中文 (needs ANTHROPIC_API_KEY; add -- --dry-run to only list)
npm test           # unit tests
npm run build      # the full site into dist/
```

Node 22 or newer.

## One-time setup

### 1. Vercel

1. In Vercel, **Add New → Project** and import `AzurePartners/FDE_Handbook`. The Astro preset is detected automatically (build `npm run build`, output `dist`).
2. Under **Settings → Environment Variables**, add `SITE_USERNAME` and `SITE_PASSWORD` for both Production and Preview (and, once you know it, `SITE_URL` with the live address, used for links in the syllabus download). Until both are set, the site answers every request with "Site login is not configured" instead of going public.
3. Deploy. Opening the site now asks for the username and password.

If Vercel's Hobby plan will not import the repository because it belongs to a GitHub organization, deploy from GitHub Actions instead. Create the Vercel project from the CLI (`vercel link`), then add the `VERCEL_TOKEN` secret and the `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `DEPLOY_WITH_CLI=true` variables to the repository; [`vercel-deploy.yml`](.github/workflows/vercel-deploy.yml) then deploys every push.

To change the password, edit `SITE_PASSWORD` in Vercel and redeploy. The login lives in [`middleware.js`](middleware.js), which is the one file to replace when a real sign-in method is added.

### 2. Pages CMS (dashboard)

1. Go to [app.pagescms.org](https://app.pagescms.org), sign in with GitHub and install the Pages CMS GitHub App for this repository.
2. Open the repository and switch the branch menu to **`drafts`**. The `drafts` branch is created automatically the first time `main` is pushed after setup.
3. Give each editor access: either write access to the GitHub repository, or an email invitation from the repository's settings inside Pages CMS.

### 3. GitHub

1. Let the drafts workflow open the "Publish dashboard edits" pull request: turn on **Allow GitHub Actions to create and approve pull requests** under **Settings → Actions → General → Workflow permissions**. For a repository owned by an organization, turn it on in the organization's settings first, or the repository option stays greyed out. Until then each save still works, and the Drafts run shows a warning with a link to open the pull request yourself.
2. Under **Settings → Branches**, protect `main`: require a pull request and the **CI / check** status check. Dashboard edits are unaffected, because they go to `drafts` and reach `main` through the publish pull request.

### 4. Google Sheet mirror (syllabus)

After every change to `main`, the **Syllabus sheet** workflow rewrites the **Module Overview** and **Master Syllabus** tabs of the AP_FDE_Master_Curriculum sheet from the handbook. Other tabs are not touched. The first run keeps a copy of each tab ("… (before GitHub <date>)") and protects the two tabs, so anyone who edits them gets a warning. One-time setup:

1. In [Google Cloud console](https://console.cloud.google.com), pick or create a project and enable the **Google Sheets API** (APIs & Services → Library).
2. **IAM & Admin → Service accounts → Create service account** (no roles needed). Open it, **Keys → Add key → Create new key → JSON**. A `.json` file downloads. If key creation is blocked, your Google Workspace admin has to allow service account keys for this project.
3. Open the sheet, **Share**, and add the service account's email (`…@….iam.gserviceaccount.com`) as **Editor**.
4. In GitHub, **Settings → Secrets and variables → Actions**: add the secret `GOOGLE_SERVICE_ACCOUNT_KEY` with the whole contents of the `.json` file. Optionally add the variable `SITE_URL` (live site address, for the Handbook Link column). Add `SYLLABUS_SHEET_ID` only to mirror a different sheet.
5. **Actions → Syllabus sheet → Run workflow** once, then check the sheet.

Until the secret exists the workflow skips with a notice. `npm run sync-sheet -- --dry-run` shows locally what would be written.

### 5. Automatic translation

After every push to a branch other than `main` (a dashboard save on `drafts`, a pull request branch), the **Translate** workflow finds the pages whose English or 中文 side changed since the last sync, translates the edit into the other language with the Claude API, checks the result with `npm run check`, commits it to the same branch and starts CI on that commit. Until then CI on the edit itself is red with `TRANSLATION_SYNC_FAILED`; that is expected and clears in a few minutes.

1. Create an API key in the [Claude Console](https://platform.claude.com) and, under the key's workspace limits, set a monthly spend limit (for example $100). One page costs roughly $0.15–0.25 with the default model.
2. In GitHub, **Settings → Secrets and variables → Actions**: add the secret `ANTHROPIC_API_KEY`. Optionally add the variable `TRANSLATE_MODEL` (default `claude-opus-5-5`; `claude-sonnet-5-5` costs about half).
3. Push an edit to any branch and watch **Actions → Translate**.

Without the secret the Translate run fails and says so, and CI stays red for edited pages. A run translates at most 20 pages; for more, use **Actions → Translate → Run workflow** with a higher limit, or `npm run translate -- --max-pages 50` locally. The guide sent with every request is [`scripts/translate-guide.md`](scripts/translate-guide.md); edit it to change terminology or style.
