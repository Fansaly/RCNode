const routers = {
  tab: {
    all: {
      path: '/',
      name: '全部',
      isTopicType: false,
    },
    good: {
      path: '/?tab=good',
      name: '精华',
      isTopicType: false,
    },
    share: {
      path: '/?tab=share',
      name: '分享',
      isTopicType: true,
    },
    ask: {
      path: '/?tab=ask',
      name: '问答',
      isTopicType: true,
    },
    job: {
      path: '/?tab=job',
      name: '招聘',
      isTopicType: true,
    },
    dev: {
      path: '/?tab=dev',
      name: '测试',
      isTopicType: true,
    },
  },
  topic: {
    path: '/topic',
    name: '主题',
  },
  user: {
    path: '/user',
    name: '用户',
  },
};

export default routers;
