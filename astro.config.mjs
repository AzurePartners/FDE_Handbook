// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { fileURLToPath } from 'node:url';
import data from './src/data/modules.json' with { type: 'json' };
import remarkMdLinks from './src/plugins/remark-md-links.mjs';

const ZH = 'zh-CN';

// One collapsible group per module, one sub-group per lesson; pages inside a lesson are
// listed in file-name order (the numeric prefixes), so adding a page needs no config change.
const sidebar = data.modules.map((m) => ({
  label: `${m.code} · ${m.name}`,
  translations: m.name_zh ? { [ZH]: `${m.code} · ${m.name_zh}` } : {},
  collapsed: true,
  items: m.lessons.map((l) => ({
    label: l.label,
    translations: l.label_zh ? { [ZH]: l.label_zh } : {},
    collapsed: true,
    items: [{ autogenerate: { directory: `${m.dir}/${l.dir}` } }],
  })),
}));

export default defineConfig({
  site: process.env.SITE_URL,
  markdown: {
    remarkPlugins: [[remarkMdLinks, { docsDir: fileURLToPath(new URL('./src/content/docs', import.meta.url)) }]],
  },
  integrations: [
    starlight({
      title: { en: 'FDE Handbook', [ZH]: 'FDE 手册' },
      description: 'Azure Partners Forward Deployed Engineer handbook, Modules 0–8.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        zh: { label: '简体中文', lang: ZH },
      },
      sidebar,
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: ['./src/styles/handbook.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      head: [
        { tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap',
          },
        },
      ],
    }),
  ],
});
