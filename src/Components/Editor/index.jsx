import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { topicTypes, matchTab } from '../../common';
import { post } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { MarkdownEditor } from '../../Components/Markdown';
import EditorHeader from './EditorHeader';
import Preview from './Preview';

const useStyles = makeStyles(theme => ({
  editor: {
    '& #editor .editor-header': {
      padding: '24px 0 14px 24px',
    },
  },
  title: {
    margin: 0,
    padding: '0 24px 18px',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  actions: {
    margin: 0,
    padding: '10px 24px',
  },
  button: {
    margin: 0,
    minWidth: 110,
  },
  doit: {
    marginLeft: 16,
  },
  cancel: {
    marginLeft: 0,
  },
}));

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = {
  /**
   * status
   * 1 idle
   * 2 working
   * 3 success
   * 4 error
   * -------------------------
   * set it but never used ^_^
   */
  status: 'idle',
  publishTab: null,
  title: '',
  content: '',
  /**
   * repo: https://github.com/cnodejs/nodeclub
   * file: api/v1/topic.js
   * line: 144
   */
  validation: {
    title: {
      max: 100,
      min: 5,
    },
    content: {
      max: null,
      min: 3,
    },
  },
  isOK: false,
  isDiff: false,
  preview: false,
  fullScreen: false,
  disabled: false,
};

const Editor = (props) => {
  const { width } = props;
  const { isAuthed, accesstoken } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const isCancel = React.useRef();
  const titleRef = React.useRef();
  const contentRef = React.useRef();

  const editor = useSelector(s => s.editor);
  const { open, action, url, topic_id, reply_id } = editor;

  const [eState, eDispatch] = React.useReducer((state, { type, data }) => {
    switch (type) {
      case 'INIT':
        return { ...state, ...data };
      case 'SET_PUBLISH_TAB':
        return { ...state, publishTab: data };
      case 'CHANGE':
        return { ...state, ...data };
      case 'IS_OK':
        return { ...state, isOK: data };
      case 'IS_DIFF':
        return { ...state, isDiff: data };
      case 'CLOSE_PREVIEW':
        return { ...state, preview: false };
      case 'OPEN_PREVIEW':
        return { ...state, preview: true };
      case 'TOGGLE_FULL_SCREEN':
        return { ...state, fullScreen: !state.fullScreen };
      case 'REQUEST':
        return {
          ...state,
          status: 'working',
          disabled: true,
        };
      case 'REQUEST_END':
        return {
          ...state,
          status: data,
          disabled: false,
        };
      default:
        return state;
    }
  }, initialState);

  const { publishTab, title, content, validation, isOK, preview, fullScreen, disabled } = eState;

  const closeEditor = React.useCallback((data = {}) => {
    dispatch({ type: 'CLOSE_EDITOR', data });
  }, [dispatch]);

  const handleClose = () => {
    !disabled && closeEditor();
  };

  const handlePublishTab = tab => {
    eDispatch({ type: 'SET_PUBLISH_TAB', data: tab });
  };

  const handleFocus = () => {
    if (['create', 'update'].includes(action)) {
      titleRef.current.focus();
    } else {
      contentRef.current.focus();
    }
  };

  const handleChange = name => event => {
    let value = event.target.value;

    if (name === 'title') {
      value = value.replace(/\n/g, '');
    }

    eDispatch({
      type: 'CHANGE',
      data: { [name]: value },
    });
  };

  const handleOpenPreview = () => {
    if (!Boolean(content) || content.trim().length < validation.content.min) {
      dispatch({
        type: 'OPEN_NOTIFICATION',
        data: {
          message: '太短了唷。',
          status: 'info',
        },
      });
    } else {
      eDispatch({ type: 'OPEN_PREVIEW' });
    }
  };

  const handleClosePreview = () => {
    eDispatch({ type: 'CLOSE_PREVIEW' });
  };

  const handleFullScreen = () => {
    eDispatch({ type: 'TOGGLE_FULL_SCREEN' });
  };

  const checkTab = () => {
    if (/(reply)/.test(action)) {
      return true;
    }

    const result = topicTypes.includes(publishTab);

    if (!result) {
      dispatch({
        type: 'OPEN_NOTIFICATION',
        data: {
          message: '请选择一个主题分类',
          status: 'error',
        },
      });
    }

    return result;
  };

  const handleSubmit = async () => {
    if (!isOK || !checkTab()) {
      return;
    }

    isCancel.current = false;
    eDispatch({ type: 'REQUEST' });

    const params = {
      accesstoken,
      tab: publishTab || undefined,
      title,
      content,
      reply_id,
      topic_id,
    };

    const { success, err_msg, data } = await post({ url, params });

    if (isCancel.current) {
      return;
    }

    eDispatch({
      type: 'REQUEST_END',
      data: success ? 'success' : 'error',
    });

    if (success) {
      closeEditor({
        action,
        request: { ...params },
        response: { ...data },
      });
    }

    const message = success
      ? action === 'create'
        ? '发布成功 ^_^'
        : action === 'update'
          ? '更新成功 ^_^'
          : action === 'reply'
            ? '回复成功 ^_^'
            : '无效操作'
      : {
        status: 'error',
        message: err_msg
          ? err_msg
          : action === 'create'
            ? '发布失败 :('
            : action === 'update'
              ? '更新失败 :('
              : action === 'reply'
                ? '回复失败 :('
                : '无效操作',
      };

    dispatch({ type: 'OPEN_NOTIFICATION', data: message });
  };

  React.useEffect(() => {
    let tab = matchTab(location);
    tab = topicTypes.includes(tab) ? tab : '';

    eDispatch({ type: 'SET_PUBLISH_TAB', data: tab });
  }, [location]);

  React.useEffect(() => {
    if (!editor.open) {
      return;
    }

    eDispatch({
      type: 'INIT',
      data: {
        ...(editor.tab ? { publishTab: editor.tab } : {}),
        title: editor.title || '',
        content: editor.content || '',
      },
    });
  }, [editor]);

  React.useEffect(() => {
    if (!editor.open) {
      return;
    }

    const checkTitle = () => {
      return (
        /(reply)/.test(editor.action)
          ? true
          : typeof title === 'string'
            ? title.length >= validation.title.min && title.length <= validation.title.max
            : false
      );
    };

    const checkContent = () => {
      return (
        typeof content === 'string'
          ? content.length >= validation.content.min
          : false
      );
    };

    const result = checkTitle() && checkContent();
    eDispatch({ type: 'IS_OK', data: result });

    const change = title !== editor.title || content !== editor.content;
    eDispatch({ type: 'IS_DIFF', data: change });
  }, [title, content, validation, editor]);

  React.useEffect(() => {
    return () => {
      if (open) {
        handleClosePreview();
        closeEditor();
      }
    };
  }, [open, location, closeEditor]);

  return (isAuthed &&
    <React.Fragment>
      <Dialog
        className={classes.editor}
        PaperProps={{id: 'editor'}}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        fullScreen={!isWidthUp('sm', width) || fullScreen}
        keepMounted={!isWidthUp('sm', width)}
        onEntered={handleFocus}
      >
        <EditorHeader
          publishTab={publishTab}
          onPublishTab={handlePublishTab}
          onPreview={handleOpenPreview}
          onFullScreen={handleFullScreen}
          fullScreen={fullScreen}
          disabled={disabled}
        />
        {['create', 'update'].includes(action) &&
          <TextField
            className={classes.title}
            margin="normal"
            multiline
            rows="1"
            rowsMax="3"
            fullWidth
            placeholder="标题..."
            inputRef={titleRef}
            value={title}
            disabled={disabled}
            onChange={handleChange('title')}
          />
        }
        <DialogContent className={clsx('flex', classes.content)}>
          <MarkdownEditor
            disabled={disabled}
            content={content}
            inputRef={contentRef}
            onUpdateContent={handleChange('content')}
          />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            className={clsx(classes.button, classes.cancel)}
            onClick={handleClose}
            disabled={disabled}
            color="default"
            size="large"
          >
            取消
          </Button>
          <Button
            className={clsx(classes.button, classes.doit)}
            variant="contained"
            onClick={handleSubmit}
            disabled={!isOK || disabled}
            color="primary"
            size="large"
          >
            {action === 'create' ? (
              '发布'
            ) : action === 'update' ? (
              '更新'
            ) : (
              '回复'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Preview
        open={preview}
        content={content}
        onClose={handleClosePreview}
      />
    </React.Fragment>
  );
};

Editor.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(Editor);
