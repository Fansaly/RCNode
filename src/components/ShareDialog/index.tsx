import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import copy from 'clipboard-copy';

const useStyles = makeStyles(() => ({
  paper: {
    margin: 10,
    width: 'calc(100% - 20px)',
    maxWidth: import.meta.env.DEV ? 540 : 615,
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

const ShareDialog = ({ open, url, post, onClose }: RCNode.Share) => {
  const classes = useStyles();

  const getLabel = () => {
    return post ? `分享链接 - #${post}：` : '分享链接：';
  };

  const handleCopy = async () => {
    try {
      if (url) {
        await copy(url);
      }
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog
      classes={{
        paper: classes.paper,
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogContent className={classes.content}>
        <TextField
          inputProps={{ readOnly: true }}
          variant="standard"
          label={`${getLabel()}`}
          value={url}
          fullWidth
        />
        <Button
          className={classes.button}
          variant="outlined"
          size="small"
          onClick={handleCopy}
        >
          复制
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
