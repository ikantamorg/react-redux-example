import { combineReducers } from 'redux';

import email from './email';
import contract from './contract';

export default combineReducers({
  email,
  contract,
});
