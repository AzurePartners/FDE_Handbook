#!/usr/bin/env node
// Content checks run on every pull request (npm run check). Errors fail the check; warnings
// are printed for the author to judge. Run with --verbose to list every warning, or --json for
// a machine-readable report (scripts/translate.mjs uses it to check its own output).
//
// Errors:   missing title · malformed Row ID · link to a page that does not exist ·
//           claude.ai artifact link · 中文 page with no English page · module or lesson folder
//           missing from src/data/modules.json (it would not appear in the sidebar) ·
//           Row ID of a different lesson than the page's folder · 中文 Row ID different from the
//           English page's · module or lesson without its 中文 name · syllabus problems (a Row ID
//           whose lesson is not in modules.json, a practice row that also has a page) ·
//           English and 中文 page out of sync (src/lib/translations.mjs; TRANSLATION_SYNC_FAILED)
// Warnings: page missing template sections (English or 中文 headings) · 中文 page marked
//           `outdated: true` · syllabus lesson without learning outcomes or study time

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { buildSyllabus } from '../src/lib/syllabus.mjs';
import { pairs, REASONS } from '../src/lib/translations.mjs';

const DOCS = 'src/content/docs';
const ZH = 'zh';
const verbose = process.argv.includes('--verbose');
const json = process.argv.includes('--json');
const ROW = /^M\d-L\d+\.\d+$/;
const MD_LINK = /\]\(((?![a-z][a-z0-9+.-]*:|\/|#)[^)\s]+?\.md)(#[^)\s]*)?\)/gi;
const TEMPLATE = {
  en: ['## What it is', '## Why an FDE needs this', '## Key concepts', '## Common misconceptions', '## Typical interview questions', '## Learn more', '## Related'],
  zh: ['## 是什么', '## FDE 为什么需要', '## 核心概念', '## 常见误区', '## 典型面试题', '## 延伸阅读', '## 相关页面'],
};
// Modules whose pages follow the knowledge-point template (M6 and M7 use case/practicum layouts).
const TEMPLATE_MODULES = new Set(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm8']);

const errors = []; // { file, msg, sync? }
const warnings = []; // { kind, file, msg }
const err = (file, msg, extra) => errors.push({ file, msg, ...extra });
const warn = (kind, file, msg) => warnings.push({ kind, file, msg });
const text = (x) => (x.file ? `${x.file}: ${x.msg}` : x.msg);
const frontmatter = new Map(); // page path → parsed frontmatter, for the English/中文 comparison

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
  });

const { modules } = JSON.parse(fs.readFileSync('src/data/modules.json', 'utf8'));
const lessonDirs = new Set(modules.flatMap((m) => m.lessons.map((l) => `${m.dir}/${l.dir}`)));
const lessonNumber = new Map(modules.flatMap((m) => m.lessons.map((l) => [`${m.dir}/${l.dir}`, l.lesson])));
const files = walk(DOCS);
const rel = (f) => path.relative(DOCS, f).split(path.sep).join('/');
const exists = (r) => fs.existsSync(path.join(DOCS, r));

for (const file of files) {
  const r = rel(file);
  const isZh = r.startsWith(`${ZH}/`);
  const enRel = isZh ? r.slice(ZH.length + 1) : r;
  const [mod, lesson] = enRel.split('/');
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) {
    err(r, 'no frontmatter (the file must start with --- title: … ---)');
    continue;
  }
  let fm;
  try {
    fm = YAML.parse(m[1]) ?? {};
  } catch (e) {
    err(r, `frontmatter is not valid YAML: ${e.message.split('\n')[0]}`);
    continue;
  }
  const body = m[2];
  frontmatter.set(r, fm);

  if (!fm.title) err(r, 'missing title');
  for (const row of [fm.row, ...(fm.rows ?? [])].filter((x) => x !== undefined && x !== null && x !== '')) {
    if (!ROW.test(row)) err(r, `Row ID "${row}" should look like M4-L1.2`);
  }
  if (!lessonDirs.has(`${mod}/${lesson}`)) {
    err(r, `folder ${mod}/${lesson} is not listed in src/data/modules.json, so it would not appear in the sidebar`);
  } else if (fm.row && ROW.test(fm.row)) {
    // The sidebar files the page under its folder, the syllabus under its Row ID: they must agree.
    const [, rowMod, rowLesson] = fm.row.match(/^M(\d)-L(\d+)\./);
    const n = lessonNumber.get(`${mod}/${lesson}`);
    if (`m${rowMod}` !== mod || Number(rowLesson) !== n) {
      err(r, `Row ID ${fm.row} belongs to Module ${rowMod} Lesson ${rowLesson}, but the page is in ${mod}/${lesson}` +
        (n == null ? ' (a folder that is not a syllabus lesson)' : ` (Lesson ${n})`));
    }
  }
  if (isZh && !exists(enRel)) err(r, `中文 page has no English page at ${enRel}`);
  if (/claude\.ai\/(code\/)?artifact\//.test(body)) {
    err(r, 'links to a claude.ai artifact; link to the page file instead (e.g. ../02-lesson/03-page.md)');
  }

  for (const [, href] of body.matchAll(MD_LINK)) {
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(r), href));
    // A 中文 page may link to a page that only exists in English; the site shows that page in English.
    const ok = exists(target) || (isZh && target.startsWith(`${ZH}/`) && exists(target.slice(ZH.length + 1)));
    if (!ok) err(r, `broken link ${href}`);
  }

  if (TEMPLATE_MODULES.has(mod) && fm.row) {
    const missing = TEMPLATE[isZh ? 'zh' : 'en'].filter((h) => !body.includes(`\n${h}\n`));
    if (missing.length) warn('template', r, `missing sections: ${missing.map((h) => h.slice(3)).join(', ')}`);
  }
}

// A 中文 page covers the same syllabus rows as its English page.
const rowsOf = (fm) => JSON.stringify([fm.row ?? null, ...(fm.rows ?? [])]);
for (const [r, fm] of frontmatter) {
  const en = r.startsWith(`${ZH}/`) && frontmatter.get(r.slice(ZH.length + 1));
  if (en && rowsOf(fm) !== rowsOf(en)) err(r, `Row IDs ${rowsOf(fm)} differ from the English page's ${rowsOf(en)}`);
}

// Syllabus: everything the generated syllabus needs must be present.
for (const p of buildSyllabus().problems) err(null, p);
for (const m of modules) {
  if (!m.name_zh) err('src/data/modules.json', `${m.code} has no 中文 name (name_zh)`);
  for (const l of m.lessons) if (!l.label_zh) err('src/data/modules.json', `${m.code} folder ${l.dir} has no 中文 title (label_zh)`);
  const numbers = m.lessons.filter((l) => l.lesson != null).map((l) => l.lesson);
  if (new Set(numbers).size !== numbers.length) err('src/data/modules.json', `${m.code} has two folders with the same lesson number`);
  for (const l of m.lessons.filter((x) => x.lesson != null)) {
    const missing = ['outcomes', 'minHours', 'maxHours'].filter((k) => l[k] === undefined || l[k] === '' || l[k] === null);
    if (missing.length) warn('syllabus', `src/data/modules.json`, `${m.code} Lesson ${l.lesson} has no ${missing.join(', ')}`);
  }
}

// English ⇄ 中文 sync (src/lib/translations.mjs). A 中文 page without its English page is
// already reported above; everything else out of sync is an error unless the 中文 page is
// marked `outdated: true`.
for (const pair of pairs('.')) {
  const zhRel = `${ZH}/${pair.key}`;
  if (pair.status === 'in-sync' || pair.status === 'new-zh' || pair.status === 'en-deleted') continue;
  if (pair.status === 'outdated') warn('outdated', zhRel, 'marked outdated: true, so it is behind its English page');
  else err(pair.zh == null ? pair.key : zhRel, REASONS[pair.status], { sync: pair });
}

// ---------- report ----------
const repoPath = (file) => (file.startsWith('src/') ? file : `${DOCS}/${file}`);
if (json) {
  console.log(JSON.stringify({
    pages: files.length,
    errors: errors.map((e) => ({ file: e.file && repoPath(e.file), message: e.msg, ...(e.sync && { sync: e.sync.status }) })),
    warnings: warnings.map((w) => ({ kind: w.kind, file: w.file && repoPath(w.file), message: w.msg })),
  }, null, 2));
  // exitCode, not exit(): a large report to a pipe is written asynchronously and exit() would cut it off.
  process.exitCode = errors.length ? 1 : 0;
} else {
  report();
}

function report() {
  const kinds = {
    template: 'pages missing template sections',
    outdated: '中文 pages marked outdated',
    syllabus: 'syllabus lessons missing learning outcomes or study time',
  };
  console.log(`Checked ${files.length} pages.`);
  for (const [kind, label] of Object.entries(kinds)) {
    const list = warnings.filter((w) => w.kind === kind);
    if (!list.length) continue;
    console.log(`\nWarning: ${list.length} ${label}${verbose ? ':' : ' (run with --verbose to list them)'}`);
    if (verbose) for (const w of list) console.log(`  ${text(w)}`);
  }
  if (errors.length) {
    if (process.env.GITHUB_ACTIONS) {
      for (const e of errors) console.log(`::error${e.file ? ` file=${repoPath(e.file)}` : ''}::${e.msg}`);
    }
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors.filter((x) => !x.sync)) console.error(`  ${text(e)}`);
    for (const { sync, msg } of errors.filter((x) => x.sync)) {
      console.error(`\nTRANSLATION_SYNC_FAILED\nEnglish: ${DOCS}/${sync.key}\nChinese: ${DOCS}/${ZH}/${sync.key}\nReason: ${msg}`);
      console.error('Fix: push to a branch and the Translate workflow updates the other language within a few minutes,' +
        ' or run npm run translate. To publish without it, tick "翻译已过时" (outdated: true) on the 中文 page.');
    }
    process.exitCode = 1;
    return;
  }
  console.log('\nNo errors.');
}
