import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { MarkdownRender } from '../../Components/Markdown';

const styles = theme => ({
  title: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 36,
      paddingRight: 36,
    },
    '& h6': {
      position: 'relative',
      padding: '15px 0',
      borderBottom: '1px dashed rgba(0, 0, 0, 0.08)',
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
});

class Preview extends React.Component {
  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const {
      classes,
      width,
      open,
      content,
    } = this.props;

    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="md"
        fullScreen={isWidthDown('xs', width)}
        onClose={this.handleClose}
      >
        <DialogTitle className={classes.title}>
          预览
          <IconButton
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          <MarkdownRender markdownString={content} />
        </DialogContent>
      </Dialog>
    );
  }
}

Preview.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default compose(
  withStyles(styles),
  withWidth(),
)(Preview);
