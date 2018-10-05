import React from 'react';
import { withRouter } from 'react-router-dom';
import { at } from '../../common';

import mdRender from './markdown-it';
import 'github-markdown-css/github-markdown.css';
import './markdown-render.styl';

class MarkdownRender extends React.Component {
  render() {
    let { markdownString } = this.props;

    markdownString = at(markdownString);

    const markupHTML = {
      __html: mdRender.render(markdownString),
    };

    return (
      <div
        className="markdown-body"
        // eslint-disable-next-line
        dangerouslySetInnerHTML={markupHTML}
      />
    );
  }
}

export default withRouter(MarkdownRender);
