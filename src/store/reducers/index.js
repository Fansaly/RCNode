import { combineReducers } from 'redux';
import auth from './auth';
import share from './share';
import editor from './editor';
import notification from './notification';
import settings from './settings';
import colors from './colors';

const rootReducer = combineReducers({
  auth,
  share,
  editor,
  notification,
  settings,
  colors,
});

export default rootReducer;
