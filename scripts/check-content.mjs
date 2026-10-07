#!/usr/bin/env node
// Content checks run on every pull request (npm run check). Errors fail the check; warnings
// are printed for the author to judge. Run with --verbose to list every warning.
//
// Errors:   missing title · malformed Row ID · link to a page that does not exist ·
//           claude.ai artifact link · 中文 page with no English page · module or lesson folder
//           missing from src/data/modules.json (it would not appear in the sidebar)
// Warnings: page missing template sections · English page changed after its 中文 translation

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';

const DOCS = 'src/content/docs';
const ZH = 'zh';
const verbose = process.argv.includes('--verbose');
const ROW = /^M\d-L\d+\.\d+$/;
const MD_LINK = /\]\(((?![a-z][a-z0-9+.-]*:|\/|#)[^)\s]+?\.md)(#[^)\s]*)?\)/gi;
const TEMPLATE = {
  en: ['## What it is', '## Why an FDE needs this', '## Key concepts', '## Common misconceptions', '## Typical interview questions', '## Learn more', '## Related'],
};
// Modules whose pages follow the knowledge-point template (M6 and M7 use case/practicum layouts).
const TEMPLATE_MODULES = new Set(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm8']);

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (kind, file, msg) => warnings.push({ kind, text: `${file}: ${msg}` });

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
  });

const { modules } = JSON.parse(fs.readFileSync('src/data/modules.json', 'utf8'));
const lessonDirs = new Set(modules.flatMap((m) => m.lessons.map((l) => `${m.dir}/${l.dir}`)));
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

  if (!fm.title) err(r, 'missing title');
  for (const row of [fm.row, ...(fm.rows ?? [])].filter((x) => x !== undefined && x !== null && x !== '')) {
    if (!ROW.test(row)) err(r, `Row ID "${row}" should look like M4-L1.2`);
  }
  if (!lessonDirs.has(`${mod}/${lesson}`)) {
    err(r, `folder ${mod}/${lesson} is not listed in src/data/modules.json, so it would not appear in the sidebar`);
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

  if (!isZh) {
    if (TEMPLATE_MODULES.has(mod) && fm.row) {
      const missing = TEMPLATE.en.filter((h) => !body.includes(`\n${h}\n`));
      if (missing.length) warn('template', r, `missing sections: ${missing.map((h) => h.slice(3)).join(', ')}`);
    }
  }
}

// Translation freshness, from git history (skipped in shallow clones without history).
try {
  const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'true';
  if (!shallow) {
    const lastChange = new Map();
    const log = execFileSync('git', ['log', '--format=@%ct', '--name-only', '--', DOCS], { encoding: 'utf8', maxBuffer: 1 << 28 });
    let t = 0;
    for (const line of log.split('\n')) {
      if (line.startsWith('@')) t = Number(line.slice(1));
      else if (line && !lastChange.has(line)) lastChange.set(line, t);
    }
    for (const file of files) {
      const r = rel(file);
      if (!r.startsWith(`${ZH}/`)) continue;
      const zhT = lastChange.get(`${DOCS}/${r}`);
      const enT = lastChange.get(`${DOCS}/${r.slice(ZH.length + 1)}`);
      if (zhT && enT && enT > zhT) warn('stale-translation', r, 'the English page changed after this translation was last updated');
    }
  }
} catch {
  // not a git checkout
}

// ---------- report ----------
const kinds = {
  template: 'pages missing template sections',
  'stale-translation': '中文 pages older than their English page',
};
console.log(`Checked ${files.length} pages.`);
for (const [kind, label] of Object.entries(kinds)) {
  const list = warnings.filter((w) => w.kind === kind);
  if (!list.length) continue;
  console.log(`\nWarning: ${list.length} ${label}${verbose ? ':' : ' (run with --verbose to list them)'}`);
  if (verbose) for (const w of list) console.log(`  ${w.text}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log('\nNo errors.');
