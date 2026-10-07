# FDE Handbook: notes for Claude

The handbook content is the Markdown under `src/content/docs/`. Edit those files directly; never produce or edit a single-file HTML artifact for handbook content. The site (Astro + Starlight) is generated from the files.

## Before finishing any content change

Run `npm run check` (content rules) and, if you touched site code, `npm test` and `npm run build`. Fix every error the check reports.

## Authoring rules

Follow CONTRIBUTING.md "How pages are written". In short:

- The frontmatter has `title` and, for knowledge points, `row` (Master Syllabus Row ID, `M<module>-L<lesson>.<n>`). Do not add a `#` H1; the title is rendered from the frontmatter.
- The body opens with `**In one sentence:** …` (中文: `**一句话：**`).
- Knowledge-point pages (M0–M5, M8) keep the seven sections in order: What it is, Why an FDE needs this, Key concepts, Common misconceptions, Typical interview questions, Learn more, Related. 中文 headings: 是什么, FDE 为什么需要, 核心概念, 常见误区, 典型面试题, 延伸阅读, 相关页面.
- Interview questions use `<details>` / `<summary>` with a blank line after `</summary>` and before `</details>`.
- Link to other pages with relative `.md` paths. Never use claude.ai artifact URLs.
- A 中文 page mirrors its English page's path under `src/content/docs/zh/`. When changing an English page that has a translation, update the translation in the same change, or say in the PR that it is now out of date.
- One topic owns each concept (see the Review Log decisions: M0 owns the FDE role definition and the lifecycle; M4-L5.4 owns the maturity ladder; M3-L3.5 owns workflow vs agent vs multi-agent). Other pages link to the owner instead of re-teaching it.

## Structure changes

- A new lesson folder must be added to `src/data/modules.json` (with `label`, `label_zh` if translated, and for a syllabus lesson its `lesson` number, `outcomes`, `minHours` and `maxHours`), or it will not appear in the sidebar or the syllabus.
- File and folder names start with a two-digit order prefix. When renaming or moving a page, update every link to it; `npm run check` lists the broken ones.
- The syllabus is generated (src/lib/syllabus.mjs) from page titles, Row IDs, "In one sentence" lines and "Learn more" lists, plus src/data/modules.json (lesson titles, outcomes, hours) and src/data/syllabus.json (practice rows). Never edit the Google Sheet's Module Overview or Master Syllabus tabs; they are overwritten. A page's Row ID must match the lesson number of its folder.
