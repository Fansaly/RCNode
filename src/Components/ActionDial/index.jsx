import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { post } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
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
}));

const ActionDial = (props) => {
  const {
    width,
    single = false,
    topic = null,
  } = props;

  const {
    isAuthed,
    accesstoken,
    uname: signedUname,
  } = useSelector(({ auth }) => auth);

  const visible = useSelector(({ editor }) => !editor.open);
  const notificationIsOpen = useSelector(({ notification }) => notification.open);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { topic_id } = useParams();
  const isCancel = React.useRef(false);

  const [state, setState] = React.useState({
    favorite: undefined,
    expanded: false,
    shareURL: null,
  });

  const handleOpen = () => {
    if (!visible) {
      return;
    }

    setState(prevState => ({
      ...prevState,
      expanded: true,
    }));
  };

  const handleClose = () => {
    setState(prevState => ({
      ...prevState,
      expanded: false,
    }));
  };

  const handleClick = event => {
    const { expanded } = state;

    setState(prevState => ({
      ...prevState,
      expanded: !expanded,
    }));

    if (expanded && signedUname === topic.uname) {
      handleUpdate();
    }
  };

  const handleShare = event => {
    handleClose();
    dispatch({ type: 'OPEN_SHARE', data: state.shareURL });
  };

  const handleFavorite = async event => {
    const { favorite } = state;

    const params = {
      url: favorite
            ? '/topic_collect/de_collect'
            : '/topic_collect/collect',
      params: {
        accesstoken,
        topic_id: topic.topic_id,
      },
    };

    handleClose();

    const { success, err_msg } = await post(params);

    if (isCancel.current) {
      return;
    }

    const message = success
                    ? favorite ? '取消收藏' : '已收藏'
                    : {
                      message: err_msg || '操作失败',
                      status: 'error',
                    };

    success && setState(prevState => ({
      ...prevState,
      expanded: true,
      favorite: !favorite,
    }));

    dispatch({ type: 'OPEN_NOTIFICATION', data: message });
  };

  const handleReply = event => {

    const config = {
      action: 'reply',
      url: `/topic/${topic_id}/replies`,
      reply_id: topic_id,
      content: '',
    };

    handleClose();
    handleOpenEditor(config);
  };

  const handleUpdate = () => {
    const config = {
      action: 'update',
      url: '/topics/update',
      tab: topic.tab,
      title: topic.title,
      content: topic.content,
      topic_id: topic.topic_id,
    };

    handleOpenEditor(config);
  };

  const handleCreate = () => {
    const config = {
      action: 'create',
      url: '/topics',
    };

    handleOpenEditor(config);
  };

  const handleOpenEditor = config => {
    dispatch({ type: 'OPEN_EDITOR', data: config });
  };

  React.useEffect(() => {
    const { origin, pathname } = window.location;

    setState(prevState => ({
      ...prevState,
      shareURL: `${origin}${pathname}`,
    }));

    return () => isCancel.current = true;
  }, []);

  React.useEffect(() => {
    if (topic === null) {
      return;
    }

    setState(prevState => ({
      ...prevState,
      favorite: typeof prevState.favorite === 'boolean'
                ? prevState.favorite
                : Boolean(topic)
                  ? topic.is_collect
                  : undefined,
    }));
  }, [topic]);

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
              onClick={handleCreate}
            >
              <EditIcon />
            </Fab>
          </Zoom>
        ) : (Boolean(topic) &&
          <SpeedDial
            ariaLabel="SpeedDial"
            className={clsx(classes.action, {
              [classes.fabMoveUp]: !isWidthUp('md', width) && notificationIsOpen,
              [classes.fabMoveDown]: !isWidthUp('md', width) && !notificationIsOpen,
            })}
            color="secondary"
            hidden={!visible}
            open={state.expanded}
            onClick={handleClick}
            onClose={handleClose}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            icon={signedUname === topic.uname ? (
              <SpeedDialIcon openIcon={<EditIcon />} />
            ) : (
              <SpeedDialIcon />
            )}
          >
            <SpeedDialAction
              icon={<ReplyIcon />}
              tooltipTitle=""
              onClick={handleReply}
            />
            <SpeedDialAction
              icon={state.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              tooltipTitle=""
              onClick={handleFavorite}
            />
            <SpeedDialAction
              icon={<ShareIcon />}
              tooltipTitle=""
              onClick={handleShare}
            />
          </SpeedDial>
        )}
      </div>
    </AppBar>
  );
};

ActionDial.propTypes = {
  width: PropTypes.string.isRequired,
  single: PropTypes.bool,
  topic: PropTypes.any,
};

export default withWidth()(ActionDial);
