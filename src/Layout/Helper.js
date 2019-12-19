export const changeTitle = title => {
  document.title = Boolean(title) ? title : 'RCNode';
};

const changeElementAttributes = (element, attrs) => {
  if (element === 'html') {
    element = document.documentElement;
  } else if (element === 'body') {
    element = document.body;
  } else if (!document.body.contains(element)) {
    return;
  }

  attrs = Object.assign({ id: null, class: null }, attrs);

  Object.keys(attrs).forEach(name => {
    const value = attrs[name];

    if (Boolean(value)) {
      element.setAttribute(name, value);
    } else {
      element.removeAttribute(name);
    }
  });
};

export const changeHtmlAttributes = attrs => {
  changeElementAttributes('html', attrs);
};

export const changeBodyAttributes = attrs => {
  changeElementAttributes('body', attrs);
};
