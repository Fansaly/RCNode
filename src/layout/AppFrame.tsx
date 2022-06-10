import React from 'react';

import Notice from '@/components/Notice';
import ScrollToTop from '@/components/ScrollToTop';
import { useCurrentMeta } from '@/router';

import Header from './Header';
import { changeBodyAttributes, changeHtmlAttributes, changeTitle } from './helper';

const defaultProps: RCNode.AppProps = {
  htmlAttributes: null,
  bodyAttributes: null,
  withHeader: true,
};

const AppFrame = ({ reset = false, children, ...rest }: RCNode.AppProps) => {
  const meta = useCurrentMeta();

  const {
    title,
    htmlAttributes,
    bodyAttributes,
    withHeader = true,
  } = reset ? defaultProps : rest;

  React.useEffect(() => {
    changeTitle(title || meta.title);
  }, [meta.title, title]);

  React.useEffect(() => {
    changeHtmlAttributes(htmlAttributes || defaultProps.htmlAttributes);
  }, [htmlAttributes]);

  React.useEffect(() => {
    changeBodyAttributes(bodyAttributes || defaultProps.bodyAttributes);
  }, [bodyAttributes]);

  return (
    <React.Fragment>
      <ScrollToTop />

      {withHeader && (
        <React.Fragment>
          <Header />
          <Notice />
        </React.Fragment>
      )}

      {children}
    </React.Fragment>
  );
};

export default AppFrame;
