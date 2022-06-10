export const cnodeURL = 'cnodejs.org';

export const cnodePath = {
  tab: {
    all: { name: '全部', path: '/', isTopicTab: false },
    good: { name: '精华', path: '/?tab=good', isTopicTab: false },
    share: { name: '分享', path: '/?tab=share', isTopicTab: true },
    ask: { name: '问答', path: '/?tab=ask', isTopicTab: true },
    job: { name: '招聘', path: '/?tab=job', isTopicTab: true },
    dev: { name: '测试', path: '/?tab=dev', isTopicTab: true },
    ...(import.meta.env && import.meta.env.DEV
      ? { test: { name: 'TEST', path: '/test', isTopicTab: false } }
      : {}),
  },
  topic: { name: '主题', path: '/topic' },
  user: { name: '用户', path: '/user' },
};
