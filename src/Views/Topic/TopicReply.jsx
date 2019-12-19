import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams, Link } from 'react-router-dom';

import { post } from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ThumbUpIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpCancelIcon from '@material-ui/icons/ThumbUpAltOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReplyIcon from '@material-ui/icons/Reply';
import ShareIcon from '@material-ui/icons/Share';

import { MarkdownRender } from '../../Components/Markdown';
import Moment from '../../Components/Moment';
import { scroller } from 'react-scroll';

const useStyles = makeStyles(theme => ({
  icon: {
    minWidth: 'auto',
  },
}));

const TopicReply = (props) => {
  const { topicAuthor, width } = props;
  const { topic_id } = useParams();
  const { hash } = useLocation();
  const classes = useStyles();
  const isCancel = React.useRef();
  const anchorEl = React.useRef(null);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const [sharePrefixURL, setSharePrefixURL] = React.useState('');

  const {
    isAuthed,
    accesstoken,
    uname: signedUname,
  } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [upData, setUpData] = React.useState({
    ups: props.item.ups.length,
    isUped: props.item.is_uped,
  });

  const {
    author: {
      loginname: uname,
      avatar_url: avatar,
    },
    id,
    create_at: createAt,
    content,
  } = props.item;

  const handleUp = async () => {
    if (!isAuthed) {
      dispatch({ type: 'OPEN_NOTIFICATION', data: '登录后才能 👍 哟~' });
      return;
    }

    if (uname === signedUname) {
      dispatch({ type: 'OPEN_NOTIFICATION', data: '不能 👍 自己的哟~' });
      return;
    }

    isCancel.current = false;

    const params = {
      url: `/reply/${id}/ups`,
      params: { accesstoken },
    };

    const { success, err_msg } = await post(params);

    if (isCancel.current) {
      return;
    }

    if (success) {
      setUpData(prevState => {
        const { ups, isUped } = prevState;
        return {
          ups: isUped ? ups - 1 : ups + 1,
          isUped: !isUped,
        };
      });
    } else if (err_msg) {
      dispatch({
        type: 'OPEN_NOTIFICATION',
        data: {
          status: 'error',
          message: err_msg,
        },
      });
    }
  };

  const handleShare = () => {
    handleCloseMore();
    dispatch({
      type: 'OPEN_SHARE',
      data: `${sharePrefixURL}#${id}`,
    });
  };

  const handleCloseMore = () => {
    setMoreOpen(false);
  };

  const handleOpenMore = () => {
    setMoreOpen(true);
  };

  const handleReply = () => {
    handleCloseMore();

    const config = {
      action: 'reply',
      url: `/topic/${topic_id}/replies`,
      reply_id: id,
      content: `@${uname} `,
    };

    dispatch({ type: 'OPEN_EDITOR', data: config });
  };

  const timer = React.useRef();

  React.useEffect(() => {
    if (hash !== `#${id}`) {
      return;
    }

    clearTimeout(timer.current);

    const appHeaderHight = isWidthDown('xs', width) ? 56 : 64;
    const replieSpacings = 32;
    let threshold = 10;

    if (isWidthDown('xs', width)) {
      threshold += replieSpacings / 2;
    }

    timer.current = setTimeout(() => {
      scroller.scrollTo(hash, {
        duration: 500,
        smooth: 'easeInOutQuart',
        /**
         * appHeaderHight => app header height
         * replieSpacings => spacings between replies
         * threshold => the highlight reply top offset
         */
        offset: -(appHeaderHight + replieSpacings / 2 + threshold),
      });
    }, 0);

    return () => clearTimeout(timer.current);
  }, [hash, id, width]);

  React.useEffect(() => {
    const { origin, pathname } = window.location;
    setSharePrefixURL(`${origin}${pathname}`);

    return () => isCancel.current = true;
  }, []);

  return (
    <div id={`#${id}`} className={clsx('topic-reply', {
      'hilite': hash === `#${id}`,
      'owned': uname === topicAuthor,
    })}>
      <div className="reply-content">
        <Grid container wrap="nowrap" className={clsx('reply-header', classes.header)}>
          <Avatar aria-label="Recipe" className="reply-avatar">
            <Link to={uname ? `/user/${uname}` : '/'}>
              {avatar &&
                <img
                  src={avatar}
                  alt={uname || '用户已注销'}
                />
              }
            </Link>
          </Avatar>

          <Grid container item zeroMinWidth wrap="nowrap" className="reply-attrs">
            <Grid container wrap="nowrap" className="group">
              <Grid container item zeroMinWidth wrap="nowrap" className="uname-text">
                <Grid item zeroMinWidth>
                  <Link
                    className="uname"
                    to={uname ? `/user/${uname}` : '/'}
                  >
                    {uname ? uname : '用户已注销'}
                  </Link>
                </Grid>
                {uname === topicAuthor &&
                  <Grid item className="text">
                    [作者]
                  </Grid>
                }
              </Grid>
              <Grid item className="time">
                <Moment fromNow>{createAt}</Moment>
              </Grid>
            </Grid>
          </Grid>

          <Grid item className="reply-actions">
            <IconButton
              className="action up"
              onClick={handleUp}
            >
              {upData.isUped ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpCancelIcon />
              )}
            </IconButton>
            {Boolean(upData.ups) &&
              <span className="num">{upData.ups}</span>
            }
            <IconButton
              className="action more"
              buttonRef={node => {
                anchorEl.current = node;
              }}
              variant="contained"
              onClick={handleOpenMore}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={moreOpen}
              anchorEl={anchorEl.current}
              anchorReference="anchorEl"
              anchorPosition={{ top: 30, left: 30 }}
              onClose={handleCloseMore}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <List>
                <ListItem
                  className="action post"
                  onClick={handleShare}
                  button
                >
                  <ListItemIcon className={classes.icon}>
                    <ShareIcon />
                  </ListItemIcon>
                </ListItem>
                {isAuthed &&
                  <ListItem
                    className="action reply"
                    onClick={handleReply}
                    button
                  >
                    <ListItemIcon className={classes.icon}>
                      <ReplyIcon />
                    </ListItemIcon>
                  </ListItem>
                }
              </List>
            </Popover>
          </Grid>
        </Grid>

        <div className="markdown-container">
          <MarkdownRender markdownString={content} />
        </div>
      </div>
    </div>
  );
};

TopicReply.propTypes = {
  topicAuthor: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default withWidth()(TopicReply);
