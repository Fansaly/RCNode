import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
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
}));

const MarkdownEditor = ({ inputRef, ...props }) => {
  const classes = useStyles();
  const {
    content,
    disabled,
    onUpdateContent: updateContent,
  } = props;

  const handleUpdateContent = event => {
    updateContent(event);
  };

  return (
    <React.Fragment>
      <TextField
        className={classes.flex}
        margin="normal"
        multiline
        rows="3"
        fullWidth
        id="textarea"
        placeholder="写些什么呢？"
        inputRef={inputRef}
        value={content}
        disabled={disabled}
        onChange={handleUpdateContent}
      />
    </React.Fragment>
  );
};

MarkdownEditor.propTypes = {
  content: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onUpdateContent: PropTypes.func.isRequired,
};

export default MarkdownEditor;
