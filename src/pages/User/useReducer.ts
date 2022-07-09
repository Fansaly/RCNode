import React from 'react';

const initialState = {
  topics: {
    name: '最近创建',
    show: true,
    data: [],
  },
  replies: {
    name: '最近回复',
    show: false,
    data: [],
  },
  collections: {
    name: '话题收藏',
    show: false,
    data: [],
  },
};

export const keys = Object.keys(initialState) as Key[];

type Key = keyof typeof initialState;

type Data = {
  readonly name?: string;
  show?: boolean;
  data?: any[];
};
type State = {
  [key in Key]?: Data;
};
type Action = {
  readonly type: string;
  payload?: Data;
};

export const useReducer = () => {
  return React.useReducer<React.Reducer<State, Action>>((state, { type, payload }) => {
    switch (type) {
      case 'SET_TOPICS':
        return {
          ...state,
          topics: {
            ...state.topics,
            ...payload,
          },
        };
      case 'SET_REPLIES':
        return {
          ...state,
          replies: {
            ...state.replies,
            ...payload,
          },
        };
      case 'SET_COLLECTIONS':
        return {
          ...state,
          collections: {
            ...state.collections,
            ...payload,
          },
        };
      case 'RESTORE':
        return {
          ...initialState,
        };
      default:
        throw new Error(`Unrecognized type ${type}`);
    }
  }, initialState);
};
