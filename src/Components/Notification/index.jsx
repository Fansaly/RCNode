import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: '#43a047',
  },
  error: {
    backgroundColor: '#d32f2f',
  },
  info: {
    backgroundColor: '#1976d2',
  },
  warning: {
    backgroundColor: '#ffa000',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const Notification = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    open,
    message,
    status,
  } = useSelector(({ notification }) => {
    const statusType = ['success', 'warning', 'error', 'info'];

    if (!statusType.includes(notification.status)) {
      notification.status = 'info';
    }

    return notification;
  });

  const handleClose = React.useCallback(() => {
    dispatch({ type: 'CLOSE_NOTIFICATION' });
  }, [dispatch]);

  const handleExit = React.useCallback(() => {
    open && handleClose();
  }, [open, handleClose]);

  React.useEffect(() => {
    return () => handleExit();
  }, [handleExit]);

  const Icon = variantIcon[status];
  const key = new Date().getTime();

  return (
    <Snackbar
      key={key}
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={classes[status]}
        aria-describedby="snackbar-message-id"
        message={
          <span id="snackbar-message-id" className={classes.message}>
            <Icon className={`${classes.icon} ${classes.iconVariant}`} />
            {message}
          </span>
        }
        action={
          <IconButton
            color="inherit"
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default Notification;
