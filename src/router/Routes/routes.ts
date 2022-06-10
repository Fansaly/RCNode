import React from 'react';

import NotFound from '@/pages/404';

let Test = NotFound;

if (import.meta.env.DEV) {
  Test = React.lazy(() => import('@/pages/Test'));
}

const originalRoutes: RCNode.RouteProps[] = [
  {
    path: '*',
    element: NotFound,
    meta: { title: '404' },
  },
  {
    path: '/',
    element: React.lazy(() => import('@/pages/Home')),
    meta: { title: 'RCNode' },
  },
  {
    path: '/topic/:topic_id',
    element: React.lazy(() => import('@/pages/Topic')),
    meta: { title: '主题' },
  },
  {
    path: '/user/:uname',
    element: React.lazy(() => import('@/pages/User')),
    meta: { title: '用户' },
  },
  {
    path: '/signin',
    element: React.lazy(() => import('@/pages/Signin')),
    meta: { title: '登录' },
  },
  {
    path: '/settings',
    element: React.lazy(() => import('@/pages/Settings')),
    meta: { title: '设置' },
  },
  {
    path: '/test',
    element: Test,
    meta: { title: 'TEST' },
  },
];

export const standRoutes: RCNode.RouteProps[] = [
  {
    path: '/message',
    element: React.lazy(() => import('@/pages/Message')),
    meta: { title: '消息', auth: true },
  },
];

export default originalRoutes;
