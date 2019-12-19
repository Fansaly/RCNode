import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  matchTab,
  getNewDataCreate,
} from '../../common';
import { get as getData } from '../../fetch';

import { AppWrapper } from '../../Layout';
import TopiCards from '../../Components/TopiCards';
import Progress from '../../Components/Progress';
import ActionDial from '../../Components/ActionDial';
import Notification from '../../Components/Notification';
import Editor from '../../Components/Editor';
import useLoadmore from '../../Components/useLoadmore';

const Home = () => {
  const isFetching = React.useRef(false);
  const isFetched = React.useRef(false);
  const isCancel = React.useRef();
  const page = React.useRef(1);
  const { pathname, search } = useLocation();

  const [tab, setTab] = React.useState(null);
  const [topics, setTopics] = React.useState([]);
  const [status, setStatus] = React.useState('idle');
  const loadmore = useLoadmore();

  const fetchTopics = React.useCallback(async options => {
    isFetching.current = true;
    setStatus('loading');

    const params = {
      url: '/topics',
      params: {
        tab: options.tab,
        page: page.current,
        limit: 20,
        // limit: isFetched.current ? 1 : 20,
        mdrender: true,
      },
    };

    const { success, data } = await getData(params);

    if (isCancel.current) {
      return;
    }

    if (success) {
      setTopics(prevState => (isFetched.current ? [ ...prevState, data ] : [data]));
      setStatus('success');
      isFetched.current = true;
      page.current += 1;
    } else {
      setStatus('error');
    }

    isFetching.current = false;
  }, []);

  React.useEffect(() => {
    isFetching.current = false;
    isFetched.current = false;
    page.current = 1;

    setTopics([]);
    setTab(matchTab({pathname, search}));
  }, [pathname, search]);

  React.useEffect(() => {
    if (tab === null || isFetching.current || (isFetched.current && !loadmore)) {
      return;
    }

    isCancel.current = false;

    fetchTopics({ tab });

    return () => {
      isFetching.current = false;
      isCancel.current = true;
    };
  }, [tab, loadmore, fetchTopics]);

  const editorData = useSelector(state => state.editor);

  React.useEffect(() => {
    const newDataCreate = getNewDataCreate(editorData);
    newDataCreate && setTopics(prevState => ([ newDataCreate, ...prevState ]));
  }, [editorData]);

  return (
    <AppWrapper>
      <div id="container">
        <div className="wrapper">
          <div className="topic-list-container">
            {topics.map((items, index) => (
              <TopiCards key={index} items={items} />
            ))}
          </div>
        </div>

        <div className="status wrapper">
          <Progress status={status} />
        </div>
      </div>

      <ActionDial single />
      <Editor />
      <Notification />
    </AppWrapper>
  );
};

export default Home;
