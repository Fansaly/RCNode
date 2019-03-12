import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import editor from './editor';
import share from './share';
import zoom from './zoom';
import notification from './notification';
import settings from './settings';
import colors from './colors';

const rootReducer = combineReducers({
  auth,
  message,
  editor,
  share,
  zoom,
  notification,
  settings,
  colors,
});

export default rootReducer;
