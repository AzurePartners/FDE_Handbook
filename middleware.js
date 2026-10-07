// Vercel Routing Middleware: runs before every request, including the static pages and the
// search index, and asks for the shared username and password (see src/auth/basic-auth.js).
// Replace this file when a real sign-in method is added.
import { next } from '@vercel/functions';
import { checkBasicAuth } from './src/auth/basic-auth.js';

export default function middleware(request) {
  return checkBasicAuth(request, process.env) ?? next();
}
