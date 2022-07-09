export const cnodeURL = 'cnodejs.org';

export const cnodePath = {
  tab: {
    all: { name: '全部', path: '/' },
    good: { name: '精华', path: '/?tab=good' },
    share: { name: '分享', path: '/?tab=share', isTopicTab: true },
    ask: { name: '问答', path: '/?tab=ask', isTopicTab: true },
    job: { name: '招聘', path: '/?tab=job', isTopicTab: true },
    dev: { name: '测试', path: '/?tab=dev', isTopicTab: true },
    ...(import.meta.env && import.meta.env.DEV
      ? { test: { name: 'TEST', path: '/test' } }
      : {}),
  },
  topic: { name: '主题', path: '/topic' },
  user: { name: '用户', path: '/user' },
};

type PickBoolean<T = Record<string, never>> = {
  [K in keyof T as T[K] extends boolean ? K : never]: T[K];
};
type IsTopicTab<T = Record<string, never>> = keyof PickBoolean<T> extends never
  ? never
  : boolean;
type PickTopicTab<T = Record<string, never>> = {
  [K in keyof T as IsTopicTab<T[K]> extends never ? never : K]: T[K];
};

type Tab = typeof cnodePath.tab;
export type CNodeTab = keyof Tab;
export type TopicTab = keyof PickTopicTab<Tab>;

export interface PathProps {
  name: string;
  path: string;
  isTopicTab?: boolean;
}
