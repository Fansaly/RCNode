import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import copy from 'clipboard-copy';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: 10,
    width: 'calc(100% - 20px)',
    maxWidth: process.env.NODE_ENV === 'production' ? 615 : 540,
  },
  content: {
    padding: 24,
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
  },
  button: {
    marginLeft: 16,
    padding: '4px 10px',
  },
}));

const ShareDialog = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let { url, open, post } = useSelector(state => state.share);

  const handleCopy = async () => {
    try {
      await copy(url);
    } finally {
      handleClose();
    }
  };

  const getLabel = () => {
    post = Boolean(post)
            ? ` - #${post}`
            : '';

    return `分享链接${post}：`;
  };

  const handleClose = React.useCallback(() => {
    dispatch({ type: 'CLOSE_SHARE' });
  }, [dispatch]);

  const handleExit = React.useCallback(() => {
    open && handleClose();
  }, [open, handleClose]);

  React.useEffect(() => {
    return () => handleExit();
  }, [handleExit]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{
        paper: classes.paper,
      }}
    >
      <DialogContent className={classes.content}>
        <TextField
          inputProps={{ readOnly: true }}
          label={`${getLabel()}`}
          value={url}
          fullWidth
        />
        <Button
          className={classes.button}
          onClick={handleCopy}
          variant="outlined"
          size="small"
          autoFocus
        >
          复制
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
