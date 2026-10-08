import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { signJwt, syncSheet, MARKER } from '../scripts/sync-syllabus-sheet.mjs';

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const key = {
  client_email: 'mirror@project.iam.gserviceaccount.com',
  private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
  token_uri: 'https://oauth2.googleapis.com/token',
};

test('the sign-in token is a JWT signed with the service account key', () => {
  const jwt = signJwt(key, Date.UTC(2026, 9, 7));
  const [head, claims, sig] = jwt.split('.');
  assert.ok(crypto.verify('RSA-SHA256', Buffer.from(`${head}.${claims}`), publicKey, Buffer.from(sig, 'base64url')));
  const c = JSON.parse(Buffer.from(claims, 'base64url'));
  assert.equal(c.iss, key.client_email);
  assert.equal(c.scope, 'https://www.googleapis.com/auth/spreadsheets');
  assert.equal(c.exp - c.iat, 3600);
});

// A fake Sheets API that records every call.
function fakeGoogle({ protectedTabs = [] } = {}) {
  const calls = [];
  const sheets = ['Module Overview', 'Master Syllabus', 'Changelog'].map((title, i) => ({
    properties: { sheetId: 100 + i, title, index: i, gridProperties: { rowCount: 100, columnCount: 6 } },
    protectedRanges: protectedTabs.includes(title) ? [{ description: MARKER }] : [],
  }));
  const fetchFn = async (url, init) => {
    const body = init.body && typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    calls.push({ method: init.method, url: url.replace('https://sheets.googleapis.com/v4/spreadsheets/SHEET', ''), body });
    const json = url.includes('oauth2') ? { access_token: 'tok' } : url.includes('?fields=') ? { sheets } : {};
    return { ok: true, json: async () => json, text: async () => '' };
  };
  return { calls, fetchFn };
}

test('first run: keeps a copy of each tab, protects it, grows the grid, then writes', async () => {
  const g = fakeGoogle();
  await syncSheet({ key, sheetId: 'SHEET', siteUrl: 'https://h.example', fetchFn: g.fetchFn, now: new Date('2026-10-07T12:00:00Z') });
  const batch = g.calls.find((c) => c.url === ':batchUpdate').body.requests;
  assert.deepEqual(
    batch.filter((r) => r.duplicateSheet).map((r) => r.duplicateSheet.newSheetName),
    ['Module Overview (before GitHub 2026-10-07)', 'Master Syllabus (before GitHub 2026-10-07)'],
  );
  assert.equal(batch.filter((r) => r.addProtectedRange?.protectedRange.warningOnly).length, 2);
  assert.ok(batch.some((r) => r.appendDimension?.sheetId === 101 && r.appendDimension.dimension === 'ROWS'));
  assert.ok(batch.some((r) => r.appendDimension?.dimension === 'COLUMNS' && r.appendDimension.sheetId === 100));
  const write = g.calls.find((c) => c.url === '/values:batchUpdate').body;
  assert.deepEqual(write.data.map((d) => d.range), ["'Module Overview'!A1", "'Master Syllabus'!A1"]);
  assert.match(write.data[1].values[3][0], /^Read-only copy, generated from the handbook on 2026-10-07/);
  // Other tabs are never touched.
  assert.ok(!JSON.stringify(g.calls).includes('Changelog'));
});

test('later runs only rewrite the values', async () => {
  const g = fakeGoogle({ protectedTabs: ['Module Overview', 'Master Syllabus'] });
  // Grids already large enough: no structural changes at all.
  g.fetchFn = ((inner) => async (url, init) => {
    const res = await inner(url, init);
    if (url.includes('?fields=')) {
      const j = await res.json();
      for (const s of j.sheets) s.properties.gridProperties = { rowCount: 1000, columnCount: 26 };
      return { ok: true, json: async () => j, text: async () => '' };
    }
    return res;
  })(g.fetchFn);
  await syncSheet({ key, sheetId: 'SHEET', fetchFn: g.fetchFn });
  assert.equal(g.calls.filter((c) => c.url === ':batchUpdate').length, 0);
  assert.deepEqual(g.calls.map((c) => c.url.split('?')[0]).slice(1), ['', '/values:batchClear', '/values:batchUpdate']);
});
