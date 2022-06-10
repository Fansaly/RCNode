import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import MarkdownRender from '@/components/Markdown';

import _c_0 from './_@_mail_@_user.md?raw';
import _s_3 from './_@_single.md?raw';
import _s_2 from './_@_single_next_space.md?raw';
import _s_1 from './_@_single_prev_space.md?raw';
import _z_0 from './_ctx.md?raw';
import _h_0 from './_html.md?raw';
import _a_0 from './_syntax.md?raw';
import _d_0 from './_url.md?raw';

const content = [
  { text: _a_0, file: '_syntax.md' },
  { text: _c_0, file: '_@_mail_@_user.md' },
  { text: _d_0, file: '_url.md' },
  { text: _h_0, file: '_html.md' },
  { text: _s_1, file: '_@_single_prev_space.md' },
  { text: _s_2, file: '_@_single_next_space.md' },
  { text: _s_3, file: '_@_single.md' },
  { text: _z_0, file: '_ctx.md' },
];

const useStyles = makeStyles((theme) => ({
  label: {
    marginBottom: 18,
  },
  md: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : 'rgba(0,0,0,.032)',
    borderRadius: 2,
    boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.15)',
  },
}));

const Markdown = () => {
  const classes = useStyles();

  return (
    <div className="md-content">
      {content.map(({ file, text }) => (
        <React.Fragment key={file}>
          <div className={classes.label}>FILE: {file}</div>
          <div className={classes.md}>
            <MarkdownRender markdownSource={text} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Markdown;
