import { combineReducers } from 'redux';
import auth from './auth';
import share from './share';
import editor from './editor';
import notification from './notification';
import colors from './colors';

const rootReducer = combineReducers({
  auth,
  share,
  editor,
  notification,
  colors,
});

export default rootReducer;
