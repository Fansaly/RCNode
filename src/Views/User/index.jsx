import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { getBingImage, get as getData } from '../../fetch';

import { withStyles } from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import SwipeableViews from 'react-swipeable-views';
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
  container: {
    marginTop: '30px !important',
    [theme.breakpoints.down('xs')]: {
      marginTop: '0 !important',
    },
  },
});

class User extends React.Component {
  constructor(props) {
    super(props);

    const { uname } = props.match.params;

    this.state = {
      status: 'loading',
      uname,
      mdrender: false,
      ...this.initialData,
      background: {},
    };
  }

  initialData = {
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

  fetchBingImage = async () => {
    const background = await getBingImage();
    this.setState({ background });
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

    const { status, data } = await getData(params);

    if (status) {
      this.setState(state => ({
        data: {
          ...state.data,
          ...data,
        },
        status: 'success',
      }));
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

    const { status, data } = await getData(params);

    if (status) {
      this.setState(state => ({
        data: {
          ...state.data,
          recent_collections: data,
        },
        status: 'success',
      }));
    }
  };

  componentDidMount() {
    this.fetchBingImage();
    this.fetchUserInfoTopics();
    this.fetchCollectedTopics();
  }

  componentWillReceiveProps(nextProps) {
    const { uname } = nextProps.match.params;

    this.setState({
      uname,
      ...this.initialData,
    }, () => {
      this.fetchBingImage();
      this.fetchUserInfoTopics();
      this.fetchCollectedTopics();
    });
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
    } = this.state;

    const {
      base,
      images,
    } = this.state.background;

    return (
      <Layout>
        <Helmet
          title={uname}
          bodyAttributes={{ class: 'user-view' }}
        />

        <div className="cover blur">
          {images && (({ url, copyright }) => (
            <div className="bing-image">
              <img
                className="complete"
                ref={this.imageRef}
                src={`${base}${url}`}
                aria-hidden
                alt="background image"
                title={copyright}
              />
            </div>
          ))(images[0])}

          {data.loginname &&
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

        <div id="container" className={classes.container}>
          <div className="tab-list">
            <div className="wrapper">
              <Tabs
                className="tabs"
                value={this.state.index}
                onChange={this.handleChange}
                centered
                fullWidth={!isWidthUp('md', width)}
              >
                {topicsTab.map(({ tabname }) => (
                  <Tab className="tab" label={tabname} key={tabname} />
                ))}
              </Tabs>
            </div>
          </div>
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
        </div>

        <div className="status wrapper">
          <Progress className="mini" status={status} />
        </div>
      </Layout>
    );
  }
}

class SwipeableViewsTab extends React.PureComponent {
  constructor(props) {
    super(props);

    const { data, show } = this.props;
    this.state = { data, show };
  }

  componentDidUpdate() {
    this.context.swipeableViews.slideUpdateHeight();
  }

  componentWillReceiveProps(nextProps) {
    const { data, show } = nextProps;
    this.setState({ data, show });
  }

  render() {
    const { data, show } = this.state;

    return (
      <div className={this.props.className}>
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
