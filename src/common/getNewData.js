const getNewDataCreate = props => {
  const {
    open,
    action,
    response,
    request,
    uid,
    uname,
    avatar,
  } = props;

  if (!open && response && action === 'create') {
    const { tab, title, content } = request;
    const { topic_id: id } = response;
    const dtime = new Date();

    return {
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
    };
  }
};

const getNewDataUpdate = props => {
  const {
    open,
    action,
    request,
    response,
  } = props;

  if (!open && response && action === 'update') {
    const { tab, title, content } = request;

    return { tab, title, content };
  }
};

const getNewDataReply = props => {
  const {
    open,
    action,
    response,
    request,
    uname,
    avatar,
    ...other
  } = props;

  if (!open && response && action === 'reply') {
    const { content, reply_id } = request;
    const { reply_id: id } = response;
    const { topic_id } = other.match.params;

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
  }
};

export {
  getNewDataCreate,
  getNewDataUpdate,
  getNewDataReply,
};
