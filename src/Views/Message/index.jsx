import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  get as getData,
  post,
} from '../../fetch';

import { makeStyles } from '@material-ui/core/styles';

import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MarkAllIcon from '@material-ui/icons/DoneAll';

import { AppWrapper } from '../../Layout';
import MessageCard from './MessageCard';
import Progress from '../../Components/Progress';

const useStyles = makeStyles(theme => ({
  spacings: {
    marginTop: 40,
    marginBottom: 10,
    padding: '0 7px',
    '@media (max-width: 768px)': {
      marginTop: 30,
      marginBottom: 8,
    },
    '@media (max-width: 600px)': {
      marginTop: 20,
      marginBottom: 4,
    },
  },
  text: {
    position: 'relative',
    flex: 1,
    marginRight: 8,
    fontSize: 14,
    color: theme.palette.type === 'light' ? 'rgba(0,0,0,.6)' : 'rgba(190,190,190,.6)',
    pointerEvents: 'none',
    transition: 'opacity .15s cubic-bezier(.4,0,.2,1)',
    '@media (max-width: 600px)': {
      marginRight: 4,
    },
    '& span': {
      position: 'absolute',
      top: -9,
      right: 0,
      whiteSpace: 'nowrap',
    },
  },
  opacity: {
    opacity: .6,
  },
  error: {
    color: theme.palette.secondary.main,
  },
}));

const Message = () => {
  const [items, setItems] = React.useState([]);
  const [state, setState] = React.useState({
    status: 'loading',
    err_msg: '发生错误',
  });
  const { isAuthed, accesstoken, message } = useSelector(s => ({
    ...s.auth,
    message: { ...s.message },
  }));
  const isCancel = React.useRef(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const markAllMessage = () => {
    items.map(item => item.has_read = true);
    setItems(items);
  };

  const handleMarkAllMessage = async () => {
    isCancel.current = false;

    const params = {
      url: '/message/mark_all',
      params: { accesstoken },
    };

    const { success } = await post(params);

    if (!isCancel.current && success) {
      markAllMessage();
      dispatch({ type: 'READ_ALL_MESSAGE' });
    }
  };

  React.useEffect(() => {
    if (!Boolean(accesstoken)) {
      return;
    }

    (async () => {
      const params = {
        url: '/messages',
        params: {
          accesstoken,
          mdrender: false,
        },
      };

      const {
        success,
        data: {
          hasnot_read_messages: unRead = [],
          has_read_messages: hasRead = [],
        },
        err_msg,
      } = await getData(params);

      if (isCancel.current) {
        return;
      }

      if (success) {
        dispatch({ type: 'UPDATE_MESSAGE', data: unRead.length });

        setState({ status: 'success' });
        setItems([ ...unRead, ...hasRead ]);
      } else {
        setState(prevState => ({
          status: 'error',
          err_msg: err_msg ? err_msg : prevState.err_msg,
        }));
      }
    })();

    return () => isCancel.current = true;
  }, [accesstoken, dispatch]);

  React.useEffect(() => {
    if (!isAuthed) {
      history.push('/');
    }
  }, [isAuthed, history]);

  return (
    <AppWrapper title="消息">
      <div className="wrapper">
        <Grid container alignItems="center" justify="flex-end" className={classes.spacings}>
          <Grid item className={clsx(classes.text, {
            [classes.opacity]: state.status !== 'success' || message.count === 0,
            [classes.error]: state.status === 'error',
          })}>
            <Fade unmountOnExit in={state.status === 'loading'}>
              <span>获取消息中……</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'error'}>
              <span>{state.err_msg}</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'success' && !Boolean(items.length)}>
              <span>没有消息哦</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'success' && Boolean(items.length) && !Boolean(message.count)}>
              <span>已读全部消息</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'success' && Boolean(message.count)}>
              <span>{message.count} 条未读消息</span>
            </Fade>
          </Grid>
          <Tooltip
            title="全部标为已读"
            enterDelay={500}
            placement="left-start"
            disableTouchListener
          >
            <span>
            <IconButton
              onClick={handleMarkAllMessage}
              disabled={state.status !== 'success' || message.count === 0}
              disableRipple
            >
              <MarkAllIcon />
            </IconButton>
            </span>
          </Tooltip>
        </Grid>

        {items.map(item => (
          <MessageCard key={item.id} item={item} hasRead={item.has_read} />
        ))}
      </div>

      <div className="status wrapper">
        <Progress status={state.status} />
      </div>
    </AppWrapper>
  );
};

export default Message;
