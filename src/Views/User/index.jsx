import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { getBingImage, get as getData } from '../../fetch';

import { makeStyles } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import SwipeableViews from 'react-swipeable-views';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';

import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import SchoolIcon from '@material-ui/icons/School';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

import { AppWrapper } from '../../Layout';
import TopiCard from '../../Components/TopiCard';
import Progress from '../../Components/Progress';
import Moment from '../../Components/Moment';
import { GithubIcon } from '../../Components/Icons';
import './user.styl';

const useStyles = makeStyles(theme => ({
  cover: {
    backgroundColor: theme.palette.type === 'light' ? 'rgba(83,156,98,.8)' : 'rgba(69,97,74,.8)',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  colorPrimary: {
    backgroundColor: theme.palette.type === 'light' ? 'rgba(165,211,247,.8)' : 'rgba(165,211,247,.8)',
  },
  barColorPrimary: {
    backgroundColor: theme.palette.type === 'light' ? '#2698f3' : '#2698f3',
  },
  spacings: {
    marginTop: 30,
    [theme.breakpoints.down('xs')]: {
      marginTop: 0,
    },
  },
  tips: {
    marginTop: 40,
  },
  tab: {
    fontSize: 16,
  },
  selected: {
    color: '#2ac2f9',
  },
  indicator: {
    backgroundColor: '#2ac2f9',
  },
}));

const labelIndex = ['topics', 'replies', 'collections'];
const initialState = {
  topics: {
    name: '最近创建',
    data: [],
    show: true,
  },
  replies: {
    name: '最近回复',
    data: [],
    show: false,
  },
  collections: {
    name: '话题收藏',
    data: [],
    show: false,
  },
};

const User = (props) => {
  const { uname } = useParams();
  const isCancel = React.useRef();
  const bingImgRef = React.useRef();
  const [bingImage, setBingImage] = React.useState({ complete: false });
  const [index, setIndex] = React.useState(0);
  const [status, setStatus] = React.useState('loading');
  const [message, setMessage] = React.useState(null);
  const [profile, setProfile] = React.useState({ uname });

  const [state, dispatch] = React.useReducer((prevState, { type, data }) => {
    switch (type) {
      case 'SET_TOPICS':
        return {
          ...prevState,
          topics: {
            ...prevState.topics,
            ...data,
          },
        };
      case 'SET_REPLIES':
        return {
          ...prevState,
          replies: {
            ...prevState.replies,
            ...data,
          },
        };
      case 'SET_COLLECTIONS':
        return {
          ...prevState,
          collections: {
            ...prevState.collections,
            ...data,
          },
        };
      case 'RESTORE':
        return {
          ...initialState,
        };
      default:
        throw new Error(`Unrecognized type ${type}`);
    }
  }, initialState);

  const handleChange = (event, idx) => {
    setIndex(idx);

    const type = `SET_${labelIndex[idx].toUpperCase()}`;
    dispatch({ type, data: { show: true } });
  };

  const handleChangeIndex = idx => {
    handleChange(null, idx);
  };

  React.useEffect(() => {
    if (!Boolean(bingImgRef.current)) {
      return;
    }

    const setBingImageLoadComplete = () => {
      setBingImage(prevState => ({...prevState, complete: true}));
    };

    if (!!bingImgRef.current.complete) {
      setBingImageLoadComplete();
    } else {
      bingImgRef.current.addEventListener('load', setBingImageLoadComplete);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      bingImgRef.current.removeEventListener('load', setBingImageLoadComplete);
    };
  }, [bingImage.time]);


  React.useEffect(() => {
    isCancel.current = false;

    setStatus('loading');
    setProfile({ uname });
    dispatch({ type: 'RESTORE' });
    setIndex(0);

    (async () => {
      const params = {
        url: `/user/${uname}`,
        params: { mdrender: false },
      };

      const { success, data, err_msg } = await getData(params);

      if (isCancel.current) {
        return;
      }

      if (success) {
        const { recent_topics, recent_replies, ...rest } = data;

        setProfile({ ...rest });
        dispatch({ type: 'SET_TOPICS', data: { data: recent_topics } });
        dispatch({ type: 'SET_REPLIES', data: { data: recent_replies } });
        setStatus('success');
      } else {
        setStatus('error');
        setMessage(err_msg);
      }
    })();

    (async () => {
      const params = {
        url: `/topic_collect/${uname}`,
        params: { mdrender: false },
      };

      const { success, data } = await getData(params);

      if (!isCancel.current && success) {
        dispatch({ type: 'SET_COLLECTIONS', data: { data } });
      }
    })();

    setBingImage(prevState => ({...prevState, complete: false}));

    (async () => {
      const data = await getBingImage();

      if (!isCancel.current) {
        setBingImage(prevState => ({ ...prevState, ...data }));
      }
    })();

    return () => isCancel.current = true;
  }, [uname]);

  const { width } = props;
  const classes = useStyles();
  const swipeableViewsRef = React.useRef();

  return (
    <AppWrapper
      title={uname}
      bodyAttributes={{ class: 'user-view' }}
    >
      <div className={clsx('cover blur', classes.cover)}>
        <div className={clsx('bing-image', {
          'complete': bingImage.complete,
        })}>
          {bingImage.url &&
            <img
              ref={bingImgRef}
              src={bingImage.url}
              alt="background image"
              title={bingImage.copyright}
              aria-hidden
            />
          }
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

        {profile.loginname &&
          <div className="user wrapper">
            <Avatar id="avatar" aria-label="Recipe">
              <img src={profile.avatar_url} alt={profile.loginname} />
            </Avatar>
            <div className="items">
              <Hidden xsDown>
                <div>
                  <div className="item name">
                    <PersonIcon />
                    {profile.loginname}
                  </div>
                  <div className="item create">
                    <AccessTimeIcon />
                    <Moment format="YYYY-MM-DD HH:mm:ss">
                      {profile.create_at}
                    </Moment>
                  </div>
                </div>
                <div>
                  {profile.githubUsername &&
                    <div className="item github">
                      {GithubIcon}
                      <a
                        target="_blank"
                        href={`https://github.com/${profile.githubUsername}`}
                      >
                        {profile.githubUsername}
                      </a>
                    </div>
                  }
                  <div className="item score">
                    <SchoolIcon />
                    {profile.score}
                  </div>
                </div>
              </Hidden>
              <Hidden smUp>
                <div>
                  {profile.githubUsername &&
                    <div className="item github">
                      {GithubIcon}
                      <a
                        target="_blank"
                        href={`https://github.com/${profile.githubUsername}`}
                      >
                        {profile.githubUsername}
                      </a>
                    </div>
                  }
                </div>
                <div>
                  <div className="item create">
                    <AccessTimeIcon />
                    <Moment format="YYYY-MM-DD HH:mm:ss">
                      {profile.create_at}
                    </Moment>
                  </div>
                </div>
              </Hidden>
            </div>
          </div>
        }
      </div>

      <div className={clsx('tab-list', classes.spacings)}>
        <div className="wrapper">
          <Tabs
            classes={{
              indicator: classes.indicator,
            }}
            value={index}
            onChange={handleChange}
            centered
            {
              ...!isWidthUp('md', width)
              ? { variant: 'fullWidth' }
              : {}
            }
          >
            {Object.keys(state).map(key => (
              <Tab
                classes={{
                  root: classes.tab,
                  selected: classes.selected,
                }}
                label={state[key].name}
                key={state[key].name}
                disabled={status !== 'success'}
              />
            ))}
          </Tabs>
        </div>
      </div>

      <Fade in={Boolean(message)}>
        <div className={clsx('tips error', {
          [classes.tips]: Boolean(message),
        })}>
          {message}
        </div>
      </Fade>

      <div className="recent wrapper">
        <SwipeableViews
          index={index}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents
          animateHeight
          slideStyle={{ overflow: 'hidden' }}
          ref={swipeableViewsRef}
        >
          {Object.keys(state).map(key => (
            <div className={`r-${key}`} key={key}>
              <SwipeableViewsTab
                data={state[key].data}
                show={state[key].show}
                ref={swipeableViewsRef}
              />
            </div>
          ))}
        </SwipeableViews>
      </div>

      <div className="status wrapper">
        <Progress className="mini" status={status} />
      </div>
    </AppWrapper>
  );
};

User.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(User);

const SwipeableViewsTab = React.forwardRef((props, ref) => {
  const { data, show } = props;
  const timer = React.useRef();

  React.useEffect(() => {
    if (!show) {
      return;
    }

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      ref.current.updateHeight();
    }, 0 * 1e3);

    return () => clearTimeout(timer.current);
  }, [ref, show, data]);

  return (show && data.map(item => (
    <TopiCard className="profile" item={item} simple key={item.id} />
  )));
});

SwipeableViewsTab.propTypes = {
  data: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
};
