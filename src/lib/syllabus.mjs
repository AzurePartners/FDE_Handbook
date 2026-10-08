// Builds the Master Syllabus from the handbook itself, so it can never drift from the pages.
//
//   per row     Row ID, topic title, one-sentence summary, resources  ← the pages (frontmatter,
//                                                                       "In one sentence", "Learn more")
//   per lesson  title, learning outcomes, study time                  ← src/data/modules.json
//   per module  name, goal, purpose, notes; hours = sum of lessons    ← src/data/modules.json
//   practice rows that have no page, intro text                       ← src/data/syllabus.json
//
// Used by the /syllabus page, the CSV download, the Google Sheet mirror and the content checks.

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { syllabusLessons, moduleHours, formatHours } from './modules.mjs';

const DOCS = 'src/content/docs';
const ROW = /^M(\d)-L(\d+)\.(\d+)$/;

const readJson = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

// Markdown → plain text for the syllabus cells.
const plain = (md) =>
  md
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

function readPage(root, file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const fm = YAML.parse(m[1]) ?? {};
  const body = m[2];
  const summary = body.match(/^\*\*In one sentence:\*\*\s*(.+)$/m)?.[1] ?? '';
  const learnMore = body.match(/^## Learn more\n([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? '';
  const resources = [...learnMore.matchAll(/^[-*] (.+)$/gm)].map(([, item]) => ({
    text: plain(item),
    urls: [...item.matchAll(/\]\((https?:[^)\s]+)\)/g)].map((u) => u[1]),
  }));
  const id = path.relative(path.join(root, DOCS), file).split(path.sep).join('/').replace(/\.md$/, '');
  return { id, file, title: fm.title ?? '', row: fm.row ?? '', rows: fm.rows ?? [], summary: plain(summary), resources };
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
  });
}

const rowKey = (row) => {
  const [, m, l, n] = row.match(ROW);
  return [Number(m), Number(l), Number(n)];
};
const byRow = (a, b) => {
  const [x, y] = [rowKey(a.row), rowKey(b.row)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

const resourceText = (r) => `• ${r.text}${r.urls.length ? ` — ${r.urls.join(' · ')}` : ''}`;

/**
 * @param {{ root?: string }} [opts]
 * @returns {{ syllabus: object, problems: string[] }}
 */
export function buildSyllabus({ root = process.cwd() } = {}) {
  const { modules } = readJson(root, 'src/data/modules.json');
  const meta = readJson(root, 'src/data/syllabus.json');
  const problems = [];

  // English pages only; 中文 pages share their English page's row.
  const pages = modules.flatMap((m) => walk(path.join(root, DOCS, m.dir))).map((f) => readPage(root, f)).filter(Boolean);
  pages.sort((a, b) => a.id.localeCompare(b.id));

  const rows = new Map(); // row → { row, pages, practice?, topics?, resources? }
  const entry = (row) => rows.get(row) ?? rows.set(row, { row, pages: [] }).get(row);
  for (const p of pages) if (p.row) entry(p.row).pages.push(p);
  // A row listed only as a secondary row of a page (M6) still points at that page.
  for (const p of pages) for (const r of p.rows) if (!rows.has(r)) entry(r).pages.push(p);
  for (const x of meta.extraRows) {
    if (rows.has(x.row)) problems.push(`syllabus.json: practice row ${x.row} also has a handbook page; remove one of them`);
    else rows.set(x.row, { row: x.row, pages: [], practice: true, topics: x.topics, resourcesText: x.resources });
  }

  const out = modules.map((m) => {
    const mNum = Number(m.code.slice(1));
    const firstPage = pages.find((p) => p.id.startsWith(`${m.dir}/`));
    const lessons = syllabusLessons(m).map((l) => ({
      lesson: l.lesson,
      dir: l.dir,
      title: l.label,
      outcomes: l.outcomes ?? '',
      minHours: l.minHours,
      maxHours: l.maxHours,
      rows: [],
    }));
    return { code: m.code, dir: m.dir, number: mNum, name: m.name, goal: m.goal ?? '', purpose: m.purpose ?? '',
      notes: m.notes ?? '', ...moduleHours(m), firstPage: firstPage?.id, lessons };
  });

  for (const r of [...rows.values()]) {
    if (!ROW.test(r.row)) {
      problems.push(`Row ID "${r.row}" is not in the M4-L1.2 format`);
      continue;
    }
    const [mNum, lNum] = rowKey(r.row);
    const lesson = out.find((m) => m.number === mNum)?.lessons.find((l) => l.lesson === lNum);
    if (!lesson) {
      problems.push(`Row ${r.row} (${r.pages[0]?.id ?? 'syllabus.json'}) belongs to Module ${mNum} Lesson ${lNum}, which is not in src/data/modules.json`);
      continue;
    }
    const seen = new Set();
    const resources = r.pages.flatMap((p) => p.resources).filter((x) => {
      const k = x.urls.join(' ') || x.text;
      return seen.has(k) ? false : seen.add(k);
    });
    const resourceItems = r.practice
      ? (r.resourcesText ?? '').split('\n').map((line) => line.replace(/^\s*•\s*/, '').trim()).filter(Boolean)
          .map((line) => ({ text: line.replace(/\s*—?\s*https?:\S+/g, '').trim(), urls: line.match(/https?:[^\s·]+/g) ?? [] }))
      : resources;
    lesson.rows.push({
      row: r.row,
      practice: !!r.practice,
      resourceItems,
      pages: r.pages.map((p) => ({ id: p.id, title: p.title, summary: p.summary })),
      topics: r.practice ? r.topics : r.pages.map((p) => `${p.title}: ${p.summary}`).join('\n'),
      resources: r.practice ? r.resourcesText : resources.map(resourceText).join('\n'),
    });
  }
  for (const m of out) for (const l of m.lessons) l.rows.sort(byRow);

  return { syllabus: { title: meta.title, intro: meta.intro, overviewTitle: meta.overviewTitle, fullPath: meta.fullPath, modules: out }, problems };
}

const pageUrl = (siteUrl, id) => `${(siteUrl ?? '').replace(/\/$/, '')}/${id}/`;

/** The two Google Sheet tabs, in the same layout as the original sheet. */
export function sheetValues(syllabus, { siteUrl, note }) {
  const master = [
    [syllabus.title],
    ...syllabus.intro.map((t) => [t]),
    [note],
    ['Row ID', 'Lesson / Title', 'What You Learn (Topics / Hands-on Practice)', 'Recommended Resources (EN)', 'Learning Outcomes / Main Deliverables', 'Estimated Study Time'],
  ];
  const overview = [
    [syllabus.overviewTitle],
    [note],
    ['Module', 'Lessons', 'Estimated Minimum Hours', 'Estimated Maximum Hours', 'Module Purpose', 'Notes', 'Handbook Link'],
  ];
  let total = { lessons: 0, min: 0, max: 0 };
  for (const m of syllabus.modules) {
    const name = `Module ${m.number}: ${m.name}`;
    master.push([name], [`Goal: ${m.goal}`]);
    for (const l of m.lessons) {
      l.rows.forEach((r, i) => {
        const first = i === 0;
        master.push([r.row, first ? `Lesson ${l.lesson} | ${l.title}` : '', r.topics, r.resources,
          first ? l.outcomes : '', first ? formatHours(l.minHours, l.maxHours) : '']);
      });
    }
    overview.push([name, m.lessons.length, m.minHours, m.maxHours, m.purpose, m.notes, m.firstPage ? pageUrl(siteUrl, m.firstPage) : '']);
    total = { lessons: total.lessons + m.lessons.length, min: total.min + m.minHours, max: total.max + m.maxHours };
  }
  overview.push([], ['Full Path Total', total.lessons, Math.round(total.min * 10) / 10, Math.round(total.max * 10) / 10,
    syllabus.fullPath.purpose, syllabus.fullPath.notes]);
  return { 'Master Syllabus': master, 'Module Overview': overview };
}

/** One row per syllabus row, for the CSV download (easy to filter in Excel or Sheets). */
export function flatRows(syllabus, { siteUrl } = {}) {
  const header = ['Module', 'Module name', 'Lesson', 'Lesson title', 'Row ID', 'What you learn', 'Resources',
    'Learning outcomes', 'Study time', 'Handbook page'];
  const rows = [header];
  for (const m of syllabus.modules)
    for (const l of m.lessons)
      for (const r of l.rows)
        rows.push([m.code, m.name, l.lesson, l.title, r.row, r.topics, r.resources, l.outcomes,
          formatHours(l.minHours, l.maxHours), r.pages[0] ? pageUrl(siteUrl, r.pages[0].id) : '']);
  return rows;
}

export const toCsv = (rows) =>
  '﻿' + // byte-order mark, so Excel opens the file as UTF-8
  rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n') + '\r\n';
