import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { AppWrapper } from '../../Layout';
import MdOutletIcon from '../../static/ionicons_md_outlet.svg';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 120,
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: 0,
      overflow: 'hidden',
    },
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    marginBottom: 40,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      marginBottom: 62,
      marginTop: -32,
    },
  },
  h1: {
    marginRight: 45,
    paddingRight: 45,
    fontSize: 80,
    borderRight: '3px solid #7b7b7b',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: 32,
      paddingRight: 0,
      border: 'none',
    },
  },
  p: {
    fontSize: 20,
    textAlign: 'left',
    flexDirection: 'column',
  },
  icon: {
    width: '1em',
    height: '1em',
    fontSize: 60,
    fill: theme.palette.text.primary,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 32,
    },
  },
}));

const NotFound = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackToHome = () => {
    history.push('/');
  };

  return (
    <AppWrapper title="404" withHeader={false}>
      <div className={clsx(
        'flex',
        classes.main,
        classes.center,
      )}>
        <div className={clsx(
          'flex',
          classes.wrapper,
          classes.center,
        )}>
          <h1 className={classes.h1}>404</h1>
          <p className={clsx(
            'flex',
            classes.p,
            classes.center,
          )}>
            <MdOutletIcon className={classes.icon} />
            <span>Page not Found</span>
          </p>
        </div>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={handleBackToHome}
        >
          Back to Home
        </Button>
      </div>
    </AppWrapper>
  );
};

export default NotFound;
