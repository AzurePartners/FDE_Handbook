# Editing the handbook

There are two ways to change the handbook. Both edit the same Markdown files, and both go through a preview and the checks before anything reaches the live site.

## A. In the dashboard (no Git needed)

1. Open [app.pagescms.org](https://app.pagescms.org) and sign in.
2. Open **FDE_Handbook** and make sure the branch menu shows **`drafts`**.
3. Choose **English** or **中文**, then the module, and open a page. Lesson folders are shown as a tree.
4. Edit the **Title**, **Syllabus Row ID** or **Page content**, then **Save**. Each save is one change in the history, under your name.
5. Check the result on the **drafts preview** (the Vercel URL for the `drafts` branch, for example `…-git-drafts-….vercel.app`).
6. When the edits are ready, open the **Publish dashboard edits** pull request on GitHub. It is opened automatically after your first save and updates itself afterwards. When CI is green, merge it with **Create a merge commit**. The live site updates about a minute later.

Things the dashboard does not handle well, which are easier in Git (section B):

- Moving or renaming pages and lesson folders.
- Changing several pages at once.
- A new lesson folder also needs an entry under **Modules & lessons** in the dashboard, or it will not appear in the sidebar (the checks will say so).

## B. In Git (developers)

```bash
git switch main && git pull
git switch -c fix/m2-temperature-claim
# edit src/content/docs/m2/…/page.md
npm run check            # same checks as CI, a few seconds
npm run dev              # optional: see it at http://localhost:4321
git commit -am "M2-L1.7: align the temperature claim with M2-L1.5"
git push -u origin fix/m2-temperature-claim
```

Open a pull request into `main`. Vercel comments a preview link; merge when CI is green.

You can also press `.` on the repository page on github.com to edit in the browser-based VS Code, or ask Claude Code to make the change. [CLAUDE.md](CLAUDE.md) holds the authoring rules it follows.

## How pages are written

Every page is a Markdown file with a short header:

```markdown
---
title: Forward Deployed Engineer
row: M0-L1.1
---
**In one sentence:** A Forward Deployed Engineer (FDE) is an engineer embedded with …

## What it is
…
```

- **`title`** is shown as the page heading and in the sidebar. Do not repeat it as a `# heading` in the text.
- **`row`** is the Master Syllabus Row ID. Leave it out for introductions. A page that covers several rows also lists them all under `rows:`.
- **The first paragraph** is the "In one sentence" summary and is styled as a callout.
- **Knowledge-point pages** (M0–M5, M8) use these sections in this order: *What it is · Why an FDE needs this · Key concepts · Common misconceptions · Typical interview questions · Learn more · Related*. The check warns when one is missing.
- **Interview questions** use a collapsible block:

  ```markdown
  <details>
  <summary>The question?</summary>

  The model answer, in normal Markdown.

  </details>
  ```

- **Links to other pages** are file paths relative to the current file, for example `../02-fde-vs-adjacent-roles/02-role-tests.md` or, across modules, `../../m4/05-deployment-ci-cd-observability-and-production-readiness/04-demo-mvp-pilot-production-maturity-ladder.md`. Never link to a `claude.ai/artifact/…` URL. The check fails on broken page links and on artifact links.
- **Page order** follows the number at the start of each file and folder name (`01-…`, `02-…`). To insert a page between two others, renumber the files after it.

## 中文 pages

A translation lives at the same path under `src/content/docs/zh/`. If it is missing, the 中文 site shows the English page with a "not translated yet" notice. When you change an English page, update its translation too, or leave it. The check lists translations older than their English page, so they are easy to find later.

## Syllabus

The Master Syllabus stays in the Google Sheet. When a page's Row ID or title changes, update the sheet's row to match.
