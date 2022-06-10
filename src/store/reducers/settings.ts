import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SETTINGS } from '@/config';
import { omit } from '@/utils';

interface State {
  theme: 'light' | 'dark';
  autoFollow: boolean;
  cardPreview: boolean;
  renderHTML: boolean;
  time: number;
}

const defaultState: State = {
  theme: 'light',
  autoFollow: true,
  cardPreview: false,
  renderHTML: true,
  time: 0,
};

const initialState = (() => {
  let state;

  try {
    state = JSON.parse(localStorage.getItem(SETTINGS) || 'null');
  } catch (e) {
    state = {};
  }

  return Object.assign({}, defaultState, state);
})();

export const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleRenderHTML: (state) => {
      const renderHTML = !state.renderHTML;
      localStorage.setItem(SETTINGS, JSON.stringify({ ...state, renderHTML }));
      Object.assign(state, { renderHTML });
    },
    update: (state, action: PayloadAction<State>) => {
      const payload = omit(action.payload, 'renderHTML');
      localStorage.setItem(SETTINGS, JSON.stringify({ ...state, ...payload }));
      Object.assign(state, payload);
    },
    restore: (state) => {
      localStorage.removeItem(SETTINGS);
      Object.assign(state, defaultState);
    },
  },
});

export const { toggleRenderHTML, update, restore } = settings.actions;
export default settings.reducer;
