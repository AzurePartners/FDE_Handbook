import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { pageHash, pairStatus, pairs, readRecord, writeRecord, isOutdated } from '../src/lib/translations.mjs';
import { planActions, run, findVersion, buildPrompt, cleanOutput, apiTranslator } from '../scripts/translate.mjs';

const EN = '---\ntitle: Page\nrow: M0-L1.1\n---\n**In one sentence:** A page.\n';
const ZH = '---\ntitle: 页面\nrow: M0-L1.1\n---\n**一句话：** 一个页面。\n';
const rec = { en: pageHash(EN), zh: pageHash(ZH) };

test('pair status follows the record', () => {
  assert.equal(pairStatus({ en: EN, zh: ZH, rec }), 'in-sync');
  assert.equal(pairStatus({ en: EN.replace('A page', 'A changed page'), zh: ZH, rec }), 'en-changed');
  assert.equal(pairStatus({ en: EN, zh: ZH.replace('一个', '这个'), rec }), 'zh-changed');
  assert.equal(pairStatus({ en: EN + 'More.\n', zh: ZH + '更多。\n', rec }), 'both-changed');
  assert.equal(pairStatus({ en: EN, zh: ZH, rec: undefined }), 'both-changed', 'a pair added by hand');
  assert.equal(pairStatus({ en: EN, zh: null, rec: undefined }), 'new-en');
  assert.equal(pairStatus({ en: null, zh: ZH, rec: undefined }), 'new-zh');
  assert.equal(pairStatus({ en: null, zh: ZH, rec }), 'en-deleted');
  assert.equal(pairStatus({ en: EN, zh: null, rec }), 'zh-deleted');
  assert.equal(pairStatus({ en: null, zh: null, rec }), 'gone');
});

test('whitespace-only edits do not count, on either side', () => {
  assert.equal(pairStatus({ en: EN.replace('A page.', 'A   page.\n\n'), zh: ZH, rec }), 'in-sync');
  assert.equal(pairStatus({ en: EN, zh: `${ZH}\n\n`, rec }), 'in-sync');
});

test('outdated: true on the 中文 page turns an out-of-sync pair into a warning', () => {
  const zh = ZH.replace('row: M0-L1.1\n', 'row: M0-L1.1\noutdated: true\n');
  assert.ok(isOutdated(zh));
  assert.ok(!isOutdated(`${ZH}\noutdated: true\n`), 'only in the frontmatter');
  assert.equal(pairStatus({ en: EN.replace('A page', 'A changed page'), zh, rec }), 'outdated');
});

test('planned actions: translate the side that changed, move renamed pages, record hand-made pairs', () => {
  const list = [
    { key: 'a.md', en: EN.replace('A page', 'New'), zh: ZH, rec, status: 'en-changed' },
    { key: 'b.md', en: EN, zh: ZH.replace('一个', '这个'), rec, status: 'zh-changed' },
    { key: 'old.md', en: null, zh: ZH, rec, status: 'en-deleted' },
    { key: 'new.md', en: EN, zh: null, rec: undefined, status: 'new-en' },
    { key: 'gone.md', en: null, zh: ZH, rec: { en: 'x', zh: 'y' }, status: 'en-deleted' },
    { key: 'hand.md', en: EN, zh: ZH, rec: undefined, status: 'both-changed' },
    { key: 'zhnew.md', en: null, zh: ZH, rec: undefined, status: 'new-zh' },
  ];
  assert.deepEqual(planActions(list), [
    { type: 'move', key: 'old.md', to: 'new.md' },
    { type: 'delete-zh', key: 'gone.md' },
    { type: 'translate', key: 'a.md', from: 'en' },
    { type: 'translate', key: 'b.md', from: 'zh' },
    { type: 'record', key: 'hand.md' },
    { type: 'translate', key: 'zhnew.md', from: 'zh', fresh: true },
  ]);
});

test('prompt keeps page text inside tags, before the closing instruction', () => {
  const p = buildPrompt({ from: 'en', to: 'zh', source: 'NEW', oldSource: 'OLD', target: 'CUR', problems: ['x is wrong'] });
  assert.match(p, /<en_page_before_edit>\nOLD\n<\/en_page_before_edit>/);
  assert.match(p, /<en_page>\nNEW\n<\/en_page>/);
  assert.match(p, /<zh_page_current>\nCUR\n<\/zh_page_current>/);
  assert.match(p, /- x is wrong/);
  assert.match(p.split('\n').at(-1), /^Return the complete 中文 file/);
  assert.match(buildPrompt({ from: 'zh', to: 'en', source: 'S', target: null }), /^Translate this 中文 page into English\./);
});

test('model output is cleaned: no code fence, no outdated flag', () => {
  assert.equal(cleanOutput('```markdown\n---\ntitle: T\noutdated: true\n---\nBody\n```'), '---\ntitle: T\n---\nBody\n');
});

test('API request: guide as cached system prompt, refusal fallback, early stops rejected', async () => {
  const sent = [];
  const fakeClient = (reply) => ({
    beta: { messages: { stream: (params) => (sent.push(params), { finalMessage: async () => reply }) } },
  });
  const ok = { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: ZH }], usage: {} };
  const out = await apiTranslator({ client: fakeClient(ok) })({ from: 'en', to: 'zh', source: EN, target: null });
  assert.equal(out.text, ZH);
  assert.equal(sent[0].model, 'claude-opus-5-5');
  assert.match(sent[0].system[0].text, /^# FDE Handbook translation guide/);
  assert.deepEqual(sent[0].system[0].cache_control, { type: 'ephemeral' });
  assert.equal(sent[0].fallbacks, 'default');
  assert.deepEqual(sent[0].betas, ['server-side-fallback-2026-07-01']);
  await apiTranslator({ model: 'claude-haiku-5-5', client: fakeClient(ok) })({ from: 'en', to: 'zh', source: EN, target: null });
  assert.equal(sent[1].fallbacks, undefined, 'Haiku has no server-side fallback');
  for (const stop_reason of ['max_tokens', 'refusal']) {
    const t = apiTranslator({ client: fakeClient({ ...ok, stop_reason }) });
    await assert.rejects(t({ from: 'en', to: 'zh', source: EN, target: null }), new RegExp(stop_reason));
  }
});

// ---------- translator runs on a temporary docs tree ----------

function fixture(files, record) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fde-translate-'));
  for (const [f, text] of Object.entries(files)) {
    const p = path.join(root, 'src/content/docs', f);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
  }
  fs.mkdirSync(path.join(root, 'src/data'), { recursive: true });
  if (record) writeRecord(root, record);
  return root;
}
const read = (root, f) => {
  const p = path.join(root, 'src/content/docs', f);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
};
const clean = () => ({ errors: [], warnings: [] });
const quiet = () => {};

test('an English edit is translated into 中文 and recorded; nothing else is touched', async () => {
  const root = fixture({ 'm0/a.md': EN.replace('A page', 'A better page'), 'zh/m0/a.md': ZH, 'm0/b.md': EN, 'zh/m0/b.md': ZH },
    { 'm0/a.md': rec, 'm0/b.md': rec });
  const calls = [];
  const translate = async (req) => {
    calls.push(req);
    return { text: ZH.replace('一个页面', '一个更好的页面'), usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const { exitCode, done } = await run({ root, translate, check: clean, log: quiet });
  assert.equal(exitCode, 0);
  assert.deepEqual(done, ['translate en → zh: m0/a.md']);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].from, 'en');
  assert.equal(calls[0].target, ZH);
  assert.match(read(root, 'zh/m0/a.md'), /一个更好的页面/);
  assert.ok(pairs(root).every((p) => p.status === 'in-sync'));
});

test('a 中文 edit is translated into English', async () => {
  const root = fixture({ 'm0/a.md': EN, 'zh/m0/a.md': ZH.replace('一个页面', '一个短页面') }, { 'm0/a.md': rec });
  const translate = async (req) => ({ text: req.from === 'zh' ? EN.replace('A page', 'A short page') : 'wrong' });
  assert.equal((await run({ root, translate, check: clean, log: quiet })).exitCode, 0);
  assert.match(read(root, 'm0/a.md'), /A short page/);
  assert.equal(pairs(root)[0].status, 'in-sync');
});

test('deletions, renames and hand-made pairs need no API call', async () => {
  const root = fixture(
    { 'zh/m0/deleted.md': ZH, 'm0/renamed.md': EN, 'zh/m0/before-rename.md': ZH, 'm0/hand.md': `${EN}x\n`, 'zh/m0/hand.md': `${ZH}x\n` },
    { 'm0/deleted.md': { en: 'aaaa', zh: rec.zh }, 'm0/before-rename.md': rec, 'm0/hand.md': rec },
  );
  const { exitCode } = await run({ root, translate: null, check: clean, log: quiet });
  assert.equal(exitCode, 0);
  assert.equal(read(root, 'zh/m0/deleted.md'), null);
  assert.equal(read(root, 'zh/m0/renamed.md'), ZH);
  assert.equal(read(root, 'zh/m0/before-rename.md'), null);
  assert.deepEqual(Object.keys(readRecord(root)).sort(), ['m0/hand.md', 'm0/renamed.md']);
  assert.ok(pairs(root).every((p) => p.status === 'in-sync'));
});

test('a result that fails the content check is retried once with the problems, then kept', async () => {
  const root = fixture({ 'm0/a.md': `${EN}More.\n`, 'zh/m0/a.md': ZH }, { 'm0/a.md': rec });
  const seen = [];
  let checks = 0;
  const check = () => (++checks === 1
    ? { errors: [{ file: 'src/content/docs/zh/m0/a.md', message: 'broken link x.md' }], warnings: [] }
    : clean());
  const translate = async (req) => {
    seen.push(req.problems);
    return { text: `${ZH}更多。\n` };
  };
  assert.equal((await run({ root, translate, check, log: quiet })).exitCode, 0);
  assert.deepEqual(seen, [[], ['src/content/docs/zh/m0/a.md: broken link x.md']]);
});

test('a result that keeps failing is not written and the pair stays out of sync', async () => {
  const root = fixture({ 'm0/a.md': `${EN}More.\n`, 'zh/m0/a.md': ZH, 'm0/new.md': EN }, { 'm0/a.md': rec });
  const translate = async () => ({ text: 'Sorry, here is the translation:' });
  const { exitCode, failed } = await run({ root, translate, check: clean, log: quiet });
  assert.equal(exitCode, 1);
  assert.equal(failed.length, 2);
  assert.equal(read(root, 'zh/m0/a.md'), ZH, 'original restored');
  assert.equal(read(root, 'zh/m0/new.md'), null, 'no half-made new page');
  assert.equal(pairs(root).find((p) => p.key === 'm0/a.md').status, 'en-changed');
});

test('without an API key it says so and changes nothing', async () => {
  const root = fixture({ 'm0/a.md': `${EN}More.\n`, 'zh/m0/a.md': ZH }, { 'm0/a.md': rec });
  const lines = [];
  const { exitCode } = await run({ root, translate: null, check: clean, log: (l) => lines.push(l) });
  assert.equal(exitCode, 2);
  assert.match(lines[0], /ANTHROPIC_API_KEY is not set/);
  assert.equal(read(root, 'zh/m0/a.md'), ZH);
});

test('--max-pages stops a run that would translate too many pages', async () => {
  const root = fixture({ 'm0/a.md': EN, 'm0/b.md': EN, 'm0/c.md': EN });
  const translate = async () => assert.fail('must not translate');
  assert.equal((await run({ root, translate, maxPages: 2, check: clean, log: quiet })).exitCode, 1);
});

test('the version a record points at is found in git history', () => {
  const root = fixture({ 'm0/a.md': EN });
  const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: root });
  git('init', '-q');
  git('add', '.');
  git('commit', '-qm', 'v1');
  fs.writeFileSync(path.join(root, 'src/content/docs/m0/a.md'), `${EN}Two.\n`);
  git('commit', '-qam', 'v2');
  assert.equal(findVersion(root, 'src/content/docs/m0/a.md', pageHash(EN)), EN);
  assert.equal(findVersion(root, 'src/content/docs/m0/a.md', 'nope'), null);
});

// ---------- the content check on a small fixture repo ----------

const SECTIONS = {
  en: ['What it is', 'Why an FDE needs this', 'Key concepts', 'Common misconceptions', 'Typical interview questions', 'Learn more', 'Related'],
  zh: ['是什么', 'FDE 为什么需要', '核心概念', '常见误区', '典型面试题', '延伸阅读', '相关页面'],
};
const page = (lang, extra = '') =>
  `---\ntitle: ${lang === 'en' ? 'Page' : '页面'}\nrow: M0-L1.1\n${extra}---\n` +
  `${lang === 'en' ? '**In one sentence:** A page.' : '**一句话：** 一个页面。'}\n\n` +
  SECTIONS[lang].map((h) => `## ${h}\n\nText.\n`).join('\n');

function checkRepo(files) {
  const root = fixture(files);
  fs.writeFileSync(path.join(root, 'src/data/modules.json'), JSON.stringify({
    modules: [{ code: 'M0', dir: 'm0', name: 'Start', name_zh: '开始',
      lessons: [{ dir: '01-a', lesson: 1, label: 'A', label_zh: '甲', outcomes: 'o', minHours: 1, maxHours: 2 }] }],
  }));
  fs.writeFileSync(path.join(root, 'src/data/syllabus.json'), JSON.stringify({ title: 't', intro: [], fullPath: {}, extraRows: [] }));
  writeRecord(root, Object.fromEntries(pairs(root, {}).map((p) => [p.key, { en: pageHash(p.en), zh: pageHash(p.zh) }])));
  return root;
}
const check = (root) => {
  const r = spawnSync(process.execPath, [path.resolve('scripts/check-content.mjs'), '--verbose'], { cwd: root, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
};
const edit = (root, f, fn) => {
  const p = path.join(root, 'src/content/docs', f);
  fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
};

test('content check: an edit to one language fails with TRANSLATION_SYNC_FAILED until the other follows', () => {
  const root = checkRepo({ 'm0/01-a/01-p.md': page('en'), 'zh/m0/01-a/01-p.md': page('zh') });
  assert.equal(check(root).code, 0);
  edit(root, 'm0/01-a/01-p.md', (t) => t.replace('A page.', 'A different page.'));
  const { code, out } = check(root);
  assert.equal(code, 1);
  assert.match(out, /TRANSLATION_SYNC_FAILED\nEnglish: src\/content\/docs\/m0\/01-a\/01-p\.md\nChinese: src\/content\/docs\/zh\/m0\/01-a\/01-p\.md\nReason: English content changed/);
  edit(root, 'zh/m0/01-a/01-p.md', (t) => t.replace('---\n**', 'outdated: true\n---\n**'));
  const marked = check(root);
  assert.equal(marked.code, 0, marked.out);
  assert.match(marked.out, /1 中文 pages marked outdated/);
});

test('content check: 中文 Row IDs must match English, and 中文 pages need their template sections', () => {
  const root = checkRepo({
    'm0/01-a/01-p.md': page('en'),
    'zh/m0/01-a/01-p.md': page('zh').replace('row: M0-L1.1', 'row: M0-L1.2').replace('## 常见误区\n', '## 误区\n'),
  });
  const { code, out } = check(root);
  assert.equal(code, 1);
  assert.match(out, /zh\/m0\/01-a\/01-p\.md: Row IDs \["M0-L1\.2"\] differ from the English page's \["M0-L1\.1"\]/);
  assert.match(out, /zh\/m0\/01-a\/01-p\.md: missing sections: 常见误区/);
});

test('content check: a new English page without its 中文 page fails', () => {
  const root = checkRepo({ 'm0/01-a/01-p.md': page('en'), 'zh/m0/01-a/01-p.md': page('zh') });
  fs.writeFileSync(path.join(root, 'src/content/docs/m0/01-a/02-q.md'), page('en'));
  const { code, out } = check(root);
  assert.equal(code, 1);
  assert.match(out, /Reason: New English page without a 中文 page\./);
});
