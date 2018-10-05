import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { closeShare } from '../../store/actions';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import copy from 'clipboard-copy';

const styles = theme => ({
  dialog: {
    '& > div[role="document"]': {
      width: '80%',
      maxWidth: process.env.NODE_ENV === 'production' ? 615 : 540,
    },
  },
  content: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
  },
  button: {
    marginLeft: 16,
    padding: '4px 10px',
  },
});

class ShareDialog extends React.Component {
  handleClose = () => {
    this.props.closeShare();
  };

  handleCopy = async () => {
    try {
      await copy(this.props.url);
    } finally {
      this.handleClose();
    }
  };

  getLabel = () => {
    let { post } = this.props;

    post = Boolean(post)
            ? ` - #${post}`
            : '';

    return `分享链接${post}：`;
  };

  render() {
    const { classes, url, open } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        className={classes.dialog}
      >
        <DialogContent className={classes.content}>
          <TextField
            inputProps={{ readOnly: true }}
            label={`${this.getLabel()}`}
            value={url}
            fullWidth
          />
          <Button
            className={classes.button}
            onClick={this.handleCopy}
            variant="outlined"
            size="small"
            autoFocus
          >
            复制
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

ShareDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateTopProps = ({ share }) => ({
  ...share,
});

const mapDispatchTopProps = dispatch => ({
  closeShare: () => {
    dispatch(closeShare());
  },
});

export default compose(
  withStyles(styles),
  connect(
    mapStateTopProps,
    mapDispatchTopProps,
  ),
)(ShareDialog);
