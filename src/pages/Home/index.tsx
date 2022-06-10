import React from 'react';
import { useLocation } from 'react-router-dom';

import { createTopic, fetchTopicList } from '@/api';
import { TopicCards } from '@/components/Card';
import Editor from '@/components/Editor';
import Notification from '@/components/Notification';
import Progress, { ProgressStatus } from '@/components/Progress';
import TopicActions from '@/components/TopicActions';
import { useLoadmore } from '@/hooks';
import { AppFrame } from '@/layout';
import { matchTab } from '@/router';
import { useSelector } from '@/store';

const Home = () => {
  const loadmore = useLoadmore();
  const { search } = useLocation();
  const { isAuthed, accesstoken } = useSelector((state) => state.auth);

  const isFetching = React.useRef<boolean>(false);
  const isFetched = React.useRef<boolean>(false);
  const isCancel = React.useRef<boolean>(false);
  const page = React.useRef<number>(1);

  const [tab, setTab] = React.useState<undefined | RCNode.CNodeTab>(undefined);
  const [topics, setTopics] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState<ProgressStatus>('idle');

  const [editor, setEditor] = React.useState<RCNode.EditorBasic>({
    open: false,
    action: 'create',
  });
  const [notification, setNotification] = React.useState<RCNode.Notification>({
    open: false,
    status: 'success',
    message: '',
  });

  const handleSubmit = async () => {
    isCancel.current = false;
    const { data, err_msg } = await createTopic({
      accesstoken,
      tab: editor.topicTab as string,
      title: editor.title as string,
      content: editor.content as string,
    });

    if (isCancel.current) {
      return;
    }

    if (data) {
      setTopics((prevState) => [data, ...prevState]);
      setEditor((prevState) => ({ ...prevState, open: false }));
    }

    setNotification((prevState) => ({
      ...prevState,
      open: true,
      status: data ? 'success' : 'error',
      message: data ? '发布成功 ^_^' : err_msg || '发布失败 :(',
    }));
  };

  React.useEffect(() => {
    isFetching.current = false;
    isFetched.current = false;
    page.current = 1;

    setTopics([]);
    setTab(matchTab({ search }));
  }, [search]);

  React.useEffect(() => {
    if (!tab || isFetching.current || (isFetched.current && !loadmore)) {
      return;
    }

    isCancel.current = false;
    const controller = new AbortController();

    (async () => {
      isFetching.current = true;
      setStatus('loading');

      const { data } = await fetchTopicList({
        signal: controller.signal,
        tab,
        page: page.current,
        limit: 20,
        // limit: isFetched.current ? 1 : 20,
        mdrender: true,
      });

      if (isCancel.current) {
        return;
      }

      if (data) {
        setTopics((prevState) => (isFetched.current ? [...prevState, data] : [data]));
        setStatus('success');
        isFetched.current = true;
        page.current += 1;
      } else {
        setStatus('error');
      }

      isFetching.current = false;
    })();

    return () => {
      isFetching.current = false;
      isCancel.current = true;
      controller.abort();
    };
  }, [tab, loadmore]);

  return (
    <AppFrame>
      <div id="container">
        <div className="wrapper">
          <div className="topic-list-container">
            {topics.map((items, index) => (
              <TopicCards key={index} items={items} />
            ))}
          </div>
        </div>

        <div className="status wrapper">
          <Progress status={status} />
        </div>
      </div>

      {isAuthed && (
        <React.Fragment>
          <TopicActions
            single
            visible={!editor.open}
            notificationOpen={notification.open}
            onCreate={() => {
              setEditor((prevState) => ({ ...prevState, open: true }));
            }}
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

      <Notification
        {...notification}
        onClose={() => {
          setNotification((prevState) => ({ ...prevState, open: false }));
        }}
      />
    </AppFrame>
  );
};

export default Home;
