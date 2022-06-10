import { fetch } from '@/utils';

import { Topic, User, UserInfo } from './type';

export const signin = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
}) => {
  return fetch<any, User>({
    signal,
    method: 'POST',
    url: '/accesstoken',
    data: payload,
  });
};

export const fetchUserInfo = async ({
  signal,
  loginname,
  ...payload
}: {
  signal?: AbortSignal;
  loginname: string;
  mdrender?: boolean;
}) => {
  return fetch<UserInfo>({
    signal,
    method: 'GET',
    url: `/user/${loginname}`,
    params: payload,
  });
};

export const fetchUserCollectTopics = async ({
  signal,
  loginname,
  ...payload
}: {
  signal?: AbortSignal;
  loginname: string;
  mdrender?: boolean;
}) => {
  return fetch<Topic[]>({
    signal,
    method: 'GET',
    url: `/topic_collect/${loginname}`,
    params: payload,
  });
};
