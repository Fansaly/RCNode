import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';

import { ReactComponent as CNodeLogo } from '@/assets/cnodejs/cnodejs.svg';

let pathsID = '& ';
pathsID += ['#cell-c', '#cell-n', '#cell-d', '#cell-e'].join(',& ');

const useStyles = makeStyles({
  light: {
    [pathsID]: { fill: '#fff' },
  },
  lightVariant: {
    [pathsID]: { fill: '#ccc' },
  },
});

interface Props {
  className?: string;
  reverse?: boolean;
  color?: 'light' | 'dark';
}

const Logo = ({ className, reverse, color }: Props) => {
  const theme = useTheme();
  const classes = useStyles();

  const isLight = color
    ? color === 'light'
    : reverse
    ? theme.palette.mode !== 'light'
    : theme.palette.mode === 'light';

  const style =
    isLight && (theme.palette.mode === 'light' ? classes.light : classes.lightVariant);

  return <CNodeLogo className={clsx(style, className)} />;
};

export default Logo;
