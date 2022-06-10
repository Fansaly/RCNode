import store from '@/store';
import { fetch, omit } from '@/utils';

import { Topic } from './type';

export const fetchTopicList = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  tab?: string;
  page: number;
  limit: number;
  mdrender?: boolean;
}) => {
  return fetch<Topic[]>({
    signal,
    method: 'GET',
    url: '/topics',
    params: payload,
  });
};

export const fetchTopicDetails = async ({
  signal,
  topic_id,
  ...payload
}: {
  signal?: AbortSignal;
  topic_id: string;
  mdrender?: boolean;
  accesstoken?: string;
}) => {
  return fetch<Topic>({
    signal,
    method: 'GET',
    url: `/topic/${topic_id}`,
    params: payload,
  });
};

export const createTopic = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  tab: string;
  title: string;
  content: string;
}) => {
  const { topic_id, ...res } = await fetch<any, { topic_id: string }>({
    signal,
    method: 'POST',
    url: '/topics',
    data: payload,
  });

  if (!topic_id) {
    return res;
  }

  const time = new Date();
  const { auth } = store.getState();
  return {
    ...res,
    data: [
      {
        ...omit(payload, 'accesstoken'),
        author: {
          loginname: auth.uname,
          avatar_url: auth.avatar,
        },
        author_id: auth.uid,
        id: topic_id,
        create_at: time,
        last_reply_at: time,
        reply_count: 0,
        visit_count: 0,
        good: false,
        top: false,
      },
    ],
  };
};

export const updateTopic = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  tab: string;
  title: string;
  content: string;
  topic_id: string;
}) => {
  return await fetch<any, { topic_id: string }>({
    signal,
    method: 'POST',
    url: '/topics/update',
    data: payload,
  });
};

export const collectTopic = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  topic_id: string;
}) => {
  return await fetch({
    signal,
    method: 'POST',
    url: '/topic_collect/collect',
    data: payload,
  });
};

export const decollectTopic = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  topic_id: string;
}) => {
  return await fetch({
    signal,
    method: 'POST',
    url: '/topic_collect/de_collect',
    data: payload,
  });
};

export const replyTopic = async ({
  signal,
  topic_id,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  topic_id: string;
  reply_id: string;
  content: string;
}) => {
  const { reply_id, ...res } = await fetch<any, { reply_id: string }>({
    signal,
    method: 'POST',
    url: `/topic/${topic_id}/replies`,
    data: payload,
  });

  if (!reply_id) {
    return res;
  }

  const time = new Date();
  const { auth } = store.getState();
  return {
    ...res,
    data: {
      ...omit(payload, 'accesstoken'),
      author: {
        loginname: auth.uname,
        avatar_url: auth.avatar,
      },
      id: reply_id,
      ups: [],
      is_uped: false,
      create_at: time,
      reply_id: reply_id !== topic_id ? reply_id : null,
    },
  };
};

export const upTopic = async ({
  signal,
  reply_id,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  reply_id: string;
}) => {
  return await fetch<any, { action: 'down' | 'up' }>({
    signal,
    method: 'POST',
    url: `/reply/${reply_id}/ups`,
    data: payload,
  });
};
