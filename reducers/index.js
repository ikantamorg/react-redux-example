import { combineReducers } from 'redux';

import newInvoice from './invoices/new';
import customers from './customers';
import onboarding from './onboarding';
import myProfile from './my_profile';

export default combineReducers({
  newInvoice,
  customers,
  onboarding,
  myProfile,
});
