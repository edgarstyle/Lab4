import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import resultReducer from './reducers/resultReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  results: resultReducer
});

export const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};

