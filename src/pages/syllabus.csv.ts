// /syllabus.csv: the whole syllabus as one flat table (one row per syllabus row).
import { buildSyllabus, flatRows, toCsv } from '../lib/syllabus.mjs';

export function GET() {
  const { syllabus } = buildSyllabus();
  return new Response(toCsv(flatRows(syllabus, { siteUrl: import.meta.env.SITE ?? '' })), {
    headers: { 'content-type': 'text/csv; charset=utf-8' },
  });
}
