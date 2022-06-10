import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';

import MarkdownRender from '@/components/Markdown';
import { useBreakpoints } from '@/hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 36,
  },
  title: {
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
    borderBottomColor:
      theme.palette.mode === 'light' ? 'rgba(0,0,0,.1)' : 'rgba(210,210,210,.1)',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
  },
  close: {
    position: 'absolute',
    top: 6,
    right: 20,
  },
  content: {
    paddingTop: '16px !important',
    paddingBottom: 16,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
  },
}));

interface Props {
  open?: boolean;
  content?: string;
  onClose: () => void;
}

const Preview = ({ open = false, content = '', onClose }: Props) => {
  const classes = useStyles();
  const isWidthDownSm = useBreakpoints('down', 'sm');

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      classes={{ paper: classes.root }}
      open={open}
      fullWidth
      maxWidth="md"
      fullScreen={isWidthDownSm}
      onClose={handleClose}
    >
      <DialogTitle className={classes.title}>
        预览
        <IconButton className={classes.close} size="large" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <MarkdownRender markdownSource={content} />
      </DialogContent>
    </Dialog>
  );
};

export default Preview;
