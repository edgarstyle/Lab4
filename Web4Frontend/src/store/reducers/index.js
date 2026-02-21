import { combineReducers } from 'redux';
import authReducer from './authReducer';
import resultReducer from './resultReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  results: resultReducer
});

export default rootReducer;

