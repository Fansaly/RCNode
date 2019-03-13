import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line
  console.log(store.getState());

  store.subscribe(() =>
    // eslint-disable-next-line
    console.log(store.getState())
  );
}

export default store;
