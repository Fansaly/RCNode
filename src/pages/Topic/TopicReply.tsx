import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpCancelIcon from '@mui/icons-material/ThumbUpAltOutlined';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Popover from '@mui/material/Popover';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

import { upTopic } from '@/api';
import MarkdownRender from '@/components/Markdown';
import Notification from '@/components/Notification';
import ShareDialog from '@/components/ShareDialog';
import { useBreakpoints } from '@/hooks';
import { useSelector } from '@/store';
import { dayjs } from '@/utils';

const useStyles = makeStyles(() => ({
  icon: {
    minWidth: 'auto',
  },
}));

interface Props {
  post: number;
  item: any;
  topicAuthor: string;
  onReply?(event?: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const TopicReply = ({ post, item, topicAuthor, onReply }: Props) => {
  const classes = useStyles();
  const { hash } = useLocation();
  const isWidthDownSm = useBreakpoints('down', 'sm');
  const {
    isAuthed,
    accesstoken,
    uname: signedUname,
  } = useSelector((state) => state.auth);

  const [upData, setUpData] = React.useState({
    ups: item.ups.length,
    isUped: item.is_uped,
  });

  const {
    author: { loginname: uname, avatar_url: avatar },
    id,
    create_at: createAt,
    content,
  } = item;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sharePrefixURL, setSharePrefixURL] = React.useState('');
  const isCancel = React.useRef<boolean>(false);

  const [share, setShare] = React.useState<RCNode.Share>({ open: false, url: '' });
  const [notification, setNotification] = React.useState<RCNode.Notification>({
    open: false,
    status: 'success',
    message: '',
  });

  const handleUp = async () => {
    if (!isAuthed) {
      setNotification((prevState) => ({
        ...prevState,
        open: true,
        status: 'success',
        message: '登录后才能 👍 哟~',
      }));
      return;
    }

    if (uname === signedUname) {
      setNotification((prevState) => ({
        ...prevState,
        open: true,
        status: 'success',
        message: '不能 👍 自己的哟~',
      }));
      return;
    }

    isCancel.current = false;

    const { success, err_msg } = await upTopic({
      reply_id: id,
      accesstoken,
    });

    if (isCancel.current) {
      return;
    }

    if (success) {
      setUpData((prevState) => {
        const { ups, isUped } = prevState;
        return {
          ups: isUped ? ups - 1 : ups + 1,
          isUped: !isUped,
        };
      });
    } else if (err_msg) {
      setNotification((prevState) => ({
        ...prevState,
        open: true,
        status: 'error',
        message: err_msg,
      }));
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = () => {
    handleClose();
    setShare((prevState) => ({
      ...prevState,
      open: true,
      url: `${sharePrefixURL}#${id}`,
      post,
    }));
  };

  const handleReply = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleClose();
    onReply?.(event);
  };

  React.useEffect(() => {
    const { origin, pathname } = window.location;
    setSharePrefixURL(`${origin}${pathname}`);

    return () => {
      isCancel.current = true;
    };
  }, []);

  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  React.useEffect(() => {
    if (hash !== `#${id}`) {
      return;
    }

    clearTimeout(timer.current);

    /**
     * appHeaderHight => app header height
     * replieSpacings => spacings between replies
     * threshold => the highlight reply top offset
     */
    const appHeaderHight = isWidthDownSm ? 56 : 64;
    const replieSpacings = 32;
    let threshold = 10;

    if (isWidthDownSm) {
      threshold += replieSpacings / 2;
    }

    timer.current = setTimeout(() => {
      scroller.scrollTo(hash, {
        duration: 500,
        smooth: 'easeInOutQuart',
        offset: -(appHeaderHight + replieSpacings / 2 + threshold),
      });
    }, 0);

    return () => clearTimeout(timer.current);
  }, [hash, id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      id={`#${id}`}
      className={clsx('topic-reply', {
        hilite: hash === `#${id}`,
        owned: uname === topicAuthor,
      })}
    >
      <div className="reply-content">
        <Grid className={clsx('reply-header')} container wrap="nowrap">
          <Avatar className="reply-avatar" aria-label="Recipe">
            <Link to={uname ? `/user/${uname}` : '/'}>
              {avatar && <img src={avatar} alt={uname || '用户已注销'} />}
            </Link>
          </Avatar>

          <Grid className="reply-attrs" container item zeroMinWidth wrap="nowrap">
            <Grid container wrap="nowrap" className="group">
              <Grid className="uname-text" container item zeroMinWidth wrap="nowrap">
                <Grid item zeroMinWidth>
                  <Link className="uname" to={uname ? `/user/${uname}` : '/'}>
                    {uname ? uname : '用户已注销'}
                  </Link>
                </Grid>
                {uname === topicAuthor && (
                  <Grid className="text" item>
                    [作者]
                  </Grid>
                )}
              </Grid>
              <Grid className="time" item>
                {dayjs(createAt).fromNow()}
              </Grid>
            </Grid>
          </Grid>

          <Grid className="reply-actions" item>
            <IconButton className="action up" size="large" onClick={handleUp}>
              {upData.isUped ? <ThumbUpIcon /> : <ThumbUpCancelIcon />}
            </IconButton>
            {Boolean(upData.ups) && <span className="num">{upData.ups}</span>}
            <IconButton className="action more" size="large" onClick={handleOpen}>
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              anchorReference="anchorEl"
              anchorPosition={{ top: 30, left: 30 }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              onClose={handleClose}
            >
              <List>
                <ListItem className="action post" button onClick={handleShare}>
                  <ListItemIcon className={classes.icon}>
                    <ShareIcon />
                  </ListItemIcon>
                </ListItem>
                {isAuthed && (
                  <ListItem className="action reply" button onClick={handleReply}>
                    <ListItemIcon className={classes.icon}>
                      <ReplyIcon />
                    </ListItemIcon>
                  </ListItem>
                )}
              </List>
            </Popover>
          </Grid>
        </Grid>

        <div className="markdown-container">
          <MarkdownRender markdownSource={content} />
        </div>
      </div>

      <ShareDialog
        {...share}
        onClose={() => {
          setShare((prevState) => ({ ...prevState, open: false }));
        }}
      />
      <Notification
        {...notification}
        onClose={() => {
          setNotification((prevState) => ({ ...prevState, open: false }));
        }}
      />
    </div>
  );
};

export default TopicReply;
