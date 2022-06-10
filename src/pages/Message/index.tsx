import MarkAllIcon from '@mui/icons-material/DoneAll';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

import { fetchMessages, markAllMessage } from '@/api';
import Progress from '@/components/Progress';
import { AppFrame } from '@/layout';
import { useDispatch, useSelector } from '@/store';

import MessageCard from './MessageCard';

const useStyles = makeStyles((theme) => ({
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
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.6)' : 'rgba(190,190,190,.6)',
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
    opacity: 0.6,
  },
  error: {
    color: theme.palette.secondary.main,
  },
}));

type Status = 'idle' | 'loading' | 'success' | 'error';
interface State {
  status: Status;
  message?: string;
}

const Message = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { accesstoken } = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);

  const [items, setItems] = React.useState<any[]>([]);
  const [state, setState] = React.useState<State>({ status: 'loading' });
  const isCancel = React.useRef<boolean>(false);

  const markAll = () => {
    items.map((item) => (item.has_read = true));
    setItems(items);
  };

  const handleMarkAll = async () => {
    isCancel.current = false;

    const { success } = await markAllMessage({
      accesstoken,
    });

    if (!isCancel.current && success) {
      markAll();
      dispatch({ type: 'message/readAll' });
    }
  };

  React.useEffect(() => {
    isCancel.current = false;
    const controller = new AbortController();

    setState({ status: 'loading' });

    (async () => {
      if (!accesstoken) {
        return;
      }

      const { data, err_msg } = await fetchMessages({
        signal: controller.signal,
        accesstoken,
        mdrender: false,
      });

      if (isCancel.current) {
        return;
      }

      if (data) {
        const { hasnot_read_messages: unRead = [], has_read_messages: hasRead = [] } =
          data;

        dispatch({ type: 'message/update', payload: { count: unRead.length } });

        setState({ status: 'success' });
        setItems([...unRead, ...hasRead]);
      } else if (err_msg) {
        setState({ status: 'error', message: err_msg });
      }
    })();

    return () => {
      isCancel.current = true;
      controller.abort();
    };
  }, [accesstoken, dispatch]);

  return (
    <AppFrame>
      <div className="wrapper">
        <Grid
          className={classes.spacings}
          container
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid
            className={clsx(classes.text, {
              [classes.opacity]: state.status !== 'success' || message.count === 0,
              [classes.error]: state.status === 'error',
            })}
            item
          >
            <Fade unmountOnExit in={state.status === 'loading'}>
              <span>获取消息中……</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'error'}>
              <span>{state.message}</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'success' && !items.length}>
              <span>没有消息哦</span>
            </Fade>
            <Fade
              unmountOnExit
              in={state.status === 'success' && Boolean(items.length) && !message.count}
            >
              <span>已读全部消息</span>
            </Fade>
            <Fade unmountOnExit in={state.status === 'success' && Boolean(message.count)}>
              <span>{message.count} 条未读消息</span>
            </Fade>
          </Grid>
          <Tooltip
            title="全部标为已读"
            placement="left-start"
            enterDelay={500}
            disableHoverListener={message.count === 0}
            disableTouchListener
            disableFocusListener
          >
            <span>
              <IconButton
                size="large"
                disableRipple
                disabled={state.status !== 'success' || message.count === 0}
                onClick={handleMarkAll}
              >
                <MarkAllIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>

        {items.map((item) => (
          <MessageCard key={item.id} item={item} hasRead={item.has_read} />
        ))}
      </div>

      <div className="status wrapper">
        <Progress status={state.status} />
      </div>
    </AppFrame>
  );
};

export default Message;
