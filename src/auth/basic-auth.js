// HTTP Basic Auth check used by the Vercel middleware (middleware.js).
// Credentials come from the SITE_USERNAME and SITE_PASSWORD environment variables.
// If either is missing the site stays closed rather than going public by accident.

const REALM = 'FDE Handbook';

// Compares in time that depends only on the lengths, so the password can't be guessed
// one character at a time from response timings.
function safeEqual(a, b) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function decode(header) {
  const [scheme, encoded] = (header ?? '').split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return null;
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const text = new TextDecoder().decode(bytes);
    const i = text.indexOf(':');
    return i < 0 ? null : { user: text.slice(0, i), pass: text.slice(i + 1) };
  } catch {
    return null;
  }
}

/** Returns a Response to send instead of the page, or null when the request may continue. */
export function checkBasicAuth(request, env) {
  const { SITE_USERNAME: user, SITE_PASSWORD: pass } = env;
  if (!user || !pass) {
    return new Response('Site login is not configured: set SITE_USERNAME and SITE_PASSWORD.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  const given = decode(request.headers.get('authorization'));
  if (given && safeEqual(given.user, user) & safeEqual(given.pass, pass)) return null;
  return new Response('Login required.', {
    status: 401,
    headers: {
      'www-authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
