import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import copy from 'clipboard-copy';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    '&:hover': {
      '& .box': {
        opacity: 1,
        transitionDuration: 240,
        pointerEvents: 'auto',
      },
    },
  },
  box: {
    position: 'absolute',
    top: -8,
    right: -8,
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 180ms cubic-bezier(0.4,0,0.2,1)',
  },
}));

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const CopyWrapper = ({ node, inline, className, children, ...props }: any) => {
  const classes = useStyles();
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleCopy = async (children: any) => {
    if (copied) {
      return;
    }

    try {
      const code = String(children.props.children).replace(/\s$/, '');
      if (code) {
        await copy(code);
        setCopied(true);
      }
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2.6 * 1e3);
    }
  };

  return inline ? (
    children
  ) : (
    <div className={classes.root}>
      <div className={clsx('box', classes.box)}>
        <Tooltip disableFocusListener placement="left" title={copied ? 'Copied' : 'Copy'}>
          <IconButton disableFocusRipple={true} onClick={() => handleCopy(children)}>
            {copied ? <AssignmentTurnedInIcon /> : <AssignmentIcon />}
          </IconButton>
        </Tooltip>
      </div>
      {children}
    </div>
  );
};

export default CopyWrapper;
