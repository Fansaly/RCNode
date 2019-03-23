import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';

let middlewares = [];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');

  middlewares = [ ...middlewares, createLogger() ];
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares),
);

export default store;
