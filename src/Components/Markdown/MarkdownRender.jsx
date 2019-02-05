import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { openZoom } from '../../store/actions';

import 'github-markdown-css/github-markdown.css';
import mdRender from './markdown-it';
import './markdown-render.styl';

class MarkdownRender extends React.Component {
  handleClick = event => {
    const src = event.target.getAttribute('src');
    this.props.openZoom({ src });
  };

  componentDidMount() {
    const imgs = Array.from(this.md.querySelectorAll('img'));
    imgs.map(img => img.addEventListener('click', this.handleClick));
  }

  render() {
    const { markdownString } = this.props;
    const markupHTML = {
      __html: mdRender.render(markdownString),
    };

    return (
      <div
        ref={ref => this.md = ref}
        className="markdown-body"
        // eslint-disable-next-line
        dangerouslySetInnerHTML={markupHTML}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  openZoom: data => {
    dispatch(openZoom(data));
  },
});

export default compose(
  withRouter,
  connect(
    null,
    mapDispatchToProps,
  ),
)(MarkdownRender);
