import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { AppWrapper } from '../../Layout';
import { MarkdownRender } from '../../Components/Markdown';
import ImageZoom from '../../Components/ImageZoom';
import ShareDialog from '../../Components/ShareDialog';

import f1_0 from './_@_single.md';
import f1_1 from './_@_single_prev_space.md';
import f1_2 from './_@_single_next_space.md';
import f2_0 from './_@_mail.md';
import f3_0 from './_url.md';
import f4 from './_ctx.md';

const mdContent = [
  {
    file: '_@_single.md',
    text: f1_0,
  },
  {
    file: '_@_single_prev_space.md',
    text: f1_1,
  },
  {
    file: '_@_single_next_space.md',
    text: f1_2,
  },
  {
    file: '_@_mail.md',
    text: f2_0,
  },
  {
    file: '_url.md',
    text: f3_0,
  },
  {
    file: '_ctx.md',
    text: f4,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 50,
  },
  label: {
    marginBottom: 18,
  },
  md: {
    marginBottom: 40,
    padding: 20,
    backgroundColor: theme.palette.type === 'light' ? '#fff' : 'rgba(0,0,0,.032)',
    borderRadius: 2,
    boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.15)',
  },
}));

const Test = () => {
  const classes = useStyles();

  return (
    <AppWrapper title="TEST">
      <div className={`wrapper ${classes.root}`}>
        {mdContent.map(({file, text}) => (
          <React.Fragment key={file}>
            <div className={classes.label}>
              FILE: {file}
            </div>
            <div className={classes.md}>
              <MarkdownRender markdownString={text} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <ImageZoom />
      <ShareDialog />
    </AppWrapper>
  );
};

export default Test;
