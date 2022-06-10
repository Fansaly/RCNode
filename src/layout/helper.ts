import { NAME } from '@/config';

export const changeTitle = (title?: string) => {
  document.title = title || NAME;
};

const changeElementAttributes = (element: any, attrs: RCNode.HTMLAttributes) => {
  if (element === 'html') {
    element = document.documentElement;
  } else if (element === 'body') {
    element = document.body;
  } else if (!element || !document.body.contains(element)) {
    return;
  }

  attrs = Object.assign({ id: null, class: null }, attrs || {});

  Object.keys(attrs).forEach((name) => {
    const value = (attrs as any)[name];

    if (value) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  });
};

export const changeHtmlAttributes = (attrs: RCNode.HTMLAttributes) => {
  changeElementAttributes('html', attrs);
};

export const changeBodyAttributes = (attrs: RCNode.HTMLAttributes) => {
  changeElementAttributes('body', attrs);
};
