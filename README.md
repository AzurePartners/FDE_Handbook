# FDE Handbook

The Azure Partners Forward Deployed Engineer handbook (Modules 0–8, English and 中文), published as a password-protected website.

- **Content:** one Markdown file per page in [`src/content/docs/`](src/content/docs). The website is generated from these files, so they are the only thing anyone edits.
- **Site:** [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed on Vercel. Every push builds a preview; `main` is the live site.
- **Dashboard:** [Pages CMS](https://app.pagescms.org) for editing pages in the browser, configured in [`.pages.yml`](.pages.yml).
- **Checks:** every pull request runs the content checks (`npm run check`), the unit tests and a full build.

How to edit: see [CONTRIBUTING.md](CONTRIBUTING.md). Why it is built this way and what comes next: see [docs/PLAN.md](docs/PLAN.md).

## Layout

```text
src/content/docs/
├─ index.mdx                       home page (English)
├─ m0/ … m8/                       English pages: <module>/<lesson folder>/<page>.md
└─ zh/
   ├─ index.mdx                    home page (中文)
   └─ m0/ m1/ m6/ m7/ m8/          中文 pages, same paths; a missing page falls back to English
src/data/modules.json              module names, lesson labels (sidebar), hours, purpose
src/components/, src/styles/       page header and handbook look
src/plugins/remark-md-links.mjs    turns ../lesson/page.md links into site URLs
src/auth/basic-auth.js, middleware.js   username/password protection on Vercel
scripts/check-content.mjs          content checks (CI)
scripts/import-artifacts.mjs       one-off import from the published artifacts
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321, live reload; no password locally
npm run check      # content checks (add -- --verbose for every warning)
npm test           # unit tests
npm run build      # the full site into dist/
```

Node 22 or newer.

## One-time setup

### 1. Vercel

1. In Vercel, **Add New → Project** and import `AzurePartners/FDE_Handbook`. The Astro preset is detected automatically (build `npm run build`, output `dist`).
2. Under **Settings → Environment Variables**, add `SITE_USERNAME` and `SITE_PASSWORD` for both Production and Preview. Until both are set, the site answers every request with "Site login is not configured" instead of going public.
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
