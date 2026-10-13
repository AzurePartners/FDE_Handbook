#!/usr/bin/env node
// Brings every English / 中文 page pair back in sync (npm run translate; the Translate workflow runs it
// after each push). Whichever side changed since the last sync (src/data/translations.json) is the
// source: its edit is carried over to the other language with the Claude API. Deletions, renames and
// pairs edited by hand need no API call. Results are checked with scripts/check-content.mjs before
// they are kept.
//
//   npm run translate                  translate and update the record
//   npm run translate -- --dry-run     only list what would be done
//   npm run translate -- --max-pages 50
//
// Environment: ANTHROPIC_API_KEY (needed only when a page must be translated), TRANSLATE_MODEL
// (default claude-opus-5-5). The guide sent with every request is scripts/translate-guide.md.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { DOCS, ZH, pairs, readRecord, writeRecord, pageHash } from '../src/lib/translations.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MODEL = 'claude-opus-5-5';
// $ per million input / output tokens, for the cost line in the summary.
const PRICES = { 'claude-opus-5-5': [4, 20], 'claude-sonnet-5-5': [2, 10], 'claude-haiku-5-5': [0.1, 0.5] };
const LANG = { en: 'English', zh: '中文' };
const PARALLEL = 4;

const docPath = (lang, key) => (lang === 'zh' ? `${DOCS}/${ZH}/${key}` : `${DOCS}/${key}`);

/** What to do for each out-of-sync pair. `from` is the language whose text is the source. */
export function planActions(list) {
  const actions = [];
  const byStatus = (s) => list.filter((p) => p.status === s);
  // An English page moved: its old record entry and a new English page with the same content.
  const newEn = byStatus('new-en');
  const moved = new Set();
  for (const p of byStatus('en-deleted')) {
    const to = newEn.find((n) => !moved.has(n.key) && pageHash(n.en) === p.rec.en);
    if (to) {
      moved.add(to.key);
      actions.push({ type: 'move', key: p.key, to: to.key });
    } else {
      actions.push({ type: 'delete-zh', key: p.key });
    }
  }
  for (const p of list) {
    if (p.status === 'gone') actions.push({ type: 'forget', key: p.key });
    else if (p.status === 'both-changed') actions.push({ type: 'record', key: p.key });
    else if (p.status === 'en-changed' || p.status === 'outdated') actions.push({ type: 'translate', key: p.key, from: 'en' });
    else if (p.status === 'zh-changed') actions.push({ type: 'translate', key: p.key, from: 'zh' });
    else if (p.status === 'new-en' && !moved.has(p.key)) actions.push({ type: 'translate', key: p.key, from: 'en', fresh: true });
    else if (p.status === 'zh-deleted') actions.push({ type: 'translate', key: p.key, from: 'en', fresh: true });
    else if (p.status === 'new-zh') actions.push({ type: 'translate', key: p.key, from: 'zh', fresh: true });
  }
  return actions;
}

/** The version of a file whose hash is `hash`, from git history (null if not found). */
export function findVersion(root, file, hash) {
  try {
    const commits = execFileSync('git', ['log', '--format=%H', '-n', '200', '--', file], { cwd: root, encoding: 'utf8' })
      .split('\n').filter(Boolean);
    for (const c of commits) {
      let text;
      try {
        text = execFileSync('git', ['show', `${c}:${file}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      } catch {
        continue;
      }
      if (pageHash(text) === hash) return text;
    }
  } catch {
    // not a git checkout
  }
  return null;
}

/** The content check's report (scripts/check-content.mjs --json). */
export function runCheck(root) {
  let out;
  try {
    out = execFileSync(process.execPath, [path.join(HERE, 'check-content.mjs'), '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
  } catch (e) {
    out = e.stdout; // exit code 1 just means an error somewhere in the repo
  }
  return JSON.parse(out);
}

/**
 * Problems the content check finds in a pair after a change, sync errors aside: errors in either
 * file, and missing template sections in `target` unless its source page lacks them too.
 */
export function pairProblems(report, key, target) {
  const files = [docPath('en', key), docPath('zh', key)];
  const source = files.find((f) => f !== target);
  const template = (f) => report.warnings.some((w) => w.file === f && w.kind === 'template');
  return [
    ...report.errors.filter((e) => files.includes(e.file) && !e.sync).map((e) => `${e.file}: ${e.message}`),
    ...(target && !template(source) ? report.warnings.filter((w) => w.file === target && w.kind === 'template') : [])
      .map((w) => `${w.file}: ${w.message}`),
  ];
}

export function buildPrompt({ from, to, source, oldSource, target, problems }) {
  const parts = [];
  if (target == null) {
    parts.push(`Translate this ${LANG[from]} page into ${LANG[to]}.`, '', `<${from}_page>\n${source}\n</${from}_page>`);
  } else {
    parts.push(`The ${LANG[from]} page was edited. Update the ${LANG[to]} page so the two say the same thing again.`, '');
    if (oldSource != null) parts.push(`<${from}_page_before_edit>\n${oldSource}\n</${from}_page_before_edit>`, '');
    parts.push(`<${from}_page>\n${source}\n</${from}_page>`, '', `<${to}_page_current>\n${target}\n</${to}_page_current>`);
  }
  if (problems?.length) {
    parts.push('', 'Your previous answer failed these checks. Fix them:', ...problems.map((p) => `- ${p}`));
  }
  parts.push('', `Return the complete ${LANG[to]} file, starting with its --- frontmatter line, and nothing else.`);
  return parts.join('\n');
}

/** Model output → file text: no code fence around it, never `outdated:`, one trailing newline. */
export function cleanOutput(text) {
  let t = text.trim();
  const fenced = t.match(/^```[a-z]*\n([\s\S]*)\n```$/);
  if (fenced) t = fenced[1].trim();
  t = t.replace(/^(---\n[\s\S]*?)^outdated:.*\n/m, '$1');
  return `${t}\n`;
}

/** A translate(request) function backed by the Claude API. */
export function apiTranslator({ model = DEFAULT_MODEL, client = new Anthropic() } = {}) {
  const guide = fs.readFileSync(path.join(HERE, 'translate-guide.md'), 'utf8');
  return async (request) => {
    const params = {
      model,
      max_tokens: 64000,
      output_config: { effort: 'medium' },
      system: [{ type: 'text', text: guide, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: buildPrompt(request) }],
    };
    // Server-side fallback when a safety classifier declines; Haiku has none.
    if (!model.startsWith('claude-haiku')) Object.assign(params, { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
    const message = await client.beta.messages.stream(params).finalMessage();
    if (message.stop_reason !== 'end_turn') throw new Error(`the model stopped early (${message.stop_reason})`);
    const text = message.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    return { text, usage: message.usage };
  };
}

async function inParallel(items, n, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: Math.min(n, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

/**
 * @param {{ root?: string, dryRun?: boolean, maxPages?: number, translate?: Function | null,
 *           check?: (root: string) => object, model?: string, log?: Function }} opts
 * @returns {Promise<{ exitCode: number, done: string[], failed: string[] }>}
 */
export async function run({ root = '.', dryRun = false, maxPages = 20, translate = null, check = runCheck,
  model = DEFAULT_MODEL, log = console.log } = {}) {
  const record = readRecord(root);
  const list = pairs(root, record);
  const byKey = new Map(list.map((p) => [p.key, p]));
  const actions = planActions(list);
  const done = [];
  const failed = [];
  if (!actions.length) {
    log('All English and 中文 pages are in sync.');
    return { exitCode: 0, done, failed };
  }
  const describe = (a) =>
    a.type === 'translate' ? `translate ${a.from} → ${a.from === 'en' ? 'zh' : 'en'}${a.fresh ? ' (new page)' : ''}: ${a.key}`
      : a.type === 'move' ? `move 中文 page: ${a.key} → ${a.to}` : `${a.type}: ${a.key}`;
  const apiActions = actions.filter((a) => a.type === 'translate');
  if (dryRun) {
    for (const a of actions) log(describe(a));
    return { exitCode: 0, done, failed };
  }
  if (apiActions.length > maxPages) {
    log(`${apiActions.length} pages need translating, more than --max-pages ${maxPages}. Nothing was changed; run again with a higher limit.`);
    return { exitCode: 1, done, failed };
  }
  if (apiActions.length && !translate) {
    log(`${apiActions.length} page(s) need translating, but ANTHROPIC_API_KEY is not set:`);
    for (const a of apiActions) log(`  ${describe(a)}`);
    return { exitCode: 2, done, failed };
  }

  const abs = (file) => path.join(root, file);
  const read = (file) => (fs.existsSync(abs(file)) ? fs.readFileSync(abs(file), 'utf8') : null);
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(abs(file)), { recursive: true });
    fs.writeFileSync(abs(file), text);
  };
  const remember = (key) => {
    record[key] = { en: pageHash(read(docPath('en', key))), zh: pageHash(read(docPath('zh', key))) };
  };

  // No API needed. Pairs edited by hand are judged on one check run of the unchanged files.
  let report;
  for (const a of actions) {
    if (a.type === 'forget') delete record[a.key];
    else if (a.type === 'delete-zh') {
      fs.rmSync(abs(docPath('zh', a.key)));
      delete record[a.key];
    } else if (a.type === 'move') {
      write(docPath('zh', a.to), read(docPath('zh', a.key)));
      fs.rmSync(abs(docPath('zh', a.key)));
      record[a.to] = record[a.key];
      delete record[a.key];
    } else if (a.type === 'record') {
      report ??= check(root);
      const problems = pairProblems(report, a.key, null);
      if (problems.length) {
        failed.push(`${a.key}: both pages were edited, but ${problems.join('; ')}`);
        continue;
      }
      remember(a.key);
    } else continue;
    done.push(describe(a));
  }

  // Translations, a few at a time.
  const usage = { input: 0, output: 0 };
  await inParallel(apiActions, PARALLEL, async (a) => {
    const to = a.from === 'en' ? 'zh' : 'en';
    const pair = byKey.get(a.key);
    const targetFile = docPath(to, a.key);
    const original = read(targetFile);
    const request = {
      from: a.from,
      to,
      source: pair[a.from],
      oldSource: !a.fresh && pair.rec ? findVersion(root, docPath(a.from, a.key), pair.rec[a.from]) : null,
      target: a.fresh ? null : original,
    };
    let problems = [];
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const { text, usage: u } = await translate({ ...request, problems });
        usage.input += (u?.input_tokens ?? 0) + (u?.cache_read_input_tokens ?? 0) + (u?.cache_creation_input_tokens ?? 0);
        usage.output += u?.output_tokens ?? 0;
        const result = cleanOutput(text);
        problems = result.startsWith('---\n') ? [] : ['the answer must be the whole file, starting with its --- frontmatter line'];
        if (!problems.length) {
          write(targetFile, result);
          problems = pairProblems(check(root), a.key, targetFile);
        }
      } catch (e) {
        problems = [e.message];
      }
      if (!problems.length) break;
    }
    if (problems.length) {
      if (original == null) fs.rmSync(abs(targetFile), { force: true });
      else write(targetFile, original);
      failed.push(`${describe(a)}: ${problems.join('; ')}`);
      return;
    }
    remember(a.key);
    done.push(describe(a));
  });

  writeRecord(root, record);
  const price = PRICES[model];
  const cost = price ? ` ≈ $${((usage.input * price[0] + usage.output * price[1]) / 1e6).toFixed(2)}` : '';
  const summary = [
    ...done.map((d) => `✓ ${d}`),
    ...failed.map((f) => `✗ ${f}`),
    ...(apiActions.length ? [`Claude API (${model}): ${usage.input} input + ${usage.output} output tokens${cost}`] : []),
  ];
  for (const line of summary) log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Translation sync\n\n${summary.map((l) => `- ${l}`).join('\n')}\n`);
  }
  return { exitCode: failed.length ? 1 : 0, done, failed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
  const model = process.env.TRANSLATE_MODEL || DEFAULT_MODEL;
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  const { exitCode } = await run({
    dryRun: args.includes('--dry-run'),
    maxPages: Number(flag('--max-pages') ?? process.env.TRANSLATE_MAX_PAGES ?? 20),
    translate: hasKey ? apiTranslator({ model }) : null,
    model,
  });
  process.exitCode = exitCode;
}
