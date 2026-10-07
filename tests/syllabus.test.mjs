import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildSyllabus, sheetValues, flatRows, toCsv } from '../src/lib/syllabus.mjs';

const { syllabus, problems } = buildSyllabus();
const allRows = syllabus.modules.flatMap((m) => m.lessons.flatMap((l) => l.rows));

test('the handbook and the syllabus data agree', () => {
  assert.deepEqual(problems, []);
});

test('every page Row ID and every practice row appears exactly once', () => {
  const ids = allRows.map((r) => r.row);
  assert.equal(new Set(ids).size, ids.length);
  const { extraRows } = JSON.parse(fs.readFileSync('src/data/syllabus.json', 'utf8'));
  for (const x of extraRows) assert.ok(allRows.find((r) => r.row === x.row && r.practice), x.row);
  assert.ok(allRows.filter((r) => !r.practice).every((r) => r.pages.length > 0));
});

test('rows use the page title and its one-sentence summary', () => {
  const r = allRows.find((x) => x.row === 'M0-L1.1');
  assert.match(r.topics, /^Forward Deployed Engineer: A Forward Deployed Engineer \(FDE\) is an engineer/);
  assert.match(r.resources, /^• .+ — https:\/\//);
});

test('module study time is the sum of its lessons', () => {
  const m0 = syllabus.modules.find((m) => m.code === 'M0');
  assert.deepEqual([m0.minHours, m0.maxHours], [1.5, 3]);
});

test('sheet tabs keep the original layout', () => {
  const v = sheetValues(syllabus, { siteUrl: 'https://h.example', note: 'generated' });
  const master = v['Master Syllabus'];
  assert.equal(master[4][0], 'Row ID');
  assert.equal(master[5][0], 'Module 0: Start Here — Understanding the FDE Role');
  assert.match(master[6][0], /^Goal: /);
  assert.equal(master.length, 5 + syllabus.modules.length * 2 + allRows.length);
  const overview = v['Module Overview'];
  assert.deepEqual(overview.at(-1).slice(0, 4), ['Full Path Total', 47, 248.5, 384]);
  assert.match(overview[3][6], /^https:\/\/h\.example\/m0\/.+\/$/);
});

test('CSV escapes quotes and starts with a byte-order mark', () => {
  const csv = toCsv([['a "b"', 'c,d'], [1, null]]);
  assert.equal(csv, '\ufeff"a ""b""","c,d"\r\n"1",""\r\n');
  assert.equal(flatRows(syllabus).length, allRows.length + 1);
});
