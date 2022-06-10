import { combineReducers } from 'redux';

import auth from './reducers/auth';
import message from './reducers/message';
import settings from './reducers/settings';

const rootReducer = combineReducers({
  auth,
  message,
  settings,
});

export default rootReducer;
