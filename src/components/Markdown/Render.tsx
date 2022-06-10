import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import githubMarkdownDark from 'github-markdown-css/github-markdown-dark.css';
import githubMarkdownLight from 'github-markdown-css/github-markdown-light.css';
import React from 'react';

import ImageZoom from '@/components/ImageZoom';

import Remark from './Remark';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.markdown-body': {
      backgroundColor: 'transparent',
      width: '100%',
      '& p': {
        whiteSpace: 'pre-wrap',
      },
      '& hr': {
        height: 2,
      },
      '& img': {
        cursor: 'pointer',
      },
      '& video': {
        maxWidth: '100%',
      },
      '& pre[class*="language-"], & div[class*="language-"]': {
        margin: '0 !important',
        padding: '0 !important',
        backgroundColor: 'transparent !important',
      },
      '& pre code': {
        backgroundColor: 'transparent',
      },
    },
  },
  theme: {
    '&.markdown-body':
      theme.palette.mode === 'light'
        ? {
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
          }
        : {
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
  },
}));

interface Props {
  className?: string;
  markdownSource: string;
}

const Render = ({ className, markdownSource }: Props) => {
  const theme = useTheme();
  const classes = useStyles();

  const mdRef = React.useRef<null | HTMLDivElement>(null);
  const [preview, setPreview] = React.useState({ open: false, url: '' });

  const handleClose = () => {
    setPreview((prevState) => ({ ...prevState, open: false }));
  };

  React.useEffect(() => {
    const styleElement = document.querySelector('#github-markdown');
    const styleContent =
      theme.palette.mode === 'light' ? githubMarkdownLight : githubMarkdownDark;
    if (styleElement) {
      styleElement.textContent = styleContent;
    }
  }, [theme.palette.mode]);

  React.useEffect(() => {
    if (!mdRef.current) {
      return;
    }

    const preview = (event: Event) => {
      const target = event.target as HTMLImageElement;

      if (target) {
        const url = target.getAttribute('src') || '';
        setPreview((prevState) => ({ ...prevState, open: true, url }));
      }
    };

    const imgs: HTMLImageElement[] = Array.from(mdRef.current.querySelectorAll('img'));
    imgs.forEach((img) => img.addEventListener('click', preview, false));

    return () => {
      imgs.forEach((img) => img.removeEventListener('click', preview, false));
    };
  }, []);

  return (
    <div
      ref={mdRef}
      className={clsx('markdown-body', classes.root, classes.theme, className)}
    >
      <Remark markdownSource={markdownSource} />
      <ImageZoom {...preview} onClose={handleClose} />
    </div>
  );
};

export default Render;
