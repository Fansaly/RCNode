import marked from 'marked';
import Prism from 'prismjs';
import extensions from './extensions';
import { transformOrgURL } from '../../common';

const renderer = new marked.Renderer();

renderer.link = (href, title, text) => {
  href = transformOrgURL(href);
  text = transformOrgURL(text);
  title = !!title ? ` title="${transformOrgURL(title)}"` : '';

  return `<a href="${href}" target="_blank"${title}>${text}</a>`;
};

renderer.image = (src, title, text) => {
  const alt = !!text ? ` alt="${text}"` : '';
  title = !!title ? ` title="${title}"` : '';

  return `<img src="${src}" class="image-zoom" data-action="zoom"${alt}${title}>`;
};

marked.setOptions({
  renderer,
  highlight: (code, lang) => {
    lang = extensions[lang] || lang || 'markup';

    if (!Object.keys(Prism.languages).includes(lang)) {
      console.warn(`\`${lang}' code is not highlighted.`);
    } else {
      return Prism.highlight(code, Prism.languages[lang]);
    }
  },
  gfm: true,
});

export default marked;
