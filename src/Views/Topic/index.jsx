import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  navTabsObject as navTabs,
  getNewDataUpdate,
  getNewDataReply,
} from '../../common';
import { get as getData } from '../../fetch';

import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import AuthorIcon from '@material-ui/icons/Person';
import ViewIcon from '@material-ui/icons/LocalLibrary';
import TagIcon from '@material-ui/icons/LocalOffer';

import Layout from '../../Layout';
import TopicReply from './TopicReply';
import { MarkdownRender } from '../../Components/Markdown';
import ImageZoom from '../../Components/ImageZoom';
import Progress from '../../Components/Progress';

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

    const { status, data } = await getData(params);

    if (status) {
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
      this.setState({ status: 'error' });
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
      topicData,
    } = this.state;

    return (
      <Layout>
        <div id="container">
          {data &&
            <div id="topic" className="wrapper">
              <div className="topic-main">
                <Typography variant="h5" className="title">
                  {data.title}
                </Typography>
                <div className="attr">
                  <span>
                    <CreateIcon />
                    <Hidden smDown><em>发布于</em></Hidden>
                    <Moment fromNow>{data.create_at}</Moment>
                  </span>
                  <span>
                    <AuthorIcon />
                    <Hidden smDown><em>作者</em></Hidden>
                    <Link to={`/user/${data.author.loginname}`}>
                      {data.author.loginname}
                    </Link>
                  </span>
                  <span>
                    <ViewIcon />
                    <em>{data.visit_count}</em>
                    <Hidden smDown>次浏览</Hidden>
                  </span>
                  {data.tab &&
                    <span>
                      <TagIcon />
                      <Hidden smDown><em>来自</em></Hidden>
                      <i className={data.tab}>
                        {navTabs[data.tab].name}
                      </i>
                    </span>
                  }
                </div>

                <div className="markdown-container">
                  <MarkdownRender markdownString={data.content} />
                </div>
              </div>

              {!!data.replies.length &&
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

const mapStateToProps = ({ auth, editor }) => ({
  ...auth,
  ...editor,
});

export default connect(
  mapStateToProps,
)(Topic);
