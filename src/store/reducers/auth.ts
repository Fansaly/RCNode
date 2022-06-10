import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AUTH } from '@/config';
import { uuidValidate } from '@/utils';

const defaultState: RCNode.AuthState = {
  isAuthed: false,
  accesstoken: undefined,
  avatar: undefined,
  uname: undefined,
  uid: undefined,
};

const initialState = (() => {
  let state;

  try {
    state = JSON.parse(localStorage.getItem(AUTH) || 'null');
    state = {
      ...state,
      isAuthed: Boolean(state) && uuidValidate(state.accesstoken),
    };
  } catch (e) {
    state = {};
  }

  return Object.assign({}, defaultState, state);
})();

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<RCNode.AuthState>) => {
      localStorage.setItem(
        AUTH,
        JSON.stringify({
          ...state,
          ...action.payload,
        }),
      );
      Object.assign(state, action.payload);
    },
    clean: (state) => {
      localStorage.removeItem(AUTH);
      Object.assign(state, defaultState);
    },
  },
});

export const { update, clean } = auth.actions;
export default auth.reducer;
