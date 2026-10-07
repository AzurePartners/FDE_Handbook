// Helpers over src/data/modules.json shared by the site, the syllabus generator and the checks.

/** Sidebar / breadcrumb label: "Lesson 2 · FDE vs. Adjacent Roles", or the plain label for
 *  folders that are not syllabus lessons (Introduction, Glossary, …). */
export function lessonLabel(lesson, lang = 'en') {
  const label = (lang === 'zh' && lesson.label_zh) || lesson.label;
  if (lesson.lesson == null) return label;
  return lang === 'zh' ? `第 ${lesson.lesson} 课 · ${label}` : `Lesson ${lesson.lesson} · ${label}`;
}

/** Syllabus lessons only (folders with a lesson number), in lesson order. */
export const syllabusLessons = (module) =>
  module.lessons.filter((l) => l.lesson != null).sort((a, b) => a.lesson - b.lesson);

/** Module study time is the sum of its lessons' study time. */
export function moduleHours(module) {
  const ls = syllabusLessons(module);
  const sum = (k) => Math.round(ls.reduce((s, l) => s + (l[k] ?? 0), 0) * 10) / 10;
  return { minHours: sum('minHours'), maxHours: sum('maxHours') };
}

export const formatHours = (min, max, unit = 'h') => `${min}–${max}${unit}`;
