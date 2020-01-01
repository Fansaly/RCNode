import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useTheme, makeStyles } from '@material-ui/core/styles';
import CNodeLogo from '../../static/cnodejs/cnodejs.svg';

let pathsID = '& ';
pathsID += [
  '#cell-c',
  '#cell-n',
  '#cell-d',
  '#cell-e',
].join(',& ');

const useStyles = makeStyles({
  light: {
    [pathsID]: { fill: '#fff' },
  },
  lightVariant: {
    [pathsID]: { fill: '#ccc' },
  },
});

const Logo = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const { className, reverse, color } = props;

  const isLight =
    Boolean(color)
    ? color === 'light'
    : Boolean(reverse)
      ? theme.palette.type !== 'light'
      : theme.palette.type === 'light';

  const style = isLight && (
    theme.palette.type === 'light'
    ? classes.light
    : classes.lightVariant
  );

  return <CNodeLogo className={clsx(style, className)} />;
};

Logo.propTypes = {
  className: PropTypes.string,
  reverse: PropTypes.bool,
  color: PropTypes.oneOf(['light', 'dark']),
};

export default Logo;
