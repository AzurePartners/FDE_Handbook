#!/usr/bin/env node
// Converts published handbook artifacts (single-file HTML) into the Markdown files under
// src/content/docs, plus src/data/modules.json (module and lesson labels for the sidebar).
//
// Usage:
//   node scripts/import-artifacts.mjs --combined <FDE_Handbook_M0_M8.html> \
//        [--module M4=<module-4.html> --module M5=<module-5.html> ...] [--overview <overview.json>]
//
// --combined  the combined M0–M8 handbook; supplies every module not given with --module.
// --module    a standalone module artifact that replaces that module from the combined file.
//             All four page formats the artifacts have used are understood (see normalize()).
// --overview  optional JSON keyed by module code ({"M0": {"purpose", "minHours", "maxHours"}}).
// --write-modules  also rewrite src/data/modules.json. Off by default once that file exists,
//             because it now holds syllabus data (lesson outcomes, hours) the artifacts don't have.
//
// Every internal link (combined-file page keys, in-page anchors, relative .md paths and
// claude.ai artifact URLs) is rewritten to a relative path to the target .md file. Links that
// cannot be resolved are left untouched and listed at the end, and the script exits non-zero.

import fs from 'node:fs';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import YAML from 'yaml';

const DOCS = 'src/content/docs';
const ZH = 'zh';

// Published artifact ids (current and superseded) → module whose page ids their anchors use.
const ARTIFACT_MODULE = {
  H9RRQjSNqSr1uPUtS3G7TA: 'm0',
  WommLBYBd7cQ2KUAkc78cv: 'm1',
  '1z4x8DzGTaTXTMBHAtdg4g': 'm2',
  FcKucbHte5xXx2Y6Xdnaqi: 'm3',
  Vuiz2FZ9tGehvtzLUMB7Qw: 'm4',
  KVosk2fASf6tYWXu6ytUgq: 'm5',
  N2uMPHPuXuPETmTbZL3YXz: 'm6',
  JPQ8Sp3SEPNPHLzbERP2FC: 'm6', // superseded M6
  '9NnoUBm9Y3KrxSpjAbuaRR': 'm7',
  '54UcA1yQKjGQ49DrfXqMcy': 'm8',
  NMB1x1KCab8q5mpeKvnGVT: 'm8', // superseded M8
  WHZpWa7ijaT4c491Zue5BZ: 'm4|m5', // superseded combined M4–M5; anchor prefix picks the module
};

// ---------- arguments ----------
const args = process.argv.slice(2);
const opt = { modules: {} };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--combined') opt.combined = args[++i];
  else if (args[i] === '--overview') opt.overview = args[++i];
  else if (args[i] === '--write-modules') opt.writeModules = true;
  else if (args[i] === '--module') {
    const [code, file] = args[++i].split('=');
    opt.modules[code.toLowerCase()] = file;
  } else throw new Error(`Unknown argument ${args[i]}`);
}
if (!opt.combined) throw new Error('--combined is required');

const jsonScript = (html, id) => {
  const m = html.match(new RegExp(`<script[^>]*id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  return m ? JSON.parse(m[1]) : null;
};

const slugify = (s) => {
  const slug = s.toLowerCase().replace(/&amp;|&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug.length <= 60 ? slug : slug.slice(0, slug.lastIndexOf('-', 60));
};
const pad = (n) => String(n).padStart(2, '0');

// ---------- normalize every source format to one page model ----------
// { mod, key, id, section, sectionName, sectionNameZh, title, titleZh, row, rows, en, zh, format }
function normalize(mod, raw) {
  const id = raw.id;
  const base = {
    mod,
    id,
    key: `${mod}.${id}`,
    section: raw.section,
    row: raw.row ?? raw.rowId ?? '',
    rows: raw.rows,
  };
  if (raw.en) {
    // {en: {sectionName, title, md}, zh: {...}}
    return { ...base, format: 'md', sectionName: raw.en.sectionName, sectionNameZh: raw.zh?.sectionName,
      title: raw.en.title, titleZh: raw.zh?.title, en: raw.en.md, zh: raw.zh?.md };
  }
  if (raw.html !== undefined && raw.md === undefined) {
    // pre-rendered HTML pages (M4/M5): ids like m4-l1.1, sections like m4-l1
    return { ...base, format: 'html', sectionName: raw.sectionName.replace(/^Module \d+ · /, ''),
      title: raw.title, en: raw.html };
  }
  return { ...base, format: 'md', sectionName: raw.sectionName, sectionNameZh: raw.sectionName_zh || undefined,
    title: raw.title, titleZh: raw.title_zh || undefined, en: raw.md, zh: raw.md_zh || undefined };
}

const pages = [];
const combinedHtml = fs.readFileSync(opt.combined, 'utf8');
const combined = jsonScript(combinedHtml, 'data');
const moduleInfo = Object.fromEntries(combined.modules.map((m) => [m.code.toLowerCase(), m]));

for (const p of combined.pages) {
  const mod = p.mod.toLowerCase();
  if (opt.modules[mod]) continue;
  pages.push(normalize(mod, p));
}
for (const [mod, file] of Object.entries(opt.modules)) {
  const list = jsonScript(fs.readFileSync(file, 'utf8'), 'pages');
  if (!list) throw new Error(`${file}: no <script id="pages"> block`);
  for (const p of list) pages.push(normalize(mod, p));
}

// ---------- assign file paths ----------
const byKey = new Map();
for (const p of pages) {
  let dir, file;
  if (p.id.includes('.') && !/^m\d-/.test(p.id)) {
    [dir, file] = [p.section, p.id.slice(p.section.length + 1)];
  } else {
    // m4-00 → 00-overview/01-overview ; m4-l1.2 → 01-<lesson>/02-<title>
    const m = p.id.match(/^m\d-(?:00|l(\d+)\.(\d+))$/);
    if (!m) throw new Error(`Unexpected page id ${p.key}`);
    if (!m[1]) [dir, file] = ['00-overview', '01-overview'];
    else [dir, file] = [`${pad(m[1])}-${slugify(p.sectionName.replace(/^Lesson \d+ · /, ''))}`, `${pad(m[2])}-${slugify(p.title)}`];
  }
  p.dir = dir;
  p.rel = `${p.mod}/${dir}/${file}.md`;
  if (byKey.has(p.key)) throw new Error(`Duplicate page ${p.key}`);
  byKey.set(p.key, p);
}

// ---------- link resolution ----------
const unresolved = [];
function resolve(href, page) {
  let key;
  if (href.startsWith('#')) {
    const a = href.slice(1);
    key = byKey.has(a) ? a : `${page.mod}.${a}`; // combined-file key, or in-module anchor
  } else if (/^https:\/\/claude\.ai\/artifact\//.test(href)) {
    const [, art, anchor] = href.match(/artifact\/([A-Za-z0-9]+)(?:#(.*))?/);
    let mod = ARTIFACT_MODULE[art];
    if (!mod) return null;
    if (mod.includes('|')) mod = anchor?.match(/^(m\d)-/)?.[1];
    if (!mod) return null;
    key = anchor ? `${mod}.${anchor}` : [...byKey.values()].find((p) => p.mod === mod)?.key;
  } else if (/^[^:]+\.md(#.*)?$/.test(href) && !href.startsWith('/')) {
    const [file] = href.split('#');
    const target = path.posix.normalize(path.posix.join(page.section, file)).replace(/\.md$/, '');
    key = `${page.mod}.${target.replace('/', '.')}`;
  } else {
    return undefined; // external or non-page link: leave alone
  }
  const target = byKey.get(key);
  if (!target) return null;
  let rel = path.posix.relative(path.posix.dirname(page.rel), target.rel);
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}
function rewriteLinks(text, page, lang, isHtml) {
  const re = isHtml ? /href="([^"]+)"/g : /\]\(([^)\s]+)\)/g;
  return text.replace(re, (whole, href) => {
    const r = resolve(href.replace(/&amp;/g, '&'), page);
    if (r === undefined) return whole;
    if (r === null) {
      unresolved.push(`${lang}/${page.rel}: ${href}`);
      return whole;
    }
    return isHtml ? `href="${r}"` : `](${r})`;
  });
}

// ---------- HTML → Markdown (M4/M5) ----------
const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*' });
td.use(gfm);
td.addRule('details', {
  filter: 'details',
  replacement(content, node) {
    const summary = node.querySelector('summary');
    const q = summary ? td.turndown(summary.innerHTML).replace(/\n+/g, ' ').trim() : '';
    return `\n\n<details>\n<summary>${q}</summary>\n\n${content.trim()}\n\n</details>\n\n`;
  },
});
td.addRule('summary', { filter: 'summary', replacement: () => '' });
td.addRule('rowid', { filter: (n) => n.nodeName === 'DIV' && n.classList.contains('rowid'), replacement: () => '' });
td.addRule('h1', { filter: 'h1', replacement: () => '' });

const htmlToMd = (html) =>
  td
    .turndown(html)
    .replace(/^(\s*)([-*]|\d+\.) {2,}/gm, '$1$2 ') // turndown pads list markers to 4 columns
    .replace(/^[ \t ]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n');

const stripH1 = (md) => md.replace(/^\s*# [^\n]*\n+/, '');

// ---------- write ----------
// Replace only the imported modules; hand-written pages (home pages etc.) are kept.
for (const mod of new Set(pages.map((p) => p.mod))) {
  fs.rmSync(path.join(DOCS, mod), { recursive: true, force: true });
  fs.rmSync(path.join(DOCS, ZH, mod), { recursive: true, force: true });
}
const write = (rel, fm, body) => {
  const file = path.join(DOCS, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // No blank line after the frontmatter: that is how Pages CMS writes files, so dashboard
  // saves don't produce whitespace-only diffs.
  fs.writeFileSync(file, `---\n${YAML.stringify(fm, { lineWidth: 0 })}---\n${body.trim()}\n`);
};

let count = { en: 0, zh: 0 };
for (const p of pages) {
  const fm = (title) => {
    const o = { title };
    if (p.row) o.row = p.row;
    if (p.rows?.length > 1) o.rows = p.rows;
    return o;
  };
  const en = p.format === 'html' ? htmlToMd(rewriteLinks(p.en, p, 'en', true)) : stripH1(rewriteLinks(p.en, p, 'en', false));
  write(p.rel, fm(p.title), en);
  count.en++;
  if (p.zh) {
    write(`${ZH}/${p.rel}`, fm(p.titleZh || p.title), stripH1(rewriteLinks(p.zh, p, 'zh', false)));
    count.zh++;
  }
}

// ---------- module + lesson labels for the sidebar (editable in the dashboard) ----------
const overview = opt.overview ? JSON.parse(fs.readFileSync(opt.overview, 'utf8')) : {};
const modules = [];
for (const mod of [...new Set(pages.map((p) => p.mod))].sort()) {
  const info = moduleInfo[mod] ?? {};
  const lessons = [];
  for (const p of pages.filter((x) => x.mod === mod)) {
    if (lessons.at(-1)?.dir === p.dir || lessons.some((l) => l.dir === p.dir)) continue;
    const l = { dir: p.dir, label: p.sectionName };
    if (p.sectionNameZh) l.label_zh = p.sectionNameZh;
    lessons.push(l);
  }
  lessons.sort((a, b) => a.dir.localeCompare(b.dir));
  const ov = overview[mod.toUpperCase()] ?? {};
  modules.push({
    code: mod.toUpperCase(),
    dir: mod,
    name: info.name,
    ...(info.name_zh ? { name_zh: info.name_zh } : {}),
    ...ov,
    lessons,
  });
}
fs.mkdirSync('src/data', { recursive: true });
if (opt.writeModules || !fs.existsSync('src/data/modules.json')) {
  fs.writeFileSync('src/data/modules.json', JSON.stringify({ modules }, null, 2) + '\n');
} else {
  console.log('Kept the existing src/data/modules.json (pass --write-modules to replace it).');
}

console.log(`Wrote ${count.en} EN pages and ${count.zh} 中文 pages for ${modules.length} modules.`);
if (unresolved.length) {
  console.error(`\n${unresolved.length} link(s) could not be resolved:`);
  for (const u of unresolved) console.error(`  ${u}`);
  process.exitCode = 1;
}
