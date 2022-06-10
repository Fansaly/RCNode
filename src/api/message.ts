import { fetch } from '@/utils';

import { Message } from './type';

export const fetchUnreadMessageCount = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
}) => {
  return fetch<number>({
    signal,
    method: 'GET',
    url: '/message/count',
    params: payload,
  });
};

export const fetchMessages = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  mdrender?: boolean;
}) => {
  return fetch<{ has_read_messages: Message[]; hasnot_read_messages: Message[] }>({
    signal,
    method: 'GET',
    url: '/messages',
    params: payload,
  });
};

export const markAllMessage = async ({
  signal,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
}) => {
  return fetch<any, { marked_msgs: Array<{ id: string }> }>({
    signal,
    method: 'POST',
    url: '/message/mark_all',
    data: payload,
  });
};

export const markSingleMessage = async ({
  signal,
  msg_id,
  ...payload
}: {
  signal?: AbortSignal;
  accesstoken: string;
  msg_id: string;
}) => {
  return fetch<any, { marked_msg_id: string }>({
    signal,
    method: 'POST',
    url: `/message/mark_one/${msg_id}`,
    data: payload,
  });
};
