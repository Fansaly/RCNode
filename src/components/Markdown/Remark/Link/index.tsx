import React from 'react';

import { childrenConvertor, textConvertor } from './helper';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const Link = ({ node, ...props }: Record<string, any>) => {
  const href = textConvertor(props.href);
  const title = textConvertor(props.title);

  if (href !== props.href) {
    childrenConvertor(props.children);
  }

  return React.createElement('a', { ...props, href, title, target: '_blank' });
};

export default Link;
