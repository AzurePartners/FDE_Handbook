import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBasicAuth } from '../src/auth/basic-auth.js';

const env = { SITE_USERNAME: 'team', SITE_PASSWORD: 'p:ss wörd' };
const req = (authorization) =>
  new Request('https://handbook.example/m0/', authorization ? { headers: { authorization } } : {});
const basic = (user, pass) =>
  'Basic ' + btoa(String.fromCharCode(...new TextEncoder().encode(`${user}:${pass}`)));

test('lets the right username and password through', () => {
  assert.equal(checkBasicAuth(req(basic('team', 'p:ss wörd')), env), null);
});

test('asks for a login when no credentials are sent', () => {
  const res = checkBasicAuth(req(), env);
  assert.equal(res.status, 401);
  assert.match(res.headers.get('www-authenticate'), /^Basic realm="FDE Handbook"/);
});

test('rejects a wrong password, a wrong username and a malformed header', () => {
  for (const h of [basic('team', 'wrong'), basic('other', 'p:ss wörd'), 'Basic !!!', 'Bearer abc', basic('team', 'p:ss wörd') + 'x']) {
    assert.equal(checkBasicAuth(req(h), env).status, 401, h);
  }
});

test('stays closed when the credentials are not configured', () => {
  assert.equal(checkBasicAuth(req(basic('team', 'x')), {}).status, 503);
  assert.equal(checkBasicAuth(req(basic('', '')), { SITE_USERNAME: '', SITE_PASSWORD: '' }).status, 503);
});
