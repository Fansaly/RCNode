import './topic.styl';

import CreateIcon from '@mui/icons-material/Create';
import ViewIcon from '@mui/icons-material/LocalLibrary';
import TagIcon from '@mui/icons-material/LocalOffer';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  collectTopic,
  decollectTopic,
  fetchTopicDetails,
  replyTopic,
  updateTopic,
} from '@/api';
import Avatar from '@/components/Avatar';
import Editor from '@/components/Editor';
import MarkdownRender from '@/components/Markdown';
import Notification from '@/components/Notification';
import Progress, { ProgressStatus } from '@/components/Progress';
import ShareDialog from '@/components/ShareDialog';
import TopicActions from '@/components/TopicActions';
import { useBreakpoints } from '@/hooks';
import { AppFrame } from '@/layout';
import { navTabsObject as navTabs } from '@/router';
import { useSelector } from '@/store';
import { dayjs } from '@/utils';

import TopicReply from './TopicReply';

const Topic = () => {
  const theme = useTheme();
  const { topic_id } = useParams();
  const isWidthDownSm = useBreakpoints('down', 'sm');
  const {
    isAuthed,
    accesstoken,
    uname: signedUname,
  } = useSelector((state) => state.auth);

  const [topic, setTopic] = React.useState<any>({});
  const [replies, setReplies] = React.useState<any>([]);
  const [status, setStatus] = React.useState<ProgressStatus>('loading');
  const [message, setMessage] = React.useState<null | string>(null);
  const isCancel = React.useRef<boolean>(false);

  const [replyId, setReplyId] = React.useState<string>('');
  const [editor, setEditor] = React.useState<RCNode.EditorBasic>({
    open: false,
    action: 'reply',
  });
  const [share, setShare] = React.useState<RCNode.Share>({ open: false, url: '' });
  const [notification, setNotification] = React.useState<RCNode.Notification>({
    open: false,
    status: 'success',
    message: '',
  });

  const update = async () => {
    isCancel.current = false;

    const data = {
      tab: editor.topicTab as string,
      title: editor.title as string,
      content: editor.content as string,
    };

    const { success, err_msg } = await updateTopic({
      ...data,
      accesstoken,
      topic_id: topic_id as string,
    });

    if (isCancel.current) {
      return;
    }

    if (success) {
      setTopic((prevState: any) => ({ ...prevState, ...data }));
      setEditor((prevState) => ({ ...prevState, open: false }));
    }

    setNotification((prevState) => ({
      ...prevState,
      open: true,
      status: success ? 'success' : 'error',
      message: success ? '更新成功 ^_^' : err_msg || '更新失败 :(',
    }));
  };

  const reply = async () => {
    isCancel.current = false;

    const { success, data, err_msg } = await replyTopic({
      accesstoken,
      content: editor.content as string,
      topic_id: topic_id as string,
      reply_id: replyId,
    });

    if (isCancel.current) {
      return;
    }

    if (data) {
      setReplies((prevState: any) => [...prevState, data]);
      setEditor((prevState) => ({ ...prevState, open: false }));
    }

    setNotification((prevState) => ({
      ...prevState,
      open: true,
      status: success ? 'success' : 'error',
      message: success ? '回复成功 ^_^' : err_msg || '回复失败 :(',
    }));
  };

  const handleSubmit = async () => {
    if (editor.action === 'update') {
      await update();
    } else if (editor.action === 'reply') {
      await reply();
    }
  };

  const handleUpdate = () => {
    setEditor((prevState) => ({
      ...prevState,
      open: true,
      action: 'update',
      title: topic.title,
      content: topic.content,
      topicTab: topic.tab,
    }));
  };

  const handleReply = (
    _?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
    item?: any,
  ) => {
    let reply_id = topic_id;
    let content = '';

    if (item) {
      reply_id = item.id;
      content = `@${item.author.loginname} `;
    }

    setReplyId(reply_id as string);
    setEditor((prevState) => ({ ...prevState, open: true, action: 'reply', content }));
  };

  const handleShare = () => {
    const { origin, pathname } = window.location;
    setShare((prevState) => ({
      ...prevState,
      open: true,
      url: `${origin}${pathname}`,
    }));
  };

  const handleFavorite = async () => {
    isCancel.current = false;

    const payload = { accesstoken, topic_id: topic_id as string };
    let res: {
      success: boolean;
      message?: string;
      err_msg?: string;
    } = { success: false, message: '' };

    if (topic.is_collect) {
      res = await decollectTopic(payload);
      res.message = '取消收藏';
    } else {
      res = await collectTopic(payload);
      res.message = '已收藏';
    }

    if (isCancel.current) {
      return;
    }

    if (res.success) {
      setTopic((prevState: any) => ({
        ...prevState,
        is_collect: !prevState.is_collect,
      }));
    }
    setNotification((prevState) => ({
      ...prevState,
      open: true,
      status: res.success ? 'success' : 'error',
      message: res.success ? (res.message as string) : res.err_msg || '操作失败',
    }));
  };

  React.useEffect(() => {
    if (!topic_id) {
      return;
    }

    isCancel.current = false;
    const controller = new AbortController();

    (async () => {
      const { data, err_msg } = await fetchTopicDetails({
        signal: controller.signal,
        accesstoken,
        topic_id,
        mdrender: false,
      });

      if (isCancel.current) {
        return;
      }

      if (data) {
        const { replies, ...rest } = data;

        setStatus('success');
        setTopic(rest);
        setReplies(replies);
      } else if (err_msg) {
        setStatus('error');
        setMessage(err_msg);
      }
    })();

    return () => {
      isCancel.current = true;
      controller.abort();
    };
  }, [topic_id, accesstoken]);

  return (
    <AppFrame
      title={topic.title}
      bodyAttributes={{
        class: clsx('topic-view', {
          'error-tips': status === 'error',
          'zero-spacings': isWidthDownSm,
        }),
      }}
    >
      <div id="container">
        <Fade in={Boolean(message)}>
          <div className="wrapper tips error">{message}</div>
        </Fade>

        {Boolean(topic.title) && (
          <div
            id="topic"
            className={clsx('wrapper', {
              dark: theme.palette.mode === 'dark',
            })}
          >
            <div className="topic-main">
              <Typography className="title" variant="h5">
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
                    {dayjs(topic.create_at).fromNow()}
                  </span>
                  <span className="attr-visit">
                    <ViewIcon />
                    <em>{topic.visit_count}</em>
                    浏览
                  </span>
                  {topic.tab && (
                    <span className="attr-tab">
                      <TagIcon />
                      <span className={topic.tab}>
                        {navTabs[topic.tab as RCNode.CNodeTab].name}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="markdown-container">
                <MarkdownRender markdownSource={topic.content} />
              </div>
            </div>

            {Boolean(replies.length) && (
              <div className="topic-replies">
                {replies.map((item: any, index: number) => (
                  <TopicReply
                    key={item.id}
                    post={index + 1}
                    item={item}
                    topicAuthor={topic.author.loginname}
                    onReply={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                      handleReply(event, item);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="status wrapper">
          <Progress className="mini" status={status} />
        </div>
      </div>

      {isAuthed && (
        <React.Fragment>
          <TopicActions
            visible={!editor.open && topic.author}
            create={signedUname === topic.author?.loginname}
            favorite={Boolean(topic.is_collect)}
            notificationOpen={notification.open}
            onUpdate={handleUpdate}
            onReply={handleReply}
            onShare={handleShare}
            onFavorite={handleFavorite}
          />
          <Editor
            {...editor}
            onChange={(data) => {
              setEditor((prevState) => ({ ...prevState, ...data }));
            }}
            onSubmit={handleSubmit}
            onClose={() => {
              setEditor((prevState) => ({ ...prevState, open: false }));
            }}
          />
        </React.Fragment>
      )}

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
    </AppFrame>
  );
};

export default Topic;
