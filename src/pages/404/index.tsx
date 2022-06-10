import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as MdOutletIcon } from '@/assets/ionicons_md_outlet.svg';
import { AppFrame } from '@/layout';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
  },
  main: {
    paddingTop: 120,
    paddingBottom: 30,
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
      marginBottom: 32,
    },
  },
}));

const NotFound = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <AppFrame withHeader={false}>
      <div className={clsx(classes.flex, classes.main, classes.center)}>
        <div className={clsx(classes.flex, classes.wrapper, classes.center)}>
          <h1 className={classes.h1}>404</h1>
          <p className={clsx(classes.flex, classes.p, classes.center)}>
            <MdOutletIcon className={classes.icon} />
            <span>Page not Found</span>
          </p>
        </div>
        <Button className={classes.button} variant="outlined" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </div>
    </AppFrame>
  );
};

export default NotFound;
