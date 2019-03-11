import MarkdownIt from 'markdown-it';
import checkbox from 'markdown-it-task-checkbox';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import container from 'markdown-it-container';
import Prism from 'prismjs';
import extensions from './extensions';
import { transformOrgURL } from '../../common';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '“”‘’',
  highlight: (code, lang) => {
    lang = typeof lang === 'string' && lang.toLocaleLowerCase();
    lang = extensions[lang] || lang;

    if (!Object.keys(Prism.languages).includes(lang)) {
      if (Boolean(lang) && process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.warn(`\`${lang}' code is highlighted with \`markup'.`);
      }

      lang = 'markup';
    }

    return Prism.highlight(code, Prism.languages[lang]);
  },
})
.use(checkbox)
.use(emoji)
.use(sub)
.use(sup)
.use(footnote)
.use(container);

const atToHtml = ({url, text, prevSpaces = '', nextSpaces = ''}) => {
  const href = `${process.env.PUBLIC_URL}/user/${url}`;
  return `${prevSpaces}<a target="_blank" href="${href}">${text}</a>${nextSpaces}`;
};

md.renderer.rules.text = (tokens, idx, options, env, self) => {
  let content = tokens[idx].content;

  if (Boolean(content)) {
    content = content
      .replace(/^(@([\w\-_]+))$/, atToHtml({url: '$2', text: '$1'}))
      .replace(/(\s+)(@([\w\-_]+))/g, atToHtml({url: '$3', text: '$2', prevSpaces: '$1'}))
      .replace(/(@([\w\-_]+))(\s+)/g, atToHtml({url: '$2', text: '$1', nextSpaces: '$3'}));
  }

  return content;
};

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrPush(['target', '_blank']);

  const hrefIdx = tokens[idx].attrIndex('href');
  const hrefSrc = transformOrgURL(tokens[idx].attrs[hrefIdx][1]);

  if (/^\/\w+.*$/.test(hrefSrc)) {
    tokens[idx].attrs[hrefIdx][1] = `${process.env.PUBLIC_URL}${hrefSrc}`;
  } else {
    tokens[idx].attrs[hrefIdx][1] = hrefSrc;
  }

  for (var i = tokens.length - 1; i >= 0; i--) {
    const { type, level, content } = tokens[i];

    if (type === 'text' && level !== 0) {
      tokens[i].content = transformOrgURL(content);
    }
  }

  return self.renderToken(tokens, idx, options);
};

export default md;
