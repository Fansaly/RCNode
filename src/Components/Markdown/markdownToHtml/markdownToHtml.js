import sanitizeHtml from 'sanitize-html';
import markdownRender from './markdown-it';

const blacklist = [ 'style', 'script', 'textarea', 'noscript' ];

export default (markdownString) => {
  return sanitizeHtml(markdownRender.render(markdownString), {
    allowedTags: false,
    exclusiveFilter: (frame) => {
      return blacklist.includes(frame.tag);
    },
  });
};
