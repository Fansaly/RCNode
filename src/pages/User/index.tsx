import './user.styl';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import Avatar from '@mui/material/Avatar';
import Fade from '@mui/material/Fade';
import Hidden from '@mui/material/Hidden';
import LinearProgress from '@mui/material/LinearProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';

import { fetchUserCollectTopics, fetchUserInfo } from '@/api';
import { TopicCard } from '@/components/Card';
import { GitHubIcon } from '@/components/Icons';
import Progress, { ProgressStatus } from '@/components/Progress';
import { useBreakpoints } from '@/hooks';
import { AppFrame } from '@/layout';
import { dayjs, fetchBingImage } from '@/utils';

import { Key, keys as tabKeys, useReducer } from './useReducer';

const useStyles = makeStyles((theme) => ({
  cover: {
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(83,156,98,.8)' : 'rgba(69,97,74,.8)',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(165,211,247,.8)' : 'rgba(165,211,247,.8)',
  },
  barColorPrimary: {
    backgroundColor: theme.palette.mode === 'light' ? '#2698f3' : '#2698f3',
  },
  spacings: {
    marginTop: 30,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  tips: {
    marginTop: 40,
  },
  tab: {
    fontSize: 16,
    [theme.breakpoints.up('md')]: {
      minWidth: 160,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 200,
    },
    [theme.breakpoints.up('xl')]: {
      minWidth: 240,
    },
  },
  selected: {
    color: '#2ac2f9',
  },
  indicator: {
    backgroundColor: '#2ac2f9',
  },
}));

const User = () => {
  const classes = useStyles();
  const { uname } = useParams();
  const isWidthUpMd = useBreakpoints('up', 'md');
  const [state, dispatch] = useReducer();

  const bingImgRef = React.useRef<null | HTMLImageElement>(null);
  const [bingImage, setBingImage] = React.useState<{ [key: string]: any }>({
    complete: false,
  });

  const [swipeableActions, setSwipeableActions] = React.useState();

  const [index, setIndex] = React.useState<number>(0);
  const [status, setStatus] = React.useState<ProgressStatus>('loading');
  const [message, setMessage] = React.useState<null | string>(null);
  const [profile, setProfile] = React.useState<{ [key: string]: any }>({ uname });
  const isCancel = React.useRef<boolean>(false);

  const handleChange = (
    event: null | React.SyntheticEvent<Element, Event>,
    index: number,
  ) => {
    setIndex(index);

    const type = `SET_${tabKeys[index].toUpperCase()}`;
    dispatch({ type, payload: { show: true } });
  };

  const handleChangeIndex = (index: number) => {
    handleChange(null, index);
  };

  React.useEffect(() => {
    if (!bingImgRef.current) {
      return;
    }

    const setBingImageLoadComplete = () => {
      setBingImage((prevState) => ({ ...prevState, complete: true }));
    };

    if (bingImgRef.current.complete) {
      setBingImageLoadComplete();
    } else {
      bingImgRef.current.addEventListener('load', setBingImageLoadComplete, false);
    }

    return () => {
      if (bingImgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        bingImgRef.current.removeEventListener('load', setBingImageLoadComplete, false);
      }
    };
  }, [bingImage.time]);

  React.useEffect(() => {
    isCancel.current = false;
    const bingController = new AbortController();

    setBingImage((prevState) => ({ ...prevState, complete: false }));

    (async () => {
      const data = await fetchBingImage({ signal: bingController.signal });

      if (!isCancel.current) {
        setBingImage((prevState) => ({ ...prevState, ...data }));
      }
    })();

    setStatus('loading');
    setProfile({ uname });
    dispatch({ type: 'RESTORE' });
    setIndex(0);

    const userController = new AbortController();
    (async () => {
      const { data, err_msg } = await fetchUserInfo({
        signal: userController.signal,
        loginname: uname as string,
        mdrender: false,
      });

      if (isCancel.current) {
        return;
      }

      if (data) {
        const { recent_topics, recent_replies, ...rest } = data;

        setProfile({ ...rest });
        dispatch({ type: 'SET_TOPICS', payload: { data: recent_topics } });
        dispatch({ type: 'SET_REPLIES', payload: { data: recent_replies } });
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(err_msg || null);
      }
    })();

    const topicController = new AbortController();
    (async () => {
      const { data } = await fetchUserCollectTopics({
        signal: topicController.signal,
        loginname: uname as string,
        mdrender: false,
      });

      if (!isCancel.current && data) {
        dispatch({ type: 'SET_COLLECTIONS', payload: { data } });
      }
    })();

    return () => {
      isCancel.current = true;
      bingController.abort();
      userController.abort();
      topicController.abort();
    };
  }, [uname]);

  return (
    <AppFrame title={uname} bodyAttributes={{ class: 'user-view' }}>
      <div className={clsx('cover blur', classes.cover)}>
        <div
          className={clsx('bing-image', {
            complete: bingImage.complete,
          })}
        >
          {bingImage.url && (
            <img
              ref={bingImgRef}
              src={bingImage.url}
              alt="background"
              title={bingImage.copyright}
            />
          )}
        </div>
        <Fade in={!bingImage.complete}>
          <LinearProgress
            className={classes.progress}
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: classes.barColorPrimary,
            }}
          />
        </Fade>

        {profile.loginname && (
          <div className="user wrapper">
            <Avatar id="avatar">
              <img src={profile.avatar_url} alt={profile.loginname} />
            </Avatar>
            <div className="items">
              <Hidden smDown>
                <div>
                  <div className="item name">
                    <PersonIcon />
                    {profile.loginname}
                  </div>
                  <div className="item create">
                    <AccessTimeIcon />
                    {dayjs(profile.create_at).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                <div>
                  {profile.githubUsername && (
                    <div className="item github">
                      <GitHubIcon />
                      <a
                        href={`https://github.com/${profile.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile.githubUsername}
                      </a>
                    </div>
                  )}
                  <div className="item score">
                    <SchoolIcon />
                    {profile.score}
                  </div>
                </div>
              </Hidden>
              <Hidden smUp>
                <div>
                  {profile.githubUsername && (
                    <div className="item github">
                      <GitHubIcon />
                      <a
                        href={`https://github.com/${profile.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {profile.githubUsername}
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <div className="item create">
                    <AccessTimeIcon />
                    {dayjs(profile.create_at).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
              </Hidden>
            </div>
          </div>
        )}
      </div>

      <div className={clsx('tab-list', classes.spacings)}>
        <div className="wrapper">
          <Tabs
            classes={{
              indicator: classes.indicator,
            }}
            textColor="inherit"
            value={index}
            centered
            {...(!isWidthUpMd ? { variant: 'fullWidth' } : {})}
            onChange={handleChange}
          >
            {tabKeys.map((key) => (
              <Tab
                key={state[key as Key]?.name}
                classes={{
                  root: classes.tab,
                  selected: classes.selected,
                }}
                label={state[key as Key]?.name}
                disabled={status !== 'success'}
              />
            ))}
          </Tabs>
        </div>
      </div>

      <Fade in={Boolean(message)}>
        <div
          className={clsx('tips error', {
            [classes.tips]: Boolean(message),
          })}
        >
          {message}
        </div>
      </Fade>

      <div className="recent wrapper">
        <SwipeableViews
          index={index}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore-next-line
          action={(actions) => setSwipeableActions(actions)}
          slideStyle={{ overflow: 'hidden' }}
          animateHeight
          enableMouseEvents
          onChangeIndex={handleChangeIndex}
        >
          {tabKeys.map((key) => (
            <div className={`r-${key}`} key={key}>
              <SwipeableViewsTab
                swipeableActions={swipeableActions}
                show={state[key as Key]?.show}
                data={state[key as Key]?.data}
              />
            </div>
          ))}
        </SwipeableViews>
      </div>

      <div className="status wrapper">
        <Progress className="mini" status={status} />
      </div>
    </AppFrame>
  );
};

export default User;

const SwipeableViewsTab = (props: any) => {
  const { swipeableActions, show = false, data = [] } = props;
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    if (!show || !swipeableActions) {
      return;
    }

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      swipeableActions.updateHeight();
    }, 0 * 1e3);

    return () => {
      clearTimeout(timer.current);
    };
  }, [swipeableActions, show, data]);

  return (
    show &&
    data.map((item: any) => (
      <TopicCard className="profile" item={item} simple key={item.id} />
    ))
  );
};
