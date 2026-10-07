// Turns relative links to other handbook pages (`../02-lesson/03-page.md#anchor`) into site
// URLs (`/m0/02-lesson/03-page/#anchor`). Authors keep writing plain file paths, which also
// work when browsing the repo on GitHub; scripts/check-content.mjs verifies every target exists.
import path from 'node:path';

const MD_LINK = /^(?![a-z][a-z0-9+.-]*:|\/|#)([^?#]+)\.md(#.*)?$/i;

export default function remarkMdLinks({ docsDir }) {
  return (tree, file) => {
    const source = file.path ?? file.history?.[0];
    if (!source || !source.startsWith(docsDir)) return;
    const walk = (node) => {
      if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
        const m = node.url.match(MD_LINK);
        if (m) {
          const target = path.relative(docsDir, path.resolve(path.dirname(source), m[1]));
          const slug = target.split(path.sep).join('/').toLowerCase().replace(/(^|\/)index$/, '');
          node.url = `/${slug}${slug ? '/' : ''}${m[2] ?? ''}`;
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
