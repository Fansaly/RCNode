import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  closeEditor,
  openNotification,
} from '../../store/actions';
import { topicTypes, matchTab } from '../../common';
import { post } from '../../fetch';

import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
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
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /**
       * status
       * 1 idle
       * 2 working
       * 3 success
       * 4 error
       */
      status: 'idle',
      changed: false,
      disabled: false,
      fullScreen: false,
      publishTab: null,
      preview: false,
      tab: null,
      isOK: false,
      title: '',
      content: '',
    };
  }

  handlePublishTab = publishTab => {
    this.setState({ publishTab });
  };

  handleOpenPreview = () => {
    const { content } = this.state;

    if (!Boolean(content) || content.trim().length <= 3) {
      this.props.openNotification({
        message: '太短了唷。',
        status: 'info',
      });
    } else {
      this.setState({
        preview: true,
      });
    }
  };

  handleClosePreview = () => {
    this.setState({
      preview: false,
    });
  };

  handleFullScreen = () => {
    this.setState(state => ({
      fullScreen: !state.fullScreen,
    }));
  };

  handleChange = name => event => {
    let value = event.target.value;

    if (name === 'title') {
      value = value.replace(/\n/g, '');
    }

    this.setState({
      [name]: value,
      changed: true,
    }, () => {
      this.check();
    });
  };

  checkTab = () => {
    const { publishTab } = this.state;
    const { action } = this.props;

    if (/(reply)/.test(action)) {
      return true;
    }

    const result = topicTypes.includes(publishTab);

    if (!result) {
      this.props.openNotification({
        message: '请选择一个主题分类',
        status: 'error',
      });
    }

    return result;
  };

  checkTitle = () => {
    const { title } = this.state;
    const { action } = this.props;

    return (
      /(reply)/.test(action)
        ? true
        : typeof title === 'string'
          ? title.length >= 5
          : false
    );
  };

  checkContent = () => {
    const { content } = this.state;
    return (
      typeof content === 'string'
        ? content.length >= 3
        : false
    );
  };

  check = () => {
    const isOK = this.checkTitle() && this.checkContent();

    this.setState({ isOK });

    return isOK;
  };

  handleSubmit = () => {
    const { isOK } = this.state;

    if (!isOK || !this.checkTab()) {
      return;
    }

    const {
      action,
      url,
      reply_id,
      topic_id,
      accesstoken,
    } = this.props;

    const {
      title,
      publishTab: tab,
      content,
    } = this.state;

    const params = {
      accesstoken,
      tab: tab || undefined,
      title,
      content,
      reply_id,
      topic_id,
    };

    this.setState({
      status: 'working',
      disabled: true,
    }, async () => {
      const { success, err_msg, data } = await post({ url, params });

      this.setState({
        status: success ? 'success' : 'error',
        disabled: false,
      }, () => {
        success && this.handleClose({
          action,
          request: { ...params },
          response: { ...data },
        });
      });

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

      this.props.openNotification(message);
    });
  };

  handlePreClose = () => {
    const { open } = this.props;
    open && this.handleClose();
  };

  handleClose = (result = {}) => {
    const { disabled } = this.state;
    const { response } = result;

    this.handleClosePreview();
    !disabled && this.props.closeEditor(response ? result : {});
  };

  componentWillMount() {
    const tab = matchTab(this.props.location);

    this.setState({
      tab,
    }, () => {
      this.check();
    });
  }

  componentWillUnmount() {
    this.handlePreClose();
  }

  componentWillReceiveProps(nextProps) {
    const {
      pathname: nextPathname,
      search: nextSearch,
    } = nextProps.location;

    const {
      pathname: prevPathname,
      search: prevSearch,
    } = this.props.location;

    const { title, content } = nextProps;

    if (`${nextPathname}${nextSearch}` === `${prevPathname}${prevSearch}`) {
      this.setState({
        title,
        content,
      }, () => {
        this.check();
      });
    } else {
      this.handlePreClose();
    }
  }

  render() {
    const {
      classes,
      width,
      open,
      action,
      isAuthed,
    } = this.props;

    const {
      disabled,
      preview,
      fullScreen,
      isOK,
      title,
      content,
     } = this.state;

    return (isAuthed &&
      <React.Fragment>
        <Dialog
          className={classes.editor}
          PaperProps={{id: 'editor'}}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}
          maxWidth="sm"
          fullWidth
          fullScreen={!isWidthUp('sm', width) || fullScreen}
          keepMounted={!isWidthUp('sm', width)}
        >
          <EditorHeader
            disabled={disabled}
            onPublishTab={this.handlePublishTab}
            onPreview={this.handleOpenPreview}
            fullScreen={fullScreen}
            onFullScreen={this.handleFullScreen}
          />
          {['create', 'update'].includes(action) &&
            <TextField
              className={classes.title}
              margin="normal"
              multiline
              rows="1"
              rowsMax="3"
              autoFocus
              fullWidth
              placeholder="标题..."
              value={title}
              disabled={disabled}
              onChange={this.handleChange('title')}
            />
          }
          <DialogContent className={classNames('flex', classes.content)}>
            <MarkdownEditor
              disabled={disabled}
              content={content}
              autoFocus={['reply'].includes(action)}
              onUpdateContent={this.handleChange('content')}
            />
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button
              className={classNames(classes.button, classes.cancel)}
              onClick={this.handleClose}
              disabled={disabled}
              color="default"
              size="large"
            >
              取消
            </Button>
            <Button
              className={classNames(classes.button, classes.doit)}
              variant="contained"
              onClick={this.handleSubmit}
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
          onClose={this.handleClosePreview}
        />
      </React.Fragment>
    );
  }
}

Editor.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  action: PropTypes.oneOf(['create', 'update', 'reply']),
};

const mapStateToProps = ({ auth, editor }) => ({
  ...auth,
  ...editor,
});

const mapDispatchToProps = dispatch => ({
  closeEditor: data => {
    dispatch(closeEditor(data));
  },
  openNotification: message => {
    dispatch(openNotification(message));
  },
});

export default compose(
  withStyles(styles),
  withWidth(),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Editor);
