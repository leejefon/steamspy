import { combineReducers } from 'redux-immutable';
import data from './DataReducer';
import uiReducer from './UiReducer';

export default combineReducers({
  data,
  uiReducer
});
