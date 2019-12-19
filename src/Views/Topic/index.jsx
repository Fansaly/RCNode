import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import {
  navTabsObject as navTabs,
  getNewDataUpdate,
  getNewDataReply,
} from '../../common';
import { get as getData } from '../../fetch';

import { useTheme } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import ViewIcon from '@material-ui/icons/LocalLibrary';
import TagIcon from '@material-ui/icons/LocalOffer';

import { AppWrapper } from '../../Layout';
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
import './topic.styl';

const Topic = (props) => {
  const theme = useTheme();
  const { topic_id } = useParams();
  const { accesstoken } = useSelector(state => state.auth);

  const [status, setStatus] = React.useState('loading');
  const [topic, setTopic] = React.useState({});
  const [replies, setReplies] = React.useState([]);
  const [dialTopic, setDialTopic] = React.useState(null);
  const [message, setMessage] = React.useState(null);

  const isCancel = React.useRef();
  React.useEffect(() => {
    isCancel.current = false;

    (async () => {
      const params = {
        url: `/topic/${topic_id}`,
        params: { mdrender: false, accesstoken },
      };

      const { success, data, err_msg } = await getData(params);

      if (isCancel.current) {
        return;
      }

      if (success) {
        const { replies: reps, ...rest } = data;

        setStatus('success');
        setTopic({ ...rest });
        setReplies([ ...reps ]);
        setDialTopic({
          uname: rest.author.loginname,
          is_collect: rest.is_collect,
          content: rest.content,
          title: rest.title,
          tab: rest.tab,
          topic_id,
        });
      } else {
        setStatus('error');
        setMessage(err_msg);
      }
    })();

    return () => isCancel.current = true;
  }, [topic_id, accesstoken]);

  const editorData = useSelector(state => state.editor);

  React.useEffect(() => {
    const newDataReply = getNewDataReply(editorData);

    if (newDataReply) {
      setReplies(prevState => ([
        ...prevState,
        newDataReply,
      ]));
    }

    const newDataUpdate = getNewDataUpdate(editorData);

    if (newDataUpdate) {
      setTopic(prevState => ({
        ...prevState,
        ...newDataUpdate,
      }));

      setDialTopic(prevState => ({
        ...prevState,
        uname: newDataUpdate.author.loginname,
        is_collect: newDataUpdate.is_collect,
        content: newDataUpdate.content,
        title: newDataUpdate.title,
        tab: newDataUpdate.tab,
      }));
    }
  }, [editorData]);

  return (
    <AppWrapper
      title={topic.title}
      bodyAttributes={{
        class: clsx('topic-view', {
          'error-tips': status === 'error',
          'zero-spacings': isWidthDown('xs', props.width),
        }),
      }}
    >
      <div id="container">
        <Fade in={Boolean(message)}>
          <div className="wrapper tips error">
            {message}
          </div>
        </Fade>

        {Boolean(topic.title) &&
          <div id="topic" className={clsx('wrapper', {
            'dark': theme.palette.type === 'dark',
          })}>
            <div className="topic-main">
              <Typography variant="h5" className="title">
                {topic.title}
              </Typography>
              <div className="topic-attrs-wrap">
                <div className="topic-attrs">
                  <span className="attr-author">
                    <Avatar
                      className="avatar"
                      image={topic.author.avatar_url}
                      name={topic.author.loginname}
                    />
                    <Link to={`/user/${topic.author.loginname}`}>
                      {topic.author.loginname}
                    </Link>
                  </span>
                  <span className="attr-create">
                    <CreateIcon />
                    <Moment fromNow>{topic.create_at}</Moment>
                  </span>
                  <span className="attr-visit">
                    <ViewIcon />
                    <em>{topic.visit_count}</em>
                    浏览
                  </span>
                  {topic.tab &&
                    <span className="attr-tab">
                      <TagIcon />
                      <span className={topic.tab}>
                        {navTabs[topic.tab].name}
                      </span>
                    </span>
                  }
                </div>
              </div>

              <div className="markdown-container">
                <MarkdownRender markdownString={topic.content} />
              </div>
            </div>

            {Boolean(replies.length) &&
              <div className="topic-replies">
                {replies.map((item, index) => (
                  <TopicReply
                    topicAuthor={topic.author.loginname}
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

      <ActionDial topic={dialTopic} />
      <Editor />
      <ImageZoom />
      <ShareDialog />
      <Notification />
    </AppWrapper>
  );
};

Topic.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(Topic);
