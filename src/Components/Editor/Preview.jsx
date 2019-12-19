import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { MarkdownRender } from '../../Components/Markdown';

const useStyles = makeStyles(theme => ({
  title: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
    '& h2': {
      position: 'relative',
      padding: '15px 0',
      fontSize: '1.25rem',
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.type === 'light' ? 'rgba(0,0,0,.08)' : 'rgba(210,210,210,.08)',
    },
  },
  close: {
    position: 'absolute',
    top: '50%',
    right: -10,
    transform: 'translateY(-50%)',
  },
  content: {
    paddingBottom: 36,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
  },
}));

const Preview = (props) => {
  const handleClose = () => {
    props.onClose();
  };

  const { width, open, content } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      fullScreen={isWidthDown('xs', width)}
      onClose={handleClose}
    >
      <DialogTitle className={classes.title} disableTypography>
        <Typography component="h2">
          预览
          <IconButton
            className={classes.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent className={classes.content}>
        <MarkdownRender markdownString={content} />
      </DialogContent>
    </Dialog>
  );
};

Preview.propTypes = {
  width: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
};

export default withWidth()(Preview);
