import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  flex: {
    margin: 0,
    '& *': {
      flex: '1 1 auto',
      minHeight: 210,
      padding: 0,
    },
    '& textarea': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      lineHeight: 1.3125,
    },
  },
});

class MarkdownEditor extends React.Component {
  handleUpdateContent = event => {
    this.props.onUpdateContent(event);
  };

  render() {
    const {
      classes,
      disabled,
      autoFocus,
      content,
    } = this.props;

    return (
      <React.Fragment>
        <TextField
          className={classNames(classes.flex)}
          margin="normal"
          multiline
          rows="3"
          autoFocus={autoFocus}
          fullWidth
          id="textarea"
          placeholder="写些什么呢？"
          value={content}
          disabled={disabled}
          onChange={this.handleUpdateContent}
        />
      </React.Fragment>
    );
  }
}

MarkdownEditor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MarkdownEditor);
