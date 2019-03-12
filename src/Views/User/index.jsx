import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { getBingImage, get as getData } from '../../fetch';

import { withStyles } from '@material-ui/core';
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

import Layout from '../../Layout';
import TopiCard from '../../Components/TopiCard';
import Progress from '../../Components/Progress';
import Moment from '../../Components/Moment';
import { GithubIcon } from '../../Components/Icons';
import './user.styl';

const styles = theme => ({
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  colorPrimary: {
    backgroundColor: 'rgba(165, 211, 247, .8)',
  },
  barColorPrimary: {
    backgroundColor: '#2698f3',
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
});

class User extends React.Component {
  constructor(props) {
    super(props);

    const { uname } = props.match.params;

    this.state = {
      ...this.initialData,
      uname,
      image: undefined,
    };
  }

  initialData = {
    status: 'loading',
    mdrender: false,
    data: {},
    index: 0,
    topicsTab: [{
      keyname: 'recent_topics',
      tabname: '最近创建',
      show: true,
    }, {
      keyname: 'recent_replies',
      tabname: '最近回复',
      show: false,
    }, {
      keyname: 'recent_collections',
      tabname: '话题收藏',
      show: false,
    }],
    completed: false,
  };

  handleChange = (event, index) => {
    this.setState(state => {
      const { topicsTab } = state;
      topicsTab[index].show = true;

      return { topicsTab, index };
    });
  };

  handleChangeIndex = index => {
    this.handleChange(null, index);
  };

  bingImageLoaded = () => {
    this.setState({
      completed: true,
    });
  };

  handleBingImage = async () => {
    await this.fetchBingImage();

    if (this.bingImage.complete) {
      this.bingImageLoaded();
    } else {
      this.bingImage.addEventListener('load', this.bingImageLoaded);
    }
  };

  fetchBingImage = async () => {
    const image = await getBingImage();
    this.setState({ image });
  };

  fetchUserInfoTopics = async () => {
    const {
      uname,
      mdrender,
    } = this.state;

    const params = {
      url: `/user/${uname}`,
      params: { mdrender },
    };

    const { success, data, err_msg } = await getData(params);

    if (success) {
      this.setState(state => ({
        data: {
          ...state.data,
          ...data,
        },
        status: 'success',
      }));
    } else {
      this.setState({
        status: 'error',
        err_msg,
      });
    }
  };

  fetchCollectedTopics = async () => {
    const {
      uname,
      mdrender,
    } = this.state;

    const params = {
      url: `/topic_collect/${uname}`,
      params: { mdrender },
    };

    const { success, data } = await getData(params);

    if (success) {
      this.setState(state => ({
        data: {
          ...state.data,
          recent_collections: data,
        },
      }));
    }
  };

  componentDidMount() {
    this.handleBingImage();
    this.fetchUserInfoTopics();
    this.fetchCollectedTopics();
  }

  componentWillReceiveProps(nextProps) {
    const { uname } = nextProps.match.params;

    this.setState({
      ...this.initialData,
      uname,
    }, () => {
      this.handleBingImage();
      this.fetchUserInfoTopics();
      this.fetchCollectedTopics();
    });
  }

  componentWillUnmount() {
    if (this.bingImage) {
      this.bingImage.removeEventListener('load', this.bingImageLoaded);
    }
  }

  render() {
    const {
      classes,
      width,
    } = this.props;

    const {
      status,
      uname,
      data,
      topicsTab,
      completed,
      err_msg,
      image,
    } = this.state;

    return (
      <Layout>
        <Helmet
          title={uname}
          bodyAttributes={{ class: 'user-view' }}
        />

        <div className="cover blur">
          <div className={classNames('bing-image', {
            'completed': completed,
          })}>
            {image &&
              <img
                ref={ref => this.bingImage = ref}
                src={image.url}
                alt="background image"
                title={image.copyright}
                aria-hidden
              />
            }
          </div>
          <Fade in={!completed}>
            <LinearProgress
              className={classes.progress}
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: classes.barColorPrimary,
              }}
            />
          </Fade>

          {status === 'success' &&
            <div className="user wrapper">
              <Avatar id="avatar" aria-label="Recipe">
                <img src={data.avatar_url} alt={data.loginname} />
              </Avatar>
              <div className="items">
                <Hidden xsDown>
                  <div>
                    <div className="item name">
                      <PersonIcon />
                      {data.loginname}
                    </div>
                    <div className="item create">
                      <AccessTimeIcon />
                      <Moment format="YYYY-MM-DD HH:mm:ss">
                        {data.create_at}
                      </Moment>
                    </div>
                  </div>
                  <div>
                    {data.githubUsername &&
                      <div className="item github">
                        {GithubIcon}
                        <a
                          target="_blank"
                          href={`https://github.com/${data.githubUsername}`}
                        >
                          {data.githubUsername}
                        </a>
                      </div>
                    }
                    <div className="item score">
                      <SchoolIcon />
                      {data.score}
                    </div>
                  </div>
                </Hidden>
                <Hidden smUp>
                  <div>
                    {data.githubUsername &&
                      <div className="item github">
                        {GithubIcon}
                        <a
                          target="_blank"
                          href={`https://github.com/${data.githubUsername}`}
                        >
                          {data.githubUsername}
                        </a>
                      </div>
                    }
                  </div>
                  <div>
                    <div className="item create">
                      <AccessTimeIcon />
                      <Moment format="YYYY-MM-DD HH:mm:ss">
                        {data.create_at}
                      </Moment>
                    </div>
                  </div>
                </Hidden>
              </div>
            </div>
          }
        </div>

        <div className={classNames('tab-list', classes.spacings)}>
          <div className="wrapper">
            <Tabs
              className="tabs"
              value={this.state.index}
              onChange={this.handleChange}
              centered
              fullWidth={!isWidthUp('md', width)}
            >
              {topicsTab.map(({ keyname, tabname }) => (
                <Tab
                  className="tab"
                  label={tabname}
                  key={tabname}
                  disabled={!Boolean(data[keyname])}
                />
              ))}
            </Tabs>
          </div>
        </div>

        <Fade in={status === 'error'}>
          <div className={classNames('tips error', {
            [classes.tips]: status === 'error',
          })}>
            {err_msg}
          </div>
        </Fade>

        {status === 'success' &&
          <div className="recent wrapper">
            <SwipeableViews
              index={this.state.index}
              onChangeIndex={this.handleChangeIndex}
              enableMouseEvents
              animateHeight
              slideStyle={{ overflow: 'hidden' }}
            >
              {topicsTab.map(({ keyname, show }) => (
                <SwipeableViewsTab
                  data={data[keyname]}
                  className={keyname.replace('_', '-')}
                  show={show}
                  key={keyname}
                />
              ))}
            </SwipeableViews>
          </div>
        }

        <div className="status wrapper">
          <Progress className="mini" status={status} />
        </div>
      </Layout>
    );
  }
}

class SwipeableViewsTab extends React.Component {
  componentDidUpdate() {
    this.context.swipeableViews.slideUpdateHeight();
  }

  render() {
    const {
      data,
      show,
      className,
    } = this.props;

    return (
      <div className={className}>
        {data && show && data.map(item => (
          <TopiCard
            className="profile"
            simple
            item={item}
            key={item.id}
          />
        ))}
      </div>
    );
  }
}

SwipeableViewsTab.contextTypes = {
  swipeableViews: PropTypes.object.isRequired,
};

User.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
};

export default withStyles(styles)(withWidth()(User));
