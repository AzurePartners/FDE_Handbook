#!/usr/bin/env node
// Mirrors the generated syllabus into the Google Sheet, which becomes a read-only copy:
// the "Module Overview" and "Master Syllabus" tabs are rewritten from the handbook on every
// change to main. Other tabs are left alone.
//
// On the first run each tab is copied to "<tab> (before GitHub <date>)", then protected so that
// anyone editing it gets a warning, and its empty note row says where to make changes instead.
//
// Environment:
//   GOOGLE_SERVICE_ACCOUNT_KEY  the service account's JSON key (the whole file's contents)
//   SYLLABUS_SHEET_ID           the spreadsheet id (from its URL)
//   SITE_URL                    optional, for the Handbook Link column (e.g. https://handbook.example.com)
//
//   node scripts/sync-syllabus-sheet.mjs --dry-run   shows what would be written, calls nothing

import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { buildSyllabus, sheetValues } from '../src/lib/syllabus.mjs';

export const MARKER = 'Generated from GitHub (AzurePartners/FDE_Handbook)';
const TABS = ['Module Overview', 'Master Syllabus'];
const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';

const b64url = (data) => Buffer.from(data).toString('base64url');

/** A signed JWT asking Google for a Sheets access token on behalf of the service account. */
export function signJwt(key, now = Date.now()) {
  const iat = Math.floor(now / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: key.token_uri ?? 'https://oauth2.googleapis.com/token',
    iat,
    exp: iat + 3600,
  }));
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${head}.${claims}`), key.private_key);
  return `${head}.${claims}.${b64url(signature)}`;
}

async function call(fetchFn, token, method, url, body) {
  const res = await fetchFn(url, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${url.replace(SHEETS, '')} → ${res.status} ${await res.text()}`);
  return res.json();
}

export async function syncSheet({ key, sheetId, siteUrl, fetchFn = globalThis.fetch, now = new Date() }) {
  const { syllabus, problems } = buildSyllabus();
  if (problems.length) throw new Error(`The syllabus has problems; run npm run check:\n${problems.join('\n')}`);
  const date = now.toISOString().slice(0, 10);
  const note = `Read-only copy, generated from the handbook on ${date}. Changes made here are overwritten: ` +
    'edit the handbook pages, or Modules & lessons / Syllabus in the dashboard, instead.';
  const values = sheetValues(syllabus, { siteUrl, note });

  const tokenRes = await fetchFn(key.token_uri ?? 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: signJwt(key, now.getTime()) }),
  });
  if (!tokenRes.ok) throw new Error(`Google sign-in failed: ${tokenRes.status} ${await tokenRes.text()}`);
  const { access_token: token } = await tokenRes.json();

  const fields = 'sheets(properties(sheetId,title,index,gridProperties(rowCount,columnCount)),protectedRanges(description))';
  let { sheets } = await call(fetchFn, token, 'GET', `${SHEETS}/${sheetId}?fields=${encodeURIComponent(fields)}`);

  // Create missing tabs first, so they have ids for the requests below.
  const missing = TABS.filter((t) => !sheets.some((s) => s.properties.title === t));
  if (missing.length) {
    await call(fetchFn, token, 'POST', `${SHEETS}/${sheetId}:batchUpdate`, {
      requests: missing.map((title) => ({ addSheet: { properties: { title } } })),
    });
    ({ sheets } = await call(fetchFn, token, 'GET', `${SHEETS}/${sheetId}?fields=${encodeURIComponent(fields)}`));
  }

  const requests = [];
  for (const tab of TABS) {
    const sheet = sheets.find((s) => s.properties.title === tab);
    const { sheetId: id, index, gridProperties: grid } = sheet.properties;
    const firstRun = !(sheet.protectedRanges ?? []).some((p) => p.description === MARKER);
    if (firstRun) {
      if (!missing.includes(tab)) {
        requests.push({ duplicateSheet: { sourceSheetId: id, insertSheetIndex: index + 1, newSheetName: `${tab} (before GitHub ${date})` } });
      }
      requests.push({ addProtectedRange: { protectedRange: { range: { sheetId: id }, description: MARKER, warningOnly: true } } });
    }
    const rows = values[tab].length;
    const cols = Math.max(...values[tab].map((r) => r.length));
    if (rows > grid.rowCount) requests.push({ appendDimension: { sheetId: id, dimension: 'ROWS', length: rows - grid.rowCount } });
    if (cols > grid.columnCount) requests.push({ appendDimension: { sheetId: id, dimension: 'COLUMNS', length: cols - grid.columnCount } });
  }
  if (requests.length) await call(fetchFn, token, 'POST', `${SHEETS}/${sheetId}:batchUpdate`, { requests });

  const ranges = TABS.map((t) => `'${t}'`);
  await call(fetchFn, token, 'POST', `${SHEETS}/${sheetId}/values:batchClear`, { ranges });
  await call(fetchFn, token, 'POST', `${SHEETS}/${sheetId}/values:batchUpdate`, {
    valueInputOption: 'RAW',
    data: TABS.map((t) => ({ range: `'${t}'!A1`, values: values[t] })),
  });
  return { values, requests };
}

// ---------- command line ----------
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dryRun = process.argv.includes('--dry-run');
  const { SYLLABUS_SHEET_ID: sheetId, SITE_URL: siteUrl, GOOGLE_SERVICE_ACCOUNT_KEY: rawKey } = process.env;
  if (dryRun) {
    const { syllabus, problems } = buildSyllabus();
    const values = sheetValues(syllabus, { siteUrl, note: '(note row)' });
    for (const t of TABS) console.log(`${t}: ${values[t].length} rows`);
    if (problems.length) console.error(problems.join('\n'));
    process.exit(problems.length ? 1 : 0);
  }
  if (!rawKey || !sheetId) {
    console.log('::notice::Syllabus sheet mirror is not set up (GOOGLE_SERVICE_ACCOUNT_KEY / SYLLABUS_SHEET_ID missing); skipped. See README, "Google Sheet mirror".');
    process.exit(0);
  }
  try {
    const { values } = await syncSheet({ key: JSON.parse(rawKey), sheetId, siteUrl });
    console.log(`Updated ${TABS.map((t) => `"${t}" (${values[t].length} rows)`).join(' and ')} in https://docs.google.com/spreadsheets/d/${sheetId}`);
  } catch (e) {
    console.error(`::error::${e.message}`);
    if (/403|PERMISSION_DENIED/.test(e.message)) {
      console.error('Share the spreadsheet with the service account email (Editor), and enable the Google Sheets API in its Google Cloud project.');
    }
    process.exit(1);
  }
}
