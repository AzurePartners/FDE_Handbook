// English ⇄ 中文 sync record, shared by the content check and the translator (scripts/translate.mjs).
//
// src/data/translations.json holds, per page, a hash of the English and the 中文 file as they were
// the last time the two were in sync. A pair is in sync when both files still hash to the record;
// if either side changed, the other one needs the same change (the Translate workflow does that).
// Hashes ignore whitespace, so re-wrapping a paragraph never counts as a change.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const DOCS = 'src/content/docs';
export const ZH = 'zh';
export const RECORD = 'src/data/translations.json';

export const pageHash = (text) =>
  crypto.createHash('sha256').update(text.replace(/\s+/g, ' ').trim()).digest('hex').slice(0, 16);

/** `outdated: true` in a 中文 page's frontmatter: the translation is knowingly behind its English page. */
export const isOutdated = (text) => /^outdated:\s*true\s*$/m.test((text ?? '').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '');

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
      })
    : [];

export function readRecord(root = '.') {
  const file = path.join(root, RECORD);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

/** One page per line, sorted, so edits to different pages merge cleanly in git. */
export function writeRecord(root, record) {
  const keys = Object.keys(record).sort();
  const lines = keys.map((k) => `  ${JSON.stringify(k)}: {"en": ${JSON.stringify(record[k].en)}, "zh": ${JSON.stringify(record[k].zh)}}`);
  fs.writeFileSync(path.join(root, RECORD), `{\n${lines.join(',\n')}\n}\n`);
}

/**
 * Status of one page pair, keyed by the English path relative to the docs folder.
 *   in-sync      both files match the record
 *   outdated     out of sync, but the 中文 page is marked `outdated: true`
 *   en-changed   only the English page changed since the last sync
 *   zh-changed   only the 中文 page changed
 *   both-changed both changed (or a new pair added by hand, with no record yet)
 *   new-en       English page with no 中文 page and no record: translate it
 *   new-zh       中文 page with no English page and no record: translate it
 *   en-deleted   the English page was removed: remove the 中文 page too
 *   zh-deleted   the 中文 page was removed but English is still there: re-create it
 *   gone         neither file exists any more: drop the record entry
 */
export function pairStatus({ en, zh, rec }) {
  if (en == null && zh == null) return 'gone';
  if (zh == null) return rec ? 'zh-deleted' : 'new-en';
  if (en == null) return rec ? 'en-deleted' : 'new-zh';
  const enChanged = !rec || pageHash(en) !== rec.en;
  const zhChanged = !rec || pageHash(zh) !== rec.zh;
  if (!enChanged && !zhChanged) return 'in-sync';
  if (isOutdated(zh)) return 'outdated';
  if (enChanged && zhChanged) return 'both-changed';
  return enChanged ? 'en-changed' : 'zh-changed';
}

/** Every page pair in the repo with its status. `key` is the English path relative to src/content/docs. */
export function pairs(root = '.', record = readRecord(root)) {
  const docs = path.join(root, DOCS);
  const rel = (f) => path.relative(docs, f).split(path.sep).join('/');
  const keys = new Set(Object.keys(record));
  for (const f of walk(docs)) {
    const r = rel(f);
    keys.add(r.startsWith(`${ZH}/`) ? r.slice(ZH.length + 1) : r);
  }
  const read = (r) => (fs.existsSync(path.join(docs, r)) ? fs.readFileSync(path.join(docs, r), 'utf8') : null);
  return [...keys].sort().map((key) => {
    const en = read(key);
    const zh = read(`${ZH}/${key}`);
    const rec = record[key];
    return { key, en, zh, rec, status: pairStatus({ en, zh, rec }) };
  });
}

/** Why a pair needs work, in words, for the check's TRANSLATION_SYNC_FAILED report. */
export const REASONS = {
  'en-changed': 'English content changed since the last translation; the 中文 page needs the same change.',
  'zh-changed': '中文 content changed since the last translation; the English page needs the same change.',
  'both-changed': 'Both pages changed since the last sync; record them once they say the same thing.',
  'new-en': 'New English page without a 中文 page.',
  'new-zh': 'New 中文 page without an English page.',
  'en-deleted': 'The English page was deleted but its 中文 page is still there.',
  'zh-deleted': 'The 中文 page was deleted but its English page is still there.',
  gone: 'Both pages are gone but src/data/translations.json still lists them.',
};
