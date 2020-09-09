// a constant witch holds the project Store

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import projectReducer from './reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const middlewares = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  projectReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
