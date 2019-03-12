import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  openShare,
  openEditor,
  openNotification,
} from '../../store/actions';
import { post } from '../../fetch';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import AppBar from '@material-ui/core/AppBar';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReplyIcon from '@material-ui/icons/ModeComment';
import ShareIcon from '@material-ui/icons/Share';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

const styles = theme => ({
  appbar: {
    top: 'auto',
    bottom: 0,
    boxShadow: 'none',
  },
  wrapper: {
    position: 'relative',
  },
  action: {
    position: 'absolute',
    right: theme.spacing(3.5),
    bottom: theme.spacing(4),
  },
  fabMoveUp: {
    transform: 'translate3d(0, -56px, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  },
  fabMoveDown: {
    transform: 'translate3d(0, 0, 0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
  },
});

class ActionDial extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorite: undefined,
      expanded: false,
      shareURL: null,
    };
  }

  handleOpen = () => {
    if (this.props.visible) {
      this.setState({ expanded: true });
    }
  };

  handleClose = () => {
    this.setState({ expanded: false });
  };

  handleClick = () => {
    const { expanded } = this.state;
    expanded && this.handleUpdate();
    this.setState({
      expanded: !expanded,
    });
  };

  handleShare = () => {
    const { shareURL } = this.state;
    this.handleClose();
    this.props.openShare(shareURL);
  };

  handleFavorite = async () => {
    const { favorite } = this.state;

    const {
      accesstoken,
      topicData: { topic_id },
    } = this.props;

    const params = {
      url: favorite
            ? '/topic_collect/de_collect'
            : '/topic_collect/collect',
      params: { accesstoken, topic_id },
    };

    this.handleClose();

    const { success, err_msg } = await post(params);
    const message = success
                    ? favorite ? '取消收藏' : '已收藏'
                    : {
                      message: err_msg || '操作失败',
                      status: 'error',
                    };

    success && this.setState({
      favorite: !favorite,
    });

    this.props.openNotification(message);
  };

  handleReply = () => {
    const { topic_id } = this.props.match.params;
    const config = {
      action: 'reply',
      url: `/topic/${topic_id}/replies`,
      reply_id: topic_id,
    };

    this.handleClose();
    this.handleOpenEditor(config);
  };

  handleUpdate = () => {
    const {
      uname,
      tab,
      title,
      content,
      topic_id,
    } = this.props.topicData;
    const { uname: signedUname } = this.props;

    if (uname !== signedUname) { return; }

    const config = {
      action: 'update',
      url: '/topics/update',
      tab,
      title,
      content,
      topic_id,
    };

    this.handleOpenEditor(config);
  };

  handleCreate = () => {
    const config = {
      action: 'create',
      url: '/topics',
    };

    this.handleOpenEditor(config);
  };

  handleOpenEditor = config => {
    this.props.openEditor(config);
  };

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const { origin, pathname } = window.location;

      this.setState({
        shareURL: `${origin}${pathname}`,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { topicData } = nextProps;
    const { favorite } = this.state;

    this.setState(state => ({
      favorite: typeof favorite === 'boolean'
                ? state.favorite
                : topicData
                  ? topicData.is_collect
                  : undefined,
    }));
  }

  render() {
    const {
      classes,
      width,
      isAuthed,
      single,
      visible,
      topicData,
      notificationOpen,
      uname: signedUname,
    } = this.props;

    const {
      favorite,
      expanded,
    } = this.state;

    return (isAuthed &&
      <AppBar
        color="default"
        component="div"
        className={classes.appbar}
      >
        <div className={classes.wrapper}>
          {single ? (
            <Zoom in={visible} unmountOnExit>
              <Fab
                color="secondary"
                aria-label="Edit"
                className={classes.action}
                onClick={this.handleCreate}
              >
                <EditIcon />
              </Fab>
            </Zoom>
          ) : (typeof topicData === 'object' &&
            <SpeedDial
              ariaLabel="SpeedDial"
              className={classNames(classes.action, {
                [classes.fabMoveUp]: !isWidthUp('md', width) && notificationOpen,
                [classes.fabMoveDown]: !isWidthUp('md', width) && !notificationOpen,
              })}
              color="secondary"
              hidden={!visible}
              open={expanded}
              onClick={this.handleClick}
              onClose={this.handleClose}
              onMouseEnter={this.handleOpen}
              onMouseLeave={this.handleClose}
              icon={signedUname === topicData.uname ? (
                <SpeedDialIcon openIcon={<EditIcon />} />
              ) : (
                <SpeedDialIcon />
              )}
            >
              <SpeedDialAction
                icon={<ReplyIcon />}
                tooltipTitle=""
                onClick={this.handleReply}
              />
              <SpeedDialAction
                icon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                tooltipTitle=""
                onClick={this.handleFavorite}
              />
              <SpeedDialAction
                icon={<ShareIcon />}
                tooltipTitle=""
                onClick={this.handleShare}
              />
            </SpeedDial>
          )}
        </div>
      </AppBar>
    );
  }
}

ActionDial.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth, editor, notification }) => ({
  ...auth,
  visible: !editor.open,
  notificationOpen: notification.open,
});

const mapDispatchToProps = dispatch => ({
  openShare: url => {
    dispatch(openShare(url));
  },
  openEditor: config => {
    dispatch(openEditor(config));
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
)(ActionDial);
