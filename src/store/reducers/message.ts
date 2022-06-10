import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

export const message = createSlice({
  name: 'message',
  initialState,
  reducers: {
    read: (state) => {
      let { count } = state;
      count = Math.max(--count, 0);
      Object.assign(state, { count });
    },
    readAll: (state) => {
      Object.assign(state, initialState);
    },
    update: (state, action: PayloadAction<State>) => {
      Object.assign(state, action.payload);
    },
    clean: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { read, readAll, update, clean } = message.actions;
export default message.reducer;
