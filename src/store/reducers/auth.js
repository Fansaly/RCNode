import { validateUUID } from '../../common';

const defaultState = {
  accesstoken: undefined,
  avatar: undefined,
  uname: undefined,
  uid: undefined,
  isAuthed: false,
};

let initialState = JSON.parse(localStorage.getItem('AUTH'));

if (initialState !== null && validateUUID(initialState.accesstoken)) {
  initialState = {
    ...initialState,
    isAuthed: true,
  };
} else {
  initialState = defaultState;
}

const auth = (state = initialState, { type, data }) => {
  switch (type) {
    case 'UPDATE_AUTH':
      const { isAuthed, ...other } = data;
      localStorage.setItem('AUTH', JSON.stringify({
        ...other,
      }));
      return { ...data };
    case 'DELETE_AUTH':
      localStorage.removeItem('AUTH');
      return defaultState;
    default:
      return state;
  }
};

export default auth;
