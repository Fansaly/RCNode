import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import 'github-markdown-css/github-markdown.css';
import mdRender from './markdown-it';
import './markdown-render.styl';

const useStyles = makeStyles(theme => ({
  root: theme.palette.type === 'light' ? {
    color: '#24292e',
    '& code': { backgroundColor: 'rgba(27,31,35,.05)' },
    '& pre, & .highlight pre': { backgroundColor: '#f6f8fa' },
    '& blockquote': { borderLeftColor: '#dfe2e5' },
    '& h1, & h2': { borderBottomColor: '#eaecef' },
    '& img': { backgroundColor: '#fff' },
    '& a': { color: '#0366d6' },
    '& hr': {
      backgroundColor: '#e1e4e8',
      borderBottomColor: '#eee',
    },
    '& table': {
      '& th, & td': {
        borderColor: '#dfe2e5',
      },
      '& tr': {
        backgroundColor: '#fff',
        borderTopColor: '#c6cbd1',
        '&:nth-child(2n)': {
          backgroundColor: '#f6f8fa',
        },
      },
    },
  } : {
    color: theme.palette.text.primary,
    '& code': { backgroundColor: 'rgba(200,200,200,.05)' },
    '& pre, & .highlight pre': { backgroundColor: '#333' },
    '& blockquote': { borderLeftColor: '#5a5a5a' },
    '& h1, & h2': { borderBottomColor: '#5d5d5d' },
    '& img': { backgroundColor: 'transparent' },
    '& a': { color: '#1858a0' },
    '& hr': {
      backgroundColor: '#777',
      borderBottomColor: '#7c7c7c',
    },
    '& table': {
      '& th, & td': {
        borderColor: '#3a3b3c',
      },
      '& tr': {
        backgroundColor: 'transparent',
        borderTopColor: '#2d2e2f',
        '&:nth-child(2n)': {
          backgroundColor: '#2a2b2c',
        },
      },
    },
  },
}));

const MarkdownRender = (props) => {
  const { className, markdownString } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const mdRef = React.useRef();

  React.useEffect(() => {
    const handleClick = event => {
      const src = event.target.getAttribute('src');
      dispatch({ type: 'OPEN_ZOOM', data: { src } });
    };

    const imgs = Array.from(mdRef.current.querySelectorAll('img'));
    imgs.map(img => img.addEventListener('click', handleClick));
  }, [dispatch]);

  return (
    <div
      ref={mdRef}
      className={clsx('markdown-body', className, classes.root)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: mdRender.render(markdownString),
      }}
    />
  );
};

MarkdownRender.propTypes = {
  className: PropTypes.string,
  markdownString: PropTypes.string.isRequired,
};

export default MarkdownRender;
