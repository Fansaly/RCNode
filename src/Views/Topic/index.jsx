import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  navTabsObject as navTabs,
  getNewDataUpdate,
  getNewDataReply,
} from '../../common';
import { get as getData } from '../../fetch';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Fade from '@material-ui/core/Fade';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/LocalLibrary';
import TagIcon from '@material-ui/icons/LocalOffer';

import Layout from '../../Layout';
import TopicReply from './TopicReply';
import { MarkdownRender } from '../../Components/Markdown';
import ImageZoom from '../../Components/ImageZoom';
import Progress from '../../Components/Progress';

import Avatar from '../../Components/Avatar';
import Editor from '../../Components/Editor';
import ActionDial from '../../Components/ActionDial';
import ShareDialog from '../../Components/ShareDialog';
import Notification from '../../Components/Notification';
import Moment from '../../Components/Moment';
import { scroller } from 'react-scroll';
import './topic.styl';

class Topic extends React.Component {
  constructor(props) {
    super(props);

    const { topic_id } = props.match.params;

    this.state = {
      status: 'loading',
      topic_id,
      mdrender: false,
      data: undefined,
      shareURL: undefined,
      topicData: undefined,
    };
  }

  timer = null;

  scrollTo = target => {
    scroller.scrollTo(target, {
      duration: 500,
      smooth: 'easeInOutQuart',
      offset: -(64 + 10 + 18 / 2 + 1),
    });
  };

  fetchData = async () => {
    const { topic_id, mdrender } = this.state;
    const { accesstoken } = this.props;
    const params = {
      url: `/topic/${topic_id}`,
      params: { mdrender, accesstoken },
    };

    const { success, data, err_msg } = await getData(params);

    if (success) {
      const {
        author: { loginname: uname },
        is_collect,
        tab,
        title,
        content,
      } = data;

      this.setState({
        status: 'success',
        data,
        topicData: {
          uname,
          tab,
          title,
          content,
          topic_id,
          is_collect,
        },
      }, () => {
        const { hash } = this.props.location;

        if (Boolean(hash)) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.scrollTo(hash);
          }, 300);
        }
      });
    } else {
      this.setState({
        status: 'error',
        err_msg,
      });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    const newDataReply = getNewDataReply(nextProps);
    newDataReply && this.setState(state => ({
      data: {
        ...state.data,
        replies: [
          ...state.data.replies,
          newDataReply,
        ],
      },
    }));

    const newDataUpdate = getNewDataUpdate(nextProps);
    newDataUpdate && this.setState(state => ({
      data: {
        ...state.data,
        ...newDataUpdate,
      },
    }));
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const {
      data,
      status,
      err_msg,
      topicData,
    } = this.state;

    const { width } = this.props;

    return (
      <Layout>
        <Helmet
          title={status === 'success' ? data.title : 'RCNode'}
          bodyAttributes={{
            class: classNames('topic-view', {
              'error-tips': status === 'error',
              'zero-spacings': isWidthDown('xs', width),
            }),
          }}
        />

        <div id="container">
          <Fade in={status === 'error'}>
            <div className="wrapper tips error">
              {err_msg}
            </div>
          </Fade>

          {status === 'success' &&
            <div id="topic" className="wrapper">
              <div className="topic-main">
                <Typography variant="h5" className="title">
                  {data.title}
                </Typography>
                <div className="topic-attrs">
                  <span className="attr-author">
                    <Avatar
                      className="avatar"
                      image={data.author.avatar_url}
                      name={data.author.loginname}
                    />
                    <Hidden xsDown><em>作者</em></Hidden>
                    <Link to={`/user/${data.author.loginname}`}>
                      {data.author.loginname}
                    </Link>
                  </span>
                  <span className="attr-create">
                    <CreateIcon />
                    <Hidden xsDown><em>发布于</em></Hidden>
                    <Moment fromNow>{data.create_at}</Moment>
                  </span>
                  <span className="attr-visit">
                    <ViewIcon />
                    <em>{data.visit_count}</em>
                    <Hidden xsDown>次浏览</Hidden>
                  </span>
                  {data.tab &&
                    <span className="attr-tab">
                      <TagIcon />
                      <Hidden xsDown><em>来自</em></Hidden>
                      <span className={data.tab}>
                        {navTabs[data.tab].name}
                      </span>
                    </span>
                  }
                </div>

                <div className="markdown-container">
                  <MarkdownRender markdownString={data.content} />
                </div>
              </div>

              {Boolean(data.replies.length) &&
                <div className="topic-replies">
                  {data.replies.map((item, index) => (
                    <TopicReply
                      author={data.author.loginname}
                      index={index}
                      item={item}
                      key={item.id}
                    />
                  ))}
                </div>
              }
            </div>
          }

          <div className="status wrapper">
            <Progress className="mini" status={status} />
          </div>
        </div>

        <ActionDial topicData={topicData} />
        <Editor />
        <ImageZoom />
        <ShareDialog />
        <Notification />
      </Layout>
    );
  }
}

Topic.propTypes = {
  width: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth, editor }) => ({
  ...auth,
  ...editor,
});

export default compose(
  withWidth(),
  connect(
    mapStateToProps,
  ),
)(Topic);
