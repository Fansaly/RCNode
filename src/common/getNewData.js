import _ from 'lodash';

const isGoBack = ({ open, response = {} }) => {
  return open || _.isEmpty(response);
};

const getNewDataCreate = ({ action, ...props }) => {
  if (isGoBack(props) || action !== 'create') {
    return null;
  }

  const dtime = new Date();
  const { uid, uname, avatar } = props;
  const { tab, title, content } = props.request;
  const { topic_id: id } = props.response;

  return [{
    author: {
      loginname: uname,
      avatar_url: avatar,
    },
    author_id: uid,
    id,
    tab,
    title,
    content,
    create_at: dtime,
    last_reply_at: dtime,
    reply_count: 0,
    visit_count: 0,
    good: false,
    top: false,
  }];
};

const getNewDataUpdate = ({ action, ...props }) => {
  if (isGoBack(props) || action !== 'update') {
    return null;
  }

  const { tab, title, content } = props.request;

  return { tab, title, content };
};

const getNewDataReply = ({ action, ...props }) => {
  if (isGoBack(props) || action !== 'reply') {
    return null;
  }

  const { uname, avatar } = props;
  const { content, reply_id } = props.request;
  const { reply_id: id } = props.response;
  const { topic_id } = props.match.params;

  return {
    author: {
      loginname: uname,
      avatar_url: avatar,
    },
    id,
    ups: [],
    is_uped: false,
    create_at: new Date(),
    content,
    reply_id: reply_id !== topic_id ? reply_id : null,
  };
};

export {
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
};
