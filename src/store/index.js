import { createStore } from 'redux';
import rootReducer from './reducers';

const store = createStore(rootReducer);

if (process.env.NODE_ENV === 'development') {
  console.log(store.getState());

  store.subscribe(() =>
    console.log(store.getState())
  );
}

export default store;
